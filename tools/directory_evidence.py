#!/usr/bin/env python3
"""Declarix's offline adapter for Agent SEO authority/monitoring. Stdout only."""
import argparse
from collections import Counter
from datetime import date, datetime, timezone
import hashlib
import json
from pathlib import Path
from urllib.parse import urlsplit

FIELDS = {"name", "website", "address", "city", "phone", "hours"}
FOLLOW_UP = {"submitted", "pending_review", "pending_email", "live"}


def digest(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, separators=(",", ":"),
                                     ensure_ascii=False).encode()).hexdigest()


def require(condition, message):
    if not condition:
        raise ValueError(message)


def iso_day(value):
    require(isinstance(value, str), "date must be YYYY-MM-DD")
    parsed = date.fromisoformat(value)
    require(parsed.isoformat() == value, "date must be YYYY-MM-DD")
    return parsed


def timestamp(value):
    parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    require(parsed.tzinfo is not None, "timestamp needs a timezone")
    return parsed.astimezone(timezone.utc)


def unique(items):
    require(isinstance(items, list), "records must be a list")
    result = {}
    for item in items:
        key = item["id"]
        require(isinstance(key, str) and key and key not in result, "duplicate/empty id")
        result[key] = item
    return result


def summary(pack):
    require(pack["product"] == "Declarix", "wrong product; never mix execution")
    rows = unique(pack["rows"])
    decisions = unique(pack["decisions"])
    for row in rows.values():
        require(type(row["attempts"]) is int and row["attempts"] >= 0,
                "attempt count must be a nonnegative integer")
    return {"row_count": len(rows), "statuses": dict(sorted(Counter(
        r["status"] for r in rows.values()).items())),
        "recorded_attempts": sum(r["attempts"] for r in rows.values()),
        "recorded_live_urls": sum(bool(r.get("live_url")) for r in rows.values()),
        "decision_statuses": {key: row["status"] for key, row in decisions.items()}}


def reconcile(legacy, current):
    """Current custody is selected explicitly by the caller, not by newest timestamp."""
    before, after = summary(legacy), summary(current)
    old_rows, new_rows = unique(legacy["rows"]), unique(current["rows"])
    old_dec, new_dec = unique(legacy["decisions"]), unique(current["decisions"])
    return {"product": "Declarix", "legacy": before, "current": after,
            "same_row_ids": set(old_rows) == set(new_rows),
            "row_records_changed": sorted(k for k in old_rows.keys() & new_rows.keys()
                                          if old_rows[k] != new_rows[k]),
            "decision_records_changed": sorted(k for k in old_dec.keys() | new_dec.keys()
                                               if old_dec.get(k) != new_dec.get(k)),
            "interpretation": "saved tracker records only; not a global listing inventory",
            "external_action_authorized": False}


def followups(pack, as_of, limit=5):
    summary(pack)
    require(type(limit) is int and 1 <= limit <= 10, "limit must be 1..10")
    today = iso_day(as_of)
    due = []
    for row in pack["rows"]:
        if row["status"] not in FOLLOW_UP:
            continue
        value = row.get("next_check")
        state = "missing_date" if not value else "scheduled"
        if value:
            try:
                day = iso_day(value)
                state = "overdue" if day < today else "due" if day == today else "scheduled"
            except (ValueError, TypeError):
                state = "invalid_date"
        if state != "scheduled":
            due.append({"id": row["id"], "state": state,
                        "next_check": value or None,
                        "next_step": "inspect saved receipt; propose one read-only public check; never resubmit"})
    due.sort(key=lambda r: (r["next_check"] or "", r["id"]))
    return {"as_of": as_of, "total_needing_review": len(due), "queue": due[:limit],
            "deferred_count": max(0, len(due) - limit), "external_action_authorized": False,
            "schedule_created": False}


def capture_bytes(root, relative):
    require(isinstance(relative, str) and relative, "missing capture path")
    name = Path(relative)
    require(not name.is_absolute() and ".." not in name.parts, "capture must stay in evidence folder")
    path = (root / name).resolve()
    require(path.is_relative_to(root.resolve()), "capture symlink escapes evidence folder")
    return path.read_bytes()


def inspect(packet, root, as_of, max_age_days=30):
    require(packet["product"] == "Declarix", "wrong product; never mix execution")
    require(type(max_age_days) is int and 1 <= max_age_days <= 90, "freshness must be 1..90 days")
    today = iso_day(as_of)
    approved = packet["approved_facts"]
    require(bool(approved["revision"]), "approved facts need a revision")
    require(set(approved["fields"]) <= FIELDS, "unsupported business field")
    for fact in approved["fields"].values():
        require(fact["state"] in {"approved", "unknown", "not_provided"}, "bad fact state")
        if fact["state"] == "approved":
            require(isinstance(fact.get("value"), str) and bool(fact["value"].strip()),
                    "approved fact needs a value")
    reviews = unique(packet.get("reviews", []))
    observations = unique(packet["observations"])
    output = []
    for key, obs in observations.items():
        require(set(obs["fields"]) <= FIELDS, "unsupported observed field")
        url = urlsplit(obs["url"])
        require(url.scheme == "https" and bool(url.netloc) and not url.username and not url.password,
                "listing URL must be HTTPS without credentials")
        captured = timestamp(obs["captured_at"])
        require(captured.date() <= today, "capture is in the future")
        require(obs["listing_state"] in {"present", "missing", "gated", "unavailable", "unknown"},
                "bad listing state")
        require(obs.get("indexation", "unknown") == "unknown",
                "this offline adapter cannot verify search-engine indexation; keep it unknown")
        body_hash = hashlib.sha256(capture_bytes(root, obs["capture"])).hexdigest()
        require(body_hash == obs["sha256"], "capture digest mismatch; recollect without overwriting old review")
        # Includes URL, page bytes, time, all extracted fields, link/rel/indexability,
        # listing state and approved-fact revision. Any change needs a fresh review.
        evidence_key = digest({"approved_facts": approved, "observation": obs})
        review = reviews.get(key)
        review_state = "pending"
        if review:
            require(review["decision"] in {"accepted", "needs_correction", "rejected"}, "bad review decision")
            reviewed_at = timestamp(review["reviewed_at"])
            require(reviewed_at.date() <= today and bool(review["reviewed_by"].strip()),
                    "review needs a real reviewer and non-future time")
            review_state = "current" if (review["evidence_key"] == evidence_key
                                         and reviewed_at >= captured) else "stale"
        age = (today - captured.date()).days
        freshness = "stale" if age > max_age_days else "within_window"
        fields = {}
        for field in sorted(FIELDS):
            expected = approved["fields"].get(field, {"state": "unknown"})
            observed = obs["fields"].get(field)
            if expected["state"] != "approved":
                fields[field] = "not_provided" if expected["state"] == "not_provided" and not observed else "unknown"
            elif observed is None or observed == "":
                fields[field] = "unobserved"
            else:
                # Exact comparison on purpose: formatting differences need human review.
                fields[field] = "match" if observed == expected["value"] else "conflict"
        conflicts = sorted(field for field, state in fields.items() if state == "conflict")
        output.append({"id": key, "evidence_key": evidence_key, "review_state": review_state,
                       "review_decision": review["decision"] if review_state == "current" else None,
                       "freshness": freshness, "age_days": age, "fields": fields,
                       "conflicts": conflicts,
                       "old_business_conflict_candidate": "name" in conflicts and bool(
                           {"address", "phone", "website"} & set(conflicts)),
                       "listing_state": obs["listing_state"],
                       "link_observation": obs.get("link", {"state": "unknown"}),
                       "indexability": obs.get("indexability", "unknown"),
                       "indexation": obs.get("indexation", "unknown"),
                       "usable_review": review_state == "current" and freshness == "within_window",
                       "next_step": "hold all writes; review conflicts, unknowns and capture-bound observations"})
    return {"product": "Declarix", "as_of": as_of, "observations": output,
            "orphan_review_ids": sorted(set(reviews) - set(observations)),
            "external_action_authorized": False, "business_results": "not_measured"}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)
    rec = commands.add_parser("reconcile")
    rec.add_argument("--legacy", type=Path, required=True)
    rec.add_argument("--current", type=Path, required=True)
    follow = commands.add_parser("followups")
    follow.add_argument("--tracker", type=Path, required=True)
    follow.add_argument("--as-of", required=True)
    follow.add_argument("--limit", type=int, default=5)
    review = commands.add_parser("inspect")
    review.add_argument("--packet", type=Path, required=True)
    review.add_argument("--as-of", required=True)
    review.add_argument("--max-age-days", type=int, default=30)
    args = parser.parse_args()
    load = lambda p: json.loads(p.read_text(encoding="utf-8"))
    try:
        if args.command == "reconcile":
            result = reconcile(load(args.legacy), load(args.current))
        elif args.command == "followups":
            result = followups(load(args.tracker), args.as_of, args.limit)
        else:
            result = inspect(load(args.packet), args.packet.parent, args.as_of, args.max_age_days)
    except (ValueError, KeyError, TypeError, AttributeError, OSError) as error:
        parser.exit(2, f"Invalid evidence: {error}\n")
    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
