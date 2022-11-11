# Update process

## Build new release

make a build for all plattforms

```cli
eas build --platform all
```

make a build for ios

```cli
eas build --platform ios
```

make a build for android

```cli
eas build --platform android
```

select a different environment (prod)

```cli
eas build --profile production
```

select a different environment (staging)

```cli
eas build --profile staging
```

### change version

In app.json change the following values to the actual build number.

 `"version": "1.0.20"`

 `"buildNumber": "1.0.20"`

`"versionCode": 20`
