// Array of ticket information
const gaBaseData = {
    ticketNumber: "1413594", // ticket number 
    recTitle: "Next Unlimited - Expiring Soon Test", // ticket title
    countryCode: "UK",
    language: null, // language code, can be string or null
    pageType: "PDP",
    isExp: true, // can be boolean or null
    isMobile: false
};
const { ticketNumber, recTitle, countryCode, language, pageType, isExp, isMobile } = gaBaseData;

// Array of events to be registered
// Pageview events do not need an element as these will run as soon as createGAEvents function runs
// Action: can be any action that can be registered via addEventListener
// Element: any dom node
// Label: description of event
const gaEventData = [{
    action: "pageview",
    label: "Pageview"
}, {
    action: "click",
    element: document.querySelector('.addtobag'),
    label: "Click of the add to bag button"
}];

// Formatted string used within track functions
let expLabel = "";
if (typeof (isExp) === "boolean") {
    expLabel = isExp ? "-EXP" : "-CTRL"
}
const gaCategory = `MT-${ticketNumber}-${isMobile ? "M" : "DT"}${expLabel}`;
const baseLabel = `${pageType} | ${recTitle} | ${countryCode}${language ? " - " + language : ""}`;

// Check which helper function is valid and use that for example
// This function can be used on it's own
function trackEvent(action, label) {
    const joinedLabel = `${baseLabel} | ${label}`;
    try {
        if (typeof (TrackGTMEvent) === "function") {
            TrackGTMEvent(gaCategory, action, joinedLabel);
        } else {
            TrackGAEvent(gaCategory, action, joinedLabel);
        }

    } catch (err) {
        console.info(err.msg);
    }
}

// Loop through gaEventData and register relvant GA functions
function createGAEvents() {
    gaEventData.forEach(event => {
        const completedFunction = () => trackEvent(event.action, event.label);

        if (event.action === "pageview") {
            // if pageview use straight away
            completedFunction();

            // check element exists & then register event
        } else if (!!event.element) {
            event.element.addEventListener(event.action, completedFunction);
        }
    });
}