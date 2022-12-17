import { Schedule, TimeSlot } from '../models/models';
import { IoService } from '../services/io.service';
import { ScheduleService } from '../services/schedule.service';
import { RoomInfo, ThermostatService } from '../services/thermostat.service';

export class HomeController {
    constructor(
        private readonly scheduleService: ScheduleService,
        private readonly thermostatService: ThermostatService,
        private readonly ioService: IoService,
    ) {}

    public getSchedule(day: string): Promise<Schedule> {
        return this.scheduleService.getSchedule(day);
    }
    public generateSchedule(): Promise<void> {
        return this.scheduleService.generateSchedule();
    }
    public async updateHeatingInstruction(id: number, heatingState: boolean): Promise<TimeSlot> {
        const timeSlot = await this.scheduleService.updateHeatingInstruction(id, heatingState);
        await this.setCurrentInstructions();
        return timeSlot;
    }

    public async setCurrentInstructions(): Promise<void> {
        const in15minutes = new Date();
        in15minutes.setMinutes(in15minutes.getMinutes() + 15);

        const timeSlotId = this.scheduleService.getId(new Date());
        const thermostatTimeSlotId = this.scheduleService.getId(in15minutes);
        const heatingCartridgeTimeSlot = await this.scheduleService.getTimeSlot(timeSlotId);
        const thermostatTimeSlot = await this.scheduleService.getTimeSlot(thermostatTimeSlotId);

        console.log(
            `${new Date().toISOString()}: Setting heating cartridge to ${
                heatingCartridgeTimeSlot.heatingCartridge ? 'ON' : 'OFF'
            }, thermostat heating to ${thermostatTimeSlot.heatingCartridge ? 'ON' : 'OFF'}.`,
        );
        this.ioService.setHeatingCartridge(heatingCartridgeTimeSlot.heatingCartridge);
        this.ioService.setPriceLed(heatingCartridgeTimeSlot.level);
        this.thermostatService.setHeatingState(
            heatingCartridgeTimeSlot.heatingCartridge && thermostatTimeSlot.heatingCartridge,
        );
    }

    public getThermostatInfo(): Promise<RoomInfo[]> {
        return this.thermostatService.getThermostatStatus();
    }
    // public logCurrentState() {}
}
