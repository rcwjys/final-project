import pkg from "pg";
var Pool = pkg.Pool;

var pool = new Pool({
  user: "avnadmin",
  host: "",
  database: "defaultdb",
  password: "",
  port: 26778,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;
