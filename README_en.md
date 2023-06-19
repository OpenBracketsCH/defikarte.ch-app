# Defikarte.ch - the App

![Picture](/app/defikarte/assets/icons/appstore.png)

## Purpose of the app

This app should help to find the next defibrillator in the vicinity. This to help a person in need or reanimation as quickly as possible.The data are completely open source and come from OpenStreetMap. With the help of the app, each person should be navigated to the next best defi via the navigation app of the respective cell phone.

The data are all based on OpenStreetMap, so everyone can help to improve the app. This goes directly in the app. A defibrillator can be reported via app and is then available to all.

The app is a project by [Defikarte.ch](https://www.defikarte.ch) and is intended to help capture and visualize defibrillators throughout Switzerland.

**The map is far from complete, the app and the map should help to improve this data base. **

### App-Stores

The App is available in the Appstores.

[![appstore.png](images/appstore.png)](https://apps.apple.com/us/app/defikarte-ch/id1549569525)

[![playstore.png](images/playstore.png)](https://play.google.com/store/apps/details?id=ch.defikarte.app)

## Development
The app is developed using [React Native](https://reactnative.dev/) and [Expo](https://expo.io). The backend API was implemented in .Net using [Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/functions-overview).

System Requirements App (React Native):
* Node.js version >=14
* npm
* VS Code (recommended).
* Andorid or iOS device to download [iOS App](https://apps.apple.com/ch/app/expo-client/id982107779) or [Android App](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=de_CH&gl=US)
* You can also use an iOS or Android simulator (not tested or setup)

Starting the development environment (App/React Native).
* Install expo-cli: `npm install expo-cli -g` (installs expo globally on your device)
* Create .env file with necessary environment variables in the defikarte directory
* First run `npm install` and then run `npm start`
* scan the QR code on the newly opened website with your smartphone / tablet
* Open the link with the Expo app
* Start testing

System Requirements Backend (Azure Functions):
* .Net Core 3.1
* Visual Studio or Visual Studio Code incl. Azure development
* Postman (recommended)

Starting the development environment (Backend / Azure Functions).
* Open DeficarteBackend.sln with Visual Studio
* add local.settings.json (needed for storage emulation)
* Start project
* Execute http-requests with Postman (see console for local ports)

## Contribute

We are looking for motivated contributors that help us, to make the app better. Solve an issue, create an issue, write some new functions.

### Contributors

<a href="https://github.com/chnuessli/defikarte.ch-app/graphs/contributors">
  <img src="https://contributors-img.web.app/image?repo=chnuessli/defikarte.ch-app" />
</a>

## Sponsors

Please read [SPONSORING.md](SPONSORING.md)

### Platin Sponsor

* [Procamed](https://www.procamed.ch)
* [Lifetec](https://www.lifetec.ch)

### Gold Sponsors

* [First-Responder.ch](https://www.procamed.ch)
* [Notfallsicher.ch](https://www.notfallsicher.ch)
* [Säntis Härzstart](https://www.saentis-haerzstart.ch)

### Logo Sponsors

* [Hexagon](http://www.hexagonsi.com)
* [WC Guide](https://www.wc-guide.com)
* [SIRMED](https://www.sirmed.ch)

[Sponsor us](https://github.com/sponsors/chnuessli)
