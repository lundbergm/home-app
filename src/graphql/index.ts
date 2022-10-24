import { Resolvers } from '../generated/graphql';
import SpotPriceService from '../services/spot-price.service';
import { ThermostatService } from '../services/thermostat.service';
import HeatingScheduleResolver from './resolvers/heating-schedule.resolver';
import SetHeatingCartridgeMutationResolver from './resolvers/set-heating-cartridge.mutation.resolver';
import SetHeatingScheduleMutationResolver from './resolvers/set-schedule-time-slot.mutation.resolver';
import SpotPriceResolver from './resolvers/spot-price.resolver';
import ThermostatInfoResolver from './resolvers/thermostat-info.resolver';

interface ResolverDependencies {
    spotPriceService: SpotPriceService;
    thermostatService: ThermostatService;
}

export default async function graphqlResolvers(dependencies: ResolverDependencies): Promise<Resolvers> {
    const spotPriceResolver = new SpotPriceResolver(dependencies.spotPriceService);
    const heatingScheduleResolver = new HeatingScheduleResolver(dependencies.spotPriceService);
    const setHeatingCartridgeMutationResolver = new SetHeatingCartridgeMutationResolver(dependencies.spotPriceService);
    const setHeatingTimeSlotMutationResolver = new SetHeatingScheduleMutationResolver(dependencies.spotPriceService);
    const thermostatInfoResolver = new ThermostatInfoResolver(dependencies.thermostatService);
    return {
        Query: {
            spotPrice: spotPriceResolver.resolve,
            heatingSchedule: heatingScheduleResolver.resolve,
            thermostatInfo: thermostatInfoResolver.resolve,
        },
        Mutation: {
            setHeatingCartridge: setHeatingCartridgeMutationResolver.resolve,
            setHeatingTimeSlot: setHeatingTimeSlotMutationResolver.resolve,
        },
    };
}
