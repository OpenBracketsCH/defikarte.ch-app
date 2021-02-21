![Deploy iOS and Android App (JS only)](https://github.com/chnuessli/defikarte.ch-app/workflows/Deploy%20iOS%20and%20Android%20App%20(JS%20only)/badge.svg?branch=main)
![Defikarte-Backend](https://github.com/chnuessli/defikarte.ch-app/workflows/Defikarte-Backend/badge.svg?branch=main)

# Defikarte.ch - die App

![Picture](app/defikarte/assets/icons/appstore.png)

This Page is also available in English, please visit: [English 👈🏻](README_en.md)

## Zweck der App

Diese App sollte helfen, den nächsten Defibrillator in der näheren Umgebung zu finden. Dies um möglichst rasch, einer Person in Not oder einer Reanimation helfen zu können.Die Daten sind komplett Open Source und kommen von OpenStreetMap. Mit Hilfe der App sollte jede Person zum nächst besten Defi navigiert werden über die Navigations-App des jeweiligen Handys.

Die Daten basieren alle auf OpenStreetMap, also kann jeder mithelfen die App zu verbessern. Dies geht direkt in der App. Ein Defibrillator kann via App gemeldet werden und steht dann wieder allen zu Verfügung.

Die App ist ein Projekt von [Defikarte.ch](https://www.defikarte.ch) und soll helfen, Defibrillatoren in der ganzen Schweiz zu erfassen und zu visualisieren.

**Die Karte ist bei weitem noch nicht vollständig, die App und die Karte sollen helfen, diesen Datenbestand zu verbessern.**

## Entwicklung
Die App wird mit [React Native](https://reactnative.dev/) und [Expo](https://expo.io) entwickelt. Die Backend-API wurde in .Net mit [Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/functions-overview) implementiert.

Systemanforderungen App (React Native):
* Node.js Version >=14
* npm
* VS Code (empfohlen)
* iOS oder Android Gerät zum download der [iOS App](https://apps.apple.com/ch/app/expo-client/id982107779) oder [Android App](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=de_CH&gl=US)
* Alternativ kann auch ein iOS oder Android Simulator zum testen verwendet werden (nicht geprüft oder konfiguriert innerhalb diese Projektes)

Starten der Entwicklungsumgebung (App/React Native)
* Installieren der expo-cli: `npm install expo-cli -g` (installiert expo global auf deinem Gerät)
* .env-File mit nötigen Environment-Variablen defikarte-Verzeichnis anlegen
* Zuerst `npm install` und danach `npm start` ausführen
* Scanne den QR-Code auf der neu geöffneten Website mit deinem Smartphone / Tablet
* Öffne den Link mit der Expo-App
* Beginne zu testen

Systemanforderungen Backend (Azure Functions):
* .Net Core 3.1
* Visual Studio 2019 inkl. Azure Entwicklung
* Postman (empfohlen)

Starten der Entwicklungsumgebung (Backend / Azure Functions)
* DefikarteBackend.sln mit Visual Studio öffnen
* local.settings.json hinzufügen (wird für Storage emulation benötigt)
* Projekt starten
* Mit Postman http-requests ausführen (siehe Console für locale Ports)

## Mitmachen

Wir sind immer auf der Suche nach motivierten, offenen Mitwirkenden die unser Projekt unterstützen wollen. Löse ein Issue, erfasse ein Issue usw.

### Mitwirkende

<a href="https://github.com/chnuessli/defikarte.ch-app/graphs/contributors">
  <img src="https://contributors-img.web.app/image?repo=chnuessli/defikarte.ch-app" />
</a>

## Sponsoren

Bitte lese [SPONSORING.md](SPONSORING.md)

* [Procamed AG](https://www.procamed.ch)
* [Ursula Dombrowsky Gesundheitspraxis](http://www.dombrowsky.ch)
* [Hexagon](http://www.hexagonsi.com)
* [Github-User Malsendif](https://github.com/Malsendif)

[Sponsore uns](https://github.com/sponsors/chnuessli)
