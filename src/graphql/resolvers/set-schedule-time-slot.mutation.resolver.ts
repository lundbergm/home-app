import { MutationSetHeatingTimeSlotArgs, State } from '../../generated/graphql';
import { Schedule } from '../../models/models';
import SpotPriceService from '../../services/spot-price.service';

export default class SetHeatingScheduleMutationResolver {
    private readonly spotPriceService: SpotPriceService;
    constructor(spotPriceService: SpotPriceService) {
        this.spotPriceService = spotPriceService;
    }

    public resolve = async (
        _parent: unknown,
        args: MutationSetHeatingTimeSlotArgs,
        _context: unknown,
    ): Promise<Schedule> => {
        return this.spotPriceService.overrideHeatingSchedule(args.interval, args.startTime, args.state === State.On);
    };
}
