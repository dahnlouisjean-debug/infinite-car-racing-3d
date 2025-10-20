# 🏎️ Infinite Car Racing 3D

**Jeu de course de voiture 3D infini avec physique réaliste**

Un jeu de course développé en HTML5/WebGL utilisant Three.js pour le rendu 3D et Cannon-es pour la physique temps réel.

## 🎮 Fonctionnalités actuelles

- ✅ **Moteur 3D** : Rendu WebGL optimisé avec Three.js
- ✅ **Physique réaliste** : Simulation de véhicule avec Cannon-es  
- ✅ **Contrôles intuitifs** : Clavier responsive (WASD/Flèches)
- ✅ **Route infinie** : Génération procédurale de segments recyclés
- ✅ **Caméra dynamique** : Poursuite fluide avec interpolation
- ✅ **HUD temps réel** : Vitesse, distance, FPS
- ✅ **Effets visuels** : Ombres, brouillard, éclairage directionnel

## 🎯 Contrôles

| Touche | Action |
|--------|--------|
| `↑` / `W` | Accélération |
| `↓` / `S` | Frein / Marche arrière |
| `←` / `A` | Tourner à gauche |
| `→` / `D` | Tourner à droite |
| `ESPACE` | Frein à main |
| `R` | Reset voiture |
| `P` | Pause |

## 🚀 Installation rapide

### Option 1: GitHub Pages (Recommandée)
```bash
# Clone le repository
git clone https://github.com/dahnlouisjean-debug/infinite-car-racing-3d.git
cd infinite-car-racing-3d

# Switch vers la branche de développement
git checkout dev

# Lance un serveur local
python -m http.server 8000
# ou avec Node.js: npx serve .
```

### Option 2: Fichier local
```bash
# Ouvre simplement index.html dans ton navigateur
# ⚠️ Certaines fonctionnalités nécessitent un serveur HTTP
```

Accède au jeu sur `http://localhost:8000`

## 🛠️ Architecture technique

### Stack technologique
- **Rendu** : Three.js (WebGL)
- **Physique** : Cannon-es  
- **Audio** : Web Audio API (à implémenter)
- **Performance** : Recyclage d'objets, LOD, frustum culling

### Structure des fichiers
```
infinite-car-racing-3d/
├── index.html              # Point d'entrée HTML
├── src/
│   └── main.js            # Moteur de jeu principal
├── assets/                # Assets du jeu (à ajouter)
│   ├── models/           # Modèles 3D (.glb/.gltf)
│   ├── textures/         # Textures (.jpg/.png)
│   └── audio/            # Fichiers audio (.mp3/.ogg)
├── package.json          # Métadonnées du projet
└── README.md             # Documentation
```

## 🎨 Assets supportés

### Modèles 3D (assets/models/)
- **Format recommandé** : `.glb` / `.gltf`
- `car.glb` - Modèle principal de voiture
- `road_segment.glb` - Segments de route détaillés
- `barriers.glb` - Barrières de sécurité
- `environment.glb` - Éléments décoratifs

### Textures (assets/textures/)
- **Formats** : `.jpg` (compressé) / `.png` (transparence)
- `road_diffuse.jpg` + `road_normal.jpg` - Route PBR
- `car_paint.jpg` - Peinture de la voiture
- `environment_*.jpg` - Textures d'environnement

### Audio (assets/audio/)
- **Formats** : `.mp3` / `.ogg`
- `engine_*.mp3` - Sons de moteur (idle, rev, gear)
- `effects_*.mp3` - Effets (freins, crash, ambiance)

## 🗺️ Roadmap de développement

### Phase 1: Base technique ✅
- [x] Setup Three.js + Cannon-es
- [x] Contrôles véhicule basiques
- [x] Route infinie procédurale
- [x] Interface utilisateur

### Phase 2: Amélioration gameplay 🔄
- [ ] **Système de checkpoint** avec temps au tour
- [ ] **Obstacles dynamiques** (autres voitures, cônes)
- [ ] **Power-ups** (boost, réparation)
- [ ] **Modes de jeu** (course libre, contre-la-montre)

### Phase 3: Assets réalistes 📋
- [ ] **Remplacement placeholders** par vrais modèles 3D
- [ ] **Textures PBR** haute qualité
- [ ] **Système audio** 3D spatialisé
- [ ] **Particules** (poussière, fumée, étincelles)

### Phase 4: Optimisations 📋
- [ ] **LOD (Level of Detail)** automatique
- [ ] **Occlusion culling** avancé
- [ ] **Compression assets** (Draco, KTX2)
- [ ] **Web Workers** pour la physique

### Phase 5: Fonctionnalités avancées 📋
- [ ] **Multijoueur** (WebRTC P2P)
- [ ] **Personnalisation** véhicules
- [ ] **Sauvegarde** progression (localStorage)
- [ ] **Leaderboards** en ligne

## 🔧 Développement

### Ajout d'assets
1. **Via interface GitHub** : Upload dans `/assets/models/`, `/assets/textures/`, `/assets/audio/`
2. **Via Git** : Clone, ajoute fichiers, commit, push
3. **Le code détectera automatiquement** les nouveaux assets

### Structure de commit recommandée
```
feat: ajoute système de checkpoint
fix: corrige bug physique roues
optim: améliore performance rendu
assets: ajoute modèle voiture Ferrari
docs: met à jour roadmap
```

### Performance tips
- **FPS Target** : 60 FPS constant
- **Draw calls** : < 100 par frame
- **Polygones** : < 50k triangles visibles
- **Textures** : 1024x1024 max pour mobile

## 📊 Statistiques techniques

- **Moteur physique** : 60 Hz avec interpolation
- **Rendu** : Adaptive selon GPU
- **Mémoire** : < 200MB RAM
- **Chargement** : < 3s sur connexion normale

## 🤝 Contribution

1. Fork le projet
2. Crée une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit tes changements (`git commit -m 'feat: ajoute nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvre une Pull Request

## 📜 Licence

Ce projet est sous licence MIT. Voir `LICENSE` pour plus de détails.

## 🎯 Objectifs du projet

- **Apprentissage** : Maîtriser WebGL, physique 3D, optimisations
- **Portfolio** : Démonstration de compétences full-stack
- **Innovation** : Repousser les limites du web gaming
- **Communauté** : Code open-source réutilisable

---

**Développé avec ❤️ par [dahnlouisjean-debug](https://github.com/dahnlouisjean-debug)**

*Prêt pour la course ? Démarre tes moteurs ! 🏁*