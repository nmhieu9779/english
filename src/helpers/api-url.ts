const API_URL = 'http://localhost:6779';
// const API_URL = 'https://petappbe.herokuapp.com';
const getFinalApiUrl = path => `${API_URL}${path}`;

export default {
  UPLOAD: getFinalApiUrl('/api/upload/create'),
};
