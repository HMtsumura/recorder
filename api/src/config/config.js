console.log(process.env.MYSQL_SERVER)
module.exports = {
  development: {
    username: "root",
    password: "root",
    database: "record",
    host:"db",
    dialect: 'mysql',
  },
  test: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_SERVER,
    dialect: 'mysql',
  },
  production: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_SERVER,
    dialect: 'mysql',
  },
};