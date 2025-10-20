// Simple keyboard input manager
export class Input {
  constructor() {
    this.keys = new Map();
    this.listeners = [];
  }
  init() {
    window.addEventListener('keydown', e => this.#set(e.code, true));
    window.addEventListener('keyup', e => this.#set(e.code, false));
  }
  #set(code, value) {
    this.keys.set(code, value);
    this.listeners.forEach((fn) => fn(code, value));
  }
  pressed(code) { return this.keys.get(code) === true; }
  onChange(fn){ this.listeners.push(fn); }
}
