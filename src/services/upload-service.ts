import { apiService, apiUrl } from '../helpers';

export default {
  upload: async data => {
    const url = apiUrl.UPLOAD;
    return apiService.post({ url, data });
  },
};
