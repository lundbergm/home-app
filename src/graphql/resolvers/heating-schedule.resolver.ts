import { QueryHeatingScheduleArgs, TimeSlot } from '../../generated/graphql';
import SpotPriceService from '../../services/spot-price.service';

export default class HeatingScheduleResolver {
    private readonly spotPriceService: SpotPriceService;
    constructor(spotPriceService: SpotPriceService) {
        this.spotPriceService = spotPriceService;
    }

    public resolve = async (
        _parent: unknown,
        args: QueryHeatingScheduleArgs,
        _context: unknown,
    ): Promise<TimeSlot[]> => {
        return this.spotPriceService.getHeatingSchedule(args.interval);
    };
}
