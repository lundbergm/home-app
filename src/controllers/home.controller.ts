import { Schedule, TimeSlot } from '../models/models';
// import { IoService } from '../services/io.service';
import { ScheduleService } from '../services/schedule.service';
import { ThermostatInfo, ThermostatService } from '../services/thermostat.service';

export class HomeController {
    constructor(
        private readonly scheduleService: ScheduleService,
        private readonly thermostatService: ThermostatService, // private readonly ioService: IoService,
    ) {}

    public getSchedule(day: string): Promise<Schedule> {
        return this.scheduleService.getSchedule(day);
    }
    public generateSchedule(): Promise<void> {
        return this.scheduleService.generateSchedule();
    }
    public updateHeatingInstruction(id: number, heatingState: boolean): Promise<TimeSlot> {
        return this.scheduleService.updateHeatingInstruction(id, heatingState);
    }

    // public setCurrentInstructions() {}

    public getThermostatInfo(): Promise<ThermostatInfo[]> {
        return this.thermostatService.getThermostatStatus();
    }
    // public logCurrentState() {}
}
