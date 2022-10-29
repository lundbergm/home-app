import { Database } from 'sqlite3';

export interface TimeSlot {
    id: number;
    startTime: string;
    endTime: string;
    total: number;
    energy: number;
    tax: number;
    level: string;
    heatingCartridge: boolean;
}

interface ScheduleRow {
    id: number;
    startTime: string;
    endTime: string;
    total: number;
    energy: number;
    tax: number;
    level: string;
    heatingCartridge: number;
}

export class DatabaseConnector {
    private db: Database;
    constructor() {
        this.db = new Database(__dirname + '/../../home.sqlite');
    }

    public async init(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run(
                    `CREATE TABLE IF NOT EXISTS Schedule (
                        id INTEGER PRIMARY KEY,
                        startTime TEXT NOT NULL,
                        endTime TEXT NOT NULL,
                        total REAL NOT NULL,
                        energy REAL NOT NULL,
                        tax REAL NOT NULL,
                        level TEXT NOT NULL,
                        heatingCartridge INTEGER NOT NULL
                    );`,
                    (err) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve();
                    },
                );
            });
        });
    }

    // Slot for 2022-10-28T18:00:00.000Z => 22102818
    public async getTimeSlot(slotId: number): Promise<TimeSlot> {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM Schedule WHERE id = ?;`, [slotId], (err, rows) => {
                if (err || rows.length !== 1) {
                    return reject(err);
                }
                resolve(this.toTimeSlot(rows[0]));
            });
        });
    }

    public async getHeatingCartridgeState(slotId: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT heatingCartridge FROM Schedule WHERE id = ?;`, [slotId], (err, rows) => {
                if (err || rows.length !== 1) {
                    return reject(err);
                }
                resolve(rows[0].heatingCartridge === 1);
            });
        });
    }

    // Day for 2022-10-28 => 221028
    public async getDailySchedule(day: number): Promise<TimeSlot[]> {
        return new Promise((resolve, reject) => {
            const from = day * 100;
            const to = (day + 1) * 100;
            this.db.all(`SELECT * FROM Schedule WHERE id >= ? AND id < ?;`, [from, to], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows.map(this.toTimeSlot));
            });
        });
    }

    public doesScheduleExist(day: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const from = day * 100;
            const to = (day + 1) * 100;
            this.db.all(
                `SELECT COUNT(*) AS numTimeSlots FROM Schedule WHERE id >= ? AND id < ?;`,
                [from, to],
                (err, rows) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(rows[0].numTimeSlots >= 23); // What appens on the day of DST change?
                },
            );
        });
    }

    public async insertTimeSlots(timeslots: TimeSlot[]): Promise<void> {
        const stmt = this.db.prepare(
            `INSERT INTO Schedule (id, startTime, endTime, total, energy, tax, level, heatingCartridge) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        );
        for await (const timeslot of timeslots) {
            await new Promise<void>((resolve, reject) => {
                stmt.run(
                    timeslot.id,
                    timeslot.startTime,
                    timeslot.endTime,
                    timeslot.total,
                    timeslot.energy,
                    timeslot.tax,
                    timeslot.level,
                    timeslot.heatingCartridge ? 1 : 0,
                    (err: Error) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve();
                    },
                );
            });
        }

        return new Promise((resolve, reject) => {
            stmt.finalize((err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }

    public async updateTimeSlot(slotId: number, heatingCartridge: boolean): Promise<TimeSlot> {
        await new Promise<void>((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run(
                    `UPDATE Schedule SET
                        heatingCartridge = ?
                    WHERE id = ?;`,
                    [heatingCartridge ? 1 : 0, slotId],
                    (err) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve();
                    },
                );
            });
        });
        return this.getTimeSlot(slotId);
    }

    private toTimeSlot(row: ScheduleRow): TimeSlot {
        return {
            id: row.id,
            startTime: row.startTime,
            endTime: row.endTime,
            total: row.total,
            energy: row.energy,
            tax: row.tax,
            level: row.level,
            heatingCartridge: row.heatingCartridge === 1,
        };
    }
}
