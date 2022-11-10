const mongoose = require("mongoose");
const url = "mongodb://localhost:27017/hiringportal";


mongoose.connect(url, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
}).then(() => console.log("Connection Successfull")).
catch((err) => console.log("error occured" + err))