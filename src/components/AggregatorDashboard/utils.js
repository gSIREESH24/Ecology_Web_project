import { base } from "./data";

const toRad = (deg) => (deg * Math.PI) / 180;

export const distanceKm = ([a1, o1], [a2, o2]) => {
  const dA = toRad(a2 - a1);
  const dO = toRad(o2 - o1);
  const x =
    Math.sin(dA / 2) ** 2 +
    Math.cos(toRad(a1)) * Math.cos(toRad(a2)) * Math.sin(dO / 2) ** 2;
  return 6371 * (2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x)));
};

export const planRoute = (picked) => {
  const pool = [...picked];
  const ordered = [base];
  let current = base;

  while (pool.length) {
    let best = 0;
    let bestDistance = Infinity;

    pool.forEach((farm, index) => {
      const candidateDistance = distanceKm(current.coords, farm.coords);
      if (candidateDistance < bestDistance) {
        best = index;
        bestDistance = candidateDistance;
      }
    });

    current = pool.splice(best, 1)[0];
    ordered.push(current);
  }

  ordered.push({ ...base, name: "Return: Your Base" });

  const total = ordered.reduce((sum, point, index) => {
    if (index === ordered.length - 1) return sum;
    return sum + distanceKm(point.coords, ordered[index + 1].coords);
  }, 0);

  return {
    points: ordered,
    total,
    minutes: Math.round(total * 1.3),
    fuel: Math.round(total * 11.5),
  };
};
