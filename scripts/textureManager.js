import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';

const textureLoader = new THREE.TextureLoader();


// Function to create a material with texture
function createTexturedMaterial(options) {
    const {
        texturePath,
        color = 0xffffff,
        roughness = 0.7,
        metalness = 0.2,
        repeatX = 1,
        repeatY = 1,
        normalScale = 1.0
    } = options;

    const material = new THREE.MeshStandardMaterial({
        color: color,
        roughness: roughness,
        metalness: metalness,
        map: textureLoader.load(texturePath),
        normalScale: new THREE.Vector2(normalScale, normalScale)
    });

    // Set texture repeat
    if (material.map) {
        material.map.wrapS = THREE.RepeatWrapping;
        material.map.wrapT = THREE.RepeatWrapping;
        material.map.repeat.set(repeatX, repeatY);
    }

    return material;
}


// Predefined materials with textures
const materials = {
    frame: createTexturedMaterial({
        texturePath: 'textures/wood/woodforbed.jpg',
        color: 0x5C4033, // Darker brown for aged wood
        roughness: 0.8,  // Increased roughness for wood grain
        metalness: 0.1,  // Reduced metalness for wood
        repeatX: 2,
        repeatY: 2,
        normalScale: 0.7 // Increased normal scale for more pronounced wood grain
    }),
    
    mattress: createTexturedMaterial({
        texturePath: 'textures/mattress.jpg',
        color: 0xF5F5DC, // Beige color for mattress
        roughness: 0.9,  // High roughness for fabric
        metalness: 0.0,  // No metalness for fabric
        repeatX: 4,
        repeatY: 4,
        normalScale: 0.4 // Moderate normal scale for fabric texture
    }),
    
    pillow: createTexturedMaterial({
        texturePath: 'textures/pillow.jpg',
        color: 0xF5F5F5, // Light beige for pillows
        roughness: 0.95, // Very high roughness for soft fabric
        metalness: 0.0,  // No metalness for fabric
        repeatX: 2,
        repeatY: 2,
        normalScale: 0.3 // Subtle normal scale for pillow texture
    }),
    
    headboard: createTexturedMaterial({
        texturePath: 'textures/woodforbed.jpg',
        color: 0x5C4033, // Matching dark brown for headboard
        roughness: 0.8,
        metalness: 0.1,
        repeatX: 2,
        repeatY: 2,
        normalScale: 0.7
    }),
    
    leg: createTexturedMaterial({
        texturePath: 'textures/woodforbed.jpg',
        color: 0x5C4033, // Matching dark brown for legs
        roughness: 0.8,
        metalness: 0.1,
        repeatX: 1,
        repeatY: 2,
        normalScale: 0.7
    }),
    
    blanket: createTexturedMaterial({
        texturePath: 'textures/FabricBlanket.jpg',
        color: 0x708090, // Muted gray-blue for blanket
        roughness: 0.9,
        metalness: 0.0,
        repeatX: 3,
        repeatY: 3,
        normalScale: 0.5 // Increased normal scale for blanket folds
    })
};

export { materials }; 