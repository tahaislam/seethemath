# Publishing SeeTheMath to Google Play (first-time guide)

This is a step-by-step path for a first-time publisher. SeeTheMath is a **children's
educational app that collects no data**, which keeps compliance simple.

## 0. One-time setup

- **Google Play Console account** — register at <https://play.google.com/console>
  (one-time **US$25** fee). Use the developer account that will own the app.
- **Expo account + EAS CLI** — `npm i -g eas-cli`, then `eas login`. EAS builds the
  Android app in the cloud (no Android Studio needed).
- Confirm the **Android package id** in `app.json` → `android.package`
  (currently `com.islamtaha.seethemath`). ⚠️ This is **permanent** once published —
  change it now if you want a different one.

## 1. Build the Android app bundle

```bash
eas build:configure        # first time only; links the project to EAS
eas build -p android --profile production
```

This produces an **`.aab`** (Android App Bundle). **Play App Signing** is the default —
Google manages the signing key, EAS uploads the bundle. The `preview` profile in
`eas.json` builds an installable `.apk` instead if you just want to sideload and test:

```bash
eas build -p android --profile preview
```

## 2. Create the app in Play Console

In Play Console → **Create app**:

- App name: **SeeTheMath**
- Default language, **App** (not game), **Free**.
- Accept the developer program policies + US export laws.

## 3. Store listing assets (already generated in `assets/`)

- **App icon:** `assets/play-store-icon.png` (512×512).
- **Feature graphic:** 1024×500 — *still to design* (a simple ∑ on the brand green
  `#2d6a4f` with the tagline works).
- **Screenshots:** 2–8 phone screenshots. Capture from the running app
  (`npm start` → Android, or a device build) — e.g. the home page, the fractions area
  model, and the tax-bracket stepper.
- **Short description** (≤80 chars): *Visual, interactive math for grades 6–9 — see the math, get the math.*
- **Full description:** adapt the README intro + topic list.

## 4. Required declarations (do these before submitting)

- **Privacy policy URL** — point to the deployed site's `/privacy` page
  (e.g. `https://<your-domain>/privacy`). The policy lives in `app/privacy.jsx`.
- **Data safety form** → declare **no data collected, no data shared**.
- **Content rating** (IARC questionnaire) → answer honestly; expect **Everyone**.
- **Target audience & content** → include the **under-13** age bands. This places the
  app under Google Play's **Families** policies.
- **Ads** → declare **no ads** (there are none).
- **Designed for Families** (optional) → since the app has zero ads and zero trackers,
  enrolling is low-effort and gives the app a "Teacher approved"/Families eligibility
  path. You can opt in now or later.

## 5. Release

1. Start with the **Internal testing** track (fastest, private — add your own email as a
   tester). Upload the `.aab` from step 1, roll out, and install via the opt-in link.
2. When happy, promote to **Closed testing** → **Production**.
3. The first Production review for a new account/children's app can take several days.

## Updating later

Bump the version and rebuild:

```bash
# app.json -> expo.version (e.g. 2.0.1). eas.json autoIncrements the build number.
eas build -p android --profile production
eas submit -p android   # uploads the latest build to Play (after configuring submit creds)
```

## Quick reference

| Item | Value |
|---|---|
| Package id | `com.islamtaha.seethemath` |
| Signing | Play App Signing (Google-managed) |
| Data collected | None |
| Ads / trackers | None |
| Target age | Includes under-13 (Families) |
| Privacy policy | `/privacy` on the deployed website |
