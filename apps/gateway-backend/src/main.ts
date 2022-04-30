import { stitchSchemas } from '@graphql-tools/stitch';
import { stitchingDirectives } from '@graphql-tools/stitching-directives';
import { fastify } from 'fastify';
import { ApolloServer } from 'apollo-server-fastify';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { executeRemoteSchema } from '@key-master/graphql';
const { stitchingDirectivesTransformer } = stitchingDirectives();

async function makeGatewaySchema() {
  const userSchema = await executeRemoteSchema({
    httpEndpoint: 'http://localhost:3000/graphql',
  });

  const authSchema = await executeRemoteSchema({
    httpEndpoint: 'http://localhost:3001/graphql',
  });

  return stitchSchemas({
    subschemaConfigTransforms: [stitchingDirectivesTransformer],
    subschemas: [
      {
        schema: userSchema,
      },
      {
        schema: authSchema,
      },
    ],
  });
}

const main = async () => {
  const schema = await makeGatewaySchema();

  const apolloServer = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });
  const app = fastify({});
  await apolloServer.start();

  app.register(apolloServer.createHandler({ path: '/graphql', cors: true }));

  app.listen(4000, '0.0.0.0').then((url) => {
    console.log(`🚀  Server ready at ${url}/graphql `);
  });
};

main();