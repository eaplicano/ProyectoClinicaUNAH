module.exports = {
  database: {
    connectionLimit: 100,
    host: process.env.DB_HOST || "db4free.net",
    user: process.env.DB_USER || "digitalsolution",
    password: process.env.DB_PASSWORD || "P@CIENTE2022",
    database: process.env.DB_NAME || "schema_gp",
    port: process.env.DB_PORT || 3306,
    // ssl:{
    //     ca:fs.readFileSync({ca-cert filename}),
    //     rejectUnauthorized: false
    // }
  },
  // database: {
  //     connectionLimit: 100,
  //     host: process.env.DB_HOST || 'db4free.net',
  //     user: process.env.DB_USER || 'digitalsolution',
  //     password: process.env.DB_PASSWORD || 'P@CIENTE2022',
  //     database: process.env.DB_NAME || 'schema_gp',
  //     port: process.env.DB_PORT || 3306
  // }
  // database: {
  //     connectionLimit: 100,
  //     host: 'localhost',
  //     user: 'root',
  //     password: 'password',
  //     database: 'schema_gp'
  // }
};
