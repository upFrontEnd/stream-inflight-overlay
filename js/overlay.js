"use strict";

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


    return (
      FALLBACK_AIRPORT_COUNTRIES[
        normalizedICAO
      ] ||
      ""
    );

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

})();