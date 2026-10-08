"use strict";

import "../scss/style.scss";

(() => {

  /* =========================================================
     DOM
  ========================================================= */

  const viewport =
    document.querySelector(".viewport");

  const overlay =
    document.querySelector(".overlay");


  const progressLeft =
    document.querySelector("[data-progress-left]");

  const progressRight =
    document.querySelector("[data-progress-right]");

  const progressText =
    document.querySelector("[data-progress-text]");


  const departureCode =
    document.querySelector("#departure-code");

  const arrivalCode =
    document.querySelector("#arrival-code");

  const departureFlag =
    document.querySelector("#departure-flag");

  const arrivalFlag =
    document.querySelector("#arrival-flag");


  const flightPhase =
    document.querySelector("#flight-phase");

  const flightPhaseGroup =
    document.querySelector(".info-group--phase");


  const callsign =
    document.querySelector("#callsign");

  const latestFollower =
    document.querySelector("#latest-follower");

  const latestSub =
    document.querySelector("#latest-sub");


  if (!viewport || !overlay) {
    return;
  }


  /* =========================================================
     CONSTANTS
  ========================================================= */

  const BASE_WIDTH = 1920;
  const HEADER_HEIGHT = 160;

  const FLAG_BASE_URL =
    "https://flagcdn.com";


  const FALLBACK_AIRPORT_COUNTRIES = {
    LFPG: "FR",
    KJFK: "US"
  };


  /*
    ICAO prefix → ISO 3166-1 alpha-2 country code.
    Ordered from most specific (4 chars) to least (1 char)
    so the lookup tries longer prefixes first.
  */

  const ICAO_PREFIX_COUNTRY = [

    /* ── North America ─────────────────────── */
    ["PAJ", "US"], ["PAK", "US"], ["PAL", "US"],
    ["PAM", "US"], ["PAN", "US"], ["PAO", "US"],
    ["PAP", "HT"],
    ["PA",  "US"], // Alaska
    ["PH",  "US"], // Hawaii
    ["PG",  "GU"], // Guam
    ["K",   "US"],
    ["CY",  "CA"], ["CZ",  "CA"],
    ["CU",  "CU"],
    ["C",   "CA"],
    ["MB",  "BS"], // Bahamas
    ["MD",  "DO"], // Dominican Republic
    ["MH",  "HN"], // Honduras
    ["MK",  "JM"], // Jamaica
    ["MM",  "MX"], // Mexico
    ["MN",  "NI"], // Nicaragua
    ["MP",  "PA"], // Panama
    ["MR",  "CR"], // Costa Rica
    ["MS",  "SV"], // El Salvador
    ["MT",  "HT"], // Haiti
    ["MU",  "CU"], // Cuba
    ["MW",  "KY"], // Cayman Islands
    ["MX",  "MX"],
    ["MY",  "BS"],
    ["MZ",  "BZ"], // Belize
    ["M",   "MX"],
    ["SA",  "AR"], // Argentina
    ["SB",  "BR"], // Brazil
    ["SC",  "CL"], // Chile
    ["SE",  "EC"], // Ecuador
    ["SF",  "FK"], // Falkland Islands
    ["SG",  "PY"], // Paraguay
    ["SK",  "CO"], // Colombia
    ["SL",  "BO"], // Bolivia
    ["SM",  "SR"], // Suriname
    ["SO",  "GF"], // French Guiana
    ["SP",  "PE"], // Peru
    ["SU",  "UY"], // Uruguay
    ["SV",  "VE"], // Venezuela
    ["SW",  "BR"],
    ["SY",  "GY"], // Guyana
    ["T",   "TT"], // Caribbean (approx)
    ["TF",  "GP"], // Guadeloupe
    ["TI",  "VI"], // US Virgin Islands
    ["TJ",  "PR"], // Puerto Rico
    ["TK",  "KN"], // Saint Kitts
    ["TL",  "LC"], // Saint Lucia
    ["TN",  "AN"], // Netherlands Antilles
    ["TQ",  "AI"], // Anguilla
    ["TT",  "TT"], // Trinidad
    ["TV",  "VC"], // Saint Vincent
    ["TX",  "BM"], // Bermuda

    /* ── Europe ────────────────────────────── */
    ["LA",  "AL"], // Albania
    ["LB",  "BG"], // Bulgaria
    ["LC",  "CY"], // Cyprus
    ["LD",  "HR"], // Croatia
    ["LE",  "ES"], // Spain
    ["LF",  "FR"], // France
    ["LG",  "GR"], // Greece
    ["LH",  "HU"], // Hungary
    ["LI",  "IT"], // Italy
    ["LJ",  "SI"], // Slovenia
    ["LK",  "CZ"], // Czech Republic
    ["LL",  "IL"], // Israel
    ["LM",  "MT"], // Malta
    ["LN",  "MC"], // Monaco
    ["LO",  "AT"], // Austria
    ["LP",  "PT"], // Portugal
    ["LQ",  "BA"], // Bosnia
    ["LR",  "RO"], // Romania
    ["LS",  "CH"], // Switzerland
    ["LT",  "TR"], // Turkey
    ["LU",  "MD"], // Moldova
    ["LW",  "MK"], // North Macedonia
    ["LX",  "GI"], // Gibraltar
    ["LY",  "RS"], // Serbia
    ["LZ",  "SK"], // Slovakia
    ["EB",  "BE"], // Belgium
    ["ED",  "DE"], // Germany (civil)
    ["EH",  "NL"], // Netherlands
    ["EI",  "IE"], // Ireland
    ["EK",  "DK"], // Denmark
    ["EL",  "LU"], // Luxembourg
    ["EN",  "NO"], // Norway
    ["EP",  "PL"], // Poland
    ["ES",  "SE"], // Sweden
    ["ET",  "DE"], // Germany (military)
    ["EV",  "LV"], // Latvia
    ["EY",  "LT"], // Lithuania
    ["EE",  "EE"], // Estonia
    ["EF",  "FI"], // Finland
    ["EG",  "GB"], // United Kingdom
    ["EK",  "DK"],
    ["UK",  "UA"], // Ukraine
    ["UM",  "BY"], // Belarus
    ["UU",  "RU"], // Russia (western)
    ["UL",  "RU"],
    ["UE",  "RU"],
    ["UI",  "RU"],
    ["UN",  "RU"],
    ["US",  "RU"],
    ["UT",  "TJ"], // Tajikistan (approx Central Asia)
    ["UB",  "AZ"], // Azerbaijan
    ["UG",  "GE"], // Georgia
    ["UC",  "KG"], // Kyrgyzstan
    ["UD",  "AM"], // Armenia
    ["UO",  "RU"],
    ["UH",  "RU"],
    ["U",   "RU"],

    /* ── Middle East & Africa ───────────────── */
    ["OA",  "AF"], // Afghanistan
    ["OB",  "BH"], // Bahrain
    ["OE",  "SA"], // Saudi Arabia
    ["OI",  "IR"], // Iran
    ["OJ",  "JO"], // Jordan
    ["OK",  "KW"], // Kuwait
    ["OL",  "LB"], // Lebanon
    ["OM",  "AE"], // UAE
    ["OO",  "SA"],
    ["OP",  "PK"], // Pakistan
    ["OR",  "IQ"], // Iraq
    ["OS",  "SY"], // Syria
    ["OT",  "QA"], // Qatar
    ["OY",  "YE"], // Yemen
    ["O",   "IR"],
    ["DA",  "DZ"], // Algeria
    ["DB",  "BJ"], // Benin
    ["DF",  "BF"], // Burkina Faso
    ["DG",  "GH"], // Ghana
    ["DI",  "CI"], // Côte d'Ivoire
    ["DN",  "NG"], // Nigeria
    ["DR",  "NE"], // Niger
    ["DT",  "TN"], // Tunisia
    ["DX",  "TG"], // Togo
    ["FA",  "ZA"], // South Africa
    ["FB",  "BW"], // Botswana
    ["FC",  "CG"], // Republic of Congo
    ["FD",  "SZ"], // Eswatini
    ["FE",  "CF"], // Central African Republic
    ["FG",  "GQ"], // Equatorial Guinea
    ["FH",  "SH"], // Saint Helena
    ["FI",  "IO"], // BIOT
    ["FJ",  "IO"],
    ["FK",  "CM"], // Cameroon
    ["FL",  "ZM"], // Zambia
    ["FM",  "MG"], // Madagascar
    ["FN",  "AO"], // Angola
    ["FO",  "GA"], // Gabon
    ["FP",  "ST"], // São Tomé
    ["FQ",  "MZ"], // Mozambique
    ["FS",  "SC"], // Seychelles
    ["FT",  "TD"], // Chad
    ["FV",  "ZW"], // Zimbabwe
    ["FW",  "MW"], // Malawi
    ["FX",  "LS"], // Lesotho
    ["FY",  "NA"], // Namibia
    ["FZ",  "CD"], // DR Congo
    ["GA",  "ML"], // Mali
    ["GB",  "GM"], // Gambia
    ["GC",  "ES"], // Canary Islands
    ["GE",  "ES"],
    ["GF",  "SL"], // Sierra Leone
    ["GG",  "GW"], // Guinea-Bissau
    ["GL",  "LR"], // Liberia
    ["GM",  "MA"], // Morocco
    ["GO",  "SN"], // Senegal
    ["GQ",  "MR"], // Mauritania
    ["GS",  "EH"], // Western Sahara
    ["GU",  "GN"], // Guinea
    ["GV",  "CV"], // Cape Verde
    ["HA",  "ET"], // Ethiopia
    ["HB",  "SO"], // Somalia
    ["HC",  "SO"],
    ["HD",  "SO"],
    ["HE",  "EG"], // Egypt
    ["HH",  "ER"], // Eritrea
    ["HK",  "KE"], // Kenya
    ["HL",  "LY"], // Libya
    ["HR",  "RW"], // Rwanda
    ["HS",  "SD"], // Sudan
    ["HT",  "TZ"], // Tanzania
    ["HU",  "UG"], // Uganda

    /* ── Asia Pacific ───────────────────────── */
    ["NZ",  "NZ"], // New Zealand
    ["NS",  "WS"], // Samoa
    ["NF",  "FJ"], // Fiji
    ["NT",  "PF"], // French Polynesia
    ["NW",  "NC"], // New Caledonia
    ["VH",  "AU"], // Australia
    ["Y",   "AU"],
    ["WA",  "ID"], // Indonesia
    ["WB",  "BN"], // Brunei / Malaysia
    ["WI",  "ID"],
    ["WM",  "MY"], // Malaysia
    ["WP",  "TL"], // Timor-Leste
    ["WQ",  "ID"],
    ["WS",  "SG"], // Singapore
    ["VB",  "MM"], // Myanmar
    ["VC",  "LK"], // Sri Lanka
    ["VD",  "KH"], // Cambodia
    ["VE",  "IN"], // India (east)
    ["VG",  "BD"], // Bangladesh
    ["VH",  "HK"], // Hong Kong (overlap handled above)
    ["VI",  "IN"], // India (north)
    ["VL",  "LA"], // Laos
    ["VM",  "MO"], // Macau
    ["VN",  "NP"], // Nepal
    ["VO",  "IN"], // India (south)
    ["VQ",  "BT"], // Bhutan
    ["VR",  "MV"], // Maldives
    ["VT",  "TH"], // Thailand
    ["VV",  "VN"], // Vietnam
    ["VY",  "MM"],
    ["ZB",  "CN"], // China
    ["ZG",  "CN"],
    ["ZH",  "CN"],
    ["ZJ",  "CN"],
    ["ZK",  "CN"],
    ["ZL",  "CN"],
    ["ZM",  "CN"],
    ["ZP",  "CN"],
    ["ZS",  "CN"],
    ["ZU",  "CN"],
    ["ZW",  "CN"],
    ["ZY",  "CN"],
    ["Z",   "CN"],
    ["RK",  "KR"], // South Korea
    ["RJ",  "JP"], // Japan
    ["RO",  "JP"],
    ["RP",  "PH"], // Philippines
    ["RC",  "TW"], // Taiwan
    ["RB",  "KR"],
    ["VD",  "KH"],
    ["VL",  "LA"],
  ];


  const VALID_FLIGHT_PHASES =
    new Set([
      "PREFLIGHT",
      "TAXI",
      "TAKEOFF",
      "CLIMB",
      "CRUISE",
      "DESCENT",
      "APPROACH",
      "LANDING"
    ]);


  /* =========================================================
     STATE
  ========================================================= */

  let pendingResizeFrame = 0;


  const socialAnimationTimers =
    new WeakMap();


  /* =========================================================
     RESPONSIVE OVERLAY
  ========================================================= */

  function fitOverlay() {

    const width =
      viewport.clientWidth;

    const height =
      viewport.clientHeight;


    if (
      width <= 0 ||
      height <= 0
    ) {
      return;
    }


    const scale =
      Math.min(
        1,
        width / BASE_WIDTH,
        height / HEADER_HEIGHT
      );


    overlay.style.setProperty(
      "--overlay-scale",
      scale.toFixed(6)
    );

  }


  function scheduleResize() {

    if (pendingResizeFrame) {
      cancelAnimationFrame(
        pendingResizeFrame
      );
    }


    pendingResizeFrame =
      requestAnimationFrame(() => {

        pendingResizeFrame = 0;

        fitOverlay();

      });

  }


  /* =========================================================
     FLIGHT PROGRESS
  ========================================================= */

  function setFlightProgress(
    percentage
  ) {

    const numericValue =
      Number(percentage);


    if (!Number.isFinite(numericValue)) {
      return;
    }


    const value =
      Math.min(
        100,
        Math.max(
          0,
          numericValue
        )
      );


    /*
      0 → 50 %
      remplit le trajet gauche.

      50 → 100 %
      remplit le trajet droit.
    */

    const leftProgress =
      Math.min(
        value / 50,
        1
      );


    const rightProgress =
      Math.max(
        0,
        (value - 50) / 50
      );


    if (progressLeft) {

      progressLeft.style.strokeDashoffset =
        String(
          100 -
          leftProgress * 100
        );

    }


    if (progressRight) {

      progressRight.style.strokeDashoffset =
        String(
          100 -
          rightProgress * 100
        );

    }


    if (progressText) {

      progressText.textContent =
        String(
          Math.round(value)
        );

    }

  }


  /* =========================================================
     AIRPORT HELPERS
  ========================================================= */

  function normalizeICAO(
    value
  ) {

    return String(
      value ?? ""
    )
      .trim()
      .toUpperCase()
      .replace(
        /[^A-Z0-9]/g,
        ""
      );

  }


  function normalizeCountryCode(
    value
  ) {

    return String(
      value ?? ""
    )
      .trim()
      .toUpperCase()
      .replace(
        /[^A-Z]/g,
        ""
      )
      .slice(
        0,
        2
      );

  }


  /* =========================================================
     AIRPORT COUNTRY
  ========================================================= */

  function getAirportCountry(
    icao
  ) {

    const normalizedICAO =
      normalizeICAO(
        icao
      );


    if (!normalizedICAO) {
      return "";
    }


    /*
      Future base complète :

      window.AIRPORT_COUNTRY_BY_ICAO = {
        LFPG: "FR",
        KJFK: "US",
        ...
      };
    */

    const airportDatabase =
      window.AIRPORT_COUNTRY_BY_ICAO;


    if (
      airportDatabase &&
      typeof airportDatabase === "object"
    ) {

      const country =
        normalizeCountryCode(
          airportDatabase[
            normalizedICAO
          ]
        );


      if (country) {
        return country;
      }

    }


    if (FALLBACK_AIRPORT_COUNTRIES[normalizedICAO]) {
      return FALLBACK_AIRPORT_COUNTRIES[normalizedICAO];
    }


    for (const [prefix, country] of ICAO_PREFIX_COUNTRY) {

      if (normalizedICAO.startsWith(prefix)) {
        return country;
      }

    }


    return "";

  }


  /* =========================================================
     COUNTRY NAME
  ========================================================= */

  function getCountryName(
    countryCode
  ) {

    const normalizedCountry =
      normalizeCountryCode(
        countryCode
      );


    if (!normalizedCountry) {
      return "";
    }


    try {

      const displayNames =
        new Intl.DisplayNames(
          ["fr"],
          {
            type: "region"
          }
        );


      return (
        displayNames.of(
          normalizedCountry
        ) ||
        normalizedCountry
      );

    } catch {

      return normalizedCountry;

    }

  }


  /* =========================================================
     FLAG
  ========================================================= */

  function setFlag(
    image,
    countryCode
  ) {

    if (!image) {
      return;
    }


    const country =
      normalizeCountryCode(
        countryCode
      );


    if (!country) {

      image.removeAttribute(
        "src"
      );

      image.hidden = true;

      return;

    }


    const countryLowercase =
      country.toLowerCase();


    image.dataset.country =
      country;


    image.src =
      `${FLAG_BASE_URL}/${countryLowercase}.svg`;


    image.alt =
      `Drapeau ${getCountryName(country)}`;


    image.hidden = false;

  }


  /* =========================================================
     AIRPORT UPDATE
  ========================================================= */

  function updateAirport({
    codeElement,
    flagElement,
    icao,
    country
  }) {

    const normalizedICAO =
      normalizeICAO(
        icao
      );


    if (!normalizedICAO) {
      return;
    }


    const normalizedCountry =
      normalizeCountryCode(
        country
      ) ||
      getAirportCountry(
        normalizedICAO
      );


    if (codeElement) {

      codeElement.textContent =
        normalizedICAO;

      codeElement.dataset.icao =
        normalizedICAO;

    }


    setFlag(
      flagElement,
      normalizedCountry
    );

  }


  /* =========================================================
     DEPARTURE
  ========================================================= */

  function setDepartureAirport(
    icao,
    country
  ) {

    updateAirport({

      codeElement:
        departureCode,

      flagElement:
        departureFlag,

      icao,

      country

    });

  }


  /* =========================================================
     ARRIVAL
  ========================================================= */

  function setArrivalAirport(
    icao,
    country
  ) {

    updateAirport({

      codeElement:
        arrivalCode,

      flagElement:
        arrivalFlag,

      icao,

      country

    });

  }


  /* =========================================================
     BOTH AIRPORTS
  ========================================================= */

  function setAirports({
    departure,
    arrival
  } = {}) {

    if (departure) {

      if (
        typeof departure ===
        "string"
      ) {

        setDepartureAirport(
          departure
        );

      } else {

        setDepartureAirport(
          departure.icao,
          departure.country
        );

      }

    }


    if (arrival) {

      if (
        typeof arrival ===
        "string"
      ) {

        setArrivalAirport(
          arrival
        );

      } else {

        setArrivalAirport(
          arrival.icao,
          arrival.country
        );

      }

    }

  }


  /* =========================================================
     REFRESH AIRPORT FLAGS
  ========================================================= */

  function refreshAirportFlags() {

    if (departureCode) {

      setDepartureAirport(
        departureCode.dataset.icao ||
        departureCode.textContent
      );

    }


    if (arrivalCode) {

      setArrivalAirport(
        arrivalCode.dataset.icao ||
        arrivalCode.textContent
      );

    }

  }


  /* =========================================================
     FLIGHT PHASE
  ========================================================= */

  function setFlightPhase(
    phase
  ) {

    const value =
      String(
        phase ?? ""
      )
        .trim()
        .toUpperCase();


    if (!value) {
      return;
    }


    /*
      On accepte également une future valeur
      non prévue afin de ne pas bloquer
      l'intégration StreamFlight.

      Les phases connues profitent simplement
      des animations CSS spécifiques.
    */

    if (flightPhase) {

      flightPhase.textContent =
        value;

    }


    if (flightPhaseGroup) {

      flightPhaseGroup.dataset.flightPhase =
        value;

    }


    return (
      VALID_FLIGHT_PHASES.has(
        value
      )
    );

  }


  /* =========================================================
     SOCIAL VALUE ANIMATION
  ========================================================= */

  function animateSocialValue(
    element
  ) {

    if (!element) {
      return;
    }


    const previousTimer =
      socialAnimationTimers.get(
        element
      );


    if (previousTimer) {

      clearTimeout(
        previousTimer
      );

    }


    /*
      Retirer puis remettre la classe
      permet de redémarrer l'animation
      même si deux événements arrivent
      rapidement.
    */

    element.classList.remove(
      "is-social-update"
    );


    /*
      Force le navigateur à recalculer
      le style avant de remettre la classe.
    */

    void element.offsetWidth;


    element.classList.add(
      "is-social-update"
    );


    const timer =
      setTimeout(() => {

        element.classList.remove(
          "is-social-update"
        );


        socialAnimationTimers.delete(
          element
        );

      }, 1100);


    socialAnimationTimers.set(
      element,
      timer
    );

  }


  /* =========================================================
     SOCIAL VALUE UPDATE
  ========================================================= */

  function setSocialValue(
    element,
    value
  ) {

    if (!element) {
      return false;
    }


    const nextValue =
      String(
        value ?? ""
      ).trim();


    if (!nextValue) {
      return false;
    }


    const currentValue =
      element.textContent.trim();


    /*
      Pas d'animation si le nom reçu
      est exactement le même.
    */

    if (
      currentValue ===
      nextValue
    ) {

      return false;

    }


    element.textContent =
      nextValue;


    animateSocialValue(
      element
    );


    return true;

  }


  /* =========================================================
     LATEST FOLLOWER
  ========================================================= */

  function setLatestFollower(
    username
  ) {

    return setSocialValue(
      latestFollower,
      username
    );

  }


  /* =========================================================
     LATEST SUB
  ========================================================= */

  function setLatestSub(
    username
  ) {

    return setSocialValue(
      latestSub,
      username
    );

  }


  /* =========================================================
     OBSERVE EXTERNAL SOCIAL UPDATES

     Si StreamFlight modifie directement le texte HTML
     sans utiliser setLatestFollower / setLatestSub,
     l'animation sera quand même déclenchée.
  ========================================================= */

  function observeSocialValue(
    element
  ) {

    if (!element) {
      return;
    }


    let previousValue =
      element.textContent.trim();


    const observer =
      new MutationObserver(() => {

        const currentValue =
          element.textContent.trim();


        if (
          !currentValue ||
          currentValue ===
          previousValue
        ) {
          return;
        }


        previousValue =
          currentValue;


        /*
          Si notre setter vient déjà
          de déclencher l'animation,
          inutile de la relancer.
        */

        if (
          !element.classList.contains(
            "is-social-update"
          )
        ) {

          animateSocialValue(
            element
          );

        }

      });


    observer.observe(
      element,
      {
        childList: true,
        characterData: true,
        subtree: true
      }
    );

  }


  /* =========================================================
     FLAG IMAGE ERRORS
  ========================================================= */

  function handleFlagError(
    image
  ) {

    if (!image) {
      return;
    }


    image.addEventListener(
      "error",
      () => {

        image.hidden = true;

      }
    );


    image.addEventListener(
      "load",
      () => {

        image.hidden = false;

      }
    );

  }


  /* =========================================================
     PUBLIC API
  ========================================================= */

  function setCallsign(value) {

    const next =
      String(value ?? "").trim();

    if (!next || !callsign) {
      return;
    }

    callsign.textContent = next;

  }


  window.setCallsign =
    setCallsign;

  window.setFlightProgress =
    setFlightProgress;


  window.setDepartureAirport =
    setDepartureAirport;


  window.setArrivalAirport =
    setArrivalAirport;


  window.setAirports =
    setAirports;


  window.refreshAirportFlags =
    refreshAirportFlags;


  window.setFlightPhase =
    setFlightPhase;


  window.setLatestFollower =
    setLatestFollower;


  window.setLatestSub =
    setLatestSub;


  /* =========================================================
     INITIALIZATION
  ========================================================= */

  function init() {

    fitOverlay();


    /*
      Valeur initiale de la progression.
    */

    const initialProgress =
      Number(
        progressText?.textContent
      );


    if (
      Number.isFinite(
        initialProgress
      )
    ) {

      setFlightProgress(
        initialProgress
      );

    }


    /*
      Initialisation des drapeaux.
    */

    refreshAirportFlags();


    /*
      Gestion des erreurs FlagCDN.
    */

    handleFlagError(
      departureFlag
    );

    handleFlagError(
      arrivalFlag
    );


    /*
      Surveillance des noms FOLLOW / SUB.
    */

    observeSocialValue(
      latestFollower
    );

    observeSocialValue(
      latestSub
    );

  }


  /* =========================================================
     AUTO-RELOAD ON NEW DEPLOY
  ========================================================= */

  /* global __BUILD_TIME__ */

  const CURRENT_BUILD_TIME =
    typeof __BUILD_TIME__ !== "undefined"
      ? __BUILD_TIME__
      : 0;


  async function checkForNewDeploy() {

    try {

      const url =
        new URL(
          "build-time.json",
          window.location.href
        );

      url.searchParams.set(
        "_",
        String(Date.now())
      );

      const response =
        await fetch(url.toString());

      if (!response.ok) {
        return;
      }

      const { t } =
        await response.json();

      if (t > CURRENT_BUILD_TIME) {

        const freshUrl =
          new URL(window.location.href);

        freshUrl.searchParams.set(
          "_v",
          String(t)
        );

        window.location.replace(
          freshUrl.toString()
        );

      }

    } catch {
      /* silent */
    }

  }


  setInterval(
    checkForNewDeploy,
    60_000
  );


  /* =========================================================
     SIMBRIEF INTEGRATION
  ========================================================= */

  const SIMBRIEF_API =
    "https://www.simbrief.com/api/xml.fetcher.php";

  const SIMBRIEF_POLL_INTERVAL =
    30_000;

  let lastSimBriefReleaseId =
    null;


  function getSimBriefUsername() {

    return (
      new URLSearchParams(
        window.location.search
      ).get("simbrief") ||
      import.meta.env.VITE_SIMBRIEF_USERNAME ||
      ""
    );

  }


  async function syncSimBrief() {

    const username =
      getSimBriefUsername();

    if (!username) {
      return;
    }


    try {

      const url =
        `${SIMBRIEF_API}?username=${encodeURIComponent(username)}&json=1`;

      const response =
        await fetch(url);

      if (!response.ok) {
        return;
      }


      const data =
        await response.json();


      if (
        data?.fetch?.status !==
        "Success"
      ) {
        return;
      }


      const planTimestamp =
        data?.params?.time_generated;


      if (
        planTimestamp ===
        lastSimBriefReleaseId
      ) {
        return;
      }


      lastSimBriefReleaseId =
        planTimestamp;


      setAirports({
        departure:
          data?.origin?.icao_code,
        arrival:
          data?.destination?.icao_code
      });

      const airline =
        String(data?.general?.icao_airline ?? "").trim();

      const flightNum =
        String(data?.general?.flight_number ?? "").trim();

      if (airline && flightNum) {
        setCallsign(airline + flightNum);
      }

    } catch {
      /* silent — pas de réseau = pas de mise à jour */
    }

  }


  function startSimBriefPolling() {

    if (!getSimBriefUsername()) {
      return;
    }

    syncSimBrief();

    setInterval(
      syncSimBrief,
      SIMBRIEF_POLL_INTERVAL
    );

  }


  /* =========================================================
     RESIZE
  ========================================================= */

  window.addEventListener(
    "resize",
    scheduleResize,
    {
      passive: true
    }
  );


  if (
    typeof ResizeObserver !==
    "undefined"
  ) {

    const resizeObserver =
      new ResizeObserver(
        scheduleResize
      );


    resizeObserver.observe(
      viewport
    );

  }


  /* =========================================================
     START
  ========================================================= */

  init();

  startSimBriefPolling();

})();