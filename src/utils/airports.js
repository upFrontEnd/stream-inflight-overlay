export const ICAO_PREFIX_COUNTRY = [
  /* ── North America ─────────────────────── */
  ["PAJ", "US"], ["PAK", "US"], ["PAL", "US"],
  ["PAM", "US"], ["PAN", "US"], ["PAO", "US"],
  ["PAP", "HT"], // Haïti (exception dans le bloc PA)
  ["PA",  "US"], // Alaska
  ["PH",  "US"], // Hawaï
  ["PG",  "GU"], // Guam
  ["K",   "US"], // États-Unis (continental)
  ["CY",  "CA"], ["CZ",  "CA"], // Canada
  ["CU",  "CU"], // Cuba
  ["C",   "CA"], // Canada
  ["MB",  "BS"], // Bahamas
  ["MD",  "DO"], // République dominicaine
  ["MH",  "HN"], // Honduras
  ["MK",  "JM"], // Jamaïque
  ["MM",  "MX"], // Mexique
  ["MN",  "NI"], // Nicaragua
  ["MP",  "PA"], // Panama
  ["MR",  "CR"], // Costa Rica
  ["MS",  "SV"], // Salvador
  ["MT",  "HT"], // Haïti
  ["MU",  "CU"], // Cuba
  ["MW",  "KY"], // Îles Caïmans
  ["MX",  "MX"], // Mexique
  ["MY",  "BS"], // Bahamas
  ["MZ",  "BZ"], // Belize
  ["M",   "MX"], // Mexique
  ["SA",  "AR"], // Argentine
  ["SB",  "BR"], // Brésil
  ["SC",  "CL"], // Chili
  ["SE",  "EC"], // Équateur
  ["SF",  "FK"], // Îles Malouines
  ["SG",  "PY"], // Paraguay
  ["SK",  "CO"], // Colombie
  ["SL",  "BO"], // Bolivie
  ["SM",  "SR"], // Suriname
  ["SO",  "GF"], // Guyane française
  ["SP",  "PE"], // Pérou
  ["SU",  "UY"], // Uruguay
  ["SV",  "VE"], // Venezuela
  ["SW",  "BR"], // Brésil
  ["SY",  "GY"], // Guyana
  ["T",   "TT"], // Caraïbes (approx.)
  ["TF",  "GP"], // Guadeloupe
  ["TI",  "VI"], // Îles Vierges américaines
  ["TJ",  "PR"], // Porto Rico
  ["TK",  "KN"], // Saint-Kitts-et-Nevis
  ["TL",  "LC"], // Sainte-Lucie
  ["TN",  "AN"], // Antilles néerlandaises
  ["TQ",  "AI"], // Anguilla
  ["TT",  "TT"], // Trinité-et-Tobago
  ["TV",  "VC"], // Saint-Vincent-et-les-Grenadines
  ["TX",  "BM"], // Bermudes

  /* ── Europe ────────────────────────────── */
  ["LA",  "AL"], // Albanie
  ["LB",  "BG"], // Bulgarie
  ["LC",  "CY"], // Chypre
  ["LD",  "HR"], // Croatie
  ["LE",  "ES"], // Espagne
  ["LF",  "FR"], // France
  ["LG",  "GR"], // Grèce
  ["LH",  "HU"], // Hongrie
  ["LI",  "IT"], // Italie
  ["LJ",  "SI"], // Slovénie
  ["LK",  "CZ"], // République tchèque
  ["LL",  "IL"], // Israël
  ["LM",  "MT"], // Malte
  ["LN",  "MC"], // Monaco
  ["LO",  "AT"], // Autriche
  ["LP",  "PT"], // Portugal
  ["LQ",  "BA"], // Bosnie-Herzégovine
  ["LR",  "RO"], // Roumanie
  ["LS",  "CH"], // Suisse
  ["LT",  "TR"], // Turquie
  ["LU",  "MD"], // Moldavie
  ["LW",  "MK"], // Macédoine du Nord
  ["LX",  "GI"], // Gibraltar
  ["LY",  "RS"], // Serbie
  ["LZ",  "SK"], // Slovaquie
  ["EB",  "BE"], // Belgique
  ["ED",  "DE"], // Allemagne (civil)
  ["EH",  "NL"], // Pays-Bas
  ["EI",  "IE"], // Irlande
  ["EK",  "DK"], // Danemark
  ["EL",  "LU"], // Luxembourg
  ["EN",  "NO"], // Norvège
  ["EP",  "PL"], // Pologne
  ["ES",  "SE"], // Suède
  ["ET",  "DE"], // Allemagne (militaire)
  ["EV",  "LV"], // Lettonie
  ["EY",  "LT"], // Lituanie
  ["EE",  "EE"], // Estonie
  ["EF",  "FI"], // Finlande
  ["EG",  "GB"], // Royaume-Uni
  ["UK",  "UA"], // Ukraine
  ["UM",  "BY"], // Biélorussie
  ["UU",  "RU"], // Russie (ouest)
  ["UL",  "RU"], // Russie
  ["UE",  "RU"], // Russie
  ["UI",  "RU"], // Russie
  ["UN",  "RU"], // Russie
  ["US",  "RU"], // Russie
  ["UT",  "TJ"], // Tadjikistan
  ["UB",  "AZ"], // Azerbaïdjan
  ["UG",  "GE"], // Géorgie
  ["UC",  "KG"], // Kirghizistan
  ["UD",  "AM"], // Arménie
  ["UO",  "RU"], // Russie
  ["UH",  "RU"], // Russie
  ["U",   "RU"], // Russie

  /* ── Moyen-Orient & Afrique ─────────────── */
  ["OA",  "AF"], // Afghanistan
  ["OB",  "BH"], // Bahreïn
  ["OE",  "SA"], // Arabie saoudite
  ["OI",  "IR"], // Iran
  ["OJ",  "JO"], // Jordanie
  ["OK",  "KW"], // Koweït
  ["OL",  "LB"], // Liban
  ["OM",  "AE"], // Émirats arabes unis
  ["OO",  "SA"], // Arabie saoudite
  ["OP",  "PK"], // Pakistan
  ["OR",  "IQ"], // Irak
  ["OS",  "SY"], // Syrie
  ["OT",  "QA"], // Qatar
  ["OY",  "YE"], // Yémen
  ["O",   "IR"], // Iran
  ["DA",  "DZ"], // Algérie
  ["DB",  "BJ"], // Bénin
  ["DF",  "BF"], // Burkina Faso
  ["DG",  "GH"], // Ghana
  ["DI",  "CI"], // Côte d'Ivoire
  ["DN",  "NG"], // Nigeria
  ["DR",  "NE"], // Niger
  ["DT",  "TN"], // Tunisie
  ["DX",  "TG"], // Togo
  ["FA",  "ZA"], // Afrique du Sud
  ["FB",  "BW"], // Botswana
  ["FC",  "CG"], // République du Congo
  ["FD",  "SZ"], // Eswatini
  ["FE",  "CF"], // République centrafricaine
  ["FG",  "GQ"], // Guinée équatoriale
  ["FH",  "SH"], // Sainte-Hélène
  ["FI",  "IO"], // BIOT (territoire britannique)
  ["FJ",  "IO"], // BIOT
  ["FK",  "CM"], // Cameroun
  ["FL",  "ZM"], // Zambie
  ["FM",  "MG"], // Madagascar
  ["FN",  "AO"], // Angola
  ["FO",  "GA"], // Gabon
  ["FP",  "ST"], // Sao Tomé-et-Principe
  ["FQ",  "MZ"], // Mozambique
  ["FS",  "SC"], // Seychelles
  ["FT",  "TD"], // Tchad
  ["FV",  "ZW"], // Zimbabwe
  ["FW",  "MW"], // Malawi
  ["FX",  "LS"], // Lesotho
  ["FY",  "NA"], // Namibie
  ["FZ",  "CD"], // RD Congo
  ["GA",  "ML"], // Mali
  ["GB",  "GM"], // Gambie
  ["GC",  "ES"], // Îles Canaries
  ["GE",  "ES"], // Espagne (Ceuta/Melilla)
  ["GF",  "SL"], // Sierra Leone
  ["GG",  "GW"], // Guinée-Bissau
  ["GL",  "LR"], // Liberia
  ["GM",  "MA"], // Maroc
  ["GO",  "SN"], // Sénégal
  ["GQ",  "MR"], // Mauritanie
  ["GS",  "EH"], // Sahara occidental
  ["GU",  "GN"], // Guinée
  ["GV",  "CV"], // Cap-Vert
  ["HA",  "ET"], // Éthiopie
  ["HB",  "SO"], // Somalie
  ["HC",  "SO"], // Somalie
  ["HD",  "SO"], // Somalie
  ["HE",  "EG"], // Égypte
  ["HH",  "ER"], // Érythrée
  ["HK",  "KE"], // Kenya
  ["HL",  "LY"], // Libye
  ["HR",  "RW"], // Rwanda
  ["HS",  "SD"], // Soudan
  ["HT",  "TZ"], // Tanzanie
  ["HU",  "UG"], // Ouganda

  /* ── Asie-Pacifique ─────────────────────── */
  ["NZ",  "NZ"], // Nouvelle-Zélande
  ["NS",  "WS"], // Samoa
  ["NF",  "FJ"], // Fidji
  ["NT",  "PF"], // Polynésie française
  ["NW",  "NC"], // Nouvelle-Calédonie
  ["VH",  "AU"], // Australie
  ["Y",   "AU"], // Australie
  ["WA",  "ID"], // Indonésie
  ["WB",  "BN"], // Brunei / Malaisie
  ["WI",  "ID"], // Indonésie
  ["WM",  "MY"], // Malaisie
  ["WP",  "TL"], // Timor-Leste
  ["WQ",  "ID"], // Indonésie
  ["WS",  "SG"], // Singapour
  ["VB",  "MM"], // Myanmar
  ["VC",  "LK"], // Sri Lanka
  ["VD",  "KH"], // Cambodge
  ["VE",  "IN"], // Inde (est)
  ["VG",  "BD"], // Bangladesh
  ["VI",  "IN"], // Inde (nord)
  ["VL",  "LA"], // Laos
  ["VM",  "MO"], // Macao
  ["VN",  "NP"], // Népal
  ["VO",  "IN"], // Inde (sud)
  ["VQ",  "BT"], // Bhoutan
  ["VR",  "MV"], // Maldives
  ["VT",  "TH"], // Thaïlande
  ["VV",  "VN"], // Vietnam
  ["VY",  "MM"], // Myanmar
  ["ZB",  "CN"], // Chine
  ["ZG",  "CN"], // Chine
  ["ZH",  "CN"], // Chine
  ["ZJ",  "CN"], // Chine
  ["ZK",  "CN"], // Chine
  ["ZL",  "CN"], // Chine
  ["ZM",  "CN"], // Chine
  ["ZP",  "CN"], // Chine
  ["ZS",  "CN"], // Chine
  ["ZU",  "CN"], // Chine
  ["ZW",  "CN"], // Chine
  ["ZY",  "CN"], // Chine
  ["Z",   "CN"], // Chine
  ["RK",  "KR"], // Corée du Sud
  ["RJ",  "JP"], // Japon
  ["RO",  "JP"], // Japon
  ["RP",  "PH"], // Philippines
  ["RC",  "TW"], // Taïwan
  ["RB",  "KR"], // Corée du Sud
];

export function normalizeICAO(value) {
  return String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

export function normalizeCountryCode(value) {
  return String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, 2);
}

export function getAirportCountry(icao) {
  const normalizedICAO = normalizeICAO(icao);
  if (!normalizedICAO) return "";

  const airportDatabase = window.AIRPORT_COUNTRY_BY_ICAO;
  if (airportDatabase && typeof airportDatabase === "object") {
    const country = normalizeCountryCode(airportDatabase[normalizedICAO]);
    if (country) return country;
  }

  for (const [prefix, country] of ICAO_PREFIX_COUNTRY) {
    if (normalizedICAO.startsWith(prefix)) return country;
  }

  return "";
}

export function getCountryName(countryCode) {
  const normalized = normalizeCountryCode(countryCode);
  if (!normalized) return "";
  try {
    const displayNames = new Intl.DisplayNames(["fr"], { type: "region" });
    return displayNames.of(normalized) || normalized;
  } catch {
    return normalized;
  }
}
