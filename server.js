const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const cors = require("cors");
require("./model/databaseconnection");

app.use(express.json());
app.use(cors({credentials: true, origin: ["http://localhost:3000", "http://localhost:3001"]}));

const routes = require("./routes");
app.use(routes);

app.listen(port, () => console.log(`Listening at ${port}`));
