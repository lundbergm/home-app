import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import morgan from 'morgan';
import { AppConfig } from './config';
import GpioConnector from './connectors/gpio.connector';
import TibberConnector from './connectors/tibber.connector';
import graphqlResolvers from './graphql';
import { TestProvider } from './graphql/provider';
import typeDefs from './graphql/schema.graphql';
import Scheduler from './scheduler';
import SpotPriceService from './services/spot-price.service';

export interface Context {
    dataSources: {
        testProvider: TestProvider;
    };
}

export default async function createApp(
    config: AppConfig,
): Promise<{ app: express.Express; shutdownFunctions: Array<() => void> }> {
    const app = express();
    app.use(morgan('tiny'));

    /* CONNECTORS */
    const tibberConnector = new TibberConnector(
        config.tibber.baseUrl,
        config.tibber.homeId,
        config.tibber.accessToken,
        config.mockMode,
    );
    const gpioConnector = new GpioConnector();

    /* SERVICES */
    const spotPriceService = new SpotPriceService(
        tibberConnector,
        gpioConnector,
    );

    /* SCHEDULER */
    const scheduler = new Scheduler(spotPriceService);
    scheduler.setup();
    scheduler.start();

    // This is where we define the dataSources which can be
    // used to retrieve data from the resolvers.
    const dataSources = (): Context['dataSources'] => {
        return {
            testProvider: new TestProvider(),
        };
    };
    const resolvers = await graphqlResolvers({ spotPriceService });

    const server = new ApolloServer({
        typeDefs,
        // @ts-ignore (FIXME: should be casted to default Resolvers type?)
        resolvers,
        dataSources,
    });

    await server.start();

    server.applyMiddleware({
        app,
        path: '/api/graphql',
    });

    const shutdownFunctions = [gpioConnector.onShutdown, scheduler.stop];
    return { app, shutdownFunctions };
}
