const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

const displayDate = (value, includeTime = false) => {
  if (!value) return 'NOT STATED'
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...(includeTime ? { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' } : {}),
    timeZone: 'UTC',
  }).format(new Date(value))
}

const stageLabel = (value) => value.replaceAll('_', ' ').toUpperCase()
const recordPath = (recordId) => `/research/cds-operations-radar/${recordId}/`

const sharedReview = {
  state: 'agent_source_verified',
  reviewedAt: '2026-07-17T18:12:00Z',
  reviewerIdentity: 'codex-radar-source-verifier',
  reviewerKind: 'agent',
  reviewerRole: 'primary-source verification agent',
  publicationScope: 'narrow_primary_source_fact',
  editorialAuthorization: 'owner_authorized_build',
  publicationReady: true,
}

export const radarRecords = [
  {
    id: 'cds-service-status-current',
    type: 'service_status',
    label: 'SERVICE STATUS · POINT-IN-TIME',
    title: 'HMRC showed no listed CDS downtime or service issues at 18:08 UTC on 17 July',
    pageTitle: 'CDS service status check — 17 July 2026 | Declarix',
    description:
      'See the source-stamped HMRC CDS service status observed at 18:08 UTC on 17 July 2026, its freshness state, workflow checks and source history.',
    summary:
      "At 18:08 UTC on 17 July 2026, HMRC's CDS availability page showed no planned downtime and no service issues. The page's latest recorded update was 9 July 2026.",
    whyItMatters:
      'This is a useful point-in-time operating signal, not an uptime promise. A later HMRC update can change the position quickly.',
    operatorAction:
      "Check HMRC's live status page before time-critical submissions and keep normal queue, response, and retry monitoring in place.",
    topics: ['cds', 'service-status'],
    impacts: [
      {
        stage: 'service_access',
        impact: 'HMRC listed no active access issue at the observation time.',
        action: 'Continue normal access monitoring and recheck the live source if access fails.',
      },
      {
        stage: 'submission',
        impact: 'HMRC listed no planned CDS submission downtime at the observation time.',
        action: 'Use normal submission controls and confirm the live status before a time-critical run.',
      },
    ],
    effectiveFrom: '2026-07-17T18:08:43Z',
    expiresAt: '2026-07-18T18:08:43Z',
    observedAt: '2026-07-17T18:08:43Z',
    freshUntil: '2026-07-18T18:08:43Z',
    pollHours: 6,
    correction: { status: 'none', note: null, correctionOf: null },
    source: {
      id: 'hmrc_cds_service_status',
      publisher: 'HM Revenue & Customs',
      url: 'https://www.gov.uk/guidance/customs-declaration-service-service-availability-and-issues',
      locator: 'Service availability; Planned downtime; Service issues',
      updatedAt: '2026-07-09T15:20:58Z',
      sha256: 'f121063188b125cf1fe4f1153d0387a5b51f51862832a1e85024b7e8f382f338',
      bytes: 42974,
      mediaType: 'application/json',
      licence: 'Open Government Licence v3.0',
    },
    history: [
      { type: 'created', observedAt: '2026-07-17T10:00:00Z', note: 'Source-backed record created as a gated draft.' },
      { type: 'updated', observedAt: '2026-07-17T18:08:43Z', note: 'Exact response re-observed; narrow source fact cleared for publication.' },
    ],
    related: { href: '/tools/customs-document-pack-check/', label: 'RUN THE FREE PACK CHECK', id: 'pack_checker' },
    review: sharedReview,
  },
  {
    id: 'cds-workarounds-release-5-2-0',
    type: 'workaround_release',
    label: 'KNOWN ERRORS · WORKAROUND RELEASE',
    title: 'HMRC published CDS consolidated workarounds release 5.2.0',
    pageTitle: 'CDS known workarounds release 5.2.0 | Declarix',
    description:
      'Review the source-stamped HMRC CDS known error workarounds release 5.2.0, covered change dates, affected workflow stages and exact source record.',
    summary:
      "HMRC's 4 July update identifies consolidated workaround document 5.2.0 and says its Known Error Log changes cover additions, amendments, and resolutions through 25 June 2026.",
    whyItMatters:
      'Teams troubleshooting a rejected declaration may otherwise rely on an older workaround, a resolved item, or an incomplete change list.',
    operatorAction:
      'Use the current 5.2.0 artifact and its individual change-log tabs to verify the specific error or difference before changing a declaration workflow.',
    topics: ['cds', 'known-errors', 'workarounds'],
    impacts: [
      {
        stage: 'declaration_completion',
        impact: 'The consolidated release may change which HMRC workaround applies to a known rejection or completion mismatch.',
        action: 'Match the exact error or known-difference entry and read its current status and change log.',
      },
      {
        stage: 'submission',
        impact: 'Resolved or amended workaround entries can change the correct resubmission path.',
        action: 'Confirm the entry remains current before resubmitting or changing mapped data.',
      },
    ],
    effectiveFrom: null,
    expiresAt: null,
    observedAt: '2026-07-17T18:08:43Z',
    freshUntil: '2026-07-24T18:08:43Z',
    pollHours: 24,
    correction: { status: 'none', note: null, correctionOf: null },
    source: {
      id: 'hmrc_cds_known_workarounds',
      publisher: 'HM Revenue & Customs',
      url: 'https://www.gov.uk/government/publications/known-error-workarounds-for-the-customs-declaration-service-cds',
      locator: 'Updates to this page: 4 July 2026; consolidated document 5.2.0',
      updatedAt: '2026-07-03T23:15:05Z',
      sha256: '55a064c2be678320d766859771ef1cf1966eeb705c3d2c78c45b9e589a2c3373',
      bytes: 33903,
      mediaType: 'application/json',
      licence: 'Open Government Licence v3.0',
    },
    history: [
      { type: 'created', observedAt: '2026-07-17T10:00:00Z', note: 'Source-backed record created as a gated draft.' },
      { type: 'updated', observedAt: '2026-07-17T18:08:43Z', note: 'Exact response re-observed; narrow source fact cleared for publication.' },
    ],
    related: { href: '/tools/customs-document-pack-check/', label: 'CHECK A DOCUMENT PACK', id: 'pack_checker' },
    review: sharedReview,
  },
  {
    id: 'cds-technical-documentation-2026-07-09',
    type: 'technical_release',
    label: 'SOFTWARE INTEGRATION · TECHNICAL RELEASE',
    title: 'HMRC linked a CDS technical documentation package dated 9 July 2026',
    pageTitle: 'CDS technical documentation — 9 July 2026 | Declarix',
    description:
      'See the HMRC CDS technical documentation package dated 9 July 2026, its source-stamped metadata, integration checks, freshness and change history.',
    summary:
      "HMRC's developer guide linked a 54.4 MB CDS technical documentation package dated 9 July 2026 for Community System Providers and third-party software developers.",
    whyItMatters:
      'A new package can change specifications or test expectations across the CDS declaration lifecycle even when a user-facing status page is green.',
    operatorAction:
      'Diff the package against the previously approved version and route material specification changes through integration tests before release.',
    topics: ['cds', 'software-integration', 'technical-documentation'],
    impacts: [
      {
        stage: 'notifications',
        impact: 'Package changes may affect notification or status-query implementation details.',
        action: 'Include notification and query journeys in the package-diff review and regression suite.',
      },
      {
        stage: 'software_integration',
        impact: 'The dated package is the latest technical-documentation bundle linked by HMRC at capture time.',
        action: 'Record the artifact version and compare technical files before changing an integration.',
      },
    ],
    effectiveFrom: null,
    expiresAt: null,
    observedAt: '2026-07-17T18:08:43Z',
    freshUntil: '2026-07-24T18:08:43Z',
    pollHours: 24,
    correction: { status: 'none', note: null, correctionOf: null },
    source: {
      id: 'hmrc_cds_technical_documentation',
      publisher: 'HM Revenue & Customs',
      url: 'https://developer.service.hmrc.gov.uk/guides/customs-declarations-end-to-end-service-guide/',
      locator: 'Technical Documentation; CDS Technical Documentation package metadata',
      updatedAt: '2026-07-09T00:00:00Z',
      sha256: '042d6f4f8f711e0371d159421d1d483a6bde808a67bfe6c092a7a9ed893f6128',
      bytes: 28765,
      mediaType: 'text/html',
      licence: 'Open Government Licence v3.0',
    },
    history: [
      { type: 'created', observedAt: '2026-07-17T10:00:00Z', note: 'Source-backed record created as a gated draft.' },
      { type: 'updated', observedAt: '2026-07-17T18:08:43Z', note: 'Exact response re-observed; narrow source fact cleared for publication.' },
    ],
    related: { href: '/customs-clearance-software/', label: 'SEE THE DECLARIX WORKFLOW', id: 'clearance_software' },
    review: sharedReview,
  },
  {
    id: 'cds-document-code-9001-uk-india-fta-2026-07-15',
    type: 'code_change',
    label: 'DOCUMENT CODES · REFERENCE DATA',
    title: 'CDS document code 9001 updated for UK-India FTA use from 15 July',
    pageTitle: 'CDS document code 9001 UK-India FTA update | Declarix',
    description:
      'Read the source-stamped HMRC update to CDS national document code 9001 for UK-India FTA use from 15 July 2026, with workflow checks and evidence.',
    summary:
      'HMRC updated national document code 9001 on 13 July to reflect use under the UK-India Free Trade Agreement from 15 July 2026.',
    whyItMatters:
      'Document-code mappings and declaration templates using the new agreement may need a dated update before the code is selected.',
    operatorAction:
      "Review HMRC's current code instruction and the relevant tariff measure before updating templates or selecting code 9001 for a consignment.",
    topics: ['cds', 'data-element-2-3', 'document-codes', 'uk-india-fta'],
    impacts: [
      {
        stage: 'document_codes',
        impact: 'The stated use of national document code 9001 changed for declarations from 15 July 2026.',
        action: 'Update dated code reference data only after reviewing the current HMRC instruction.',
      },
      {
        stage: 'reference_data',
        impact: 'Internal code lists or CMS mappings may not yet reflect the 13 July source update.',
        action: 'Compare the maintained mapping with the official source and test the affected path.',
      },
    ],
    effectiveFrom: '2026-07-15T00:00:00Z',
    expiresAt: null,
    observedAt: '2026-07-17T18:08:43Z',
    freshUntil: '2026-07-20T18:08:43Z',
    pollHours: 24,
    correction: { status: 'none', note: null, correctionOf: null },
    source: {
      id: 'hmrc_cds_de23_national_codes',
      publisher: 'HM Revenue & Customs',
      url: 'https://www.gov.uk/guidance/data-element-23-documents-and-other-reference-codes-national-of-the-customs-declaration-service-cds',
      locator: 'Updates to this page: 13 July 2026; document code 9001',
      updatedAt: '2026-07-13T12:51:20Z',
      sha256: '38b1b44a8528754b5ef0598cd4d810baa8167b32baba950444e76bd7741ebf4e',
      bytes: 55302,
      mediaType: 'application/json',
      licence: 'Open Government Licence v3.0',
    },
    history: [
      { type: 'created', observedAt: '2026-07-17T10:00:00Z', note: 'Source-backed record created as a gated draft.' },
      { type: 'updated', observedAt: '2026-07-17T18:08:43Z', note: 'Exact response re-observed; narrow source fact cleared for publication.' },
    ],
    related: { href: '/tools/customs-document-pack-check/', label: 'CHECK THE SUPPORTING PACK', id: 'pack_checker' },
    review: sharedReview,
  },
  {
    id: 'cds-aggregation-eu-eori-2026-07-04',
    type: 'guidance_change',
    label: 'AGGREGATION · PARTY IDENTIFICATION',
    title: 'HMRC updated CDS aggregation guidance for EU EORIs in specified data elements',
    pageTitle: 'CDS aggregation EU EORI guidance update | Declarix',
    description:
      'Read the HMRC CDS aggregation guidance update for EU EORIs in specified data elements from 4 July 2026, with source evidence and workflow checks.',
    summary:
      "HMRC's 1 July update says Data Element 2/1 was changed to reflect that EU EORIs can be declared in certain data elements from 4 July 2026.",
    whyItMatters:
      'Supplementary-declaration mappings that previously assumed only GB or XI identifiers may reject or mishandle an eligible EU EORI path.',
    operatorAction:
      'Review the current Data Element 2/1 aggregation instruction and test the affected party-identifier mapping before changing production behaviour.',
    topics: ['aggregation', 'cds', 'data-element-2-1', 'eori'],
    impacts: [
      {
        stage: 'party_identification',
        impact: 'Specified aggregated-declaration references can now include an EU EORI from the stated effective date.',
        action: 'Verify the exact eligible data element and identifier format in the current HMRC instruction.',
      },
      {
        stage: 'supplementary_declarations',
        impact: 'Aggregation templates and validation paths may need a dated EU-EORI case.',
        action: 'Add a source-backed EU-EORI test case without broadening unrelated EORI acceptance.',
      },
    ],
    effectiveFrom: '2026-07-04T00:00:00Z',
    expiresAt: null,
    observedAt: '2026-07-17T18:08:43Z',
    freshUntil: '2026-07-24T18:08:43Z',
    pollHours: 24,
    correction: { status: 'none', note: null, correctionOf: null },
    source: {
      id: 'hmrc_cds_aggregation_rules',
      publisher: 'HM Revenue & Customs',
      url: 'https://www.gov.uk/guidance/customs-simplified-procedures-aggregation-rules-for-cds',
      locator: 'Updates to this page: 1 July 2026; Data Element 2/1',
      updatedAt: '2026-06-30T23:15:04Z',
      sha256: '6d2a386563e9a6fe5c2e80ab18aac3ade34a291d0d35e68a18dbee8e0aeb9f5f',
      bytes: 36759,
      mediaType: 'application/json',
      licence: 'Open Government Licence v3.0',
    },
    history: [
      { type: 'created', observedAt: '2026-07-17T10:00:00Z', note: 'Source-backed record created as a gated draft.' },
      { type: 'updated', observedAt: '2026-07-17T18:08:43Z', note: 'Exact response re-observed; narrow source fact cleared for publication.' },
    ],
    related: { href: '/supported-scope/', label: 'CHECK DECLARIX SCOPE', id: 'supported_scope' },
    review: sharedReview,
  },
].map((record) => ({ ...record, path: recordPath(record.id), status: 'current' }))

export const radarHub = {
  path: '/research/cds-operations-radar/',
  title: 'CDS Operations Radar — HMRC changes and status | Declarix',
  description:
    'Search source-stamped HMRC CDS status, workaround, technical documentation, code and aggregation changes with workflow checks, freshness and free data.',
  h1: 'CDS changes, translated into the next check.',
  reviewedOn: '2026-07-17',
}

export const radarRoutes = [
  radarHub,
  ...radarRecords.map((record) => ({
    path: record.path,
    title: record.pageTitle,
    description: record.description,
    h1: record.title,
    reviewedOn: '2026-07-17',
  })),
]

function freshnessState(record, at = new Date('2026-07-17T18:12:00Z')) {
  const now = at.getTime()
  if (record.effectiveFrom && now < Date.parse(record.effectiveFrom)) return 'not_yet_effective'
  if (record.expiresAt && now >= Date.parse(record.expiresAt)) return 'expired'
  if (now > Date.parse(record.freshUntil)) return 'stale'
  return 'current'
}

function freshnessLabel(state) {
  return {
    current: 'CURRENT OBSERVATION',
    stale: 'SOURCE RECHECK DUE',
    expired: 'POINT-IN-TIME RECORD EXPIRED',
    not_yet_effective: 'NOT YET EFFECTIVE',
  }[state]
}

function jsonLdHub(site) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${site.origin}/#organization`,
        name: site.company,
        url: `${site.origin}/`,
      },
      {
        '@type': 'CollectionPage',
        '@id': `${site.origin}${radarHub.path}#collection`,
        url: `${site.origin}${radarHub.path}`,
        name: radarHub.title,
        headline: radarHub.h1,
        description: radarHub.description,
        datePublished: '2026-07-17',
        dateModified: radarHub.reviewedOn,
        isAccessibleForFree: true,
        image: `${site.origin}/og.jpg`,
        publisher: { '@id': `${site.origin}/#organization` },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: radarRecords.length,
          itemListElement: radarRecords.map((record, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: record.title,
            url: `${site.origin}${record.path}`,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.origin}/` },
          { '@type': 'ListItem', position: 2, name: 'CDS Operations Radar', item: `${site.origin}${radarHub.path}` },
        ],
      },
    ],
  }).replaceAll('<', '\\u003c')
}

function jsonLdRecord(record, site) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${site.origin}/#organization`,
        name: site.company,
        url: `${site.origin}/`,
      },
      {
        '@type': 'Article',
        '@id': `${site.origin}${record.path}#article`,
        url: `${site.origin}${record.path}`,
        mainEntityOfPage: `${site.origin}${record.path}`,
        headline: record.title,
        description: record.description,
        datePublished: '2026-07-17',
        dateModified: '2026-07-17',
        inLanguage: 'en-GB',
        isAccessibleForFree: true,
        image: `${site.origin}/og.jpg`,
        author: { '@id': `${site.origin}/#organization` },
        publisher: { '@id': `${site.origin}/#organization` },
        citation: [record.source.url],
        about: record.topics,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.origin}/` },
          { '@type': 'ListItem', position: 2, name: 'CDS Operations Radar', item: `${site.origin}${radarHub.path}` },
          { '@type': 'ListItem', position: 3, name: record.title, item: `${site.origin}${record.path}` },
        ],
      },
    ],
  }).replaceAll('<', '\\u003c')
}

function analyticsScript(posthogKey, posthogHost, recordId = 'hub') {
  const config = JSON.stringify({ posthogKey, posthogHost }).replaceAll('<', '\\u003c')
  return `<script>
    (() => {
      const config = ${config};
      const get = (key) => { try { return sessionStorage.getItem(key) || ''; } catch { return ''; } };
      const set = (key, value) => { try { sessionStorage.setItem(key, value); } catch {} };
      const params = new URLSearchParams(location.search);
      const incoming = { source: params.get('utm_source') || params.get('src') || '', medium: params.get('utm_medium') || '', campaign: params.get('utm_campaign') || '', content: params.get('utm_content') || '', term: params.get('utm_term') || '' };
      Object.entries(incoming).forEach(([key, value]) => { if (value && !get('dclrx-' + key)) set('dclrx-' + key, value); });
      const attribution = Object.fromEntries(Object.keys(incoming).map((key) => [key, get('dclrx-' + key) || (key === 'source' ? 'direct' : 'none')]));
      const distinctId = get('dclrx-distinct-id') || crypto.randomUUID();
      set('dclrx-distinct-id', distinctId);
      const track = (event, properties = {}) => {
        const payload = { ...attribution, ...properties, page_path: location.pathname, radar_record_id: '${recordId}' };
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event, ...payload });
        if (!config.posthogKey) return;
        const body = JSON.stringify({ api_key: config.posthogKey, event, distinct_id: distinctId, properties: payload });
        if (navigator.sendBeacon && navigator.sendBeacon(config.posthogHost + '/capture/', body)) return;
        fetch(config.posthogHost + '/capture/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => null);
      };
      const stateAt = (node) => {
        const now = Date.now();
        const effective = node.dataset.effectiveFrom ? Date.parse(node.dataset.effectiveFrom) : null;
        const expires = node.dataset.expiresAt ? Date.parse(node.dataset.expiresAt) : null;
        const fresh = Date.parse(node.dataset.freshUntil);
        if (effective && now < effective) return 'not_yet_effective';
        if (expires && now >= expires) return 'expired';
        if (now > fresh) return 'stale';
        return 'current';
      };
      const labels = { current: 'CURRENT OBSERVATION', stale: 'SOURCE RECHECK DUE', expired: 'POINT-IN-TIME RECORD EXPIRED', not_yet_effective: 'NOT YET EFFECTIVE' };
      document.querySelectorAll('[data-radar-freshness]').forEach((node) => {
        const state = stateAt(node);
        node.dataset.freshnessState = state;
        const label = node.querySelector('[data-freshness-label]');
        if (label) label.textContent = labels[state];
      });
      document.querySelectorAll('[data-radar-download]').forEach((link) => link.addEventListener('click', () => track('radar_downloaded', { asset_format: link.dataset.radarDownload })));
      document.querySelectorAll('[data-radar-source]').forEach((link) => link.addEventListener('click', () => track('radar_source_opened', { source_id: link.dataset.radarSource })));
      document.querySelectorAll('[data-radar-related]').forEach((link) => link.addEventListener('click', () => track('radar_related_clicked', { destination_id: link.dataset.radarRelated })));
      document.querySelectorAll('[data-radar-booking]').forEach((link) => link.addEventListener('click', () => track('radar_booking_clicked', { placement: link.dataset.radarBooking })));
      document.querySelectorAll('[data-radar-record-link]').forEach((link) => link.addEventListener('click', () => track('radar_record_opened', { destination_id: link.dataset.radarRecordLink })));
      const share = document.querySelector('[data-radar-share]');
      share?.addEventListener('click', async () => {
        try {
          if (navigator.share) await navigator.share({ title: document.title, url: location.href });
          else await navigator.clipboard.writeText(location.href);
          track('radar_shared', { method: navigator.share ? 'native' : 'clipboard' });
          share.textContent = navigator.share ? 'SHARED' : 'LINK COPIED';
        } catch (error) { if (error?.name !== 'AbortError') share.textContent = 'COPY THE URL'; }
      });
      const filterForm = document.querySelector('[data-radar-filters]');
      if (filterForm) {
        const search = filterForm.querySelector('[name="q"]');
        const topic = filterForm.querySelector('[name="topic"]');
        const stage = filterForm.querySelector('[name="stage"]');
        const state = filterForm.querySelector('[name="state"]');
        const count = document.querySelector('[data-radar-result-count]');
        const empty = document.querySelector('[data-radar-empty]');
        const url = new URL(location.href);
        search.value = url.searchParams.get('q') || '';
        topic.value = url.searchParams.get('topic') || 'all';
        stage.value = url.searchParams.get('stage') || 'all';
        state.value = url.searchParams.get('state') || 'all';
        const apply = (shouldTrack = false) => {
          const query = search.value.trim().toLowerCase();
          let visible = 0;
          document.querySelectorAll('[data-radar-result]').forEach((row) => {
            const freshness = row.dataset.freshnessState || stateAt(row);
            const matches = (!query || row.dataset.search.includes(query)) &&
              (topic.value === 'all' || row.dataset.topics.split(' ').includes(topic.value)) &&
              (stage.value === 'all' || row.dataset.stages.split(' ').includes(stage.value)) &&
              (state.value === 'all' || freshness === state.value);
            row.hidden = !matches;
            if (matches) visible += 1;
          });
          count.textContent = visible + (visible === 1 ? ' RECORD' : ' RECORDS');
          empty.hidden = visible !== 0;
          const next = new URL(location.href);
          for (const [key, value] of [['q', search.value.trim()], ['topic', topic.value], ['stage', stage.value], ['state', state.value]]) {
            if (!value || value === 'all') next.searchParams.delete(key); else next.searchParams.set(key, value);
          }
          history.replaceState({}, '', next);
          if (shouldTrack) track('radar_filter_changed', { topic: topic.value, stage: stage.value, freshness_state: state.value, has_query: Boolean(query) });
        };
        filterForm.addEventListener('input', () => apply(true));
        filterForm.addEventListener('change', () => apply(true));
        filterForm.addEventListener('submit', (event) => { event.preventDefault(); apply(true); });
        filterForm.querySelector('[data-radar-clear]').addEventListener('click', () => { search.value = ''; topic.value = 'all'; stage.value = 'all'; state.value = 'all'; apply(true); search.focus(); });
        apply(false);
      }
    })();
  </script>`
}

function masthead(site, navHtml, bookingHref) {
  return `<header class="masthead">
    <a class="wordmark" href="/">DECLARIX</a>
    <div class="masthead-cell"><span>RADAR EDITION</span><strong>17 JUL 2026</strong></div>
    <a class="masthead-cta" data-radar-booking="masthead" href="${bookingHref}">BOOK THE NUMBERS CALL</a>
  </header>
  <nav class="route-nav" aria-label="Primary">${navHtml}</nav>`
}

function shell({ title, description, canonical, schema, css = '/radar.css', body, site, options, recordId = 'hub' }) {
  return `<!doctype html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="index,follow,max-image-preview:large" />
    <meta name="theme-color" content="#16313d" />
    ${options.webmasterHtml}
    <link rel="canonical" href="${canonical}" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="stylesheet" href="/static-routes.css" />
    <link rel="stylesheet" href="/report.css" />
    <link rel="stylesheet" href="${css}" />
    <meta property="og:type" content="${recordId === 'hub' ? 'website' : 'article'}" />
    <meta property="og:site_name" content="Declarix" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${site.origin}/og.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${site.origin}/og.jpg" />
    <title>${escapeHtml(title)}</title>
    <script type="application/ld+json">${schema}</script>
  </head>
  <body>
    <div class="docket radar-docket">${body}</div>
    ${analyticsScript(options.posthogKey, options.posthogHost, recordId)}
  </body>
</html>`
}

function resultRows() {
  return radarRecords
    .map((record) => {
      const state = freshnessState(record)
      const search = [record.title, record.summary, ...record.topics, ...record.impacts.flatMap((impact) => [impact.stage, impact.impact])]
        .join(' ')
        .toLowerCase()
      return `<article class="radar-result" data-radar-result data-radar-freshness data-freshness-state="${state}" data-effective-from="${record.effectiveFrom || ''}" data-expires-at="${record.expiresAt || ''}" data-fresh-until="${record.freshUntil}" data-topics="${record.topics.join(' ')}" data-stages="${record.impacts.map((impact) => impact.stage).join(' ')}" data-search="${escapeHtml(search)}">
        <div class="radar-result-meta"><span>${escapeHtml(record.label)}</span><strong data-freshness-label>${freshnessLabel(state)}</strong></div>
        <div class="radar-result-copy">
          <h2><a href="${record.path}" data-radar-record-link="${record.id}">${escapeHtml(record.title)}</a></h2>
          <p>${escapeHtml(record.summary)}</p>
        </div>
        <div class="radar-result-action"><span>OBSERVED ${escapeHtml(displayDate(record.observedAt, true))}</span><b aria-hidden="true">OPEN RECORD →</b></div>
      </article>`
    })
    .join('')
}

export function renderRadarHub(site, options) {
  const canonical = `${site.origin}${radarHub.path}`
  const topics = [...new Set(radarRecords.flatMap((record) => record.topics))].sort()
  const stages = [...new Set(radarRecords.flatMap((record) => record.impacts.map((impact) => impact.stage)))].sort()
  const booking = '/?src=research_cds_operations_radar_hub#book'
  const body = `${masthead(site, options.navHtml, booking)}
    <div class="breadcrumbs"><a href="/">HOME</a> → CDS OPERATIONS RADAR</div>
    <main>
      <header class="hero radar-hero">
        <div class="hero-copy">
          <p class="eyebrow">HMRC CDS CHANGE WATCH · SOURCE-STAMPED · FREE</p>
          <h1>${radarHub.h1}</h1>
          <p>Search 5 source records across service status, known workarounds, technical documentation, document codes and aggregation. Each record leads with the change, the workflow it may touch and the next check.</p>
        </div>
        <aside class="hero-ledger radar-hero-ledger">
          <span class="route-ref">OPERATIONS RADAR · EDITION 01</span>
          <div class="radar-hero-count"><strong>5</strong><span>OFFICIAL SOURCE RECORDS</span></div>
          <div class="review-cell"><span>EXACT RESPONSES RECHECKED</span><strong>17 JUL 2026</strong></div>
        </aside>
      </header>
      <div class="hero-value-strip"><strong>5 EXACT RESPONSES RETAINED</strong><strong>5 NARROW SOURCE FACTS</strong><strong>0 AUTO-PUBLISHED DIFFS</strong></div>
      <section class="radar-intro">
        <span class="section-label">USE THE CHANGE, THEN CHECK THE SOURCE</span>
        <h2>One operational register. No hunting across update histories.</h2>
        <div><p>The Radar consolidates substantive CDS changes that have a durable operator use. It does not create one thin page per error code or turn a source byte-change into an automatic claim.</p><p>Freshness is calculated in your browser from the retained observation. A stale or expired record stays useful as history, but it cannot present itself as a green live status.</p></div>
      </section>
      <section class="radar-register" aria-labelledby="radar-register-heading">
        <header><span class="section-label">SEARCH THE REGISTER</span><h2 id="radar-register-heading">Find the change in your workflow.</h2></header>
        <form class="radar-filters" data-radar-filters role="search">
          <label><span>SEARCH</span><input type="search" name="q" placeholder="Code, workaround, EORI, status…" autocomplete="off" /></label>
          <label><span>TOPIC</span><select name="topic"><option value="all">ALL TOPICS</option>${topics.map((topic) => `<option value="${topic}">${stageLabel(topic)}</option>`).join('')}</select></label>
          <label><span>WORKFLOW</span><select name="stage"><option value="all">ALL STAGES</option>${stages.map((stage) => `<option value="${stage}">${stageLabel(stage)}</option>`).join('')}</select></label>
          <label><span>FRESHNESS</span><select name="state"><option value="all">ALL STATES</option><option value="current">CURRENT OBSERVATION</option><option value="stale">SOURCE RECHECK DUE</option><option value="expired">EXPIRED POINT-IN-TIME</option><option value="not_yet_effective">NOT YET EFFECTIVE</option></select></label>
          <button type="button" data-radar-clear>CLEAR FILTERS</button>
        </form>
        <div class="radar-result-count"><output data-radar-result-count aria-live="polite">5 RECORDS</output><span>UPDATED 17 JULY 2026</span></div>
        <div class="radar-results">${resultRows()}</div>
        <div class="radar-empty" data-radar-empty hidden><strong>NO MATCHING RECORD</strong><p>Clear one or more filters to return to the full source register.</p></div>
      </section>
      <section class="radar-downloads" id="downloads">
        <header><span class="section-label">UNGATED DATA</span><h2>Take the Radar into your change review.</h2><p>Download the 5 public records with source URLs, observation windows, workflow stages, snapshot hashes and correction state. No email wall.</p></header>
        <div><a href="/downloads/cds-operations-radar-v1.json" download data-radar-download="json"><span>JSON</span><strong>MACHINE-READABLE RECORDS</strong><b>DOWNLOAD ↓</b></a><a href="/downloads/cds-operations-radar-v1.csv" download data-radar-download="csv"><span>CSV</span><strong>CHANGE-REVIEW TABLE</strong><b>DOWNLOAD ↓</b></a></div>
      </section>
      <section class="radar-method" id="method">
        <span class="section-label">HOW THIS REGISTER EARNS TRUST</span><h2>Exact bytes retained. Changes queued. Claims reviewed.</h2>
        <ol><li><strong>01 · OBSERVE</strong><span>Fetch the official primary source at its registered cadence and retain the exact response by SHA-256.</span></li><li><strong>02 · COMPARE</strong><span>Byte-identical responses produce a verified no-change observation. Any difference becomes a candidate, never public copy.</span></li><li><strong>03 · VERIFY</strong><span>Publish only narrow, source-faithful facts that pass the explicit review and owner-authorization fields.</span></li><li><strong>04 · CORRECT</strong><span>Keep the old event in history and show the correction, supersession or withdrawal on the durable permalink.</span></li></ol>
      </section>
      <section class="next-actions radar-next-actions">
        <header><span class="section-label">FROM CHANGE TO WORKFLOW</span><h2>Check the pack. Then check the numbers.</h2><p>Use the free pack checker for the declaration in front of you, or bring your current minutes, volumes and exception path to a 20-minute workflow call.</p></header>
        <div class="radar-action-grid"><a data-radar-related="pack_checker" href="/tools/customs-document-pack-check/"><span>FREE OPERATOR TOOL</span><strong>RUN THE DOCUMENT PACK CHECK</strong><b>OPEN TOOL →</b></a><a class="radar-action-primary" data-radar-booking="bottom_cta" href="${booking}"><span>20-MINUTE WORKFLOW CALL</span><strong>MAP THE CHANGE TO YOUR DESK</strong><b>BOOK THE CALL →</b></a></div>
      </section>
    </main>
    <footer class="footer"><span>${site.company.toUpperCase()} · COMPANY ${site.companyNumber} · LEICESTER, ENGLAND</span><nav><a href="/editorial-policy/">SOURCES &amp; CORRECTIONS</a><a href="/privacy/">PRIVACY</a><a href="/security/">SECURITY</a></nav></footer>`
  return shell({ title: radarHub.title, description: radarHub.description, canonical, schema: jsonLdHub(site), body, site, options })
}

function timingRows(record) {
  const state = freshnessState(record)
  return `<div class="radar-timing-grid" data-radar-freshness data-freshness-state="${state}" data-effective-from="${record.effectiveFrom || ''}" data-expires-at="${record.expiresAt || ''}" data-fresh-until="${record.freshUntil}">
    <div><span>OBSERVED</span><strong>${escapeHtml(displayDate(record.observedAt, true))}</strong></div>
    <div><span>EFFECTIVE</span><strong>${escapeHtml(displayDate(record.effectiveFrom))}</strong></div>
    <div><span>FRESH UNTIL</span><strong>${escapeHtml(displayDate(record.freshUntil, true))}</strong></div>
    <div><span>STATE</span><strong data-freshness-label>${freshnessLabel(state)}</strong></div>
  </div>`
}

export function renderRadarRecord(record, site, options) {
  if (!record.review.publicationReady) throw new Error(`Radar record ${record.id} is not publication-ready`)
  if (record.review.state === 'agent_source_verified' && record.review.publicationScope !== 'narrow_primary_source_fact') {
    throw new Error(`Radar record ${record.id} exceeds the agent-source-verification publication scope`)
  }
  const canonical = `${site.origin}${record.path}`
  const booking = `/?src=radar_${record.id}#book`
  const state = freshnessState(record)
  const siblingLinks = radarRecords
    .filter((candidate) => candidate.id !== record.id)
    .slice(0, 3)
    .map((candidate) => `<a href="${candidate.path}" data-radar-record-link="${candidate.id}"><span>${escapeHtml(candidate.label)}</span><strong>${escapeHtml(candidate.title)}</strong><b>OPEN →</b></a>`)
    .join('')
  const body = `${masthead(site, options.navHtml, booking)}
    <div class="breadcrumbs"><a href="/">HOME</a> → <a href="${radarHub.path}">CDS OPERATIONS RADAR</a> → ${escapeHtml(record.label)}</div>
    <main>
      <header class="hero radar-record-hero">
        <div class="hero-copy">
          <p class="eyebrow">${escapeHtml(record.label)} · HMRC SOURCE RECORD</p>
          <h1>${escapeHtml(record.title)}</h1>
          <p>${escapeHtml(record.summary)}</p>
          <div class="report-actions"><a class="button" data-radar-source="${record.source.id}" href="${record.source.url}">OPEN THE HMRC SOURCE</a><button class="text-action" type="button" data-radar-share>SHARE RECORD</button></div>
        </div>
        <aside class="hero-ledger radar-record-ledger" data-radar-freshness data-freshness-state="${state}" data-effective-from="${record.effectiveFrom || ''}" data-expires-at="${record.expiresAt || ''}" data-fresh-until="${record.freshUntil}">
          <span class="route-ref">${escapeHtml(record.id.toUpperCase())}</span>
          <div class="radar-record-date"><strong>17</strong><span>JUL<br />2026</span></div>
          <div class="review-cell"><span data-freshness-label>${freshnessLabel(state)}</span><strong>OBSERVED 18:08 UTC</strong></div>
        </aside>
      </header>
      <section class="radar-answer">
        <div><span class="section-label">WHY THIS MAY MATTER</span><h2>${escapeHtml(record.whyItMatters)}</h2></div>
        <div class="radar-next-check"><span>CHECK NEXT</span><p>${escapeHtml(record.operatorAction)}</p></div>
      </section>
      <section class="radar-workflow" aria-labelledby="workflow-heading-${record.id}">
        <header><span class="section-label">WORKFLOW IMPACT</span><h2 id="workflow-heading-${record.id}">Put the source into the right desk check.</h2><p>The impact notes below are bounded operator prompts. Follow the linked HMRC instruction for the exact condition.</p></header>
        <div class="table-scroll" tabindex="0" role="region" aria-label="Workflow impact table"><table><caption>Workflow stages connected to this source record</caption><thead><tr><th scope="col">STAGE</th><th scope="col">WHAT MAY CHANGE</th><th scope="col">NEXT CHECK</th></tr></thead><tbody>${record.impacts.map((impact) => `<tr><th scope="row">${stageLabel(impact.stage)}</th><td>${escapeHtml(impact.impact)}</td><td>${escapeHtml(impact.action)}</td></tr>`).join('')}</tbody></table></div>
      </section>
      <section class="radar-value-actions">
        <header><span class="section-label">USEFUL NEXT ACTIONS</span><h2>Take the change into a real workflow.</h2></header>
        <div class="radar-action-grid"><a data-radar-related="${record.related.id}" href="${record.related.href}"><span>RELATED TOOL OR WORKFLOW</span><strong>${escapeHtml(record.related.label)}</strong><b>OPEN →</b></a><a class="radar-action-primary" data-radar-booking="after_value" href="${booking}"><span>20-MINUTE WORKFLOW CALL</span><strong>MAP THIS CHANGE TO YOUR DESK</strong><b>BOOK THE CALL →</b></a></div>
      </section>
      <section class="radar-evidence">
        <header><span class="section-label">FRESHNESS + CORRECTION</span><h2>Know which observation you are using.</h2><p>The page remains available as a durable record when its observation becomes stale or expires. The state above changes in the browser; the official link remains the place to check current conditions.</p></header>
        ${timingRows(record)}
        <div class="radar-correction"><span>CORRECTION STATE</span><strong>${record.correction.status === 'none' ? 'NO CORRECTION RECORDED' : escapeHtml(record.correction.status.toUpperCase())}</strong><p>${record.correction.note ? escapeHtml(record.correction.note) : 'If the source fact or our transcription needs correction, the old event stays in history and the corrected version is published here.'}</p><a href="/editorial-policy/">REPORT OR REVIEW A CORRECTION →</a></div>
      </section>
      <section class="radar-source-proof">
        <header><span class="section-label">PRIMARY SOURCE PROOF</span><h2>Trace the sentence to the retained response.</h2></header>
        <dl><div><dt>PUBLISHER</dt><dd>${escapeHtml(record.source.publisher)}</dd></div><div><dt>SOURCE LOCATOR</dt><dd>${escapeHtml(record.source.locator)}</dd></div><div><dt>SOURCE UPDATED</dt><dd>${escapeHtml(displayDate(record.source.updatedAt, true))}</dd></div><div><dt>RESPONSE</dt><dd>${record.source.bytes.toLocaleString('en-GB')} BYTES · ${escapeHtml(record.source.mediaType)}</dd></div><div><dt>SHA-256</dt><dd><code>${record.source.sha256}</code></dd></div><div><dt>LICENCE</dt><dd>${escapeHtml(record.source.licence)}</dd></div></dl>
        <p class="radar-review-note"><strong>Review label:</strong> source checked by the named Declarix verification agent <code>${record.review.reviewerIdentity}</code> and owner-authorized for a narrow primary-source fact. This is not labelled as human customs interpretation; broader conclusions stay outside this record.</p>
        <a class="button button-quiet" data-radar-source="${record.source.id}" href="${record.source.url}">READ THE OFFICIAL SOURCE</a>
      </section>
      <section class="radar-history">
        <header><span class="section-label">APPEND-ONLY HISTORY</span><h2>What changed in this record.</h2></header>
        <ol>${record.history.map((event) => `<li><time datetime="${event.observedAt}">${escapeHtml(displayDate(event.observedAt, true))}</time><strong>${escapeHtml(event.type.toUpperCase())}</strong><p>${escapeHtml(event.note)}</p></li>`).join('')}</ol>
      </section>
      <section class="radar-more"><header><span class="section-label">MORE CDS OPERATIONS RECORDS</span><h2>Continue through the register.</h2></header><div>${siblingLinks}</div><a class="text-action" href="${radarHub.path}">VIEW ALL 5 RECORDS →</a></section>
    </main>
    <footer class="footer"><span>${site.company.toUpperCase()} · COMPANY ${site.companyNumber} · LEICESTER, ENGLAND</span><nav><a href="${radarHub.path}">RADAR</a><a href="/editorial-policy/">SOURCES &amp; CORRECTIONS</a><a href="/privacy/">PRIVACY</a></nav></footer>`
  return shell({ title: record.pageTitle, description: record.description, canonical, schema: jsonLdRecord(record, site), body, site, options, recordId: record.id })
}

export function radarJson() {
  return `${JSON.stringify(
    {
      schema_version: '1.0',
      generated_at: '2026-07-17T18:08:43Z',
      record_count: radarRecords.length,
      records: radarRecords.map((record) => ({
        record_id: record.id,
        record_type: record.type,
        status: record.status,
        title: record.title,
        summary: record.summary,
        why_it_matters: record.whyItMatters,
        operator_action: record.operatorAction,
        topics: record.topics,
        workflow_impacts: record.impacts,
        timing: { effective_from: record.effectiveFrom, expires_at: record.expiresAt },
        freshness: { observed_at: record.observedAt, fresh_until: record.freshUntil, poll_interval_hours: record.pollHours },
        correction: record.correction,
        review: record.review,
        provenance: record.source,
        path: record.path,
      })),
    },
    null,
    2,
  )}\n`
}

const csvEscape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`

export function radarCsv() {
  const header = ['record_id', 'record_type', 'title', 'observed_at', 'fresh_until', 'effective_from', 'expires_at', 'topics', 'workflow_stages', 'source_url', 'snapshot_sha256', 'correction_status', 'review_state', 'publication_scope', 'path']
  const rows = radarRecords.map((record) => [record.id, record.type, record.title, record.observedAt, record.freshUntil, record.effectiveFrom, record.expiresAt, record.topics.join('|'), record.impacts.map((impact) => impact.stage).join('|'), record.source.url, record.source.sha256, record.correction.status, record.review.state, record.review.publicationScope, record.path])
  return `${[header, ...rows].map((row) => row.map(csvEscape).join(',')).join('\n')}\n`
}
