import createApp from './app';
import config from './config';

async function main() {
    if (config.mockMode) {
        console.warn('---- MOCK MODE ----');
    }
    const app = await createApp(config);
    app.listen({ port: 4000 }, () => {
        console.info(`🚀 Server ready at port 4000.`); // tslint:disable-line no-console
    });
}

main().catch(err => {
    console.error(err); // tslint:disable-line no-console
});
