import TransformerService from '../../services/transformer.service';

export default class SpotPriceResolver {
    constructor(private readonly transformerService: TransformerService) {}

    public resolve = async (_parent: unknown, _args: unknown, _context: unknown): Promise<number> => {
        return this.transformerService.getLevel();
    };
}
