import { HomeController } from '../controllers/home.controller';
import { Resolvers } from '../generated/graphql';
import { ThermostatService } from '../services/thermostat.service';
import CurrentRoomInfoResolver from './resolvers/current-room-info.resolver';
import HeatingScheduleResolver from './resolvers/heating-schedule.resolver';
import RoomInfoResolver from './resolvers/room-info.resolver';
import SetHeatingScheduleMutationResolver from './resolvers/set-schedule-time-slot.mutation.resolver';

interface ResolverDependencies {
    thermostatService: ThermostatService;
    homeController: HomeController;
}

export default async function graphqlResolvers(dependencies: ResolverDependencies): Promise<Resolvers> {
    const heatingScheduleResolver = new HeatingScheduleResolver(dependencies.homeController);
    const setHeatingTimeSlotMutationResolver = new SetHeatingScheduleMutationResolver(dependencies.homeController);
    const currentRoomInfoResolver = new CurrentRoomInfoResolver(dependencies.thermostatService);
    const roomInfoResolver = new RoomInfoResolver(dependencies.thermostatService);

    return {
        Query: {
            heatingSchedule: heatingScheduleResolver.resolve,
            currentRoomInfo: currentRoomInfoResolver.resolve,
            roomInfo: roomInfoResolver.resolve,
        },
        Mutation: {
            setHeatingForTimeSlot: setHeatingTimeSlotMutationResolver.resolve,
        },
    };
}
