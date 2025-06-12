import { camera, controls } from './initScene.js';
import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';

class CameraAnimation {
    constructor() {
        this.isRotating = false;
        this.rotationSpeed = 30; // degrees per second (time-based)
        this.radius = 5; // distance from center
        this.angle = 0;
        this.targetY = 3; // height of camera
        this.clock = new THREE.Clock();
        this.centerPoint = new THREE.Vector3(0, 0, 0); // center of rotation
        this.isUserControlling = false;
        this.userControlTimeout = null;
        
        // Smooth transition properties
        this.transitionDuration = 1.0; // seconds
        this.transitionProgress = 0;
        this.isTransitioning = false;
        this.startPosition = new THREE.Vector3();
        this.startTarget = new THREE.Vector3();
        this.targetPosition = new THREE.Vector3();
        this.targetAngle = 0;
        this.currentSpeed = 0;
        this.maxSpeed = this.rotationSpeed;
        this.acceleration = 15; // degrees per second per second
        this.deceleration = 20; // degrees per second per second
        
        // Store last user position
        this.lastUserPosition = new THREE.Vector3();
        this.lastUserAngle = 0;
        this.wasUserControlling = false;
        
        // Bind methods
        this.startRotation = this.startRotation.bind(this);
        this.stopRotation = this.stopRotation.bind(this);
        this.update = this.update.bind(this);
        this.onUserControlStart = this.onUserControlStart.bind(this);
        this.onUserControlEnd = this.onUserControlEnd.bind(this);
        
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
        
        // Add event listeners for user control
        controls.addEventListener('start', this.onUserControlStart);
        controls.addEventListener('end', this.onUserControlEnd);
    }

    // Easing function for smooth transitions
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    // Calculate angle from position
    calculateAngleFromPosition(position) {
        return Math.atan2(
            position.x - this.centerPoint.x,
            position.z - this.centerPoint.z
        );
    }

    // Calculate position from angle
    calculatePositionFromAngle(angle) {
        return new THREE.Vector3(
            this.centerPoint.x + this.radius * Math.sin(angle),
            this.targetY,
            this.centerPoint.z + this.radius * Math.cos(angle)
        );
    }

    startTransition(fromPosition, fromTarget, toPosition, toTarget) {
        this.isTransitioning = true;
        this.transitionProgress = 0;
        this.startPosition.copy(fromPosition);
        this.startTarget.copy(fromTarget);
        this.targetPosition.copy(toPosition);
        controls.target.copy(toTarget);
        
        // Calculate target angle for rotation
        this.targetAngle = this.calculateAngleFromPosition(toPosition);
        
        // Normalize angle to be closest to current angle
        while (this.targetAngle - this.angle > Math.PI) this.targetAngle -= Math.PI * 2;
        while (this.targetAngle - this.angle < -Math.PI) this.targetAngle += Math.PI * 2;
    }
    

    onUserControlStart() {
        if (this.isRotating) {
            // Store current camera state
            this.lastUserPosition.copy(camera.position);
            this.lastUserAngle = this.calculateAngleFromPosition(camera.position);
            this.wasUserControlling = true;
        }
        
        this.isUserControlling = true;
        this.isTransitioning = false;
        
        if (this.userControlTimeout) {
            clearTimeout(this.userControlTimeout);
            this.userControlTimeout = null;
        }
    }

    onUserControlEnd() {
        this.isUserControlling = false;
        
        if (this.isRotating) {
            // Store the final user position
            this.lastUserPosition.copy(camera.position);
            this.lastUserAngle = this.calculateAngleFromPosition(camera.position);
            
            // Calculate the closest point on the rotation path
            const currentAngle = this.calculateAngleFromPosition(camera.position);
            const targetPos = this.calculatePositionFromAngle(currentAngle);
            
            // Start smooth transition to the rotation path
            this.startTransition(
                camera.position,
                controls.target,
                targetPos,
                this.centerPoint
            );
            
            // Update the rotation angle to match the user's last position
            this.angle = currentAngle;
            
            // Resume rotation after transition
            this.userControlTimeout = setTimeout(() => {
                if (!this.isUserControlling) {
                    this.clock.start();
                    this.currentSpeed = 0; // Start from zero speed
                }
            }, this.transitionDuration * 1000);
        }
    }

    startRotation() {
        this.isRotating = true;
        
        if (!this.isUserControlling) {
            // Reset to default position
            const defaultAngle = 0; // Start from front view
            const defaultPos = this.calculatePositionFromAngle(defaultAngle);
            
            // Start smooth transition to default position
            this.startTransition(
                camera.position,
                controls.target,
                defaultPos,
                this.centerPoint
            );
            
            this.angle = defaultAngle;
            this.clock.start();
            this.currentSpeed = 0; // Start from zero speed
            this.wasUserControlling = false; // Reset user control state
        }
        
        // Update button states
        document.getElementById('startRotation').disabled = true;
        document.getElementById('stopRotation').disabled = false;
    }

    stopRotation() {
        this.isRotating = false;
        this.isTransitioning = false;
        this.clock.stop();
        this.currentSpeed = 0;
        this.wasUserControlling = false;
        
        if (this.userControlTimeout) {
            clearTimeout(this.userControlTimeout);
            this.userControlTimeout = null;
        }
        
        // Update button states
        document.getElementById('startRotation').disabled = false;
        document.getElementById('stopRotation').disabled = true;
    }

    update() {
        const deltaTime = this.clock.getDelta();
        
        if (this.isTransitioning) {
            // Update transition progress
            this.transitionProgress += deltaTime / this.transitionDuration;
            
            if (this.transitionProgress >= 1) {
                // Transition complete
                this.isTransitioning = false;
                camera.position.copy(this.targetPosition);
                controls.target.copy(this.centerPoint);
            } else {
                // Interpolate position and target with easing
                const easedProgress = this.easeInOutCubic(this.transitionProgress);
                camera.position.lerpVectors(this.startPosition, this.targetPosition, easedProgress);
                controls.target.lerpVectors(this.startTarget, this.centerPoint, easedProgress);
            }
        } else if (this.isRotating && !this.isUserControlling) {
            // Smooth acceleration/deceleration
            if (this.currentSpeed < this.maxSpeed) {
                this.currentSpeed = Math.min(
                    this.maxSpeed,
                    this.currentSpeed + this.acceleration * deltaTime
                );
            }
            
            // Update angle with current speed
            this.angle += THREE.MathUtils.degToRad(this.currentSpeed * deltaTime);
            
            // Calculate new camera position
            const newPos = this.calculatePositionFromAngle(this.angle);
            camera.position.copy(newPos);
            camera.lookAt(this.centerPoint);
            controls.target.copy(this.centerPoint);
        }
        
        // Update controls in every frame
        controls.update();
    }

    dispose() {
        const startButton = document.getElementById('startRotation');
        const stopButton = document.getElementById('stopRotation');
        
        // Remove event listeners
        startButton.removeEventListener('click', this.startRotation);
        stopButton.removeEventListener('click', this.stopRotation);
        controls.removeEventListener('start', this.onUserControlStart);
        controls.removeEventListener('end', this.onUserControlEnd);
        
        // Clear any pending timeout
        if (this.userControlTimeout) {
            clearTimeout(this.userControlTimeout);
        }
        
        // Ensure rotation is stopped
        this.stopRotation();
    }
}

export { CameraAnimation }; 