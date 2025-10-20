import { registerSystem } from '../engine/registry.js';

export class HUDSystem {
  init(ctx){
    this.speed = document.getElementById('speed');
    this.distance = document.getElementById('distance');
    this.fps = document.getElementById('fps');
    this.last = performance.now();
    this.frames = 0;
  }
  update(ctx, dt){
    if (!this.speed) return;
    this.speed.textContent = Math.round(ctx.player.kmh||0);
    this.distance.textContent = Math.round(ctx.player.distance||0);
    this.frames++;
    const now = performance.now();
    if (now - this.last > 1000){
      this.fps.textContent = Math.round(this.frames*1000/(now-this.last));
      this.frames = 0; this.last = now;
    }
  }
}

registerSystem('hud', new HUDSystem());
