import { gql } from '@apollo/client';

export const QUERY_SCHEMA = gql`
    query Schema($interval: Interval!) {
        heatingSchedule(interval: $interval) {
            startsAt
            level
            heatingCartridge
            energy
        }
    }
`;
