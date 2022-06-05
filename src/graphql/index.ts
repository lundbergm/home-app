import { Resolvers } from '../generated/graphql';
import SpotPriceService from '../services/spot-price.service';
import TransformerService from '../services/transformer.service';
import HeatingScheduleResolver from './resolvers/heating-schedule.resolver';
import SetHeatingCartridgeMutationResolver from './resolvers/set-heating-cartridge.mutation.resolver';
import SpotPriceResolver from './resolvers/spot-price.resolver';
import TransformerLevelMutationResolver from './resolvers/transformer-level.mutation.resolver';
import TransformerLevelResolver from './resolvers/transformer-level.resolver';

interface ResolverDependencies {
    spotPriceService: SpotPriceService;
    transformerService: TransformerService;
}

export default async function graphqlResolvers(dependencies: ResolverDependencies): Promise<Resolvers> {
    const spotPriceResolver = new SpotPriceResolver(dependencies.spotPriceService);
    const heatingScheduleResolver = new HeatingScheduleResolver(dependencies.spotPriceService);
    const setHeatingCartridgeMutationResolver = new SetHeatingCartridgeMutationResolver(dependencies.spotPriceService);
    const transformerLevelResolver = new TransformerLevelResolver(dependencies.transformerService);
    const setTransformerLevelMutationResolver = new TransformerLevelMutationResolver(dependencies.transformerService);
    return {
        Query: {
            spotPrice: spotPriceResolver.resolve,
            heatingSchedule: heatingScheduleResolver.resolve,
            transformerLevel: transformerLevelResolver.resolve,
        },
        Mutation: {
            setHeatingCartridge: setHeatingCartridgeMutationResolver.resolve,
            setTransformerLevel: setTransformerLevelMutationResolver.resolve,
        },
    };
}
