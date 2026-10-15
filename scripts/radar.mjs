import { radarObservations } from './radar-observations.mjs'

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

const shortDate = (value) =>
  new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(value))
    .toUpperCase()

const isoDay = (value) => new Date(value).toISOString().slice(0, 10)
const plusHours = (value, hours) => new Date(Date.parse(value) + hours * 3600000).toISOString().replace('.000Z', 'Z')
const latest = (values) => values.filter(Boolean).reduce((max, value) => (Date.parse(value) > Date.parse(max) ? value : max))

const stageLabel = (value) => value.replaceAll('_', ' ').toUpperCase()
const recordPath = (recordId) => `/research/cds-operations-radar/${recordId}/`
const licence = 'Open Government Licence v3.0'

// The build clock decides the server-rendered freshness state. RADAR_BUILD_AT or SOURCE_DATE_EPOCH pin it for
// reproducible builds; otherwise the real build time is used. Browsers recompute the state on every page view.
export function radarBuildTime() {
  if (process.env.RADAR_BUILD_AT) return new Date(process.env.RADAR_BUILD_AT)
  if (process.env.SOURCE_DATE_EPOCH) return new Date(Number(process.env.SOURCE_DATE_EPOCH) * 1000)
  return new Date()
}

function observed(key, locator, id = `src_${key}`) {
  const observation = radarObservations[key]
  if (!observation) throw new Error(`Radar observation missing: ${key}`)
  return {
    id,
    publisher: observation.publisher,
    title: observation.title,
    url: observation.url,
    locator,
    updatedAt: observation.updatedAt,
    observedAt: observation.observedAt,
    sha256: observation.sha256,
    bytes: observation.bytes,
    mediaType: observation.mediaType,
    licence,
  }
}

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

const octoberReview = {
  ...sharedReview,
  reviewedAt: '2026-10-15T16:40:00Z',
  reviewerIdentity: 'claude-radar-source-verifier',
}

const julyCreated = [
  { type: 'created', observedAt: '2026-07-17T10:00:00Z', note: 'Source-backed record created as a gated draft.' },
  { type: 'updated', observedAt: '2026-07-17T18:08:43Z', note: 'Exact response re-observed; narrow source fact cleared for publication.' },
]

const octoberCreated = (key) => [
  {
    type: 'created',
    observedAt: radarObservations[key].observedAt,
    note: 'Source-backed record created from the retained official response and cleared as a narrow primary-source fact for the October 2026 edition.',
  },
]

const OCT = radarObservations.cds_status.observedAt
const packCheck = (label = 'RUN THE FREE PACK CHECK') => ({ href: '/tools/customs-document-pack-check/', label, id: 'pack_checker' })

const records = [
  {
    id: 'cds-service-status-current',
    type: 'service_status',
    label: 'SERVICE STATUS · POINT-IN-TIME',
    title: 'HMRC listed no CDS downtime or service issues at 16:19 UTC on 15 October',
    pageTitle: 'CDS service status check — 15 October 2026 | Declarix',
    description:
      'See the source-stamped HMRC CDS service status observed at 16:19 UTC on 15 October 2026, its freshness state, workflow checks and source history.',
    summary:
      "At 16:19 UTC on 15 October 2026, HMRC's CDS availability page listed no planned downtime and no service issues. The page's latest recorded update was 29 September 2026, when HMRC marked the CDS Release 5.3 deployment issue as resolved.",
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
    publishedAt: '2026-07-17',
    effectiveFrom: radarObservations.cds_status.observedAt,
    expiresAt: plusHours(radarObservations.cds_status.observedAt, 24),
    observedAt: radarObservations.cds_status.observedAt,
    freshUntil: plusHours(radarObservations.cds_status.observedAt, 24),
    pollHours: 6,
    correction: { status: 'none', note: null, correctionOf: null },
    source: observed('cds_status', 'Service availability; Planned downtime: None; Service issues: None; Updates to this page: 29 September 2026', 'hmrc_cds_service_status'),
    history: [
      ...julyCreated,
      {
        type: 'updated',
        observedAt: radarObservations.cds_status.observedAt,
        note: 'Re-observed on 15 October 2026. HMRC listed no planned downtime and no service issues. The source was last updated on 29 September 2026, when the CDS Release 5.3 deployment issue was marked resolved. The 17 July observation stays in this history.',
      },
    ],
    related: packCheck(),
    review: octoberReview,
  },
  {
    id: 'cds-release-5-3-deployment-2026-09-27',
    type: 'release_event',
    label: 'CDS RELEASE · DEPLOYMENT',
    title: 'HMRC logged and resolved a CDS Release 5.3 deployment issue in late September',
    pageTitle: 'CDS Release 5.3 deployment issue — Sept 2026 | Declarix',
    description:
      'HMRC listed CDS downtime for 26 to 27 September 2026, logged a CDS Release 5.3 deployment issue on 27 September and marked it resolved on 29 September.',
    summary:
      'HMRC listed planned CDS downtime from 7pm on Saturday 26 September to 8:30am on Sunday 27 September 2026. On 27 September it added a service issue about the deployment of CDS Release 5.3, and on 29 September it marked that issue resolved.',
    whyItMatters:
      'A production release can change validation behaviour. Rejections raised in that window may trace to the release and not to the declaration data.',
    operatorAction:
      "Review rejections and amendments raised from 26 to 29 September 2026, and watch HMRC's known-error workaround page for a document that covers Release 5.3. On 15 October that page still listed consolidated document 5.2.0.",
    topics: ['cds', 'service-status', 'known-errors'],
    impacts: [
      {
        stage: 'submission',
        impact: 'HMRC listed planned CDS downtime from 7pm on 26 September to 8:30am on 27 September 2026.',
        action: 'Confirm that declarations queued for that window were submitted and acknowledged.',
      },
      {
        stage: 'declaration_completion',
        impact: 'A Release 5.3 deployment issue was open from 27 to 29 September 2026.',
        action: 'Recheck rejections from that window against the current HMRC position before amending data.',
      },
      {
        stage: 'known_errors',
        impact: "HMRC's known-error workaround page still listed consolidated document 5.2.0 on 15 October 2026.",
        action: 'Watch for a workaround release that covers Release 5.3 before changing a rejection workaround.',
      },
    ],
    publishedAt: '2026-10-15',
    effectiveFrom: '2026-09-26T18:00:00Z',
    expiresAt: null,
    observedAt: radarObservations.cds_status.observedAt,
    freshUntil: plusHours(radarObservations.cds_status.observedAt, 24 * 7),
    pollHours: 24,
    correction: { status: 'none', note: null, correctionOf: null },
    source: observed('cds_status', 'Updates to this page: 11, 27 and 29 September 2026 (Release 5.3 downtime and service issue)'),
    supportingSources: [observed('cds_workarounds', 'Consolidated workaround document 5.2.0; page last updated 4 July 2026')],
    history: octoberCreated('cds_status'),
    related: packCheck('CHECK A DOCUMENT PACK'),
    review: octoberReview,
  },
  {
    id: 'tss-new-platform-2026-10-20',
    type: 'service_change',
    label: 'NORTHERN IRELAND · TRADER SUPPORT SERVICE',
    title: 'All TSS goods movements from 20 October 2026 must use the new TSS platform',
    pageTitle: 'New TSS platform from 20 October 2026 | Declarix',
    description:
      'HMRC says all Trader Support Service goods movements on or after 20 October 2026 must be submitted on the new TSS platform operated by Netcompany.',
    summary:
      'HMRC said on 22 September 2026 that all goods movements taking place on or after 20 October must be submitted on the new Trader Support Service (TSS) platform, operated by Netcompany. The current TSS will not accept new movements from that date. Registered businesses pre-enrol through an invitation email.',
    whyItMatters:
      'Businesses that have not moved to the new platform cannot submit new TSS movements from 20 October. HMRC says updating a profile could take between 5 and 30 minutes.',
    operatorAction:
      'Confirm that every GB to Northern Ireland client has pre-enrolled, created a new password and checked permissions on the new platform. Use the TSS test environment to run a movement before 20 October.',
    topics: ['northern-ireland', 'tss', 'windsor-framework'],
    impacts: [
      {
        stage: 'ni_movements',
        impact: 'Goods movements on or after 20 October 2026 must be submitted on the new TSS platform.',
        action: 'Move every GB to NI movement template and user to the new platform before 20 October.',
      },
      {
        stage: 'service_access',
        impact: 'Users need to pre-enrol, create a new password and update their details and permissions.',
        action: 'Track pre-enrolment for each client and user, and test access in the TSS test environment.',
      },
    ],
    publishedAt: '2026-10-15',
    effectiveFrom: '2026-10-20T00:00:00Z',
    expiresAt: null,
    observedAt: radarObservations.tss_new_platform.observedAt,
    freshUntil: plusHours(radarObservations.tss_new_platform.observedAt, 24 * 3),
    pollHours: 24,
    correction: { status: 'none', note: null, correctionOf: null },
    source: observed('tss_new_platform', 'News story, 22 September 2026: Trader Support Service users urged to prepare for new platform'),
    history: octoberCreated('tss_new_platform'),
    related: { href: '/customs-clearance-software/', label: 'SEE THE DECLARIX WORKFLOW', id: 'clearance_software' },
    review: octoberReview,
  },
  {
    id: 'ics2-ens-data-elements-2026-10-14',
    type: 'technical_release',
    label: 'SAFETY AND SECURITY · ICS2',
    title: 'HMRC updated the Safety and Security GB entry summary data elements file on 14 October',
    pageTitle: 'Safety and Security GB ENS data update — Oct 2026 | Declarix',
    description:
      'HMRC updated the Safety and Security GB entry summary declaration data elements file on 14 October 2026 and resolved two ICS2 test service issues.',
    summary:
      "On 14 October 2026 HMRC updated the file 'Entry summary declaration data elements for the S&S GB service' on its entry summary declaration guidance. The same day it marked as resolved two Import Control System 2 (ICS2) issues that affected the Shared Trader Interface (STI) CONF and Common Component CONF parts of the ICS2 testing service, first logged on 7 and 11 August.",
    whyItMatters:
      'Carriers and their agents build entry summary declarations from this data-element file. A changed file can alter which fields a GB safety and security filing carries.',
    operatorAction:
      'Download the current data-elements file, compare it with the version in your ENS mapping, and rerun ICS2 conformance tests now that the CONF test services are available again.',
    topics: ['ics2', 'safety-and-security', 'software-integration'],
    impacts: [
      {
        stage: 'safety_security',
        impact: 'The GB entry summary declaration data-elements file changed on 14 October 2026.',
        action: 'Compare the new file with your ENS field mapping before the next filing release.',
      },
      {
        stage: 'software_integration',
        impact: 'HMRC resolved the STI CONF and Common Component CONF test service issues on 14 October 2026.',
        action: 'Rerun ICS2 conformance tests that were blocked from August.',
      },
    ],
    publishedAt: '2026-10-15',
    effectiveFrom: null,
    expiresAt: null,
    observedAt: radarObservations.ens_making.observedAt,
    freshUntil: plusHours(radarObservations.ens_making.observedAt, 24 * 7),
    pollHours: 24,
    correction: { status: 'none', note: null, correctionOf: null },
    source: observed('ens_making', 'Updates to this page: 14 October 2026; Entry summary declaration data elements for the S&S GB service'),
    supportingSources: [observed('ics2_status', 'Updates to this page: 7 August, 11 August and 14 October 2026')],
    history: octoberCreated('ens_making'),
    related: { href: '/customs-workflows/ens-ics2-entry-summary-declaration-checklist/', label: 'OPEN THE ENS AND ICS2 CHECKLIST', id: 'ens_checklist' },
    review: octoberReview,
  },
  {
    id: 'cds-ni-h7-ukc-apc-c07-2026-10-06',
    type: 'guidance_change',
    label: 'NORTHERN IRELAND · PROCEDURE CODES',
    title: 'HMRC limited H7 to UK Carrier movements into NI and stopped APC C07 on NI H1s',
    pageTitle: 'CDS H7 and APC C07 rules for NI — Oct 2026 | Declarix',
    description:
      'HMRC says H7 may only be used for UK Carrier Scheme movements into NI that are not at risk, and APC C07 must not be used on an H1 into NI.',
    summary:
      "On 6 October 2026 HMRC confirmed that declaration category H7 may currently only be used for movements into Northern Ireland under the UK Carrier Scheme (UKC) that are 'not at risk' of entering the EU. It also said Additional Procedure Code C07 must not be used any longer on an H1 for movements into Northern Ireland. C07 can continue to be used for GB imports.",
    whyItMatters:
      'NI templates that default to H7 or to C07 on an H1 can now produce declarations that do not match HMRC instructions for the movement.',
    operatorAction:
      'Split GB and NI template logic. Keep C07 for GB imports only, and route NI movements to H7 only where the UKC not-at-risk conditions apply. On 7 October HMRC also removed an incorrect authorisation document identifier from the import DE 2/3 instructions.',
    topics: ['cds', 'northern-ireland', 'procedure-codes'],
    impacts: [
      {
        stage: 'declaration_category',
        impact: "H7 may currently only be used for UKC movements into NI that are 'not at risk'.",
        action: 'Gate H7 selection on UKC authorisation and not-at-risk status.',
      },
      {
        stage: 'procedure_codes',
        impact: 'APC C07 must not be used on an H1 for movements into NI; it stays valid for GB imports.',
        action: 'Remove C07 from NI H1 templates and keep it in GB import templates.',
      },
      {
        stage: 'data_sets',
        impact: 'SPIMM and UKC data sets now allow I1 C and F and C21i EIDR NOP for Category 2 goods (11 September 2026).',
        action: 'Review SPIMM Category 2 routing against the updated reading notes.',
      },
    ],
    publishedAt: '2026-10-15',
    effectiveFrom: null,
    expiresAt: null,
    observedAt: radarObservations.appendix_2.observedAt,
    freshUntil: plusHours(radarObservations.appendix_2.observedAt, 24 * 7),
    pollHours: 24,
    correction: { status: 'none', note: null, correctionOf: null },
    source: observed('appendix_2', 'Updates to this page: 6 October 2026 (5 October 23:15 UTC); APC C series; Introduction and index list'),
    supportingSources: [
      observed('appendix_1', 'Updates to this page: 6 October 2026; Introduction and index list'),
      observed('appendix_21', "Updates to this page: 6 October 2026; Appendix 21H: Declaration Category Data Sets H7"),
      observed('dci_imports', 'Updates to this page: 6 and 7 October 2026; Declaration category H7; DE 2/3; DE 6/13'),
      observed('spimm_ukc_datasets', 'Updates to this page: 11 September 2026; Category 2 goods'),
    ],
    history: octoberCreated('appendix_2'),
    related: packCheck('CHECK AN NI DOCUMENT PACK'),
    review: octoberReview,
  },
  {
    id: 'cds-ni-eudr-document-codes-2026-12-30',
    type: 'code_change',
    label: 'DOCUMENT CODES · NORTHERN IRELAND',
    title: 'HMRC added 15 CDS document codes ahead of EU Deforestation Regulation rules in NI',
    pageTitle: 'NI EU Deforestation Regulation CDS codes | Declarix',
    description:
      'HMRC added 15 DE 2/3 Union document codes on 6 October 2026 ahead of the EU Deforestation Regulation applying in Northern Ireland from 30 December 2026.',
    summary:
      'On 6 October 2026 HMRC added document codes C716, C717, C718, C720, C725, Y129, Y132, Y133, Y141, Y142, Y187, Y188, Y190, Y191 and Y196 to Appendix 5A (Union) in preparation for the EU Deforestation Regulation in Northern Ireland on 30 December 2026. On 30 September HMRC added Y388 and removed C008, C012 and C013, which are not available for use in Northern Ireland.',
    whyItMatters:
      'Declarations for goods moving into Northern Ireland that fall under the new measures will need the new document codes. Codes C008, C012 and C013 no longer apply to NI.',
    operatorAction:
      'Map the 15 new codes into NI templates before 30 December 2026, remove C008, C012 and C013 from NI code lists, and check which commodity codes carry the measures in the Northern Ireland Online Tariff.',
    topics: ['cds', 'data-element-2-3', 'document-codes', 'northern-ireland'],
    impacts: [
      {
        stage: 'document_codes',
        impact: '15 new Union document codes support EU Deforestation Regulation rules in NI from 30 December 2026.',
        action: 'Add the codes to NI reference data and test a declaration line that needs one.',
      },
      {
        stage: 'reference_data',
        impact: 'Codes C008, C012 and C013 were removed for NI on 30 September 2026, and Y388 was added.',
        action: 'Remove the three codes from NI pick-lists and add Y388.',
      },
    ],
    publishedAt: '2026-10-15',
    effectiveFrom: '2026-12-30T00:00:00Z',
    expiresAt: null,
    observedAt: radarObservations.de23_union.observedAt,
    freshUntil: plusHours(radarObservations.de23_union.observedAt, 24 * 7),
    pollHours: 24,
    correction: { status: 'none', note: null, correctionOf: null },
    source: observed('de23_union', 'Updates to this page: 30 September and 6 October 2026; Appendix 5A Union'),
    history: octoberCreated('de23_union'),
    related: packCheck('CHECK THE SUPPORTING PACK'),
    review: octoberReview,
  },
  {
    id: 'cds-ni-steel-melt-and-pour-codes-2026-10-01',
    type: 'code_change',
    label: 'DOCUMENT CODES · NORTHERN IRELAND',
    title: 'HMRC added CDS document codes for NI steel melt and pour rules from 1 October',
    pageTitle: 'NI steel melt and pour CDS codes — Oct 2026 | Declarix',
    description:
      'HMRC added DE 2/3 codes C131 to C139 and Y376 to Y387 for Northern Ireland steel melt and pour requirements from 1 October 2026, and changed Y138.',
    summary:
      'On 27 September 2026 HMRC added document codes C131 to C139 and Y376 to Y387 to Appendix 5A (Union) for steel melt and pour requirements in Northern Ireland from 1 October 2026. Document code Y138 now mandates a document ID. HMRC says the TARIC measures that use these codes can be viewed in the Northern Ireland Online Tariff.',
    whyItMatters:
      'Steel lines moving into Northern Ireland from 1 October may need melt and pour evidence codes. A Y138 line without a document ID no longer meets the instruction.',
    operatorAction:
      'Add the 21 new codes to NI reference data, make the Y138 document ID mandatory in templates, and request melt and pour evidence from steel suppliers before goods ship.',
    topics: ['cds', 'data-element-2-3', 'document-codes', 'northern-ireland', 'steel'],
    impacts: [
      {
        stage: 'document_codes',
        impact: 'Codes C131 to C139 and Y376 to Y387 support NI steel melt and pour requirements from 1 October 2026.',
        action: 'Load the codes and map them to steel commodity lines for NI movements.',
      },
      {
        stage: 'supporting_evidence',
        impact: 'Document code Y138 now mandates a document ID.',
        action: 'Make the Y138 document ID a required field in NI templates.',
      },
    ],
    publishedAt: '2026-10-15',
    effectiveFrom: '2026-10-01T00:00:00Z',
    expiresAt: null,
    observedAt: radarObservations.de23_union.observedAt,
    freshUntil: plusHours(radarObservations.de23_union.observedAt, 24 * 7),
    pollHours: 24,
    correction: { status: 'none', note: null, correctionOf: null },
    source: observed('de23_union', 'Updates to this page: 27 September 2026 (26 September 23:15 UTC); Appendix 5A Union'),
    history: octoberCreated('de23_union'),
    related: packCheck('CHECK THE SUPPORTING PACK'),
    review: octoberReview,
  },
  {
    id: 'cds-eu-eori-completion-instructions-2026-09-26',
    type: 'guidance_change',
    label: 'PARTY IDENTIFICATION · EU EORI',
    title: 'HMRC added EU EORI guidance across CDS import, export and clearance instructions',
    pageTitle: 'CDS EU EORI completion guidance — Sept 2026 | Declarix',
    description:
      'HMRC updated CDS import, export, inventory export and BIRDS completion instructions on 26 September 2026 to cover EU EORIs and establishment rules.',
    summary:
      "On 26 September 2026 HMRC updated import Data Elements 2/3 and 2/7 and Data Elements 3/15, 3/16, 3/18, 3/19, 3/20 and 3/39 to include EU EORI guidance. Export, inventory-export clearance and BIRDS instructions changed the same day to reflect establishment in Northern Ireland or the EU following the introduction of EU EORIs. Import DE 2/2 now also clarifies when an EU trade defence measure affects the 'at risk' status of goods imported into Northern Ireland.",
    whyItMatters:
      'Party-identification rules now reach well beyond the July aggregation change. Software that only accepts GB or XI identifiers in these fields can block a valid declaration.',
    operatorAction:
      'Test each changed party data element with an EU EORI case, and confirm your establishment checks follow the updated export and clearance instructions.',
    topics: ['cds', 'eori', 'northern-ireland', 'party-identification'],
    impacts: [
      {
        stage: 'party_identification',
        impact: 'Import Data Elements 2/3, 2/7, 3/15, 3/16, 3/18, 3/19, 3/20 and 3/39 now include EU EORI guidance.',
        action: 'Add EU EORI test cases for each changed data element.',
      },
      {
        stage: 'establishment',
        impact: 'Export, inventory-export and BIRDS instructions changed the establishment rules for NI or the EU.',
        action: 'Update establishment checks in export and clearance templates.',
      },
      {
        stage: 'ni_at_risk',
        impact: "DE 2/2 clarifies when an EU trade defence measure affects the 'at risk' status of NI imports.",
        action: 'Review at-risk logic for NI lines that carry an EU trade defence measure.',
      },
    ],
    publishedAt: '2026-10-15',
    effectiveFrom: null,
    expiresAt: null,
    observedAt: radarObservations.dci_imports.observedAt,
    freshUntil: plusHours(radarObservations.dci_imports.observedAt, 24 * 7),
    pollHours: 24,
    correction: { status: 'none', note: null, correctionOf: null },
    source: observed('dci_imports', 'Updates to this page: 26 September 2026 (25 September 23:15 UTC); Groups 2 and 3'),
    supportingSources: [
      observed('dci_exports', 'Updates to this page: 26 September 2026; Groups 2 and 3'),
      observed('dci_c21_inventory_exports', 'Updates to this page: 26 September 2026; Groups 2 and 3'),
      observed('dci_birds', 'Updates to this page: 26 September 2026'),
    ],
    history: octoberCreated('dci_imports'),
    related: { href: '/supported-scope/', label: 'CHECK DECLARIX SCOPE', id: 'supported_scope' },
    review: octoberReview,
  },
  {
    id: 'cds-vaping-products-duty-codes-2026-09-26',
    type: 'code_change',
    label: 'TAX TYPES · VAPING PRODUCTS DUTY',
    title: 'HMRC added CDS tax-type and additional codes for Vaping Products Duty',
    pageTitle: 'CDS Vaping Products Duty codes — Sept 2026 | Declarix',
    description:
      'HMRC added new excise duty codes for Vaping Products Duty to CDS Appendix 8 (DE 4/3) and Appendix 19 (DE 6/17) on 26 September 2026.',
    summary:
      'On 26 September 2026 HMRC updated Appendix 8 (tax types for Data Element 4/3) and Appendix 19 (national additional codes for Data Element 6/17) with new excise duty codes for the introduction of Vaping Products Duty. HMRC guidance says Vaping Products Duty is a new excise duty on vaping liquid, and that from 1 April 2027 all vaping products outside duty suspension in the UK must carry a vaping duty stamp.',
    whyItMatters:
      'Import declarations for vaping products need the new tax-type and additional codes for the duty to calculate correctly.',
    operatorAction:
      'Load the new codes from Appendix 8 and Appendix 19, flag vaping commodity lines in templates, and confirm that clients hold the HMRC approvals the guidance describes.',
    topics: ['cds', 'excise', 'tax-types', 'vaping'],
    impacts: [
      {
        stage: 'duty_calculation',
        impact: 'Appendix 8 now lists new excise duty tax types for Vaping Products Duty.',
        action: 'Add the tax types to DE 4/3 reference data and test a vaping line.',
      },
      {
        stage: 'additional_codes',
        impact: 'Appendix 19 now lists new national additional codes for Vaping Products Duty.',
        action: 'Add the codes to DE 6/17 reference data for vaping commodity lines.',
      },
    ],
    publishedAt: '2026-10-15',
    effectiveFrom: null,
    expiresAt: null,
    observedAt: radarObservations.tax_types_de43.observedAt,
    freshUntil: plusHours(radarObservations.tax_types_de43.observedAt, 24 * 7),
    pollHours: 24,
    correction: { status: 'none', note: null, correctionOf: null },
    source: observed('tax_types_de43', 'Updates to this page: 26 September 2026 (25 September 23:15 UTC); Appendix 8'),
    supportingSources: [
      observed('nac_de617', 'Updates to this page: 26 September 2026; Appendix 19'),
      observed('vaping_impacted', 'What Vaping Products Duty is; What vaping duty stamps are'),
    ],
    history: octoberCreated('tax_types_de43'),
    related: { href: '/tools/customs-value-import-duty-vat-calculator/', label: 'OPEN THE VALUE AND DUTY WORKPAPER', id: 'value_duty_workpaper' },
    review: octoberReview,
  },
  {
    id: 'cds-reference-code-lists-jul-oct-2026',
    type: 'code_change',
    label: 'REFERENCE DATA · LOCATION AND CODE LISTS',
    title: 'HMRC removed 15 CDS goods-location codes and changed other code lists by October',
    pageTitle: 'CDS location and reference code changes 2026 | Declarix',
    description:
      'HMRC removed 15 DE 5/23 location codes, added airport codes, added currency VES and reformatted three CDS code files between July and October 2026.',
    summary:
      'Between 23 July and 9 October 2026 HMRC removed 15 Data Element 5/23 goods-location codes for external and internal temporary storage facilities and maritime wharves. It added codes including George Best City Airport Belfast (GBAUBHDBHDBHD) and Inverness Airport (GBAUARSINVINV), added currency code VES (Venezuelan Bolivar) to DE 4/10, and reformatted the DE 5/21 place-of-loading, DE 6/9 package-type and DE 4/9 additions-and-deductions files.',
    whyItMatters:
      'A declaration that quotes a removed goods-location code will not match HMRC reference data. Jobs that still point at a closed facility need updating before the next arrival.',
    operatorAction:
      'Refresh DE 5/23 location tables from the current HMRC files and search open jobs for the removed codes, for example GBAUFEMLHRTKX, GBAUFXTFXTUNE and GBAUSILSILSIL.',
    topics: ['cds', 'goods-location', 'reference-data'],
    impacts: [
      {
        stage: 'goods_location',
        impact: '11 external temporary storage, 2 internal temporary storage and 2 maritime wharf codes were removed.',
        action: 'Remove the codes from location tables and reassign open jobs.',
      },
      {
        stage: 'reference_data',
        impact: 'Currency code VES was added to DE 4/10, and three code files changed format on 24 July 2026.',
        action: 'Reload currency and code files and check that your import parser reads the new formats.',
      },
    ],
    publishedAt: '2026-10-15',
    effectiveFrom: null,
    expiresAt: null,
    observedAt: radarObservations.etsf_de523.observedAt,
    freshUntil: plusHours(radarObservations.etsf_de523.observedAt, 24 * 7),
    pollHours: 24,
    correction: { status: 'none', note: null, correctionOf: null },
    source: observed('etsf_de523', 'Updates to this page: 3 August to 2 October 2026'),
    supportingSources: [
      observed('itsf_de523', 'Updates to this page: 18 August and 21 September 2026'),
      observed('maritime_de523', 'Updates to this page: 18 August to 9 October 2026'),
      observed('airports_de523', 'Updates to this page: 18 August 2026'),
      observed('acts_de523', 'Updates to this page: 17 August and 23 September 2026'),
      observed('currency_de410', 'Updates to this page: 26 September 2026; Appendix 11'),
      observed('loading_de521', 'Updates to this page: 24 July 2026; Appendix 15A and 15B'),
    ],
    history: octoberCreated('etsf_de523'),
    related: packCheck('CHECK A DOCUMENT PACK'),
    review: octoberReview,
  },
  {
    id: 'cds-union-document-codes-jul-sep-2026',
    type: 'code_change',
    label: 'DOCUMENT CODES · REFERENCE DATA',
    title: 'HMRC added, amended or removed 15 CDS Union document codes from July to September',
    pageTitle: 'CDS Union document code changes Jul–Sep 2026 | Declarix',
    description:
      'HMRC added, amended or removed 15 DE 2/3 Union document codes between 27 July and 2 September 2026, including L159, X803, Y149 and N954.',
    summary:
      'Between 27 July and 2 September 2026 HMRC added L159, Y681, Y764, Y771, Y772, Y773, X803 and Y149 to Appendix 5A (Union), clarified N954, amended Y006, Y007, L159 and Y863, and removed Y851, Y862 and Y928 as no longer in use. L159 and X803 were also added to the licence-type codes, and the national and licence pages now reflect the creation of the Department for Business, Innovation, Science and Trade (BIST).',
    whyItMatters:
      'Removed codes no longer match HMRC reference data, and new codes such as L159 and X803 may be required by tariff measures on the line.',
    operatorAction:
      'Refresh your DE 2/3 code list from the current Appendix 5A Union and 5C licence files, retire Y851, Y862 and Y928, and update licence-issuer references to the Department for Business, Innovation, Science and Trade.',
    topics: ['cds', 'data-element-2-3', 'document-codes', 'licences'],
    impacts: [
      {
        stage: 'document_codes',
        impact: 'Y851, Y862 and Y928 were removed from Appendix 5A Union on 2 September 2026.',
        action: 'Remove the three codes from DE 2/3 pick-lists.',
      },
      {
        stage: 'licences',
        impact: 'L159 was added to Appendix 5C imports on 27 July and X803 was added on 7 August 2026.',
        action: 'Check licence-backed lines for the new codes before submission.',
      },
      {
        stage: 'reference_data',
        impact: 'National and licence code pages now name the Department for Business, Innovation, Science and Trade (BIST).',
        action: 'Update licence-issuer references in templates and desk checklists.',
      },
    ],
    publishedAt: '2026-10-15',
    effectiveFrom: null,
    expiresAt: null,
    observedAt: radarObservations.de23_union.observedAt,
    freshUntil: plusHours(radarObservations.de23_union.observedAt, 24 * 7),
    pollHours: 24,
    correction: { status: 'none', note: null, correctionOf: null },
    source: observed('de23_union', 'Updates to this page: 27 July to 2 September 2026; Appendix 5A Union'),
    supportingSources: [
      observed('de23_licences', 'Updates to this page: 27 July, 7 August and 4 September 2026; Appendix 5C'),
      observed('de23_national', 'Updates to this page: 4 September 2026'),
    ],
    history: octoberCreated('de23_union'),
    related: packCheck('CHECK THE SUPPORTING PACK'),
    review: octoberReview,
  },
  {
    id: 'cds-declaration-simplifications-2026-08-13',
    type: 'guidance_change',
    label: 'COMPLETION INSTRUCTIONS · SIMPLIFICATIONS',
    title: 'HMRC changed 11 CDS import data elements to bring in declaration simplifications',
    pageTitle: 'CDS import declaration simplifications — Aug 2026 | Declarix',
    description:
      'HMRC changed CDS import data elements 1/9, 3/19, 4/11, 5/26, 5/27, 6/9, 6/11, 6/13, 7/2, 7/5 and 7/15 in August 2026 for declaration simplifications.',
    summary:
      'On 13 August 2026 HMRC changed the import Declaration Completion Instructions for Data Elements 1/9, 3/19, 4/11, 5/26, 5/27, 6/9, 6/11, 6/13, 7/2, 7/5 and 7/15 to incorporate declaration simplifications. It also changed requested procedure code series 01, 07, 40, 42, 44, 51, 53, 61, 71 and 78, and the H1 to H5 and I1 declaration category data sets.',
    whyItMatters:
      'Field-level changes alter what each declaration category asks for. Templates built to the old data sets can carry data HMRC no longer asks for, or miss a changed rule.',
    operatorAction:
      'Compare your H1 to H5 and I1 templates field by field with the current Appendix 21 data sets and the 11 changed data elements before the next template release.',
    topics: ['cds', 'completion-instructions', 'data-sets', 'procedure-codes'],
    impacts: [
      {
        stage: 'data_sets',
        impact: 'The H1, H2, H3, H4, H5 and I1 data sets changed on 10 and 13 August 2026.',
        action: 'Re-baseline template field lists against Appendix 21.',
      },
      {
        stage: 'procedure_codes',
        impact: 'Requested procedure code series 01, 07, 40, 42, 44, 51, 53, 61, 71 and 78 changed.',
        action: 'Review procedure-code rules in your software for these series.',
      },
      {
        stage: 'declaration_completion',
        impact: '11 import data elements changed to incorporate declaration simplifications.',
        action: 'Retest the mapping for each changed data element.',
      },
    ],
    publishedAt: '2026-10-15',
    effectiveFrom: null,
    expiresAt: null,
    observedAt: radarObservations.dci_imports.observedAt,
    freshUntil: plusHours(radarObservations.dci_imports.observedAt, 24 * 7),
    pollHours: 24,
    correction: { status: 'none', note: null, correctionOf: null },
    source: observed('dci_imports', 'Updates to this page: 13 August 2026 (12 August 23:15 UTC)'),
    supportingSources: [
      observed('appendix_1', 'Updates to this page: 13 August 2026; Requested Procedure Codes'),
      observed('appendix_21', 'Updates to this page: 10 and 13 August 2026; H1 to H5 and I1 data sets'),
    ],
    history: octoberCreated('dci_imports'),
    related: { href: '/customs-declaration-software/', label: 'SEE DECLARIX DECLARATION SOFTWARE', id: 'declaration_software' },
    review: octoberReview,
  },
  {
    id: 'cds-pva01-workaround-removed-2026-07-30',
    type: 'guidance_change',
    label: 'COMPLETION INSTRUCTIONS · PREFERENCE',
    title: 'HMRC removed the PVA01 workaround and tightened DE 4/17 preference checks',
    pageTitle: 'CDS PVA01 workaround removed, DE 4/17 rule | Declarix',
    description:
      'HMRC removed the CDS PVA01 workaround on 30 July 2026 and said a DE 4/17 preference code must suit the commodity code or the declaration is rejected.',
    summary:
      'On 30 July 2026 HMRC amended the import Declaration Completion Instructions, procedure codes and additional procedure codes to remove the PVA01 workaround. DE 4/17 now highlights that the declared preference code must be compatible with the declared commodity code, otherwise the declaration will be rejected. For APC 2MO, HMRC says preference code 100 can be used where the commodity code does not permit preference code 140.',
    whyItMatters:
      'Templates that still apply the PVA01 workaround, or that set a preference code without checking the commodity code, now produce rejections.',
    operatorAction:
      'Remove the PVA01 workaround from templates and add a check that the DE 4/17 preference code is valid for the declared commodity code before submission.',
    topics: ['cds', 'completion-instructions', 'preference', 'procedure-codes'],
    impacts: [
      {
        stage: 'declaration_completion',
        impact: 'A DE 4/17 preference code that does not suit the commodity code leads to rejection.',
        action: 'Validate the preference code against the commodity code before submission.',
      },
      {
        stage: 'procedure_codes',
        impact: 'Import procedure and additional procedure code instructions changed for PVA01 and APC 2MO.',
        action: 'Under APC 2MO, use preference code 100 where 140 is not permitted for the commodity code.',
      },
      {
        stage: 'additional_information',
        impact: 'AI code PVA01 was updated and AI code BCPEX was added to Appendix 4B.',
        action: 'Refresh AI statement code lists from the current Appendix 4B file.',
      },
    ],
    publishedAt: '2026-10-15',
    effectiveFrom: null,
    expiresAt: null,
    observedAt: radarObservations.dci_imports.observedAt,
    freshUntil: plusHours(radarObservations.dci_imports.observedAt, 24 * 7),
    pollHours: 24,
    correction: { status: 'none', note: null, correctionOf: null },
    source: observed('dci_imports', 'Updates to this page: 30 July 2026 (29 July 23:15 UTC); DE 4/17'),
    supportingSources: [
      observed('appendix_2', 'Updates to this page: 30 July 2026; APC 2MO'),
      observed('ai_codes_de22', 'Updates to this page: 30 July and 3 August 2026; Appendix 4B'),
    ],
    history: octoberCreated('dci_imports'),
    related: packCheck(),
    review: octoberReview,
  },
  {
    id: 'chief-references-removed-2026-08',
    type: 'guidance_change',
    label: 'CHIEF CLOSURE · GUIDANCE CLEAN-UP',
    title: 'HMRC removed remaining CHIEF instructions from end-use, debt and export guidance',
    pageTitle: 'CHIEF references removed from HMRC guidance | Declarix',
    description:
      'HMRC removed CHIEF steps from authorised-use and customs debt guidance in August 2026, saying CHIEF is no longer in use, and updated export guidance.',
    summary:
      'On 6 August 2026 HMRC removed information about using CHIEF to discharge goods under authorised use, stating that CHIEF is no longer in use. On 13 August it removed CHIEF declaration content from its customs debt liability guidance. On 3 September it removed the document-sending service from its page on exports not notified in CDS, saying the service is no longer available.',
    whyItMatters:
      'Desk notes and training that still describe CHIEF steps no longer match HMRC guidance for authorised-use discharge, customs debt or unnotified exports.',
    operatorAction:
      'Remove CHIEF steps from authorised-use discharge, customs debt and unnotified-export procedures, and confirm the current route for each in the HMRC page.',
    topics: ['cds', 'chief', 'authorised-use', 'exports'],
    impacts: [
      {
        stage: 'authorised_use',
        impact: 'HMRC no longer describes CHIEF for discharging goods under authorised use.',
        action: 'Update authorised-use discharge procedures to the current HMRC route.',
      },
      {
        stage: 'customs_debt',
        impact: 'Customs debt liability guidance no longer covers declarations made using CHIEF.',
        action: 'Remove CHIEF references from debt and liability desk notes.',
      },
      {
        stage: 'exports',
        impact: 'The service for sending documents about unnotified exports is no longer available.',
        action: 'Follow the current HMRC page when reporting exports not notified in CDS.',
      },
    ],
    publishedAt: '2026-10-15',
    effectiveFrom: null,
    expiresAt: null,
    observedAt: radarObservations.end_use.observedAt,
    freshUntil: plusHours(radarObservations.end_use.observedAt, 24 * 14),
    pollHours: 48,
    correction: { status: 'none', note: null, correctionOf: null },
    source: observed('end_use', 'Updates to this page: 6 August 2026'),
    supportingSources: [
      observed('customs_debt', 'Updates to this page: 13 August 2026'),
      observed('unnotified_exports', 'Updates to this page: 3 September 2026'),
    ],
    history: octoberCreated('end_use'),
    related: { href: '/customs-clearance-software/', label: 'SEE THE DECLARIX WORKFLOW', id: 'clearance_software' },
    review: octoberReview,
  },
  {
    id: 'customs-civil-penalties-2026-08-12',
    type: 'guidance_change',
    label: 'COMPLIANCE · CIVIL PENALTIES',
    title: 'HMRC added customs civil penalty reason codes 453 and 454 and updated four others',
    pageTitle: 'Customs civil penalty reason codes — Aug 2026 | Declarix',
    description:
      'HMRC added reason codes 453 and 454 to its customs contraventions schedule on 12 August 2026 and clarified first-contravention penalty notices on 31 July.',
    summary:
      "On 12 August 2026 HMRC added reason codes 453 and 454 and updated reason codes 448, 450, 451 and 452 in 'Customs: schedule of contraventions from 1 January 2021'. On 31 July it updated the 'Exceptions' section of Customs Notice 301 to clarify when HMRC may issue a penalty notice for a first contravention.",
    whyItMatters:
      'Civil penalties attach to declaration errors. A team that tracks contravention reason codes can see which control a penalty letter is testing.',
    operatorAction:
      "Read the new and changed reason codes against your error log, and review Notice 301's first-contravention exceptions with whoever signs off declarations.",
    topics: ['compliance', 'penalties'],
    impacts: [
      {
        stage: 'compliance',
        impact: 'Reason codes 453 and 454 were added and 448, 450, 451 and 452 were updated.',
        action: 'Map the reason codes to your error categories and controls.',
      },
      {
        stage: 'declaration_completion',
        impact: 'Notice 301 now clarifies when HMRC may issue a penalty notice for a first contravention.',
        action: 'Brief declaration sign-off staff on the updated exceptions.',
      },
    ],
    publishedAt: '2026-10-15',
    effectiveFrom: null,
    expiresAt: null,
    observedAt: radarObservations.civil_penalties.observedAt,
    freshUntil: plusHours(radarObservations.civil_penalties.observedAt, 24 * 14),
    pollHours: 48,
    correction: { status: 'none', note: null, correctionOf: null },
    source: observed('civil_penalties', 'Updates to this page: 12 August 2026; Customs: schedule of contraventions from 1 January 2021'),
    supportingSources: [observed('notice_301', "Updates to this page: 31 July 2026; 'Exceptions'")],
    history: octoberCreated('civil_penalties'),
    related: packCheck(),
    review: octoberReview,
  },
  {
    id: 'cds-technical-documentation-2026-09-17',
    type: 'technical_release',
    label: 'SOFTWARE INTEGRATION · TECHNICAL RELEASE',
    title: 'HMRC linked a new CDS technical documentation package dated 17 September 2026',
    pageTitle: 'CDS technical documentation — 17 September 2026 | Declarix',
    description:
      'See the HMRC CDS technical documentation package last updated 17 September 2026, which replaces the 9 July bundle in this register, with source proof.',
    summary:
      "HMRC's developer guide now links a 51.8 MB CDS technical documentation ZIP, last updated 17 September 2026, for Community System Providers and third-party software developers. It is the latest package HMRC links, so the 9 July 2026 package recorded earlier in this register is now superseded.",
    whyItMatters:
      "A new package can change specifications or test expectations across the declaration lifecycle. It arrived nine days before HMRC's Release 5.3 deployment window.",
    operatorAction:
      'Compare the 17 September package with the 9 July package and route material specification changes through integration tests before release.',
    topics: ['cds', 'software-integration', 'technical-documentation'],
    impacts: [
      {
        stage: 'notifications',
        impact: 'Package changes may affect notification or status-query implementation details.',
        action: 'Include notification and query journeys in the package comparison and regression suite.',
      },
      {
        stage: 'software_integration',
        impact: 'The 17 September 2026 ZIP is the latest technical-documentation bundle linked by HMRC at capture time.',
        action: 'Record the artifact version and compare technical files before changing an integration.',
      },
    ],
    publishedAt: '2026-10-15',
    effectiveFrom: null,
    expiresAt: null,
    observedAt: radarObservations.cds_technical_documentation.observedAt,
    freshUntil: plusHours(radarObservations.cds_technical_documentation.observedAt, 24 * 7),
    pollHours: 24,
    correction: { status: 'none', note: null, correctionOf: null },
    supersedes: 'cds-technical-documentation-2026-07-09',
    source: observed('cds_technical_documentation', 'Technical Documentation; CDS Technical Documentation ZIP, 51.8MB last updated 17/09/2026', 'hmrc_cds_technical_documentation'),
    history: octoberCreated('cds_technical_documentation'),
    related: { href: '/customs-clearance-software/', label: 'SEE THE DECLARIX WORKFLOW', id: 'clearance_software' },
    review: octoberReview,
  },
  {
    id: 'gvms-port-list-2026-08-19',
    type: 'guidance_change',
    label: 'BORDER MOVEMENTS · GVMS',
    title: 'HMRC added Isle of Man Steam Packet Company and Tilbury 1 to its GVMS lists',
    pageTitle: 'GVMS port list update — August 2026 | Declarix',
    description:
      'HMRC updated its Goods Vehicle Movement Service port list on 19 August 2026 to add Isle of Man Steam Packet Company and Tilbury 1 to three sections.',
    summary:
      'On 19 August 2026 HMRC updated three sections of its list of ports using the Goods Vehicle Movement Service (GVMS): moving goods in and out of Northern Ireland, locations where some carriers may use GVMS, and locations providing Offices of Transit digitally. The update adds Isle of Man Steam Packet Company and Tilbury 1.',
    whyItMatters:
      'Routes through these carriers and locations can now involve a goods movement reference (GMR) or a digital Office of Transit.',
    operatorAction:
      'Check whether any client routes use Isle of Man Steam Packet Company sailings or Tilbury 1, and confirm the GMR and transit steps for those routes.',
    topics: ['gvms', 'border-movements', 'transit'],
    impacts: [
      {
        stage: 'border_movement',
        impact: 'Isle of Man Steam Packet Company and Tilbury 1 now appear in the GVMS carrier and location lists.',
        action: 'Add GMR steps to route plans that use these carriers or locations.',
      },
      {
        stage: 'transit',
        impact: 'The list of locations providing Offices of Transit digitally was updated.',
        action: 'Confirm the Office of Transit handling for affected transit routes.',
      },
    ],
    publishedAt: '2026-10-15',
    effectiveFrom: null,
    expiresAt: null,
    observedAt: radarObservations.gvms_ports.observedAt,
    freshUntil: plusHours(radarObservations.gvms_ports.observedAt, 24 * 14),
    pollHours: 48,
    correction: { status: 'none', note: null, correctionOf: null },
    source: observed('gvms_ports', 'Updates to this page: 19 August 2026'),
    history: octoberCreated('gvms_ports'),
    related: { href: '/customs-workflows/gmr-gvms-checklist/', label: 'OPEN THE GMR AND GVMS CHECKLIST', id: 'gvms_checklist' },
    review: octoberReview,
  },
  {
    id: 'transit-ibf-sevington-holyhead-2027',
    type: 'guidance_change',
    label: 'TRANSIT · INLAND BORDER FACILITIES',
    title: 'HMRC expects Sevington and Holyhead IBF customs checks to move to port sites in 2027',
    pageTitle: 'Sevington and Holyhead IBF changes from 2027 | Declarix',
    description:
      'HMRC expects Sevington and Holyhead inland border facility customs checks to move to port and Getlink sites from early 2027, with Sevington transit ending.',
    summary:
      "HMRC's September 2026 transit newsletter says customs checks at Sevington inland border facility (IBF) are expected to move to sites provided by the Port of Dover and Getlink from early 2027, subject to final confirmation. From then, facilities to start and end transit movements will no longer be provided at Sevington. At Holyhead, checks are intended to move to port-operator infrastructure from early 2027. HMRC says there are no immediate changes.",
    whyItMatters:
      'Transit movements that start or end at Sevington will need a border-location facility, an authorised consignor or consignee, or the transit simplification process.',
    operatorAction:
      'List transit movements that start or end at Sevington or use Holyhead IBF and plan the replacement route. Keep using both IBFs as usual until HMRC confirms the change.',
    topics: ['transit', 'border-movements', 'ncts'],
    impacts: [
      {
        stage: 'transit',
        impact: 'From early 2027, Sevington is expected to stop providing facilities to start and end transit movements.',
        action: 'Choose a border-location facility, an authorised consignor or consignee, or transit simplification.',
      },
      {
        stage: 'border_movement',
        impact: 'Holyhead IBF checks are intended to move to port-operator infrastructure from early 2027.',
        action: 'Follow Holyhead Port updates and plan inspection logistics for 2027.',
      },
    ],
    publishedAt: '2026-10-15',
    effectiveFrom: null,
    expiresAt: null,
    observedAt: radarObservations.transit_ibf_newsletter.observedAt,
    freshUntil: plusHours(radarObservations.transit_ibf_newsletter.observedAt, 24 * 14),
    pollHours: 48,
    correction: { status: 'none', note: null, correctionOf: null },
    source: observed('transit_ibf_newsletter', 'September 2026 newsletter; Sevington IBF; Holyhead IBF'),
    history: octoberCreated('transit_ibf_newsletter'),
    related: { href: '/customs-workflows/t1-ncts-transit-checklist/', label: 'OPEN THE T1 AND NCTS CHECKLIST', id: 'transit_checklist' },
    review: octoberReview,
  },
  {
    id: 'uk-tariff-suspensions-steel-quotas-2026-10-01',
    type: 'tariff_change',
    label: 'TARIFF · REFERENCE DOCUMENTS',
    title: 'New UK tariff suspension and steel quota reference documents took effect on 1 October',
    pageTitle: 'UK tariff suspensions and steel quotas — Oct 2026 | Declarix',
    description:
      'Suspensions of Import Duty Rates version 3.7 and Steel Tariff Quotas version 1.1 took effect on 1 October 2026; CPTPP documents moved to version 1.4.',
    summary:
      "The reference-document pages list Suspensions of Import Duty Rates version 3.7, dated 1 September 2026, and Steel Tariff Quotas version 1.1, dated 1 September 2026, both with entry into force on 1 October 2026. On 7 September the CPTPP Preferential Tariff and CPTPP Origin Reference Document version 1.4, dated 25 August 2026, were added.",
    whyItMatters:
      'A suspended rate or a quota allocation changes the duty on the declaration. Using a superseded version gives the wrong rate.',
    operatorAction:
      'Check commodity lines against suspension version 3.7 and steel quota version 1.1 for declarations from 1 October 2026, and update CPTPP origin checks to version 1.4.',
    topics: ['tariff', 'quotas', 'preference'],
    impacts: [
      {
        stage: 'duty_calculation',
        impact: 'Suspensions version 3.7 and Steel Tariff Quotas version 1.1 entered into force on 1 October 2026.',
        action: 'Recheck suspension and quota rates on lines declared from 1 October.',
      },
      {
        stage: 'origin',
        impact: 'The CPTPP Preferential Tariff and Origin Reference Document moved to version 1.4.',
        action: 'Update CPTPP origin and preference checks to version 1.4.',
      },
    ],
    publishedAt: '2026-10-15',
    effectiveFrom: '2026-10-01T00:00:00Z',
    expiresAt: null,
    observedAt: radarObservations.tariff_suspensions.observedAt,
    freshUntil: plusHours(radarObservations.tariff_suspensions.observedAt, 24 * 14),
    pollHours: 48,
    correction: { status: 'none', note: null, correctionOf: null },
    source: observed('tariff_suspensions', 'Updates to this page: 8 September and 6 October 2026; version 3.7'),
    supportingSources: [
      observed('tariff_quotas', 'Updates to this page: 8 September and 6 October 2026; Steel Tariff Quotas version 1.1'),
      observed('tariff_preferential', 'Updates to this page: 7 September 2026; CPTPP version 1.4'),
    ],
    history: octoberCreated('tariff_suspensions'),
    related: { href: '/tools/customs-value-import-duty-vat-calculator/', label: 'OPEN THE VALUE AND DUTY WORKPAPER', id: 'value_duty_workpaper' },
    review: octoberReview,
  },
  {
    id: 'trade-remedies-notices-2026-23-to-30',
    type: 'tariff_change',
    label: 'TRADE REMEDIES · NOTICES 2026/23 TO 2026/30',
    title: 'Trade remedies notices 2026/23 to 2026/30 set, extended and suspended UK duties',
    pageTitle: 'UK trade remedies notices Aug–Oct 2026 | Declarix',
    description:
      'Notices 2026/23 to 2026/30 set provisional duty on boom lifts and glass containers, extended two steel duties and suspended duty for an excavator maker.',
    summary:
      'Between 19 August and 15 October 2026 the Secretary of State for Business, Innovation, Science and Trade published eight trade remedies notices. They applied provisional anti-dumping duty on boom lifts (2026/23) and glass containers (2026/25) from China; extended anti-dumping duties on welded tubes and pipes from Belarus and China (2026/24) and wire rod from China (2026/26); rejected a definitive anti-subsidy measure on HVO biodiesel from the USA (2026/27); ended registration of creamy/white limestone imports from Portugal from 22 September (2026/28); and, from 15 October, suspended anti-dumping and countervailing duty on certain excavators from China made by Liebherr Machinery (Dalian) Co., Ltd., additional code 8A77 (2026/29 and 2026/30).',
    whyItMatters:
      'Trade remedy duties sit on top of the normal tariff rate. A missed provisional duty or a missed suspension code changes what the importer pays.',
    operatorAction:
      'Flag boom lift and glass container lines from China for provisional duty, and declare additional code 8A77 for qualifying Liebherr Dalian excavators from 15 October 2026.',
    topics: ['tariff', 'trade-remedies', 'additional-codes'],
    impacts: [
      {
        stage: 'duty_calculation',
        impact: 'Provisional anti-dumping duty applies to boom lifts and glass containers from China.',
        action: 'Add the provisional duties to duty calculations for affected commodity lines.',
      },
      {
        stage: 'additional_codes',
        impact: 'Additional code 8A77 suspends excavator duties for Liebherr Machinery (Dalian) Co., Ltd. from 15 October 2026.',
        action: 'Declare 8A77 only for qualifying excavators from that exporter.',
      },
    ],
    publishedAt: '2026-10-15',
    effectiveFrom: null,
    expiresAt: null,
    observedAt: radarObservations.tr_excavators_ad.observedAt,
    freshUntil: plusHours(radarObservations.tr_excavators_ad.observedAt, 24 * 7),
    pollHours: 24,
    correction: { status: 'none', note: null, correctionOf: null },
    source: observed('tr_excavators_ad', 'Trade remedies notice 2026/30 added 15 October 2026'),
    supportingSources: [
      observed('tr_excavators_ad_2026_30', 'Overseas exporters: additional codes; 8A77'),
      observed('tr_excavators_cvd', 'Trade remedies notice 2026/29 added 15 October 2026'),
      observed('tr_boom_lifts', 'Trade remedies notice 2026/23 added 19 August 2026'),
      observed('tr_welded_tubes', 'Trade remedies notice 2026/24 added 20 August 2026'),
      observed('tr_glass', 'Trade remedies notice 2026/25 added 8 September 2026'),
      observed('tr_wire_rod', 'Trade remedies notice 2026/26 added 10 September 2026'),
      observed('tr_hvo', 'Trade remedies notice 2026/27 added 10 September 2026'),
      observed('tr_limestone', 'Trade remedies notice 2026/28 added 21 September 2026'),
    ],
    history: octoberCreated('tr_excavators_ad'),
    related: { href: '/tools/customs-value-import-duty-vat-calculator/', label: 'OPEN THE VALUE AND DUTY WORKPAPER', id: 'value_duty_workpaper' },
    review: octoberReview,
  },
  {
    id: 'uk-cbam-2027-preparation-2026-10-09',
    type: 'policy_change',
    label: 'CARBON BORDER ADJUSTMENT · 2027',
    title: 'UK CBAM starts on 1 January 2027 and HMRC updated its draft force of law notice',
    pageTitle: 'UK CBAM from 1 January 2027 — Oct 2026 update | Declarix',
    description:
      'UK CBAM applies to specified goods imported from 1 January 2027. HMRC updated its policy summary in September and a draft force of law notice on 9 October.',
    summary:
      "HMRC's CBAM policy summary says the UK Carbon Border Adjustment Mechanism will commence on 1 January 2027 and apply to specified goods imported into the UK on or after that date, across the whole UK including Northern Ireland. HMRC updated the summary on 9 September 2026 after laying the CBAM (Emissions and Verification) Regulations 2026, and on 9 October it added the draft emissions and verification force of law notice as an ODT file.",
    whyItMatters:
      'Importers of carbon-intensive goods will need commodity-level CBAM data. Customs desks already hold the commodity codes and origin data that decide scope.',
    operatorAction:
      'Flag clients that import goods in CBAM sectors such as aluminium and iron and steel, and start collecting embedded-emissions data from suppliers before 1 January 2027.',
    topics: ['cbam', 'tariff', 'compliance'],
    impacts: [
      {
        stage: 'tariff_scope',
        impact: 'CBAM applies to specified goods imported on or after 1 January 2027 across the whole UK.',
        action: 'Map client commodity codes to the CBAM scope list.',
      },
      {
        stage: 'supplier_data',
        impact: 'CBAM liability uses the embedded emissions of the imported goods.',
        action: 'Request emissions data from overseas suppliers of in-scope goods.',
      },
    ],
    publishedAt: '2026-10-15',
    effectiveFrom: '2027-01-01T00:00:00Z',
    expiresAt: null,
    observedAt: radarObservations.cbam_policy.observedAt,
    freshUntil: plusHours(radarObservations.cbam_policy.observedAt, 24 * 14),
    pollHours: 48,
    correction: { status: 'none', note: null, correctionOf: null },
    source: observed('cbam_policy', '2. Background; 3. Scope of CBAM'),
    supportingSources: [observed('cbam_force_of_law', 'Updates to this page: 9 October 2026')],
    history: octoberCreated('cbam_policy'),
    related: { href: '/tools/customs-value-import-duty-vat-calculator/', label: 'OPEN THE VALUE AND DUTY WORKPAPER', id: 'value_duty_workpaper' },
    review: octoberReview,
  },
  {
    id: 'export-examination-premises-2026-10-08',
    type: 'guidance_change',
    label: 'EXPORTS · AUTHORISATIONS',
    title: 'HMRC changed how to apply for approval of premises used to examine export goods',
    pageTitle: 'Export examination premises approval — Oct 2026 | Declarix',
    description:
      'HMRC updated its notices under the Customs (Import Duty) (EU Exit) Regulations 2018 on 8 October 2026 to change how export examination sites are approved.',
    summary:
      "On 8 October 2026 HMRC updated 'Notices made under The Customs (Import Duty) (EU Exit) Regulations 2018' to amend the application process for approval of premises used to examine goods declared for export.",
    whyItMatters:
      'Exporters and agents that present goods for examination at their own premises rely on this approval. A changed application route affects anyone applying now.',
    operatorAction:
      'Read the amended notice before applying for approval of an export examination site, and update your internal approval checklist.',
    topics: ['exports', 'authorisations'],
    impacts: [
      {
        stage: 'exports',
        impact: 'The application process for approval of export examination premises changed on 8 October 2026.',
        action: 'Use the amended process for any new application.',
      },
      {
        stage: 'authorisations',
        impact: 'Internal authorisation checklists may still describe the old process.',
        action: 'Update approval checklists from the amended notice.',
      },
    ],
    publishedAt: '2026-10-15',
    effectiveFrom: null,
    expiresAt: null,
    observedAt: radarObservations.import_duty_notices.observedAt,
    freshUntil: plusHours(radarObservations.import_duty_notices.observedAt, 24 * 14),
    pollHours: 48,
    correction: { status: 'none', note: null, correctionOf: null },
    source: observed('import_duty_notices', 'Updates to this page: 8 October 2026'),
    history: octoberCreated('import_duty_notices'),
    related: packCheck(),
    review: octoberReview,
  },
  {
    id: 'cds-cash-account-uk-bank-2026-09-14',
    type: 'guidance_change',
    label: 'PAYMENTS · CDS CASH ACCOUNT',
    title: 'HMRC confirmed CDS cash account withdrawals are paid only to UK bank accounts',
    pageTitle: 'CDS cash account repayment rule — Sept 2026 | Declarix',
    description:
      'HMRC confirmed in August and September 2026 that CDS cash account withdrawals go only to a UK bank account, and expanded customs data guidance in October.',
    summary:
      'HMRC added information on 18 August and 14 September 2026 confirming that funds withdrawn from a Customs Declaration Service cash account can only be paid to a UK-based business or personal bank account. On 2 October it added guidance to its customs data page about holding more than one EORI number, when data appears in the service and which data reports cover.',
    whyItMatters:
      'Agents that manage cash accounts for overseas clients need a UK bank account on file before requesting a withdrawal.',
    operatorAction:
      'Check the bank details for each cash account you manage, and use the updated customs data guidance when a client holds more than one EORI number.',
    topics: ['cds', 'payments', 'customs-data'],
    impacts: [
      {
        stage: 'payments',
        impact: 'CDS cash account withdrawals can only be paid to a UK-based bank account.',
        action: 'Confirm a UK bank account is on file before requesting a withdrawal.',
      },
      {
        stage: 'data_reports',
        impact: 'Customs data guidance now covers more than one EORI number and report timing.',
        action: 'Update reporting procedures for clients with more than one EORI number.',
      },
    ],
    publishedAt: '2026-10-15',
    effectiveFrom: null,
    expiresAt: null,
    observedAt: radarObservations.cash_account.observedAt,
    freshUntil: plusHours(radarObservations.cash_account.observedAt, 24 * 14),
    pollHours: 48,
    correction: { status: 'none', note: null, correctionOf: null },
    source: observed('cash_account', 'Updates to this page: 18 August and 14 September 2026'),
    supportingSources: [observed('customs_data', 'Updates to this page: 2 October 2026')],
    history: octoberCreated('cash_account'),
    related: { href: '/customs-workflows/duty-deferment-account-checklist/', label: 'OPEN THE DUTY DEFERMENT CHECKLIST', id: 'duty_deferment_checklist' },
    review: octoberReview,
  },
  {
    id: 'btom-apha-plant-import-contact-2026-09-17',
    type: 'guidance_change',
    label: 'BTOM · IPAFFS · APHA',
    title: 'APHA replaced its plant health importer email with a contact form',
    pageTitle: 'APHA plant import contact change — Sept 2026 | Declarix',
    description:
      'The BTOM leaflets and IPAFFS guidance changed on 17 September 2026: the APHA phsi-importers email is no longer in use and a contact form replaces it.',
    summary:
      'On 17 September 2026 the Border Target Operating Model information leaflets and the IPAFFS guidance were updated. The email address phsi-importers@apha.gov.uk is no longer in use, and a link to an APHA contact form has been added.',
    whyItMatters:
      'Plant import queries sent to the old address will not reach APHA. Desk contact sheets and escalation notes need the new route.',
    operatorAction:
      'Replace phsi-importers@apha.gov.uk in desk contact sheets and IPAFFS escalation notes with the APHA contact form linked from the guidance.',
    topics: ['btom', 'ipaffs', 'sps'],
    impacts: [
      {
        stage: 'sps_controls',
        impact: 'APHA plant health importer queries now go through a contact form.',
        action: 'Route plant health queries through the linked APHA form.',
      },
      {
        stage: 'contacts',
        impact: 'The email address phsi-importers@apha.gov.uk is no longer in use.',
        action: 'Remove the old address from contact sheets and templates.',
      },
    ],
    publishedAt: '2026-10-15',
    effectiveFrom: null,
    expiresAt: null,
    observedAt: radarObservations.btom_leaflets.observedAt,
    freshUntil: plusHours(radarObservations.btom_leaflets.observedAt, 24 * 14),
    pollHours: 48,
    correction: { status: 'none', note: null, correctionOf: null },
    source: observed('btom_leaflets', 'Updates to this page: 17 September 2026'),
    supportingSources: [observed('ipaffs', 'Updates to this page: 17 September 2026')],
    history: octoberCreated('btom_leaflets'),
    related: { href: '/customs-workflows/ipaffs-import-notification-checklist/', label: 'OPEN THE IPAFFS CHECKLIST', id: 'ipaffs_checklist' },
    review: octoberReview,
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
    publishedAt: '2026-07-17',
    effectiveFrom: null,
    expiresAt: null,
    observedAt: radarObservations.cds_workarounds.observedAt,
    freshUntil: plusHours(radarObservations.cds_workarounds.observedAt, 24 * 7),
    pollHours: 24,
    correction: { status: 'none', note: null, correctionOf: null },
    source: observed('cds_workarounds', 'Updates to this page: 4 July 2026; consolidated document 5.2.0', 'hmrc_cds_known_workarounds'),
    history: [
      ...julyCreated,
      {
        type: 'updated',
        observedAt: radarObservations.cds_workarounds.observedAt,
        note: 'Re-observed on 15 October 2026. HMRC still lists consolidated document 5.2.0, and the page was last updated on 4 July 2026. The retained response hash was refreshed.',
      },
    ],
    related: packCheck('CHECK A DOCUMENT PACK'),
    review: octoberReview,
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
    publishedAt: '2026-07-17',
    effectiveFrom: null,
    expiresAt: null,
    observedAt: '2026-07-17T18:08:43Z',
    freshUntil: '2026-07-24T18:08:43Z',
    pollHours: 24,
    correction: { status: 'none', note: null, correctionOf: null },
    supersededBy: 'cds-technical-documentation-2026-09-17',
    source: {
      id: 'hmrc_cds_technical_documentation',
      publisher: 'HM Revenue & Customs',
      url: 'https://developer.service.hmrc.gov.uk/guides/customs-declarations-end-to-end-service-guide/',
      locator: 'Technical Documentation; CDS Technical Documentation package metadata',
      updatedAt: '2026-07-09T00:00:00Z',
      sha256: '042d6f4f8f711e0371d159421d1d483a6bde808a67bfe6c092a7a9ed893f6128',
      bytes: 28765,
      mediaType: 'text/html',
      licence,
    },
    history: [
      ...julyCreated,
      {
        type: 'superseded',
        observedAt: radarObservations.cds_technical_documentation.observedAt,
        note: 'Superseded on 15 October 2026. HMRC now links a CDS technical documentation ZIP last updated 17 September 2026. This record stays as the history of the 9 July package.',
      },
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
    publishedAt: '2026-07-17',
    effectiveFrom: '2026-07-15T00:00:00Z',
    expiresAt: null,
    observedAt: radarObservations.de23_national.observedAt,
    freshUntil: plusHours(radarObservations.de23_national.observedAt, 24 * 7),
    pollHours: 24,
    correction: { status: 'none', note: null, correctionOf: null },
    source: observed('de23_national', 'Updates to this page: 13 July 2026; document code 9001', 'hmrc_cds_de23_national_codes'),
    history: [
      ...julyCreated,
      {
        type: 'updated',
        observedAt: radarObservations.de23_national.observedAt,
        note: "Re-observed on 15 October 2026. The 13 July change note for code 9001 is still in HMRC's page history. The page was last updated on 4 September 2026 to reflect the creation of the Department for Business, Innovation, Science and Trade.",
      },
    ],
    related: packCheck('CHECK THE SUPPORTING PACK'),
    review: octoberReview,
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
    publishedAt: '2026-07-17',
    effectiveFrom: '2026-07-04T00:00:00Z',
    expiresAt: null,
    observedAt: radarObservations.aggregation.observedAt,
    freshUntil: plusHours(radarObservations.aggregation.observedAt, 24 * 7),
    pollHours: 24,
    correction: { status: 'none', note: null, correctionOf: null },
    source: observed('aggregation', 'Updates to this page: 1 July 2026; Data Element 2/1', 'hmrc_cds_aggregation_rules'),
    history: [
      ...julyCreated,
      {
        type: 'updated',
        observedAt: radarObservations.aggregation.observedAt,
        note: 'Re-observed on 15 October 2026. The 1 July change note is unchanged and the page has no later update. HMRC extended EU EORI guidance to import, export and clearance instructions on 26 September 2026; see the linked record.',
      },
    ],
    related: { href: '/supported-scope/', label: 'CHECK DECLARIX SCOPE', id: 'supported_scope' },
    review: octoberReview,
  },
]

export const radarRecords = records.map((record) => {
  const modifiedAt = latest(record.history.map((event) => event.observedAt))
  return {
    supportingSources: [],
    supersededBy: null,
    supersedes: null,
    ...record,
    path: recordPath(record.id),
    status: record.supersededBy ? 'superseded' : 'current',
    modifiedAt,
  }
})

const recordById = new Map(radarRecords.map((record) => [record.id, record]))
for (const record of radarRecords) {
  for (const linked of [record.supersededBy, record.supersedes].filter(Boolean)) {
    if (!recordById.has(linked)) throw new Error(`Radar record ${record.id} links to unknown record ${linked}`)
  }
}

export const radarLastObservedAt = latest(radarRecords.map((record) => record.modifiedAt))

export const radarDigests = [
  {
    id: '2026-10',
    path: '/research/cds-operations-radar/2026-10/',
    month: 'October 2026',
    title: 'CDS Operations Radar — October 2026 digest | Declarix',
    description:
      'Every material HMRC CDS and UK customs change from mid-July to 15 October 2026, with the deadline, who it affects and the next desk check.',
    h1: 'October 2026: the CDS and customs changes UK desks need to act on.',
    publishedAt: '2026-10-15',
    coversFrom: '2026-07-15',
    coversTo: '2026-10-15',
    lede:
      'HMRC and its partner departments changed CDS completion rules, code lists, Northern Ireland procedures, border services and duty measures between mid-July and 15 October 2026. This digest brings every material change into one place, with the HMRC source, the people it affects and the check to run next.',
    headlines: [
      'All Trader Support Service movements from 20 October 2026 must use the new TSS platform.',
      'HMRC removed the PVA01 workaround: a DE 4/17 preference code that does not suit the commodity code is rejected.',
      'EU EORI guidance now runs through import, export, inventory-export and BIRDS instructions.',
      'H7 is limited to UK Carrier movements into NI that are not at risk, and APC C07 is out on NI H1s.',
      '15 new document codes prepare NI declarations for the EU Deforestation Regulation from 30 December 2026.',
      'UK CBAM starts on 1 January 2027 for specified goods imported into the UK.',
    ],
    sections: [
      {
        heading: 'CDS platform, releases and status',
        lead: 'Release 5.3 went live in a late-September window, HMRC linked a new technical documentation package, and the status page was clear at the time of observation.',
        recordIds: ['cds-service-status-current', 'cds-release-5-3-deployment-2026-09-27', 'cds-technical-documentation-2026-09-17', 'cds-workarounds-release-5-2-0'],
      },
      {
        heading: 'Declaration completion rules',
        lead: 'Field-level changes that decide whether a declaration is accepted: preference codes, simplified data sets, EU EORIs, retired CHIEF steps and penalty reason codes.',
        recordIds: [
          'cds-pva01-workaround-removed-2026-07-30',
          'cds-declaration-simplifications-2026-08-13',
          'cds-eu-eori-completion-instructions-2026-09-26',
          'chief-references-removed-2026-08',
          'customs-civil-penalties-2026-08-12',
        ],
      },
      {
        heading: 'Northern Ireland movements',
        lead: 'The busiest area of change: a new TSS platform, tighter H7 and C07 rules, steel melt and pour codes, and EU Deforestation Regulation codes.',
        recordIds: ['tss-new-platform-2026-10-20', 'cds-ni-h7-ukc-apc-c07-2026-10-06', 'cds-ni-steel-melt-and-pour-codes-2026-10-01', 'cds-ni-eudr-document-codes-2026-12-30'],
      },
      {
        heading: 'Codes and reference data',
        lead: 'Code-list changes that cause silent mismatches when templates fall behind: Union document codes, Vaping Products Duty tax types and goods-location codes.',
        recordIds: ['cds-union-document-codes-jul-sep-2026', 'cds-vaping-products-duty-codes-2026-09-26', 'cds-reference-code-lists-jul-oct-2026'],
      },
      {
        heading: 'Borders, safety and security, transit',
        lead: 'ENS data, GVMS locations, inland border facilities and SPS contact routes.',
        recordIds: ['ics2-ens-data-elements-2026-10-14', 'gvms-port-list-2026-08-19', 'transit-ibf-sevington-holyhead-2027', 'btom-apha-plant-import-contact-2026-09-17'],
      },
      {
        heading: 'Duty, tariff and payments',
        lead: 'Rate and measure changes that alter what the importer pays, plus the 2027 CBAM start and two account-level rules.',
        recordIds: [
          'uk-tariff-suspensions-steel-quotas-2026-10-01',
          'trade-remedies-notices-2026-23-to-30',
          'uk-cbam-2027-preparation-2026-10-09',
          'export-examination-premises-2026-10-08',
          'cds-cash-account-uk-bank-2026-09-14',
        ],
      },
    ],
    keyDates: [
      { date: '2026-10-01', label: 'NI steel melt and pour codes, suspensions version 3.7 and Steel Tariff Quotas version 1.1 apply.', recordId: 'cds-ni-steel-melt-and-pour-codes-2026-10-01' },
      { date: '2026-10-15', label: 'Excavator duty suspension for Liebherr Machinery (Dalian), additional code 8A77, takes effect.', recordId: 'trade-remedies-notices-2026-23-to-30' },
      { date: '2026-10-20', label: 'All TSS goods movements must be submitted on the new TSS platform.', recordId: 'tss-new-platform-2026-10-20' },
      { date: '2026-12-30', label: 'EU Deforestation Regulation applies in Northern Ireland; new DE 2/3 codes in use.', recordId: 'cds-ni-eudr-document-codes-2026-12-30' },
      { date: '2027-01-01', label: 'UK CBAM commences for specified goods imported into the UK.', recordId: 'uk-cbam-2027-preparation-2026-10-09' },
      { date: '2027-01-01', when: 'EARLY 2027', label: 'Sevington and Holyhead IBF customs checks are expected to move to port and Getlink sites.', recordId: 'transit-ibf-sevington-holyhead-2027' },
      { date: '2027-04-01', label: 'Vaping products outside duty suspension in the UK must carry a vaping duty stamp.', recordId: 'cds-vaping-products-duty-codes-2026-09-26' },
    ],
    watchList: [
      {
        title: 'Mandatory registration for customs intermediaries',
        text: 'HMRC opened its consultation on 23 June 2026 and closed it on 21 September 2026. At 15 October 2026 HMRC had not published a response on the consultation page.',
        source: radarObservations.intermediary_consultation,
        related: { href: '/customs-intermediary-registration-2026/', label: 'GET THE REGISTRATION RESPONSE KIT' },
      },
      {
        title: 'Customs modernisation call for evidence',
        text: 'The HMRC and HM Treasury call for evidence on modernising the UK customs regime closed on 15 September 2026. No response was listed on the page at 15 October 2026.',
        source: radarObservations.customs_modernisation_cfe,
      },
      {
        title: 'Workarounds for CDS Release 5.3',
        text: 'HMRC says the workaround document is updated alongside each CDS production release. On 15 October 2026 the page still listed consolidated document 5.2.0, last updated on 4 July 2026.',
        source: radarObservations.cds_workarounds,
      },
    ],
  },
]

for (const digest of radarDigests) {
  for (const section of digest.sections) {
    for (const id of section.recordIds) if (!recordById.has(id)) throw new Error(`Digest ${digest.id} references unknown record ${id}`)
  }
  for (const item of digest.keyDates) if (!recordById.has(item.recordId)) throw new Error(`Digest ${digest.id} key date references unknown record ${item.recordId}`)
}

const digestRecordIds = (digest) => digest.sections.flatMap((section) => section.recordIds)
const digestModifiedAt = (digest) => latest(digestRecordIds(digest).map((id) => recordById.get(id).modifiedAt))
const digestsForRecord = (record) => radarDigests.filter((digest) => digestRecordIds(digest).includes(record.id))

export const radarHub = {
  path: '/research/cds-operations-radar/',
  title: 'CDS Operations Radar — HMRC changes and status | Declarix',
  description:
    'Search source-stamped HMRC CDS status, release, completion-rule, code, Northern Ireland, border and tariff changes with workflow checks and free data.',
  h1: 'CDS changes, translated into the next check.',
  publishedAt: '2026-07-17',
  reviewedOn: isoDay(radarLastObservedAt),
}

export const radarRoutes = [
  { ...radarHub, kind: 'hub' },
  ...radarDigests.map((digest) => ({
    path: digest.path,
    title: digest.title,
    description: digest.description,
    h1: digest.h1,
    reviewedOn: isoDay(digestModifiedAt(digest)),
    kind: 'digest',
    digestId: digest.id,
  })),
  ...radarRecords.map((record) => ({
    path: record.path,
    title: record.pageTitle,
    description: record.description,
    h1: record.title,
    reviewedOn: isoDay(record.modifiedAt),
    kind: 'record',
    recordId: record.id,
  })),
]

export function freshnessState(record, at = radarBuildTime()) {
  if (record.supersededBy) return 'superseded'
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
    superseded: 'SUPERSEDED BY A NEWER RECORD',
  }[state]
}

const freshnessAttributes = (record, state) =>
  `data-radar-freshness data-freshness-state="${state}" data-effective-from="${record.effectiveFrom || ''}" data-expires-at="${record.expiresAt || ''}" data-fresh-until="${record.freshUntil}" data-superseded-by="${record.supersededBy || ''}"`

const organisation = (site) => ({ '@type': 'Organization', '@id': `${site.origin}/#organization`, name: site.company, url: `${site.origin}/` })

function jsonLdHub(site) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      organisation(site),
      {
        '@type': 'CollectionPage',
        '@id': `${site.origin}${radarHub.path}#collection`,
        url: `${site.origin}${radarHub.path}`,
        name: radarHub.title,
        headline: radarHub.h1,
        description: radarHub.description,
        datePublished: radarHub.publishedAt,
        dateModified: radarHub.reviewedOn,
        isAccessibleForFree: true,
        image: `${site.origin}/og.jpg`,
        publisher: { '@id': `${site.origin}/#organization` },
        hasPart: radarDigests.map((digest) => ({ '@type': 'Article', name: digest.title, url: `${site.origin}${digest.path}` })),
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
      organisation(site),
      {
        '@type': 'Article',
        '@id': `${site.origin}${record.path}#article`,
        url: `${site.origin}${record.path}`,
        mainEntityOfPage: `${site.origin}${record.path}`,
        headline: record.title,
        description: record.description,
        datePublished: record.publishedAt,
        dateModified: isoDay(record.modifiedAt),
        inLanguage: 'en-GB',
        isAccessibleForFree: true,
        image: `${site.origin}/og.jpg`,
        author: { '@id': `${site.origin}/#organization` },
        publisher: { '@id': `${site.origin}/#organization` },
        citation: [record.source.url, ...record.supportingSources.map((source) => source.url)],
        about: record.topics,
        ...(record.supersededBy ? { isPartOf: { '@id': `${site.origin}${radarHub.path}#collection` } } : {}),
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

function jsonLdDigest(digest, site) {
  const ids = digestRecordIds(digest)
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      organisation(site),
      {
        '@type': 'Article',
        '@id': `${site.origin}${digest.path}#article`,
        url: `${site.origin}${digest.path}`,
        mainEntityOfPage: `${site.origin}${digest.path}`,
        headline: digest.h1,
        description: digest.description,
        datePublished: digest.publishedAt,
        dateModified: isoDay(digestModifiedAt(digest)),
        inLanguage: 'en-GB',
        isAccessibleForFree: true,
        image: `${site.origin}/og.jpg`,
        author: { '@id': `${site.origin}/#organization` },
        publisher: { '@id': `${site.origin}/#organization` },
        isPartOf: { '@id': `${site.origin}${radarHub.path}#collection` },
        temporalCoverage: `${digest.coversFrom}/${digest.coversTo}`,
        citation: [...new Set(ids.map((id) => recordById.get(id).source.url))],
        hasPart: ids.map((id) => ({ '@type': 'Article', name: recordById.get(id).title, url: `${site.origin}${recordById.get(id).path}` })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.origin}/` },
          { '@type': 'ListItem', position: 2, name: 'CDS Operations Radar', item: `${site.origin}${radarHub.path}` },
          { '@type': 'ListItem', position: 3, name: `${digest.month} digest`, item: `${site.origin}${digest.path}` },
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
        if (node.dataset.supersededBy) return 'superseded';
        const now = Date.now();
        const effective = node.dataset.effectiveFrom ? Date.parse(node.dataset.effectiveFrom) : null;
        const expires = node.dataset.expiresAt ? Date.parse(node.dataset.expiresAt) : null;
        const fresh = Date.parse(node.dataset.freshUntil);
        if (effective && now < effective) return 'not_yet_effective';
        if (expires && now >= expires) return 'expired';
        if (now > fresh) return 'stale';
        return 'current';
      };
      const labels = { current: 'CURRENT OBSERVATION', stale: 'SOURCE RECHECK DUE', expired: 'POINT-IN-TIME RECORD EXPIRED', not_yet_effective: 'NOT YET EFFECTIVE', superseded: 'SUPERSEDED BY A NEWER RECORD' };
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
      document.querySelectorAll('[data-radar-digest-link]').forEach((link) => link.addEventListener('click', () => track('radar_digest_opened', { destination_id: link.dataset.radarDigestLink })));
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
    <div class="masthead-cell"><span>RADAR EDITION</span><strong>${shortDate(radarLastObservedAt)}</strong></div>
    <a class="masthead-cta" data-radar-booking="masthead" href="${bookingHref}">BOOK THE NUMBERS CALL</a>
  </header>
  <nav class="route-nav" aria-label="Primary">${navHtml}</nav>`
}

function shell({ title, description, canonical, schema, css = '/radar.css', body, site, options, recordId = 'hub', ogType = 'article', modifiedOn, publishedOn }) {
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
    <meta property="og:type" content="${ogType}" />
    <meta property="og:site_name" content="Declarix" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${site.origin}/og.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    ${ogType === 'article' ? `<meta property="article:published_time" content="${publishedOn}" />\n    <meta property="article:modified_time" content="${modifiedOn}" />` : ''}
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

function resultRow(record, headingTag = 'h2') {
  const state = freshnessState(record)
  const search = [record.title, record.summary, ...record.topics, ...record.impacts.flatMap((impact) => [impact.stage, impact.impact])]
    .join(' ')
    .toLowerCase()
  return `<article class="radar-result" data-radar-result ${freshnessAttributes(record, state)} data-topics="${record.topics.join(' ')}" data-stages="${record.impacts.map((impact) => impact.stage).join(' ')}" data-search="${escapeHtml(search)}">
        <div class="radar-result-meta"><span>${escapeHtml(record.label)}</span><strong data-freshness-label>${freshnessLabel(state)}</strong></div>
        <div class="radar-result-copy">
          <${headingTag}><a href="${record.path}" data-radar-record-link="${record.id}">${escapeHtml(record.title)}</a></${headingTag}>
          <p>${escapeHtml(record.summary)}</p>
        </div>
        <div class="radar-result-action"><span>OBSERVED ${escapeHtml(displayDate(record.observedAt, true))}</span><b aria-hidden="true">OPEN RECORD →</b></div>
      </article>`
}

function footer(site, extraNav = '') {
  return `<footer class="footer"><span>${site.company.toUpperCase()} · COMPANY ${site.companyNumber} · LEICESTER, ENGLAND</span><nav>${extraNav}<a href="/editorial-policy/">SOURCES &amp; CORRECTIONS</a><a href="/privacy/">PRIVACY</a><a href="/security/">SECURITY</a></nav></footer>`
}

export function renderRadarHub(site, options) {
  const canonical = `${site.origin}${radarHub.path}`
  const count = radarRecords.length
  const currentCount = radarRecords.filter((record) => record.status === 'current').length
  const topics = [...new Set(radarRecords.flatMap((record) => record.topics))].sort()
  const stages = [...new Set(radarRecords.flatMap((record) => record.impacts.map((impact) => impact.stage)))].sort()
  const booking = '/?src=research_cds_operations_radar_hub#book'
  const lastChecked = displayDate(radarLastObservedAt).toUpperCase()
  const digest = radarDigests[radarDigests.length - 1]
  const body = `${masthead(site, options.navHtml, booking)}
    <div class="breadcrumbs"><a href="/">HOME</a> → CDS OPERATIONS RADAR</div>
    <main>
      <header class="hero radar-hero">
        <div class="hero-copy">
          <p class="eyebrow">HMRC CDS CHANGE WATCH · SOURCE-STAMPED · FREE</p>
          <h1>${radarHub.h1}</h1>
          <p>Search ${count} source records across CDS status and releases, completion rules, document and location codes, Northern Ireland movements, ICS2, GVMS, transit, tariff and trade-remedy notices. Each record leads with the change, the workflow it touches and the next check.</p>
        </div>
        <aside class="hero-ledger radar-hero-ledger">
          <span class="route-ref">OPERATIONS RADAR · EDITION ${String(radarDigests.length + 1).padStart(2, '0')}</span>
          <div class="radar-hero-count"><strong>${count}</strong><span>OFFICIAL SOURCE RECORDS</span></div>
          <div class="review-cell"><span>EXACT RESPONSES RECHECKED</span><strong>${shortDate(radarLastObservedAt)}</strong></div>
        </aside>
      </header>
      <div class="hero-value-strip"><strong>${count} EXACT RESPONSES RETAINED</strong><strong>${currentCount} CURRENT · ${count - currentCount} SUPERSEDED</strong><strong>0 AUTO-PUBLISHED DIFFS</strong></div>
      <section class="radar-digest-callout" aria-labelledby="radar-digest-callout-heading">
        <div><span class="section-label">MONTHLY DIGEST · ${escapeHtml(digest.month.toUpperCase())}</span><h2 id="radar-digest-callout-heading">${escapeHtml(digest.h1)}</h2><p>${escapeHtml(digest.lede)}</p></div>
        <a class="button" data-radar-digest-link="${digest.id}" href="${digest.path}">READ THE ${escapeHtml(digest.month.toUpperCase())} DIGEST</a>
      </section>
      <section class="radar-intro">
        <span class="section-label">USE THE CHANGE, THEN CHECK THE SOURCE</span>
        <h2>One operational register. No hunting across update histories.</h2>
        <div><p>The Radar consolidates substantive CDS and UK customs changes that have a durable operator use. It does not create one thin page per error code or turn a source byte-change into an automatic claim.</p><p>Freshness is set when the site is built and recalculated in your browser from each retained observation. A stale, expired or superseded record stays useful as history, but it cannot present itself as a green live status.</p></div>
      </section>
      <section class="radar-register" aria-labelledby="radar-register-heading">
        <header><span class="section-label">SEARCH THE REGISTER</span><h2 id="radar-register-heading">Find the change in your workflow.</h2></header>
        <form class="radar-filters" data-radar-filters role="search">
          <label><span>SEARCH</span><input type="search" name="q" placeholder="Code, workaround, EORI, H7, TSS…" autocomplete="off" /></label>
          <label><span>TOPIC</span><select name="topic"><option value="all">ALL TOPICS</option>${topics.map((topic) => `<option value="${topic}">${stageLabel(topic)}</option>`).join('')}</select></label>
          <label><span>WORKFLOW</span><select name="stage"><option value="all">ALL STAGES</option>${stages.map((stage) => `<option value="${stage}">${stageLabel(stage)}</option>`).join('')}</select></label>
          <label><span>FRESHNESS</span><select name="state"><option value="all">ALL STATES</option><option value="current">CURRENT OBSERVATION</option><option value="stale">SOURCE RECHECK DUE</option><option value="expired">EXPIRED POINT-IN-TIME</option><option value="not_yet_effective">NOT YET EFFECTIVE</option><option value="superseded">SUPERSEDED</option></select></label>
          <button type="button" data-radar-clear>CLEAR FILTERS</button>
        </form>
        <div class="radar-result-count"><output data-radar-result-count aria-live="polite">${count} RECORDS</output><span>UPDATED ${lastChecked}</span></div>
        <div class="radar-results">${radarRecords.map((record) => resultRow(record)).join('')}</div>
        <div class="radar-empty" data-radar-empty hidden><strong>NO MATCHING RECORD</strong><p>Clear one or more filters to return to the full source register.</p></div>
      </section>
      <section class="radar-downloads" id="downloads">
        <header><span class="section-label">UNGATED DATA</span><h2>Take the Radar into your change review.</h2><p>Download the ${count} public records with source URLs, observation windows, workflow stages, snapshot hashes, supersession links and correction state. No email wall.</p></header>
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
    ${footer(site)}`
  return shell({ title: radarHub.title, description: radarHub.description, canonical, schema: jsonLdHub(site), body, site, options, ogType: 'website' })
}

function timingRows(record, state) {
  return `<div class="radar-timing-grid" ${freshnessAttributes(record, state)}>
    <div><span>OBSERVED</span><strong>${escapeHtml(displayDate(record.observedAt, true))}</strong></div>
    <div><span>EFFECTIVE</span><strong>${escapeHtml(displayDate(record.effectiveFrom))}</strong></div>
    <div><span>FRESH UNTIL</span><strong>${escapeHtml(displayDate(record.freshUntil, true))}</strong></div>
    <div><span>STATE</span><strong data-freshness-label>${freshnessLabel(state)}</strong></div>
  </div>`
}

function relatedRecords(record) {
  const others = radarRecords.filter((candidate) => candidate.id !== record.id && !candidate.supersededBy)
  const score = (candidate) => candidate.topics.filter((topic) => topic !== 'cds' && record.topics.includes(topic)).length
  return [...others].sort((a, b) => score(b) - score(a)).slice(0, 3)
}

function sourceProof(source) {
  return `<dl><div><dt>PUBLISHER</dt><dd>${escapeHtml(source.publisher)}</dd></div><div><dt>SOURCE LOCATOR</dt><dd>${escapeHtml(source.locator)}</dd></div><div><dt>SOURCE UPDATED</dt><dd>${escapeHtml(displayDate(source.updatedAt, true))}</dd></div><div><dt>RESPONSE</dt><dd>${source.bytes.toLocaleString('en-GB')} BYTES · ${escapeHtml(source.mediaType)}</dd></div><div><dt>SHA-256</dt><dd><code>${source.sha256}</code></dd></div><div><dt>LICENCE</dt><dd>${escapeHtml(source.licence)}</dd></div></dl>`
}

export function renderRadarRecord(record, site, options) {
  if (!record.review.publicationReady) throw new Error(`Radar record ${record.id} is not publication-ready`)
  if (record.review.state === 'agent_source_verified' && record.review.publicationScope !== 'narrow_primary_source_fact') {
    throw new Error(`Radar record ${record.id} exceeds the agent-source-verification publication scope`)
  }
  const canonical = `${site.origin}${record.path}`
  const booking = `/?src=radar_${record.id}#book`
  const state = freshnessState(record)
  const observedDay = new Date(record.observedAt)
  const observedMonth = new Intl.DateTimeFormat('en-GB', { month: 'short', timeZone: 'UTC' }).format(observedDay).toUpperCase()
  const observedTime = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }).format(observedDay)
  const successor = record.supersededBy ? recordById.get(record.supersededBy) : null
  const predecessor = record.supersedes ? recordById.get(record.supersedes) : null
  const digests = digestsForRecord(record)
  const siblingLinks = relatedRecords(record)
    .map((candidate) => `<a href="${candidate.path}" data-radar-record-link="${candidate.id}"><span>${escapeHtml(candidate.label)}</span><strong>${escapeHtml(candidate.title)}</strong><b>OPEN →</b></a>`)
    .join('')
  const lineage = successor
    ? `<p class="radar-lineage-note"><strong>SUPERSEDED.</strong> A newer HMRC source replaces this observation. <a href="${successor.path}" data-radar-record-link="${successor.id}">Open the current record: ${escapeHtml(successor.title)} →</a></p>`
    : predecessor
      ? `<p class="radar-lineage-note"><strong>REPLACES AN EARLIER RECORD.</strong> <a href="${predecessor.path}" data-radar-record-link="${predecessor.id}">See the superseded record: ${escapeHtml(predecessor.title)} →</a></p>`
      : ''
  const supporting = record.supportingSources.length
    ? `<div class="radar-supporting"><h3>SUPPORTING OFFICIAL SOURCES</h3><ol>${record.supportingSources
        .map(
          (source) =>
            `<li><a data-radar-source="${source.id}" href="${source.url}">${escapeHtml(source.title)}</a><span>${escapeHtml(source.publisher)} · ${escapeHtml(source.locator)} · UPDATED ${escapeHtml(displayDate(source.updatedAt).toUpperCase())}</span><code>${source.sha256}</code></li>`,
        )
        .join('')}</ol></div>`
    : ''
  const digestLinks = digests
    .map((digest) => `<a class="text-action" data-radar-digest-link="${digest.id}" href="${digest.path}">READ THE ${escapeHtml(digest.month.toUpperCase())} DIGEST →</a>`)
    .join('')
  const reviewer = record.review.reviewerIdentity
  const body = `${masthead(site, options.navHtml, booking)}
    <div class="breadcrumbs"><a href="/">HOME</a> → <a href="${radarHub.path}">CDS OPERATIONS RADAR</a> → ${escapeHtml(record.label)}</div>
    <main>
      <header class="hero radar-record-hero">
        <div class="hero-copy">
          <p class="eyebrow">${escapeHtml(record.label)} · ${escapeHtml(record.source.publisher.toUpperCase())} SOURCE RECORD</p>
          <h1>${escapeHtml(record.title)}</h1>
          <p>${escapeHtml(record.summary)}</p>
          ${lineage}
          <div class="report-actions"><a class="button" data-radar-source="${record.source.id}" href="${record.source.url}">OPEN THE OFFICIAL SOURCE</a><button class="text-action" type="button" data-radar-share>SHARE RECORD</button></div>
        </div>
        <aside class="hero-ledger radar-record-ledger" ${freshnessAttributes(record, state)}>
          <span class="route-ref">${escapeHtml(record.id.toUpperCase())}</span>
          <div class="radar-record-date"><strong>${observedDay.getUTCDate()}</strong><span>${observedMonth}<br />${observedDay.getUTCFullYear()}</span></div>
          <div class="review-cell"><span data-freshness-label>${freshnessLabel(state)}</span><strong>OBSERVED ${observedTime} UTC</strong></div>
        </aside>
      </header>
      <section class="radar-answer">
        <div><span class="section-label">WHY THIS MAY MATTER</span><h2>${escapeHtml(record.whyItMatters)}</h2></div>
        <div class="radar-next-check"><span>CHECK NEXT</span><p>${escapeHtml(record.operatorAction)}</p></div>
      </section>
      <section class="radar-workflow" aria-labelledby="workflow-heading-${record.id}">
        <header><span class="section-label">WORKFLOW IMPACT</span><h2 id="workflow-heading-${record.id}">Put the source into the right desk check.</h2><p>The impact notes below are bounded operator prompts. Follow the linked official instruction for the exact condition.</p></header>
        <div class="table-scroll" tabindex="0" role="region" aria-label="Workflow impact table"><table><caption>Workflow stages connected to this source record</caption><thead><tr><th scope="col">STAGE</th><th scope="col">WHAT MAY CHANGE</th><th scope="col">NEXT CHECK</th></tr></thead><tbody>${record.impacts.map((impact) => `<tr><th scope="row">${stageLabel(impact.stage)}</th><td>${escapeHtml(impact.impact)}</td><td>${escapeHtml(impact.action)}</td></tr>`).join('')}</tbody></table></div>
      </section>
      <section class="radar-value-actions">
        <header><span class="section-label">USEFUL NEXT ACTIONS</span><h2>Take the change into a real workflow.</h2></header>
        <div class="radar-action-grid"><a data-radar-related="${record.related.id}" href="${record.related.href}"><span>RELATED TOOL OR WORKFLOW</span><strong>${escapeHtml(record.related.label)}</strong><b>OPEN →</b></a><a class="radar-action-primary" data-radar-booking="after_value" href="${booking}"><span>20-MINUTE WORKFLOW CALL</span><strong>MAP THIS CHANGE TO YOUR DESK</strong><b>BOOK THE CALL →</b></a></div>
      </section>
      <section class="radar-evidence">
        <header><span class="section-label">FRESHNESS + CORRECTION</span><h2>Know which observation you are using.</h2><p>The page remains available as a durable record when its observation becomes stale, expires or is superseded. The state above is set at build time and rechecked in the browser; the official link remains the place to check current conditions.</p></header>
        ${timingRows(record, state)}
        <div class="radar-correction"><span>CORRECTION STATE</span><strong>${record.correction.status === 'none' ? 'NO CORRECTION RECORDED' : escapeHtml(record.correction.status.toUpperCase())}</strong><p>${record.correction.note ? escapeHtml(record.correction.note) : 'If the source fact or our transcription needs correction, the old event stays in history and the corrected version is published here.'}</p><a href="/editorial-policy/">REPORT OR REVIEW A CORRECTION →</a></div>
      </section>
      <section class="radar-source-proof">
        <header><span class="section-label">PRIMARY SOURCE PROOF</span><h2>Trace the sentence to the retained response.</h2></header>
        ${sourceProof(record.source)}
        ${supporting}
        <p class="radar-review-note"><strong>Review label:</strong> source checked by the named Declarix verification agent <code>${reviewer}</code> and owner-authorized for a narrow primary-source fact. This is not labelled as human customs interpretation; broader conclusions stay outside this record.</p>
        <a class="button button-quiet" data-radar-source="${record.source.id}" href="${record.source.url}">READ THE OFFICIAL SOURCE</a>
      </section>
      <section class="radar-history">
        <header><span class="section-label">APPEND-ONLY HISTORY</span><h2>What changed in this record.</h2></header>
        <ol>${record.history.map((event) => `<li><time datetime="${event.observedAt}">${escapeHtml(displayDate(event.observedAt, true))}</time><strong>${escapeHtml(event.type.toUpperCase())}</strong><p>${escapeHtml(event.note)}</p></li>`).join('')}</ol>
      </section>
      <section class="radar-more"><header><span class="section-label">MORE CDS OPERATIONS RECORDS</span><h2>Continue through the register.</h2></header><div>${siblingLinks}</div><p class="radar-more-links">${digestLinks}<a class="text-action" href="${radarHub.path}">VIEW ALL ${radarRecords.length} RECORDS →</a></p></section>
    </main>
    ${footer(site, `<a href="${radarHub.path}">RADAR</a>`)}`
  return shell({
    title: record.pageTitle,
    description: record.description,
    canonical,
    schema: jsonLdRecord(record, site),
    body,
    site,
    options,
    recordId: record.id,
    publishedOn: record.publishedAt,
    modifiedOn: isoDay(record.modifiedAt),
  })
}

export function renderRadarDigest(digest, site, options) {
  const canonical = `${site.origin}${digest.path}`
  const booking = `/?src=radar_digest_${digest.id}#book`
  const ids = digestRecordIds(digest)
  const digestRecords = ids.map((id) => recordById.get(id))
  const sourceCount = new Set(digestRecords.flatMap((record) => [record.source.url, ...record.supportingSources.map((source) => source.url)])).size
  const newCount = digestRecords.filter((record) => record.publishedAt === digest.publishedAt).length
  const futureDates = digest.keyDates.filter((item) => item.date > digest.publishedAt).length
  const sections = digest.sections
    .map(
      (section, index) => `<section class="radar-register radar-digest-section" aria-labelledby="digest-section-${index + 1}">
        <header><span class="section-label">${String(index + 1).padStart(2, '0')} · ${section.recordIds.length} RECORDS</span><h2 id="digest-section-${index + 1}">${escapeHtml(section.heading)}</h2><p>${escapeHtml(section.lead)}</p></header>
        <div class="radar-results">${section.recordIds.map((id) => resultRow(recordById.get(id), 'h3')).join('')}</div>
      </section>`,
    )
    .join('')
  const keyDates = `<div class="table-scroll" tabindex="0" role="region" aria-label="Key dates table"><table><caption>Dated changes and deadlines in this digest</caption><thead><tr><th scope="col">DATE</th><th scope="col">WHAT HAPPENS</th><th scope="col">RECORD</th></tr></thead><tbody>${digest.keyDates
    .map((item) => {
      const record = recordById.get(item.recordId)
      return `<tr><th scope="row">${escapeHtml(item.when || displayDate(item.date).toUpperCase())}</th><td>${escapeHtml(item.label)}</td><td><a href="${record.path}" data-radar-record-link="${record.id}">${escapeHtml(record.label)} →</a></td></tr>`
    })
    .join('')}</tbody></table></div>`
  const watch = digest.watchList
    .map(
      (item) => `<li><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.text)}</p><span><a data-radar-source="watch_${escapeHtml(item.source.url.split('/').pop())}" href="${item.source.url}">${escapeHtml(item.source.title)}</a> · ${escapeHtml(item.source.publisher)} · CHECKED ${escapeHtml(displayDate(item.source.observedAt).toUpperCase())} · SHA-256 <code>${item.source.sha256.slice(0, 16)}…</code></span>${item.related ? `<a class="text-action" data-radar-related="registration_kit" href="${item.related.href}">${escapeHtml(item.related.label)} →</a>` : ''}</li>`,
    )
    .join('')
  const body = `${masthead(site, options.navHtml, booking)}
    <div class="breadcrumbs"><a href="/">HOME</a> → <a href="${radarHub.path}">CDS OPERATIONS RADAR</a> → ${escapeHtml(digest.month.toUpperCase())} DIGEST</div>
    <main>
      <header class="hero radar-hero radar-digest-hero">
        <div class="hero-copy">
          <p class="eyebrow">CDS OPERATIONS RADAR · MONTHLY DIGEST · ${escapeHtml(displayDate(digest.coversFrom).toUpperCase())} TO ${escapeHtml(displayDate(digest.coversTo).toUpperCase())}</p>
          <h1>${escapeHtml(digest.h1)}</h1>
          <p>${escapeHtml(digest.lede)}</p>
          <div class="report-actions"><a class="button" data-radar-download="json" href="/downloads/cds-operations-radar-v1.json" download>DOWNLOAD THE DATA</a><button class="text-action" type="button" data-radar-share>SHARE THE DIGEST</button></div>
        </div>
        <aside class="hero-ledger radar-hero-ledger">
          <span class="route-ref">DIGEST ${escapeHtml(digest.id)}</span>
          <div class="radar-hero-count"><strong>${ids.length}</strong><span>CHANGES WITH A DESK CHECK</span></div>
          <div class="review-cell"><span>OFFICIAL SOURCES RETAINED</span><strong>${sourceCount}</strong></div>
        </aside>
      </header>
      <div class="hero-value-strip"><strong>${newCount} NEW RECORDS THIS EDITION</strong><strong>${futureDates} DEADLINES STILL AHEAD</strong><strong>EVERY LINE LINKED TO GOV.UK</strong></div>
      <section class="radar-intro radar-digest-headlines">
        <div><span class="section-label">THE SHORT VERSION</span><h2>Six changes to brief your desk on this week.</h2></div>
        <div><ol>${digest.headlines.map((headline) => `<li>${escapeHtml(headline)}</li>`).join('')}</ol><p>Each line links through to a source record with the HMRC wording, the workflow stage it touches, the next check and a SHA-256 hash of the retained official response.</p></div>
      </section>
      <section class="radar-workflow radar-digest-dates" aria-labelledby="digest-dates-heading">
        <header><span class="section-label">KEY DATES</span><h2 id="digest-dates-heading">Put these dates in the desk diary.</h2><p>Dates come from the linked official sources. Where HMRC has not confirmed an exact date, the table says so.</p></header>
        ${keyDates}
      </section>
      ${sections}
      <section class="radar-evidence radar-digest-watch" aria-labelledby="digest-watch-heading">
        <header><span class="section-label">ON THE WATCH LIST</span><h2 id="digest-watch-heading">Expected, but not yet published.</h2><p>These items have an official source but no published outcome at the time of this edition. The Radar adds a record when HMRC publishes one.</p></header>
        <ul class="radar-watch-list">${watch}</ul>
      </section>
      <section class="radar-method" id="method">
        <span class="section-label">HOW THIS DIGEST WAS BUILT</span><h2>Read from GOV.UK. Hashed. Then written up.</h2>
        <ol><li><strong>01 · SWEEP</strong><span>Every HMRC, Border Force, Defra and trade-remedies update from ${escapeHtml(displayDate(digest.coversFrom))} was screened for customs desk impact.</span></li><li><strong>02 · RETAIN</strong><span>Each source response was fetched from the GOV.UK Content API and stored with its SHA-256 hash and byte count.</span></li><li><strong>03 · STATE</strong><span>Each record states only what the source says, in plain English, with the exact change-note date.</span></li><li><strong>04 · KEEP</strong><span>Older records stay online. Replaced observations are marked superseded and link to the newer record.</span></li></ol>
      </section>
      <section class="next-actions radar-next-actions">
        <header><span class="section-label">FROM CHANGE TO WORKFLOW</span><h2>Turn this month's changes into fewer rejections.</h2><p>Declarix builds CDS-ready entry packs from customer documents, so code and completion-rule changes land in one place. Run the free pack check on a live declaration, or bring your volumes to a 20-minute numbers call.</p></header>
        <div class="radar-action-grid"><a data-radar-related="pack_checker" href="/tools/customs-document-pack-check/"><span>FREE OPERATOR TOOL</span><strong>RUN THE DOCUMENT PACK CHECK</strong><b>OPEN TOOL →</b></a><a class="radar-action-primary" data-radar-booking="bottom_cta" href="${booking}"><span>20-MINUTE NUMBERS CALL</span><strong>MAP THESE CHANGES TO YOUR DESK</strong><b>BOOK THE CALL →</b></a></div>
      </section>
    </main>
    ${footer(site, `<a href="${radarHub.path}">RADAR</a>`)}`
  return shell({
    title: digest.title,
    description: digest.description,
    canonical,
    schema: jsonLdDigest(digest, site),
    body,
    site,
    options,
    recordId: `digest_${digest.id}`,
    publishedOn: digest.publishedAt,
    modifiedOn: isoDay(digestModifiedAt(digest)),
  })
}

export function radarJson() {
  return `${JSON.stringify(
    {
      schema_version: '1.1',
      generated_at: radarLastObservedAt,
      record_count: radarRecords.length,
      digests: radarDigests.map((digest) => ({ digest_id: digest.id, path: digest.path, covers_from: digest.coversFrom, covers_to: digest.coversTo, record_ids: digestRecordIds(digest) })),
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
        published_at: record.publishedAt,
        modified_at: record.modifiedAt,
        superseded_by: record.supersededBy,
        supersedes: record.supersedes,
        correction: record.correction,
        review: record.review,
        provenance: record.source,
        supporting_provenance: record.supportingSources,
        history: record.history,
        path: record.path,
      })),
    },
    null,
    2,
  )}\n`
}

const csvEscape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`

export function radarCsv() {
  const header = ['record_id', 'record_type', 'title', 'observed_at', 'fresh_until', 'effective_from', 'expires_at', 'topics', 'workflow_stages', 'source_url', 'snapshot_sha256', 'correction_status', 'review_state', 'publication_scope', 'path', 'status', 'superseded_by', 'published_at', 'modified_at', 'supporting_source_urls']
  const rows = radarRecords.map((record) => [record.id, record.type, record.title, record.observedAt, record.freshUntil, record.effectiveFrom, record.expiresAt, record.topics.join('|'), record.impacts.map((impact) => impact.stage).join('|'), record.source.url, record.source.sha256, record.correction.status, record.review.state, record.review.publicationScope, record.path, record.status, record.supersededBy, record.publishedAt, record.modifiedAt, record.supportingSources.map((source) => source.url).join('|')])
  return `${[header, ...rows].map((row) => row.map(csvEscape).join(',')).join('\n')}\n`
}
