import { Interval, QuerySpotPriceArgs, SpotPrice } from '../../generated/graphql';
import { SpotPriceCollection } from '../../models/models';
import SpotPriceService from '../../services/spot-price.service';

export default class SpotPriceResolver {
    private readonly spotPriceService: SpotPriceService;
    constructor(spotPriceService: SpotPriceService) {
        this.spotPriceService = spotPriceService;
    }

    public resolve = async (_parent: unknown, args: QuerySpotPriceArgs, _context: unknown): Promise<SpotPrice[]> => {
        if (args.interval === Interval.Today) {
            return this.spotPriceService.getSpotPrices();
        }
        return (await this.spotPriceService.getTomorrowsSpotPrices()) ?? ([] as SpotPriceCollection);
    };
}
