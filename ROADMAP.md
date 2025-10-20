# Roadmap: Infinite Car Racing 3D

This document tracks planned features and implementation status. Branches:
- dev: main development with Three + Cannon (modular)
- fresh-start: minimal Three-only prototype for compatibility

## Phase A: Core systems
- [x] Project bootstrap, scene/camera/renderer
- [x] HUD (speed, distance, FPS)
- [x] Input manager (keyboard)
- [ ] Object pool + infinite road segments
- [ ] Modular car controller (arcade handling)
- [ ] Game loop with fixed physics step
- [ ] Pause/state manager

## Phase B: Gameplay features
- [ ] Obstacles traffic cars (simple AI lanes)
- [ ] Collectibles (nitro, coins)
- [ ] Scoring (distance, near-miss bonus)
- [ ] Difficulty ramp (traffic density)

## Phase C: Feel and polish
- [ ] Skybox + directional sun cycle
- [ ] Postprocessing (bloom, vignette, motion blur lightweight)
- [ ] Particles: tire smoke, skid
- [ ] Audio: engine, brake, wind, UI

## Phase D: Performance
- [ ] Object pooling for segments/traffic
- [ ] Frustum culling and LOD for props
- [ ] Texture compression hints (webp/ktx2 later)

## Phase E: Tooling
- [ ] ESLint + Prettier
- [ ] Vite dev server config
- [ ] Simple build script
