import { CronJob } from 'cron';
import { Interval } from './models/models';
import SpotPriceService from './services/spot-price.service';

const EVERY_HOUR = '* * * * * *'; // TODO: FIX

export default class Scheduler {
    private readonly spotPriceService: SpotPriceService;

    private setHeatingCartridge: CronJob;
    constructor(spotPriceService: SpotPriceService) {
        this.spotPriceService = spotPriceService;
    }

    public setup(): void {
        console.log('running setup');
        this.setHeatingCartridge = new CronJob(EVERY_HOUR, async () => {
            const instruction = await this.getCurrentInstruction();
            console.log(
                `${new Date().toISOString()}: Setting heating cartrage to ${
                    instruction ? 'ON' : 'OFF'
                }`,
            );
            this.spotPriceService.setHeatingCartridge(instruction);
        });
    }

    public start(): void {
        console.log('Starting cron jobs...');
        this.setHeatingCartridge.start();
    }

    public stop = (): void => {
        console.log('Stopping cron jobs...');
        this.setHeatingCartridge.stop();
    };

    public getCurrentInstruction = async (): Promise<boolean> => {
        const schedule = await this.spotPriceService.getHeatingSchedule(
            Interval.Today,
        );
        const now = new Date();
        // Catch skew
        if (now.getMinutes() >= 58) {
            now.setHours(now.getHours() + 1);
            now.setMinutes(0);
        }

        const timeSlot = schedule.find(
            spot => new Date(spot.startsAt).getHours() === now.getHours(),
        );

        if (!timeSlot) {
            throw new Error('No valid timeslot found.');
        }
        console.log(timeSlot);
        const { heatingCartridge } = timeSlot;
        return heatingCartridge;
    };
}
