const express= require('express');
const app =express();
const port = process.env.PORT || 5000;
const mongoose= require('mongoose')
const userRoutes =require('./roots/useroutes')
const cors = require('cors')
app.use(express.json())

const corsOptions={
    origin :'http://localhost:3000',
    optionsSuccessStatus :200
};
app.use(cors(corsOptions)) ;

mongoose.connect('mongodb://127.0.0.1:27017/StayHealthy')
const connection=mongoose.connection;
connection.on('connected', ()=>{
    console.log('connected to the data base')
})
connection.on('error', ()=>{
    console.log('connected to the hii data base' ,error)
})

app.use('/api/user',userRoutes )




app.listen( port, ()=>{ console.log(`app is Started ON ${port}`)})