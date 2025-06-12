import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';
import { scene } from './initScene.js';
import { materials } from './textureManager.js';

// Helper function to create a realistic pillow shape
function createPillowGeometry(width, height, depth, segments = 8) {
    const geometry = new THREE.BoxGeometry(width, height, depth, segments, segments, segments);
    

    // Get position attribute
    const position = geometry.attributes.position;
    const vertex = new THREE.Vector3();
    

    // Modify vertices to create pillow shape
    for (let i = 0; i < position.count; i++) {
        vertex.fromBufferAttribute(position, i);
        
        // Calculate distance from center in xz plane
        const distFromCenter = Math.sqrt(vertex.x * vertex.x + vertex.z * vertex.z);
        const maxDist = Math.sqrt((width/2) * (width/2) + (depth/2) * (depth/2));
        const normalizedDist = distFromCenter / maxDist;
        
        // Create pillow curve effect
        if (vertex.y > 0) { // Only modify top vertices
            // Add slight curve to top
            const curve = Math.cos(normalizedDist * Math.PI) * 0.1;
            vertex.y += curve;
            
            // Add slight rounding to edges
            if (normalizedDist > 0.7) {
                const edgeFactor = (normalizedDist - 0.7) / 0.3;
                vertex.y -= edgeFactor * 0.05;
            }
        }
        
        // Update vertex position
        position.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    
    // Update normals for proper lighting
    geometry.computeVertexNormals();
    
    return geometry;
}


function createBed() {
    const bedGroup = new THREE.Group();
    
    // Frame Base
    const frameGeometry = new THREE.BoxGeometry(4, 0.2, 6);
    const frame = new THREE.Mesh(frameGeometry, materials.frame);
    frame.position.y = 0.1;
    frame.name = "Frame";
    frame.castShadow = true;
    frame.receiveShadow = true;
    bedGroup.add(frame);

    // Mattress
    const mattressGeometry = new THREE.BoxGeometry(3.8, 0.3, 5.8);
    const mattress = new THREE.Mesh(mattressGeometry, materials.mattress);
    mattress.position.y = 0.35;
    mattress.name = "Mattress";
    mattress.castShadow = true;
    mattress.receiveShadow = true;
    bedGroup.add(mattress);

    // Headboard
    const headboardGeometry = new THREE.BoxGeometry(4, 1.2, 0.2);
    const headboard = new THREE.Mesh(headboardGeometry, materials.headboard);
    headboard.position.set(0, 0.7, -2.9);
    headboard.name = "Headboard";
    headboard.castShadow = true;
    headboard.receiveShadow = true;
    bedGroup.add(headboard);

    // Pillows with improved geometry
    const pillowWidth = 0.8;
    const pillowHeight = 0.15;
    const pillowDepth = 0.6;
    
    const pillowGeometry = createPillowGeometry(pillowWidth, pillowHeight, pillowDepth);
    
    const pillow1 = new THREE.Mesh(pillowGeometry, materials.pillow);
    pillow1.position.set(-1.2, 0.6, -2.2);
    pillow1.rotation.y = Math.PI * 0.1; // Slight rotation for natural look
    pillow1.name = "Pillow 1";
    pillow1.castShadow = true;
    pillow1.receiveShadow = true;
    bedGroup.add(pillow1);

    const pillow2 = new THREE.Mesh(pillowGeometry, materials.pillow);
    pillow2.position.set(0, 0.6, -2.2);
    pillow2.rotation.y = -Math.PI * 0.05; // Slight rotation in opposite direction
    pillow2.name = "Pillow 2";
    pillow2.castShadow = true;
    pillow2.receiveShadow = true;
    bedGroup.add(pillow2);

    const pillow3 = new THREE.Mesh(pillowGeometry, materials.pillow);
    pillow3.position.set(1.2, 0.6, -2.2);
    pillow3.rotation.y = Math.PI * 0.15; // Different rotation for variety
    pillow3.name = "Pillow 3";
    pillow3.castShadow = true;
    pillow3.receiveShadow = true;
    bedGroup.add(pillow3);

    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.4, 8);
    
    const positions = [
        [-1.8, -0.1, -2.8],
        [1.8, -0.1, -2.8],
        [-1.8, -0.1, 2.8],
        [1.8, -0.1, 2.8]
    ];

    positions.forEach((pos, index) => {
        const leg = new THREE.Mesh(legGeometry, materials.leg);
        leg.position.set(...pos);
        leg.name = `Leg ${index + 1}`;
        leg.castShadow = true;
        leg.receiveShadow = true;
        bedGroup.add(leg);
    });

    // Blanket
    const blanketGeometry = new THREE.BoxGeometry(3.6, 0.05, 4);
    const blanket = new THREE.Mesh(blanketGeometry, materials.blanket);
    blanket.position.set(0, 0.5, 0.5);
    blanket.name = "Blanket";
    blanket.castShadow = true;
    blanket.receiveShadow = true;
    bedGroup.add(blanket);

    // Center the entire bed
    bedGroup.position.set(0, 0, 0);
    scene.add(bedGroup);

    return bedGroup;
}

export { createBed }; 