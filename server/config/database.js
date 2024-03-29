const { Client } = require("pg");

// const client = new Client({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_DBNAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });

const client = new Client({
  connectionString: process.env.POSTGRES_URL ,
});

client
  .connect()
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.log("Error connecting to the database", err);
  });

client.on("error", (err) => {
  console.log(err.message);
});

module.exports = { client };
