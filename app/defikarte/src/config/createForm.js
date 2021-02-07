import opening_hours from 'opening_hours';

const openingHoursValidation = value => {
  let valid = false;
  try {
    let oh = new opening_hours(value);
    valid = true;
  } catch (error) {
    valid = false;
  }

  return value == '' || valid;
}

export default [
  {
    name: 'reporter',
    rules: { required: true },
    type: 'Text',
    label: 'Melder',
    placeholder: 'Max Mustermann',
    defaultValue: '',
    errorMsg: 'Der Melder wird benötigt',
  },
  {
    name: 'location',
    rules: { required: true, maxLength: 200 },
    type: 'Text',
    label: 'Standort',
    placeholder: 'Schulhaus Zürich West, neben Eingang',
    defaultValue: '',
    errorMsg: 'Der Standort wird benötigt, maximale Länge 200 Zeichen',
  },
  {
    name: 'description',
    rules: { required: false, maxLength: 200 },
    type: 'Text',
    label: 'Beschreibung',
    placeholder: 'z.B.: während Öffnungszeiten verfügbar',
    defaultValue: '',
    multiline: true,
    errorMsg: 'Die maximale Länge beträgt 200 Zeichen',
  },
  /* not required 
  es gibt diverse opening Hour validation tools. problem: es gibt sehr viele kombinationen,
  automatische opening hours validation wäre gut: https://wiki.openstreetmap.org/wiki/Key:opening_hours#Implementation*/
  {
    name: 'openingHours',
    rules: { validate: openingHoursValidation },
    type: 'Text',
    label: 'Öffnungszeiten',
    placeholder: 'Mo-Fr: 08:00-17:00',
    defaultValue: '24/7',
    useSwitch: true,
    multiline: true,
    errorMsg: 'Die eingegebenen Öffnungzeiten entsprechen nicht dem geforderten Format.',
  },
  {
    name: 'operator',
    rules: { required: false },
    type: 'Text',
    label: 'Betreiber',
    placeholder: 'Gemeinde, Verein, Privatperson',
    defaultValue: '',
  },
  {
    name: 'operatorPhone',
    rules: { pattern: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/ },
    type: 'Text',
    label: 'Telefon',
    placeholder: '+41 79 000 00 00',
    keyboardType: 'phone-pad',
    defaultValue: '',
    errorMsg: 'Der Wert muss eine gültige Telefonummer sein',
  },
  {
    name: 'access',
    type: 'Switch',
    label: 'Zugänglich',
    defaultValue: false,
  },
  {
    name: 'indoor',
    type: 'Switch',
    label: 'Im Gebäude',
    defaultValue: false,
  },
]