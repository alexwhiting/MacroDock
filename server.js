const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const port = Number(process.env.PORT || 8787);
const rootDir = __dirname;
const cacheDir = path.join(rootDir, "data");
const cacheFile = path.join(cacheDir, "food-cache.json");
const usersFile = path.join(cacheDir, "users.json");
const fdcSearchUrl = "https://api.nal.usda.gov/fdc/v1/foods/search";
const fdcApiKey = process.env.USDA_API_KEY || "DEMO_KEY";

const commonFoods = [
  { name: "Apple", calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, calcium: 11, iron: 0.2, vitaminC: 8, potassium: 195, source: "MacroDock" },
  { name: "Banana", calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, calcium: 6, iron: 0.3, vitaminC: 10, potassium: 422, source: "MacroDock" },
  { name: "Large egg", calories: 72, protein: 6.3, carbs: 0.4, fat: 4.8, fiber: 0, calcium: 28, iron: 0.9, vitaminC: 0, potassium: 69, source: "MacroDock" },
  { name: "Bacon, cooked", calories: 43, protein: 3, carbs: 0.1, fat: 3.3, fiber: 0, calcium: 1, iron: 0.1, vitaminC: 0, potassium: 45, source: "MacroDock" },
  { name: "Oatmeal, cooked", calories: 154, protein: 6, carbs: 27, fat: 3, fiber: 4, calcium: 21, iron: 1.7, vitaminC: 0, potassium: 164, source: "MacroDock" },
  { name: "Whole wheat toast", calories: 81, protein: 4, carbs: 14, fat: 1.1, fiber: 2, calcium: 38, iron: 1, vitaminC: 0, potassium: 69, source: "MacroDock" },
  { name: "Milk, 2%", calories: 122, protein: 8, carbs: 12, fat: 5, fiber: 0, calcium: 309, iron: 0, vitaminC: 0, potassium: 390, source: "MacroDock" },
  { name: "Chicken breast, cooked", calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, calcium: 15, iron: 1, vitaminC: 0, potassium: 256, source: "MacroDock" },
  { name: "White rice, cooked", calories: 205, protein: 4.3, carbs: 45, fat: 0.4, fiber: 0.6, calcium: 16, iron: 1.9, vitaminC: 0, potassium: 55, source: "MacroDock" },
  { name: "Peanut butter", calories: 190, protein: 7, carbs: 7, fat: 16, fiber: 2, calcium: 17, iron: 0.6, vitaminC: 0, potassium: 189, source: "MacroDock" },
  { name: "Quest Protein Bar, Chocolate Chip Cookie Dough", calories: 190, protein: 21, carbs: 21, fat: 8, fiber: 14, calcium: 150, iron: 1.1, vitaminC: 0, potassium: 120, source: "MacroDock" },
  { name: "Clif Bar, Chocolate Chip", calories: 250, protein: 10, carbs: 43, fat: 5, fiber: 4, calcium: 45, iron: 2, vitaminC: 0, potassium: 240, source: "MacroDock" },
  { name: "RXBAR, Chocolate Sea Salt", calories: 210, protein: 12, carbs: 24, fat: 9, fiber: 5, calcium: 50, iron: 2, vitaminC: 0, potassium: 300, source: "MacroDock" },
  { name: "Greek yogurt bowl", calories: 310, protein: 28, carbs: 36, fat: 6, fiber: 5, calcium: 260, iron: 1.2, vitaminC: 18, potassium: 420, source: "MacroDock" },
  { name: "Chicken rice bowl", calories: 560, protein: 45, carbs: 62, fat: 15, fiber: 7, calcium: 80, iron: 2.4, vitaminC: 28, potassium: 760, source: "MacroDock" },
  { name: "Salmon plate", calories: 640, protein: 48, carbs: 42, fat: 30, fiber: 8, calcium: 110, iron: 2.1, vitaminC: 42, potassium: 920, source: "MacroDock" },
  { name: "Protein smoothie", calories: 380, protein: 34, carbs: 48, fat: 8, fiber: 9, calcium: 360, iron: 1.8, vitaminC: 55, potassium: 710, source: "MacroDock" },
  { name: "Turkey avocado wrap", calories: 470, protein: 33, carbs: 44, fat: 19, fiber: 8, calcium: 180, iron: 3, vitaminC: 14, potassium: 690, source: "MacroDock" },
  { name: "Apple and almonds", calories: 240, protein: 7, carbs: 28, fat: 14, fiber: 8, calcium: 90, iron: 1.1, vitaminC: 8, potassium: 310, source: "MacroDock" }
];

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json"
  });
  response.end(JSON.stringify(payload));
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;

      if (body.length > 1_000_000) {
        reject(new Error("Request body too large"));
      }
    });

    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });

    request.on("error", reject);
  });
}

function readUsers() {
  try {
    return JSON.parse(fs.readFileSync(usersFile, "utf8"));
  } catch {
    return [];
  }
}

function writeUsers(users) {
  fs.mkdirSync(cacheDir, { recursive: true });
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("hex");
  return { salt, hash };
}

function verifyPassword(password, user) {
  const { hash } = hashPassword(password, user.passwordSalt);
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(user.passwordHash, "hex"));
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    account: user.account || null
  };
}

function authUser(request) {
  const header = request.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!token) {
    return null;
  }

  return readUsers().find((user) => user.sessions?.includes(token)) || null;
}

async function handleRegister(request, response) {
  const body = await readJsonBody(request);
  const email = String(body.email || "").trim().toLowerCase();
  const name = String(body.name || "").trim();
  const password = String(body.password || "");

  if (!email || !email.includes("@") || password.length < 8) {
    sendJson(response, 400, { error: "Enter a valid email and a password with at least 8 characters." });
    return;
  }

  const users = readUsers();

  if (users.some((user) => user.email === email)) {
    sendJson(response, 409, { error: "An account with that email already exists." });
    return;
  }

  const passwordResult = hashPassword(password);
  const token = crypto.randomBytes(32).toString("hex");
  const user = {
    id: crypto.randomUUID(),
    name,
    email,
    passwordSalt: passwordResult.salt,
    passwordHash: passwordResult.hash,
    sessions: [token],
    account: null,
    createdAt: new Date().toISOString()
  };

  users.push(user);
  writeUsers(users);
  sendJson(response, 201, { token, user: publicUser(user) });
}

async function handleLogin(request, response) {
  const body = await readJsonBody(request);
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const users = readUsers();
  const user = users.find((candidate) => candidate.email === email);

  if (!user || !verifyPassword(password, user)) {
    sendJson(response, 401, { error: "Email or password is incorrect." });
    return;
  }

  const token = crypto.randomBytes(32).toString("hex");
  user.sessions = [...(user.sessions || []), token].slice(-5);
  writeUsers(users);
  sendJson(response, 200, { token, user: publicUser(user) });
}

function handleLogout(request, response) {
  const header = request.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const users = readUsers();
  const user = users.find((candidate) => candidate.sessions?.includes(token));

  if (user) {
    user.sessions = user.sessions.filter((session) => session !== token);
    writeUsers(users);
  }

  sendJson(response, 200, { ok: true });
}

async function handleAccountUpdate(request, response) {
  const authedUser = authUser(request);

  if (!authedUser) {
    sendJson(response, 401, { error: "Log in to save account metrics." });
    return;
  }

  const account = await readJsonBody(request);
  const users = readUsers();
  const user = users.find((candidate) => candidate.id === authedUser.id);

  user.account = {
    ...account,
    updatedAt: new Date().toISOString()
  };

  writeUsers(users);
  sendJson(response, 200, { user: publicUser(user), account: user.account });
}

function readCache() {
  try {
    return JSON.parse(fs.readFileSync(cacheFile, "utf8"));
  } catch {
    return [];
  }
}

function writeCache(foods) {
  fs.mkdirSync(cacheDir, { recursive: true });
  fs.writeFileSync(cacheFile, JSON.stringify(foods, null, 2));
}

function dedupeFoods(foods) {
  const seen = new Set();
  return foods.filter((food) => {
    const key = food.name.toLowerCase();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function localMatches(query) {
  const normalizedQuery = query.toLowerCase();
  return [...commonFoods, ...readCache()]
    .filter((food) => food.name.toLowerCase().includes(normalizedQuery))
    .slice(0, 12);
}

function nutrientValue(food, names) {
  const nutrients = food.foodNutrients || [];
  const match = nutrients.find((nutrient) => {
    const name = String(nutrient.nutrientName || nutrient.name || "").toLowerCase();
    return names.some((target) => name.includes(target));
  });

  return Number(match?.value ?? 0) || 0;
}

function normalizeFdcFood(food) {
  const brand = food.brandOwner || food.brandName || "";
  const description = food.description || food.lowercaseDescription || "USDA food";

  return {
    name: brand ? `${description} (${brand})` : description,
    calories: nutrientValue(food, ["energy"]),
    protein: nutrientValue(food, ["protein"]),
    carbs: nutrientValue(food, ["carbohydrate"]),
    fat: nutrientValue(food, ["total lipid", "total fat"]),
    fiber: nutrientValue(food, ["fiber"]),
    calcium: nutrientValue(food, ["calcium"]),
    iron: nutrientValue(food, ["iron"]),
    vitaminC: nutrientValue(food, ["vitamin c", "ascorbic"]),
    potassium: nutrientValue(food, ["potassium"]),
    source: food.dataType || "USDA"
  };
}

async function searchUsda(query) {
  const params = new URLSearchParams({
    api_key: fdcApiKey,
    query,
    pageSize: "10"
  });
  const response = await fetch(`${fdcSearchUrl}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`USDA search failed with ${response.status}`);
  }

  const data = await response.json();
  return (data.foods || [])
    .map(normalizeFdcFood)
    .filter((food) => food.calories || food.protein || food.carbs || food.fat);
}

async function handleFoodSearch(request, response, url) {
  const query = (url.searchParams.get("q") || "").trim();

  if (query.length < 2) {
    sendJson(response, 200, { source: "local", foods: commonFoods.slice(0, 8) });
    return;
  }

  const local = localMatches(query);

  try {
    const remote = await searchUsda(query);
    const cache = dedupeFoods([...readCache(), ...remote]).slice(0, 500);
    writeCache(cache);
    sendJson(response, 200, { source: "backend", foods: dedupeFoods([...remote, ...local]).slice(0, 12) });
  } catch {
    sendJson(response, 200, { source: "local", warning: "remote_unavailable", foods: local });
  }
}

function serveStatic(request, response, url) {
  const pathname = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  const filePath = path.normalize(path.join(rootDir, pathname));

  if (!filePath.startsWith(rootDir)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, contents) => {
    if (error) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    const ext = path.extname(filePath);
    const contentType = {
      ".html": "text/html",
      ".css": "text/css",
      ".js": "text/javascript",
      ".json": "application/json",
      ".svg": "image/svg+xml",
      ".webmanifest": "application/manifest+json",
      ".png": "image/png",
      ".ico": "image/x-icon"
    }[ext] || "application/octet-stream";

    response.writeHead(200, { "Content-Type": contentType });
    response.end(contents);
  });
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);

  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    });
    response.end();
    return;
  }

  if (url.pathname === "/api/health") {
    sendJson(response, 200, { ok: true, source: "MacroDock backend" });
    return;
  }

  if (url.pathname === "/api/foods/search") {
    handleFoodSearch(request, response, url);
    return;
  }

  if (url.pathname === "/api/auth/register" && request.method === "POST") {
    handleRegister(request, response).catch((error) => sendJson(response, 400, { error: error.message }));
    return;
  }

  if (url.pathname === "/api/auth/login" && request.method === "POST") {
    handleLogin(request, response).catch((error) => sendJson(response, 400, { error: error.message }));
    return;
  }

  if (url.pathname === "/api/auth/logout" && request.method === "POST") {
    handleLogout(request, response);
    return;
  }

  if (url.pathname === "/api/auth/me" && request.method === "GET") {
    const user = authUser(request);
    sendJson(response, user ? 200 : 401, user ? { user: publicUser(user) } : { error: "Not logged in." });
    return;
  }

  if (url.pathname === "/api/account" && request.method === "GET") {
    const user = authUser(request);
    sendJson(response, user ? 200 : 401, user ? { account: user.account || null, user: publicUser(user) } : { error: "Not logged in." });
    return;
  }

  if (url.pathname === "/api/account" && request.method === "PUT") {
    handleAccountUpdate(request, response).catch((error) => sendJson(response, 400, { error: error.message }));
    return;
  }

  serveStatic(request, response, url);
});

server.listen(port, "0.0.0.0", () => {
  console.log(`MacroDock running at http://localhost:${port}`);
});
