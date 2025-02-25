require("dotenv").config();  // ✅ โหลดค่าจากไฟล์ .env

const express = require('express');
const cors = require('cors');
//const morgan = require('morgan');
/* const swaggerUi = require('swagger-ui-express'); */
//const customerRouter = require('./routes/customers.js'); 
//const productRouter = require('./routes/products.js');
const https = require('https');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes.js'); // Import authRoutes Login
const taskRoutes = require('./routes/task_api.js');  // Import taskRoutes
const app = express();
const port = 8800;
const securePort = 8443;

app.use(cors(
    {
        origin: true,
        credentials: true
    }
));  

app.use(express.json());
//app.use(morgan('dev'));   
app.use(cookieParser());
//app.use('/api/v1', customerRouter);
//app.use('/api/v1', productRouter);

app.use('/api/auth', authRoutes); // ใช้งาน Authentication Routes
app.use('/api', taskRoutes); // ใช้งาน Task Routes
/* app.use(swaggerUi.serve, swaggerUi.setup(require('./swagger.js'))); */

const ssl_options = {
    key: fs.readFileSync('./ssl/key.pem'),
    cert: fs.readFileSync('./ssl/cert.pem')
};

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

https.createServer(ssl_options, app).listen(securePort, () => {
    console.log(`Server is running on port ${securePort}`);
});