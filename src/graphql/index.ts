import { gql } from 'apollo-server';
import { Resolvers } from '../generated/graphql';
import SpotPriceService from '../services/spot-price.service';
import SpotPriceResolver from './resolvers/spot-price.resolver';

export const typeDefs = gql`
    type Query {
        test(id: Int!): Test
        spotPrice: [SpotPrice!]!
    }

    type Test {
        title: String
    }

    type SpotPrice {
        "The total price (energy + taxes)."
        total: Float!

        "Nordpool spot price."
        energy: Float!

        "The tax part of the price."
        tax: Float!

        "The start time of the price"
        startsAt: String!

        "The price level compared to recent price values."
        level: PriceLevel!
    }

    enum PriceLevel {
        "The price is greater than 90 % and smaller than 115 % compared to average price."
        NORMAL

        "The price is greater than 60 % and smaller or equal to 90 % compared to average price."
        CHEAP

        "The price is smaller or equal to 60 % compared to average price."
        VERY_CHEAP

        "The price is greater or equal to 115 % and smaller than 140 % compared to average price."
        EXPENSIVE

        "The price is greater or equal to 140 % compared to average price."
        VERY_EXPENSIVE
    }
`;

interface ResolverDependencies {
    spotPriceService: SpotPriceService;
}

export default async function graphqlResolvers(
    dependencies: ResolverDependencies,
): Promise<Resolvers> {
    const spotPriceResolver = new SpotPriceResolver(
        dependencies.spotPriceService,
    );
    return {
        Query: {
            test: (_, args, ctx) => ctx.dataSources.testProvider.getTest(args),
            spotPrice: spotPriceResolver.resolve,
        },
    };
}
