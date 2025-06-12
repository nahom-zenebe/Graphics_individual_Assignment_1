import { createBed } from './scripts/createProduct.js';
import { setupLighting } from './scripts/addLighting.js';
import { InteractionManager } from './scripts/interaction.js';
import { CameraAnimation } from './scripts/cameraAnimation.js';
import { AnimationLoop } from './scripts/animationLoop.js';
import { PillowAnimation } from './scripts/pillowAnimation.js';
import { controls, camera, initialCameraPosition, initialTarget } from './scripts/initScene.js';

// Initialize the bed
const bed = createBed();

// Get pillow meshes for animation
const pillows = bed.children.filter(child => child.name.startsWith('Pillow'));

// Initialize pillow animation
const pillowAnimation = new PillowAnimation(pillows);

// Setup lighting
setupLighting();

// Initialize interaction manager
const interactionManager = new InteractionManager();

// Initialize camera animation
const cameraAnimation = new CameraAnimation();

// Initialize and start animation loop
const animationLoop = new AnimationLoop(cameraAnimation, pillowAnimation);
animationLoop.start();

// Animation Controls
const toggleButton = document.getElementById('togglePillowAnimation');
const speedSlider = document.getElementById('animationSpeed');
const pulseSlider = document.getElementById('pulseHeight');
const rotationSlider = document.getElementById('rotationAmount');

let isAnimationPaused = false;

// Toggle animation
toggleButton.addEventListener('click', () => {
    isAnimationPaused = !isAnimationPaused;
    if (isAnimationPaused) {
        animationLoop.stop();
        toggleButton.textContent = 'Resume Animation';
        toggleButton.classList.add('paused');
    } else {
        animationLoop.start();
        toggleButton.textContent = 'Pause Animation';
        toggleButton.classList.remove('paused');
    }
});

// Update animation speed
speedSlider.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    pillowAnimation.animationSpeed = value;
    e.target.nextElementSibling.textContent = value.toFixed(1);
});

// Update pulse height
pulseSlider.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    pillowAnimation.maxPulseHeight = value;
    e.target.nextElementSibling.textContent = value.toFixed(3);
});

// Update rotation amount
rotationSlider.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    pillowAnimation.maxRotation = value;
    e.target.nextElementSibling.textContent = value.toFixed(2);
});

// Hide loading overlay after everything is loaded
function hideLoadingOverlay() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.style.display = 'none';
}

// Simulate loading (since all geometry is procedural)
Promise.resolve().then(() => {
    // All setup done, hide loading
    hideLoadingOverlay();
});

// Camera reset logic
const resetBtn = document.getElementById('resetCamera');
if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        // Reset camera position
        camera.position.copy(initialCameraPosition);
        // Reset controls target
        controls.target.copy(initialTarget);
        controls.update();
    });
}

// Cleanup function
window.addEventListener('beforeunload', () => {
    interactionManager.dispose();
    cameraAnimation.dispose();
    animationLoop.stop();
}); 