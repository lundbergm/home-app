import { HomeController } from '../controllers/home.controller';
import { Resolvers } from '../generated/graphql';
import { ThermostatService } from '../services/thermostat.service';
import HeatingScheduleResolver from './resolvers/heating-schedule.resolver';
import SetHeatingScheduleMutationResolver from './resolvers/set-schedule-time-slot.mutation.resolver';
import ThermostatInfoResolver from './resolvers/thermostat-info.resolver';

interface ResolverDependencies {
    thermostatService: ThermostatService;
    homeController: HomeController;
}

export default async function graphqlResolvers(dependencies: ResolverDependencies): Promise<Resolvers> {
    const heatingScheduleResolver = new HeatingScheduleResolver(dependencies.homeController);
    const setHeatingTimeSlotMutationResolver = new SetHeatingScheduleMutationResolver(dependencies.homeController);
    const thermostatInfoResolver = new ThermostatInfoResolver(dependencies.thermostatService);
    return {
        Query: {
            heatingSchedule: heatingScheduleResolver.resolve,
            thermostatInfo: thermostatInfoResolver.resolve,
        },
        Mutation: {
            setHeatingForTimeSlot: setHeatingTimeSlotMutationResolver.resolve,
        },
    };
}
