
/********************************************************************
 * TOUR CONFIGURATION
 ********************************************************************/

let TOUR_START_DATE = "";
let SHOW_DATES = false;
let SHOW_COMPLETED_DAYS = false;
let INITIAL_LANGUAGE = "es";

/********************************************************************
 * Get Function Variable from host (cloudflare)
 ********************************************************************/

async function loadTourConfiguration() {

  try {

    const response = await fetch("/api/config");

    const contentType = response.headers.get("content-type");
    console.log("CONFIG STATUS:", response.status);
    console.log("CONFIG CONTENT-TYPE:", contentType);
    if (!contentType || !contentType.includes("application/json")) {
     const text = await response.text();
     console.error("Expected JSON but received:", text.substring(0, 200));
     throw new Error("Configuration endpoint did not return JSON");
    }

    if (!response.ok) {
      throw new Error("Configuration unavailable");
    }

    const config = await response.json();

    TOUR_START_DATE =
      config.tourStartDate || "";

    SHOW_DATES =
      String(config.showDates).toLowerCase() === "true";

    SHOW_COMPLETED_DAYS =
      String(config.showCompletedDays).toLowerCase() === "true";

    const lang =
      String(config.initialLanguage || "")
        .trim()
        .toLowerCase();

    INITIAL_LANGUAGE =
      ["es", "en", "it"].includes(lang)
        ? lang
        : "es";
      }
  catch (error) {

    console.error(
      "Unable to load tour configuration:",
      error
    );

    /*
       Safe defaults
    */

    TOUR_START_DATE = "";
    SHOW_DATES = false;
    SHOW_COMPLETED_DAYS = false;
    INITIAL_LANGUAGE = "es";

  }
}

async function initializeSite() {

    await loadTourConfiguration();

    applyTranslations(INITIAL_LANGUAGE);

}

/********************************************************************
 * CURRENT DATE IN ITALY
 ********************************************************************/

function getItalyTodayNumber() {

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());

  const values = {};

  parts.forEach(part => {
    values[part.type] = part.value;
  });

  return Number(
    values.year +
    values.month +
    values.day
  );
}


/********************************************************************
 * REFRESH DAY LABELS
 *
 * Translation has already placed:
 *
 * 🟢 Día 1 – Bari → Lecce
 *
 * or
 *
 * 🟢 Day 1 – Bari → Lecce
 *
 * or
 *
 * 🟢 Giorno 1 – Bari → Lecce
 *
 * This function only adds MM/DD and ✅.
 ********************************************************************/

function refreshDayLabels() {

  const dayElements =
    document.querySelectorAll('.day-group-label');

  /*
     If no tour start date exists,
     leave translated labels untouched.
  */

  if (!TOUR_START_DATE ||
      TOUR_START_DATE.trim() === "") {

    return;
  }


  const [year, month, day] =
    TOUR_START_DATE.split("-").map(Number);

  const italyTodayNumber =
    getItalyTodayNumber();


  dayElements.forEach((element, index) => {

    /*
       This is the label that applyTranslations()
       just put into the element.
    */

    const translatedLabel =
      element.textContent;


    /* Calculate date for this tour day */

    const tripDate =
      new Date(Date.UTC(year, month - 1, day));

    tripDate.setUTCDate(
      tripDate.getUTCDate() + index
    );


    let finalLabel = "";


    /* -----------------------------------------
       DATE: MM/DD
       ----------------------------------------- */

    if (SHOW_DATES) {

      const mm =
        String(
          tripDate.getUTCMonth() + 1
        ).padStart(2, "0");

      const dd =
        String(
          tripDate.getUTCDate()
        ).padStart(2, "0");

      finalLabel += mm + "/" + dd;
    }


    /* -----------------------------------------
       CHECKMARK
       ----------------------------------------- */

    if (SHOW_COMPLETED_DAYS) {

      const tripDateNumber =
        tripDate.getUTCFullYear() * 10000 +
        (tripDate.getUTCMonth() + 1) * 100 +
        tripDate.getUTCDate();

      if (italyTodayNumber > tripDateNumber) {
        finalLabel += "✅";
      }
    }


    /* -----------------------------------------
       TRANSLATED MENU DESCRIPTION
       ----------------------------------------- */

    finalLabel += translatedLabel;

    element.textContent = finalLabel;

  });

}


initializeSite();
