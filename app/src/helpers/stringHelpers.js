export const trimStringValues = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  const result = {};
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'string') {
      result[key] = obj[key].trim();
    } else {
      result[key] = trimStringValues(obj[key]);
    }
  });

  return result;
};
