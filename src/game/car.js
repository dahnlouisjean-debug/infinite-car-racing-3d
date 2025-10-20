import { registerSystem } from '../engine/registry.js';

export class CarSystem {
  init(ctx){
    // vehicle
    const car = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.8,0.8,3.6), new THREE.MeshLambertMaterial({color:0xff3030}));
    body.position.y = 0.4; car.add(body);
    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.6,0.5,1.8), new THREE.MeshLambertMaterial({color:0xcc2020}));
    roof.position.set(0,0.95,-0.2); car.add(roof);
    const wheelGeo = new THREE.CylinderGeometry(0.35,0.35,0.25,12);
    const wheelMat = new THREE.MeshLambertMaterial({color:0x222222});
    const wheels=[];
    [[-1,0.35,1.2],[1,0.35,1.2],[-1,0.35,-1.2],[1,0.35,-1.2]].forEach(p=>{const w=new THREE.Mesh(wheelGeo,wheelMat);w.rotation.z=Math.PI/2;w.position.set(...p);car.add(w);wheels.push(w)});

    ctx.scene.add(car);
    ctx.player = { mesh: car, velocity: new THREE.Vector3(), rot: 0, kmh: 0, distance: 0 };

    // handling
    this.params = { steer: 0.4, accel: 7, brake: 6, friction: 3, maxSpeed: 45, turn: 1.6 };
  }
  update(ctx, dt){
    const p = ctx.player; const input = ctx.input;
    // input
    let thrust = 0;
    if (input.pressed('KeyW')||input.pressed('ArrowUp')) thrust += this.params.accel;
    if (input.pressed('KeyS')||input.pressed('ArrowDown')) thrust -= this.params.brake;

    // steering scales with speed
    const speed = p.velocity.length();
    let steer = 0;
    if (speed>0.3){
      if (input.pressed('KeyA')||input.pressed('ArrowLeft')) steer += this.params.turn*(Math.min(speed/15,1));
      if (input.pressed('KeyD')||input.pressed('ArrowRight')) steer -= this.params.turn*(Math.min(speed/15,1));
    }
    p.rot += steer*dt*this.params.steer;

    // integrate
    const forward = new THREE.Vector3(Math.sin(p.rot),0,Math.cos(p.rot));
    p.velocity.addScaledVector(forward, thrust*dt);

    // friction
    const fr = Math.exp(-this.params.friction*dt);
    p.velocity.multiplyScalar(fr);

    // clamp speed
    const max = this.params.maxSpeed/10; if (p.velocity.length()>max){ p.velocity.setLength(max); }

    // move
    p.mesh.position.addScaledVector(p.velocity, 1);
    p.mesh.rotation.y = p.rot;

    // stats
    p.kmh = p.velocity.length()*36;
    p.distance = Math.abs(p.mesh.position.z);
  }
}

registerSystem('car', new CarSystem());
