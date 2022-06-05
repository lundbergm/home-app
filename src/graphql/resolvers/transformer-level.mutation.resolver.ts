import { MutationSetTransformerLevelArgs } from '../../generated/graphql';
import TransformerService from '../../services/transformer.service';

export default class TransformerLevelMutationResolver {
    constructor(private readonly transformerService: TransformerService) {}

    public resolve = async (
        _parent: unknown,
        args: MutationSetTransformerLevelArgs,
        _context: unknown,
    ): Promise<number> => {
        return this.transformerService.setLevel(args.level);
    };
}
