export interface ColorTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    "muted-foreground": string;
    card: string;
    "card-foreground": string;
    border: string;
    input: string;
    ring: string;
  };
  isCustom?: boolean;
}

export const defaultThemes: ColorTheme[] = [
  {
    id: "default",
    name: "Default",
    colors: {
      background: "hsl(0 0% 100%)",
      foreground: "hsl(222.2 84% 4.9%)",
      card: "hsl(0 0% 100%)",
      "card-foreground": "hsl(222.2 84% 4.9%)",
      primary: "hsl(222.2 47.4% 11.2%)",
      secondary: "hsl(217.2 32.6% 17.5%)",
      muted: "hsl(210 40% 96.1%)",
      "muted-foreground": "hsl(215.4 16.3% 46.9%)",
      accent: "hsl(210 40% 90%)",
      border: "hsl(214.3 31.8% 91.4%)",
      input: "hsl(214.3 31.8% 91.4%)",
      ring: "hsl(222.2 84% 4.9%)",
    }
  },
  {
    id: "forest",
    name: "Forest",
    colors: {
      background: "hsl(120 15% 95%)",
      foreground: "hsl(150 40% 20%)",
      card: "hsl(120 15% 98%)",
      "card-foreground": "hsl(150 40% 20%)",
      primary: "hsl(150 40% 30%)",
      secondary: "hsl(140 30% 40%)",
      muted: "hsl(140 40% 90%)",
      "muted-foreground": "hsl(150 25% 40%)",
      accent: "hsl(140 40% 85%)",
      border: "hsl(140 30% 85%)",
      input: "hsl(140 30% 85%)",
      ring: "hsl(150 40% 30%)",
    }
  },
  {
    id: "ocean",
    name: "Ocean",
    colors: {
      background: "hsl(200 15% 95%)",
      foreground: "hsl(200 60% 20%)",
      card: "hsl(200 15% 98%)",
      "card-foreground": "hsl(200 60% 20%)",
      primary: "hsl(200 60% 30%)",
      secondary: "hsl(200 40% 40%)",
      muted: "hsl(190 40% 90%)",
      "muted-foreground": "hsl(200 25% 40%)",
      accent: "hsl(190 40% 85%)",
      border: "hsl(200 30% 85%)",
      input: "hsl(200 30% 85%)",
      ring: "hsl(200 60% 30%)",
    }
  },
  {
    id: "sunset",
    name: "Sunset",
    colors: {
      background: "hsl(30 15% 95%)",
      foreground: "hsl(20 60% 20%)",
      card: "hsl(30 15% 98%)",
      "card-foreground": "hsl(20 60% 20%)",
      primary: "hsl(20 60% 30%)",
      secondary: "hsl(30 40% 40%)",
      muted: "hsl(40 40% 90%)",
      "muted-foreground": "hsl(20 25% 40%)",
      accent: "hsl(40 40% 85%)",
      border: "hsl(30 30% 85%)",
      input: "hsl(30 30% 85%)",
      ring: "hsl(20 60% 30%)",
    }
  },
  {
    id: "royal",
    name: "Royal",
    colors: {
      background: "hsl(270 15% 95%)",
      foreground: "hsl(270 60% 20%)",
      card: "hsl(270 15% 98%)",
      "card-foreground": "hsl(270 60% 20%)",
      primary: "hsl(270 60% 30%)",
      secondary: "hsl(280 40% 40%)",
      muted: "hsl(275 40% 90%)",
      "muted-foreground": "hsl(270 25% 40%)",
      accent: "hsl(275 40% 85%)",
      border: "hsl(270 30% 85%)",
      input: "hsl(270 30% 85%)",
      ring: "hsl(270 60% 30%)",
    }
  },
  {
    id: "rose",
    name: "Rose",
    colors: {
      background: "hsl(350 15% 95%)",
      foreground: "hsl(350 60% 20%)",
      card: "hsl(350 15% 98%)",
      "card-foreground": "hsl(350 60% 20%)",
      primary: "hsl(350 60% 30%)",
      secondary: "hsl(340 40% 40%)",
      muted: "hsl(345 40% 90%)",
      "muted-foreground": "hsl(350 25% 40%)",
      accent: "hsl(345 40% 85%)",
      border: "hsl(350 30% 85%)",
      input: "hsl(350 30% 85%)",
      ring: "hsl(350 60% 30%)",
    }
  }
];

export function createCustomTheme(id: string, name: string, baseHue: number): ColorTheme {
  return {
    id,
    name,
    isCustom: true,
    colors: {
      background: `hsl(${baseHue} 15% 95%)`,
      foreground: `hsl(${baseHue} 60% 20%)`,
      card: `hsl(${baseHue} 15% 98%)`,
      "card-foreground": `hsl(${baseHue} 60% 20%)`,
      primary: `hsl(${baseHue} 60% 30%)`,
      secondary: `hsl(${baseHue + 10} 40% 40%)`,
      muted: `hsl(${baseHue + 5} 40% 90%)`,
      "muted-foreground": `hsl(${baseHue} 25% 40%)`,
      accent: `hsl(${baseHue + 5} 40% 85%)`,
      border: `hsl(${baseHue} 30% 85%)`,
      input: `hsl(${baseHue} 30% 85%)`,
      ring: `hsl(${baseHue} 60% 30%)`,
    }
  };
}
