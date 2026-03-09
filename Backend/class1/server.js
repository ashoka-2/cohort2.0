const app = require('./src/app')
const mongoose = require('mongoose');


function connectDB(){
    mongoose.connect("mongodb+srv://ashoka_30_db_user:E9vYWNmU7Bh3oK68@cluster0.jls5p6c.mongodb.net/cohortDB")
    .then(()=>{
        console.log("DB connected");
    })
}
connectDB();

app.listen(3000,()=>{
    console.log("Server is running on http://localhost:3000");
    
})