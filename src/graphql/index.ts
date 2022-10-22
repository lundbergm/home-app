import { Resolvers } from '../generated/graphql';
import SpotPriceService from '../services/spot-price.service';
import HeatingScheduleResolver from './resolvers/heating-schedule.resolver';
import SetHeatingCartridgeMutationResolver from './resolvers/set-heating-cartridge.mutation.resolver';
import SetHeatingScheduleMutationResolver from './resolvers/set-schedule-time-slot.mutation.resolver';
import SpotPriceResolver from './resolvers/spot-price.resolver';

interface ResolverDependencies {
    spotPriceService: SpotPriceService;
}

export default async function graphqlResolvers(dependencies: ResolverDependencies): Promise<Resolvers> {
    const spotPriceResolver = new SpotPriceResolver(dependencies.spotPriceService);
    const heatingScheduleResolver = new HeatingScheduleResolver(dependencies.spotPriceService);
    const setHeatingCartridgeMutationResolver = new SetHeatingCartridgeMutationResolver(dependencies.spotPriceService);
    const setHeatingTimeSlotMutationResolver = new SetHeatingScheduleMutationResolver(dependencies.spotPriceService);
    return {
        Query: {
            spotPrice: spotPriceResolver.resolve,
            heatingSchedule: heatingScheduleResolver.resolve,
        },
        Mutation: {
            setHeatingCartridge: setHeatingCartridgeMutationResolver.resolve,
            setHeatingTimeSlot: setHeatingTimeSlotMutationResolver.resolve,
        },
    };
}
