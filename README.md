# Interactive 3D Bed Viewer - GRAPHICS Individual Assignment  

## **Made by:** Nahom Zenebe<br>
## **ID:** UGR/0216/15  
## **Section:** 3


## 📌 Overview
This project is an **Interactive 3D Product Viewer** built with [Three.js](https://threejs.org/), designed as part of an individual assignment to demonstrate foundational graphics programming skills.

The product visualized here is a **3D Bed**, constructed entirely from **basic geometry meshes** and enhanced with texture mapping, lighting, animations, and user interactions.

---

## 🗂️ Folder Structure

```
GRAPHICS_INDIVIDUAL_ASSIGNMENT/
│
├── index.html                # Main HTML file
├── main.js                   # Primary JavaScript entry point
├── styles.css                # CSS stylesheet
│
├── textures/                 # Texture assets
│   ├── FabricBlanket.jpg
│   ├── mattress.jpg
│   ├── pillow.jpg
│   └── woodforbed.jpg
│
└── scripts/                  # JavaScript modules
    ├── addLighting.js        # Lighting configuration
    ├── animationLoop.js      # Main animation loop
    ├── cameraAnimation.js    # Camera controls and animations
    ├── createProduct.js      # 3D object creation
    ├── initScene.js          # Scene initialization
    ├── interaction.js        # User interaction handlers
    ├── pillowAnimation.js    # Special pillow animations
    └── textureManager.js     # Texture loading and management
```
---

## 🎯 Assignment Objective
Create a 3D viewer using **Three.js** that allows users to:
- View a product (bed) made of basic geometries
- Interact with product parts using the mouse
- Observe smooth camera rotation
- Experience animations and lighting

---

## 🚀 Features

### 1. Scene Initialization
- `PerspectiveCamera`, `WebGLRenderer`, and canvas created in `initScene.js`
- Responsive canvas updates on window resize
- OrbitControls for zoom and pan

### 2. Product Composition (`createProduct.js`)
- Constructed using `THREE.BoxGeometry`, `THREE.CylinderGeometry`, etc.
- Applied realistic materials with `MeshStandardMaterial`
- Textures loaded from `/textures`

### 3. Lighting (`addLighting.js`)
- Ambient light for base illumination
- Directional light for shadows and highlights

### 4. Mouse Interaction (`interaction.js`)
- Raycasting detects clicks
- Hover/click effects with color/scale feedback
- Display part name in a popup or console

### 5. Camera Animation (`cameraAnimation.js`)
- Smooth orbit around the product using polar coordinates
- Optional user control override (pauses auto-rotation on user interaction)

### 6. Pillow Animation (`pillowAnimation.js`)
- Subtle pulsing, rotation, and scaling for pillows
- Adds life-like motion using sine-based animations

### 7. Animation Loop (`animationLoop.js`)
- Uses `requestAnimationFrame` for rendering and updates
- Integrates camera and mesh animation smoothly

---

## 🧱 Technologies Used
- **Three.js v0.128.0** via Skypack CDN
- HTML5, CSS3, JavaScript (ES6 modules)

---

## 🧪 How to Run

1. Clone or download the project.
2. Open `index.html` in any modern browser (Chrome recommended).
3. Interact with the 3D bed using mouse controls or let it auto-rotate.
4. Click on pillows to trigger animations or information display.

> 📌 No build tools required. Everything runs directly in the browser.

---

