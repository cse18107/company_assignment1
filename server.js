const app = require('./app');
const dotenv = require('dotenv');

dotenv.config({path:'./.env'});

app.listen(process.env.PORT||4500 ,()=>{
    console.log('server is running on port 4500')
})