const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Library Management System API',
    description: 'Documentation for the Library Management System Backend API',
    version: '1.0.0'
  },
  host: 'localhost:5000',
  schemes: ['http'],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Enter your bearer token in the format **Bearer <token>**'
    }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);