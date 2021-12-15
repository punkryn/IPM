import axios from 'axios';

const fetcher = <Data>(url: string) => {
  return axios
    .get<Data>(url, {
      withCredentials: true,
    })
    .then((response) => {
      // console.log('bool', response);
      if (Array.isArray(response.data) && Array.isArray(response.data[0])) {
        let obj = {
          id: response.data[0][0].id,
          nickname: response.data[0][0].nickname,
          email: response.data[0][0].email,
          tabs: response.data[0].map((item) => {
            return {
              tab_id: item.tab_id,
              name: item.name,
            };
          }),
        };
        // console.log(obj);
        return obj;
      } else if (typeof response.data === 'boolean') {
        // console.log(typeof response.data);
        return response.data;
      }

      return false;
    });
};

export default fetcher;
