import { gql } from 'apollo-server';

const typeDefs = gql`
    type Query {
        """
        The hourly electrical spot prices.
        """
        spotPrice(interval: Interval!): [SpotPrice!]!

        """
        Hourly schedule for how to best use electical power based on price.
        """
        heatingSchedule(interval: Interval!): [TimeSlot!]!
    }

    type Mutation {
        setHeatingCartridge(state: State!): State!

        """
        Override heating schedule timeslot with new value
        """
        setHeatingTimeSlot(interval: Interval!, startTime: String!, state: State!): [TimeSlot!]!
    }

    enum State {
        ON
        OFF
    }

    type TimeSlot {
        "The start time of the time slot"
        startsAt: String!

        "The price level compared to recent price values."
        level: PriceLevel!

        "Should the heating cartridge be used during this hour."
        heatingCartridge: Boolean!

        "Nordpool spot price."
        energy: Float!
    }

    type Test {
        title: String
    }

    type SpotPrice {
        "The total price (energy + taxes)."
        total: Float!

        "Nordpool spot price."
        energy: Float!

        "The tax part of the price."
        tax: Float!

        "The start time of the price"
        startsAt: String!

        "The price level compared to recent price values."
        level: PriceLevel!
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
