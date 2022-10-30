import { DatabaseConnector } from '../connectors/db.connector';
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
    constructor(private dbConnector: DatabaseConnector, private reginConnector: ReginConnector) {}

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

    public async logThermostatInfo(): Promise<void> {
        const thermostatInfo = await this.getThermostatStatus();
        const now = new Date();
        const timestamp = Math.floor(+now / 1000);

        const date = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Stockholm' });
        const roomInfo = thermostatInfo.map((info) => ({ ...info, timestamp, date }));
        await this.dbConnector.insertRoomInfo(roomInfo);
    }
}
