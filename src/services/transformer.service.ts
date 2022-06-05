import GpioConnector from '../connectors/gpio.connector';

export default class TransformerService {
    private level: number;
    private timeoutHandle: NodeJS.Timeout | undefined;
    private loopHandle: NodeJS.Timeout | undefined;
    constructor(private readonly gpioConnector: GpioConnector) {
        this.level = 0;
        this.transformer();
    }

    public getLevel(): number {
        return this.level;
    }

    public setLevel(level: number): number {
        let validLevel = level;
        if (level < 0) {
            validLevel = 0;
        }
        if (level > 100) {
            validLevel = 100;
        }
        this.level = validLevel;
        return this.level;
    }

    public stop = () => {
        if (this.loopHandle) {
            clearInterval(this.loopHandle);
        }
        if (this.timeoutHandle) {
            clearTimeout(this.timeoutHandle);
        }
    };

    private transformer(): void {
        const loop = () => {
            console.log('LOOP');
            if (this.level <= 0) {
                console.log(`${new Date().toISOString()}: OFF`);
                this.gpioConnector.setTransformerRelay(false);
            } else {
                console.log(`${new Date().toISOString()}: ON`);
                this.gpioConnector.setTransformerRelay(true);
                if (this.level < 100) {
                    this.timeoutHandle = setTimeout(() => {
                        console.log(`${new Date().toISOString()}: OFF`);
                        this.gpioConnector.setTransformerRelay(false);
                    }, this.level * 100);
                }
            }
        };
        this.loopHandle = setInterval(loop, 10000);
    }
}
