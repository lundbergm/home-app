import { Resolvers } from '../generated/graphql';
import SpotPriceService from '../services/spot-price.service';
import HeatingScheduleResolver from './resolvers/heating-schedule.resolver';
import SpotPriceResolver from './resolvers/spot-price.resolver';

interface ResolverDependencies {
    spotPriceService: SpotPriceService;
}

export default async function graphqlResolvers(
    dependencies: ResolverDependencies,
): Promise<Resolvers> {
    const spotPriceResolver = new SpotPriceResolver(
        dependencies.spotPriceService,
    );
    const heatingScheduleResolver = new HeatingScheduleResolver(
        dependencies.spotPriceService,
    );
    return {
        Query: {
            test: (_, args, ctx) => ctx.dataSources.testProvider.getTest(args),
            spotPrice: spotPriceResolver.resolve,
            heatingSchedule: heatingScheduleResolver.resolve,
        },
    };
}
