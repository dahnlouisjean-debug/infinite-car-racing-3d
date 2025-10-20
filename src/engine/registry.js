// Game bootstrap and module registry
export const Registry = {
  systems: {},
  state: {
    running: true,
    paused: false,
    timeScale: 1,
  },
};

export function registerSystem(name, system) {
  Registry.systems[name] = system;
}

export function initAll(ctx) {
  for (const key in Registry.systems) {
    Registry.systems[key].init?.(ctx);
  }
}

export function updateAll(ctx, dt) {
  for (const key in Registry.systems) {
    Registry.systems[key].update?.(ctx, dt);
  }
}
