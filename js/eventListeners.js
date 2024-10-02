import { state } from './state.js';
import { rollDice, clearAllDice, addDieToRoller, onCanvasClick, onCanvasHover } from './dice.js';
import { handleCharacterFormSubmit } from './playerCharacter.js';

let listenersAdded = false; // Flag to check if listeners are already added

export function addEventListeners() {
    if (listenersAdded) return; // Skip adding listeners if already added
    listenersAdded = true; // Set flag to prevent re-adding

    console.log("Adding event listeners...");

    document.getElementById('roll-button').addEventListener('click', rollDice);
    document.getElementById('clear-button').addEventListener('click', clearAllDice);

    // Event Listeners for Dice Canvas (Clicks and Hovers)
    const canvas = document.getElementById('dice-canvas');

    canvas.addEventListener('click', (event) => {
        onCanvasClick(event, state.camera, state.scene);
    });

    canvas.addEventListener('mousemove', (event) => {
        onCanvasHover(event, state.camera, state.scene);
    });

    console.log("Event listeners for canvas added.");

    // Dice Selector Logic
    document.querySelectorAll('.dice-button').forEach(button => {
        button.addEventListener('click', () => {
            const dieType = button.textContent.toLowerCase();
            console.log(`Dice button clicked: ${dieType}`);
            addDieToRoller(dieType, state.scene, state.world); // Pass scene and world explicitly
        });
    });

    console.log("Event listeners for dice buttons added.");

    // Event Listeners for Creating New Player Character
    document.getElementById('create-character-btn').addEventListener('click', () => {
        document.getElementById('character-form').style.display = 'block';
        document.getElementById('create-character-btn').style.display = 'none';
    });

    document.getElementById('close-btn').addEventListener('click', () => {
        document.getElementById('character-form').style.display = 'none';
        document.getElementById('create-character-btn').style.display = 'block';
    });

    document.getElementById('character-form').addEventListener('submit', handleCharacterFormSubmit);

    console.log("Event listeners successfully added.");
}
