// This file loads the unbuilt ES6 version of Cesium
// into the global scope during local developmnet
window.CESIUM_BASE_URL = "../Cesium";
import * as Cesium from "../../Cesium/Cesium.js";
window.Cesium = Cesium;

// Since ES6 modules have no guaranteed load order,
// only call startup if it's already defined but hasn't been called yet
if (!window.startupCalled && typeof window.startup === "function") {
  window.startup(Cesium);
}
