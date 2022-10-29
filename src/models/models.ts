export enum PriceLevel {
    /** The price is greater than 90 % and smaller than 115 % compared to average price. */
    Normal = 'NORMAL',
    /** The price is greater than 60 % and smaller or equal to 90 % compared to average price. */
    Cheap = 'CHEAP',
    /** The price is smaller or equal to 60 % compared to average price. */
    VeryCheap = 'VERY_CHEAP',
    /** The price is greater or equal to 115 % and smaller than 140 % compared to average price. */
    Expensive = 'EXPENSIVE',
    /** The price is greater or equal to 140 % compared to average price. */
    VeryExpensive = 'VERY_EXPENSIVE',
}

export enum Interval {
    Today = 'TODAY',
    Tomorrow = 'TOMORROW',
}

export interface SpotPrice {
    total: number;
    energy: number;
    tax: number;
    startsAt: string;
    level: PriceLevel;
}

export type SpotPriceCollection = SpotPrice[];

export type Schedule = TimeSlot[];

export interface TimeSlot {
    id: number;
    startTime: string;
    endTime: string;
    level: PriceLevel;
    heatingCartridge: boolean;
    total: number;
    energy: number;
    tax: number;
}
