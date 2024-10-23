import { isPossiblePhoneNumber, isValidPhoneNumber, validatePhoneNumberLength } from 'libphonenumber-js';
import opening_hours from 'opening_hours';

const openingHoursErrorsAndWarnings = (value) => {
  let msg = '';
  try {
    const oh = new opening_hours(value);
    const warnings = oh.getWarnings();
    msg = warnings.join(', ');
  } catch (error) {
    msg = 'error_openinghours';
  }

  console.log(msg);

  return msg === '' || value === null || value === '' ? true : msg;
};

const phonenumberValidation = (value) => {
  let valid =
    isPossiblePhoneNumber(value) === true && isValidPhoneNumber(value) === true && validatePhoneNumberLength(value, 'CH') === undefined;

  return value === null || value === '' || valid;
};

export default [
  {
    name: 'reporter',
    rules: { required: true },
    type: 'Text',
    label: 'reporter',
    placeholder: 'placeholder_reporter',
    defaultValue: '',
    errorMsg: 'error_reporter',
  },
  {
    name: 'location',
    rules: { required: true, maxLength: 200 },
    type: 'Text',
    label: 'location',
    placeholder: 'placeholder_location',
    defaultValue: '',
    errorMsg: 'error_location',
  },
  {
    name: 'level',
    rules: { required: false, pattern: /^-?[0-9]*$/ },
    type: 'Text',
    label: 'level',
    placeholder: 'placeholder_level',
    defaultValue: '',
    errorMsg: 'error_level',
    inputMode: 'numeric',
  },
  {
    name: 'description',
    rules: { required: false, maxLength: 200 },
    type: 'Text',
    label: 'description',
    placeholder: 'placeholder_description',
    defaultValue: '',
    multiline: true,
    errorMsg: 'error_description',
  },
  /* not required 
  es gibt diverse opening Hour validation tools. problem: es gibt sehr viele kombinationen,
  automatische opening hours validation wäre gut: https://wiki.openstreetmap.org/wiki/Key:opening_hours#Implementation*/
  {
    name: 'openingHours',
    rules: { validate: openingHoursErrorsAndWarnings },
    type: 'Text',
    label: 'openinghours',
    placeholder: 'placeholder_openinghours',
    defaultValue: '24/7',
    useSwitch: true,
    multiline: true,
  },
  {
    name: 'operator',
    rules: { required: false },
    type: 'Text',
    label: 'operator',
    placeholder: 'placeholder_operator',
    defaultValue: '',
  },
  {
    name: 'operatorPhone',
    rules: { validate: phonenumberValidation, required: false },
    type: 'Text',
    label: 'operatorphone',
    placeholder: 'placeholder_operatorphone',
    keyboardType: 'phone-pad',
    defaultValue: '',
    errorMsg: 'error_operatorphone',
  },
  {
    name: 'access',
    type: 'Select',
    label: 'access',
    placeholder: 'access_placeholder',
    options: ['yes', 'permissive', 'private'],
    infoTitel: 'access_info_titel',
    infoText: [
      { titel: 'access_yes_titel', text: 'access_yes_text' },
      {
        titel: 'access_permissive_titel',
        text: 'access_permissive_text',
      },
      { titel: 'access_private_titel', text: 'access_private_text' },
    ],
    infoLink: 'https://wiki.openstreetmap.org/wiki/Key:access',
  },
  {
    name: 'indoor',
    type: 'Switch',
    label: 'indoor',
    defaultValue: false,
  },
];
