import { CronJob } from 'cron';
import { Interval, PriceLevel } from './models/models';
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
                try {
                    const instruction = await this.getCurrentInstruction();
                    const level = await this.getCurrentPriceLevel();
                    console.log(
                        `${new Date().toISOString()}: Setting heating cartrage to ${instruction ? 'ON' : 'OFF'}`,
                    );
                    this.spotPriceService.setHeatingCartridge(instruction);
                    this.spotPriceService.setPriceLed(level);
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
    }

    public stop = (): void => {
        console.log('Stopping cron jobs...');
        this.setHeatingCartridge.stop();
    };

    public getCurrentInstruction = async (): Promise<boolean> => {
        const schedule = await this.spotPriceService.getHeatingSchedule(Interval.Today);
        const now = new Date();

        // Catch skew
        if (now.getSeconds() >= 58) {
            now.setMinutes(now.getMinutes() + 1);
            now.setSeconds(0);
        }

        const timeSlot = schedule.find((spot) => new Date(spot.startsAt).getHours() === now.getHours());

        if (!timeSlot) {
            throw new Error('No valid timeslot found.');
        }
        const { heatingCartridge } = timeSlot;
        return heatingCartridge;
    };

    public getCurrentPriceLevel = async (): Promise<PriceLevel> => {
        const schedule = await this.spotPriceService.getHeatingSchedule(Interval.Today);
        const now = new Date();

        // Catch skew
        if (now.getSeconds() >= 58) {
            now.setMinutes(now.getMinutes() + 1);
            now.setSeconds(0);
        }

        const timeSlot = schedule.find((spot) => new Date(spot.startsAt).getHours() === now.getHours());

        if (!timeSlot) {
            throw new Error('No valid timeslot found.');
        }

        const { level } = timeSlot;
        return level;
    };
}
