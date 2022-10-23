export interface ModbusConnector {
    connect(): Promise<void>;
    close(): Promise<void>;
    readCoil(deviceAddress: number, dataAddress: number): Promise<boolean>;
    readCoils(deviceAddress: number, dataAddress: number, length: number): Promise<boolean[]>;
    readDiscreteInput(deviceAddress: number, dataAddress: number): Promise<boolean>;
    readDiscreteInputs(deviceAddress: number, dataAddress: number, length: number): Promise<boolean[]>;
    readHoldingRegister(deviceAddress: number, dataAddress: number, signed?: boolean): Promise<number>;
    readHoldingRegisters(
        deviceAddress: number,
        dataAddress: number,
        length: number,
        signed?: boolean,
    ): Promise<number[]>;
    readInputRegister(deviceAddress: number, dataAddress: number, signed?: boolean): Promise<number>;
    readInputRegisters(deviceAddress: number, dataAddress: number, length: number, signed?: boolean): Promise<number[]>;
    writeCoil(deviceAddress: number, dataAddress: number, state: boolean): Promise<void>;
    writeCoils(deviceAddress: number, dataAddress: number, states: boolean[]): Promise<void>;
    writeRegister(deviceAddress: number, dataAddress: number, value: number): Promise<void>;
    writeRegisters(deviceAddress: number, dataAddress: number, values: number[]): Promise<void>;
}
