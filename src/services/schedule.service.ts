import { DatabaseConnector } from '../connectors/db.connector';
import { PriceLevel, SpotPriceCollection, SpotPriceConnector } from '../connectors/spot-price.connector';
import { Schedule, TimeSlot } from '../models/models';

export class ScheduleService {
    constructor(private dbConnector: DatabaseConnector, private spotPriceConnector: SpotPriceConnector) {}

    public async getSchedule(day: string): Promise<Schedule> {
        const scheduleDay = this.getDay(day);
        const schedule = await this.dbConnector.getDailySchedule(scheduleDay);
        return schedule.map(this.toTimeSlot);
    }
    public getTimeSlot(id: number): Promise<TimeSlot> {
        return this.dbConnector.getTimeSlot(id) as Promise<TimeSlot>;
    }
    public getHeatingCartridgeState(id: number): Promise<boolean> {
        return this.dbConnector.getHeatingCartridgeState(id);
    }

    public async generateSchedule() {
        const day = this.getDay(new Date());

        const doesTodaysScheduleExist = await this.doesScheduleExist(+day);
        const doesTomorrowsScheduleExist = await this.doesScheduleExist(+day + 1);

        if (!doesTodaysScheduleExist || !doesTomorrowsScheduleExist) {
            const { spotPrices, tomorrowsSpotPrices } = await this.spotPriceConnector.getSpotPrices();
            if (!doesTodaysScheduleExist) {
                const schedule = this.calculateSchedule(spotPrices);
                if (schedule.length > 0) {
                    try {
                        await this.dbConnector.insertTimeSlots(schedule);
                    } catch (error) {
                        console.error(`Failed to insert schedule for day ${day}`, error);
                    }
                }
            }
            if (!doesTomorrowsScheduleExist) {
                const schedule = this.calculateSchedule(tomorrowsSpotPrices);
                if (schedule.length > 0) {
                    try {
                        await this.dbConnector.insertTimeSlots(schedule);
                    } catch (error) {
                        console.error(`Failed to insert schedule for day ${day}`, error);
                    }
                }
            }
        }
    }

    public async updateHeatingInstruction(id: number, instruction: boolean): Promise<TimeSlot> {
        const timeSlot = await this.dbConnector.updateTimeSlot(id, instruction);
        return this.toTimeSlot(timeSlot);
    }

    public getEndTime(startTime: string): string {
        // TODO: Fix this
        const endTime = new Date(startTime);
        endTime.setHours(endTime.getHours() + 1);

        const pad = (n) => `${Math.floor(Math.abs(n))}`.padStart(2, '0');
        const tzOffset = -endTime.getTimezoneOffset();
        const diff = tzOffset >= 0 ? '+' : '-';
        return (
            endTime.getFullYear() +
            '-' +
            pad(endTime.getMonth() + 1) +
            '-' +
            pad(endTime.getDate()) +
            'T' +
            pad(endTime.getHours()) +
            ':' +
            pad(endTime.getMinutes()) +
            ':' +
            pad(endTime.getSeconds()) +
            '.000' +
            diff +
            pad(tzOffset / 60) +
            ':' +
            pad(tzOffset % 60)
        );
    }

    public getDay(date: string | Date): number {
        const day = typeof date === 'string' ? new Date(date) : date;
        // TODO: Test at 23
        return +day
            .toLocaleDateString('sv-SE', { year: '2-digit', month: '2-digit', day: '2-digit' })
            .replace(/-/g, '');
    }

    public getId(time: string | Date): number {
        const date = typeof time === 'string' ? new Date(time) : time;

        const offset = date.getTimezoneOffset() / 60;
        return (
            offset +
            2 +
            +date
                .toLocaleDateString('sv-SE', { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit' })
                .replace(/-/g, '')
                .replace(/ /g, '')
        );
    }

    private async doesScheduleExist(day: number): Promise<boolean> {
        return this.dbConnector.doesScheduleExist(+day);
    }

    private calculateSchedule(spotPrices: SpotPriceCollection): Schedule {
        spotPrices.sort((a, b) => b.energy - a.energy);

        const schedule: Schedule = spotPrices.map((spotPrice, index) => {
            return {
                id: this.getId(spotPrice.startsAt),
                startTime: spotPrice.startsAt,
                endTime: this.getEndTime(spotPrice.startsAt),
                level: spotPrice.level,
                // Never heat when "VERY_EXPENSIVE", don't heat the most expensive 6 hours.
                heatingCartridge: spotPrice.level !== PriceLevel.VeryExpensive && index >= 6,
                total: spotPrice.total,
                energy: spotPrice.energy,
                tax: spotPrice.tax,
            };
        });

        return schedule.sort((a, b) => (a.startTime > b.startTime ? 1 : -1));
    }

    private toTimeSlot(timeSlot): TimeSlot {
        return {
            id: timeSlot.id,
            startTime: timeSlot.startTime,
            endTime: timeSlot.endTime,
            level: timeSlot.level as PriceLevel,
            heatingCartridge: timeSlot.heatingCartridge,
            total: timeSlot.total,
            energy: timeSlot.energy,
            tax: timeSlot.tax,
        };
    }
}
