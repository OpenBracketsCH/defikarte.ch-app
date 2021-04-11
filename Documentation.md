# erweiterte technische Dokumentation

Dieses Dokument beschreibt die erweiterte technische Dokumentation der Defikarten App.

Die App wird mit [React Native](https://reactnative.dev/) und [Expo](https://expo.io) entwickelt. Die Backend-API wurde in .Net mit [Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/functions-overview) implementiert.

## Voraussetzungen

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

## Funktionen

### Einen Defi anlegen



### Defi publizieren mittels OSM API



### Benutzer lokalisieren



## Snippets
