// index.js
import { state } from './js/state.js'
import { init } from './js/init.js';
import { fetchAdventuresManifest } from './js/adventure.js';
import { addEventListeners } from './js/eventListeners.js';

async function initializeApp() {
    await init(); // Wait for the initialization to complete
    console.log("Initialization complete. Camera and World are now defined.");

    addEventListeners(); // Add event listeners only when initialization is complete
}

initializeApp();

init();
fetchAdventuresManifest();
addEventListeners();
