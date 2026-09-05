module.exports = {
  port: process.env.PORT || 5000,
  clientOrigin: "http://localhost:3000",
  mongoOptions: {
    family: 4,
    tls: true,
    serverSelectionTimeoutMS: 10000
  },
  users: [
    { username: "admin", password: "1234", role: "admin" },
    { username: "waiter", password: "1234", role: "waiter" },
    { username: "kitchen", password: "1234", role: "kitchen" }
  ]
};
