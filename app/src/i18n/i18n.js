import i18n from 'i18next';

//empty for now
const resources = {
  de: {
    translation: {
      yes: 'Ja',
      no: 'Nein',
      private: 'Privat',
      permissive: 'Eingeschränkt zugänglich',
    },
  },
};

i18n.init({
  compatibilityJSON: 'v3',
  resources,
  //language to use if translations in user language are not available
  fallbackLng: 'de',
  interpolation: {
    escapeValue: false, // not needed for react!!
  },
  defaultNS: 'translation',
});

export default i18n;
