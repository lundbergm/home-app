import { ModbusConnector } from './modbus.connector';

const BASE_CONFIG = [
    { address: 14, value: 3 }, // Remote state: Occupied
    { address: 15, value: 3 },
    { address: 16, value: 1 },
    { address: 17, value: 3 },
    { address: 18, value: 0 },
    { address: 35, value: 0 },
    { address: 42, value: 1 },
    { address: 51, value: 0 },
    { address: 52, value: 2 },
    { address: 53, value: 0 },
    { address: 55, value: 3 },
    { address: 56, value: 0 },
    { address: 71, value: 200 },
    { address: 72, value: 0 },
    { address: 73, value: 160 },
    { address: 74, value: 100 },
    { address: 75, value: 100 },
    { address: 68, value: 200 },
    { address: 69, value: 0 },
];

const CONFIG_COOL_OUTPUT_SELECT = { address: 4, value: 0 }; // Set cool output to Off
const CONFIG_FAN_MODE = { address: 5, value: 0 }; // Set fan mode to Off
const CONFIG_LOW_BACKLIGHT = { address: 48, value: 10 }; // Set low backlight to minimum
const CONFIG_FROST_PROTECTION = { address: 73, value: 140 }; // Set frost protection to 14 degrees
const CONFIG_FORCED_PROTECTION = { address: 12, value: 0 }; // Set forced ventilation to Off

const HEAT_OUTPUT_SELECT = { address: 3, scaleFactor: 1 };
const ROOM_TEMPERATURE = { address: 11, scaleFactor: 10 };
const SETPOINT_OFFSET = { address: 76, scaleFactor: 10 };
const BASE_SETPOINT = { address: 68, scaleFactor: 10 };
const HEAT_OUTPUT = { address: 22, scaleFactor: 1 };

const HEAT_OUTPUT_OFF = 0;
const HEAT_OUTPUT_AUTO = 2;

export interface ReginState {
    name: string;
    deviceAddress: number;
    roomTemperature: number;
    setpoint: number;
    heatOutputPercentage: number;
    allowHeating: boolean;
}

export interface Thermostat {
    name: string;
    deviceAddress: number;
}

export class ReginConnector {
    private units: Thermostat[] = [];
    constructor(private modbusConnector: ModbusConnector) {}

    public getUnits(): Thermostat[] {
        return this.units;
    }

    public async registerDevice(
        device: Thermostat & { writeBaseConfig?: boolean; backlight?: boolean },
    ): Promise<void> {
        const { name, deviceAddress } = device;
        if (device.writeBaseConfig === true) {
            for await (const config of BASE_CONFIG) {
                console.log(`Writing config: ${JSON.stringify(config)}`);
                await this.modbusConnector.writeRegister(deviceAddress, config.address, config.value);
            }
        }

        await this.modbusConnector.writeRegister(
            deviceAddress,
            CONFIG_COOL_OUTPUT_SELECT.address,
            CONFIG_COOL_OUTPUT_SELECT.value,
        );
        await this.modbusConnector.writeRegister(deviceAddress, CONFIG_FAN_MODE.address, CONFIG_FAN_MODE.value);
        await this.modbusConnector.writeRegister(
            deviceAddress,
            CONFIG_LOW_BACKLIGHT.address,
            device.backlight === false ? 0 : CONFIG_LOW_BACKLIGHT.value,
        );
        await this.modbusConnector.writeRegister(
            deviceAddress,
            CONFIG_FROST_PROTECTION.address,
            CONFIG_FROST_PROTECTION.value,
        );
        await this.modbusConnector.writeRegister(
            deviceAddress,
            CONFIG_FORCED_PROTECTION.address,
            CONFIG_FORCED_PROTECTION.value,
        );

        this.units.push({ name, deviceAddress });
    }

    public async registerDevices(devices: Thermostat[]): Promise<void> {
        for await (const device of devices) {
            await this.registerDevice(device);
        }
    }

    public unregisterDevice(deviceAddress: number): void {
        const index = this.units.findIndex((unit) => unit.deviceAddress === deviceAddress);
        if (index === -1) {
            throw new Error(`Can't unregister device, not found.`);
        }
        this.units.splice(index, 1);
    }

    public async setHeatingState(allowHeating: boolean, deviceAddresses?: number[]): Promise<void> {
        if (deviceAddresses === undefined) {
            deviceAddresses = this.units.map((unit) => unit.deviceAddress);
        }

        for await (const deviceAddress of deviceAddresses) {
            await this.modbusConnector.writeRegister(
                deviceAddress,
                HEAT_OUTPUT_SELECT.address,
                allowHeating ? HEAT_OUTPUT_AUTO : HEAT_OUTPUT_OFF,
            );
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
    }

    public async getStatus(): Promise<ReginState[]>;
    public async getStatus(deviceAddress: number): Promise<ReginState>;
    public async getStatus(deviceAddress?: number): Promise<ReginState | ReginState[]> {
        if (deviceAddress === undefined) {
            const deviceAddresses = this.units.map((unit) => unit.deviceAddress);
            const states: ReginState[] = [];
            for await (const address of deviceAddresses) {
                const state = await this.getStatus(address);
                states.push(state);
            }
            return states;
        }
        const device = this.units.find((unit) => unit.deviceAddress === deviceAddress);
        if (device === undefined) {
            throw new Error(`Device with address: ${deviceAddress} not found.`);
        }

        const roomTemperature =
            (await this.modbusConnector.readInputRegister(deviceAddress, ROOM_TEMPERATURE.address)) /
            ROOM_TEMPERATURE.scaleFactor;
        const setpointOffset =
            (await this.modbusConnector.readHoldingRegister(deviceAddress, SETPOINT_OFFSET.address)) /
            SETPOINT_OFFSET.scaleFactor;
        const baseSetpoint =
            (await this.modbusConnector.readHoldingRegister(deviceAddress, BASE_SETPOINT.address)) /
            BASE_SETPOINT.scaleFactor;
        const heatOutputPercentage =
            (await this.modbusConnector.readInputRegister(deviceAddress, HEAT_OUTPUT.address)) /
            HEAT_OUTPUT.scaleFactor;
        const heatOutputSelect =
            (await this.modbusConnector.readHoldingRegister(deviceAddress, HEAT_OUTPUT_SELECT.address)) /
            HEAT_OUTPUT.scaleFactor;

        return {
            name: device.name,
            deviceAddress: device.deviceAddress,
            roomTemperature,
            setpoint: baseSetpoint + setpointOffset,
            heatOutputPercentage,
            allowHeating: heatOutputSelect === HEAT_OUTPUT_AUTO,
        };
    }
}
