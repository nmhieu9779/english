import axios from 'axios';

export default {
  get: ({ url, config }) => axios.get(url, config),
  post: ({ url, data, config = {} }) => axios.post(url, data, config),
  put: ({ url, data, config }) => axios.put(url, data, config),
  delete: ({ url, data, config }) => axios.delete(url, config),
};
