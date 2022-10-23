import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { AppConfig } from './config';
import GpioConnector from './connectors/gpio.connector';
import { MockedModbusConnector } from './connectors/mocked-modbus.connector';
import MockedSpotPriceConnector from './connectors/mocked-spot-price.connector';
import { ReginConnector } from './connectors/regin.connector';
import { SerialModbusConnector } from './connectors/serial-modbus.connector';
import TibberSpotPriceConnector from './connectors/tibber-spot-price.connector';
import graphqlResolvers from './graphql';
import typeDefs from './graphql/schema.graphql';
import Scheduler from './scheduler';
import SpotPriceService from './services/spot-price.service';
import { ThermostatService } from './services/thermostat.service';

const THERMOSTATS: Array<{ name: string; deviceAddress: number }> = [{ name: 'M', deviceAddress: 124 }];

export type Context = Record<string, unknown>;

export default async function createApp(
    config: AppConfig,
): Promise<{ app: express.Express; shutdownFunctions: Array<() => void> }> {
    const app = express();
    app.use(morgan('tiny'));
    app.use(cors());

    /* CONNECTORS */

    const spotPriceConnector = config.tibber.mockMode
        ? new MockedSpotPriceConnector()
        : new TibberSpotPriceConnector(config.tibber.baseUrl, config.tibber.homeId, config.tibber.accessToken);
    const gpioConnector = new GpioConnector();
    const modbusConnector = config.modbus.mockMode ? new MockedModbusConnector() : new SerialModbusConnector();
    await modbusConnector.connect();

    const reginConnector = new ReginConnector(modbusConnector);
    await reginConnector.registerDevices(THERMOSTATS);

    const state = await reginConnector.getStatus(124);
    console.log(state);

    /* SERVICES */
    const spotPriceService = new SpotPriceService(spotPriceConnector, gpioConnector);
    const thermostatService = new ThermostatService(reginConnector);

    /* SCHEDULER */
    const scheduler = new Scheduler(spotPriceService, thermostatService);
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

    app.use('/static', express.static(path.resolve(__dirname, 'frontend', 'static')));

    app.get('/*', (_req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'index.html'));
    });

    const shutdownFunctions = [gpioConnector.onShutdown, scheduler.stop, modbusConnector.close];
    return { app, shutdownFunctions };
}
