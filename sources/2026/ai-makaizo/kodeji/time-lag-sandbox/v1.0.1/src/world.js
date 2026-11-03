/*
 * Sandspiel adaptations, original Copyright (c) 2018 Max Bittker, MIT.
 * Source: crate/src/species.rs, update_sand (69–91), update_water (167–289)
 * at 9936e06b07a583aedfba9589c0cead2917f405fb.
 * Adapted to a bounded JavaScript grid by こでじ, 2026.
 * Changes: only empty/sand/water/fixed stone; simpler lateral water rule;
 * no fluid simulation, Rust, remote services, fonts, images or libraries.
 * Full original MIT notice is embedded in the document and LICENSES.txt.
 */
class SandWorld {
  static EMPTY = 0;
  static SAND = 1;
  static WATER = 2;
  static STONE = 3;

  constructor(width = 180, height = 134, seed = 111) {
    if (!Number.isInteger(width) || !Number.isInteger(height) || width < 8 || height < 8 || width > 240 || height > 180) throw new RangeError('Board size out of range');
    this.width = width;
    this.height = height;
    this.seed = seed >>> 0;
    this.cells = new Uint8Array(width * height);
    this.touched = new Uint32Array(width * height);
    this.tick = 0;
    this.changes = 0;
  }

  random() {
    this.seed = (Math.imul(this.seed, 1664525) + 1013904223) >>> 0;
    return this.seed / 4294967296;
  }

  at(x, y) {
    return x < 0 || y < 0 || x >= this.width || y >= this.height ? SandWorld.STONE : this.cells[y * this.width + x];
  }

  set(x, y, kind) {
    if (x < 1 || y < 0 || x >= this.width - 1 || y >= this.height - 1) return;
    this.cells[y * this.width + x] = kind;
  }

  paint(x, y, kind, radius = 2) {
    if (![x, y, radius].every(Number.isFinite) || ![1, 2, 3].includes(kind)) return 0;
    x = Math.round(x); y = Math.round(y);
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return 0;
    radius = Math.max(1, Math.min(4, Math.floor(radius)));
    let count = 0;
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        if (dx * dx + dy * dy <= radius * radius && this.at(x + dx, y + dy) === SandWorld.EMPTY) {
          this.set(x + dx, y + dy, kind);
          count++;
        }
      }
    }
    return count;
  }

  swap(x, y, nx, ny) {
    const a = y * this.width + x, b = ny * this.width + nx;
    const value = this.cells[a];
    this.cells[a] = this.cells[b]; this.cells[b] = value;
    this.touched[a] = this.tick; this.touched[b] = this.tick;
    this.changes++;
  }

  step() {
    if (this.tick >= 0xfffffffe) { this.touched.fill(0); this.tick = 0; }
    this.tick++;
    this.changes = 0;
    const reverse = (this.tick & 1) === 0;
    for (let y = this.height - 2; y >= 0; y--) {
      for (let i = 1; i < this.width - 1; i++) {
        const x = reverse ? this.width - 1 - i : i;
        const index = y * this.width + x, kind = this.cells[index];
        if ((kind !== SandWorld.SAND && kind !== SandWorld.WATER) || this.touched[index] === this.tick) continue;
        const d = this.random() < 0.5 ? -1 : 1;
        const below = this.at(x, y + 1);
        // Sandspiel: fall, then diagonal, then displace water below.
        if (kind === SandWorld.SAND) {
          if (below === SandWorld.EMPTY) this.swap(x, y, x, y + 1);
          else if (this.at(x + d, y + 1) === SandWorld.EMPTY) this.swap(x, y, x + d, y + 1);
          else if (below === SandWorld.WATER) this.swap(x, y, x, y + 1);
        } else {
          // Sandspiel: down, diagonal, opposite diagonal, then lateral flow.
          if (below === SandWorld.EMPTY) this.swap(x, y, x, y + 1);
          else if (this.at(x + d, y + 1) === SandWorld.EMPTY) this.swap(x, y, x + d, y + 1);
          else if (this.at(x - d, y + 1) === SandWorld.EMPTY) this.swap(x, y, x - d, y + 1);
          else if (this.at(x + d, y) === SandWorld.EMPTY) {
            this.swap(x, y, x + d * (this.at(x + 2 * d, y) === SandWorld.EMPTY ? 2 : 1), y);
          } else if (this.at(x - d, y) === SandWorld.EMPTY) this.swap(x, y, x - d, y);
        }
      }
    }
    return this.changes;
  }

  initialize(other = false) {
    this.cells.fill(0); this.touched.fill(0); this.tick = 0;
    this.seed = other ? 222 : 111;
    for (let x = 0; x < this.width; x++) {
      const px = x / this.width * 540;
      const level = other
        ? 325 - 54 * Math.exp(-(((px - 120) / 95) ** 2)) - 12 * Math.sin(px / 48)
        : 327 - 93 * Math.exp(-(((px - 154) / 85) ** 2)) - 16 * Math.sin(px / 63);
      for (let y = Math.max(0, Math.floor(level / 400 * this.height)); y < this.height - 1; y++) {
        this.cells[y * this.width + x] = SandWorld.SAND;
      }
      for (let y = Math.floor((313 - Number(other) * 11) / 400 * this.height); y < this.height - 1; y++) {
        if (this.cells[y * this.width + x] === SandWorld.EMPTY) this.cells[y * this.width + x] = SandWorld.WATER;
      }
      if (x >= Math.floor(this.width * .69) && x < Math.floor(this.width * .82)) {
        for (let y = Math.floor(this.height * .73); y < this.height; y++) this.cells[y * this.width + x] = SandWorld.STONE;
      }
    }
    for (let y = 0; y < this.height; y++) this.cells[y * this.width] = this.cells[y * this.width + this.width - 1] = SandWorld.STONE;
    this.cells.fill(SandWorld.STONE, (this.height - 1) * this.width);
  }
}
