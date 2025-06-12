import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';


class PillowAnimation {
    constructor(pillows) {
        this.pillows = pillows;
        this.originalPositions = pillows.map(pillow => ({
            position: pillow.position.clone(),
            rotation: pillow.rotation.clone(),
            scale: pillow.scale.clone()
        }));
        
        this.time = 0;
        this.animationSpeed = 0.5; // Speed of the animation
        this.maxPulseHeight = 0.03; // Maximum height of the pulse
        this.maxRotation = 0.05; // Maximum rotation angle
        this.phaseOffsets = [0, Math.PI * 0.7, Math.PI * 1.3]; // Different phases for each pillow
    }
    

    update(deltaTime) {
        this.time += deltaTime * this.animationSpeed;

        this.pillows.forEach((pillow, index) => {
            // Calculate phase with offset for each pillow
            const phase = this.time + this.phaseOffsets[index];
            
            // Gentle vertical movement (pulse)
            const pulseHeight = Math.sin(phase) * this.maxPulseHeight;
            pillow.position.y = this.originalPositions[index].position.y + pulseHeight;
            
            // Subtle rotation
            const rotationX = Math.sin(phase * 0.7) * this.maxRotation * 0.3;
            const rotationZ = Math.cos(phase * 0.5) * this.maxRotation * 0.2;
            pillow.rotation.x = this.originalPositions[index].rotation.x + rotationX;
            pillow.rotation.z = this.originalPositions[index].rotation.z + rotationZ;
            
            // Subtle scale change
            const scaleFactor = 1 + Math.sin(phase * 0.8) * 0.02;
            pillow.scale.set(
                this.originalPositions[index].scale.x * scaleFactor,
                this.originalPositions[index].scale.y * (1 + Math.sin(phase) * 0.05), // More vertical squash
                this.originalPositions[index].scale.z * scaleFactor
            );
        });
    }

    reset() {
        this.pillows.forEach((pillow, index) => {
            pillow.position.copy(this.originalPositions[index].position);
            pillow.rotation.copy(this.originalPositions[index].rotation);
            pillow.scale.copy(this.originalPositions[index].scale);
        });
    }
}

export { PillowAnimation }; 