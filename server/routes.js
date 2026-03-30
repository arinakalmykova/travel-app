import fs from "fs";

const FILE_PATH = "./data/routes.json";

export function getRoutes() {
  if (!fs.existsSync(FILE_PATH)) return [];

  const data = fs.readFileSync(FILE_PATH, "utf-8");
  if (!data) return [];

  try {
    return JSON.parse(data);
  } catch (err) {
    console.error("Ошибка парсинга routes.json:", err);
    return [];
  }
}

export function addRoute(route) {
  let routes = getRoutes();
  const newRoute = { id: Date.now(), ...route };
  routes.push(newRoute);
  fs.writeFileSync(FILE_PATH, JSON.stringify(routes, null, 2));
  return newRoute;
}

export function updateRoute(routeId, data) {
  const routes = getRoutes();
  const index = routes.findIndex(r => r.id === Number(routeId));
  if (index === -1) return null;

  routes[index] = { ...routes[index], ...data };
  fs.writeFileSync(FILE_PATH, JSON.stringify(routes, null, 2));
  return routes[index];
}

export function deleteRoute(index) {
  let routes = getRoutes();
  routes = routes.filter((i) => i.id != index);
  fs.writeFileSync(FILE_PATH, JSON.stringify(routes, null, 2));
  return true;
}

export function addPoint(routeId, point) {
  const routes = getRoutes();
  const route = routes.find((r) => r.id === routeId);
  if (!route) return null;

  if (!route.points) route.points = [];

  const newPoint = {
    id: Date.now(),
    ...point,
  };

  route.points.push(newPoint);

  fs.writeFileSync(FILE_PATH, JSON.stringify(routes, null, 2));

  return newPoint;
}


export function deletePoint(routeId, pointId) {
  const routes = getRoutes();
  const route = routes.find(r => r.id === Number(routeId));
  if (!route || !route.points) return false;

  route.points = route.points.filter(p => p.id !== Number(pointId));
  fs.writeFileSync(FILE_PATH, JSON.stringify(routes, null, 2));
  return true;
}

export function updatePoint(routeId, pointId, data) {
  const routes = getRoutes();
  const route = routes.find(r => r.id === Number(routeId));
  if (!route || !route.points) return null;

  const index = route.points.findIndex(p => p.id === Number(pointId));
  if (index === -1) return null;

  route.points[index] = { ...route.points[index], ...data };
  fs.writeFileSync(FILE_PATH, JSON.stringify(routes, null, 2));
  return route.points[index];
}
