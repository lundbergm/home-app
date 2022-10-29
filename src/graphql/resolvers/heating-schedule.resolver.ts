import { HomeController } from '../../controllers/home.controller';
import { QueryHeatingScheduleArgs, TimeSlot } from '../../generated/graphql';

export default class HeatingScheduleResolver {
    constructor(private homeController: HomeController) {}

    public resolve = async (
        _parent: unknown,
        args: QueryHeatingScheduleArgs,
        _context: unknown,
    ): Promise<TimeSlot[]> => {
        return this.homeController.getSchedule(args.date);
    };
}
