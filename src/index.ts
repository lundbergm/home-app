import createApp from './app';

async function main() {
    const app = await createApp();
    app.listen({ port: 4000 }, () => {
        console.info(`🚀 Server ready at port 4000.`); // tslint:disable-line no-console
    });
}

main().catch(err => {
    console.error(err); // tslint:disable-line no-console
});
