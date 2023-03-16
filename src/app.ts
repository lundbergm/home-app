import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { AppConfig } from './config';
import { DatabaseConnector } from './connectors/db.connector';
import GpioConnector from './connectors/gpio.connector';
import { MockedModbusConnector } from './connectors/mocked-modbus.connector';
import MockedSpotPriceConnector from './connectors/mocked-spot-price.connector';
import { ReginConnector } from './connectors/regin.connector';
import { SerialModbusConnector } from './connectors/serial-modbus.connector';
import TibberSpotPriceConnector from './connectors/tibber-spot-price.connector';
import { HomeController } from './controllers/home.controller';
import graphqlResolvers from './graphql';
import typeDefs from './graphql/schema.graphql';
import Scheduler from './scheduler';
import { IoService } from './services/io.service';
import { ScheduleService } from './services/schedule.service';
import { ThermostatService } from './services/thermostat.service';

const THERMOSTATS: Array<{
    name: string;
    deviceAddress: number;
    writeBaseConfig?: boolean;
    backlight?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
}> = [
    { name: 'Vardagsrum', deviceAddress: 139, writeBaseConfig: true, backlight: 1 },
    { name: 'Kök', deviceAddress: 124, writeBaseConfig: true },
    { name: 'M', deviceAddress: 169, writeBaseConfig: true },
    { name: 'Sovrum', deviceAddress: 15, writeBaseConfig: true, backlight: 0 },
    { name: 'Hall', deviceAddress: 113, writeBaseConfig: true },
    { name: 'S', deviceAddress: 122, writeBaseConfig: true },
    { name: 'Badrum', deviceAddress: 45, writeBaseConfig: true },
    { name: 'Tvättstuga', deviceAddress: 1, writeBaseConfig: true },
];

export type Context = Record<string, unknown>;

export default async function createApp(
    config: AppConfig,
): Promise<{ app: express.Express; shutdownFunctions: Array<() => Promise<void>> | Array<() => void> }> {
    const app = express();
    app.use(morgan('tiny'));
    app.use(cors());

    /* CONNECTORS */
    const spotPriceConnector = config.tibber.mockMode
        ? new MockedSpotPriceConnector()
        : new TibberSpotPriceConnector(config.tibber.baseUrl, config.tibber.homeId, config.tibber.accessToken);
    const gpioConnector = new GpioConnector();
    const modbusConnector = config.modbus.mockMode
        ? new MockedModbusConnector()
        : new SerialModbusConnector(config.modbus.path);
    try {
        await modbusConnector.connect();
    } catch (error) {
        console.error('Error connecting to modbus', error);
    }

    const reginConnector = new ReginConnector(modbusConnector);
    for await (const thermostat of THERMOSTATS) {
        try {
            await reginConnector.registerDevice(thermostat);
        } catch (error) {
            console.error(`Error registering device ${thermostat.name}, address: ${thermostat.deviceAddress}`, error);
        }
    }
    console.log('Registered devices:', reginConnector.getUnits());
    const dbConnector = new DatabaseConnector();
    await dbConnector.init();

    /* SERVICES */
    const thermostatService = new ThermostatService(dbConnector, reginConnector);
    const scheduleService = new ScheduleService(dbConnector, spotPriceConnector);
    const ioService = new IoService(gpioConnector);

    /* CONTROLLER */
    const homeController = new HomeController(scheduleService, thermostatService, ioService);

    /* SCHEDULER */
    const scheduler = new Scheduler(homeController, thermostatService, ioService);
    scheduler.setup();
    scheduler.start();

    const resolvers = await graphqlResolvers({ thermostatService, homeController });

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
