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
    VeryExpensive = 'VERY_EXPENSIV',
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
            const spotPrices =
                response.data.data.viewer.home.currentSubscription.priceInfo
                    .today;
            const tomorrowsSpotPrices =
                response.data.data.viewer.home.currentSubscription.priceInfo
                    .tomorrow;

            return {
                spotPrices,
                tomorrowsSpotPrices,
            };
        } catch (error) {
            throw new Error(error.response.data);
        }
    }

    private mockData(): GetPriceInfoResponse {
        return {
            spotPrices: mockSpotPrices as SpotPriceCollection,
            tomorrowsSpotPrices: mockTomorrowsSpotPrices as SpotPriceCollection,
        };
    }
}
