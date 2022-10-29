import GpioConnector, { LedColor } from '../connectors/gpio.connector';
import { PriceLevel } from '../models/models';

export class IoService {
    constructor(private readonly gpioConnector: GpioConnector) {}

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
}
