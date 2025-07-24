
const COUNTRIES = {
  US: 'United States',
  DE: 'Germany',
  GB: 'Great Britain',
  FR: 'France',
  JP: 'Japan',
  BR: 'Brazil',
}


export function getCountryName(code) {
  return COUNTRIES[code]
}