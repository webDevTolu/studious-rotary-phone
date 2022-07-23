const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { graphqlHTTP } = require("express-graphql");
const connectDB = require("./config/db");

const app = express();

// connect to database
connectDB();

// middleware
app.use(cors());

app.use(
  "/api",
  graphqlHTTP({
    schema: require("./schema/schema"),
    graphiql: process.env.NODE_ENV === "development",
  })
);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`server listening on ${PORT}`));
