const { projects, clients } = require("../testData");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLID,
} = require("graphql");

const ClientType = new GraphQLObjectType({
  name: "Client",
  description: "Client Type",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  description: "List of all Queries",
  fields: () => ({
    singleCLient: {
      type: ClientType,
      description: "Fetches for a single client, passing ID as args",
      args: {
        id: { type: GraphQLID },
      },
      resolve: (parent, args) => {
        return clients.find((client) => client.id === args.id);
      },
    },
    allClients: {
      type: new GraphQLList(ClientType),
      description: "Fetches all clients",
      // we don't need to pass args here, because we don't need to filter the clients
      resolve: () => clients,
    },
  }),
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
