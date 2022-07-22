const { projects, clients } = require("../testData");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLID,
  GraphQLInt,
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

const ProjectType = new GraphQLObjectType({
  name: "Project",
  description: "Project Type",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    clientId: { type: GraphQLInt },
    client: {
      type: ClientType,
      resolve: (project) => {
        return clients.find((client) => client.id === project.clientId);
      },
      // now you can call the fields available on the client type
    },
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
    singleProject: {
      type: ProjectType,
      description: "Fetches for a single project, passing ID as args",
      args: { id: { type: GraphQLID } },
      resolve: (parent, args) => {
        return projects.find((project) => project.id === args.id);
      },
    },
    allProjects: {
      type: new GraphQLList(ProjectType),
      description: "Fetches all projects",
      resolve: () => projects,
    },
  }),
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
