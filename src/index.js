const axios = require('axios');

const instance = axios.create({
    adapter: require('./adapter/fso'),
    responseType: 'document',
});

instance.get('data.json')
    .then(console.dir)
    .catch(console.error)
