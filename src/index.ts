import { createTerminus } from '@godaddy/terminus';
import createApp from './app';
import config from './config';

async function main() {
    if (config.mockMode) {
        console.warn('---- MOCK MODE ----');
    }

    const { app, shutdownFunctions } = await createApp(config);
    const server = app.listen({ port: 4000 }, () => {
        console.info(`🚀 Server ready at port 4000.`);
    });

    const onSignal = async () => {
        console.info('cleanup started...');
        for (const func of shutdownFunctions) {
            func();
        }
    };

    const onShutdown = async () => {
        console.info('cleanup finished, server is shutting down...');
    };

    createTerminus(server, {
        logger: console.info,
        signals: ['SIGINT', 'SIGTERM'],
        onSignal,
        onShutdown,
    });
}

main().catch((err) => {
    console.error(err);
});
