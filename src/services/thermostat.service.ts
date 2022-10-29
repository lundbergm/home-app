import { ReginConnector } from '../connectors/regin.connector';

export interface ThermostatInfo {
    name: string;
    deviceAddress: number;
    roomTemperature: number;
    setpoint: number;
    heatOutputPercentage: number;
    allowHeating: boolean;
}

export class ThermostatService {
    constructor(private reginConnector: ReginConnector) {}

    // public listThermostats(): Thermostat[] {}
    public async getThermostatStatus(): Promise<ThermostatInfo[]> {
        return this.reginConnector.getStatus();
    }
    // public async getThermostatStatuses(): Promise<ReginState[]> {}
    public async setHeatingState(state: boolean): Promise<void> {
        try {
            await this.reginConnector.setHeatingState(state);
        } catch (error) {
            console.error('Error setting heating state', error);
        }
    }
}
