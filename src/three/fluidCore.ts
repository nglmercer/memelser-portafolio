// Semi-Lagrangian incompressible 2D flow: advection + pressure projection.
export class Fluid {
  n: number;
  size: number;
  u = new Float32Array(0);
  v = new Float32Array(0);
  d = new Float32Array(0);
  u0 = new Float32Array(0);
  v0 = new Float32Array(0);
  d0 = new Float32Array(0);
  p = new Float32Array(0);
  q = new Float32Array(0);
  div = new Float32Array(0);

  constructor(n = 64) {
    this.n = n;
    this.size = n * n;
    for (const k of ['u', 'v', 'd', 'u0', 'v0', 'd0', 'p', 'q', 'div'] as const) {
      this[k] = new Float32Array(this.size);
    }
  }

  sample(a: Float32Array, x: number, y: number): number {
    const n = this.n;
    x = Math.max(0, Math.min(n - 1.001, x));
    y = Math.max(0, Math.min(n - 1.001, y));
    const i = Math.floor(x);
    const j = Math.floor(y);
    const sx = x - i;
    const sy = y - j;
    const k = j * n + i;
    return (a[k] * (1 - sx) + a[k + 1] * sx) * (1 - sy) + (a[k + n] * (1 - sx) + a[k + n + 1] * sx) * sy;
  }

  inject(x: number, y: number, dx: number, dy: number, amount = 1): void {
    const n = this.n;
    for (let j = Math.max(1, Math.floor(y - 5)); j < Math.min(n - 1, y + 5); j++) {
      for (let i = Math.max(1, Math.floor(x - 5)); i < Math.min(n - 1, x + 5); i++) {
        const w = Math.exp(-((i - x) ** 2 + (j - y) ** 2) / 7);
        const k = j * n + i;
        this.u[k] += Math.max(-25, Math.min(25, dx)) * w;
        this.v[k] += Math.max(-25, Math.min(25, dy)) * w;
        this.d[k] = Math.min(3, this.d[k] + amount * w);
      }
    }
  }

  project(): void {
    const n = this.n;
    const { u, v, p, div } = this;
    p.fill(0);
    for (let y = 1; y < n - 1; y++) {
      for (let x = 1; x < n - 1; x++) {
        const i = y * n + x;
        div[i] = -0.5 * (u[i + 1] - u[i - 1] + v[i + n] - v[i - n]);
      }
    }
    for (let j = 0; j < 24; j++) {
      for (let y = 1; y < n - 1; y++) {
        for (let x = 1; x < n - 1; x++) {
          const i = y * n + x;
          this.q[i] = (div[i] + p[i - 1] + p[i + 1] + p[i - n] + p[i + n]) * 0.25;
        }
      }
      p.set(this.q);
    }
    for (let y = 1; y < n - 1; y++) {
      for (let x = 1; x < n - 1; x++) {
        const i = y * n + x;
        u[i] -= 0.5 * (p[i + 1] - p[i - 1]);
        v[i] -= 0.5 * (p[i + n] - p[i - n]);
      }
    }
    this.boundary();
  }

  boundary(): void {
    const n = this.n;
    for (let i = 0; i < n; i++) {
      this.u[i] = this.v[i] = this.u[(n - 1) * n + i] = this.v[(n - 1) * n + i] = 0;
      this.u[i * n] = this.v[i * n] = this.u[i * n + n - 1] = this.v[i * n + n - 1] = 0;
    }
  }

  step(dt = 1 / 30): void {
    const n = this.n;
    this.u0.set(this.u);
    this.v0.set(this.v);
    for (let y = 1; y < n - 1; y++) {
      for (let x = 1; x < n - 1; x++) {
        const i = y * n + x;
        const bx = x - this.u0[i] * dt;
        const by = y - this.v0[i] * dt;
        this.u[i] = this.sample(this.u0, bx, by) * 0.995;
        this.v[i] = this.sample(this.v0, bx, by) * 0.995;
      }
    }
    this.u0.set(this.u);
    this.v0.set(this.v);
    const viscosity = 0.08 * Math.min(1, dt * 30);
    for (let y = 1; y < n - 1; y++) {
      for (let x = 1; x < n - 1; x++) {
        const i = y * n + x;
        this.u[i] += viscosity * (this.u0[i - 1] + this.u0[i + 1] + this.u0[i - n] + this.u0[i + n] - 4 * this.u0[i]);
        this.v[i] += viscosity * (this.v0[i - 1] + this.v0[i + 1] + this.v0[i - n] + this.v0[i + n] - 4 * this.v0[i]);
      }
    }
    this.project();
    this.d0.set(this.d);
    for (let y = 1; y < n - 1; y++) {
      for (let x = 1; x < n - 1; x++) {
        const i = y * n + x;
        this.d[i] = this.sample(this.d0, x - this.u[i] * dt, y - this.v[i] * dt) * 0.994;
      }
    }
  }

  reset(): void {
    for (const k of ['u', 'v', 'd', 'u0', 'v0', 'd0', 'p', 'q', 'div'] as const) {
      this[k].fill(0);
    }
  }

  divergence(): number {
    const n = this.n;
    let sum = 0;
    let count = 0;
    for (let y = 2; y < n - 2; y++) {
      for (let x = 2; x < n - 2; x++) {
        const i = y * n + x;
        sum += Math.abs(this.u[i + 1] - this.u[i - 1] + this.v[i + n] - this.v[i - n]);
        count++;
      }
    }
    return sum / count;
  }
}
