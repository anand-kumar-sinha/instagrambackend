const { connectDataBase } = require("./config/database");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const redis = require("./config/redis");
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
    credentials: true,
    headers:
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
    methods: "GET, POST, PATCH, PUT, POST, DELETE, OPTION",
  })
);
app.use(express.urlencoded({ extended: true }));

dotenv.config();
connectDataBase();
redis

app.use("/api/v1/users", userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is Started on ${process.env.PORT} port`);
});
