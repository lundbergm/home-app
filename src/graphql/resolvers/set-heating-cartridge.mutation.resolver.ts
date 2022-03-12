import { MutationSetHeatingCartridgeArgs, State } from '../../generated/graphql';
import SpotPriceService from '../../services/spot-price.service';

export default class SetHeatingCartridgeMutationResolver {
    private readonly spotPriceService: SpotPriceService;
    constructor(spotPriceService: SpotPriceService) {
        this.spotPriceService = spotPriceService;
    }

    public resolve = async (
        _parent: unknown,
        args: MutationSetHeatingCartridgeArgs,
        _context: unknown,
    ): Promise<State> => {
        this.spotPriceService.setHeatingCartridge(args.state === State.On);
        return args.state;
    };
}
