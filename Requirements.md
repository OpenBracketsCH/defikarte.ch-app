# Requirements

This document describes the requirements for the Defikarte.ch app. These are the basis for further processing.

## Basics

The website defikarte.ch with the data from OpenStreetMap serves as the basis for creating this app. The website was designed by Christian Nüssli.
The basic map and its symbols were developed and made available by the Swiss OpenStreetMap Association with the uMap web map. uMap is available on Github with the OpenSource license.

## Data

The data comes directly from OpenStreetMap and is subject to the copyright of the OSM community.
There are no rights to this data.
The data is extracted from OpenStreetMap via the Overpass API. This can also be solved differently in the app and is the responsibility of the provider.

## Technical requirements

### Platforms

* Android (latest two versions)
* iOS (latest two versions)

## Functional requirements

* Show defibrillators from OpenStreetMap on a map (it would be nice if this also insisted on OpenStreetMap or Mapbox)
* Localization in the app to show surrounding defis
* Routing to the next best Defi (map and list view)
* Possibility to report a new defibrillator
  * report on a mail form
  * report directly to the API (more below)
* Upload function directly to OSM (via API)
  * more Information here [OSM API](https://wiki.openstreetmap.org/wiki/API)
  * with predefined fields and OSMTypeMapping
* Upload photos and directly make a Wikidata entry in order to be able to retrieve photos on the website
* Quality assurance and approval by the app owner (backend or app)

### Framework proposals

* Xamarin
One proposal of Patricia is the Xamarin Framework
https://dotnet.microsoft.com/apps/xamarin

* React Native (selected)
One proposal of Marc is the React Native Framework
https://reactnative.dev/

## Addition

Detailed requirements can then be worked out with the project team when the project is implemented. An expansion of the app is conceivable.