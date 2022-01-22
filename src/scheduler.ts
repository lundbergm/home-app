import { CronJob } from 'cron';
import { Interval } from './models/models';
import SpotPriceService from './services/spot-price.service';

const EVERY_MINUTE = '* * * * *'; // TODO: FIX

export default class Scheduler {
    private readonly spotPriceService: SpotPriceService;

    private setHeatingCartridge: CronJob;
    constructor(spotPriceService: SpotPriceService) {
        this.spotPriceService = spotPriceService;
    }

    public setup(): void {
        console.log('Running cron setup...');
        this.setHeatingCartridge = new CronJob(
            EVERY_MINUTE,
            async () => {
                const instruction = await this.getCurrentInstruction();
                console.log(
                    `${new Date().toISOString()}: Setting heating cartrage to ${
                        instruction ? 'ON' : 'OFF'
                    }`,
                );
                this.spotPriceService.setHeatingCartridge(instruction);
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
        if (now.getSeconds() >= 58) {
            now.setMinutes(now.getMinutes() + 1);
            now.setSeconds(0);
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
