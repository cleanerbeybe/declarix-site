// SoftwareApplication entity for Declarix. Offers are built from scripts/pricing.mjs
// (the approved packages), so the structured data can never drift from /pricing/.
import { packages } from './pricing.mjs'

export const softwareSchemaPaths = ['/', '/pricing/', '/customs-declaration-software/', '/customs-clearance-software/']

const gbp = (value) => `£${value.toLocaleString('en-GB')}`

export function softwareApplicationNode(site) {
  return {
    '@type': 'SoftwareApplication',
    '@id': `${site.origin}/#software`,
    name: 'Declarix',
    url: `${site.origin}/`,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description:
      'Up to 3× more customs declarations per clerk with no new headcount. Declarix builds CDS-ready entry packs for Sequoia, Descartes and customer integrations.',
    image: `${site.origin}/og.jpg`,
    publisher: { '@id': `${site.origin}/#organization` },
    offers: packages.map((tier) => ({
      '@type': 'Offer',
      name: tier.name,
      description: `${gbp(tier.monthly)} / month · ${tier.included.toLocaleString('en-GB')} packs included · £${tier.rate.toFixed(2)} / extra pack`,
      price: tier.monthly.toFixed(2),
      priceCurrency: 'GBP',
      url: `${site.origin}/pricing/`,
      priceSpecification: [
        {
          '@type': 'UnitPriceSpecification',
          price: tier.monthly.toFixed(2),
          priceCurrency: 'GBP',
          referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: 'MON' },
        },
        {
          '@type': 'UnitPriceSpecification',
          name: 'Extra pack',
          price: tier.rate.toFixed(2),
          priceCurrency: 'GBP',
          referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitText: 'pack' },
        },
      ],
      eligibleQuantity: { '@type': 'QuantitativeValue', value: tier.included, unitText: 'packs per month' },
    })),
  }
}
