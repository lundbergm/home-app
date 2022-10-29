/* tslint:disable */
import { GraphQLResolveInfo } from 'graphql';
import { Context } from '../app';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
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
  /** Override heating schedule timeslot with new value */
  setHeatingForTimeSlot: TimeSlot;
};


export type MutationSetHeatingForTimeSlotArgs = {
  id: Scalars['Int'];
  state: State;
};

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
  VeryExpensive = 'VERY_EXPENSIVE'
}

export type Query = {
  __typename?: 'Query';
  /**
   * Hourly schedule with spot prices and how to best use electical power based on price for one day.
   * Date as "yyyy-MM-dd".
   */
  heatingSchedule: Array<TimeSlot>;
  /** Current thermostat info. */
  thermostatInfo: Array<ThermostatInfo>;
};


export type QueryHeatingScheduleArgs = {
  date: Scalars['String'];
};

export enum State {
  On = 'ON',
  Off = 'OFF'
}

export type ThermostatInfo = {
  __typename?: 'ThermostatInfo';
  name: Scalars['String'];
  deviceAddress: Scalars['Int'];
  roomTemperature: Scalars['Float'];
  setpoint: Scalars['Float'];
  heatOutputPercentage: Scalars['Int'];
  allowHeating: Scalars['Boolean'];
};

export type TimeSlot = {
  __typename?: 'TimeSlot';
  /** The time slot id. */
  id: Scalars['Int'];
  /** The start time of the time slot. */
  startTime: Scalars['String'];
  /** The start time of the time slot. */
  endTime: Scalars['String'];
  /** The price level compared to the daily prices. */
  level: PriceLevel;
  /** Should the heating cartridge be used during this hour. */
  heatingCartridge: Scalars['Boolean'];
  /** Nordpool spot price with tax. (energy + tax) */
  total: Scalars['Float'];
  /** Nordpool spot price. */
  energy: Scalars['Float'];
  /** Tax on Nordpool spot price. */
  tax: Scalars['Float'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Interval: Interval;
  Mutation: ResolverTypeWrapper<{}>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  PriceLevel: PriceLevel;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  State: State;
  ThermostatInfo: ResolverTypeWrapper<ThermostatInfo>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  TimeSlot: ResolverTypeWrapper<TimeSlot>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Mutation: {};
  Int: Scalars['Int'];
  Query: {};
  String: Scalars['String'];
  ThermostatInfo: ThermostatInfo;
  Float: Scalars['Float'];
  Boolean: Scalars['Boolean'];
  TimeSlot: TimeSlot;
};

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  setHeatingForTimeSlot?: Resolver<ResolversTypes['TimeSlot'], ParentType, ContextType, RequireFields<MutationSetHeatingForTimeSlotArgs, 'id' | 'state'>>;
};

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  heatingSchedule?: Resolver<Array<ResolversTypes['TimeSlot']>, ParentType, ContextType, RequireFields<QueryHeatingScheduleArgs, 'date'>>;
  thermostatInfo?: Resolver<Array<ResolversTypes['ThermostatInfo']>, ParentType, ContextType>;
};

export type ThermostatInfoResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ThermostatInfo'] = ResolversParentTypes['ThermostatInfo']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  deviceAddress?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  roomTemperature?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  setpoint?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  heatOutputPercentage?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  allowHeating?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TimeSlotResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TimeSlot'] = ResolversParentTypes['TimeSlot']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  startTime?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  endTime?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  level?: Resolver<ResolversTypes['PriceLevel'], ParentType, ContextType>;
  heatingCartridge?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  energy?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  tax?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = Context> = {
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  ThermostatInfo?: ThermostatInfoResolvers<ContextType>;
  TimeSlot?: TimeSlotResolvers<ContextType>;
};

