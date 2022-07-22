// const { projects, clients } = require("../testData");
// mongoose models
const Project = require("../models/project");
const Client = require("../models/client");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLEnumType,
} = require("graphql");

// QUERIES
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
        return Client.findById(project.clientId);
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
        return Client.findById(args.id);
      },
    },
    allClients: {
      type: new GraphQLList(ClientType),
      description: "Fetches all clients",
      // we don't need to pass args here, because we don't need to filter the clients
      resolve: () => Client.find(),
    },
    singleProject: {
      type: ProjectType,
      description: "Fetches for a single project, passing ID as args",
      args: { id: { type: GraphQLID } },
      resolve: (parent, args) => {
        return Project.findById(args.id);
      },
    },
    allProjects: {
      type: new GraphQLList(ProjectType),
      description: "Fetches all projects",
      resolve: () => Project.find(),
    },
  }),
});

// MUTATIONS
const RootMutation = new GraphQLObjectType({
  name: "RootMutationType",
  description: "List of all Mutations",
  fields: () => ({
    addClient: {
      type: ClientType,
      description: "Add a new client",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        phone: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        // attributes the fields to the Client Schema object
        const client = new Client({
          name: args.name,
          email: args.email,
          phone: args.phone,
        });
        // saves the client to the database
        return client.save();
      },
    },
    deleteClient: {
      type: ClientType,
      description: "Delete a client",
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve: (parent, args) => {
        return Client.findByIdAndDelete(args.id);
      },
    },
    addProject: {
      type: ProjectType,
      description: "Add a new project",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        status: {
          type: new GraphQLEnumType({
            name: "ProjectStatus",
            values: {
              NEW: { value: "Not Started" },
              PROGRESS: { value: "In Progress" },
              COMPLETED: { value: "Completed" },
            },
          }),
          defaultValue: "Not Started",
        },
        clientId: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve: (parent, args) => {
        // attributes the fields to the Project Schema object
        const project = new Project({
          name: args.name,
          description: args.description,
          status: args.status,
          clientId: args.clientId,
        });
        return project.save();
      },
    },
    deleteProject: {
      type: ProjectType,
      description: "Delete a project",
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve: (parent, args) => {
        return Project.findByIdAndDelete(args.id);
      },
    },
  }),
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
