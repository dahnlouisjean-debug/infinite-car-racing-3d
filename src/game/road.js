import { registerSystem } from '../engine/registry.js';

// Object pool for road segments
export class RoadSystem {
  init(ctx){
    this.segmentLen = 40;
    this.poolSize = 20;
    this.width = 20;
    this.segments = [];
    this.spawnZ = 0;

    for (let i=0;i<this.poolSize;i++){
      const seg = this.#createSegment(i*this.segmentLen);
      ctx.scene.add(seg.group);
      this.segments.push(seg);
      this.spawnZ = i*this.segmentLen;
    }
  }
  #createSegment(z){
    const group = new THREE.Group();
    // road
    const road = new THREE.Mesh(
      new THREE.PlaneGeometry(this.width, this.segmentLen),
      new THREE.MeshLambertMaterial({ color: 0x3a3a3a })
    );
    road.rotation.x = -Math.PI/2; road.position.z = z; road.receiveShadow = true; group.add(road);
    // center line
    const line = new THREE.Mesh(
      new THREE.PlaneGeometry(0.4, this.segmentLen),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    line.rotation.x = -Math.PI/2; line.position.set(0,0.01,z); group.add(line);
    // grass
    const grassL = new THREE.Mesh(
      new THREE.PlaneGeometry(30, this.segmentLen),
      new THREE.MeshLambertMaterial({ color: 0x227722 })
    );
    grassL.rotation.x = -Math.PI/2; grassL.position.set(-this.width/2-15,-0.05,z); group.add(grassL);
    const grassR = grassL.clone(); grassR.position.x = this.width/2+15; group.add(grassR);

    return { group, z };
  }
  update(ctx, dt){
    const carZ = ctx.player.mesh.position.z;
    const recycleZ = carZ - this.segmentLen*5;
    this.segments.forEach(seg => {
      if (seg.group.position.z < recycleZ){
        this.spawnZ += this.segmentLen;
        seg.group.position.z = this.spawnZ;
      }
    });
  }
}

registerSystem('road', new RoadSystem());
