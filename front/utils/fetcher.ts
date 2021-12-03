import axios from 'axios';

const fetcher = (url: string) => {
  return axios
    .get(url, {
      withCredentials: true,
    })
    .then((response) => {
      if (Array.isArray(response.data) && Array.isArray(response.data[0])) {
        console.log(response.data[0][0]);
        return response.data[0][0];
      } else if (typeof response.data === 'boolean') {
        console.log(response.data);
        return response.data;
      }
    });
};

export default fetcher;
