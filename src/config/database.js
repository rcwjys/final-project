import pkg from "pg";
var Pool = pkg.Pool;

var pool = new Pool({
    user: "avnadmin",
    host: "1d0ba700-hpcolokkodok-0c9e.europe-west1-a.aivencloud.com",
    database: "defaultdb",
    password: "",
    port: 26778,
    ssl: {
        rejectUnauthorized: false,
    },
});

export default pool;