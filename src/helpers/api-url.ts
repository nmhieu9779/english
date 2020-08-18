// const API_URL = 'http://localhost:6779';
const API_URL = 'https://petappbe.herokuapp.com';
const getFinalApiUrl = path => `${API_URL}${path}`;

export default {
  UPLOAD: getFinalApiUrl('/api/file-manager/create'),
  GET_FILES: getFinalApiUrl('/api/file-manager'),
  DOWNLOAD_FILE: getFinalApiUrl('/api/file-manager/download'),
  LOGS: getFinalApiUrl('/api/file-manager/logs'),
  DELETE_FILE: getFinalApiUrl('/api/file-manager/delete'),
};
