module.exports = {
  port: process.env.PORT || 5000,
  clientOrigin: "http://localhost:3000",
  mongoOptions: {
    family: 4,
    // tls: true,
    serverSelectionTimeoutMS: 10000
  }
};
