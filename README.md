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

The app currently uses local starter foods and each user's recent food history. The backend:

- searches common seeded foods immediately
- searches Open Food Facts for broader packaged/branded foods
- caches API results locally after they are found
- can optionally use USDA FoodData Central as a fallback when `FDC_API_KEY` is configured
- supports custom foods from the app UI

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
