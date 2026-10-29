"""Offline only; all business details and HTML are synthetic."""
import copy
from datetime import datetime, timezone
import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / "tools/directory_evidence.py"
SPEC = importlib.util.spec_from_file_location("directory_evidence", SCRIPT)
mod = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(mod)


def pack():
    return {"product": "Declarix", "rows": [
        {"id": "SYN-01", "status": "todo", "attempts": 0, "next_check": "", "live_url": ""}],
        "decisions": [{"id": "D0", "status": "open", "answer": ""}]}


class EvidenceTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.body = b'<html><a href="https://example.invalid" rel="nofollow">Synthetic vendor</a></html>'
        (self.root / "page.html").write_bytes(self.body)
        self.packet = {"product": "Declarix", "approved_facts": {
            "revision": "synthetic-v1", "fields": {
                "name": {"state": "approved", "value": "Synthetic vendor"},
                "website": {"state": "approved", "value": "https://example.invalid"},
                "address": {"state": "approved", "value": "Synthetic registered office"},
                "phone": {"state": "not_provided"}, "hours": {"state": "unknown"}}},
            "observations": [{"id": "SYN-01", "url": "https://directory.invalid/example",
                "capture": "page.html", "sha256": hashlib.sha256(self.body).hexdigest(),
                "captured_at": "2026-10-28T12:00:00Z", "listing_state": "present",
                "fields": {"name": "Synthetic vendor", "website": "https://example.invalid",
                           "address": "Synthetic registered office"},
                "link": {"state": "observed", "href": "https://example.invalid", "rel": "nofollow"},
                "indexability": "no_noindex_observed"}], "reviews": []}

    def inspect(self, packet=None, as_of="2026-10-29"):
        return mod.inspect(packet or self.packet, self.root, as_of)["observations"][0]

    def reviewed(self):
        row = self.inspect()
        self.packet["reviews"] = [{"id": "SYN-01", "evidence_key": row["evidence_key"],
            "decision": "accepted", "reviewed_by": "synthetic reviewer",
            "reviewed_at": "2026-10-28T13:00:00Z"}]

    def test_no_attempts_from_prepared_rows(self):
        result = mod.reconcile(pack(), pack())
        self.assertEqual(result["current"]["recorded_attempts"], 0)
        self.assertFalse(result["external_action_authorized"])

    def test_current_decisions_are_preserved_not_overwritten(self):
        current = pack()
        current["decisions"][0].update(status="answered", answer="synthetic approval")
        before = copy.deepcopy(current)
        result = mod.reconcile(pack(), current)
        self.assertEqual(result["decision_records_changed"], ["D0"])
        self.assertEqual(result["current"]["decision_statuses"], {"D0": "answered"})
        self.assertEqual(before, current)

    def test_wrong_product_rejected(self):
        wrong = pack(); wrong["product"] = "Other product"
        with self.assertRaises(ValueError): mod.reconcile(pack(), wrong)
        self.packet["product"] = "Other product"
        with self.assertRaises(ValueError): self.inspect()

    def test_duplicate_rows_rejected(self):
        p = pack(); p["rows"] *= 2
        with self.assertRaises(ValueError): mod.summary(p)

    def test_negative_or_boolean_attempts_rejected(self):
        for count in [-1, True, "1"]:
            p = pack(); p["rows"][0]["attempts"] = count
            with self.assertRaises(ValueError): mod.summary(p)

    def test_row_inventory_drift_exposed(self):
        current = pack(); current["rows"][0]["id"] = "SYN-02"
        self.assertFalse(mod.reconcile(pack(), current)["same_row_ids"])

    def test_prepared_rows_do_not_create_due_checks(self):
        self.assertEqual(mod.followups(pack(), "2026-10-29")["queue"], [])

    def test_followup_missing_past_today_future_invalid(self):
        p = pack(); p["rows"] = []
        for i, value in enumerate(["", "2026-10-28", "2026-10-29", "2026-11-01", "bad"]):
            p["rows"].append({"id": str(i), "status": "pending_review", "attempts": 1, "next_check": value})
        r = mod.followups(p, "2026-10-29")
        self.assertEqual({x["state"] for x in r["queue"]}, {"missing_date", "overdue", "due", "invalid_date"})
        self.assertFalse(r["schedule_created"])
        self.assertEqual(r["total_needing_review"], 4)

    def test_pending_email_and_live_included(self):
        for status in mod.FOLLOW_UP:
            p = pack(); p["rows"][0]["status"] = status
            self.assertEqual(mod.followups(p, "2026-10-29")["total_needing_review"], 1)

    def test_followup_cap_and_deferred_count(self):
        p = pack(); p["rows"] = [{"id": str(i), "status": "submitted", "attempts": 1} for i in range(12)]
        r = mod.followups(p, "2026-10-29", 5)
        self.assertEqual(len(r["queue"]), 5)
        self.assertEqual(r["deferred_count"], 7)
        for limit in [0, 11, True]:
            with self.assertRaises(ValueError): mod.followups(p, "2026-10-29", limit)

    def test_vendor_matches_and_unknown_fields_separate(self):
        row = self.inspect()
        self.assertEqual(row["fields"]["name"], "match")
        self.assertEqual(row["fields"]["phone"], "not_provided")
        self.assertEqual(row["fields"]["hours"], "unknown")
        self.assertEqual(row["fields"]["city"], "unknown")
        self.assertEqual(row["review_state"], "pending")

    def test_exact_conflicts_include_old_business(self):
        self.packet["observations"][0]["fields"].update(name="Synthetic old business", address="Old synthetic office")
        row = self.inspect()
        self.assertEqual(row["conflicts"], ["address", "name"])
        self.assertTrue(row["old_business_conflict_candidate"])

    def test_missing_observation_not_a_negative_fact(self):
        del self.packet["observations"][0]["fields"]["name"]
        self.assertEqual(self.inspect()["fields"]["name"], "unobserved")

    def test_unknown_phone_not_filled_from_vendor(self):
        self.packet["observations"][0]["fields"]["phone"] = "SYNTHETIC PHONE"
        self.assertEqual(self.inspect()["fields"]["phone"], "unknown")

    def test_indexability_does_not_prove_indexation(self):
        row = self.inspect()
        self.assertEqual(row["indexation"], "unknown")
        self.assertEqual(row["link_observation"]["rel"], "nofollow")

    def test_indexation_claim_requires_separate_evidence(self):
        self.packet["observations"][0]["indexation"] = "indexed"
        with self.assertRaises(ValueError): self.inspect()

    def test_same_capture_retains_human_review(self):
        self.reviewed()
        self.assertEqual(self.inspect()["review_state"], "current")
        self.assertTrue(self.inspect()["usable_review"])

    def test_changed_bytes_without_digest_rejected(self):
        self.reviewed(); (self.root / "page.html").write_bytes(b"different")
        with self.assertRaises(ValueError): self.inspect()

    def test_recollection_keeps_old_review_but_marks_stale(self):
        self.reviewed()
        (self.root / "page.html").write_bytes(b"different")
        self.packet["observations"][0]["sha256"] = hashlib.sha256(b"different").hexdigest()
        before = copy.deepcopy(self.packet["reviews"])
        self.assertEqual(self.inspect()["review_state"], "stale")
        self.assertEqual(before, self.packet["reviews"])
        self.assertIsNone(self.inspect()["review_decision"])

    def test_metadata_or_fact_revision_also_invalidates_review(self):
        for target, key, value in [("obs", "url", "https://directory.invalid/new"),
                                   ("obs", "captured_at", "2026-10-28T12:30:00Z"),
                                   ("obs", "link", {"state": "missing"}),
                                   ("facts", "revision", "synthetic-v2")]:
            with self.subTest(key=key):
                self.setUp(); self.reviewed()
                record = self.packet["observations"][0] if target == "obs" else self.packet["approved_facts"]
                record[key] = value
                self.assertEqual(self.inspect()["review_state"], "stale")

    def test_aged_evidence_not_usable_even_with_same_review(self):
        self.reviewed()
        row = self.inspect(as_of="2026-11-29")
        self.assertEqual(row["review_state"], "current")
        self.assertEqual(row["freshness"], "stale")
        self.assertFalse(row["usable_review"])

    def test_missing_listing_does_not_prove_deletion_or_rejection(self):
        self.packet["observations"][0]["listing_state"] = "unavailable"
        row = self.inspect()
        self.assertEqual(row["listing_state"], "unavailable")
        self.assertEqual(row["indexation"], "unknown")

    def test_future_capture_or_naive_time_rejected(self):
        for value in ["2026-10-30T12:00:00Z", "2026-10-28T12:00:00"]:
            self.packet["observations"][0]["captured_at"] = value
            with self.assertRaises(ValueError): self.inspect()

    def test_review_before_capture_stale(self):
        self.reviewed(); self.packet["reviews"][0]["reviewed_at"] = "2026-10-27T12:00:00Z"
        self.assertEqual(self.inspect()["review_state"], "stale")

    def test_orphan_review_is_not_discarded_silently(self):
        self.reviewed(); self.packet["observations"] = []
        self.assertEqual(mod.inspect(self.packet, self.root, "2026-10-29")["orphan_review_ids"], ["SYN-01"])

    def test_capture_path_traversal_and_symlink_rejected(self):
        for value in ["../page.html", "/etc/passwd"]:
            self.packet["observations"][0]["capture"] = value
            with self.assertRaises(ValueError): self.inspect()
        (self.root / "escape").symlink_to("/etc/passwd")
        self.packet["observations"][0]["capture"] = "escape"
        with self.assertRaises(ValueError): self.inspect()

    def test_credentials_in_url_rejected(self):
        self.packet["observations"][0]["url"] = "https://user:secret@directory.invalid"
        with self.assertRaises(ValueError): self.inspect()

    def test_input_packet_not_mutated(self):
        before = copy.deepcopy(self.packet)
        self.inspect()
        self.assertEqual(self.packet, before)

    def test_cli_outputs_json_without_input_writes(self):
        file = self.root / "packet.json"; file.write_text(json.dumps(self.packet))
        before = {p.name: p.read_bytes() for p in self.root.iterdir()}
        r = subprocess.run([sys.executable, str(SCRIPT), "inspect", "--packet", str(file),
                            "--as-of", "2026-10-29"], capture_output=True, text=True, check=True)
        self.assertFalse(json.loads(r.stdout)["external_action_authorized"])
        self.assertEqual(before, {p.name: p.read_bytes() for p in self.root.iterdir()})

    def test_cli_invalid_evidence_fails_closed(self):
        file = self.root / "packet.json"; file.write_text("{}")
        r = subprocess.run([sys.executable, str(SCRIPT), "inspect", "--packet", str(file),
                            "--as-of", "2026-10-29"], capture_output=True, text=True)
        self.assertEqual(r.returncode, 2)
        self.assertFalse(r.stdout)


if __name__ == "__main__":
    unittest.main()
