const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname,'.env')
});

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() =>{
  console.log("database connected");

  app.listen(PORT,() =>{
    console.log(`server running on ${PORT}`);
  });
})
.catch((error)=>{
  console.log("Databse not connected", error);
});