import rpio from 'rpio';

const RELAY_1 = 11;
const RELAY_2 = 13;
const RELAY_3 = 15;
const RELAY_4 = 16;
const LED_GREEN = 29;
const LED_BLUE = 31;
const LED_WHITE = 33;
const LED_YELLOW = 35;
const LED_RED = 37;

export enum LedColor {
    Green,
    Blue,
    White,
    Yellow,
    Red,
}

export default class GpioConnector {
    constructor() {
        rpio.init({
            gpiomem: true /* Use /dev/gpiomem */,
            mapping: 'physical' /* Use the P1-P40 numbering scheme */,
            mock: undefined /* Emulate specific hardware in mock mode */,
            close_on_exit: true /* On node process exit automatically close rpio */,
        });
        rpio.open(RELAY_1, rpio.OUTPUT, rpio.LOW);
        rpio.open(RELAY_2, rpio.OUTPUT, rpio.LOW);
        rpio.open(RELAY_3, rpio.OUTPUT, rpio.LOW);
        rpio.open(RELAY_4, rpio.OUTPUT, rpio.LOW);
        rpio.open(LED_GREEN, rpio.OUTPUT, rpio.LOW);
        rpio.open(LED_BLUE, rpio.OUTPUT, rpio.LOW);
        rpio.open(LED_WHITE, rpio.OUTPUT, rpio.LOW);
        rpio.open(LED_YELLOW, rpio.OUTPUT, rpio.LOW);
        rpio.open(LED_RED, rpio.OUTPUT, rpio.LOW);
    }

    public onShutdown = () => {
        console.log('Closing rpio...');
        rpio.write(RELAY_1, rpio.LOW);
        rpio.write(RELAY_2, rpio.LOW);
        rpio.write(RELAY_3, rpio.LOW);
        rpio.write(RELAY_4, rpio.LOW);
        rpio.write(LED_GREEN, rpio.LOW);
        rpio.write(LED_BLUE, rpio.LOW);
        rpio.write(LED_WHITE, rpio.LOW);
        rpio.write(LED_YELLOW, rpio.LOW);
        rpio.write(LED_RED, rpio.LOW);
        rpio.exit();
    };

    public setHeatingCartridge(state: boolean) {
        // LOW output gives cartridge on.
        const gpioState = state ? rpio.LOW : rpio.HIGH;
        console.log(`Setting pin to ${gpioState}`);
        rpio.write(RELAY_1, gpioState);
        rpio.write(RELAY_2, gpioState);
    }

    public setPriceLed(color: LedColor): void {
        console.log(color);
        switch (color) {
            case LedColor.Green: {
                rpio.write(LED_GREEN, rpio.HIGH);
                rpio.write(LED_BLUE, rpio.LOW);
                rpio.write(LED_WHITE, rpio.LOW);
                rpio.write(LED_YELLOW, rpio.LOW);
                rpio.write(LED_RED, rpio.LOW);
                break;
            }
            case LedColor.Blue: {
                rpio.write(LED_GREEN, rpio.LOW);
                rpio.write(LED_BLUE, rpio.HIGH);
                rpio.write(LED_WHITE, rpio.LOW);
                rpio.write(LED_YELLOW, rpio.LOW);
                rpio.write(LED_RED, rpio.LOW);
                break;
            }
            case LedColor.White: {
                rpio.write(LED_GREEN, rpio.LOW);
                rpio.write(LED_BLUE, rpio.LOW);
                rpio.write(LED_WHITE, rpio.HIGH);
                rpio.write(LED_YELLOW, rpio.LOW);
                rpio.write(LED_RED, rpio.LOW);
                break;
            }
            case LedColor.Yellow: {
                rpio.write(LED_GREEN, rpio.LOW);
                rpio.write(LED_BLUE, rpio.LOW);
                rpio.write(LED_WHITE, rpio.LOW);
                rpio.write(LED_YELLOW, rpio.HIGH);
                rpio.write(LED_RED, rpio.LOW);
                break;
            }
            case LedColor.Red: {
                rpio.write(LED_GREEN, rpio.LOW);
                rpio.write(LED_BLUE, rpio.LOW);
                rpio.write(LED_WHITE, rpio.LOW);
                rpio.write(LED_YELLOW, rpio.LOW);
                rpio.write(LED_RED, rpio.HIGH);
                break;
            }
        }
    }
}
