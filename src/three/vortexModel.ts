export type Vec3 = [number, number, number];

// Burgers vortex: a steady incompressible Navier–Stokes vortex with axial strain.
// Coordinates use y as the axial direction. Illustrative parameters, not a CFD prediction.
export function velocity([x, y, z]: Vec3, strain = 0.8, circulation = 8, core = 0.38): Vec3 {
  const r2 = x * x + z * z;
  const omega =
    r2 < 1e-9
      ? circulation / (2 * Math.PI * core * core)
      : (circulation / (2 * Math.PI * r2)) * (1 - Math.exp(-r2 / (core * core)));
  return [-((strain * x) / 2) - omega * z, strain * y, (-strain * z) / 2 + omega * x];
}

export function streamline(start: Vec3, steps = 250, dt = 0.022): Vec3[] {
  let p: Vec3 = [...start] as Vec3;
  const points: Vec3[] = [p];
  for (let i = 0; i < steps; i++) {
    const k1 = velocity(p);
    const k2 = velocity(p.map((v, j) => v + (k1[j] * dt) / 2) as Vec3);
    const k3 = velocity(p.map((v, j) => v + (k2[j] * dt) / 2) as Vec3);
    const k4 = velocity(p.map((v, j) => v + k3[j] * dt) as Vec3);
    p = p.map((v, j) => v + ((dt * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j])) / 6)) as Vec3;
    if (Math.abs(p[1]) > 2.5) break;
    points.push(p);
  }
  return points;
}
