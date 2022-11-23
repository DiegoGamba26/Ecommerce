const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui');
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
             title: 'Crossfit WOO API', version: '1.0.0' 
            },
            apis:["Ecommerce\api\routes\userRoutes.js", ""],
    },
}