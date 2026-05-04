const defaultCalorieGoal = 2150;
const macroGoals = {
  protein: 160,
  carbs: 245,
  fat: 72
};
const microGoals = {
  fiber: 30,
  calcium: 1000,
  iron: 18,
  vitaminC: 90,
  potassium: 3400
};

const foods = [
  {
    name: "Greek yogurt bowl",
    calories: 310,
    protein: 28,
    carbs: 36,
    fat: 6,
    fiber: 5,
    calcium: 260,
    iron: 1.2,
    vitaminC: 18,
    potassium: 420
  },
  {
    name: "Chicken rice bowl",
    calories: 560,
    protein: 45,
    carbs: 62,
    fat: 15,
    fiber: 7,
    calcium: 80,
    iron: 2.4,
    vitaminC: 28,
    potassium: 760
  },
  {
    name: "Salmon plate",
    calories: 640,
    protein: 48,
    carbs: 42,
    fat: 30,
    fiber: 8,
    calcium: 110,
    iron: 2.1,
    vitaminC: 42,
    potassium: 920
  },
  {
    name: "Protein smoothie",
    calories: 380,
    protein: 34,
    carbs: 48,
    fat: 8,
    fiber: 9,
    calcium: 360,
    iron: 1.8,
    vitaminC: 55,
    potassium: 710
  },
  {
    name: "Turkey avocado wrap",
    calories: 470,
    protein: 33,
    carbs: 44,
    fat: 19,
    fiber: 8,
    calcium: 180,
    iron: 3,
    vitaminC: 14,
    potassium: 690
  },
  {
    name: "Apple",
    calories: 95,
    protein: 0.5,
    carbs: 25,
    fat: 0.3,
    fiber: 4.4,
    calcium: 11,
    iron: 0.2,
    vitaminC: 8,
    potassium: 195
  },
  {
    name: "Banana",
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.4,
    fiber: 3.1,
    calcium: 6,
    iron: 0.3,
    vitaminC: 10,
    potassium: 422
  },
  {
    name: "Large egg",
    calories: 72,
    protein: 6.3,
    carbs: 0.4,
    fat: 4.8,
    fiber: 0,
    calcium: 28,
    iron: 0.9,
    vitaminC: 0,
    potassium: 69
  },
  {
    name: "Bacon, cooked",
    calories: 43,
    protein: 3,
    carbs: 0.1,
    fat: 3.3,
    fiber: 0,
    calcium: 1,
    iron: 0.1,
    vitaminC: 0,
    potassium: 45
  },
  {
    name: "Oatmeal, cooked",
    calories: 154,
    protein: 6,
    carbs: 27,
    fat: 3,
    fiber: 4,
    calcium: 21,
    iron: 1.7,
    vitaminC: 0,
    potassium: 164
  },
  {
    name: "Whole wheat toast",
    calories: 81,
    protein: 4,
    carbs: 14,
    fat: 1.1,
    fiber: 2,
    calcium: 38,
    iron: 1,
    vitaminC: 0,
    potassium: 69
  },
  {
    name: "Milk, 2%",
    calories: 122,
    protein: 8,
    carbs: 12,
    fat: 5,
    fiber: 0,
    calcium: 309,
    iron: 0,
    vitaminC: 0,
    potassium: 390
  },
  {
    name: "Chicken breast, cooked",
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    calcium: 15,
    iron: 1,
    vitaminC: 0,
    potassium: 256
  },
  {
    name: "White rice, cooked",
    calories: 205,
    protein: 4.3,
    carbs: 45,
    fat: 0.4,
    fiber: 0.6,
    calcium: 16,
    iron: 1.9,
    vitaminC: 0,
    potassium: 55
  },
  {
    name: "Peanut butter",
    calories: 190,
    protein: 7,
    carbs: 7,
    fat: 16,
    fiber: 2,
    calcium: 17,
    iron: 0.6,
    vitaminC: 0,
    potassium: 189
  },
  {
    name: "Quest Protein Bar, Chocolate Chip Cookie Dough",
    calories: 190,
    protein: 21,
    carbs: 21,
    fat: 8,
    fiber: 14,
    calcium: 150,
    iron: 1.1,
    vitaminC: 0,
    potassium: 120
  },
  {
    name: "Clif Bar, Chocolate Chip",
    calories: 250,
    protein: 10,
    carbs: 43,
    fat: 5,
    fiber: 4,
    calcium: 45,
    iron: 2,
    vitaminC: 0,
    potassium: 240
  },
  {
    name: "RXBAR, Chocolate Sea Salt",
    calories: 210,
    protein: 12,
    carbs: 24,
    fat: 9,
    fiber: 5,
    calcium: 50,
    iron: 2,
    vitaminC: 0,
    potassium: 300
  },
  {
    name: "Apple and almonds",
    calories: 240,
    protein: 7,
    carbs: 28,
    fat: 14,
    fiber: 8,
    calcium: 90,
    iron: 1.1,
    vitaminC: 8,
    potassium: 310
  }
];

const state = JSON.parse(localStorage.getItem("macrodock-state")) || {
  foods: [],
  workouts: [],
  water: 0,
  waterByDate: {},
  diaryDate: null
};

function diaryTodayIso() {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
}

function normalizeDiaryState() {
  const today = diaryTodayIso();
  if (!state.diaryDate || !state.lastToday || state.diaryDate === state.lastToday) {
    state.diaryDate = today;
  }
  state.lastToday = today;
  if (!state.waterByDate) {
    state.waterByDate = {};
  }
  if (typeof state.water === "number" && state.water > 0 && state.waterByDate[today] === undefined) {
    state.waterByDate[today] = state.water;
  }
  state.foods.forEach((f) => {
    if (!f.date) {
      f.date = today;
    }
  });
  state.workouts.forEach((w) => {
    if (!w.date) {
      w.date = today;
    }
  });
}

function itemMatchesDiary(item) {
  return (item.date || diaryTodayIso()) === state.diaryDate;
}

function workoutMatchesDiary(workout) {
  return (workout.date || diaryTodayIso()) === state.diaryDate;
}

function waterForDiary() {
  return state.waterByDate?.[state.diaryDate] || 0;
}

function setWaterForDiary(value) {
  state.waterByDate[state.diaryDate] = Math.max(Math.min(value, 20), 0);
  state.water = waterForDiary();
}

function parseIsoToLocalDate(iso) {
  const [y, m, day] = iso.split("-").map(Number);
  return new Date(y, m - 1, day);
}

function formatDiaryButtonLabel() {
  const d = parseIsoToLocalDate(state.diaryDate);
  const fmt = { month: "long", day: "numeric", year: "numeric" };
  if (state.diaryDate === diaryTodayIso()) {
    return `Today (${d.toLocaleDateString("en-US", fmt)})`;
  }
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}

function isValidDiaryDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = parseIsoToLocalDate(value);
  return !Number.isNaN(date.getTime()) && value === `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function shiftIsoDate(iso, days) {
  const date = parseIsoToLocalDate(iso);
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function setDiaryDate(nextDate) {
  if (!isValidDiaryDate(nextDate)) {
    syncDiaryDateUi();
    return;
  }

  state.diaryDate = nextDate;
  state.water = waterForDiary();
  saveState();
  syncDiaryDateUi();
  render();
}

function syncDiaryDateUi() {
  if (elements.diaryDateInput) {
    elements.diaryDateInput.value = state.diaryDate;
  }
  if (elements.dashboardDateLabel) {
    elements.dashboardDateLabel.textContent = formatDiaryButtonLabel();
  }
}

normalizeDiaryState();

const MEAL_ORDER = ["Breakfast", "Lunch", "Dinner", "Snack"];

const MEAL_ICONS = {
  Breakfast: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8h1a4 4 0 0 1 0 8h-5"/><path d="M2 8h18v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
  Lunch: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M19.07 4.93l-1.41 1.41M6.34 17.66l-1.41 1.41"/></svg>`,
  Dinner: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
  Snack: `<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><circle cx="7" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="17" cy="12" r="2" fill="currentColor"/></svg>`
};

let selectedFood = foods[0];
let foodSearchTimer;
let latestFoodSearchToken = 0;
let isCustomFoodMode = false;

const elements = {
  foodSearch: document.querySelector("#foodSearch"),
  foodSearchStatus: document.querySelector("#foodSearchStatus"),
  foodResults: document.querySelector("#foodResults"),
  useCustomFood: document.querySelector("#useCustomFood"),
  customFoodFields: document.querySelector("#customFoodFields"),
  customFoodName: document.querySelector("#customFoodName"),
  customCalories: document.querySelector("#customCalories"),
  customProtein: document.querySelector("#customProtein"),
  customCarbs: document.querySelector("#customCarbs"),
  customFat: document.querySelector("#customFat"),
  customFiber: document.querySelector("#customFiber"),
  customCalcium: document.querySelector("#customCalcium"),
  customIron: document.querySelector("#customIron"),
  customVitaminC: document.querySelector("#customVitaminC"),
  customPotassium: document.querySelector("#customPotassium"),
  foodForm: document.querySelector("#foodForm"),
  servingSize: document.querySelector("#servingSize"),
  mealSelect: document.querySelector("#mealSelect"),
  workoutForm: document.querySelector("#workoutForm"),
  workoutType: document.querySelector("#workoutType"),
  workoutMinutes: document.querySelector("#workoutMinutes"),
  workoutEffort: document.querySelector("#workoutEffort"),
  mealSections: document.querySelector("#mealSections"),
  diaryDateInput: document.querySelector("#diaryDateInput"),
  dashboardDateButton: document.querySelector("#dashboardDateButton"),
  dashboardDateLabel: document.querySelector("#dashboardDateLabel"),
  prevDiaryDate: document.querySelector("#prevDiaryDate"),
  nextDiaryDate: document.querySelector("#nextDiaryDate"),
  todayDiaryDate: document.querySelector("#todayDiaryDate"),
  workoutLog: document.querySelector("#workoutLog"),
  macroBars: document.querySelector("#macroBars"),
  microBars: document.querySelector("#microBars"),
  remainingCalories: document.querySelector("#remainingCalories"),
  consumedCalories: document.querySelector("#consumedCalories"),
  burnedCalories: document.querySelector("#burnedCalories"),
  calorieRing: document.querySelector("#calorieRing"),
  caloriePercent: document.querySelector("#caloriePercent"),
  waterCount: document.querySelector("#waterCount"),
  addWater: document.querySelector("#addWater"),
  activeMinutes: document.querySelector("#activeMinutes"),
  activityBar: document.querySelector("#activityBar"),
  targetCalories: document.querySelector("#targetCalories"),
  profilePlanText: document.querySelector("#profilePlanText"),
  authForm: document.querySelector("#authForm"),
  authName: document.querySelector("#authName"),
  authEmail: document.querySelector("#authEmail"),
  authPassword: document.querySelector("#authPassword"),
  loginButton: document.querySelector("#loginButton"),
  registerButton: document.querySelector("#registerButton"),
  authPanel: document.querySelector("#authPanel"),
  authTitle: document.querySelector("#authTitle"),
  authNameField: document.querySelector("#authNameField"),
  accountForm: document.querySelector("#accountForm"),
  accountName: document.querySelector("#accountName"),
  accountSex: document.querySelector("#accountSex"),
  accountAge: document.querySelector("#accountAge"),
  accountHeight: document.querySelector("#accountHeight"),
  accountWeight: document.querySelector("#accountWeight"),
  accountActivity: document.querySelector("#accountActivity"),
  goalWeight: document.querySelector("#goalWeight"),
  goalDate: document.querySelector("#goalDate"),
  accountSummary: document.querySelector("#accountSummary"),
  closeFoodForm: document.querySelector("#closeFoodForm"),
  foodDialog: document.querySelector("#foodDialog"),
  themeToggle: document.querySelector("#themeToggle"),
  themeLabel: document.querySelector("#themeLabel"),
  foodApiBase: document.querySelector("#foodApiBase"),
  saveFoodApiBase: document.querySelector("#saveFoodApiBase"),
  foodApiStatus: document.querySelector("#foodApiStatus")
};

function getInitialTheme() {
  const savedTheme = localStorage.getItem("macrodock-theme");

  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  const isDark = theme === "dark";

  document.body.dataset.theme = theme;

  if (elements.themeToggle && elements.themeLabel) {
    elements.themeToggle.setAttribute("aria-pressed", String(isDark));
    elements.themeLabel.textContent = isDark ? "Light mode" : "Dark mode";
    elements.themeToggle.querySelector(".theme-icon").textContent = isDark ? "L" : "D";
  }

  localStorage.setItem("macrodock-theme", theme);
}

function saveState() {
  localStorage.setItem("macrodock-state", JSON.stringify(state));
}

function formatNumber(value) {
  return Math.round(value).toLocaleString();
}

function storedAccount() {
  try {
    return JSON.parse(localStorage.getItem("macrodock-account")) || null;
  } catch {
    return null;
  }
}

function calculateAccountTargets(account) {
  const weightKg = Math.max(Number(account.weightKg) || 0, 0);
  const heightCm = Math.max(Number(account.heightCm) || 0, 0);
  const age = Math.max(Number(account.age) || 0, 0);
  const activityFactor = Math.max(Number(account.activityFactor) || 1.2, 1.2);
  const targetWeightKg = Math.max(Number(account.targetWeightKg) || weightKg, 0);
  const sexConstant = account.sex === "female" ? -161 : 5;
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + sexConstant;
  const tdee = bmr * activityFactor;
  const today = new Date();
  const targetDate = account.targetDate ? new Date(`${account.targetDate}T00:00:00`) : null;
  const daysToGoal = targetDate ? Math.max(Math.ceil((targetDate - today) / 86400000), 1) : 0;
  const weightDeltaKg = targetWeightKg - weightKg;
  const dailyGoalAdjustment = daysToGoal > 0 ? (weightDeltaKg * 7700) / daysToGoal : 0;
  const calorieTarget = Math.max(Math.round(tdee + dailyGoalAdjustment), 1000);

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    calorieTarget,
    dailyGoalAdjustment: Math.round(dailyGoalAdjustment),
    daysToGoal,
    weightDeltaKg
  };
}

function getCalorieGoal() {
  const account = storedAccount();
  return account?.calorieTarget || defaultCalorieGoal;
}

function goalDescription(account) {
  if (!account) {
    return "Balanced maintenance plan";
  }

  if (account.weightDeltaKg < -0.1) {
    return "Weight loss plan";
  }

  if (account.weightDeltaKg > 0.1) {
    return "Weight gain plan";
  }

  return "Maintenance plan";
}

function renderTargetSummary() {
  const account = storedAccount();
  const calorieTarget = getCalorieGoal();

  if (elements.targetCalories) {
    elements.targetCalories.textContent = `${formatNumber(calorieTarget)} kcal`;
  }

  if (elements.profilePlanText) {
    elements.profilePlanText.textContent = goalDescription(account);
  }
}

function saveAccountFromForm(event) {
  event.preventDefault();

  const accountInput = {
    name: elements.accountName.value.trim(),
    sex: elements.accountSex.value,
    age: Number(elements.accountAge.value),
    heightCm: Number(elements.accountHeight.value),
    weightKg: Number(elements.accountWeight.value),
    activityFactor: Number(elements.accountActivity.value),
    targetWeightKg: Number(elements.goalWeight.value),
    targetDate: elements.goalDate.value
  };
  const targets = calculateAccountTargets(accountInput);
  const account = { ...accountInput, ...targets };

  localStorage.setItem("macrodock-account", JSON.stringify(account));
  renderAccountSettings();
  renderTargetSummary();

  if (getAuthToken()) {
    apiRequest("/api/account", {
      method: "PUT",
      body: JSON.stringify(account)
    })
      .then((data) => {
        if (data.account) {
          localStorage.setItem("macrodock-account", JSON.stringify(data.account));
        }
        renderAuthState(data.user);
      })
      .catch((error) => {
        if (elements.accountSummary) {
          elements.accountSummary.insertAdjacentHTML("beforeend", `<p>${escapeHtml(error.message)}</p>`);
        }
      });
  }
}

function renderAccountSettings() {
  if (!elements.accountForm) {
    return;
  }

  const account = storedAccount();

  if (account) {
    elements.accountName.value = account.name || "";
    elements.accountSex.value = account.sex || "male";
    elements.accountAge.value = account.age || 30;
    elements.accountHeight.value = account.heightCm || 175;
    elements.accountWeight.value = account.weightKg || 75;
    elements.accountActivity.value = String(account.activityFactor || 1.55);
    elements.goalWeight.value = account.targetWeightKg || account.weightKg || 75;
    elements.goalDate.value = account.targetDate || "";
    elements.accountSummary.innerHTML = `
      <div class="account-summary-grid">
        <div class="account-summary-item">
          <span>BMR</span>
          <strong>${formatNumber(account.bmr)} kcal</strong>
        </div>
        <div class="account-summary-item">
          <span>TDEE</span>
          <strong>${formatNumber(account.tdee)} kcal</strong>
        </div>
        <div class="account-summary-item">
          <span>Daily goal</span>
          <strong>${formatNumber(account.calorieTarget)} kcal</strong>
        </div>
      </div>
      <p>${goalDescription(account)}. Daily adjustment: ${account.dailyGoalAdjustment >= 0 ? "+" : ""}${formatNumber(account.dailyGoalAdjustment)} kcal.</p>
    `;
    return;
  }

  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 3);
  elements.goalDate.value = nextMonth.toISOString().slice(0, 10);
  elements.accountSummary.textContent = "Add your metrics to calculate your daily calorie target.";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function numberFromInput(input) {
  return Math.max(Number(input.value) || 0, 0);
}

function getAuthToken() {
  return localStorage.getItem("macrodock-auth-token") || "";
}

function setAuthToken(token) {
  if (token) {
    localStorage.setItem("macrodock-auth-token", token);
  } else {
    localStorage.removeItem("macrodock-auth-token");
  }
}

function currentPageFile() {
  return (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
}

function isAuthPage() {
  return currentPageFile() === "auth.html";
}

function isProtectedPage() {
  return ["", "index.html", "settings.html", "progress.html", "social.html"].includes(currentPageFile());
}

function redirectAfterAuth() {
  const target = sessionStorage.getItem("macrodock-post-auth") || "./index.html";
  sessionStorage.removeItem("macrodock-post-auth");
  window.location.href = target;
}

function redirectToAuth() {
  if (isAuthPage()) {
    return;
  }

  sessionStorage.setItem("macrodock-post-auth", `${window.location.pathname}${window.location.search}${window.location.hash}`);
  window.location.href = "./auth.html";
}

function setAuthMode(mode) {
  const isRegister = mode === "register";

  if (elements.authTitle) {
    elements.authTitle.textContent = isRegister ? "Create account" : "Log in";
  }

  if (elements.authNameField) {
    elements.authNameField.style.display = isRegister ? "grid" : "none";
  }

  if (elements.loginButton && elements.registerButton) {
    elements.loginButton.textContent = isRegister ? "Log in instead" : "Log in";
    elements.registerButton.textContent = isRegister ? "Create account" : "Create account instead";
    elements.loginButton.dataset.authMode = isRegister ? "switch-login" : "login";
    elements.registerButton.dataset.authMode = isRegister ? "register" : "switch-register";
  }
}

async function apiRequest(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };
  const token = getAuthToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${getFoodApiBase()}${path}`, {
    ...options,
    headers
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

async function loadRemoteAccount() {
  if (!getAuthToken()) {
    renderAuthState();
    return null;
  }

  try {
    const data = await apiRequest("/api/account");

    if (data.account) {
      localStorage.setItem("macrodock-account", JSON.stringify(data.account));
    }

    renderAuthState(data.user);
    renderAccountSettings();
    renderTargetSummary();

    if (elements.remainingCalories) {
      render();
    }

    return data.account || null;
  } catch {
    setAuthToken("");
    renderAuthState();
    return null;
  }
}

function renderAuthState(user) {
  if (!elements.authPanel) {
    return;
  }

  if (user || getAuthToken()) {
    const displayName = user?.name || user?.email || "Logged in";
    if (isAuthPage()) {
      elements.authPanel.textContent = `Welcome back, ${displayName}. Opening your dashboard...`;
      return;
    }

    elements.authPanel.innerHTML = `
      <div>
        <strong>${escapeHtml(displayName)}</strong>
        <span>Your account metrics save to the backend database.</span>
      </div>
      <button id="logoutButton" class="ghost-button" type="button">Log out</button>
    `;
    document.querySelector("#logoutButton").addEventListener("click", logout);
    return;
  }

  elements.authPanel.textContent = "Log in or create an account to save your metrics to the backend database.";
}

async function authenticate(mode) {
  if (mode === "switch-login" || mode === "switch-register") {
    setAuthMode(mode === "switch-login" ? "login" : "register");
    return;
  }

  const payload = {
    name: elements.authName.value.trim(),
    email: elements.authEmail.value.trim(),
    password: elements.authPassword.value
  };
  const endpoint = mode === "register" ? "/api/auth/register" : "/api/auth/login";

  try {
    const data = await apiRequest(endpoint, {
      method: "POST",
      body: JSON.stringify(payload)
    });

    setAuthToken(data.token);
    elements.authPassword.value = "";
    renderAuthState(data.user);

    if (data.user?.account) {
      localStorage.setItem("macrodock-account", JSON.stringify(data.user.account));
      renderAccountSettings();
      renderTargetSummary();
    }

    if (isAuthPage()) {
      redirectAfterAuth();
    }
  } catch (error) {
    elements.authPanel.textContent = error.message;
  }
}

async function logout() {
  try {
    await apiRequest("/api/auth/logout", { method: "POST", body: "{}" });
  } catch {
    // Local logout should still clear the token if the server is unavailable.
  }

  setAuthToken("");
  renderAuthState();
  redirectToAuth();
}

function defaultFoodApiBase() {
  return window.location.protocol === "file:" ? "http://localhost:8787" : window.location.origin;
}

function getFoodApiBase() {
  return (localStorage.getItem("macrodock-food-api-base") || defaultFoodApiBase()).replace(/\/$/, "");
}

function saveFoodApiBase() {
  const apiBase = elements.foodApiBase.value.trim().replace(/\/$/, "");

  if (apiBase) {
    localStorage.setItem("macrodock-food-api-base", apiBase);
    elements.foodApiStatus.textContent = "Food API URL saved on this device.";
  } else {
    localStorage.removeItem("macrodock-food-api-base");
    elements.foodApiStatus.textContent = "Using the current app server when available.";
  }
}

function renderFoodApiSettings() {
  if (!elements.foodApiBase) {
    return;
  }

  const savedApiBase = localStorage.getItem("macrodock-food-api-base") || "";
  elements.foodApiBase.value = savedApiBase;
  elements.foodApiStatus.textContent = savedApiBase ? "Food API URL saved on this device." : "Using the current app server when available.";
}

function localFoodMatches(query) {
  return foods
    .filter((food) => food.name.toLowerCase().includes(query.toLowerCase()))
    .map((food) => ({ ...food, source: "Starter", serving: "Starter item" }))
    .slice(0, 5);
}

async function searchBackendFoods(query) {
  const params = new URLSearchParams({ q: query });
  const response = await fetch(`${getFoodApiBase()}/api/foods/search?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Food backend request failed");
  }

  const data = await response.json();
  return {
    foods: data.foods || [],
    source: data.source || "backend"
  };
}

function totalsFromFood() {
  return state.foods.filter(itemMatchesDiary).reduce(
    (totals, item) => {
      Object.keys(totals).forEach((key) => {
        totals[key] += item[key] || 0;
      });
      return totals;
    },
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      calcium: 0,
      iron: 0,
      vitaminC: 0,
      potassium: 0
    }
  );
}

function totalsFromWorkouts() {
  return state.workouts.filter(workoutMatchesDiary).reduce(
    (totals, workout) => {
      totals.minutes += workout.minutes;
      totals.calories += workout.calories;
      return totals;
    },
    { minutes: 0, calories: 0 }
  );
}

function renderFoodResults(results) {
  if (!elements.foodResults) {
    return;
  }

  if (results.length === 0) {
    elements.foodResults.innerHTML = '<div class="empty-state">No foods found. Add a custom food instead.</div>';
    return;
  }

  elements.foodResults.innerHTML = results
    .map((food, index) => {
      const selectedClass = !isCustomFoodMode && selectedFood?.name === food.name ? " is-selected" : "";
      return `
        <button class="food-result-button${selectedClass}" type="button" data-food-result="${index}">
          <div>
            <strong>${escapeHtml(food.name)}</strong>
            <span>${formatNumber(food.calories)} kcal - ${formatNumber(food.protein)}g protein - ${formatNumber(food.carbs)}g carbs - ${formatNumber(food.fat)}g fat</span>
          </div>
          <span class="food-source">${escapeHtml(food.source || "Food")}</span>
        </button>
      `;
    })
    .join("");

  elements.foodResults.dataset.results = JSON.stringify(results);
}

function renderFoodSearch() {
  if (!elements.foodResults) {
    return;
  }

  const query = elements.foodSearch.value.trim();

  if (query.length < 2) {
    const starterFoods = localFoodMatches("");
    selectedFood = starterFoods[0] || foods[0];
    elements.foodSearchStatus.textContent = "Type at least 2 characters to search your food database.";
    renderFoodResults(starterFoods);
    return;
  }

  const searchToken = ++latestFoodSearchToken;
  const localResults = localFoodMatches(query);

  selectedFood = localResults[0] || selectedFood;
  elements.foodSearchStatus.textContent = "Searching your food database...";
  renderFoodResults(localResults);

  searchBackendFoods(query)
    .then((backendResult) => {
      if (searchToken !== latestFoodSearchToken) {
        return;
      }

      const backendResults = backendResult.foods || [];
      const combinedResults = [...backendResults, ...localResults]
        .filter((food, index, allFoods) => allFoods.findIndex((item) => item.name === food.name) === index)
        .slice(0, 8);
      selectedFood = combinedResults[0] || selectedFood;
      elements.foodSearchStatus.textContent = backendResults.length > 0
        ? "Showing matches from your food database."
        : "No database matches found. You can add a custom food.";
      renderFoodResults(combinedResults);
    })
    .catch(() => {
      if (searchToken !== latestFoodSearchToken) {
        return;
      }

      elements.foodSearchStatus.textContent = localResults.length > 0
        ? "Backend unavailable. Showing common foods saved on this device."
        : "Backend unavailable. Add a custom food or start the local server.";
      renderFoodResults(localResults);
    });
}

function renderMetricRows(container, metrics) {
  container.innerHTML = metrics
    .map((metric) => {
      const percent = Math.min((metric.value / metric.goal) * 100, 100);
      const percentLabel = Math.round((metric.value / metric.goal) * 100);
      return `
        <div class="metric-row">
          <div class="metric-line">
            <strong>${metric.label}</strong>
            <span>${metric.displayValue} / ${metric.displayGoal} (${percentLabel}%)</span>
          </div>
          <div class="bar-track">
            <span class="bar-fill" style="width: ${percent}%"></span>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderMealSections() {
  if (!elements.mealSections) {
    return;
  }

  elements.mealSections.innerHTML = MEAL_ORDER.map((mealName) => {
    const items = state.foods
      .map((f, globalIndex) => ({ ...f, globalIndex }))
      .filter((f) => itemMatchesDiary(f) && f.meal === mealName);

    const itemRows =
      items.length === 0
        ? '<div class="meal-placeholder" aria-hidden="true">···</div>'
        : items
            .map(
              (item) => `
          <div class="meal-food-row">
            <div>
              <strong>${escapeHtml(item.name)}</strong>
              <span>${item.servings} serving · ${formatNumber(item.calories)} kcal</span>
            </div>
            <button class="delete-button" type="button" data-food-index="${item.globalIndex}" aria-label="Remove ${escapeHtml(item.name)}">&times;</button>
          </div>`
            )
            .join("");

    const mealIcon = MEAL_ICONS[mealName] || "";
    return `
      <div class="meal-block" data-meal-block="${mealName}">
        <div class="meal-block-head">
          <div class="meal-name-wrap">
            <span class="meal-label-icon">${mealIcon}</span>
            <span class="meal-name">${mealName}</span>
          </div>
          <button type="button" class="meal-add-btn" data-meal-add="${mealName}" aria-label="Add food to ${mealName}">+</button>
        </div>
        <div class="meal-block-items">${itemRows}</div>
      </div>`;
  }).join("");
}

function renderLogs() {
  renderMealSections();

  if (!elements.workoutLog) {
    return;
  }

  const workoutsForDay = state.workouts.map((w, i) => ({ ...w, i })).filter((w) => workoutMatchesDiary(w));

  if (workoutsForDay.length === 0) {
    elements.workoutLog.className = "log-list empty-state";
    elements.workoutLog.textContent = "No workouts logged yet.";
  } else {
    elements.workoutLog.className = "log-list";
    elements.workoutLog.innerHTML = workoutsForDay
      .map(
        (item) => `
          <div class="log-item">
            <div>
              <strong>${escapeHtml(item.name)}</strong>
              <span>${item.minutes} min - ${formatNumber(item.calories)} kcal burned</span>
            </div>
            <button class="delete-button" type="button" data-workout-index="${item.i}" aria-label="Remove ${escapeHtml(item.name)}">&times;</button>
          </div>
        `
      )
      .join("");
  }
}

function renderDashboard() {
  const foodTotals = totalsFromFood();
  const workoutTotals = totalsFromWorkouts();
  const calorieGoal = getCalorieGoal();
  const netCalories = Math.max(foodTotals.calories - workoutTotals.calories, 0);
  const remaining = calorieGoal - netCalories;
  const calorieProgress = Math.min(netCalories / calorieGoal, 1);
  const circumference = 314;

  elements.remainingCalories.textContent = formatNumber(remaining);
  elements.consumedCalories.textContent = formatNumber(foodTotals.calories);
  elements.burnedCalories.textContent = formatNumber(workoutTotals.calories);
  elements.calorieRing.style.strokeDashoffset = circumference - calorieProgress * circumference;
  elements.caloriePercent.textContent = `${Math.round(calorieProgress * 100)}%`;
  elements.waterCount.textContent = waterForDiary();
  elements.activeMinutes.textContent = `${workoutTotals.minutes} min`;
  elements.activityBar.style.width = `${Math.min((workoutTotals.minutes / 45) * 100, 100)}%`;
  renderTargetSummary();

  renderMetricRows(elements.macroBars, [
    {
      label: "Protein",
      value: foodTotals.protein,
      goal: macroGoals.protein,
      displayValue: `${formatNumber(foodTotals.protein)}g`,
      displayGoal: `${macroGoals.protein}g`
    },
    {
      label: "Carbs",
      value: foodTotals.carbs,
      goal: macroGoals.carbs,
      displayValue: `${formatNumber(foodTotals.carbs)}g`,
      displayGoal: `${macroGoals.carbs}g`
    },
    {
      label: "Fat",
      value: foodTotals.fat,
      goal: macroGoals.fat,
      displayValue: `${formatNumber(foodTotals.fat)}g`,
      displayGoal: `${macroGoals.fat}g`
    }
  ]);

  syncDiaryDateUi();

  renderMetricRows(elements.microBars, [
    {
      label: "Fiber",
      value: foodTotals.fiber,
      goal: microGoals.fiber,
      displayValue: `${formatNumber(foodTotals.fiber)}g`,
      displayGoal: `${microGoals.fiber}g`
    },
    {
      label: "Calcium",
      value: foodTotals.calcium,
      goal: microGoals.calcium,
      displayValue: `${formatNumber(foodTotals.calcium)}mg`,
      displayGoal: `${microGoals.calcium}mg`
    },
    {
      label: "Iron",
      value: foodTotals.iron,
      goal: microGoals.iron,
      displayValue: `${foodTotals.iron.toFixed(1)}mg`,
      displayGoal: `${microGoals.iron}mg`
    },
    {
      label: "Vitamin C",
      value: foodTotals.vitaminC,
      goal: microGoals.vitaminC,
      displayValue: `${formatNumber(foodTotals.vitaminC)}mg`,
      displayGoal: `${microGoals.vitaminC}mg`
    },
    {
      label: "Potassium",
      value: foodTotals.potassium,
      goal: microGoals.potassium,
      displayValue: `${formatNumber(foodTotals.potassium)}mg`,
      displayGoal: `${microGoals.potassium}mg`
    }
  ]);
}

function render() {
  if (!elements.remainingCalories || !elements.mealSections || !elements.workoutLog) {
    return;
  }

  renderDashboard();
  renderLogs();
  saveState();
}

function setCustomFoodMode(isCustom) {
  isCustomFoodMode = isCustom;
  elements.customFoodFields.hidden = !isCustom;
  elements.useCustomFood.textContent = isCustom ? "Use starter foods" : "Add custom food";
  renderFoodSearch();

  if (isCustom) {
    elements.customFoodName.focus();
  } else {
    elements.foodSearch.focus();
  }
}

function setFoodDialogOpen(isOpen) {
  elements.foodDialog.setAttribute("aria-hidden", String(!isOpen));
  document.body.classList.toggle("dialog-open", isOpen);

  if (isOpen) {
    elements.foodSearch.value = "";
    latestFoodSearchToken++;
    setCustomFoodMode(false);
    elements.foodSearch.focus();
  } else if (elements.dashboardDateButton) {
    elements.dashboardDateButton.focus();
  }
}

function customFoodFromForm() {
  return {
    name: elements.customFoodName.value.trim() || "Custom food",
    calories: numberFromInput(elements.customCalories),
    protein: numberFromInput(elements.customProtein),
    carbs: numberFromInput(elements.customCarbs),
    fat: numberFromInput(elements.customFat),
    fiber: numberFromInput(elements.customFiber),
    calcium: numberFromInput(elements.customCalcium),
    iron: numberFromInput(elements.customIron),
    vitaminC: numberFromInput(elements.customVitaminC),
    potassium: numberFromInput(elements.customPotassium)
  };
}

if (elements.foodForm) {
  elements.foodForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const food = isCustomFoodMode ? customFoodFromForm() : selectedFood;
  const servings = Math.max(Number(elements.servingSize.value), 0.25);
  const loggedFood = { meal: elements.mealSelect.value, servings, date: state.diaryDate };

  Object.keys(food).forEach((key) => {
    loggedFood[key] = typeof food[key] === "number" ? food[key] * servings : food[key];
  });

  state.foods.unshift(loggedFood);
  elements.servingSize.value = "1";
  elements.customFoodName.value = "";
  elements.customCalories.value = "0";
  elements.customProtein.value = "0";
  elements.customCarbs.value = "0";
  elements.customFat.value = "0";
  elements.customFiber.value = "0";
  elements.customCalcium.value = "0";
  elements.customIron.value = "0";
  elements.customVitaminC.value = "0";
  elements.customPotassium.value = "0";
  render();
  setFoodDialogOpen(false);
});
}

if (elements.workoutForm) {
  elements.workoutForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const selected = elements.workoutType.selectedOptions[0];
  const minutes = Math.max(Number(elements.workoutMinutes.value), 5);
  const caloriesPerHalfHour = Number(selected.dataset.calories);
  const effort = Number(elements.workoutEffort.value);

  state.workouts.unshift({
    name: selected.textContent,
    minutes,
    calories: Math.round((caloriesPerHalfHour / 30) * minutes * effort),
    date: state.diaryDate
  });

  elements.workoutMinutes.value = "30";
  render();
});
}

if (elements.addWater) {
  elements.addWater.addEventListener("click", () => {
  setWaterForDiary(waterForDiary() + 1);
  render();
});
}

if (elements.foodSearch) {
  elements.foodSearch.addEventListener("input", () => {
    isCustomFoodMode = false;
    elements.customFoodFields.hidden = true;
    elements.useCustomFood.textContent = "Add custom food";
    clearTimeout(foodSearchTimer);
    foodSearchTimer = setTimeout(renderFoodSearch, 350);
  });
}

if (elements.foodResults) {
  elements.foodResults.addEventListener("click", (event) => {
    const resultButton = event.target.closest("[data-food-result]");

    if (!resultButton) {
      return;
    }

    const results = JSON.parse(elements.foodResults.dataset.results || "[]");
    selectedFood = results[Number(resultButton.dataset.foodResult)] || selectedFood;
    isCustomFoodMode = false;
    elements.customFoodFields.hidden = true;
    elements.useCustomFood.textContent = "Add custom food";
    renderFoodResults(results);
  });
}

if (elements.useCustomFood) {
  elements.useCustomFood.addEventListener("click", () => {
    setCustomFoodMode(!isCustomFoodMode);
  });
}

if (elements.closeFoodForm) {
  elements.closeFoodForm.addEventListener("click", () => {
  setFoodDialogOpen(false);
});
}

if (elements.foodDialog) {
  elements.foodDialog.addEventListener("click", (event) => {
  if (event.target === elements.foodDialog) {
    setFoodDialogOpen(false);
  }
});
}

if (elements.themeToggle) {
  elements.themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
});
}

if (elements.saveFoodApiBase) {
  elements.saveFoodApiBase.addEventListener("click", saveFoodApiBase);
}

if (elements.loginButton) {
  elements.loginButton.addEventListener("click", () => authenticate(elements.loginButton.dataset.authMode || "login"));
}

if (elements.registerButton) {
  elements.registerButton.addEventListener("click", () => authenticate(elements.registerButton.dataset.authMode || "register"));
}

if (elements.authForm) {
  elements.authForm.addEventListener("submit", (event) => {
    event.preventDefault();
    authenticate(elements.registerButton?.dataset.authMode === "register" ? "register" : "login");
  });
}

if (elements.accountForm) {
  elements.accountForm.addEventListener("submit", saveAccountFromForm);
}

if (elements.dashboardDateButton && elements.diaryDateInput) {
  elements.dashboardDateButton.addEventListener("click", () => {
    elements.diaryDateInput.classList.toggle("is-open");
    elements.diaryDateInput.focus();
    elements.diaryDateInput.select();
  });

  elements.diaryDateInput.addEventListener("change", () => {
    if (!elements.diaryDateInput.value) {
      return;
    }
    setDiaryDate(elements.diaryDateInput.value);
  });

  elements.diaryDateInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      elements.diaryDateInput.blur();
      setDiaryDate(elements.diaryDateInput.value);
    }
  });

  elements.diaryDateInput.addEventListener("blur", () => {
    elements.diaryDateInput.classList.remove("is-open");
    syncDiaryDateUi();
  });
}

if (elements.prevDiaryDate) {
  elements.prevDiaryDate.addEventListener("click", () => setDiaryDate(shiftIsoDate(state.diaryDate, -1)));
}

if (elements.nextDiaryDate) {
  elements.nextDiaryDate.addEventListener("click", () => setDiaryDate(shiftIsoDate(state.diaryDate, 1)));
}

if (elements.todayDiaryDate) {
  elements.todayDiaryDate.addEventListener("click", () => setDiaryDate(diaryTodayIso()));
}

if (elements.mealSections) {
  elements.mealSections.addEventListener("click", (event) => {
    const addBtn = event.target.closest("[data-meal-add]");
    if (!addBtn || !elements.mealSelect) {
      return;
    }
    elements.mealSelect.value = addBtn.getAttribute("data-meal-add") || "Breakfast";
    setFoodDialogOpen(true);
  });
}

document.addEventListener("click", (event) => {
  const foodIndex = event.target.dataset.foodIndex;
  const workoutIndex = event.target.dataset.workoutIndex;

  if (foodIndex !== undefined) {
    state.foods.splice(Number(foodIndex), 1);
    render();
  }

  if (workoutIndex !== undefined) {
    state.workouts.splice(Number(workoutIndex), 1);
    render();
  }
});

document.addEventListener("keydown", (event) => {
  if (elements.foodDialog && event.key === "Escape" && elements.foodDialog.getAttribute("aria-hidden") === "false") {
    setFoodDialogOpen(false);
  }
});

function navPageKey() {
  const file = (window.location.pathname.split("/").pop() || "").toLowerCase();
  if (file === "settings.html") return "settings";
  if (file === "progress.html") return "progress";
  if (file === "social.html") return "social";
  return "home";
}

function hrefMatchesNavPage(page, href) {
  if (!href) return false;
  const pathOnly = href.split("#")[0].replace(/^\.\//, "").toLowerCase();

  if (page === "settings") {
    return pathOnly === "settings.html" || pathOnly.endsWith("/settings.html");
  }

  if (page === "progress") {
    return pathOnly === "progress.html" || pathOnly.endsWith("/progress.html");
  }

  if (page === "social") {
    return pathOnly === "social.html" || pathOnly.endsWith("/social.html");
  }

  if (page === "home") {
    if (href === "#dashboard") return true;
    return href.toLowerCase().includes("index.html#dashboard");
  }

  return false;
}

function syncNavActive() {
  const page = navPageKey();
  document.querySelectorAll(".nav-item").forEach((link) => {
    const href = link.getAttribute("href") || "";
    link.classList.toggle("active", hrefMatchesNavPage(page, href));
  });
}

document.querySelectorAll(".nav-item").forEach((link) => {
  link.addEventListener("click", () => {
    if (navPageKey() !== "home") return;
    const href = link.getAttribute("href");
    if (href?.startsWith("#")) {
      document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
      link.classList.add("active");
    }
  });
});

window.addEventListener("hashchange", syncNavActive);
syncNavActive();

function watchDateRollover() {
  let lastToday = diaryTodayIso();

  window.setInterval(() => {
    const currentToday = diaryTodayIso();
    if (currentToday === lastToday) {
      return;
    }

    if (state.diaryDate === lastToday) {
      state.diaryDate = currentToday;
    }

    state.lastToday = currentToday;
    lastToday = currentToday;
    syncDiaryDateUi();
    render();
  }, 60000);
}

async function initializeApp() {
  applyTheme(getInitialTheme());
  renderFoodApiSettings();
  renderAccountSettings();
  renderTargetSummary();

  if (isAuthPage()) {
    setAuthMode("login");
    window.setTimeout(() => document.body.classList.remove("is-loading"), 700);

    if (getAuthToken()) {
      await loadRemoteAccount();
      if (getAuthToken()) {
        redirectAfterAuth();
      }
    }

    return;
  }

  if (isProtectedPage() && !getAuthToken()) {
    redirectToAuth();
    return;
  }

  await loadRemoteAccount();

  if (isProtectedPage() && !getAuthToken()) {
    redirectToAuth();
    return;
  }

  if (elements.foodSearch) {
    renderFoodSearch();
    render();
    watchDateRollover();
  }
}

initializeApp();
