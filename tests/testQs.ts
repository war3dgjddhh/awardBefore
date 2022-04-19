const qs = require('qs');
const params = {
  params: {
    beginTime: 'nihoa',
    endTime: 'woyehao',
  },
};
const i = 1000;
let isUpdate = undefined;
console.log(qs.stringify(params, { arrayFormat: 'brackets' }));
console.log('niho', undefined || false);
console.log(i.toString());
