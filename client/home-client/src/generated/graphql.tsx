import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export enum Interval {
  /** Data for today */
  Today = 'TODAY',
  /** Data for tomorrow */
  Tomorrow = 'TOMORROW'
}

export type Mutation = {
  __typename?: 'Mutation';
  setHeatingCartridge: State;
};


export type MutationSetHeatingCartridgeArgs = {
  state: State;
};

export enum PriceLevel {
  /** The price is greater than 60 % and smaller or equal to 90 % compared to average price. */
  Cheap = 'CHEAP',
  /** The price is greater or equal to 115 % and smaller than 140 % compared to average price. */
  Expensive = 'EXPENSIVE',
  /** The price is greater than 90 % and smaller than 115 % compared to average price. */
  Normal = 'NORMAL',
  /** The price is smaller or equal to 60 % compared to average price. */
  VeryCheap = 'VERY_CHEAP',
  /** The price is greater or equal to 140 % compared to average price. */
  VeryExpensive = 'VERY_EXPENSIVE'
}

export type Query = {
  __typename?: 'Query';
  /** Hourly schedule for how to best use electical power based on price. */
  heatingSchedule: Array<TimeSlot>;
  /** The hourly electrical spot prices. */
  spotPrice: Array<SpotPrice>;
};


export type QueryHeatingScheduleArgs = {
  interval: Interval;
};


export type QuerySpotPriceArgs = {
  interval: Interval;
};

export type SpotPrice = {
  __typename?: 'SpotPrice';
  /** Nordpool spot price. */
  energy: Scalars['Float'];
  /** The price level compared to recent price values. */
  level: PriceLevel;
  /** The start time of the price */
  startsAt: Scalars['String'];
  /** The tax part of the price. */
  tax: Scalars['Float'];
  /** The total price (energy + taxes). */
  total: Scalars['Float'];
};

export enum State {
  Off = 'OFF',
  On = 'ON'
}

export type Test = {
  __typename?: 'Test';
  title?: Maybe<Scalars['String']>;
};

export type TimeSlot = {
  __typename?: 'TimeSlot';
  /** Nordpool spot price. */
  energy: Scalars['Float'];
  /** Should the heating cartridge be used during this hour. */
  heatingCartridge: Scalars['Boolean'];
  /** The price level compared to recent price values. */
  level: PriceLevel;
  /** The start time of the time slot */
  startsAt: Scalars['String'];
};

export type SchemaQueryVariables = Exact<{
  interval: Interval;
}>;


export type SchemaQuery = { __typename?: 'Query', heatingSchedule: Array<{ __typename?: 'TimeSlot', startsAt: string, level: PriceLevel, heatingCartridge: boolean, energy: number }> };


export const SchemaDocument = gql`
    query Schema($interval: Interval!) {
  heatingSchedule(interval: $interval) {
    startsAt
    level
    heatingCartridge
    energy
  }
}
    `;

/**
 * __useSchemaQuery__
 *
 * To run a query within a React component, call `useSchemaQuery` and pass it any options that fit your needs.
 * When your component renders, `useSchemaQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSchemaQuery({
 *   variables: {
 *      interval: // value for 'interval'
 *   },
 * });
 */
export function useSchemaQuery(baseOptions: Apollo.QueryHookOptions<SchemaQuery, SchemaQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SchemaQuery, SchemaQueryVariables>(SchemaDocument, options);
      }
export function useSchemaLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SchemaQuery, SchemaQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SchemaQuery, SchemaQueryVariables>(SchemaDocument, options);
        }
export type SchemaQueryHookResult = ReturnType<typeof useSchemaQuery>;
export type SchemaLazyQueryHookResult = ReturnType<typeof useSchemaLazyQuery>;
export type SchemaQueryResult = Apollo.QueryResult<SchemaQuery, SchemaQueryVariables>;