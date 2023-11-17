[![Build iOS & Android](https://github.com/chnuessli/defikarte.ch-app/actions/workflows/app-deployment.yml/badge.svg)](https://github.com/chnuessli/defikarte.ch-app/actions/workflows/app-deployment.yml)
![Defikarte-Backend](https://github.com/chnuessli/defikarte.ch-app/workflows/Defikarte-Backend/badge.svg?branch=main)

# Defikarte.ch - die App

<img src="./app/assets/logo_defikarte.png" alt="defikarte.ch" style="height:150px"/>

This Page is also available in English, please visit: [English 👈🏻](README_en.md)

## Zweck der App

Diese App sollte helfen, den nächsten Defibrillator in der näheren Umgebung zu finden. Dies um möglichst rasch, einer Person in Not oder einer Reanimation helfen zu können.Die Daten sind komplett Open Source und kommen von OpenStreetMap. Mit Hilfe der App sollte jede Person zum nächst besten Defi navigiert werden über die Navigations-App des jeweiligen Handys.

Die Daten basieren alle auf OpenStreetMap, also kann jeder mithelfen die App zu verbessern. Dies geht direkt in der App. Ein Defibrillator kann via App gemeldet werden und steht dann wieder allen zu Verfügung.

Die App ist ein Projekt von [Defikarte.ch](https://www.defikarte.ch) und soll helfen, Defibrillatoren in der ganzen Schweiz zu erfassen und zu visualisieren.

**Die Karte ist bei weitem noch nicht vollständig, die App und die Karte sollen helfen, diesen Datenbestand zu verbessern.**

### App-Stores

Die App zu Defikarte.ch findet man in den Stores des jeweiligen Anbieters.

<div style="display:flex; gap:20px; align-items:start;">
<a href="https://apps.apple.com/ch/app/defikarte-ch/id1549569525?itsct=apps_box_badge&amp;itscg=30200" style="display: inline-block; overflow: hidden; border-radius: 10px; width: 150px; height: 50px;"><img src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/de-de?size=250x83&amp;releaseDate=1613952000" alt="Download on the App Store" style="border-radius: 10px; width: 150px; height: 50px;"></a>

<a style="display: inline-block; overflow: hidden;margin:-6px;" href='https://play.google.com/store/apps/details?id=ch.defikarte.app'><img style="height:63px;" alt='Jetzt bei Google Play' src='https://play.google.com/intl/de_de/badges/static/images/badges/de_badge_web_generic.png'/></a>

</div>

## Entwicklung

Zur Entwicklung der Mobile-App (Android & iOS) wird [React Native](https://reactnative.dev/) und [Expo](https://expo.io) verwendet. Das Backend (REST-API) ist mit .Net (c#) und [Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/functions-overview) implementiert.

### Getting started Mobile-App (React Native):

Entwicklungsumgebung & Tools:

- Node.js Version >=18 & npm
- VS Code
- ExpoGO für Android oder iOS (Simulatoren können verwendet werden)

Starten der Entwicklungsumgebung (App/React Native)

- `cd app`
- .env-File mit nötigen Environment-Variablen app-Verzeichnis anlegen (siehe .env.template)
- `npm install` und danach `npx expo start` ausführen (startet die Expo-App)
- Scanne den QR-Code in der Konsole mit dem Entwicklungsgerät => ExpoGO-App startet

### Getting started Backend (.Net/Azure Functions):

Enticklungsumgbeung & Tools:

- x86-Umgebung (Apple Silicon wird aktuell nicht untersützt)
- .Net 6
- Visual Studio oder Visual Studio Code inkl. Azure Function Core Tools
- Postman (empfohlen)

Starten der Entwicklungsumgebung (Backend / Azure Functions)

- `cd backend`
- DefikarteBackend.sln mit Visual Studio / Order in VS Code öffnen
- local.settings.json hinzufügen (wird für Storage emulation benötigt)
- In Visual Studio debugging starten / `dotnet run`
- Mit Postman http-requests ausführen (siehe Console für locale Ports)

## Mitmachen

Wir sind immer auf der Suche nach motivierten, offenen Mitwirkenden die unser Projekt unterstützen wollen. Löse ein Issue, erfasse ein Issue oder entwickle ein neues Feature!

### Mitwirkende

<a href="https://github.com/chnuessli/defikarte.ch-app/graphs/contributors">
  <img src="https://contributors-img.web.app/image?repo=chnuessli/defikarte.ch-app" />
</a>

## Sponsoren

Bitte lies [SPONSORING.md](SPONSORING.md)

### Platin Sponsoren

- [Procamed](https://www.procamed.ch)
- [Lifetec](https://www.lifetec.ch)

### Gold Sponsoren

- [First-Responder.ch](https://www.procamed.ch)

### Logo Sponsoren

- [Hexagon](http://www.hexagonsi.com)
- [Hostpoint](http://www.hostpoint.ch)
- [WC Guide](https://www.wc-guide.com)
- [SIRMED](https://www.sirmed.ch)

[Werde zum Sponsor](https://github.com/sponsors/chnuessli)
