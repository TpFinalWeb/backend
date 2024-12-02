import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Product Store API',
            version: '1.0.0',
            description: 'A simple API to manage products',
        }
    },
    apis: ['src/routes/*.route.ts']
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

export default swaggerDocs;