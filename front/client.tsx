import React from 'react';
import { render } from 'react-dom';

import App from '@layouts/App';
import { BrowserRouter } from 'react-router-dom';
// import SWRDevtools from '@jjordy/swr-devtools';
// import { Cache, mutate } from 'swr';

render(
  <BrowserRouter>
    {/* <SWRDevtools> */}
    <App />
    {/* </SWRDevtools> */}
  </BrowserRouter>,
  document.querySelector('#app'),
);
