require('dotenv').load();

var database = {
  test: {
    user: process.env.TEST_USER || 'test',
    pass: process.env.TEST_PASS || 'test',
    host: process.env.TEST_HOST || 'localhost',
    port: process.env.TEST_PORT || '5984',
    name: process.env.TEST_NAME || 'api_test'
  },
  development: {
    user: process.env.DEV_USER || 'admin',
    pass: process.env.DEV_PASS || 'admin',
    host: process.env.DEV_HOST || 'localhost',
    port: process.env.DEV_PORT || '5984',
    name: process.env.DEV_NAME || 'api_development'
  },
  production: {
    user: process.env.USER,
    pass: process.env.PASS,
    host: process.env.HOST,
    port: process.env.PORT,
    name: process.env.NAME
  }
}

module.exports = database;
