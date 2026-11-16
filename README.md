# AppRunmate

Native Android and iPhone running-companion foundation using React Native, TypeScript and Expo.

## Implemented
- Discover sample runners by area, pace, distance and availability.
- Demo invitations, cancellation and hidden profiles.
- Discover / My runs / About screens with explicit demo disclosure.
- Node development-container setup and dependency bootstrap.
- Domain tests, strict TypeScript and Android/iOS bundle checks in GitHub Actions.
- Disabled-by-default manual Expo native preview workflow.

**Not a production service:** no real accounts, backend, chat, live runner directory, GPS tracking or confirmed bookings exist yet. Demo activity resets on restart. No persistent AI workers or paid services are active.

## Development environment
Open this repository in VS Code Dev Containers or create a GitHub Codespace. The configuration installs Node 22 dependencies and runs checks using npm run setup.
A Codespace has not been provisioned by this commit; GitHub may charge for usage beyond your allowance.
The Linux container supports editing, testing and Metro. It has no Android emulator or macOS/Xcode.
For local development use Node 22.14+ and run:
```sh
npm run setup
npm start
```
Run npm run android with an Android SDK-equipped workstation, or npm run ios on macOS with Xcode. These create development clients. The app targets native mobile, not a static website.

## Verify
```sh
npm test
npm run typecheck
npx expo install --check
npm run bundle:android
npm run bundle:ios
```
Read actual GitHub Actions results for verification. Export checks produce JavaScript bundles, not installable APK/IPA files.
Versions follow Expo's official SDK 55 template, an explicit baseline rather than a claim to be latest. Review support before store submission.
Before a generated package-lock.json is committed, dependency resolution is not fully reproducible. CI saves the generated lock artifact for review; native preview builds require a committed lock.

## Project documents
- [Product canvas](docs/PRODUCT.md)
- [Environment and deployment](docs/DEPLOYMENT.md)
- [Agent operating model](docs/AUTOMATION.md)
- [Delivery backlog](docs/BACKLOG.md)
