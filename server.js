const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({path: './config.env'})
const app = require('./app')

//online
const DB= process.env.DATABASE
mongoose.connect(DB).then((con) => {
   console.log('DB connection successful')
}).catch(error => console.log(error))

//local
//const local_DB = process.env.DATABASE_LOCAL
//mongoose.connect(local_DB).then((con) =>{
//console.log("DB connection successful")
//})
   
const port = 4001
app.listen(port, () => {
   console.log(`App running on port ${port} ..`)
})