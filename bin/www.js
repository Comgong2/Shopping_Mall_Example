const server = require('../server');
const syncDb = require('./sync-db');

syncDb().then(_ => {
  console.log('DB 연결 성공');
  server.listen(server.get('port'), () => {
    console.log(`listening on port ${server.get('port')}`);
  });
}).catch(err => {
  console.error(err);
})
