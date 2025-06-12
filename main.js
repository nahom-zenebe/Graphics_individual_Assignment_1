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

// Control Panel Mobile Toggle
const controlPanel = document.querySelector('.control-panel');
const controlPanelHeader = document.querySelector('.control-panel-header');

// Function to check if device is mobile
const isMobile = () => window.innerWidth <= 768;

// Function to handle control panel collapse
const toggleControlPanel = () => {
    if (isMobile()) {
        controlPanel.classList.toggle('collapsed');
    }
};

// Function to auto-hide panel after interaction
const autoHidePanel = () => {
    if (isMobile() && !controlPanel.classList.contains('collapsed')) {
        // Don't hide if user is interacting with controls
        const isInteractingWithControls = controlPanel.matches(':hover') || 
            Array.from(controlPanel.querySelectorAll('button, input')).some(el => el.matches(':hover'));
        
        if (!isInteractingWithControls) {
            controlPanel.classList.add('collapsed');
        }
    }
};

// Add click event listener to header
if (controlPanelHeader) {
    controlPanelHeader.addEventListener('click', toggleControlPanel);
}

// Auto-hide panel when clicking outside
document.addEventListener('click', (e) => {
    if (!controlPanel.contains(e.target)) {
        autoHidePanel();
    }
});

// Auto-hide panel when touching outside on mobile
document.addEventListener('touchend', (e) => {
    if (!controlPanel.contains(e.target)) {
        autoHidePanel();
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (isMobile()) {
        // On mobile, ensure panel is collapsed by default
        controlPanel.classList.add('collapsed');
    } else {
        // On desktop, ensure panel is expanded
        controlPanel.classList.remove('collapsed');
    }
});

// Initialize panel state based on screen size
if (isMobile()) {
    controlPanel.classList.add('collapsed');
    
} else {
    controlPanel.classList.remove('collapsed');
}

// Add touch event listeners to prevent auto-hide while interacting with controls
const controlElements = controlPanel.querySelectorAll('button, input');
controlElements.forEach(element => {
    element.addEventListener('touchstart', (e) => {
        e.stopPropagation();
    });
}); 