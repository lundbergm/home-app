import axios from 'axios';
import {
    GetPriceInfoResponse,
    PriceLevel,
    SpotPrice,
    SpotPriceCollection,
    SpotPriceConnector,
} from './spot-price.connector';

const QUERY = `
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

export default class TibberSpotPriceConnector implements SpotPriceConnector {
    constructor(private baseUrl: string, private homeId: string, private accessToken: string) {}

    public async getSpotPrices(): Promise<GetPriceInfoResponse> {
        const headers = {
            authorization: `Bearer ${this.accessToken}`,
        };
        const variables = {
            homeId: this.homeId,
        };
        const data = {
            query: QUERY,
            variables,
        };

        try {
            const response: PriceInfoResponse = await axios.post(this.baseUrl, data, {
                headers,
            });
            if (response.data.errors) {
                throw new Error(response.data.errors[0].message);
            }
            const spotPricesRaw = response.data.data.viewer.home.currentSubscription.priceInfo.today;
            const tomorrowsSpotPricesRaw = response.data.data.viewer.home.currentSubscription.priceInfo.tomorrow;

            const avgPrice = spotPricesRaw.reduce((avg: number, e: SpotPrice) => (avg += e.energy / 24), 0);
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
                tomorrowsSpotPrices: tomorrowsSpotPrices || [],
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
}
