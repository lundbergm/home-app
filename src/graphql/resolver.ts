import { gql } from 'apollo-server';
import { Resolvers } from '../generated/graphql';
import spotPriceResolver from './resolvers/spot-price.resolver';

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
export const typeDefs = gql`
    # Comments in GraphQL are defined with the hash (#) symbol.

    # This "Book" type can be used in other type declarations.
    type Test {
        title: String
    }

    # The "Query" type is the root of all GraphQL queries.
    # (A "Mutation" type will be covered later on.)
    type Query {
        test(id: Int!): Test
        spotPrice: String!
    }
`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
export default function graphqlResolvers(): Resolvers {
    return {
        Query: {
            test: (_, args, ctx) => ctx.dataSources.testProvider.getTest(args),
            spotPrice: spotPriceResolver,
        },
    };
}
