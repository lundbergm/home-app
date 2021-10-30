import { DataSource } from 'apollo-datasource';
import { QueryTestArgs } from '../generated/graphql';

// This is a (sample) collection of books we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.
const testData = [
    {
        id: 0,
        title: 'test 0',
    },
    {
        id: 1,
        title: 'test 1',
    },
];

// This is a (simple) data source which can be used for retrieving
// the sample collection of books. This dataSource is injected
// into the context of the apollo server, which makes it usable
// inside the resolvers.
export class TestProvider extends DataSource {
    public async getTest(args: QueryTestArgs) {
        return testData[args.id];
    }
}
