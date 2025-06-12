import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';
import { scene, camera } from './initScene.js';

class InteractionManager {
    constructor() {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.clickedParts = new Set();
        this.hoveredObject = null;
        this.originalMaterials = new Map();
        this.originalColors = new Map();
        this.isPillow = (name) => name.startsWith('Pillow');
        
        // Bind event handlers
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onClick = this.onClick.bind(this);
        
        // Add event listeners
        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('click', this.onClick);

        // Initialize info card with default message
        this.initializeInfoCard();
    }

    initializeInfoCard() {
        const infoCard = document.querySelector('.info-card');
        const partNameElement = document.getElementById('partName');
        const partDescriptionElement = document.getElementById('partDescription');
        
        // Set default content
        partNameElement.textContent = 'No part selected';
        partDescriptionElement.textContent = 'Hover over or click on any part to see details';
        
        // Show card by default
        infoCard.classList.add('visible');
    }

    onMouseMove(event) {
        // Calculate mouse position in normalized device coordinates
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Update the raycaster
        this.raycaster.setFromCamera(this.mouse, camera);

        // Find intersections
        const intersects = this.raycaster.intersectObjects(scene.children, true);

        // Reset previous hover effect
        if (this.hoveredObject) {
            this.resetHoverEffect();
        }

        // Apply hover effect to new object
        if (intersects.length > 0) {
            this.hoveredObject = intersects[0].object;
            this.applyHoverEffect();
            // Update info card on hover
            this.updateInfoCard(this.hoveredObject.name);
        } else {
            this.hoveredObject = null;
            // Reset to default message when not hovering over any part
            this.initializeInfoCard();
        }
    }

    onClick(event) {
        if (this.hoveredObject) {
            const partName = this.hoveredObject.name;
            
            // Add to clicked parts set
            this.clickedParts.add(partName);
            
            // Update counter
            document.getElementById('partsCounter').textContent = 
                `Parts Interacted: ${this.clickedParts.size}`;
            
            // Show info card
            this.showInfoCard(partName);
            
            // Apply click effect based on part type
            if (this.isPillow(partName)) {
                this.applyPillowClickEffect();
            } else {
                this.applyClickEffect();
            }
        }
    }

    applyHoverEffect() {
        if (this.hoveredObject) {
            // Store original material if not already stored
            if (!this.originalMaterials.has(this.hoveredObject)) {
                this.originalMaterials.set(this.hoveredObject, this.hoveredObject.material);
            }
            
            // Apply smaller scale for all parts
            const scale = 1.03; // Reduced from 1.05/1.1 to 1.03
            this.hoveredObject.scale.set(scale, scale, scale);
        }
    }

    resetHoverEffect() {
        if (this.hoveredObject) {
            // Reset scale
            this.hoveredObject.scale.set(1, 1, 1);
        }
    }

    applyPillowClickEffect() {
        if (this.hoveredObject) {
            // Store original color if not already stored
            if (!this.originalColors.has(this.hoveredObject)) {
                this.originalColors.set(this.hoveredObject, this.hoveredObject.material.color.clone());
            }
            
            // Create a clone of the original material
            const material = this.hoveredObject.material.clone();
            
            // Change color to a darker blue
            material.color.set(0x4682B4); // Steel Blue - darker than previous
            
            // Add subtle emissive highlight
            material.emissive = new THREE.Color(0x222222); // Darker emissive
            
            // Apply the new material
            this.hoveredObject.material = material;
            
            // Reset after 500ms
            setTimeout(() => {
                const originalMaterial = this.originalMaterials.get(this.hoveredObject);
                const newMaterial = originalMaterial.clone();
                newMaterial.color.copy(this.originalColors.get(this.hoveredObject));
                this.hoveredObject.material = newMaterial;
            }, 500);
        }
    }

    applyClickEffect() {
        if (this.hoveredObject) {
            // Create a clone of the original material
            const material = this.hoveredObject.material.clone();
            
            // Add emissive highlight (reduced intensity)
            material.emissive = new THREE.Color(0x444444); // Darker emissive
            this.hoveredObject.material = material;
            
            // Reset after 500ms
            setTimeout(() => {
                this.hoveredObject.material = this.originalMaterials.get(this.hoveredObject);
            }, 500);
        }
    }

    updateInfoCard(partName) {
        const infoCard = document.querySelector('.info-card');
        const partNameElement = document.getElementById('partName');
        const partDescriptionElement = document.getElementById('partDescription');
        
        // Get part description based on name
        const description = this.getPartDescription(partName);
        
        // Update content
        partNameElement.textContent = partName;
        partDescriptionElement.textContent = description;
        
        // Ensure card is visible
        infoCard.classList.add('visible');
    }

    showInfoCard(partName) {
        const infoCard = document.querySelector('.info-card');
        const partNameElement = document.getElementById('partName');
        const partDescriptionElement = document.getElementById('partDescription');
        
        // Get part description based on name
        const description = this.getPartDescription(partName);
        
        // Update content
        partNameElement.textContent = partName;
        partDescriptionElement.textContent = description;
        
        // Show card
        infoCard.classList.add('visible');
        
        // Don't hide the card automatically anymore
        // This allows the info to stay visible
    }

    getPartDescription(partName) {
        const descriptions = {
            'Frame': 'Solid wooden bed frame with premium finish',
            'Mattress': 'High-quality memory foam mattress for optimal comfort',
            'Headboard': 'Elegant wooden headboard with modern design',
            'Pillow 1': 'Soft and supportive pillow for comfortable sleep',
            'Pillow 2': 'Medium-firm pillow for neck support',
            'Pillow 3': 'Extra soft pillow for ultimate comfort',
            'Leg 1': 'Sturdy wooden bed leg with protective cap',
            'Leg 2': 'Sturdy wooden bed leg with protective cap',
            'Leg 3': 'Sturdy wooden bed leg with protective cap',
            'Leg 4': 'Sturdy wooden bed leg with protective cap',
            'Blanket': 'Premium cotton blanket with modern design'
        };
        
        return descriptions[partName] || 'No description available';
    }

    dispose() {
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('click', this.onClick);
    }
}

export { InteractionManager }; 