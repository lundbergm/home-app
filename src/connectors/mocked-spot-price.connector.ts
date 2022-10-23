import { mockSpotPrices, mockTomorrowsSpotPrices } from '../mock/mock-data';
import { GetPriceInfoResponse, SpotPriceCollection, SpotPriceConnector } from './spot-price.connector';

export default class MockedSpotPriceConnector implements SpotPriceConnector {
    public async getSpotPrices(): Promise<GetPriceInfoResponse> {
        return this.mockData();
    }

    private mockData(): GetPriceInfoResponse {
        return {
            spotPrices: mockSpotPrices as SpotPriceCollection,
            tomorrowsSpotPrices: mockTomorrowsSpotPrices as SpotPriceCollection,
        };
    }
}
