// Approved 24 September 2026: monthly allowance + same-rate overage, with a £3 floor.
export const packages = [
  { name: 'Desk', monthly: 500, included: 100, rate: 5 },
  { name: 'Team', monthly: 4000, included: 1000, rate: 4 },
  { name: 'Scale', monthly: 9000, included: 3000, rate: 3 },
]

export function priceForVolume(volume) {
  if (!Number.isSafeInteger(volume) || volume < 1 || volume > 1000000) throw new RangeError('Enter a whole number of packs from 1 to 1,000,000.')
  if (volume > 3000) return { name: 'Quoted', total: volume * 3, included: volume, overage: 0, rate: 3, quoted: true }
  const priced = packages.map((tier) => ({
    name: tier.name, total: tier.monthly + Math.max(0, volume - tier.included) * tier.rate,
    included: tier.included, overage: Math.max(0, volume - tier.included), rate: tier.rate, quoted: false,
  }))
  // Equal totals prefer the package with the larger allowance.
  return priced.reduce((best, option) => option.total <= best.total ? option : best)
}

export function renderPricingTable() {
  const rows = packages.map((tier) => `<tr><th scope="row">${tier.name}</th><td><span class="sr-only">Monthly fee: </span>£${tier.monthly.toLocaleString('en-GB')} / month</td><td><span class="sr-only">Included: </span>${tier.included.toLocaleString('en-GB')} packs</td><td><span class="sr-only">Rate: </span>£${tier.rate.toFixed(2)} / pack</td><td><span class="sr-only">Extra packs: </span>£${tier.rate.toFixed(2)} / extra pack</td></tr>`).join('')
  return `<section class="pricing-offer" aria-labelledby="packages-heading">
    <span class="section-label">MONTHLY PACKAGES</span><h2 id="packages-heading">A bigger desk without a bigger team.</h2>
    <p>One monthly allowance. The same clear rate for every pack above it.</p>
    <div class="pricing-table-wrap"><table><caption>Declarix monthly declaration pack packages</caption><thead><tr><th scope="col">Package</th><th scope="col">Monthly fee</th><th scope="col">Included</th><th scope="col">Rate</th><th scope="col">Extra packs</th></tr></thead><tbody>${rows}</tbody></table></div>
    <p class="pricing-example">For example: 2,000 packs on Team = £4,000 + 1,000 extra packs × £4.00 = <strong>£8,000 / month</strong>.</p>
    <a class="button" href="/roi-calculator/">CALCULATE YOUR CAPACITY AND PLAN →</a>
  </section>`
}
