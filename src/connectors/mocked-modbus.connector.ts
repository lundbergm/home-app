export class MockedModbusConnector {
    public connect(): Promise<void> {
        return Promise.resolve();
    }

    public close(): Promise<void> {
        return Promise.resolve();
    }

    public readCoil(): Promise<boolean> {
        return Promise.resolve(randomBoolean());
    }

    public async readCoils(_deviceAddress: number, _dataAddress: number, length: number): Promise<boolean[]> {
        const data = Array.from({ length }, () => randomBoolean());
        return Promise.resolve(data);
    }

    public async readDiscreteInput(): Promise<boolean> {
        return Promise.resolve(randomBoolean());
    }

    public async readDiscreteInputs(_deviceAddress: number, _dataAddress: number, length: number): Promise<boolean[]> {
        const data = Array.from({ length }, () => randomBoolean());
        return Promise.resolve(data);
    }

    public async readHoldingRegister(): Promise<number> {
        return Promise.resolve(randomNumber());
    }

    public async readHoldingRegisters(_deviceAddress: number, _dataAddress: number, length: number): Promise<number[]> {
        const data = Array.from({ length }, () => randomNumber());
        return Promise.resolve(data);
    }

    public async readInputRegister(): Promise<number> {
        return Promise.resolve(randomNumber());
    }

    public async readInputRegisters(_deviceAddress: number, _dataAddress: number, length: number): Promise<number[]> {
        const data = Array.from({ length }, () => randomNumber());
        return Promise.resolve(data);
    }

    public async writeCoil(): Promise<void> {
        return Promise.resolve();
    }

    public async writeCoils(): Promise<void> {
        return Promise.resolve();
    }

    public async writeRegister(): Promise<void> {
        return Promise.resolve();
    }

    public async writeRegisters(): Promise<void> {
        return Promise.resolve();
    }
}

function randomBoolean(): boolean {
    return Math.random() >= 0.5;
}

function randomNumber(): number {
    return Math.floor(Math.random() * (300 + 1));
}
