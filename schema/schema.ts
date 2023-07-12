import { GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import axios from "axios";

const CompanyType = new GraphQLObjectType({
  name: "Company",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(source, args){
        return axios.get(`http://localhost:3000/companies/${source.id}/users`)
        .then(res => res.data)
      }
    }
  }),
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () =>({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(source, args) {
        return axios.get(`http://localhost:3000/companies/${source.companyId}`).then((resp) => resp.data);
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(source, args) {
        return axios.get(`http://localhost:3000/users/${args.id}`).then((resp) => resp.data);
      },
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(source, args) {
        return axios.get(`http://localhost:3000/companies/${args.id}`).then((resp) => resp.data);
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
});

export { schema };
