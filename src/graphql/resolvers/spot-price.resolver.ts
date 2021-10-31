import { SpotPrice } from '../../generated/graphql';
import SpotPriceService from '../../services/spot-price.service';

export default class SpotPriceResolver {
    private readonly spotPriceService: SpotPriceService;
    constructor(spotPriceService: SpotPriceService) {
        this.spotPriceService = spotPriceService;
    }

    public resolve = async (
        _parent: unknown,
        _args: unknown,
        _context: unknown,
    ): Promise<SpotPrice[]> => {
        return this.spotPriceService.getSpotPrices();
    };
}
