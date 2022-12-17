import { CurrentRoomInfo } from '../../generated/graphql';
import { ThermostatService } from '../../services/thermostat.service';

export default class CurrentRoomInfoResolver {
    constructor(private readonly thermostatService: ThermostatService) {}

    public resolve = async (_parent: unknown, _args: unknown, _context: unknown): Promise<CurrentRoomInfo[]> => {
        return this.thermostatService.getThermostatStatus();
    };
}
