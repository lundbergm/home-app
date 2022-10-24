import { ThermostatInfo } from '../../generated/graphql';
import { ThermostatService } from '../../services/thermostat.service';

export default class ThermostatInfoResolver {
    constructor(private readonly thermostatService: ThermostatService) {}

    public resolve = async (_parent: unknown, _args: unknown, _context: unknown): Promise<ThermostatInfo[]> => {
        return this.thermostatService.getThermostatStatus();
    };
}
