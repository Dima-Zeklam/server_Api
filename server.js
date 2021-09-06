'use strict';
const axios = require('axios');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const server = express();
server.use(cors());
server.use(express.json());
const mongoose = require('mongoose');
const PORT = process.env.PORT;
server.get('/', Home);
// "instructions": "Large double. Good grower, heavy bloomer. Early to mid-season, acid loving plants. Plant in moist well drained soil with pH of 4.0-5.5.",
// "photo": "https://www.miraclegro.com/sites/g/files/oydgjc111/files/styles/scotts_asset_image_720_440/public/asset_images/main_021417_MJB_IMG_2241_718x404.jpg?itok=pbCu-Pt3",
// "name": "Azalea"
const flowerSchema = new mongoose.Schema({
    photo: String,
    instructions: String,
    name: String,
    email: String

})
const flowermodel = mongoose.model('flower', flowerSchema);

mongoose.connect(process.env.MONGO_LINK, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
function Home(req, res) {
    res.send('welcom to home page');
}

server.get('/api', getApi);
server.post('/addFav', addFav);
server.get('/getFav', getFav);
server.delete('/deleteFav/:ID', deleteFav);
server.put('/updateFav/:ID',updateFav);


//server.get('/api',getApi);
async function getApi(req, res) {
    let url = `https://flowers-api-13.herokuapp.com/getFlowers`;
    let Data = await axios.get(url);
    console.log('Data', Data);
    res.send(Data.data);
}
server.listen(PORT, () => {
    console.log("all veryyy good", PORT);
})
// server.post('/addFav',addFav);

async function addFav(req, res) {
    let { photo, instructions, name, email } = req.body

    let newObj = new flowermodel({
        photo: photo,
        instructions: instructions,
        name: name,
        email: email
    })
    await newObj.save();
    flowermodel.find({ email: email }, (err, Data) => {
        if (err) {
            console.log(err)
        } else

            res.send(Data);

    })
}

// server.get('/getFav',getFav);
async function getFav(req, res) {
    let email = req.query.email
    flowermodel.find({ email: email }, (err, Data) => {
        if (err) {
            console.log(err)
        } else
            console.log('Data:::::', Data);
        res.send(Data);

    })
}

//server.delete('/deleteFav/:ID',deleteFav);
async function deleteFav(req, res) {
    // let email = req.body.email
    let ID = req.params.ID;
    flowermodel.remove({_id:ID}, (err, Data) => {
        if (err) {
            console.log(err)
        } else
            flowermodel.find({ }, (err, Data) => {
                if (err) {
                    console.log(err)
                } else
                    console.log('Data:::::', Data);
                res.send(Data);

                })
            })
     
    }
// server.put('/updateFav/:ID',updateFav);
async function updateFav(req, res) {
    let { photo, instructions, name, email } = req.body
    let ID = req.params.ID;
    flowermodel.findByIdAndUpdate(ID,{photo, instructions, name}, (err, Data) => {
        if (err) {
            console.log(err)
        } else
            flowermodel.find({ email:email}, (err, Data) => {
                if (err) {
                    console.log(err)
                } else
                    console.log('Data:::::', Data);
                res.send(Data);

                })
            })
     
    }