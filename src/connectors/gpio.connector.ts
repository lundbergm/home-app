import rpio from 'rpio';

export default class GpioConnector {
    constructor() {
        rpio.init({
            gpiomem: true /* Use /dev/gpiomem */,
            mapping: 'physical' /* Use the P1-P40 numbering scheme */,
            mock: undefined /* Emulate specific hardware in mock mode */,
            close_on_exit: true /* On node process exit automatically close rpio */,
        });
        rpio.open(16, rpio.OUTPUT, rpio.LOW);
    }

    public setHeatingCartridge(state: boolean) {
        console.log(`Setting pin to ${state}`);
        rpio.write(16, state ? rpio.HIGH : rpio.LOW);
    }
}
