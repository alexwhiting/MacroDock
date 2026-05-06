const defaultCalorieGoal = null;
const defaultMacroGoals = {
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

const defaultStateStorageKey = "macrodock-state";

function defaultDiaryState() {
  return {
    foods: [],
    workouts: [],
    water: 0,
    waterByDate: {},
    recentFoods: [],
    diaryDate: null
  };
}

function readStoredState(storageKey) {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || defaultDiaryState();
  } catch {
    return defaultDiaryState();
  }
}

let activeStateStorageKey = defaultStateStorageKey;
const state = readStoredState(activeStateStorageKey);

const supabaseProfileColumns = {
  theme: true,
  recentFoods: true
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
  if (!Array.isArray(state.recentFoods)) {
    state.recentFoods = [];
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

function replaceDiaryState(nextState = defaultDiaryState()) {
  Object.keys(state).forEach((key) => {
    delete state[key];
  });
  Object.assign(state, defaultDiaryState(), nextState);
  normalizeDiaryState();
}

function stateStorageKeyForUser(user) {
  if (user?.id) {
    return `macrodock-state:${user.id}`;
  }

  if (user?.email) {
    return `macrodock-state:${user.email.toLowerCase()}`;
  }

  return defaultStateStorageKey;
}

function useStateStorageForUser(user) {
  useStateStorageKey(stateStorageKeyForUser(user));
}

function useStateStorageKey(nextStorageKey) {
  if (activeStateStorageKey === nextStorageKey) {
    return;
  }

  activeStateStorageKey = nextStorageKey;
  replaceDiaryState(readStoredState(activeStateStorageKey));
}

function itemMatchesDiary(item) {
  return itemMatchesDate(item, state.diaryDate);
}

function itemMatchesDate(item, date) {
  return (item.date || diaryTodayIso()) === date;
}

function workoutMatchesDiary(workout) {
  return itemMatchesDate(workout, state.diaryDate);
}

function waterForDiary() {
  return waterForDate(state.diaryDate);
}

function waterForDate(date) {
  return state.waterByDate?.[date] || 0;
}

function setWaterForDiary(value) {
  state.waterByDate[state.diaryDate] = Math.max(Math.min(value, 20), 0);
  state.water = waterForDiary();
}

function mergeDiaryDay(date, diaryDay = {}) {
  state.foods = [
    ...state.foods.filter((food) => (food.date || diaryTodayIso()) !== date),
    ...(diaryDay.foods || []).map((food) => ({ ...food, date }))
  ];
  state.workouts = [
    ...state.workouts.filter((workout) => (workout.date || diaryTodayIso()) !== date),
    ...(diaryDay.workouts || []).map((workout) => ({ ...workout, date }))
  ];
  state.waterByDate[date] = Number(diaryDay.water) || 0;

  if (state.diaryDate === date) {
    state.water = waterForDiary();
  }
}

function currentDiaryPayload() {
  return diaryPayloadForDate(state.diaryDate);
}

function diaryPayloadForDate(date) {
  return {
    foods: state.foods.filter((food) => itemMatchesDate(food, date)),
    workouts: state.workouts.filter((workout) => itemMatchesDate(workout, date)),
    water: waterForDate(date)
  };
}

function diaryPayloadHasEntries(payload = {}) {
  return Boolean((payload.foods || []).length || (payload.workouts || []).length || Number(payload.water));
}

function shouldSyncDiaryToSupabase() {
  return getAuthProvider() === "supabase" && supabaseEnabled() && currentSupabaseUser?.id;
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

async function setDiaryDate(nextDate) {
  if (!isValidDiaryDate(nextDate)) {
    syncDiaryDateUi();
    return;
  }

  if (shouldSyncDiaryToSupabase()) {
    await saveSupabaseDiaryDay().catch(() => {});
  }

  state.diaryDate = nextDate;
  state.water = waterForDiary();
  saveState();

  if (shouldSyncDiaryToSupabase()) {
    await loadSupabaseDiaryDay(nextDate).catch(() => {});
  }

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
let activeFoodTab = "all";
let currentSupabaseUser = null;
let isHydratingDiary = false;
let diarySaveTimer = null;
let caloriePercentDisplay = 0;
let caloriePercentFrame = null;
let editingFoodIndex = null;
const runtimeConfig = {
  supabaseUrl: "https://ulmwocfyvocswblavfdj.supabase.co",
  supabaseAnonKey: "sb_publishable_BejLt2fZxPutp8uo5M5PLw_kjLpzhFY"
};

const elements = {
  foodSearch: document.querySelector("#foodSearch"),
  foodSearchView: document.querySelector("#foodSearchView"),
  foodDetailView: document.querySelector("#foodDetailView"),
  foodSearchStatus: document.querySelector("#foodSearchStatus"),
  foodResults: document.querySelector("#foodResults"),
  useCustomFood: document.querySelector("#useCustomFood"),
  selectedFoodName: document.querySelector("#selectedFoodName"),
  selectedFoodMacros: document.querySelector("#selectedFoodMacros"),
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
  foodTabs: document.querySelectorAll("[data-food-tab]"),
  servingSize: document.querySelector("#servingSize"),
  mealSelect: document.querySelector("#mealSelect"),
  foodSubmitButton: document.querySelector("#foodSubmitButton"),
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
  accountEmail: document.querySelector("#accountEmail"),
  accountUsername: document.querySelector("#accountUsername"),
  accountUnits: document.querySelector("#accountUnits"),
  accountNewPassword: document.querySelector("#accountNewPassword"),
  changePasswordButton: document.querySelector("#changePasswordButton"),
  deleteAccountButton: document.querySelector("#deleteAccountButton"),
  settingsLogoutButton: document.querySelector("#settingsLogoutButton"),
  goalWeight: document.querySelector("#goalWeight"),
  goalDate: document.querySelector("#goalDate"),
  currentGoal: document.querySelector("#currentGoal"),
  weeklyRate: document.querySelector("#weeklyRate"),
  calorieMode: document.querySelector("#calorieMode"),
  calorieTargetInput: document.querySelector("#calorieTargetInput"),
  macroMode: document.querySelector("#macroMode"),
  proteinTarget: document.querySelector("#proteinTarget"),
  carbsTarget: document.querySelector("#carbsTarget"),
  fatTarget: document.querySelector("#fatTarget"),
  dietaryPreference: document.querySelector("#dietaryPreference"),
  mealStructure: document.querySelector("#mealStructure"),
  calorieDistribution: document.querySelector("#calorieDistribution"),
  stepIntegration: document.querySelector("#stepIntegration"),
  dailyStepEstimate: document.querySelector("#dailyStepEstimate"),
  workoutFrequency: document.querySelector("#workoutFrequency"),
  workoutType: document.querySelector("#workoutType"),
  defaultDiaryView: document.querySelector("#defaultDiaryView"),
  quickAddCalories: document.querySelector("#quickAddCalories"),
  showNetCalories: document.querySelector("#showNetCalories"),
  focusMode: document.querySelector("#focusMode"),
  mealLoggingReminders: document.querySelector("#mealLoggingReminders"),
  waterReminders: document.querySelector("#waterReminders"),
  weighInReminders: document.querySelector("#weighInReminders"),
  goalProgressAlerts: document.querySelector("#goalProgressAlerts"),
  streakNotifications: document.querySelector("#streakNotifications"),
  accentColor: document.querySelector("#accentColor"),
  dashboardLayout: document.querySelector("#dashboardLayout"),
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

function applyTheme(theme, options = {}) {
  const { sync = false } = options;
  const isDark = theme === "dark";

  document.documentElement.dataset.theme = theme;
  if (document.body) {
    document.body.dataset.theme = theme;
  }

  if (elements.themeToggle && elements.themeLabel) {
    elements.themeToggle.setAttribute("aria-pressed", String(isDark));
    elements.themeLabel.textContent = isDark ? "Light mode" : "Dark mode";
    elements.themeToggle.querySelector(".theme-icon").textContent = isDark ? "L" : "D";
  }

  localStorage.setItem("macrodock-theme", theme);

  if (sync) {
    saveThemePreference(theme);
  }
}

function applyAccentColor(accent) {
  const palettes = {
    green: { green: "#62c784", dark: "#277a4d", bg: "#dff5e6", ink: "#10241a" },
    blue: { green: "#5d9cec", dark: "#2563a8", bg: "#e3efff", ink: "#0c1d33" },
    orange: { green: "#f4a261", dark: "#b85d1b", bg: "#fff0df", ink: "#301708" },
    rose: { green: "#ee6f8f", dark: "#ad3155", bg: "#ffe6ed", ink: "#32101a" }
  };
  const palette = palettes[accent] || palettes.green;

  document.documentElement.style.setProperty("--green", palette.green);
  document.documentElement.style.setProperty("--green-dark", palette.dark);
  document.documentElement.style.setProperty("--brand-bg", palette.bg);
  document.documentElement.style.setProperty("--brand-ink", palette.ink);
  localStorage.setItem("macrodock-accent", accent || "green");
}

function applyStoredPreferences(account = storedAccount()) {
  const preferences = accountPreferences(account);
  applyAccentColor(preferences.accentColor);

  if (document.body) {
    document.body.dataset.dashboardLayout = preferences.dashboardLayout;
    document.body.dataset.diaryView = preferences.defaultDiaryView;
  }
}

function profileColumnSelect() {
  const columns = ["account", "name"];

  if (supabaseProfileColumns.theme) {
    columns.push("theme");
  }

  if (supabaseProfileColumns.recentFoods) {
    columns.push("recent_foods");
  }

  return columns.join(",");
}

function markMissingProfileColumn(error) {
  const message = String(error?.message || "").toLowerCase();

  if (message.includes("recent_foods")) {
    supabaseProfileColumns.recentFoods = false;
    return true;
  }

  if (message.includes("profiles.theme") || message.includes("theme")) {
    supabaseProfileColumns.theme = false;
    return true;
  }

  return false;
}

function profilePayload({ userId, name, account, theme, recentFoods }) {
  const payload = {
    user_id: userId,
    name,
    account
  };

  if (supabaseProfileColumns.theme) {
    payload.theme = theme;
  }

  if (supabaseProfileColumns.recentFoods) {
    payload.recent_foods = recentFoods;
  }

  return payload;
}

async function upsertSupabaseProfile(profile, options = {}) {
  const prefer = options.returnRepresentation
    ? "resolution=merge-duplicates,return=representation"
    : "resolution=merge-duplicates";

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await supabaseRequest("/rest/v1/profiles?on_conflict=user_id", {
        method: "POST",
        headers: {
          Prefer: prefer
        },
        body: JSON.stringify(profilePayload(profile))
      });
    } catch (error) {
      if (!markMissingProfileColumn(error)) {
        throw error;
      }
    }
  }

  throw new Error("Profile save failed because the profiles table is missing expected columns.");
}

function saveThemePreference(theme) {
  if (getAuthProvider() === "supabase" && supabaseEnabled() && currentSupabaseUser?.id) {
    upsertSupabaseProfile({
      userId: currentSupabaseUser.id,
      name: storedAccount()?.name || currentSupabaseUser.user_metadata?.name || currentSupabaseUser.email || "",
      account: storedAccount(),
      theme,
      recentFoods: state.recentFoods || []
    }).catch((error) => {
      console.warn("Theme cloud save failed", error);
    });
    return;
  }

  const account = storedAccount();
  if (account) {
    localStorage.setItem("macrodock-account", JSON.stringify({ ...account, theme }));
  }
}

function saveRecentFoodsPreference() {
  if (!(getAuthProvider() === "supabase" && supabaseEnabled() && currentSupabaseUser?.id)) {
    return;
  }

  upsertSupabaseProfile({
    userId: currentSupabaseUser.id,
    name: storedAccount()?.name || currentSupabaseUser.user_metadata?.name || currentSupabaseUser.email || "",
    account: storedAccount(),
    theme: getInitialTheme(),
    recentFoods: state.recentFoods || []
  }).catch((error) => {
    console.warn("Recent foods cloud save failed", error);
  });
}

function saveState() {
  localStorage.setItem(activeStateStorageKey, JSON.stringify(state));
  queueDiaryCloudSave();
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
  const preferences = accountPreferences(account);
  const sexConstant = account.sex === "female" ? -161 : 5;
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + sexConstant;
  const tdee = bmr * activityFactor;
  const weeklyRateAdjustment = preferences.currentGoal === "maintain" ? 0 : (Number(preferences.weeklyRate) || 0) * 500;
  const goalAdjustment = preferences.currentGoal === "lose"
    ? -weeklyRateAdjustment
    : preferences.currentGoal === "gain"
      ? weeklyRateAdjustment
      : 0;
  const dailyGoalAdjustment = preferences.currentGoal === "maintain" ? 0 : goalAdjustment;
  const autoCalorieTarget = Math.max(Math.round(tdee + dailyGoalAdjustment), 1000);
  const calorieTarget = preferences.calorieMode === "manual" && Number(preferences.calorieTarget)
    ? Math.max(Math.round(Number(preferences.calorieTarget)), 1000)
    : autoCalorieTarget;

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    calorieTarget,
    dailyGoalAdjustment: Math.round(dailyGoalAdjustment),
    daysToGoal: 0,
    weightDeltaKg: preferences.currentGoal === "lose" ? -1 : preferences.currentGoal === "gain" ? 1 : 0
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
    elements.targetCalories.textContent = calorieTarget ? `${formatNumber(calorieTarget)} kcal` : "Set goal";
  }

  if (elements.profilePlanText) {
    elements.profilePlanText.textContent = goalDescription(account);
  }
}

function defaultPreferences() {
  return {
    username: "",
    units: "metric",
    currentGoal: "maintain",
    weeklyRate: "1",
    calorieMode: "auto",
    calorieTarget: "",
    macroMode: "auto",
    macroTargets: { ...defaultMacroGoals },
    dietaryPreference: "none",
    mealStructure: "3",
    calorieDistribution: "even",
    stepIntegration: "none",
    dailyStepEstimate: 7000,
    workoutFrequency: "3",
    workoutType: "mixed",
    defaultDiaryView: "both",
    quickAddCalories: true,
    showNetCalories: true,
    focusMode: "daily",
    mealLoggingReminders: false,
    waterReminders: false,
    weighInReminders: false,
    goalProgressAlerts: true,
    streakNotifications: true,
    accentColor: "green",
    dashboardLayout: "balanced"
  };
}

function accountPreferences(account = storedAccount()) {
  const preferences = account?.preferences || {};

  return {
    ...defaultPreferences(),
    ...preferences,
    macroTargets: {
      ...defaultMacroGoals,
      ...(preferences.macroTargets || {})
    }
  };
}

function getMacroGoals() {
  const preferences = accountPreferences();

  if (preferences.macroMode === "manual") {
    return {
      protein: Number(preferences.macroTargets.protein) || defaultMacroGoals.protein,
      carbs: Number(preferences.macroTargets.carbs) || defaultMacroGoals.carbs,
      fat: Number(preferences.macroTargets.fat) || defaultMacroGoals.fat
    };
  }

  const calories = getCalorieGoal() || 2150;
  return {
    protein: Math.round((calories * 0.3) / 4),
    carbs: Math.round((calories * 0.4) / 4),
    fat: Math.round((calories * 0.3) / 9)
  };
}

function checkboxValue(element) {
  return Boolean(element?.checked);
}

function collectSettingsPreferences() {
  const previous = accountPreferences();
  const currentGoal = elements.currentGoal?.value || "maintain";

  return {
    ...previous,
    username: elements.accountUsername?.value.trim() || "",
    units: elements.accountUnits?.value || "metric",
    currentGoal,
    weeklyRate: currentGoal === "maintain" ? "0" : elements.weeklyRate?.value || "1",
    calorieMode: elements.calorieMode?.value || "auto",
    calorieTarget: Number(elements.calorieTargetInput?.value) || "",
    macroMode: elements.macroMode?.value || "auto",
    macroTargets: {
      protein: Number(elements.proteinTarget?.value) || defaultMacroGoals.protein,
      carbs: Number(elements.carbsTarget?.value) || defaultMacroGoals.carbs,
      fat: Number(elements.fatTarget?.value) || defaultMacroGoals.fat
    },
    dietaryPreference: elements.dietaryPreference?.value || "none",
    mealStructure: elements.mealStructure?.value || "3",
    calorieDistribution: elements.calorieDistribution?.value || "even",
    stepIntegration: elements.stepIntegration?.value || "none",
    dailyStepEstimate: Number(elements.dailyStepEstimate?.value) || 7000,
    workoutFrequency: elements.workoutFrequency?.value || "3",
    workoutType: elements.workoutType?.value || "mixed",
    defaultDiaryView: elements.defaultDiaryView?.value || "both",
    quickAddCalories: checkboxValue(elements.quickAddCalories),
    showNetCalories: checkboxValue(elements.showNetCalories),
    focusMode: elements.focusMode?.value || "daily",
    mealLoggingReminders: checkboxValue(elements.mealLoggingReminders),
    waterReminders: checkboxValue(elements.waterReminders),
    weighInReminders: checkboxValue(elements.weighInReminders),
    goalProgressAlerts: checkboxValue(elements.goalProgressAlerts),
    streakNotifications: checkboxValue(elements.streakNotifications),
    accentColor: elements.accentColor?.value || "green",
    dashboardLayout: elements.dashboardLayout?.value || "balanced"
  };
}

function saveAccountFromForm(event) {
  event.preventDefault();

  if (!elements.accountName.value.trim() || !Number(elements.accountAge.value) || !Number(elements.accountHeight.value) || !Number(elements.accountWeight.value)) {
    elements.accountSummary.textContent = "Enter your name, age, height, and weight to calculate your target.";
    setSettingsSectionOpen("accountFields", true);
    return;
  }

  const accountInput = {
    name: elements.accountName.value.trim(),
    sex: elements.accountSex.value,
    age: Number(elements.accountAge.value),
    heightCm: Number(elements.accountHeight.value),
    weightKg: Number(elements.accountWeight.value),
    activityFactor: Number(elements.accountActivity.value),
    targetWeightKg: Number(elements.goalWeight.value) || Number(elements.accountWeight.value),
    targetDate: "",
    preferences: collectSettingsPreferences()
  };
  const targets = calculateAccountTargets(accountInput);
  const account = { ...accountInput, ...targets };

  localStorage.setItem("macrodock-account", JSON.stringify(account));
  applyStoredPreferences(account);
  renderAccountSettings();
  renderTargetSummary();

  const finishAccountSave = (user) => {
    if (user) {
      renderAuthState(user);
    }
    if (isOnboardingPage()) {
      window.location.href = "./index.html";
    }
  };

  if (getAuthToken()) {
    if (getAuthProvider() === "supabase" && supabaseEnabled()) {
      supabaseRequest("/auth/v1/user")
        .then((authData) => upsertSupabaseProfile({
            userId: authData.id,
            name: account.name,
            account,
            theme: getInitialTheme(),
            recentFoods: state.recentFoods || []
          }, { returnRepresentation: true }))
        .then((rows) => {
          const savedAccount = rows?.[0]?.account || account;
          localStorage.setItem("macrodock-account", JSON.stringify(savedAccount));
          applyStoredPreferences(savedAccount);
          finishAccountSave({
            name: savedAccount.name,
            account: savedAccount
          });
        })
        .catch((error) => {
          if (elements.accountSummary) {
            elements.accountSummary.insertAdjacentHTML("beforeend", `<p>${escapeHtml(error.message)}</p>`);
          }
        });
      return;
    }

    apiRequest("/api/account", {
      method: "PUT",
      body: JSON.stringify(account)
    })
      .then((data) => {
        if (data.account) {
          localStorage.setItem("macrodock-account", JSON.stringify(data.account));
          applyStoredPreferences(data.account);
        }
        finishAccountSave(data.user);
      })
      .catch((error) => {
        if (elements.accountSummary) {
          elements.accountSummary.insertAdjacentHTML("beforeend", `<p>${escapeHtml(error.message)}</p>`);
        }
      });
    return;
  }

  finishAccountSave();
}

function redirectAuthenticatedUserWithoutAccount(account) {
  if (!isProtectedPage() || isAuthPage() || isOnboardingPage() || account || storedAccount() || !getAuthToken()) {
    return false;
  }

  redirectToMetricsSetup();
  return true;
}

function redirectOnboardingUserWithAccount() {
  if (!isOnboardingPage() || !storedAccount()) {
    return false;
  }

  window.location.href = "./index.html";
  return true;
}

function renderAccountSettings() {
  if (!elements.accountForm) {
    return;
  }

  const account = storedAccount();
  const preferences = accountPreferences(account);
  const email = currentSupabaseUser?.email || localStorage.getItem("macrodock-user-email") || "";

  if (elements.accountEmail) elements.accountEmail.value = email;
  if (elements.accountUsername) elements.accountUsername.value = preferences.username || "";
  if (elements.accountUnits) elements.accountUnits.value = preferences.units || "metric";
  if (elements.currentGoal) elements.currentGoal.value = preferences.currentGoal || "maintain";
  if (elements.weeklyRate) elements.weeklyRate.value = preferences.weeklyRate || "1";
  if (elements.calorieMode) elements.calorieMode.value = preferences.calorieMode || "auto";
  if (elements.calorieTargetInput) elements.calorieTargetInput.value = preferences.calorieTarget || account?.calorieTarget || "";
  if (elements.macroMode) elements.macroMode.value = preferences.macroMode || "auto";
  if (elements.proteinTarget) elements.proteinTarget.value = preferences.macroTargets.protein || defaultMacroGoals.protein;
  if (elements.carbsTarget) elements.carbsTarget.value = preferences.macroTargets.carbs || defaultMacroGoals.carbs;
  if (elements.fatTarget) elements.fatTarget.value = preferences.macroTargets.fat || defaultMacroGoals.fat;
  if (elements.dietaryPreference) elements.dietaryPreference.value = preferences.dietaryPreference || "none";
  if (elements.mealStructure) elements.mealStructure.value = preferences.mealStructure || "3";
  if (elements.calorieDistribution) elements.calorieDistribution.value = preferences.calorieDistribution || "even";
  if (elements.stepIntegration) elements.stepIntegration.value = preferences.stepIntegration || "none";
  if (elements.dailyStepEstimate) elements.dailyStepEstimate.value = preferences.dailyStepEstimate || 7000;
  if (elements.workoutFrequency) elements.workoutFrequency.value = preferences.workoutFrequency || "3";
  if (elements.workoutType) elements.workoutType.value = preferences.workoutType || "mixed";
  if (elements.defaultDiaryView) elements.defaultDiaryView.value = preferences.defaultDiaryView || "both";
  if (elements.quickAddCalories) elements.quickAddCalories.checked = Boolean(preferences.quickAddCalories);
  if (elements.showNetCalories) elements.showNetCalories.checked = Boolean(preferences.showNetCalories);
  if (elements.focusMode) elements.focusMode.value = preferences.focusMode || "daily";
  if (elements.mealLoggingReminders) elements.mealLoggingReminders.checked = Boolean(preferences.mealLoggingReminders);
  if (elements.waterReminders) elements.waterReminders.checked = Boolean(preferences.waterReminders);
  if (elements.weighInReminders) elements.weighInReminders.checked = Boolean(preferences.weighInReminders);
  if (elements.goalProgressAlerts) elements.goalProgressAlerts.checked = Boolean(preferences.goalProgressAlerts);
  if (elements.streakNotifications) elements.streakNotifications.checked = Boolean(preferences.streakNotifications);
  if (elements.accentColor) elements.accentColor.value = preferences.accentColor || "green";
  if (elements.dashboardLayout) elements.dashboardLayout.value = preferences.dashboardLayout || "balanced";
  syncWeeklyRateControl();

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

  elements.accountName.value = currentSupabaseUser?.user_metadata?.name || "";
  elements.accountSex.value = "male";
  elements.accountAge.value = "";
  elements.accountHeight.value = "";
  elements.accountWeight.value = "";
  elements.accountActivity.value = "1.55";
  elements.goalWeight.value = "";
  elements.goalDate.value = "";
  elements.accountSummary.textContent = "Add your metrics to calculate your daily calorie target.";
}

function syncWeeklyRateControl() {
  if (!elements.currentGoal || !elements.weeklyRate) {
    return;
  }

  const isMaintaining = elements.currentGoal.value === "maintain";
  if (isMaintaining) {
    elements.weeklyRate.value = "0";
  } else if (elements.weeklyRate.value === "0") {
    elements.weeklyRate.value = "1";
  }

  elements.weeklyRate.disabled = isMaintaining;
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

function getAuthProvider() {
  return localStorage.getItem("macrodock-auth-provider") || "local";
}

function setAuthToken(token) {
  if (token) {
    localStorage.setItem("macrodock-auth-token", token);
  } else {
    localStorage.removeItem("macrodock-auth-token");
    localStorage.removeItem("macrodock-auth-provider");
  }
}

function setAuthSession(token, provider) {
  setAuthToken(token);
  if (token) {
    localStorage.setItem("macrodock-auth-provider", provider);
  }
}

function setAuthStateOwner(user) {
  const storageKey = stateStorageKeyForUser(user);
  localStorage.setItem("macrodock-auth-state-key", storageKey);
  useStateStorageKey(storageKey);
}

function restoreAuthStateOwner() {
  if (!getAuthToken()) {
    return;
  }

  const storageKey = localStorage.getItem("macrodock-auth-state-key");
  if (storageKey) {
    useStateStorageKey(storageKey);
  }
}

function supabaseEnabled() {
  return Boolean(runtimeConfig.supabaseUrl && runtimeConfig.supabaseAnonKey);
}

async function loadRuntimeConfig() {
  const localAnonKey = localStorage.getItem("macrodock-supabase-anon-key") || "";

  if (localAnonKey) {
    runtimeConfig.supabaseAnonKey = localAnonKey;
  }

  if (window.MACRODOCK_SUPABASE?.anonKey) {
    runtimeConfig.supabaseUrl = window.MACRODOCK_SUPABASE.url || runtimeConfig.supabaseUrl;
    runtimeConfig.supabaseAnonKey = window.MACRODOCK_SUPABASE.anonKey;
  }

  if (window.location.protocol === "file:") {
    return;
  }

  try {
    const response = await fetch(`${getFoodApiBase()}/api/config`);
    const data = await response.json();

    runtimeConfig.supabaseUrl = data.supabaseUrl || runtimeConfig.supabaseUrl;
    runtimeConfig.supabaseAnonKey = data.supabaseAnonKey || runtimeConfig.supabaseAnonKey;
  } catch {
    // Static hosting can still use window.MACRODOCK_SUPABASE or localStorage config.
  }
}

function currentPageFile() {
  return (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
}

function isAuthPage() {
  return currentPageFile() === "auth.html";
}

function isOnboardingPage() {
  return currentPageFile() === "onboarding.html";
}

function isProtectedPage() {
  return ["", "index.html", "settings.html", "progress.html", "social.html", "onboarding.html"].includes(currentPageFile());
}

function redirectAfterAuth() {
  const target = sessionStorage.getItem("macrodock-post-auth") || "./index.html";
  sessionStorage.removeItem("macrodock-post-auth");
  window.location.href = target;
}

function redirectToMetricsSetup() {
  sessionStorage.removeItem("macrodock-post-auth");
  window.location.href = "./onboarding.html";
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
    const error = new Error(data.error || "Request failed");
    error.status = response.status;
    throw error;
  }

  return data;
}

async function supabaseRequest(path, options = {}) {
  const headers = {
    apikey: runtimeConfig.supabaseAnonKey,
    "Content-Type": "application/json",
    ...(options.headers || {})
  };
  const token = getAuthToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${runtimeConfig.supabaseUrl}${path}`, {
    ...options,
    headers
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error_description || data.msg || data.message || data.error || "Supabase request failed");
    error.status = response.status;
    error.code = data.code || data.error_code || data.error || "";
    throw error;
  }

  return data;
}

function supabasePublicUser(user, account = null) {
  return {
    id: user.id,
    name: user.user_metadata?.name || user.email || "Logged in",
    email: user.email,
    theme: user.theme || null,
    account
  };
}

async function loadSupabaseProfile(user) {
  setAuthStateOwner(user);
  currentSupabaseUser = user;
  if (user?.email) {
    localStorage.setItem("macrodock-user-email", user.email);
  }
  let rows = [];

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const params = new URLSearchParams({
      select: profileColumnSelect(),
      user_id: `eq.${user.id}`
    });

    try {
      rows = await supabaseRequest(`/rest/v1/profiles?${params.toString()}`);
      break;
    } catch (error) {
      if (!markMissingProfileColumn(error)) {
        throw error;
      }
    }
  }

  const profile = Array.isArray(rows) ? rows[0] : null;
  const profileUser = {
    ...user,
    theme: profile?.theme || null
  };

  if (profile?.theme === "dark" || profile?.theme === "light") {
    applyTheme(profile.theme);
  }
  const remoteRecentFoods = Array.isArray(profile?.recent_foods) ? profile.recent_foods : [];
  if (remoteRecentFoods.length || !state.recentFoods.length) {
    state.recentFoods = remoteRecentFoods;
  } else {
    saveRecentFoodsPreference();
  }
  saveState();

  return {
    account: profile?.account || null,
    user: supabasePublicUser(profileUser, profile?.account || null)
  };
}

async function loadSupabaseDiaryDay(date = state.diaryDate) {
  if (!shouldSyncDiaryToSupabase()) {
    return null;
  }

  const params = new URLSearchParams({
    select: "foods,workouts,water",
    user_id: `eq.${currentSupabaseUser.id}`,
    diary_date: `eq.${date}`
  });
  const rows = await supabaseRequest(`/rest/v1/diary_days?${params.toString()}`);
  const diaryDay = Array.isArray(rows) ? rows[0] : null;
  const localPayload = diaryPayloadForDate(date);

  if (!diaryDay) {
    if (diaryPayloadHasEntries(localPayload)) {
      await saveSupabaseDiaryDay(date).catch((error) => {
        console.warn("Diary cloud backfill failed", error);
      });
    }
    return null;
  }

  const remotePayload = {
    foods: diaryDay.foods || [],
    workouts: diaryDay.workouts || [],
    water: Number(diaryDay.water) || 0
  };

  if (!diaryPayloadHasEntries(remotePayload) && diaryPayloadHasEntries(localPayload)) {
    await saveSupabaseDiaryDay(date).catch((error) => {
      console.warn("Diary cloud backfill failed", error);
    });
    return diaryDay;
  }

  isHydratingDiary = true;
  mergeDiaryDay(date, remotePayload);
  saveState();
  isHydratingDiary = false;
  return diaryDay;
}

async function saveSupabaseDiaryDay(date = state.diaryDate) {
  if (!shouldSyncDiaryToSupabase() || isHydratingDiary) {
    return;
  }

  const payload = diaryPayloadForDate(date);
  await supabaseRequest("/rest/v1/diary_days?on_conflict=user_id,diary_date", {
    method: "POST",
    headers: {
      Prefer: "resolution=merge-duplicates"
    },
    body: JSON.stringify({
      user_id: currentSupabaseUser.id,
      diary_date: date,
      foods: payload.foods,
      workouts: payload.workouts,
      water: payload.water
    })
  });
}

function queueDiaryCloudSave() {
  if (!shouldSyncDiaryToSupabase() || isHydratingDiary) {
    return;
  }

  window.clearTimeout(diarySaveTimer);
  diarySaveTimer = window.setTimeout(() => {
    saveSupabaseDiaryDay().catch((error) => {
      console.warn("Diary cloud save failed", error);
    });
  }, 350);
}

async function loadSupabaseAccount() {
  const authData = await supabaseRequest("/auth/v1/user");
  const profileData = await loadSupabaseProfile(authData);
  await loadSupabaseDiaryDay(state.diaryDate);

  if (profileData.account) {
    localStorage.setItem("macrodock-account", JSON.stringify(profileData.account));
    applyStoredPreferences(profileData.account);
  } else {
    localStorage.removeItem("macrodock-account");
  }

  renderAuthState(profileData.user);
  renderAccountSettings();
  renderTargetSummary();

  if (elements.remainingCalories) {
    render();
  }

  return profileData.account;
}

async function loadRemoteAccount() {
  if (!getAuthToken()) {
    renderAuthState();
    return null;
  }

  try {
    if (getAuthProvider() === "supabase" && supabaseEnabled()) {
      return await loadSupabaseAccount();
    }

    const data = await apiRequest("/api/account");
    setAuthStateOwner(data.user);

    if (data.account) {
      localStorage.setItem("macrodock-account", JSON.stringify(data.account));
      applyStoredPreferences(data.account);
    } else {
      localStorage.removeItem("macrodock-account");
    }

    renderAuthState(data.user);
    renderAccountSettings();
    renderTargetSummary();

    if (elements.remainingCalories) {
      render();
    }

    return data.account || null;
  } catch (error) {
    if (error.status === 401 || error.status === 403) {
      setAuthToken("");
      currentSupabaseUser = null;
    }
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
        <span>Your account metrics save to ${getAuthProvider() === "supabase" ? "Supabase" : "the local backend database"}.</span>
      </div>
      <button id="logoutButton" class="ghost-button" type="button">Log out</button>
    `;
    document.querySelector("#logoutButton").addEventListener("click", logout);
    return;
  }

  elements.authPanel.textContent = supabaseEnabled()
    ? "Log in or create an account with Supabase."
    : "Supabase is not configured yet. Local backend login is available for development.";
}

function authErrorMessage(error, mode) {
  const message = String(error?.message || "Authentication failed");
  const lowerMessage = message.toLowerCase();

  if (mode === "register" && lowerMessage.includes("already registered")) {
    return "That email already has an account. Log in instead, or use a different email.";
  }

  if (lowerMessage.includes("rate limit")) {
    return "Too many account attempts in a short time. Wait a minute, then try logging in.";
  }

  if (lowerMessage.includes("recent_foods")) {
    return "Your account exists, but the database needs the latest profile migration. Log in again after the schema update.";
  }

  return message;
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

  try {
    if (mode === "register") {
      if (!payload.name) {
        elements.authPanel.textContent = "Enter your name to create an account.";
        return;
      }
      localStorage.removeItem("macrodock-account");
    }

    if (supabaseEnabled()) {
      const path = mode === "register" ? "/auth/v1/signup" : "/auth/v1/token?grant_type=password";
      const authPayload = mode === "register"
        ? { email: payload.email, password: payload.password, data: { name: payload.name } }
        : { email: payload.email, password: payload.password };
      const data = await supabaseRequest(path, {
        method: "POST",
        body: JSON.stringify(authPayload)
      });

      if (!data.access_token) {
        elements.authPanel.textContent = "Account created. Check your email to confirm it, then log in and complete your metrics.";
        setAuthMode("login");
        return;
      }

      setAuthSession(data.access_token, "supabase");
      elements.authPassword.value = "";
      const profileData = await loadSupabaseProfile(data.user);

      if (profileData.account) {
        localStorage.setItem("macrodock-account", JSON.stringify(profileData.account));
      } else {
        localStorage.removeItem("macrodock-account");
      }

      renderAuthState(profileData.user);

      if (isAuthPage() && mode === "register") {
        redirectToMetricsSetup();
        return;
      }

      if (isAuthPage() && !profileData.account) {
        redirectToMetricsSetup();
        return;
      }

      if (isAuthPage()) {
        redirectAfterAuth();
      }
      return;
    }

    const endpoint = mode === "register" ? "/api/auth/register" : "/api/auth/login";
    const data = await apiRequest(endpoint, {
      method: "POST",
      body: JSON.stringify(payload)
    });

    setAuthSession(data.token, "local");
    setAuthStateOwner(data.user);
    elements.authPassword.value = "";
    renderAuthState(data.user);

    if (data.user?.account) {
      localStorage.setItem("macrodock-account", JSON.stringify(data.user.account));
      renderAccountSettings();
      renderTargetSummary();
    } else {
      localStorage.removeItem("macrodock-account");
    }

    if (isAuthPage() && mode === "register") {
      redirectToMetricsSetup();
      return;
    }

    if (isAuthPage() && !data.user?.account) {
      redirectToMetricsSetup();
      return;
    }

    if (isAuthPage()) {
      redirectAfterAuth();
    }
  } catch (error) {
    elements.authPanel.textContent = authErrorMessage(error, mode);
  }
}

async function logout() {
  try {
    if (getAuthProvider() === "supabase" && supabaseEnabled()) {
      await supabaseRequest("/auth/v1/logout", { method: "POST", body: "{}" });
    } else {
      await apiRequest("/api/auth/logout", { method: "POST", body: "{}" });
    }
  } catch {
    // Local logout should still clear the token if the server is unavailable.
  }

  setAuthToken("");
  currentSupabaseUser = null;
  useStateStorageForUser(null);
  replaceDiaryState(defaultDiaryState());
  localStorage.setItem(activeStateStorageKey, JSON.stringify(state));
  localStorage.removeItem("macrodock-account");
  localStorage.removeItem("macrodock-user-email");
  localStorage.removeItem("macrodock-auth-state-key");
  renderAuthState();
  redirectToAuth();
}

async function changePassword() {
  const password = elements.accountNewPassword?.value || "";

  if (password.length < 8) {
    elements.accountSummary.textContent = "Enter a new password with at least 8 characters.";
    return;
  }

  try {
    if (getAuthProvider() === "supabase" && supabaseEnabled()) {
      await supabaseRequest("/auth/v1/user", {
        method: "PUT",
        body: JSON.stringify({ password })
      });
      elements.accountNewPassword.value = "";
      elements.accountSummary.textContent = "Password updated.";
      return;
    }

    elements.accountSummary.textContent = "Password changes are only available with Supabase accounts right now.";
  } catch (error) {
    elements.accountSummary.textContent = error.message;
  }
}

async function deleteAccountData() {
  const confirmed = window.confirm("Delete your MacroDock profile data and log out? This does not remove the Supabase auth user yet.");

  if (!confirmed) {
    return;
  }

  try {
    if (getAuthProvider() === "supabase" && supabaseEnabled() && currentSupabaseUser?.id) {
      await upsertSupabaseProfile({
        userId: currentSupabaseUser.id,
        name: currentSupabaseUser.user_metadata?.name || currentSupabaseUser.email || "",
        account: null,
        theme: getInitialTheme(),
        recentFoods: []
      });
    }
  } catch (error) {
    console.warn("Profile data deletion failed", error);
  }

  localStorage.removeItem("macrodock-account");
  state.foods = [];
  state.workouts = [];
  state.water = 0;
  state.waterByDate = {};
  state.recentFoods = [];
  saveState();
  logout();
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

function dedupeFoodList(list) {
  return list.filter((food, index, allFoods) => allFoods.findIndex((item) => item.name.toLowerCase() === food.name.toLowerCase()) === index);
}

function localFoodMatches(query, source = "all") {
  const baseFoods = source === "history" ? state.recentFoods : dedupeFoodList([...state.recentFoods, ...foods]);
  return baseFoods
    .filter((food) => food.name.toLowerCase().includes(query.toLowerCase()))
    .map((food) => ({ ...food, source: food.source || (source === "history" ? "History" : "Starter") }))
    .slice(0, 12);
}

function foodForHistory(food) {
  return {
    name: food.name,
    calories: Number(food.calories) || 0,
    protein: Number(food.protein) || 0,
    carbs: Number(food.carbs) || 0,
    fat: Number(food.fat) || 0,
    fiber: Number(food.fiber) || 0,
    calcium: Number(food.calcium) || 0,
    iron: Number(food.iron) || 0,
    vitaminC: Number(food.vitaminC) || 0,
    potassium: Number(food.potassium) || 0,
    source: food.source || "Recent"
  };
}

function addRecentFood(food) {
  const nextFood = foodForHistory(food);
  state.recentFoods = [nextFood, ...state.recentFoods.filter((item) => item.name.toLowerCase() !== nextFood.name.toLowerCase())].slice(0, 20);
  saveRecentFoodsPreference();
}

function logFoodToMeal(food, servings = 1) {
  const safeServings = Math.max(Number(servings) || 1, 0.25);
  const loggedFood = { meal: elements.mealSelect.value, servings: safeServings, date: state.diaryDate };

  Object.keys(food).forEach((key) => {
    loggedFood[key] = typeof food[key] === "number" ? food[key] * safeServings : food[key];
  });

  if (editingFoodIndex !== null) {
    state.foods[editingFoodIndex] = loggedFood;
    editingFoodIndex = null;
  } else {
    state.foods.unshift(loggedFood);
  }

  addRecentFood(food);
  render();
  setFoodDialogOpen(false);
}

function foodPerServing(loggedFood) {
  const servings = Math.max(Number(loggedFood.servings) || 1, 0.25);
  const food = { ...loggedFood };

  Object.keys(food).forEach((key) => {
    if (typeof food[key] === "number" && key !== "servings") {
      food[key] = food[key] / servings;
    }
  });

  delete food.meal;
  delete food.servings;
  delete food.date;
  return food;
}

function scaleFood(food, servings) {
  const safeServings = Math.max(Number(servings) || 1, 0.25);
  const scaledFood = {};

  Object.keys(food || {}).forEach((key) => {
    scaledFood[key] = typeof food[key] === "number" ? food[key] * safeServings : food[key];
  });

  return scaledFood;
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
    selectedFood = null;
    elements.foodResults.innerHTML = activeFoodTab === "history"
      ? '<div class="empty-state">No recent foods yet. Logged foods will appear here.</div>'
      : '<div class="empty-state">No foods found. Add a custom food instead.</div>';
    elements.foodResults.dataset.results = "[]";
    if (!isCustomFoodMode) {
      elements.foodSubmitButton.disabled = true;
    }
    return;
  }

  elements.foodSubmitButton.disabled = false;
  elements.foodResults.innerHTML = results
    .map((food, index) => {
      const selectedClass = !isCustomFoodMode && selectedFood?.name === food.name ? " is-selected" : "";
      return `
        <button class="food-result-button${selectedClass}" type="button" data-food-result="${index}">
          <div>
            <strong>${escapeHtml(food.name)}</strong>
            <span>${formatNumber(food.calories)} kcal - ${formatNumber(food.protein)}g protein - ${formatNumber(food.carbs)}g carbs - ${formatNumber(food.fat)}g fat</span>
          </div>
          <span class="food-add-circle" aria-hidden="true">${selectedClass ? "✓" : "›"}</span>
        </button>
      `;
    })
    .join("");

  elements.foodResults.dataset.results = JSON.stringify(results);
}

function renderSelectedFoodDetail() {
  if (!elements.selectedFoodName || !elements.selectedFoodMacros || !selectedFood) {
    return;
  }

  const servings = Math.max(Number(elements.servingSize.value) || 1, 0.25);
  const scaledFood = scaleFood(selectedFood, servings);
  const calories = Math.max(Number(scaledFood.calories) || 0, 0);
  const protein = Math.max(Number(scaledFood.protein) || 0, 0);
  const carbs = Math.max(Number(scaledFood.carbs) || 0, 0);
  const fat = Math.max(Number(scaledFood.fat) || 0, 0);
  const calorieGoal = getCalorieGoal() || 0;
  const macroGoals = getMacroGoals();
  const caloriePercent = calorieGoal ? Math.round((calories / calorieGoal) * 100) : 0;
  const carbPercent = macroGoals.carbs ? Math.round((carbs / macroGoals.carbs) * 100) : 0;
  const fatPercent = macroGoals.fat ? Math.round((fat / macroGoals.fat) * 100) : 0;
  const proteinPercent = macroGoals.protein ? Math.round((protein / macroGoals.protein) * 100) : 0;
  elements.selectedFoodName.textContent = selectedFood.name || "Food";
  elements.selectedFoodMacros.innerHTML = `
    <div class="selected-calorie-card"><span>${caloriePercent}%</span><strong>${formatNumber(calories)} kcal</strong><small>Calories</small></div>
    <div><span>${carbPercent}%</span><strong>${formatNumber(carbs)}g</strong><small>Carbs</small></div>
    <div><span>${fatPercent}%</span><strong>${formatNumber(fat)}g</strong><small>Fat</small></div>
    <div><span>${proteinPercent}%</span><strong>${formatNumber(protein)}g</strong><small>Protein</small></div>
  `;
}

function setFoodDetailView(isDetail) {
  elements.foodSearchView.hidden = isDetail;
  elements.foodDetailView.hidden = !isDetail;
  elements.useCustomFood.hidden = isDetail && !isCustomFoodMode;
  elements.foodSubmitButton.hidden = !isDetail && !isCustomFoodMode;

  if (isDetail) {
    renderSelectedFoodDetail();
  }
}

function resetFoodDetailView() {
  elements.foodSearchView.hidden = false;
  elements.foodDetailView.hidden = true;
  elements.useCustomFood.hidden = false;
  elements.foodSubmitButton.hidden = true;
}

function selectFoodResult(food) {
  selectedFood = food;
  isCustomFoodMode = false;
  elements.foodForm.classList.remove("is-custom-mode");
  elements.customFoodFields.hidden = true;
  elements.useCustomFood.textContent = "Add custom food";
  elements.foodSubmitButton.textContent = editingFoodIndex === null ? "Log selected food" : "Save food";
  elements.foodSubmitButton.disabled = false;
  elements.foodSubmitButton.hidden = false;
  elements.foodSearchStatus.textContent = `${food.name} selected.`;
  setFoodDetailView(true);

  const results = JSON.parse(elements.foodResults.dataset.results || "[]");
  renderFoodResults(results.length ? results : [food]);
}

function renderFoodSearch() {
  if (!elements.foodResults) {
    return;
  }

  const query = elements.foodSearch.value.trim();
  const source = activeFoodTab === "history" ? "history" : "all";

  if (query.length < 2) {
    const starterFoods = localFoodMatches("", source);
    selectedFood = null;
    elements.foodSearchStatus.textContent = activeFoodTab === "history" ? "History" : "All foods";
    renderFoodResults(starterFoods);
    return;
  }

  latestFoodSearchToken++;
  const localResults = localFoodMatches(query, source);

  selectedFood = null;
  elements.foodSearchStatus.textContent = localResults.length ? "Showing local matches." : "No local matches. Add a custom food instead.";
  renderFoodResults(localResults);
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
          <div class="meal-food-row" data-food-edit="${item.globalIndex}">
            <button class="meal-food-main" type="button" aria-label="Edit serving for ${escapeHtml(item.name)}">
              <strong>${escapeHtml(item.name)}</strong>
              <span>${item.servings} serving · ${formatNumber(item.calories)} kcal</span>
            </button>
            <div class="meal-row-actions">
              <button class="delete-button" type="button" data-food-index="${item.globalIndex}" aria-label="Remove ${escapeHtml(item.name)}">&times;</button>
            </div>
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

function animateCaloriePercent(targetPercent) {
  const startPercent = caloriePercentDisplay;
  const diff = targetPercent - startPercent;
  const startTime = performance.now();
  const duration = 650;
  const ringWrap = elements.caloriePercent?.closest(".ring-wrap");

  if (caloriePercentFrame) {
    cancelAnimationFrame(caloriePercentFrame);
  }

  ringWrap?.classList.add("is-animating");

  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    caloriePercentDisplay = startPercent + diff * eased;

    elements.caloriePercent.textContent = `${Math.round(caloriePercentDisplay)}%`;

    if (progress < 1) {
      caloriePercentFrame = requestAnimationFrame(tick);
      return;
    }

    caloriePercentDisplay = targetPercent;
    elements.caloriePercent.textContent = `${targetPercent}%`;
    ringWrap?.classList.remove("is-animating");
    caloriePercentFrame = null;
  }

  caloriePercentFrame = requestAnimationFrame(tick);
}

function renderDashboard() {
  const foodTotals = totalsFromFood();
  const workoutTotals = totalsFromWorkouts();
  const calorieGoal = getCalorieGoal();
  if (!calorieGoal) {
    elements.remainingCalories.textContent = "Set goal";
    elements.consumedCalories.textContent = formatNumber(foodTotals.calories);
    elements.burnedCalories.textContent = formatNumber(workoutTotals.calories);
    elements.calorieRing.style.strokeDashoffset = 314;
    animateCaloriePercent(0);
    elements.waterCount.textContent = waterForDiary();
    elements.activeMinutes.textContent = `${workoutTotals.minutes} min`;
    elements.activityBar.style.width = `${Math.min((workoutTotals.minutes / 45) * 100, 100)}%`;
    renderTargetSummary();
    syncDiaryDateUi();
    return;
  }
  const netCalories = Math.max(foodTotals.calories - workoutTotals.calories, 0);
  const remaining = calorieGoal - netCalories;
  const calorieProgress = Math.min(netCalories / calorieGoal, 1);
  const circumference = 314;

  elements.remainingCalories.textContent = formatNumber(remaining);
  elements.consumedCalories.textContent = formatNumber(foodTotals.calories);
  elements.burnedCalories.textContent = formatNumber(workoutTotals.calories);
  elements.calorieRing.style.strokeDashoffset = circumference - calorieProgress * circumference;
  animateCaloriePercent(Math.round(calorieProgress * 100));
  elements.waterCount.textContent = waterForDiary();
  elements.activeMinutes.textContent = `${workoutTotals.minutes} min`;
  elements.activityBar.style.width = `${Math.min((workoutTotals.minutes / 45) * 100, 100)}%`;
  renderTargetSummary();

  const macroGoals = getMacroGoals();

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

function setCustomFoodMode(isCustom, shouldFocus = true) {
  isCustomFoodMode = isCustom;
  elements.foodForm.classList.toggle("is-custom-mode", isCustom);
  elements.customFoodFields.hidden = !isCustom;
  elements.useCustomFood.textContent = isCustom ? "Use starter foods" : "Add custom food";
  elements.foodSubmitButton.textContent = editingFoodIndex === null
    ? isCustom ? "Log custom food" : "Log selected food"
    : "Save food";
  elements.foodSubmitButton.disabled = false;
  elements.foodSubmitButton.hidden = false;

  if (isCustom) {
    elements.foodSearchStatus.textContent = "Enter the nutrition details for your custom food.";
    elements.foodSearchView.hidden = true;
    elements.foodDetailView.hidden = false;
    elements.useCustomFood.hidden = false;
    selectedFood = customFoodFromForm();
    renderSelectedFoodDetail();
  } else {
    resetFoodDetailView();
    renderFoodSearch();
  }

  if (!shouldFocus) {
    return;
  }

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
    if (editingFoodIndex === null) {
      elements.foodSearch.value = "";
      elements.servingSize.value = "1";
      elements.mealSelect.disabled = false;
      activeFoodTab = "all";
      elements.foodTabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.foodTab === activeFoodTab));
      latestFoodSearchToken++;
      resetCustomFoodFields();
      resetFoodDetailView();
      setCustomFoodMode(false, false);
    }
  } else {
    editingFoodIndex = null;
    isCustomFoodMode = false;
    selectedFood = null;
    elements.foodForm.classList.remove("is-custom-mode", "is-serving-edit");
    elements.mealSelect.disabled = false;
    elements.useCustomFood.hidden = false;
    elements.useCustomFood.textContent = "Add custom food";
    elements.foodSubmitButton.textContent = "Log selected food";
    elements.foodSubmitButton.hidden = true;
    if (elements.dashboardDateButton) {
      elements.dashboardDateButton.focus();
    }
  }
}

function resetCustomFoodFields() {
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
}

function populateCustomFoodFields(food) {
  elements.customFoodName.value = food.name || "";
  elements.customCalories.value = Number(food.calories) || 0;
  elements.customProtein.value = Number(food.protein) || 0;
  elements.customCarbs.value = Number(food.carbs) || 0;
  elements.customFat.value = Number(food.fat) || 0;
  elements.customFiber.value = Number(food.fiber) || 0;
  elements.customCalcium.value = Number(food.calcium) || 0;
  elements.customIron.value = Number(food.iron) || 0;
  elements.customVitaminC.value = Number(food.vitaminC) || 0;
  elements.customPotassium.value = Number(food.potassium) || 0;
}

function editLoggedFood(index) {
  const loggedFood = state.foods[Number(index)];

  if (!loggedFood) {
    return;
  }

  editingFoodIndex = Number(index);
  selectedFood = foodPerServing(loggedFood);
  isCustomFoodMode = false;
  elements.mealSelect.value = loggedFood.meal || "Breakfast";
  elements.mealSelect.disabled = false;
  elements.servingSize.value = loggedFood.servings || 1;
  elements.foodSearch.value = loggedFood.name || "";
  setFoodDialogOpen(true);
  elements.foodForm.classList.remove("is-custom-mode");
  elements.foodForm.classList.add("is-serving-edit");
  elements.customFoodFields.hidden = true;
  elements.useCustomFood.hidden = true;
  elements.foodSubmitButton.hidden = false;
  setFoodDetailView(true);
  elements.foodSearchStatus.textContent = "Editing serving size.";
  elements.foodSubmitButton.textContent = "Save food";
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
  if (!food) {
    elements.foodSearchStatus.textContent = "Select a food or add a custom food first.";
    return;
  }
  const servings = Math.max(Number(elements.servingSize.value), 0.25);
  const foodToLog = isCustomFoodMode ? { ...food, source: "Custom" } : food;
  logFoodToMeal(foodToLog, servings);
  elements.servingSize.value = "1";
  resetCustomFoodFields();
});
}

if (elements.servingSize) {
  elements.servingSize.addEventListener("input", renderSelectedFoodDetail);
}

if (elements.customFoodFields) {
  elements.customFoodFields.addEventListener("input", () => {
    if (!isCustomFoodMode) {
      return;
    }

    selectedFood = customFoodFromForm();
    renderSelectedFoodDetail();
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
    elements.foodForm.classList.remove("is-custom-mode");
    elements.foodResults.hidden = false;
    elements.customFoodFields.hidden = true;
    elements.useCustomFood.textContent = "Add custom food";
    clearTimeout(foodSearchTimer);
    foodSearchTimer = setTimeout(renderFoodSearch, 350);
  });
}

elements.foodTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    activeFoodTab = tab.dataset.foodTab || "all";
    elements.foodTabs.forEach((item) => item.classList.toggle("is-active", item === tab));
    isCustomFoodMode = false;
    elements.foodForm.classList.remove("is-custom-mode");
    elements.customFoodFields.hidden = true;
    elements.foodResults.hidden = false;
    elements.useCustomFood.textContent = "Add custom food";
    renderFoodSearch();
  });
});

if (elements.foodResults) {
  elements.foodResults.addEventListener("click", (event) => {
    const resultButton = event.target.closest("[data-food-result]");

    if (!resultButton) {
      return;
    }

    const results = JSON.parse(elements.foodResults.dataset.results || "[]");
    selectedFood = results[Number(resultButton.dataset.foodResult)] || selectedFood;
    selectFoodResult(selectedFood);
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
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme, { sync: true });
});
}

function setSettingsSectionOpen(targetId, isOpen) {
  const target = targetId ? document.getElementById(targetId) : null;
  const toggle = targetId ? document.querySelector(`[data-settings-toggle="${targetId}"]`) : null;

  if (!target || !toggle) {
    return;
  }

  toggle.setAttribute("aria-expanded", String(isOpen));
  target.hidden = !isOpen;
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

if (elements.changePasswordButton) {
  elements.changePasswordButton.addEventListener("click", changePassword);
}

if (elements.deleteAccountButton) {
  elements.deleteAccountButton.addEventListener("click", deleteAccountData);
}

if (elements.settingsLogoutButton) {
  elements.settingsLogoutButton.addEventListener("click", logout);
}

if (elements.currentGoal) {
  elements.currentGoal.addEventListener("change", syncWeeklyRateControl);
}

document.querySelectorAll("[data-settings-toggle]").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const targetId = toggle.getAttribute("data-settings-toggle");
    const isExpanded = toggle.getAttribute("aria-expanded") === "true";
    setSettingsSectionOpen(targetId, !isExpanded);
  });
});

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
  const foodEditButton = event.target.closest("[data-food-edit]");
  const foodDeleteButton = event.target.closest("[data-food-index]");
  const workoutDeleteButton = event.target.closest("[data-workout-index]");

  if (foodDeleteButton) {
    state.foods.splice(Number(foodDeleteButton.dataset.foodIndex), 1);
    render();
    return;
  }

  if (workoutDeleteButton) {
    state.workouts.splice(Number(workoutDeleteButton.dataset.workoutIndex), 1);
    render();
    return;
  }

  if (foodEditButton) {
    editLoggedFood(foodEditButton.dataset.foodEdit);
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
    return pathOnly === "" || pathOnly === "index.html" || pathOnly.endsWith("/index.html");
  }

  return false;
}

function syncNavActive() {
  const page = navPageKey();
  let activeIndex = 0;
  document.querySelectorAll(".nav-item").forEach((link) => {
    const href = link.getAttribute("href") || "";
    const isActive = hrefMatchesNavPage(page, href);
    link.classList.toggle("active", isActive);
    if (isActive) {
      activeIndex = Array.from(link.parentElement.children).indexOf(link);
    }
  });
  document.querySelectorAll(".nav-list").forEach((nav) => {
    nav.style.setProperty("--active-tab-index", String(Math.max(activeIndex, 0)));
    window.requestAnimationFrame(() => {
      nav.classList.add("is-ready");
    });
  });
}

document.querySelectorAll(".nav-item").forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href") || "";
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const nextPath = href.split("#")[0].replace(/^\.\//, "") || currentPath;
    const isSamePage = href.startsWith("#") || nextPath === currentPath;

    if (isSamePage) {
      event.preventDefault();
      return;
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

function renderCurrentPageFromCache() {
  restoreAuthStateOwner();
  applyStoredPreferences();
  renderAccountSettings();
  renderTargetSummary();

  if (elements.foodSearch) {
    renderFoodSearch();
    render();
    watchDateRollover();
  }

  if (navPageKey() === "home") {
    window.requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      document.body.classList.remove("is-hydrating");
    });
  }
}

async function initializeApp() {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  if (isAuthPage()) {
    window.setTimeout(() => document.body.classList.remove("is-loading"), 700);
  }

  const runtimeConfigPromise = loadRuntimeConfig();
  applyTheme(getInitialTheme());
  applyAccentColor(localStorage.getItem("macrodock-accent") || accountPreferences().accentColor);
  renderFoodApiSettings();

  if (isAuthPage()) {
    renderAccountSettings();
    renderTargetSummary();
    setAuthMode("login");

    if (getAuthToken()) {
      await runtimeConfigPromise;
      const account = await loadRemoteAccount();
      if (getAuthToken()) {
        if (!account) {
          redirectToMetricsSetup();
          return;
        }
        redirectAfterAuth();
      }
    }

    return;
  }

  if (isProtectedPage() && !getAuthToken()) {
    redirectToAuth();
    return;
  }

  if (redirectOnboardingUserWithAccount()) {
    return;
  }

  renderCurrentPageFromCache();

  runtimeConfigPromise
    .then(() => loadRemoteAccount())
    .then((account) => {
      if (isProtectedPage() && !getAuthToken()) {
        redirectToAuth();
        return;
      }

      redirectAuthenticatedUserWithoutAccount(account);
    })
    .catch((error) => {
      console.warn("Background account refresh failed", error);
    });
}

initializeApp();
