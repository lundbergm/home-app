import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import morgan from 'morgan';
import { TestProvider } from './graphql/provider';
import graphqlResolvers, { typeDefs } from './graphql/resolver';

export interface Context {
    dataSources: {
        testProvider: TestProvider;
    };
}

export default async function createApp(): Promise<express.Express> {
    const app = express();
    app.use(morgan('tiny'));

    // This is where we define the dataSources which can be
    // used to retrieve data from the resolvers.
    const dataSources = (): Context['dataSources'] => {
        return {
            testProvider: new TestProvider(),
        };
    };
    const resolvers = graphqlResolvers();

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

    return app;
}
