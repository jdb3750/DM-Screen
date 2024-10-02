import { state } from './state.js';

// Handle the character form submission
export function handleCharacterFormSubmit(e) {
    e.preventDefault();

    const character = {
        name: document.getElementById('name').value,
        race: document.getElementById('race').value,
        level: document.getElementById('level').value,
        class: document.getElementById('class').value
    };

    addCharacterToList(character);
    e.target.reset();
    e.target.style.display = 'none';
    document.getElementById('create-character-btn').style.display = 'block';
}

// Add a new player character to the list
export function addCharacterToList(character) {
    state.playerCharacters[character.name] = character;
    updatePCList();
}

// Update the player character list in the UI
export function updatePCList() {
    const pcList = document.getElementById('pc-list');
    pcList.innerHTML = '';

    const sortedCharacters = Object.keys(state.playerCharacters).sort();

    sortedCharacters.forEach(charName => {
        const character = state.playerCharacters[charName];
        const characterItem = document.createElement('div');
        characterItem.classList.add('pc-item', 'checklist-item');
        characterItem.textContent = `${character.name} - ${character.race} - Level ${character.level} ${character.class}`;

        characterItem.addEventListener('click', () => {
            selectPC(characterItem, character);
        });

        pcList.appendChild(characterItem);
    });
}

// Select a player character and display its details
export function selectPC(characterItem, character) {
    if (state.selectedPC === characterItem) {
        characterItem.classList.remove('npc-selected');
        state.selectedPC = null;
        clearPCDetails();
    } else {
        if (state.selectedPC) state.selectedPC.classList.remove('npc-selected');
        characterItem.classList.add('npc-selected');
        state.selectedPC = characterItem;
        showCharacterDetails(character);
    }
}

// Show player character details in the UI
function showCharacterDetails(character) {
    const pcDetails = document.getElementById('pc-details');
    pcDetails.innerHTML = `
        <h3>${character.name}</h3>
        <p><strong>Race:</strong> ${character.race}</p>
        <p><strong>Level:</strong> ${character.level}</p>
        <p><strong>Class:</strong> ${character.class}</p>
    `;
}

// Clear player character details from the UI
function clearPCDetails() {
    const pcDetails = document.getElementById('pc-details');
    pcDetails.innerHTML = '';
}
