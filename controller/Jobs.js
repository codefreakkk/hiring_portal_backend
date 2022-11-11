const express = require("express");
const router = express.Router();
const multer = require("multer");

const Jobs = require("../model/Jobs");
const storage = multer.diskStorage({});
let upload = multer({storage});

router.post("/api/postjob", upload.single("image"), (req, res) => {
    // if(!req.file) res.status(500).send({status: false});
    
    console.log(req.file)
    console.log(req.body.keywords)
    
    const data = new Jobs({
        keywords: req.body.keywords,
    })
    // save data
    data.save((err, data) => {
        if(!err) res.status(200).send({status:true});
        else res.status(500).send({status: false});
    })
})

module.exports = router;