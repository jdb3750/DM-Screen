import THREE from './threeInstance.js';
import CANNON from './cannonInstance.js';
import { state } from './state.js';

export function init() {
    return new Promise((resolve, reject) => {
        const canvas = document.getElementById('dice-canvas');

        // Renderer Setup
        state.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        state.renderer.setClearColor(0x000000, 0); // Transparent background

        // Scene Setup
        state.scene = new THREE.Scene();
        console.log("Scene created: ", state.scene);

        // Cannon.js World Setup
        state.world = new CANNON.World();
        state.world.gravity.set(0, -9.81, 0); // Gravity setting as before
        console.log("World created: ", state.world);

        // Camera Setup
        const aspect = canvas.clientWidth / canvas.clientHeight;
        const viewSize = 20;
        state.camera = new THREE.OrthographicCamera(
            (-aspect * viewSize) / 2,
            (aspect * viewSize) / 2,
            viewSize / 2,
            -viewSize / 2,
            -100,
            100
        );
        state.camera.position.set(0, 15, 0);
        state.camera.lookAt(new THREE.Vector3(0, 0, 0));
        console.log("Camera created: ", state.camera);

        // Lighting Setup
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        state.scene.add(ambientLight);
        console.log("Ambient light added.");

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(5, 10, 7.5);
        state.scene.add(directionalLight);
        console.log("Directional light added.");

        // Ground Plane Setup
        const groundMaterial = new CANNON.Material('groundMaterial');
        const groundBody = new CANNON.Body({ mass: 0, material: groundMaterial });
        groundBody.addShape(new CANNON.Plane());
        groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        state.world.addBody(groundBody);
        console.log("Ground added to the world.");

        // Handle Resizing
        function onWindowResize() {
            const canvasWidth = canvas.clientWidth;
            const canvasHeight = canvas.clientHeight;

            const aspect = canvasWidth / canvasHeight;
            const viewSize = 20;
            state.camera.left = (-aspect * viewSize) / 2;
            state.camera.right = (aspect * viewSize) / 2;
            state.camera.top = viewSize / 2;
            state.camera.bottom = -viewSize / 2;
            state.camera.updateProjectionMatrix();

            state.renderer.setSize(canvasWidth, canvasHeight);
            console.log("Camera and renderer resized.");
        }

        window.addEventListener('resize', onWindowResize);
        onWindowResize();

        // Create Boundaries
        createDiceBoundaries();
        console.log("Boundaries created successfully.");

        console.log("Initialization complete, resolving promise...");
        resolve();

        // Start Animation Loop
        animate();
    });
}

function createDiceBoundaries() {
    const canvas = document.getElementById('dice-canvas');
    const canvasRect = canvas.getBoundingClientRect();
    const canvasWidth = canvasRect.width;
    const canvasHeight = canvasRect.height;

    const viewSize = state.camera.top - state.camera.bottom;
    const pixelsToUnits = viewSize / canvasHeight;

    const boundaryWidth = (canvasWidth * pixelsToUnits) / 2;
    const boundaryHeight = viewSize / 2;
    const wallThickness = 2;

    const wallPositions = [
        { x: 0, y: boundaryHeight / 2, z: -boundaryWidth }, // Back wall
        { x: 0, y: boundaryHeight / 2, z: boundaryWidth },  // Front wall
        { x: -boundaryWidth, y: boundaryHeight / 2, z: 0 }, // Left wall
        { x: boundaryWidth, y: boundaryHeight / 2, z: 0 }   // Right wall
    ];

    wallPositions.forEach((pos, index) => {
        const isVertical = index < 2;
        const wallShape = new CANNON.Box(
            new CANNON.Vec3(
                isVertical ? boundaryWidth + wallThickness : wallThickness,
                boundaryHeight / 2,
                isVertical ? wallThickness : boundaryWidth + wallThickness
            )
        );

        const wallBody = new CANNON.Body({ mass: 0 });
        wallBody.addShape(wallShape);
        wallBody.position.set(pos.x, pos.y, pos.z);
        state.world.addBody(wallBody);
    });

    console.log("Boundaries created:", { boundaryWidth, boundaryHeight });
}

function animate() {
    requestAnimationFrame(animate);
    state.world.step(1 / 60);
    state.dice.forEach(die => {
        die.mesh.position.copy(die.body.position);
        die.mesh.quaternion.copy(die.body.quaternion);
    });
    state.renderer.render(state.scene, state.camera);
}
