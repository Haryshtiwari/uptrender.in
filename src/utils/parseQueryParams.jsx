/**
 * Parse query parameters from URL search string
 * @param {string} search - The URL search string (e.g., "?page=1&limit=10")
 * @returns {Object} - Parsed query parameters as key-value pairs
 */
const parseQueryParams = (search) => {
  if (!search || typeof search !== 'string') return {};
  
  const params = new URLSearchParams(search);
  const result = {};
  
  for (const [key, value] of params.entries()) {
    // Try to parse numbers
    if (!isNaN(value) && value !== '') {
      result[key] = Number(value);
    } else if (value === 'true') {
      result[key] = true;
    } else if (value === 'false') {
      result[key] = false;
    } else {
      result[key] = value;
    }
  }
  
  return result;
};

export default parseQueryParams;
