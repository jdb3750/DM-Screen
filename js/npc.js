import { state } from './state.js';

// Add relevant NPCs to the state
export function addRelevantNPCs(npcs) {
    if (npcs) {
        npcs.forEach(npc => {
            state.relevantNPCs[npc.name] = state.relevantNPCs[npc.name] || { ...npc, favorite: false, dead: false };
        });
    }
    updateNPCList();
}

// Remove relevant NPCs from the state
export function removeRelevantNPCs(npcs) {
    if (npcs) {
        npcs.forEach(npc => {
            delete state.relevantNPCs[npc.name];
        });
    }
    updateNPCList();
}

// Update the NPC data in the state
export function updateNPCData() {
    state.relevantNPCs = {}; // Clear existing NPCs
    updateNPCList();
    clearNPCDetails();
}

// Update the visible NPC list in the UI
export function updateNPCList() {
    const npcList = document.getElementById('npc-list');
    npcList.innerHTML = '';

    const sortedNPCs = Object.keys(state.relevantNPCs).sort();

    sortedNPCs.forEach(npcName => {
        const npc = state.relevantNPCs[npcName];

        const npcItem = document.createElement('div');
        npcItem.classList.add('npc-item', 'checklist-item');
        npcItem.innerHTML = `
            <span class="npc-icon star"><img src="${state.starIconURL}" alt="Star Icon" style="width: 20px; height: 20px;"></span>
            <span class="npc-icon skull"><img src="${state.skullIconURL}" alt="Skull Icon" style="width: 20px; height: 20px;"></span>
            ${npc.name}
        `;

        // Add modifiers based on stored properties
        if (npc.favorite) npcItem.classList.add('favorite-highlight');
        if (npc.dead) npcItem.classList.add('sketchy-strikethrough');

        const star = npcItem.querySelector('.star');
        const skull = npcItem.querySelector('.skull');

        // Sync star and skull icons with state
        if (npc.favorite) star.classList.add('favorite');
        if (npc.dead) skull.classList.add('dead');

        // Star click toggle
        star.addEventListener('click', e => {
            e.stopPropagation();
            npc.favorite = !npc.favorite;
            star.classList.toggle('favorite');
            npcItem.classList.toggle('favorite-highlight', npc.favorite);
        });

        // Skull click toggle
        skull.addEventListener('click', e => {
            e.stopPropagation();
            npc.dead = !npc.dead;
            skull.classList.toggle('dead');
            npcItem.classList.toggle('sketchy-strikethrough', npc.dead);
        });

        npcItem.addEventListener('click', () => {
            selectNPC(npcItem, npc);
        });

        npcList.appendChild(npcItem);
    });
}

// Select an NPC and display its details
export function selectNPC(npcItem, npc) {
    if (state.selectedNPC === npcItem) {
        npcItem.classList.remove('npc-selected');
        state.selectedNPC = null;
        clearNPCDetails();
    } else {
        if (state.selectedNPC) state.selectedNPC.classList.remove('npc-selected');
        npcItem.classList.add('npc-selected');
        state.selectedNPC = npcItem;
        showNPCDetails(npc);
    }
}

// Show NPC details in the UI
function showNPCDetails(npc) {
    const npcDetails = document.getElementById('npc-details');
    npcDetails.innerHTML = `
        <h3>${npc.name}</h3>
        <p>${npc.description}</p>
        <p><strong>Stats:</strong> ${npc.stats}</p>
    `;
}

// Clear the NPC details from the UI
function clearNPCDetails() {
    const npcDetails = document.getElementById('npc-details');
    npcDetails.innerHTML = '';
}
