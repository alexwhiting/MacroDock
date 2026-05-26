const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const port = Number(process.env.PORT || 8787);
const rootDir = __dirname;

function loadEnvFile() {
  const envPath = path.join(rootDir, ".env");

  try {
    const contents = fs.readFileSync(envPath, "utf8");
    contents.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
        return;
      }
      const [key, ...valueParts] = trimmed.split("=");
      if (!process.env[key]) {
        process.env[key] = valueParts.join("=").replace(/^["']|["']$/g, "");
      }
    });
  } catch {
    // .env is optional; Render and other hosts provide environment variables directly.
  }
}

loadEnvFile();

const cacheDir = path.join(rootDir, "data");
const cacheFile = path.join(cacheDir, "food-cache.json");
const usersFile = path.join(cacheDir, "users.json");
const supabaseUrl = process.env.SUPABASE_URL || "https://ulmwocfyvocswblavfdj.supabase.co";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "sb_publishable_BejLt2fZxPutp8uo5M5PLw_kjLpzhFY";
const fdcApiKey = process.env.FDC_API_KEY || "DEMO_KEY";
const hasUsdaApiKey = fdcApiKey && fdcApiKey !== "DEMO_KEY";

const commonFoods = [
  { name: "Apple", servingLabel: "1 medium apple", calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, sodium: 2, calcium: 11, iron: 0.2, vitaminC: 8, potassium: 195, source: "MacroDock" },
  { name: "Banana", servingLabel: "1 medium banana", calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, sodium: 1, calcium: 6, iron: 0.3, vitaminC: 10, potassium: 422, source: "MacroDock" },
  { name: "Large egg", servingLabel: "1 large egg", calories: 72, protein: 6.3, carbs: 0.4, fat: 4.8, fiber: 0, sodium: 71, calcium: 28, iron: 0.9, vitaminC: 0, potassium: 69, source: "MacroDock" },
  { name: "Bacon, cooked", servingLabel: "1 slice", calories: 43, protein: 3, carbs: 0.1, fat: 3.3, fiber: 0, sodium: 137, calcium: 1, iron: 0.1, vitaminC: 0, potassium: 45, source: "MacroDock" },
  { name: "Oatmeal, cooked", servingLabel: "1 cup cooked", calories: 154, protein: 6, carbs: 27, fat: 3, fiber: 4, sodium: 9, calcium: 21, iron: 1.7, vitaminC: 0, potassium: 164, source: "MacroDock" },
  { name: "Whole wheat toast", servingLabel: "1 slice", calories: 81, protein: 4, carbs: 14, fat: 1.1, fiber: 2, sodium: 144, calcium: 38, iron: 1, vitaminC: 0, potassium: 69, source: "MacroDock" },
  { name: "Milk, 2%", servingLabel: "1 cup", calories: 122, protein: 8, carbs: 12, fat: 5, fiber: 0, sodium: 115, calcium: 309, iron: 0, vitaminC: 0, potassium: 390, source: "MacroDock" },
  { name: "Chicken breast, cooked", servingLabel: "100g", calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sodium: 74, calcium: 15, iron: 1, vitaminC: 0, potassium: 256, source: "MacroDock" },
  { name: "White rice, cooked", servingLabel: "1 cup cooked", calories: 205, protein: 4.3, carbs: 45, fat: 0.4, fiber: 0.6, sodium: 2, calcium: 16, iron: 1.9, vitaminC: 0, potassium: 55, source: "MacroDock" },
  { name: "Peanut butter", servingLabel: "2 tbsp", calories: 190, protein: 7, carbs: 7, fat: 16, fiber: 2, sodium: 140, calcium: 17, iron: 0.6, vitaminC: 0, potassium: 189, source: "MacroDock" },
  { name: "Quest Protein Bar, Chocolate Chip Cookie Dough", servingLabel: "1 bar", calories: 190, protein: 21, carbs: 21, fat: 8, fiber: 14, sodium: 340, calcium: 150, iron: 1.1, vitaminC: 0, potassium: 120, source: "MacroDock" },
  { name: "Clif Bar, Chocolate Chip", servingLabel: "1 bar", calories: 250, protein: 10, carbs: 43, fat: 5, fiber: 4, sodium: 180, calcium: 45, iron: 2, vitaminC: 0, potassium: 240, source: "MacroDock" },
  { name: "RXBAR, Chocolate Sea Salt", servingLabel: "1 bar", calories: 210, protein: 12, carbs: 24, fat: 9, fiber: 5, sodium: 260, calcium: 50, iron: 2, vitaminC: 0, potassium: 300, source: "MacroDock" },
  { name: "Greek yogurt bowl", servingLabel: "1 bowl", calories: 310, protein: 28, carbs: 36, fat: 6, fiber: 5, sodium: 120, calcium: 260, iron: 1.2, vitaminC: 18, potassium: 420, source: "MacroDock" },
  { name: "Chicken rice bowl", servingLabel: "1 bowl", calories: 560, protein: 45, carbs: 62, fat: 15, fiber: 7, sodium: 880, calcium: 80, iron: 2.4, vitaminC: 28, potassium: 760, source: "MacroDock" },
  { name: "Salmon plate", servingLabel: "1 plate", calories: 640, protein: 48, carbs: 42, fat: 30, fiber: 8, sodium: 520, calcium: 110, iron: 2.1, vitaminC: 42, potassium: 920, source: "MacroDock" },
  { name: "Protein smoothie", servingLabel: "1 smoothie", calories: 380, protein: 34, carbs: 48, fat: 8, fiber: 9, sodium: 220, calcium: 360, iron: 1.8, vitaminC: 55, potassium: 710, source: "MacroDock" },
  { name: "Turkey avocado wrap", servingLabel: "1 wrap", calories: 470, protein: 33, carbs: 44, fat: 19, fiber: 8, sodium: 950, calcium: 180, iron: 3, vitaminC: 14, potassium: 690, source: "MacroDock" },
  { name: "Apple and almonds", servingLabel: "1 snack pack", calories: 240, protein: 7, carbs: 28, fat: 14, fiber: 8, sodium: 2, calcium: 90, iron: 1.1, vitaminC: 8, potassium: 310, source: "MacroDock" },
  { name: "Tuna, canned in water", servingLabel: "100g", calories: 116, protein: 25.5, carbs: 0, fat: 0.8, fiber: 0, sodium: 338, calcium: 11, iron: 1, vitaminC: 0, potassium: 237, source: "MacroDock" },
  { name: "Kiwi", servingLabel: "1 medium kiwi", calories: 42, protein: 0.8, carbs: 10, fat: 0.4, fiber: 2.1, sodium: 2, calcium: 23, iron: 0.2, vitaminC: 64, potassium: 215, source: "MacroDock" }
];

const foodNutrientKeys = ["calories", "protein", "carbs", "fat", "fiber", "sodium", "calcium", "iron", "vitaminC", "potassium"];

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

  if (typeof account.name === "string" && account.name.trim()) {
    user.name = account.name.trim();
  }

  user.account = {
    ...account,
    name: account.name || user.name,
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

function numberValue(value) {
  return Number.isFinite(Number(value)) ? Number(value) : 0;
}

function nutrientValue(nutriments, key, unit = "g") {
  const serving = numberValue(nutriments[`${key}_serving`]);
  const per100g = numberValue(nutriments[`${key}_100g`]);
  const value = serving || per100g || 0;
  return unit === "mg" ? value * 1000 : value;
}

function normalizeFood(food, source = "MacroDock") {
  const normalized = {
    ...food,
    name: String(food.name || "").trim(),
    servingLabel: food.servingLabel || food.servingSizeLabel || food.serving || "1 serving",
    source: food.source || source
  };

  foodNutrientKeys.forEach((key) => {
    normalized[key] = numberValue(food[key]);
  });

  return normalized;
}

function foodFromOpenFoodFactsProduct(product) {
  const name = String(product.product_name || product.product_name_en || product.generic_name || "").trim();
  const nutriments = product.nutriments || {};

  if (!name) {
    return null;
  }

  const food = normalizeFood({
    name,
    servingLabel: product.serving_size || "100g",
    calories: numberValue(nutriments["energy-kcal_serving"]) || numberValue(nutriments["energy-kcal_100g"]),
    protein: nutrientValue(nutriments, "proteins"),
    carbs: nutrientValue(nutriments, "carbohydrates"),
    fat: nutrientValue(nutriments, "fat"),
    fiber: nutrientValue(nutriments, "fiber"),
    sodium: nutrientValue(nutriments, "sodium", "mg"),
    calcium: nutrientValue(nutriments, "calcium", "mg"),
    iron: nutrientValue(nutriments, "iron", "mg"),
    vitaminC: nutrientValue(nutriments, "vitamin-c", "mg"),
    potassium: nutrientValue(nutriments, "potassium", "mg"),
    source: product.brands ? `${product.brands} · Open Food Facts` : "Open Food Facts"
  }, "Open Food Facts");

  return food.calories ? food : null;
}

async function lookupOpenFoodFactsBarcode(barcode) {
  const params = new URLSearchParams({
    fields: "code,product_name,product_name_en,generic_name,brands,serving_size,nutriments,nutrition_data_per"
  });
  const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json?${params.toString()}`, {
    headers: {
      "User-Agent": "MacroDock/0.1 (contact: macrodock.onrender.com)"
    }
  });

  if (!response.ok) {
    throw new Error(`Open Food Facts barcode lookup failed (${response.status})`);
  }

  const data = await response.json();

  if (!data.product || data.status === 0) {
    return null;
  }

  return foodFromOpenFoodFactsProduct(data.product);
}

function foodSearchScore(query, food) {
  const search = query.toLowerCase();
  const name = food.name.toLowerCase();
  const source = String(food.source || "").toLowerCase();
  let score = 0;

  if (name === search) {
    score += 100;
  } else if (name.startsWith(search)) {
    score += 70;
  } else if (name.includes(search)) {
    score += 45;
  }

  search.split(/\s+/).filter(Boolean).forEach((word) => {
    if (name.includes(word)) {
      score += 8;
    }
    if (source.includes(word)) {
      score += 4;
    }
  });

  if (food.source?.includes("Open Food Facts")) {
    score += 10;
  }
  if (food.servingLabel && food.servingLabel !== "1 serving") {
    score += 5;
  }

  return score;
}

function sortFoodsForQuery(query, foods) {
  return [...foods].sort((left, right) => foodSearchScore(query, right) - foodSearchScore(query, left));
}

function nutrientByNames(food, names, unitName = "") {
  const normalizedNames = names.map((name) => name.toLowerCase());
  const nutrients = food.foodNutrients || [];
  const unit = unitName.toLowerCase();
  const nutrient = nutrients.find((item) => {
    const name = String(item.nutrientName || "").toLowerCase();
    const itemUnit = String(item.unitName || "").toLowerCase();
    return (!unit || itemUnit === unit) && normalizedNames.some((candidate) => name === candidate || name.includes(candidate));
  }) || nutrients.find((item) => {
    const name = String(item.nutrientName || "").toLowerCase();
    return normalizedNames.some((candidate) => name === candidate || name.includes(candidate));
  });

  return numberValue(nutrient?.value);
}

function foodFromFdcFood(food) {
  const name = String(food.description || food.lowercaseDescription || "").trim();

  if (!name) {
    return null;
  }

  const servingSize = numberValue(food.servingSize);
  const servingUnit = String(food.servingSizeUnit || "g").toLowerCase();
  const canScaleServing = servingSize > 0 && ["g", "gram", "grams", "ml", "milliliter", "milliliters"].includes(servingUnit);
  const multiplier = canScaleServing ? servingSize / 100 : 1;
  const servingLabel = canScaleServing
    ? `${formatServingSize(servingSize)}${servingUnit === "ml" || servingUnit.includes("milliliter") ? "ml" : "g"}`
    : "100g";

  const foodName = food.brandName ? `${food.description} (${food.brandName})` : food.description;

  return normalizeFood({
    name: foodName,
    servingLabel,
    calories: nutrientByNames(food, ["energy"], "kcal") * multiplier,
    protein: nutrientByNames(food, ["protein"]) * multiplier,
    carbs: nutrientByNames(food, ["carbohydrate"]) * multiplier,
    fat: nutrientByNames(food, ["total lipid", "fat"]) * multiplier,
    fiber: nutrientByNames(food, ["fiber"]) * multiplier,
    sodium: nutrientByNames(food, ["sodium"]) * multiplier,
    calcium: nutrientByNames(food, ["calcium"]) * multiplier,
    iron: nutrientByNames(food, ["iron"]) * multiplier,
    vitaminC: nutrientByNames(food, ["vitamin c", "ascorbic"]) * multiplier,
    potassium: nutrientByNames(food, ["potassium"]) * multiplier,
    source: food.brandName ? `${food.brandName} · USDA` : "USDA"
  }, "USDA");
}

function formatServingSize(value) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(1)));
}

function dedupeFoods(foods) {
  const seen = new Set();
  return foods.map((food) => normalizeFood(food)).filter((food) => {
    const key = `${food.name}|${food.servingLabel}|${food.source}`.toLowerCase();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function localMatches(query) {
  const normalizedQuery = query.toLowerCase();
  return commonFoods
    .filter((food) => food.name.toLowerCase().includes(normalizedQuery))
    .slice(0, 12);
}

function cacheMatches(query) {
  const normalizedQuery = query.toLowerCase();
  return readCache()
    .filter((food) => food.name.toLowerCase().includes(normalizedQuery))
    .slice(0, 12);
}

async function searchOpenFoodFacts(query) {
  const params = new URLSearchParams({
    search_terms: query,
    search_simple: "1",
    action: "process",
    json: "1",
    page_size: "24",
    sort_by: "unique_scans_n",
    fields: "code,product_name,product_name_en,generic_name,brands,serving_size,nutriments,nutrition_data_per"
  });

  const response = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?${params.toString()}`, {
    headers: {
      "User-Agent": "MacroDock/0.1 (contact: macrodock.onrender.com)"
    }
  });

  if (!response.ok) {
    throw new Error(`Open Food Facts search failed (${response.status})`);
  }

  const data = await response.json();
  return sortFoodsForQuery(query, (data.products || [])
    .map(foodFromOpenFoodFactsProduct)
    .filter((food) => food && food.calories > 0 && food.calories < 1500 && food.protein < 250 && food.carbs < 400 && food.fat < 250));
}

async function searchUsdaFoods(query) {
  const params = new URLSearchParams({
    api_key: fdcApiKey,
    query,
    pageSize: "12",
    requireAllWords: "true"
  });

  const response = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?${params.toString()}`);

  if (!response.ok) {
    throw new Error("USDA FoodData Central search failed");
  }

  const data = await response.json();
  return (data.foods || [])
    .map(foodFromFdcFood)
    .filter((food) => food && food.calories && food.calories < 1500 && food.protein < 250 && food.carbs < 400 && food.fat < 250);
}

async function handleFoodSearch(request, response, url) {
  const query = (url.searchParams.get("q") || "").trim();

  if (query.length < 2) {
    sendJson(response, 200, {
      source: "local",
      layers: { local: commonFoods.slice(0, 8), cached: [], api: [] },
      foods: commonFoods.slice(0, 8)
    });
    return;
  }

  const local = localMatches(query);
  const cached = cacheMatches(query);
  let api = [];
  let apiError = "";

  if (local.length + cached.length < 8) {
    try {
      api = await searchOpenFoodFacts(query);
      if (api.length) {
        writeCache(dedupeFoods([...api, ...readCache()]).slice(0, 500));
      }
    } catch (error) {
      apiError = error.message;
      console.warn("Open Food Facts search unavailable", error.message);
    }
  }

  if (hasUsdaApiKey && local.length + cached.length + api.length < 8) {
    try {
      const usda = await searchUsdaFoods(query);
      api = dedupeFoods([...api, ...usda]);
      if (usda.length) {
        writeCache(dedupeFoods([...api, ...readCache()]).slice(0, 500));
      }
    } catch (error) {
      apiError = apiError ? `${apiError}; ${error.message}` : error.message;
      console.warn("USDA food search unavailable", error.message);
    }
  }

  const layers = {
    local,
    cached,
    api
  };

  sendJson(response, 200, {
    source: api.length ? "open-food-facts" : cached.length ? "cache" : "local",
    layers,
    apiError,
    foods: sortFoodsForQuery(query, dedupeFoods([...local, ...cached, ...api])).slice(0, 24)
  });
}

async function handleFoodBarcode(request, response, url) {
  const barcode = (url.searchParams.get("code") || "").replace(/\D/g, "");

  if (barcode.length < 8) {
    sendJson(response, 400, { error: "Enter a valid barcode number." });
    return;
  }

  const cached = readCache().find((food) => String(food.barcode || "") === barcode);

  if (cached) {
    sendJson(response, 200, {
      source: "cache",
      food: cached
    });
    return;
  }

  const food = await lookupOpenFoodFactsBarcode(barcode);

  if (!food) {
    sendJson(response, 404, { error: "No food found for that barcode." });
    return;
  }

  const cachedFood = {
    ...food,
    barcode,
    source: food.source || "Open Food Facts"
  };

  writeCache(dedupeFoods([cachedFood, ...readCache()]).slice(0, 500));

  sendJson(response, 200, {
    source: "open-food-facts",
    food: cachedFood
  });
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

  if (url.pathname === "/api/config") {
    sendJson(response, 200, {
      supabaseUrl,
      supabaseAnonKey
    });
    return;
  }

  if (url.pathname === "/api/foods/search") {
    handleFoodSearch(request, response, url).catch((error) => {
      sendJson(response, 500, { error: error.message || "Food search failed." });
    });
    return;
  }

  if (url.pathname === "/api/foods/barcode") {
    handleFoodBarcode(request, response, url).catch((error) => {
      sendJson(response, 500, { error: error.message || "Barcode lookup failed." });
    });
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
