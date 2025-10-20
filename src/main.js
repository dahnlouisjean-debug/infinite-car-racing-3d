// Infinite Car Racing 3D - Main Game Engine
// Utilise Three.js pour le rendu 3D et Cannon-es pour la physique

// Imports des modules ES depuis CDN
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';

class InfiniteCarGame {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.world = null;
        this.car = null;
        this.road = [];
        this.roadSegments = [];
        
        this.gameState = {
            speed: 0,
            distance: 0,
            isPaused: false,
            isGameRunning: false
        };
        
        this.controls = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            handbrake: false
        };
        
        this.clock = new THREE.Clock();
        this.frameCount = 0;
        this.lastFPSUpdate = 0;
        
        this.init();
    }
    
    async init() {
        try {
            // Vérifie que les modules sont chargés
            if (!THREE || !CANNON) {
                throw new Error('Modules Three.js ou Cannon-es non chargés');
            }
            
            console.log('✅ Modules chargés: Three.js', THREE.REVISION, '+ Cannon-es');
            
            // Gestion des erreurs WebGL pour Mac M4
            this.setupWebGLErrorHandling();
            
            this.setupRenderer();
            this.setupScene();
            this.setupPhysics();
            this.setupCamera();
            this.setupLighting();
            this.setupCar();
            this.setupRoad();
            this.setupControls();
            this.setupUI();
            
            document.getElementById('loading').classList.add('hidden');
            document.getElementById('ui').classList.remove('hidden');
            document.getElementById('controls').classList.remove('hidden');
            
            this.gameState.isGameRunning = true;
            this.gameLoop();
            
            console.log('🏁 Jeu initialisé avec succès!');
        } catch (error) {
            console.error('❌ Erreur d\'initialisation:', error);
            this.showError('Erreur d\'initialisation: ' + error.message);
        }
    }
    
    setupWebGLErrorHandling() {
        const canvas = document.getElementById('gameCanvas');
        
        // Gestion de la perte de contexte WebGL (problème Mac M4)
        canvas.addEventListener('webglcontextlost', (event) => {
            event.preventDefault();
            console.error('🚫 Contexte WebGL perdu (bug Mac M4 connu)');
            this.showError('Contexte WebGL perdu. Essayez Firefox ou rechargez la page.');
        }, false);
        
        canvas.addEventListener('webglcontextrestored', () => {
            console.log('✅ Contexte WebGL restauré');
            // Pourrions re-initialiser ici si nécessaire
        }, false);
    }
    
    setupRenderer() {
        const canvas = document.getElementById('gameCanvas');
        
        // Configuration optimisée pour Mac M4
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas, 
            antialias: true,
            powerPreference: "high-performance",
            failIfMajorPerformanceCaveat: false // Permet le fallback logiciel
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // Réduit le pixel ratio pour éviter les problèmes M4
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor(0x87CEEB, 1); // Bleu ciel
        
        // Responsive
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x87CEEB, 50, 1000);
    }
    
    setupPhysics() {
        this.world = new CANNON.World({
            gravity: new CANNON.Vec3(0, -30, 0),
            broadphase: new CANNON.NaiveBroadphase(),
            allowSleep: true
        });
        
        // Matériaux physiques
        this.materials = {
            ground: new CANNON.Material('ground'),
            car: new CANNON.Material('car')
        };
        
        // Contact entre voiture et sol
        const carGroundContact = new CANNON.ContactMaterial(
            this.materials.car,
            this.materials.ground,
            {
                friction: 0.8,
                restitution: 0.1
            }
        );
        
        this.world.addContactMaterial(carGroundContact);
    }
    
    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            2000
        );
        
        // Position initiale de la caméra (sera mise à jour pour suivre la voiture)
        this.camera.position.set(0, 15, 20);
        this.camera.lookAt(0, 0, 0);
    }
    
    setupLighting() {
        // Lumière ambiante
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        // Soleil
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(50, 100, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;
        directionalLight.shadow.camera.left = -100;
        directionalLight.shadow.camera.right = 100;
        directionalLight.shadow.camera.top = 100;
        directionalLight.shadow.camera.bottom = -100;
        
        this.scene.add(directionalLight);
    }
    
    setupCar() {
        // Géométrie placeholder de la voiture (sera remplacée par un modèle 3D)
        const carGroup = new THREE.Group();
        
        // Carrosserie
        const bodyGeometry = new THREE.BoxGeometry(2, 1, 4);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.5;
        body.castShadow = true;
        carGroup.add(body);
        
        // Roues
        const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 8);
        const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        
        const wheels = [];
        const wheelPositions = [
            { x: -1, y: 0.4, z: 1.3 },  // Avant gauche
            { x: 1, y: 0.4, z: 1.3 },   // Avant droite
            { x: -1, y: 0.4, z: -1.3 }, // Arrière gauche
            { x: 1, y: 0.4, z: -1.3 }   // Arrière droite
        ];
        
        wheelPositions.forEach((pos, index) => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.position.set(pos.x, pos.y, pos.z);
            wheel.rotation.z = Math.PI / 2;
            wheel.castShadow = true;
            carGroup.add(wheel);
            wheels.push(wheel);
        });
        
        this.car = {
            mesh: carGroup,
            wheels: wheels,
            wheelBodies: []
        };
        
        this.scene.add(carGroup);
        
        // Corps physique de la voiture
        const carShape = new CANNON.Shape();
        carShape.type = CANNON.Shape.types.BOX;
        carShape.halfExtents = new CANNON.Vec3(1, 0.5, 2);
        
        this.car.body = new CANNON.Body({ 
            mass: 1000,
            material: this.materials.car
        });
        this.car.body.addShape(carShape);
        this.car.body.position.set(0, 2, 0);
        
        // Contraintes des roues (simulation basique)
        this.car.vehicle = new CANNON.RigidVehicle({
            chassisBody: this.car.body
        });
        
        this.world.addBody(this.car.body);
    }
    
    setupRoad() {
        // Génère la route infinie avec des segments
        const segmentLength = 50;
        const segmentWidth = 20;
        const segmentsToGenerate = 20;
        
        for (let i = 0; i < segmentsToGenerate; i++) {
            this.createRoadSegment(i * segmentLength, segmentWidth, segmentLength);
        }
    }
    
    createRoadSegment(zPosition, width, length) {
        const segmentGroup = new THREE.Group();
        
        // Route
        const roadGeometry = new THREE.PlaneGeometry(width, length);
        const roadMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.rotation.x = -Math.PI / 2;
        road.position.z = zPosition;
        road.receiveShadow = true;
        segmentGroup.add(road);
        
        // Bandes blanches
        for (let i = -1; i <= 1; i += 2) {
            const lineGeometry = new THREE.PlaneGeometry(0.5, length);
            const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const line = new THREE.Mesh(lineGeometry, lineMaterial);
            line.rotation.x = -Math.PI / 2;
            line.position.set(i * (width / 4), 0.01, zPosition);
            segmentGroup.add(line);
        }
        
        // Herbe sur les côtés
        [-1, 1].forEach(side => {
            const grassGeometry = new THREE.PlaneGeometry(30, length);
            const grassMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
            const grass = new THREE.Mesh(grassGeometry, grassMaterial);
            grass.rotation.x = -Math.PI / 2;
            grass.position.set(side * (width/2 + 15), -0.1, zPosition);
            grass.receiveShadow = true;
            segmentGroup.add(grass);
        });
        
        // Physique du sol
        const groundShape = new CANNON.Plane();
        const groundBody = new CANNON.Body({ 
            mass: 0,
            material: this.materials.ground
        });
        groundBody.addShape(groundShape);
        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        groundBody.position.set(0, 0, zPosition);
        
        this.world.addBody(groundBody);
        
        const segment = {
            mesh: segmentGroup,
            body: groundBody,
            zPosition: zPosition
        };
        
        this.roadSegments.push(segment);
        this.scene.add(segmentGroup);
        
        return segment;
    }
    
    setupControls() {
        // Gestion des événements clavier
        document.addEventListener('keydown', (event) => this.onKeyDown(event));
        document.addEventListener('keyup', (event) => this.onKeyUp(event));
        
        // Empêche le menu contextuel
        document.addEventListener('contextmenu', (event) => event.preventDefault());
    }
    
    setupUI() {
        // Les éléments UI sont déjà dans le HTML
        this.ui = {
            speed: document.getElementById('speed'),
            distance: document.getElementById('distance'),
            fps: document.getElementById('fps')
        };
    }
    
    showError(message) {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('errorText').textContent = message;
        document.getElementById('errorMessage').classList.remove('hidden');
    }
    
    onKeyDown(event) {
        if (this.gameState.isPaused) return;
        
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                this.controls.forward = true;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.controls.backward = true;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.controls.left = true;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.controls.right = true;
                break;
            case 'Space':
                event.preventDefault();
                this.controls.handbrake = true;
                break;
            case 'KeyR':
                this.resetCar();
                break;
            case 'KeyP':
                this.togglePause();
                break;
        }
    }
    
    onKeyUp(event) {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                this.controls.forward = false;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.controls.backward = false;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.controls.left = false;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.controls.right = false;
                break;
            case 'Space':
                this.controls.handbrake = false;
                break;
        }
    }
    
    updateCar(deltaTime) {
        if (!this.car.body) return;
        
        const force = new CANNON.Vec3();
        const torque = new CANNON.Vec3();
        
        const maxForce = 15000;
        const maxTorque = 1000;
        
        // Accélération/Frein
        if (this.controls.forward) {
            force.z = -maxForce;
        } else if (this.controls.backward) {
            force.z = maxForce * 0.7; // Moins puissant en marche arrière
        }
        
        // Direction
        if (this.controls.left) {
            torque.y = maxTorque;
        } else if (this.controls.right) {
            torque.y = -maxTorque;
        }
        
        // Frein à main
        if (this.controls.handbrake) {
            const velocity = this.car.body.velocity;
            const dampingForce = velocity.scale(-5000);
            force.vadd(dampingForce, force);
        }
        
        // Applique les forces
        this.car.body.applyLocalForce(force, new CANNON.Vec3(0, 0, 0));
        this.car.body.applyTorque(torque);
        
        // Friction naturelle
        this.car.body.velocity.scale(0.98, this.car.body.velocity);
        this.car.body.angularVelocity.scale(0.95, this.car.body.angularVelocity);
        
        // Met à jour la position du mesh
        this.car.mesh.position.copy(this.car.body.position);
        this.car.mesh.quaternion.copy(this.car.body.quaternion);
        
        // Calcule la vitesse
        const velocity = this.car.body.velocity.length();
        this.gameState.speed = velocity * 3.6; // Conversion m/s vers km/h
        
        // Met à jour la distance
        this.gameState.distance = Math.abs(this.car.body.position.z);
    }
    
    updateCamera() {
        if (!this.car.body) return;
        
        const carPosition = this.car.body.position;
        const carQuaternion = this.car.body.quaternion;
        
        // Caméra qui suit la voiture
        const cameraOffset = new CANNON.Vec3(0, 8, 15);
        const worldOffset = new CANNON.Vec3();
        carQuaternion.vmult(cameraOffset, worldOffset);
        
        const targetPosition = carPosition.vadd(worldOffset);
        
        // Interpolation douce
        this.camera.position.lerp(
            new THREE.Vector3(targetPosition.x, targetPosition.y, targetPosition.z),
            0.1
        );
        
        // Regarde la voiture
        this.camera.lookAt(
            carPosition.x,
            carPosition.y + 1,
            carPosition.z - 5
        );
    }
    
    updateRoad() {
        if (!this.car.body) return;
        
        const carZ = this.car.body.position.z;
        const segmentLength = 50;
        
        // Recycle les segments de route derrière la voiture
        this.roadSegments.forEach(segment => {
            if (segment.zPosition > carZ + 200) {
                // Déplace le segment devant
                const newZ = carZ - 500;
                segment.zPosition = newZ;
                segment.mesh.position.z = newZ;
                segment.body.position.z = newZ;
            }
        });
    }
    
    updateUI() {
        this.ui.speed.textContent = Math.round(this.gameState.speed);
        this.ui.distance.textContent = Math.round(this.gameState.distance);
        
        // FPS (mis à jour une fois par seconde)
        this.frameCount++;
        const now = performance.now();
        if (now - this.lastFPSUpdate > 1000) {
            const fps = Math.round(this.frameCount * 1000 / (now - this.lastFPSUpdate));
            this.ui.fps.textContent = fps;
            this.frameCount = 0;
            this.lastFPSUpdate = now;
        }
    }
    
    resetCar() {
        if (!this.car.body) return;
        
        this.car.body.position.set(0, 5, this.car.body.position.z);
        this.car.body.quaternion.set(0, 0, 0, 1);
        this.car.body.velocity.set(0, 0, 0);
        this.car.body.angularVelocity.set(0, 0, 0);
    }
    
    togglePause() {
        this.gameState.isPaused = !this.gameState.isPaused;
        console.log(this.gameState.isPaused ? '⏸️ Jeu en pause' : '▶️ Jeu repris');
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    gameLoop() {
        if (!this.gameState.isGameRunning) return;
        
        requestAnimationFrame(() => this.gameLoop());
        
        if (this.gameState.isPaused) {
            this.renderer.render(this.scene, this.camera);
            return;
        }
        
        const deltaTime = this.clock.getDelta();
        
        // Met à jour la physique
        this.world.step(deltaTime);
        
        // Met à jour les composants du jeu
        this.updateCar(deltaTime);
        this.updateCamera();
        this.updateRoad();
        this.updateUI();
        
        // Rendu
        this.renderer.render(this.scene, this.camera);
    }
}

// Démarre le jeu quand la page est chargée
window.addEventListener('load', () => {
    console.log('🚗 Initialisation du jeu de course 3D...');
    
    // Vérification de compatibilité
    if (!window.WebGLRenderingContext) {
        console.error('❌ WebGL non supporté par ce navigateur');
        document.getElementById('errorText').textContent = 'WebGL non supporté. Utilisez un navigateur plus récent.';
        document.getElementById('errorMessage').classList.remove('hidden');
        document.getElementById('loading').classList.add('hidden');
        return;
    }
    
    try {
        new InfiniteCarGame();
    } catch (error) {
        console.error('❌ Erreur fatale:', error);
        document.getElementById('errorText').textContent = 'Erreur fatale: ' + error.message;
        document.getElementById('errorMessage').classList.remove('hidden');
        document.getElementById('loading').classList.add('hidden');
    }
});