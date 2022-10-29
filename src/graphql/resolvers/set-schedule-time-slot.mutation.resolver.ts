import { HomeController } from '../../controllers/home.controller';
import { MutationSetHeatingForTimeSlotArgs, State, TimeSlot } from '../../generated/graphql';

export default class SetHeatingScheduleMutationResolver {
    constructor(private homeController: HomeController) {}

    public resolve = async (
        _parent: unknown,
        args: MutationSetHeatingForTimeSlotArgs,
        _context: unknown,
    ): Promise<TimeSlot> => {
        return this.homeController.updateHeatingInstruction(args.id, args.state === State.On);
    };
}
