const express = require("express");
const app = express();
const port = process.env.PORT || 8000;


const db = require("./model/databaseconnection");
const cors = require("cors");

// app.use(express.urlencoded({
//     extended: true
// }))
app.use(express.json());
app.use(cors({credentials: true, origin: "http://localhost:3000"}));

const routes = require("./routes");
app.use(routes);


app.listen(port, () => console.log(`Listening at ${port}`));
