import NodeCache from 'node-cache';
import TibberConnector from '../connectors/tibber.connector';
import { SpotPriceCollection } from '../models/models';

enum CacheKey {
    SpotPrices = 'SPOT_PRICES',
    TomorrowsSpotPrices = 'TOMORROWS_SPOT_PRICES_KEY',
}

export default class SpotPriceService {
    private readonly spotPriceCache: NodeCache;
    private cacheDate: Date;

    constructor(private readonly tibberConnector: TibberConnector) {
        this.cacheDate = new Date();
        this.spotPriceCache = new NodeCache({ stdTTL: 0, useClones: false });
    }

    public async getSpotPrices(): Promise<SpotPriceCollection> {
        const spotPrices = await this.getData(CacheKey.SpotPrices);
        if (!spotPrices) {
            throw new Error('Error fetching spot prices from cache.');
        }
        return spotPrices;
    }

    public async getTomorrowsSpotPrices(): Promise<
        SpotPriceCollection | undefined
    > {
        return this.getData(CacheKey.TomorrowsSpotPrices);
    }

    private async getData(
        key: CacheKey,
    ): Promise<SpotPriceCollection | undefined> {
        this.validateCache();
        if (!this.spotPriceCache.has(key)) {
            await this.fetchSpotPrices();
        }
        return this.spotPriceCache.get(key);
    }

    private validateCache(): void {
        if (!isToday(this.cacheDate)) {
            console.log('Cache flushed');
            this.spotPriceCache.flushAll();
            this.cacheDate = new Date();
        }
    }

    private async fetchSpotPrices(): Promise<void> {
        console.log('Fetching data from api');
        const {
            spotPrices,
            tomorrowsSpotPrices,
        } = await this.tibberConnector.getPriceInfo();

        this.spotPriceCache.set(CacheKey.SpotPrices, spotPrices);
        if (!tomorrowsSpotPrices) {
            // Set 30 min ttl if data is undefined;
            this.spotPriceCache.set(
                CacheKey.TomorrowsSpotPrices,
                undefined,
                30 * 60,
            );
        } else {
            this.spotPriceCache.set(
                CacheKey.TomorrowsSpotPrices,
                tomorrowsSpotPrices,
            );
        }
    }
}

function isToday(date: Date): boolean {
    const today = new Date();
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
}
