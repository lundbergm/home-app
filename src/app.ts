import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { AppConfig } from './config';
import GpioConnector from './connectors/gpio.connector';
import TibberConnector from './connectors/tibber.connector';
import graphqlResolvers from './graphql';
import typeDefs from './graphql/schema.graphql';
import Scheduler from './scheduler';
import SpotPriceService from './services/spot-price.service';

export type Context = Record<string, unknown>;

export default async function createApp(
    config: AppConfig,
): Promise<{ app: express.Express; shutdownFunctions: Array<() => void> }> {
    const app = express();
    app.use(morgan('tiny'));
    app.use(cors());

    /* CONNECTORS */
    const tibberConnector = new TibberConnector(
        config.tibber.baseUrl,
        config.tibber.homeId,
        config.tibber.accessToken,
        config.mockMode,
    );
    const gpioConnector = new GpioConnector();

    /* SERVICES */
    const spotPriceService = new SpotPriceService(tibberConnector, gpioConnector);

    /* SCHEDULER */
    const scheduler = new Scheduler(spotPriceService);
    scheduler.setup();
    scheduler.start();

    const resolvers = await graphqlResolvers({ spotPriceService });

    const server = new ApolloServer({
        typeDefs,
        // @ts-ignore (FIXME: should be casted to default Resolvers type?)
        resolvers,
    });

    await server.start();

    server.applyMiddleware({
        app,
        path: '/api/graphql',
    });

    const shutdownFunctions = [gpioConnector.onShutdown, scheduler.stop];
    return { app, shutdownFunctions };
}
