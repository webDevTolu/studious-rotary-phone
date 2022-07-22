const express = require("express");
require("dotenv").config();
// const expressGraphQL = require("express-graphql");
const { graphqlHTTP } = require("express-graphql");

const app = express();

app.use(
  "/api",
  graphqlHTTP({
    schema: require("./schema/schema"),
    graphiql: process.env.NODE_ENV === "development",
  })
);
// app.use(
//   "/api",
//   expressGraphQL({
//     schema: schema,
//     graphiql: true,
//   })
// );

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`server listening on ${PORT}`));
