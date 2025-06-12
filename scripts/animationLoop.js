import { scene, camera, renderer, controls } from './initScene.js';

class AnimationLoop {
    constructor(cameraAnimation, pillowAnimation) {
        this.cameraAnimation = cameraAnimation;
        this.pillowAnimation = pillowAnimation;
        this.clock = new THREE.Clock();
        this.animate = this.animate.bind(this);
    }

    animate() {
        requestAnimationFrame(this.animate);

        const deltaTime = this.clock.getDelta();

        // Update camera animation
        this.cameraAnimation.update();

        // Update pillow animation
        if (this.pillowAnimation) {
            this.pillowAnimation.update(deltaTime);
        }

        // Update controls
        controls.update();

        // Render scene
        renderer.render(scene, camera);
    }

    start() {
        this.clock.start();
        this.animate();
    }

    stop() {
        this.clock.stop();
    }
}

export { AnimationLoop }; 