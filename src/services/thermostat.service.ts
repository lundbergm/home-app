import { DatabaseConnector, DbRoomInfo } from '../connectors/db.connector';
import { ReginConnector } from '../connectors/regin.connector';

export interface RoomInfo {
    name: string;
    deviceAddress: number;
    roomTemperature: number;
    setpoint: number;
    heatOutputPercentage: number;
    allowHeating: boolean;
}

export interface Room {
    name: string;
    deviceAddress: number;
    nodes: RoomInfoNode[];
}

interface RoomInfoNode {
    timestamp: number;
    temperature: number;
    setpoint: number;
    heatOutputPercentage: number;
    allowHeating: boolean;
}

type Resolution = 'HOUR' | 'TEN_MINUTES' | 'MINUTE';

function roundInt(num: number): number {
    return Math.round(num * 10) / 10;
}

export class ThermostatService {
    constructor(private dbConnector: DatabaseConnector, private reginConnector: ReginConnector) {}

    // public listThermostats(): Thermostat[] {}
    public async getThermostatStatus(): Promise<RoomInfo[]> {
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
    public async getRoomInfo(date: string, resolution: Resolution): Promise<Room[]> {
        const roomInfo: DbRoomInfo[] =
            resolution === 'MINUTE'
                ? await this.dbConnector.getRoomInfo(date)
                : await this.dbConnector.getRoomInfoGrouped(date, resolution);

        const rooms: Room[] = [];

        roomInfo.forEach((info) => {
            let index = rooms.findIndex((room) => room.deviceAddress === info.deviceAddress);
            if (index === -1) {
                rooms.push({
                    name: info.name,
                    deviceAddress: info.deviceAddress,
                    nodes: [],
                });
                index = rooms.length - 1;
            }
            rooms[index].nodes.push({
                timestamp: info.timestamp,
                temperature: roundInt(info.roomTemperature),
                setpoint: roundInt(info.setpoint),
                heatOutputPercentage: Math.round(info.heatOutputPercentage),
                allowHeating: info.allowHeating > 0.5 ? true : false,
            });
        });

        return rooms;
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
