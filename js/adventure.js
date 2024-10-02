import { state } from './state.js';
import { clearChecklist, populateChecklist } from './checklist.js';
import { updateNPCData } from './npc.js';

// Fetch the adventure manifest
export async function fetchAdventuresManifest() {
    try {
        const response = await fetch('https://jdb3750.github.io/DM-Screen/adventure/adventure_manifest.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        state.adventuresManifest = await response.json();
        populateAdventureList();
    } catch (error) {
        console.error('Error fetching adventure manifest:', error);
    }
}

function populateAdventureList() {
    const adventureList = document.getElementById('adventure-list');
    adventureList.innerHTML = ''; // Clear previous content

    if (!state.adventuresManifest || !state.adventuresManifest.adventures) {
        console.error('Adventures manifest is empty or invalid.');
        return;
    }

    const sortedAdventures = state.adventuresManifest.adventures.slice().sort((a, b) => {
        return a.name.localeCompare(b.name);
    });

    sortedAdventures.forEach(adventure => {
        const adventureItem = document.createElement('div');
        adventureItem.classList.add('adventure-item');
        adventureItem.innerHTML = `
            <div class="adventure-name">${adventure.name}</div>
            <div class="adventure-description">${adventure.description}</div>
        `;
        adventureItem.addEventListener('click', () => {
            selectAdventure(adventureItem, adventure);
        });
        adventureList.appendChild(adventureItem);
    });
}

// Select an adventure
export async function selectAdventure(adventureItem, adventure) {
    if (state.selectedAdventure && state.selectedAdventure.element === adventureItem) {
        // Deselect the adventure
        adventureItem.classList.remove('selected', 'expanded');
        state.selectedAdventure = null;
        state.selectedAdventureData = null;

        // Clear plot points and NPCs
        clearChecklist();
        updateNPCData();
    } else {
        if (state.selectedAdventure && state.selectedAdventure.element) {
            state.selectedAdventure.element.classList.remove('selected', 'expanded');
        }

        // Select new adventure
        adventureItem.classList.add('selected', 'expanded');
        state.selectedAdventure = { element: adventureItem, data: adventure };

        // Fetch adventure data
        await fetchAdventureData(adventure.file);

        // Ensure selectedAdventureData is not null before proceeding
        if (state.selectedAdventureData) {
            populateChecklist();
            updateNPCData();
        }
    }
}

async function fetchAdventureData(file) {
    try {
        const response = await fetch(`https://jdb3750.github.io/DM-Screen/adventure/${file}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        state.selectedAdventureData = await response.json();
    } catch (error) {
        console.error('Error fetching adventure data:', error);
        state.selectedAdventureData = null; // Set to null on error to prevent null reference issues
    }
}

// Export necessary functions
export { populateAdventureList };
