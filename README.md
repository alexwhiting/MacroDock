# MacroDock

Mobile-first nutrition and fitness prototype.

## Run locally

```bash
npm start
```

Open:

```text
http://localhost:8787
```

The backend serves the app and exposes:

```text
GET /api/foods/search?q=apple
```

## Food Search

The app searches the MacroDock backend first. The backend:

- searches common seeded foods immediately
- searches cached USDA results
- calls USDA FoodData Central server-side when available
- caches successful USDA results in `data/food-cache.json`

For better USDA limits, start the server with:

```bash
USDA_API_KEY=your_key_here npm start
```

## Account Calorie Target

Settings includes a local account/profile form. It calculates:

- BMR using the provided male/female formulas
- TDEE using the selected activity factor
- daily calorie target using target weight and goal date

The goal-date adjustment uses roughly 7,700 kcal per kg of body weight change.

## iPhone Testing

Run `npm start`, find your Mac local IP address, then open this on your iPhone:

```text
http://YOUR_MAC_IP:8787
```
