const rp = require('request-promise');
const requestOptions = {
  method: 'GET',
  uri: 'http://localhost:8080/rates',
};

rp(requestOptions).then(response => {
  console.log(response)
}).catch((err) => {
  console.log('API call error:', err.message);
});