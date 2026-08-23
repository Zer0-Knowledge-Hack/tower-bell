# Build Towerbell APK (Android)

Profile `preview` in `eas.json` outputs a downloadable **APK**.

## Cloud (recommended)

```bash
cd frontend
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

Or: `npm run apk` after `eas login`.

Download the `.apk` from the Expo dashboard when the build finishes.

## Local (needs Android SDK)

```bash
cd frontend
npx expo prebuild -p android
cd android
.\gradlew.assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

No Google Maps API key required (OpenStreetMap).
