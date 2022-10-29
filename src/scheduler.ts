import { CronJob } from 'cron';
import { PriceLevel } from './models/models';
import { IoService } from './services/io.service';
import { ScheduleService } from './services/schedule.service';
import { ThermostatService } from './services/thermostat.service';

const EVERY_MINUTE = '* * * * *'; // TODO: FIX
const EVERY_10TH_MIN_AFTER_12 = '*/10 12-23 * * *';

export default class Scheduler {
    private setHeatingCartridge: CronJob;
    private createSchedule: CronJob;

    constructor(
        private readonly thermostatService: ThermostatService,
        private readonly scheduleService: ScheduleService,
        private readonly ioService: IoService,
    ) {}

    public setup(): void {
        console.log('Running cron setup...');
        this.setHeatingCartridge = new CronJob(
            EVERY_MINUTE,
            async () => {
                try {
                    let instruction: boolean = true; // Default to on for safety
                    try {
                        instruction = await this.getCurrentInstruction();
                    } catch (error) {
                        console.error('Error getting current instruction', error);
                    }
                    const level = await this.getCurrentPriceLevel();
                    console.log(
                        `${new Date().toISOString()}: Setting heating cartrage and thermostat heating to ${
                            instruction ? 'ON' : 'OFF'
                        }.`,
                    );

                    this.ioService.setHeatingCartridge(instruction);
                    this.ioService.setPriceLed(level);
                    this.thermostatService.setHeatingState(instruction);
                } catch (error) {
                    console.error(error);
                }
            },
            undefined,
            undefined,
            undefined,
            undefined,
            true,
        );
        this.createSchedule = new CronJob(
            EVERY_10TH_MIN_AFTER_12,
            async () => {
                try {
                    console.log('Running schedule generation...');
                    await this.scheduleService.generateSchedule();
                } catch (error) {
                    console.error(error);
                }
            },
            undefined,
            undefined,
            undefined,
            undefined,
            true,
        );
    }

    public start(): void {
        console.log('Starting cron jobs...');
        this.setHeatingCartridge.start();
        this.createSchedule.start();
    }

    public stop = (): void => {
        console.log('Stopping cron jobs...');
        this.setHeatingCartridge.stop();
    };

    private getCurrentInstruction = async (): Promise<boolean> => {
        const now = new Date();
        // Catch skew
        if (now.getSeconds() >= 58) {
            now.setMinutes(now.getMinutes() + 1);
            now.setSeconds(0);
        }

        const id = this.scheduleService.getId(now);
        return this.scheduleService.getHeatingCartridgeState(id);
    };

    private getCurrentPriceLevel = async (): Promise<PriceLevel> => {
        const now = new Date();
        // Catch skew
        if (now.getSeconds() >= 58) {
            now.setMinutes(now.getMinutes() + 1);
            now.setSeconds(0);
        }

        const id = this.scheduleService.getId(now);
        const { level } = await this.scheduleService.getTimeSlot(id);
        return level;
    };
}
