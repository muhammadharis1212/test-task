export function convertKeysToCamelCase(data) {
  if (Array.isArray(data)) {
    return data.map(item => convertKeysToCamelCase(item));
  } else if (data !== null && typeof data === 'object') {
    const result = {};
    for (const key in data) {
      const camelCaseKey = key.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
      result[camelCaseKey] = convertKeysToCamelCase(data[key]);
    }
    return result;
  }
  return data;
}
