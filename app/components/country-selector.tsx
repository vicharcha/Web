"use client"

import { useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { countryCodes, CountryCode } from '@/lib/country-codes'
import { Check } from 'lucide-react'

interface CountrySelectorProps {
  selected: string;
  onSelect: (code: string) => void;
}

export function CountrySelector({ selected, onSelect }: CountrySelectorProps) {
  const selectedCountry = countryCodes.find(c => c.dial_code === selected)

  const handleSelect = useCallback((country: CountryCode) => {
    onSelect(country.dial_code)
  }, [onSelect])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="w-[130px] justify-start gap-2"
        >
          <span>{selectedCountry?.flag}</span>
          <span>{selectedCountry?.dial_code}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px] max-h-[300px] overflow-y-auto">
        {countryCodes.map((country) => (
          <DropdownMenuItem
            key={country.code}
            className="flex items-center justify-between"
            onClick={() => handleSelect(country)}
          >
            <div className="flex items-center gap-2">
              <span>{country.flag}</span>
              <span className="text-sm">{country.name}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {country.dial_code}
            </span>
            {selected === country.dial_code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
