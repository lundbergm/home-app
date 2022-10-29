import { gql } from 'apollo-server';

const typeDefs = gql`
    type Query {
        """
        Hourly schedule with spot prices and how to best use electical power based on price for one day.
        Date as "yyyy-MM-dd".
        """
        heatingSchedule(date: String!): [TimeSlot!]!

        """
        Current thermostat info.
        """
        thermostatInfo: [ThermostatInfo!]!
    }

    type Mutation {
        """
        Override heating schedule timeslot with new value
        """
        setHeatingForTimeSlot(id: Int!, state: State!): TimeSlot!
    }

    type ThermostatInfo {
        name: String!
        deviceAddress: Int!
        roomTemperature: Float!
        setpoint: Float!
        heatOutputPercentage: Int!
        allowHeating: Boolean!
    }

    enum State {
        ON
        OFF
    }

    type TimeSlot {
        "The time slot id."
        id: Int!

        "The start time of the time slot."
        startTime: String!

        "The start time of the time slot."
        endTime: String!

        "The price level compared to the daily prices."
        level: PriceLevel!

        "Should the heating cartridge be used during this hour."
        heatingCartridge: Boolean!

        "Nordpool spot price with tax. (energy + tax)"
        total: Float!

        "Nordpool spot price."
        energy: Float!

        "Tax on Nordpool spot price."
        tax: Float!
    }

    enum Interval {
        "Data for today"
        TODAY

        "Data for tomorrow"
        TOMORROW
    }

    enum PriceLevel {
        "The price is greater than 90 % and smaller than 115 % compared to average price."
        NORMAL

        "The price is greater than 60 % and smaller or equal to 90 % compared to average price."
        CHEAP

        "The price is smaller or equal to 60 % compared to average price."
        VERY_CHEAP

        "The price is greater or equal to 115 % and smaller than 140 % compared to average price."
        EXPENSIVE

        "The price is greater or equal to 140 % compared to average price."
        VERY_EXPENSIVE
    }
`;

export default typeDefs;
