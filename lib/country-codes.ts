export interface CountryCode {
  name: string;
  code: string;
  dial_code: string;
  flag: string;
}

export const countryCodes: CountryCode[] = [
  {
    name: "India",
    code: "IN",
    dial_code: "+91",
    flag: "🇮🇳"
  },
  {
    name: "United States",
    code: "US",
    dial_code: "+1",
    flag: "🇺🇸"
  },
  {
    name: "United Kingdom",
    code: "GB",
    dial_code: "+44",
    flag: "🇬🇧"
  },
  // Add more countries as needed
];

export function formatPhoneNumber(phoneNumber: string, countryCode: string): string {
  // Remove any non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Remove country code if it exists at the start
  const number = cleaned.startsWith(countryCode.replace('+', '')) 
    ? cleaned.slice(countryCode.replace('+', '').length)
    : cleaned;

  return `${countryCode}${number}`;
}

export function validatePhoneNumber(phoneNumber: string, countryCode: string): boolean {
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Basic validation rules by country
  switch(countryCode) {
    case '+91': // India
      return cleaned.length === 10;
    case '+1':  // US/Canada
      return cleaned.length === 10;
    case '+44': // UK
      return cleaned.length >= 10 && cleaned.length <= 11;
    default:
      return cleaned.length >= 8 && cleaned.length <= 15; // General international
  }
}

export function getCountryFromPhone(phoneNumber: string): CountryCode | undefined {
  return countryCodes.find(country => 
    phoneNumber.startsWith(country.dial_code)
  );
}
