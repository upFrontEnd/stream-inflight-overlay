"use strict";


(() => {

  /* =======================================================
     DOM
  ======================================================== */

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



  if (
    !viewport ||
    !overlay
  ) {
    return;
  }



  /* =======================================================
     CONSTANTES
  ======================================================== */

  const BASE_WIDTH =
    1920;


  const HEADER_HEIGHT =
    160;


  const FLAG_BASE_URL =
    "https://flagcdn.com";


  let pendingFrame =
    0;



  /*
    Valeurs de secours.

    Elles permettent à l'overlay de fonctionner
    immédiatement avant l'ajout de la base mondiale.
  */

  const FALLBACK_AIRPORT_COUNTRIES = {

    LFPG: "FR",

    KJFK: "US"

  };



  /* =======================================================
     RESPONSIVE
  ======================================================== */

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
      String(scale)
    );

  }



  function scheduleResize() {

    cancelAnimationFrame(
      pendingFrame
    );


    pendingFrame =
      requestAnimationFrame(
        fitOverlay
      );

  }



  /* =======================================================
     FLIGHT PROGRESS
  ======================================================== */

  function setFlightProgress(
    percentage
  ) {

    const numericValue =
      Number(percentage);


    const value =
      Number.isFinite(numericValue)

        ? Math.max(
            0,
            Math.min(
              100,
              numericValue
            )
          )

        : 0;


    /*
      0 -> 50 %
      remplit la partie gauche.

      50 -> 100 %
      remplit la partie droite.
    */

    const leftProgress =
      Math.min(
        value / 50,
        1
      );


    const rightProgress =
      Math.max(
        0,
        Math.min(
          1,
          (value - 50) / 50
        )
      );


    if (progressLeft) {

      progressLeft.style.strokeDashoffset =
        String(
          100 -
          (
            leftProgress *
            100
          )
        );

    }


    if (progressRight) {

      progressRight.style.strokeDashoffset =
        String(
          100 -
          (
            rightProgress *
            100
          )
        );

    }


    if (progressText) {

      progressText.textContent =
        String(
          Math.round(value)
        );

    }

  }



  /* =======================================================
     ICAO
  ======================================================== */

  function normalizeICAO(
    value
  ) {

    return String(
      value ?? ""
    )

      .trim()

      .toUpperCase();

  }



  function normalizeCountryCode(
    value
  ) {

    const country =
      String(
        value ?? ""
      )

        .trim()

        .toUpperCase();


    /*
      Les drapeaux utilisent un code ISO
      pays sur deux lettres :
      FR, US, JP, GB, etc.
    */

    if (
      !/^[A-Z]{2}$/.test(
        country
      )
    ) {

      return null;

    }


    return country;

  }



  /* =======================================================
     DATABASE
  ======================================================== */

  function getAirportCountry(
    icao
  ) {

    const code =
      normalizeICAO(
        icao
      );


    if (!code) {

      return null;

    }


    /*
      Base mondiale qui sera ajoutée
      dans airport-countries.js.

      Exemple :

      window.AIRPORT_COUNTRY_BY_ICAO = {
        LFPG: "FR",
        KJFK: "US"
      };
    */

    const database =
      window.AIRPORT_COUNTRY_BY_ICAO;


    if (
      database &&
      typeof database === "object"
    ) {

      const country =
        normalizeCountryCode(
          database[code]
        );


      if (country) {

        return country;

      }

    }


    /*
      Fallback temporaire.
    */

    return (
      FALLBACK_AIRPORT_COUNTRIES[code] ??
      null
    );

  }



  /* =======================================================
     COUNTRY NAME
  ======================================================== */

  function getCountryName(
    countryCode
  ) {

    const country =
      normalizeCountryCode(
        countryCode
      );


    if (!country) {

      return "";

    }


    try {

      if (
        typeof Intl !== "undefined" &&
        typeof Intl.DisplayNames === "function"
      ) {

        const displayNames =
          new Intl.DisplayNames(
            ["fr"],
            {
              type: "region"
            }
          );


        return (
          displayNames.of(country) ||
          country
        );

      }

    }

    catch (
      error
    ) {

      /*
        Aucun traitement nécessaire.
        On utilisera simplement le code ISO.
      */

    }


    return country;

  }



  /* =======================================================
     FLAG
  ======================================================== */

  function setFlag(
    flagElement,
    countryCode
  ) {

    if (!flagElement) {

      return;

    }


    const country =
      normalizeCountryCode(
        countryCode
      );


    /*
      Aucun pays trouvé :
      on masque le drapeau plutôt que
      d'afficher un mauvais pays.
    */

    if (!country) {

      flagElement.hidden =
        true;


      flagElement.removeAttribute(
        "data-country"
      );


      return;

    }


    const countryLower =
      country.toLowerCase();


    const countryName =
      getCountryName(
        country
      );


    flagElement.hidden =
      false;


    flagElement.dataset.country =
      country;


    /*
      FlagCDN fournit ici le drapeau
      directement au format SVG.
    */

    flagElement.src =
      `${FLAG_BASE_URL}/${countryLower}.svg`;


    flagElement.alt =
      countryName

        ? `Drapeau ${countryName}`

        : `Drapeau ${country}`;



    /*
      Si jamais un drapeau n'est pas disponible,
      on préfère le masquer.
    */

    flagElement.onerror =
      () => {

        flagElement.hidden =
          true;

      };

  }



  /* =======================================================
     UPDATE AIRPORT
  ======================================================== */

  function updateAirport({

    codeElement,

    flagElement,

    icao,

    country = null

  }) {

    if (!codeElement) {

      return;

    }


    const code =
      normalizeICAO(
        icao
      );


    if (!code) {

      return;

    }


    /*
      Mise à jour du code affiché.
    */

    codeElement.textContent =
      code;


    codeElement.dataset.icao =
      code;



    /*
      Si StreamFlight nous donne directement
      un pays, on pourra le passer ici.

      Sinon on le cherche automatiquement
      dans notre base OACI.
    */

    const resolvedCountry =
      normalizeCountryCode(
        country
      ) ||
      getAirportCountry(
        code
      );


    setFlag(
      flagElement,
      resolvedCountry
    );

  }



  /* =======================================================
     DEPARTURE
  ======================================================== */

  function setDepartureAirport(
    icao,
    country = null
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



  /* =======================================================
     ARRIVAL
  ======================================================== */

  function setArrivalAirport(
    icao,
    country = null
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



  /* =======================================================
     UPDATE BOTH AIRPORTS
  ======================================================== */

  function setAirports({

    departure,

    arrival,

    departureCountry = null,

    arrivalCountry = null

  } = {}) {

    if (departure) {

      setDepartureAirport(
        departure,
        departureCountry
      );

    }


    if (arrival) {

      setArrivalAirport(
        arrival,
        arrivalCountry
      );

    }

  }



  /* =======================================================
     REFRESH FLAGS
  ======================================================== */

  function refreshAirportFlags() {

    const departure =
      departureCode?.dataset.icao ||
      departureCode?.textContent;


    const arrival =
      arrivalCode?.dataset.icao ||
      arrivalCode?.textContent;


    if (departure) {

      setDepartureAirport(
        departure
      );

    }


    if (arrival) {

      setArrivalAirport(
        arrival
      );

    }

  }



  /* =======================================================
     LOAD WORLD AIRPORT DATABASE
  ======================================================== */

  function loadAirportCountryDatabase() {

    /*
      Si la base est déjà présente,
      aucun chargement supplémentaire.
    */

    if (
      window.AIRPORT_COUNTRY_BY_ICAO
    ) {

      refreshAirportFlags();

      return;

    }


    /*
      On charge airport-countries.js
      automatiquement.

      Cela nous évite d'ajouter un autre
      <script> dans index.html.
    */

    const script =
      document.createElement(
        "script"
      );


    script.src =
      "airport-countries.js";


    script.async =
      true;


    script.onload =
      () => {

        refreshAirportFlags();

      };


    script.onerror =
      () => {

        /*
          La base n'est pas encore installée.

          LFPG et KJFK continueront néanmoins
          à fonctionner grâce au fallback.
        */

      };


    document.head.appendChild(
      script
    );

  }



  /* =======================================================
     INITIALISATION
  ======================================================== */

  function init() {

    fitOverlay();



    /*
      Valeur de progression déjà présente
      dans le HTML.
    */

    const initialProgress =
      Number(
        progressText?.textContent ??
        0
      );


    setFlightProgress(
      initialProgress
    );



    /*
      Aéroports présents dans le HTML.
    */

    const initialDeparture =
      departureCode?.dataset.icao ||
      departureCode?.textContent ||
      "LFPG";


    const initialArrival =
      arrivalCode?.dataset.icao ||
      arrivalCode?.textContent ||
      "KJFK";


    setAirports({

      departure:
        initialDeparture,

      arrival:
        initialArrival

    });



    /*
      Charge ensuite la base mondiale.
    */

    loadAirportCountryDatabase();

  }



  /* =======================================================
     EVENTS
  ======================================================== */

  window.addEventListener(
    "resize",
    scheduleResize,
    {
      passive: true
    }
  );


  if (
    "ResizeObserver"
    in window
  ) {

    const observer =
      new ResizeObserver(
        scheduleResize
      );


    observer.observe(
      viewport
    );

  }



  /* =======================================================
     PUBLIC API
  ======================================================== */

  window.setFlightProgress =
    setFlightProgress;


  window.setDepartureAirport =
    setDepartureAirport;


  window.setArrivalAirport =
    setArrivalAirport;


  window.setAirports =
    setAirports;


  /* =======================================================
     START
  ======================================================== */

  init();

})();