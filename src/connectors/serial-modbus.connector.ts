import ModbusRTU from 'modbus-serial';
/* tslint:disable */
import { SerialPortOptions } from 'modbus-serial/ModbusRTU';
/* tslint:enable */
import { Mutex } from '../utils/mutex';

const BAUD_RATE = 9600;
const DATA_BITS = 8;
const PARITY = 'even';
const STOP_BITS = 1;

// NOTE-- Register addresses are offset from 40001 so inputting register 0 in the code is actually 40001, 3 = 40004 etc...
// Compensated in all functions below.
export class SerialModbusConnector {
    private readonly client: ModbusRTU;
    private readonly path: string;
    private mutex: Mutex;

    constructor(path: string) {
        this.path = path;
        this.client = new ModbusRTU();
        this.mutex = new Mutex();
    }

    public async connect(): Promise<void> {
        const opts: SerialPortOptions = {
            baudRate: BAUD_RATE,
            dataBits: DATA_BITS,
            parity: PARITY,
            stopBits: STOP_BITS,
        };
        await this.client.connectRTUBuffered(this.path, opts);
        this.client.setTimeout(500);
    }

    public async close(): Promise<void> {
        console.log('Closing serial port...');
        return new Promise((resolve) => {
            this.client.close(resolve);
        });
    }

    public async readCoil(deviceAddress: number, dataAddress: number): Promise<boolean> {
        await this.mutex.lock();
        try {
            if (!this.client.isOpen) {
                await this.connect();
            }
            this.client.setID(deviceAddress);
            const data = await this.client.readCoils(dataAddress - 1, 1);
            return data.data[0];
        } catch (e) {
            throw e;
        } finally {
            this.mutex.unlock();
        }
    }

    public async readCoils(deviceAddress: number, dataAddress: number, length: number): Promise<boolean[]> {
        await this.mutex.lock();
        try {
            if (!this.client.isOpen) {
                await this.connect();
            }
            this.client.setID(deviceAddress);
            const data = await this.client.readCoils(dataAddress - 1, length);
            return data.data;
        } catch (e) {
            throw e;
        } finally {
            this.mutex.unlock();
        }
    }

    public async readDiscreteInput(deviceAddress: number, dataAddress: number): Promise<boolean> {
        await this.mutex.lock();
        try {
            if (!this.client.isOpen) {
                await this.connect();
            }
            this.client.setID(deviceAddress);
            const data = await this.client.readDiscreteInputs(dataAddress - 1, 1);
            return data.data[0];
        } catch (e) {
            throw e;
        } finally {
            this.mutex.unlock();
        }
    }

    public async readDiscreteInputs(deviceAddress: number, dataAddress: number, length: number): Promise<boolean[]> {
        await this.mutex.lock();
        try {
            if (!this.client.isOpen) {
                await this.connect();
            }
            this.client.setID(deviceAddress);
            const data = await this.client.readDiscreteInputs(dataAddress - 1, length);
            return data.data;
        } catch (e) {
            throw e;
        } finally {
            this.mutex.unlock();
        }
    }

    public async readHoldingRegister(
        deviceAddress: number,
        dataAddress: number,
        signed: boolean = true,
    ): Promise<number> {
        await this.mutex.lock();
        try {
            if (!this.client.isOpen) {
                await this.connect();
            }
            this.client.setID(deviceAddress);
            const data = await this.client.readHoldingRegisters(dataAddress - 1, 1);
            return signed ? this.toSinged(data.data[0]) : data.data[0];
        } catch (e) {
            throw e;
        } finally {
            this.mutex.unlock();
        }
    }

    public async readHoldingRegisters(
        deviceAddress: number,
        dataAddress: number,
        length: number,
        signed: boolean = true,
    ): Promise<number[]> {
        await this.mutex.lock();
        try {
            if (!this.client.isOpen) {
                await this.connect();
            }
            this.client.setID(deviceAddress);
            const data = await this.client.readHoldingRegisters(dataAddress - 1, length);
            return signed ? data.data.map(this.toSinged) : data.data;
        } catch (e) {
            throw e;
        } finally {
            this.mutex.unlock();
        }
    }

    public async readInputRegister(
        deviceAddress: number,
        dataAddress: number,
        signed: boolean = true,
    ): Promise<number> {
        await this.mutex.lock();
        try {
            if (!this.client.isOpen) {
                await this.connect();
            }
            this.client.setID(deviceAddress);
            const data = await this.client.readInputRegisters(dataAddress - 1, 1);
            return signed ? this.toSinged(data.data[0]) : data.data[0];
        } catch (e) {
            throw e;
        } finally {
            this.mutex.unlock();
        }
    }

    public async readInputRegisters(
        deviceAddress: number,
        dataAddress: number,
        length: number,
        signed: boolean = true,
    ): Promise<number[]> {
        await this.mutex.lock();
        try {
            if (!this.client.isOpen) {
                await this.connect();
            }
            this.client.setID(deviceAddress);
            const data = await this.client.readInputRegisters(dataAddress - 1, length);
            return signed ? data.data.map(this.toSinged) : data.data;
        } catch (e) {
            throw e;
        } finally {
            this.mutex.unlock();
        }
    }

    public async writeCoil(deviceAddress: number, dataAddress: number, state: boolean): Promise<void> {
        await this.mutex.lock();
        try {
            if (!this.client.isOpen) {
                await this.connect();
            }
            this.client.setID(deviceAddress);
            await this.client.writeCoil(dataAddress - 1, state);
        } catch (e) {
            throw e;
        } finally {
            this.mutex.unlock();
        }
    }

    public async writeCoils(deviceAddress: number, dataAddress: number, states: boolean[]): Promise<void> {
        await this.mutex.lock();
        try {
            if (!this.client.isOpen) {
                await this.connect();
            }
            this.client.setID(deviceAddress);
            await this.client.writeCoils(dataAddress - 1, states);
        } catch (e) {
            throw e;
        } finally {
            this.mutex.unlock();
        }
    }

    // TODO: Handle signed
    public async writeRegister(deviceAddress: number, dataAddress: number, value: number): Promise<void> {
        await this.mutex.lock();
        try {
            if (!this.client.isOpen) {
                await this.connect();
            }
            this.client.setID(deviceAddress);
            await this.client.writeRegister(dataAddress - 1, value);
        } catch (e) {
            throw e;
        } finally {
            this.mutex.unlock();
        }
    }

    // TODO: Handle signed
    public async writeRegisters(deviceAddress: number, dataAddress: number, values: number[]): Promise<void> {
        await this.mutex.lock();
        try {
            if (!this.client.isOpen) {
                await this.connect();
            }
            this.client.setID(deviceAddress);
            await this.client.writeRegisters(dataAddress - 1, values);
        } catch (e) {
            throw e;
        } finally {
            this.mutex.unlock();
        }
    }

    // function wrap<T extends Function>(fn: T): T {
    //     return <any>function(...args) {
    //         return fn(...args)
    //     };
    // }

    // private async withRetry<T extends Function>(func: T, retries: number = 3): Promise<T> {
    //     if (retries > 0) {
    //         return func();
    //     }
    // }
    // private async withRetry2<T extends Function>(func: () => Promise<T>, retries: number = 3): Promise<T> {
    //     return new Promise((resolve, reject) => {
    //         const retry = async (err: Error) => {
    //             if (retries > 0) {
    //                 retries--;
    //                 await func().then(resolve).catch(retry);
    //             } else {
    //                 reject(err);
    //             }
    //         };
    //         func();
    //     });
    // }

    private toSinged(value: number): number {
        return value > 32767 ? value - 65536 : value;
    }
}
