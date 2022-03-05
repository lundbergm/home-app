import axios from 'axios';
import { mockSpotPrices, mockTomorrowsSpotPrices } from '../mock/mockData';

enum PriceLevel {
    /** The price is greater than 90 % and smaller than 115 % compared to average price. */
    Normal = 'NORMAL',
    /** The price is greater than 60 % and smaller or equal to 90 % compared to average price. */
    Cheap = 'CHEAP',
    /** The price is smaller or equal to 60 % compared to average price. */
    VeryCheap = 'VERY_CHEAP',
    /** The price is greater or equal to 115 % and smaller than 140 % compared to average price. */
    Expensive = 'EXPENSIVE',
    /** The price is greater or equal to 140 % compared to average price. */
    VeryExpensive = 'VERY_EXPENSIVE',
}

interface SpotPrice {
    total: number;
    energy: number;
    tax: number;
    startsAt: string;
    level: PriceLevel;
}

type SpotPriceCollection = SpotPrice[];

interface PriceInfoResponse {
    data: {
        data: {
            viewer: {
                home: {
                    currentSubscription: {
                        priceInfo: {
                            today: SpotPriceCollection;
                            tomorrow: SpotPriceCollection | undefined;
                        };
                    };
                };
            };
        };
        errors: Array<{
            message: string;
        }>;
    };
}

interface GetPriceInfoResponse {
    spotPrices: SpotPriceCollection;
    tomorrowsSpotPrices: SpotPriceCollection | undefined;
}

export default class TibberConnector {
    private query = `
        query PriceInfo($homeId: ID! ) {
            viewer {
                home(id: $homeId) {
                    currentSubscription {
                        priceInfo {
                            today {
                                total
                                energy
                                tax
                                startsAt
                                level
                            }
                            tomorrow {
                                total
                                energy
                                tax
                                startsAt
                                level
                            }
                        }
                        
                    }
                }
            }
        }
    `;
    constructor(
        private baseUrl: string,
        private homeId: string,
        private accessToken: string,
        private mock: boolean,
    ) {}

    public async getPriceInfo(): Promise<GetPriceInfoResponse> {
        if (this.mock) {
            return this.mockData();
        }
        const headers = {
            authorization: `Bearer ${this.accessToken}`,
        };
        const variables = {
            homeId: this.homeId,
        };
        const data = {
            query: this.query,
            variables,
        };

        try {
            const response: PriceInfoResponse = await axios.post(
                this.baseUrl,
                data,
                {
                    headers,
                },
            );
            if (response.data.errors) {
                throw new Error(response.data.errors[0].message);
            }
            const spotPricesRaw =
                response.data.data.viewer.home.currentSubscription.priceInfo
                    .today;
            const tomorrowsSpotPricesRaw =
                response.data.data.viewer.home.currentSubscription.priceInfo
                    .tomorrow;

            const avgPrice = spotPricesRaw.reduce(
                (avg: number, e: SpotPrice) => (avg += e.energy / 24),
                0,
            );
            const spotPrices = spotPricesRaw.map((e) => {
                const { level, ...rest } = e;
                return {
                    ...rest,
                    level: this.getLevel(avgPrice, e.energy),
                };
            });
            let tomorrowsSpotPrices: SpotPriceCollection | undefined;
            if (tomorrowsSpotPricesRaw) {
                const tomorrowAvgPrice = tomorrowsSpotPricesRaw.reduce(
                    (avg: number, e: SpotPrice) => (avg += e.energy / 24),
                    0,
                );

                tomorrowsSpotPrices = tomorrowsSpotPricesRaw.map((e) => {
                    const { level, ...rest } = e;
                    return {
                        ...rest,
                        level: this.getLevel(tomorrowAvgPrice, e.energy),
                    };
                });
            }

            return {
                spotPrices,
                tomorrowsSpotPrices,
            };
        } catch (error) {
            throw new Error(error.response.data);
        }
    }

    private getLevel(avgPrice: number, price: number): PriceLevel {
        if (price <= avgPrice * 0.6) {
            return PriceLevel.VeryCheap;
        }
        if (price <= avgPrice * 0.9) {
            return PriceLevel.Cheap;
        }
        if (price <= avgPrice * 1.15) {
            return PriceLevel.Normal;
        }
        if (price <= avgPrice * 1.4) {
            return PriceLevel.Expensive;
        }
        return PriceLevel.VeryExpensive;
    }

    private mockData(): GetPriceInfoResponse {
        return {
            spotPrices: mockSpotPrices as SpotPriceCollection,
            tomorrowsSpotPrices: mockTomorrowsSpotPrices as SpotPriceCollection,
        };
    }
}

// VERY_CHEAP
// The price is smaller or equal to 60 % compared to average price.

// CHEAP
// The price is greater than 60 % and smaller or equal to 90 % compared to average price.

// NORMAL
// The price is greater than 90 % and smaller than 115 % compared to average price.

// EXPENSIVE
// The price is greater or equal to 115 % and smaller than 140 % compared to average price.

// VERY_EXPENSIVE
// The price is greater or equal to 140 % compared to average price.
