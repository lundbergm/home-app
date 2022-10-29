import { CronJob } from 'cron';
import { HomeController } from './controllers/home.controller';
import { IoService } from './services/io.service';
import { ThermostatService } from './services/thermostat.service';

const EVERY_MINUTE = '* * * * *'; // TODO: FIX
const EVERY_10TH_MIN_AFTER_12 = '*/10 12-23 * * *';

export default class Scheduler {
    private setHeatingCartridge: CronJob;
    private createSchedule: CronJob;

    constructor(
        private readonly homeController: HomeController,
        private readonly thermostatService: ThermostatService,
        private readonly ioService: IoService,
    ) {}

    public setup(): void {
        console.log('Running cron setup...');
        this.setHeatingCartridge = new CronJob(
            EVERY_MINUTE,
            async () => {
                try {
                    await this.homeController.setCurrentInstructions();
                } catch (error) {
                    this.ioService.setHeatingCartridge(true); // Default to on for safety
                    await this.thermostatService.setHeatingState(true); // Default to on for safety
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
                    await this.homeController.generateSchedule();
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
        this.createSchedule.stop();
    };
}
