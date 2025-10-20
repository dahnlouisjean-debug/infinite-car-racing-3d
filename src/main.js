// Infinite Car Racing 3D - Main Game Engine
// Version simplifiée pour compatibilité Mac M4
// Utilise Three.js et Cannon.js en global

class InfiniteCarGame {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.world = null;
        this.car = null;
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
        
        this.frameCount = 0;
        this.lastFPSUpdate = performance.now();
        
        // Démarrage immédiat
        this.init();
    }
    
    init() {
        console.log('🚗 Démarrage de l\'initialisation...');
        
        try {
            // Vérifie que les librairies sont disponibles
            if (typeof THREE === 'undefined') {
                throw new Error('Three.js non chargé');
            }
            if (typeof CANNON === 'undefined') {
                throw new Error('Cannon.js non chargé');
            }
            
            console.log('✅ Librairies détectées: Three.js', THREE.REVISION, '+ Cannon.js');
            
            this.updateProgress('Initialisation du renderer...');
            this.setupRenderer();
            
            this.updateProgress('Création de la scène 3D...');
            this.setupScene();
            
            this.updateProgress('Démarrage du moteur physique...');
            this.setupPhysics();
            
            this.updateProgress('Configuration de la caméra...');
            this.setupCamera();
            
            this.updateProgress('Ajout de l’éclairage...');
            this.setupLighting();
            
            this.updateProgress('Création du véhicule...');
            this.setupCar();
            
            this.updateProgress('Génération de la route...');
            this.setupRoad();
            
            this.updateProgress('Activation des contrôles...');
            this.setupControls();
            this.setupUI();
            
            // Finalisation
            document.getElementById('loading').classList.add('hidden');
            document.getElementById('ui').classList.remove('hidden');
            document.getElementById('controls').classList.remove('hidden');
            
            this.gameState.isGameRunning = true;
            window.gameInitialized = true;
            
            console.log('🏁 Jeu initialisé avec succès!');
            
            // Démarrage de la boucle de jeu
            this.gameLoop();
            
        } catch (error) {
            console.error('❌ Erreur d\'initialisation:', error);
            this.showError('Erreur: ' + error.message);
        }
    }
    
    updateProgress(message) {
        const progress = document.getElementById('loadingProgress');
        if (progress) {
            progress.textContent = message;
        }
        console.log('🔧', message);
    }
    
    showError(message) {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('errorText').textContent = message;
        document.getElementById('errorMessage').classList.remove('hidden');
    }
    
    setupRenderer() {
        const canvas = document.getElementById('gameCanvas');
        
        // Configuration compatible Mac M4
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas, 
            antialias: false,  // Désactivé pour performance
            powerPreference: "default",  // Pas high-performance sur M4
            failIfMajorPerformanceCaveat: false
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(1); // Forcé à 1 pour éviter les problèmes M4
        this.renderer.shadowMap.enabled = false; // Pas d'ombres pour commencer
        this.renderer.setClearColor(0x87CEEB, 1);
        
        // Responsive
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Gestion contexte perdu
        canvas.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            console.error('⚠️ Contexte WebGL perdu');
            this.showError('Contexte WebGL perdu. Rechargez la page.');
        });
    }
    
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x87CEEB, 100, 800); // Fog réduit
    }
    
    setupPhysics() {
        this.world = new CANNON.World();
        this.world.gravity.set(0, -20, 0); // Gravité réduite
        this.world.broadphase = new CANNON.NaiveBroadphase();
        
        // Matériaux basiques
        this.materials = {
            ground: new CANNON.Material('ground'),
            car: new CANNON.Material('car')
        };
        
        const contact = new CANNON.ContactMaterial(
            this.materials.car,
            this.materials.ground,
            { friction: 0.4, restitution: 0.1 }
        );
        this.world.addContactMaterial(contact);
    }
    
    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 10, 15);
    }
    
    setupLighting() {
        // Éclairage minimal pour performance
        const ambient = new THREE.AmbientLight(0x404040, 1.5);
        this.scene.add(ambient);
        
        const directional = new THREE.DirectionalLight(0xffffff, 0.8);
        directional.position.set(10, 10, 5);
        this.scene.add(directional);
    }
    
    setupCar() {
        // Voiture très simple
        const carGroup = new THREE.Group();
        
        // Corps principal
        const bodyGeometry = new THREE.BoxGeometry(1.8, 0.8, 3.5);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0xff2222 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.4;
        carGroup.add(body);
        
        // 4 roues simples
        const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 8);
        const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x222222 });
        
        const wheelPositions = [
            [-0.8, 0.3, 1.2], [0.8, 0.3, 1.2],
            [-0.8, 0.3, -1.2], [0.8, 0.3, -1.2]
        ];
        
        wheelPositions.forEach(pos => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.position.set(...pos);
            wheel.rotation.z = Math.PI / 2;
            carGroup.add(wheel);
        });
        
        this.car = { mesh: carGroup };
        this.scene.add(carGroup);
        
        // Physique simple
        const shape = new CANNON.Sphere(1);
        this.car.body = new CANNON.Body({ mass: 1000, material: this.materials.car });
        this.car.body.addShape(shape);
        this.car.body.position.set(0, 2, 0);
        this.world.add(this.car.body);
    }
    
    setupRoad() {
        // Route très simple - juste quelques segments
        for (let i = 0; i < 10; i++) {
            this.createRoadSegment(i * 40 - 200);
        }
    }
    
    createRoadSegment(zPos) {
        const group = new THREE.Group();
        
        // Route principale
        const roadGeometry = new THREE.PlaneGeometry(15, 40);
        const roadMaterial = new THREE.MeshLambertMaterial({ color: 0x444444 });
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.rotation.x = -Math.PI / 2;
        road.position.z = zPos;
        group.add(road);
        
        // Ligne centrale
        const lineGeometry = new THREE.PlaneGeometry(0.3, 40);
        const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const line = new THREE.Mesh(lineGeometry, lineMaterial);
        line.rotation.x = -Math.PI / 2;
        line.position.set(0, 0.01, zPos);
        group.add(line);
        
        // Sol physique
        const groundShape = new CANNON.Plane();
        const groundBody = new CANNON.Body({ mass: 0, material: this.materials.ground });
        groundBody.addShape(groundShape);
        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        groundBody.position.set(0, 0, zPos);
        this.world.add(groundBody);
        
        const segment = { mesh: group, body: groundBody, zPos: zPos };
        this.roadSegments.push(segment);
        this.scene.add(group);
    }
    
    setupControls() {
        document.addEventListener('keydown', (e) => {
            switch (e.code) {
                case 'KeyW': case 'ArrowUp': this.controls.forward = true; break;
                case 'KeyS': case 'ArrowDown': this.controls.backward = true; break;
                case 'KeyA': case 'ArrowLeft': this.controls.left = true; break;
                case 'KeyD': case 'ArrowRight': this.controls.right = true; break;
                case 'Space': e.preventDefault(); this.controls.handbrake = true; break;
                case 'KeyR': this.resetCar(); break;
            }
        });
        
        document.addEventListener('keyup', (e) => {
            switch (e.code) {
                case 'KeyW': case 'ArrowUp': this.controls.forward = false; break;
                case 'KeyS': case 'ArrowDown': this.controls.backward = false; break;
                case 'KeyA': case 'ArrowLeft': this.controls.left = false; break;
                case 'KeyD': case 'ArrowRight': this.controls.right = false; break;
                case 'Space': this.controls.handbrake = false; break;
            }
        });
    }
    
    setupUI() {
        this.ui = {
            speed: document.getElementById('speed'),
            distance: document.getElementById('distance'),
            fps: document.getElementById('fps')
        };
    }
    
    updateCar() {
        if (!this.car.body) return;
        
        const force = new CANNON.Vec3();
        const torque = new CANNON.Vec3();
        
        if (this.controls.forward) force.z = -8000;
        if (this.controls.backward) force.z = 4000;
        if (this.controls.left) torque.y = 500;
        if (this.controls.right) torque.y = -500;
        
        if (this.controls.handbrake) {
            this.car.body.velocity.scale(0.9, this.car.body.velocity);
        }
        
        this.car.body.applyLocalForce(force, new CANNON.Vec3(0, 0, 0));
        this.car.body.applyTorque(torque);
        
        // Friction
        this.car.body.velocity.scale(0.99, this.car.body.velocity);
        this.car.body.angularVelocity.scale(0.95, this.car.body.angularVelocity);
        
        // Sync visual
        this.car.mesh.position.copy(this.car.body.position);
        this.car.mesh.quaternion.copy(this.car.body.quaternion);
        
        // Stats
        this.gameState.speed = this.car.body.velocity.length() * 3.6;
        this.gameState.distance = Math.abs(this.car.body.position.z);
    }
    
    updateCamera() {
        if (!this.car.body) return;
        
        const carPos = this.car.body.position;
        const targetPos = new THREE.Vector3(carPos.x, carPos.y + 8, carPos.z + 12);
        
        this.camera.position.lerp(targetPos, 0.1);
        this.camera.lookAt(carPos.x, carPos.y, carPos.z - 3);
    }
    
    updateRoad() {
        if (!this.car.body) return;
        
        const carZ = this.car.body.position.z;
        
        this.roadSegments.forEach(segment => {
            if (segment.zPos > carZ + 100) {
                const newZ = carZ - 200;
                segment.zPos = newZ;
                segment.mesh.position.z = newZ;
                segment.body.position.z = newZ;
            }
        });
    }
    
    updateUI() {
        if (!this.ui.speed) return;
        
        this.ui.speed.textContent = Math.round(this.gameState.speed);
        this.ui.distance.textContent = Math.round(this.gameState.distance);
        
        // FPS
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
        this.car.body.position.set(0, 3, this.car.body.position.z);
        this.car.body.quaternion.set(0, 0, 0, 1);
        this.car.body.velocity.set(0, 0, 0);
        this.car.body.angularVelocity.set(0, 0, 0);
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    gameLoop() {
        if (!this.gameState.isGameRunning) return;
        
        requestAnimationFrame(() => this.gameLoop());
        
        // Update physique (60Hz fixe pour stabilité)
        this.world.step(1/60);
        
        this.updateCar();
        this.updateCamera();
        this.updateRoad();
        this.updateUI();
        
        // Rendu
        this.renderer.render(this.scene, this.camera);
    }
}

// Attendre le chargement complet
window.addEventListener('load', () => {
    console.log('🚗 Page chargée, vérification des dépendances...');
    
    // Délai pour s'assurer que tout est chargé
    setTimeout(() => {
        try {
            if (typeof THREE === 'undefined') {
                throw new Error('Three.js non disponible');
            }
            if (typeof CANNON === 'undefined') {
                throw new Error('Cannon.js non disponible');
            }
            
            new InfiniteCarGame();
            
        } catch (error) {
            console.error('❌ Erreur fatale:', error);
            document.getElementById('loadingProgress').textContent = 'ERREUR: ' + error.message;
        }
    }, 1000); // Attendre 1 seconde
});