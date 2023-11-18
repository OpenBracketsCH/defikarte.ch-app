# Build a production/preview ready app local

## Build new release

make a build for all plattforms

```cli
eas build --profile preview --platform all --local
```

make a build for ios

```cli
eas build --profile preview --platform ios --local
```

make a build for android

```cli
eas build --profile preview --platform android --local
```

### change version

In app.json change the following values to the actual build number.

`"version": "1.0.20"`

`"buildNumber": "1.0.20"`

`"versionCode": 20`
