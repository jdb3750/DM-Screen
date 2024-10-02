// state.js
import THREE from './threeInstance.js';
import CANNON from './cannonInstance.js';

// Create a centralized state object to hold all shared variables
export const state = {
    // NPC and Player Variables
    relevantNPCs: {},
    playerCharacters: {},

    // Selected NPC and PC
    selectedNPC: null,
    selectedPC: null,

    // Raycasting and Mouse Events for Dice
    raycaster: new THREE.Raycaster(),
    mouse: new THREE.Vector2(),
    hoveredDie: null,

    // Dice and Rendering Variables
    scene: null,
    camera: null,
    renderer: null,
    world: null,
    dice: [],

    // Icons
    skullIconURL: "https://img.icons8.com/?size=100&id=5MkeIjdALzZc&format=png&color=000000",
    starIconURL: "https://img.icons8.com/?size=100&id=9tby2cWLLWzl&format=png&color=000000",

    // Adventure Selection Variables
    adventuresManifest: null,
    selectedAdventure: null,
    selectedAdventureData: null
};
