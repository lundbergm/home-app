import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import morgan from 'morgan';
import { BooksProvider } from './provider';
import { resolvers, typeDefs } from './resolver';

export interface Context {
    dataSources: {
        booksProvider: BooksProvider;
    };
}

export default async function createApp(): Promise<express.Express> {
    const app = express();
    app.use(morgan('tiny'));

    // This is where we define the dataSources which can be
    // used to retrieve data from the resolvers.
    const dataSources = (): Context['dataSources'] => {
        return {
            booksProvider: new BooksProvider()
        };
    };

    const server = new ApolloServer({
        typeDefs,
        // @ts-ignore (FIXME: should be casted to default Resolvers type?)
        resolvers,
        dataSources
    });

    await server.start();

    server.applyMiddleware({
        app,
        path: '/api/graphql'
    });

    return app;
}
