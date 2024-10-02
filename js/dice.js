import THREE from './threeInstance.js';
import CANNON from './cannonInstance.js';
import { state } from './state.js';

let addDieCallCount = 0; // Track how many times addDieToRoller is called

export function addDieToRoller(dieType, scene, world) {
    addDieCallCount++;
    console.log(`addDieToRoller called! Call count: ${addDieCallCount}, Type: ${dieType}`);

    const sizeMap = {
        d4: 0.5,
        d6: 1,
        d8: 0.8,
        d10: 0.9,
        d12: 0.85,
        d20: 1.2,
        d100: 1.5
    };

    let dieGeometry;
    switch (dieType) {
        case 'd4':
            dieGeometry = new THREE.TetrahedronGeometry(sizeMap[dieType]);
            break;
        case 'd6':
            dieGeometry = new THREE.BoxGeometry(sizeMap[dieType], sizeMap[dieType], sizeMap[dieType]);
            break;
        case 'd8':
            dieGeometry = new THREE.OctahedronGeometry(sizeMap[dieType]);
            break;
        case 'd10':
            dieGeometry = new THREE.DodecahedronGeometry(sizeMap[dieType] * 0.8);
            break;
        case 'd12':
            dieGeometry = new THREE.DodecahedronGeometry(sizeMap[dieType]);
            break;
        case 'd20':
            dieGeometry = new THREE.IcosahedronGeometry(sizeMap[dieType]);
            break;
        case 'd100':
            dieGeometry = new THREE.SphereGeometry(sizeMap[dieType], 16, 16);
            break;
        default:
            console.warn(`Unknown die type: ${dieType}`);
            return;
    }

    const dieMaterial = new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff });
    const dieMesh = new THREE.Mesh(dieGeometry, dieMaterial);

    let dieBody;
    if (['d4', 'd8', 'd10', 'd12', 'd20', 'd100'].includes(dieType)) {
        const radius = sizeMap[dieType];
        dieBody = new CANNON.Body({ mass: 3, shape: new CANNON.Sphere(radius) });
    } else {
        dieBody = new CANNON.Body({ mass: 3 });
        dieBody.addShape(
            new CANNON.Box(
                new CANNON.Vec3(sizeMap[dieType] / 2, sizeMap[dieType] / 2, sizeMap[dieType] / 2)
            )
        );
    }

    dieBody.linearDamping = 0.4;
    dieBody.angularDamping = 0.5;
    dieBody.position.set(Math.random() * 2 - 1, 2, Math.random() * 2 - 1);
    world.addBody(dieBody);
    scene.add(dieMesh);

    // Store the type of the die
    const dieObject = { mesh: dieMesh, body: dieBody, type: dieType };
    state.dice.push(dieObject);

    console.log("Successfully added die to roller:", dieObject);
}


// Rolls all dice in the roller
export function rollDice() {
    const canvas = document.getElementById('dice-canvas');
    const canvasHeight = canvas.clientHeight;
    const rollForce = canvasHeight * 0.15; // Increase scaling for more force
    const rollTorque = canvasHeight * 0.06;

    state.dice.forEach(die => {
        // Reset the die’s velocity and angular velocity to zero before rolling
        die.body.velocity.set(0, 0, 0);
        die.body.angularVelocity.set(0, 0, 0);

        // Apply a stronger initial force for a more dynamic roll
        die.body.velocity.set(
            (Math.random() - 0.5) * rollForce,
            3, // Increase vertical force to make the dice bounce more
            (Math.random() - 0.5) * rollForce
        );

        // Apply torque (spinning force) for more realistic rotation
        die.body.angularVelocity.set(
            (Math.random() - 0.5) * rollTorque,
            (Math.random() - 0.5) * rollTorque,
            (Math.random() - 0.5) * rollTorque
        );
    });

    // Display the total roll result after a longer duration
    setTimeout(showTotalRollResult, 1500); // Increase delay for more roll time
}


// Display the total roll result
function showTotalRollResult() {
    // Clear existing roll results
    const existingResult = document.getElementById('total-roll-result');
    if (existingResult) existingResult.remove();

    let totalResult = 0;
    state.dice.forEach(die => {
        const maxRoll = getMaxRoll(die.type);
        const result = Math.floor(Math.random() * maxRoll) + 1;
        totalResult += result;

        // Stop the die's motion
        die.body.velocity.set(0, 0, 0);
        die.body.angularVelocity.set(0, 0, 0);
    });

    // Create result display
    const totalResultDisplay = document.createElement('div');
    totalResultDisplay.id = 'total-roll-result';
    totalResultDisplay.textContent = totalResult;

    // Apply styling
    Object.assign(totalResultDisplay.style, {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '4rem',
        fontFamily: 'Georgia, serif',
        fontStyle: 'italic',
        color: '#ecf0f1',
        textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)'
    });

    // Append to dice container
    const diceContainer = document.getElementById('dice-container');
    if (diceContainer) {
        diceContainer.appendChild(totalResultDisplay);
    }
}

function getMaxRoll(dieType) {
    switch (dieType) {
        case 'd4':
            return 4;
        case 'd6':
            return 6;
        case 'd8':
            return 8;
        case 'd10':
            return 10;
        case 'd12':
            return 12;
        case 'd20':
            return 20;
        case 'd100':
            return 100;
        default:
            return 6;
    }
}

// Function to handle canvas click
export function onCanvasClick(event) {
    const canvas = document.getElementById('dice-canvas');
    const rect = canvas.getBoundingClientRect();
    state.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    state.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    state.raycaster.setFromCamera(state.mouse, state.camera);

    const intersects = state.raycaster.intersectObjects(state.scene.children);

    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        const dieObject = state.dice.find(die => die.mesh === clickedObject);
        if (dieObject) {
            removeDie(dieObject);
        }
    }
}

// Function to handle canvas hover
export function onCanvasHover(event) {
    const canvas = document.getElementById('dice-canvas');
    const rect = canvas.getBoundingClientRect();
    state.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    state.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    state.raycaster.setFromCamera(state.mouse, state.camera);

    const intersects = state.raycaster.intersectObjects(state.scene.children);

    if (intersects.length > 0) {
        const hoveredObject = intersects[0].object;
        const dieObject = state.dice.find(die => die.mesh === hoveredObject);
        if (dieObject && dieObject.mesh !== state.hoveredDie) {
            if (state.hoveredDie) unhighlightDie(state.hoveredDie);
            state.hoveredDie = dieObject.mesh;
            highlightDie(state.hoveredDie);
        }
    } else {
        if (state.hoveredDie) unhighlightDie(state.hoveredDie);
        state.hoveredDie = null;
    }
}

// Clear all dice from the scene
export function clearAllDice() {
    state.dice.forEach(die => {
        state.world.removeBody(die.body);
        state.scene.remove(die.mesh);
    });

    state.dice.length = 0; // Clear the dice array

    const existingResult = document.getElementById('total-roll-result');
    if (existingResult) existingResult.remove();

    console.log('All dice and results cleared!');
}

// Highlight a die
function highlightDie(dieMesh) {
    dieMesh.scale.set(1.2, 1.2, 1.2);
    dieMesh.material.emissive = new THREE.Color(0xaaaaaa);
}

// Unhighlight a die
function unhighlightDie(dieMesh) {
    dieMesh.scale.set(1, 1, 1);
    dieMesh.material.emissive = new THREE.Color(0x000000);
}

function removeDie(dieObject) {
    state.world.removeBody(dieObject.body);
    state.scene.remove(dieObject.mesh);
    const index = state.dice.indexOf(dieObject);
    if (index > -1) {
        state.dice.splice(index, 1);
    }
}
