import { ReginConnector } from '../connectors/regin.connector';

export class ThermostatService {
    constructor(private reginConnector: ReginConnector) {}

    // public listThermostats(): Thermostat[] {}
    // public async getThermostatStatus(deviceAddress: number): Promise<ReginState> {}
    // public async getThermostatStatuses(): Promise<ReginState[]> {}
    public async setHeatingState(state: boolean): Promise<void> {
        this.reginConnector.setHeatingState(state);
    }
}
