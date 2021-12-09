import { IInfo } from '@typings/db';
import axios from 'axios';

const tabFetcher = <Data>(url: string) => {
  return axios
    .get<Data>(url, {
      withCredentials: true,
    })
    .then((response): IInfo[] | false => {
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return false;
    })
    .catch((err) => {
      console.log(err);
    });
};

export default tabFetcher;
