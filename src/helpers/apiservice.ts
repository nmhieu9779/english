import axios from 'axios';

export default {
  get: ({ url, params }) => axios.get(url, { params }).then(({ data }) => data),
  post: ({ url, data, config = {} }) =>
    axios.post(url, data, config).then(({ data }) => data),
  put: ({ url, data, config }) =>
    axios.put(url, data, config).then(({ data }) => data),
  delete: ({ url, params }) =>
    axios.delete(url, { params }).then(({ data }) => data),
  download: ({ url, params }) =>
    axios.get(url, { params, responseType: 'blob' }),
};
