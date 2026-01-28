const mongoose = require('mongoose')
const connectToDB = ()=>{
mongoose.connect(process.env.MONGODB_URI).then(()=>{
console.log('connected to db')
}).catch((error)=>{
    console.log(error)
})
}
module.exports = connectToDB