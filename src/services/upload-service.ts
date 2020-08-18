import { apiService, apiUrl } from '../helpers';
import { saveAs } from 'file-saver';

export default {
  upload: async (data: any) => {
    const url = apiUrl.UPLOAD;
    return apiService.post({ url, data });
  },
  getFiles: async (params: any) => {
    const url = apiUrl.GET_FILES;
    return apiService.get({ url, params });
  },
  downloadFile: async (params: any) => {
    const url = apiUrl.DOWNLOAD_FILE;
    return apiService.download({ url, params }).then(({ data, headers }) => {
      const file = new Blob([data], {
        type: headers['content-type'],
      });
      saveAs(file, headers['filename']);
      return true;
    });
  },
  getLogs: async (params: any) => {
    const url = apiUrl.LOGS;
    return apiService.get({ url, params });
  },
  deleteFile: async (params: any) => {
    const url = apiUrl.DELETE_FILE;
    return apiService.delete({ url, params });
  },
};
