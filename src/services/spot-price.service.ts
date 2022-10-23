import NodeCache from 'node-cache';
import GpioConnector, { LedColor } from '../connectors/gpio.connector';
import { SpotPriceConnector } from '../connectors/spot-price.connector';
import { Interval, PriceLevel, Schedule, SpotPriceCollection } from '../models/models';

enum CacheKey {
    SpotPrices = 'SPOT_PRICES',
    TomorrowsSpotPrices = 'TOMORROWS_SPOT_PRICES',
}

export default class SpotPriceService {
    private readonly spotPriceCache: NodeCache;
    private readonly scheduleCache: NodeCache;
    private spotPriceCacheDate: Date;
    private scheduleCacheDate: Date;

    constructor(
        private readonly spotPriceConnector: SpotPriceConnector,
        private readonly gpioConnector: GpioConnector,
    ) {
        this.spotPriceCacheDate = new Date();
        this.scheduleCacheDate = new Date();
        this.spotPriceCache = new NodeCache({ stdTTL: 0, useClones: false });
        this.scheduleCache = new NodeCache({ stdTTL: 0, useClones: false });
    }

    public async getSpotPrices(): Promise<SpotPriceCollection> {
        const spotPrices = await this.getData(CacheKey.SpotPrices);
        if (!spotPrices) {
            throw new Error('Error fetching spot prices from cache.');
        }
        return spotPrices.sort((a, b) => (a.startsAt > b.startsAt ? 1 : -1));
    }

    public async getTomorrowsSpotPrices(): Promise<SpotPriceCollection | undefined> {
        return this.getData(CacheKey.TomorrowsSpotPrices);
    }

    public async getHeatingSchedule(interval: Interval): Promise<Schedule> {
        this.validateScheduleCache();
        if (!this.scheduleCache.has(interval)) {
            let spotPrices: SpotPriceCollection | undefined;
            switch (interval) {
                case Interval.Today: {
                    spotPrices = await this.getSpotPrices();
                    break;
                }
                case Interval.Tomorrow: {
                    spotPrices = await this.getTomorrowsSpotPrices();
                    break;
                }
            }
            if (spotPrices === undefined) {
                return [];
            }
            this.scheduleCache.set(interval, calculateSchedule(spotPrices));
        }
        return this.scheduleCache.get(interval) as Schedule;
    }

    public async overrideHeatingSchedule(interval: Interval, _timeslot: string, _state: boolean): Promise<Schedule> {
        const schedule = await this.getHeatingSchedule(interval);
        if (schedule.length === 0) {
            throw new Error('Schedule not found');
        }
        schedule.map((timeslot) => console.log(new Date(timeslot.startsAt).getHours()));
        // schedule.findIndex(timeslot => new Date(timeslot.startsAt).getHours() = )
        // TODO: Implement override
        return schedule;
    }

    public setHeatingCartridge(state: boolean): void {
        this.gpioConnector.setHeatingCartridge(state);
    }

    public setPriceLed(priceLevel: PriceLevel): void {
        switch (priceLevel) {
            case PriceLevel.VeryCheap: {
                this.gpioConnector.setPriceLed(LedColor.Green);
                break;
            }
            case PriceLevel.Cheap: {
                this.gpioConnector.setPriceLed(LedColor.Blue);
                break;
            }
            case PriceLevel.Normal: {
                this.gpioConnector.setPriceLed(LedColor.White);
                break;
            }
            case PriceLevel.Expensive: {
                this.gpioConnector.setPriceLed(LedColor.Yellow);
                break;
            }
            case PriceLevel.VeryExpensive: {
                this.gpioConnector.setPriceLed(LedColor.Red);
                break;
            }
        }
    }

    private async getData(key: CacheKey): Promise<SpotPriceCollection | undefined> {
        this.validateSpotPriceCache();
        if (!this.spotPriceCache.has(key)) {
            console.log('Cache miss:', key);
            await this.fetchSpotPrices();
        }
        return this.spotPriceCache.get(key) || undefined; // Node-cache returns null for undefined
    }

    private validateSpotPriceCache(): void {
        if (!isToday(this.spotPriceCacheDate)) {
            console.log('Spot price cache flushed');
            this.spotPriceCache.flushAll();
            this.spotPriceCacheDate = new Date();
        }
    }

    private validateScheduleCache(): void {
        if (!isToday(this.scheduleCacheDate)) {
            console.log('Schedule cache flushed');
            this.scheduleCache.flushAll();
            this.scheduleCacheDate = new Date();
        }
    }

    private async fetchSpotPrices(): Promise<void> {
        const { spotPrices, tomorrowsSpotPrices } = await this.spotPriceConnector.getSpotPrices();

        this.spotPriceCache.set(CacheKey.SpotPrices, spotPrices);
        if (!tomorrowsSpotPrices || tomorrowsSpotPrices.length === 0) {
            // Set 30 min ttl if data is undefined;
            console.log('Set empty tomorrow');
            this.spotPriceCache.set(CacheKey.TomorrowsSpotPrices, undefined, 30 * 60);
        } else {
            this.spotPriceCache.set(CacheKey.TomorrowsSpotPrices, tomorrowsSpotPrices);
        }
    }
}

function calculateSchedule(spotPrices: SpotPriceCollection): Schedule {
    spotPrices.sort((a, b) => b.energy - a.energy);

    const schedule: Schedule = spotPrices.map((spotPrice, index) => {
        return {
            startsAt: spotPrice.startsAt,
            level: spotPrice.level,
            // Never heat when "VERY_EXPENSIVE", don't heat the most expensive 6 hours.
            heatingCartridge: spotPrice.level !== PriceLevel.VeryExpensive && index >= 6,
            energy: spotPrice.energy,
        };
    });

    return schedule.sort((a, b) => (a.startsAt > b.startsAt ? 1 : -1));
}

function isToday(date: Date): boolean {
    const today = new Date();
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
}
