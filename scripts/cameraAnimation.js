import { camera, controls } from './initScene.js';

class CameraAnimation {
    constructor() {
        this.isRotating = false;
        this.rotationSpeed = 0.5; // degrees per frame
        this.radius = 5; // distance from center
        this.angle = 0;
        this.targetY = 3; // height of camera
        this.autoRotateSpeed = 0.5; // degrees per frame for auto-rotation
        
        // Bind methods
        this.startRotation = this.startRotation.bind(this);
        this.stopRotation = this.stopRotation.bind(this);
        this.update = this.update.bind(this);
        
        // Setup UI controls
        this.setupControls();
    }

    setupControls() {
        const startButton = document.getElementById('startRotation');
        const stopButton = document.getElementById('stopRotation');
        
        startButton.addEventListener('click', this.startRotation);
        stopButton.addEventListener('click', this.stopRotation);
        
        // Enable controls by default
        controls.enabled = true;
        
        // Configure OrbitControls for better interaction
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.rotateSpeed = 0.7;
        controls.autoRotate = false;
        controls.autoRotateSpeed = this.autoRotateSpeed;
    }

    startRotation() {
        this.isRotating = true;
        
        // Enable auto-rotation in OrbitControls
        controls.autoRotate = true;
        
        // Update button states
        document.getElementById('startRotation').disabled = true;
        document.getElementById('stopRotation').disabled = false;
    }

    stopRotation() {
        this.isRotating = false;
        
        // Disable auto-rotation in OrbitControls
        controls.autoRotate = false;
        
        // Update button states
        document.getElementById('startRotation').disabled = false;
        document.getElementById('stopRotation').disabled = true;
    }

    update() {
        // Update controls in every frame
        controls.update();
    }

    dispose() {
        const startButton = document.getElementById('startRotation');
        const stopButton = document.getElementById('stopRotation');
        
        startButton.removeEventListener('click', this.startRotation);
        stopButton.removeEventListener('click', this.stopRotation);
    }
}

export { CameraAnimation }; 