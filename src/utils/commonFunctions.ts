import { getAllCountries } from 'rc-geographic';

const countries = getAllCountries();

export const countryToIso2 = countries.reduce((acc, country) => {
  acc[country.name] = country.iso2;
  return acc;
}, {} as any);
