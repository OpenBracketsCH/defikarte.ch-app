# Defikarte.ch - the App

<img src="./app/assets/logo_defikarte.png" alt="defikarte.ch" style="height:150px"/>

## Purpose of the app

This app should help to find the next defibrillator in the vicinity. This to help a person in need or reanimation as quickly as possible.The data are completely open source and come from OpenStreetMap. With the help of the app, each person should be navigated to the next best defi via the navigation app of the respective cell phone.

The data are all based on OpenStreetMap, so everyone can help to improve the app. This goes directly in the app. A defibrillator can be reported via app and is then available to all.

The app is a project by [Defikarte.ch](https://www.defikarte.ch) and is intended to help capture and visualize defibrillators throughout Switzerland.

**The map is far from complete, the app and the map should help to improve this data base. **

### App-Stores

The App is available in the Appstores.

<div style="display:flex; gap:20px; align-items:start;">
<a href="https://apps.apple.com/ch/app/defikarte-ch/id1549569525?itsct=apps_box_badge&amp;itscg=30200" style="display: inline-block; overflow: hidden; border-radius: 10px; width: 150px; height: 50px;"><img src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83&amp;releaseDate=1613952000" alt="Download on the App Store" style="border-radius: 10px; width: 150px; height: 50px;"></a>

<a style="display: inline-block; overflow: hidden;margin:-6px;" href='https://play.google.com/store/apps/details?id=ch.defikarte.app'><img style="height:63px;" alt='Jetzt bei Google Play' src='https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png'/></a>

</div>

## Development

The mobile-app (android & iOS) is developed using [React Native](https://reactnative.dev/) and [Expo](https://expo.io). The backend (REST-API) ist implemented in .Net using [Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/functions-overview).

### Getting started Mobile-App (React Native):

IDE & Tools:

- Node.js Version >=18 & npm
- VS Code
- ExpoGO für Android oder iOS (emulators are supported)

Starting the development environment (App/React Native).
- `cd app`
- Create .env-File according to .env.template
- Execute `npm install` && `npx expo start` (starts the Expo-App)
- Scn the QR-Code displayed in the console => ExpoGO-App starts

### Getting started Backend (.Net/Azure Functions):
IDE & Tools
- x86-environment (Apple Silicon is not yet supported)
- .Net 6
- Visual Studio or Visual Studio Code incl. Azure Function Core Tools
- Postman (recommended)

Starting the development environment (Backend / Azure Functions).

- `cd backend`
- Open DeficarteBackend.sln with Visual Studio
- add local.settings.json (needed for storage emulation)
- Start debugging in Visual Studio / `dotnet run`
- Execute http-requests with Postman (see console for local ports)

## Contribute

We are looking for motivated contributors that help us, to make the app better. Solve or create an issue, develope new features.

### Contributors

<a href="https://github.com/chnuessli/defikarte.ch-app/graphs/contributors">
  <img src="https://contributors-img.web.app/image?repo=chnuessli/defikarte.ch-app" />
</a>

## Sponsors

Please read [SPONSORING.md](SPONSORING.md)

### Platin Sponsor

- [Procamed](https://www.procamed.ch)
- [Lifetec](https://www.lifetec.ch)

### Gold Sponsors

- [First-Responder.ch](https://www.procamed.ch)

### Logo Sponsors

- [Hexagon](http://www.hexagonsi.com)
- [Hostpoint](http://www.hostpoint.ch)
- [WC Guide](https://www.wc-guide.com)
- [SIRMED](https://www.sirmed.ch)

[Become a Sponsor](https://github.com/sponsors/chnuessli)
