const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
// const cors = require("cors");

app.use(express.json());
// app.use(cors({credentials: true, origin: url_here}))

const routes = require("./routes");
app.use(routes);

app.listen(port, () => console.log(`Listening at ${port}`));
