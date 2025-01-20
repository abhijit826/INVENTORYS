
const { PUBLIC_DATA } = require("./constant");
const app= require("./src/app");
const { ConnectDB } = require("./src/config/db.config");
require("dotenv").config({

})


ConnectDB()

app.listen(PUBLIC_DATA.port,()=>{
    console.log(`the app is listening say hello to abhijit and sanket at http://localhost:${PUBLIC_DATA.port}`);
    
})