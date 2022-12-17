import { QueryRoomInfoArgs, RoomInfo } from '../../generated/graphql';
import { ThermostatService } from '../../services/thermostat.service';

export default class RoomInfoResolver {
    constructor(private readonly thermostatService: ThermostatService) {}

    public resolve = async (_parent: unknown, args: QueryRoomInfoArgs, _context: unknown): Promise<RoomInfo> => {
        return {
            date: args.date,
            rooms: await this.thermostatService.getRoomInfo(args.date, args.resolution ?? 'HOUR'),
        };
    };
}
