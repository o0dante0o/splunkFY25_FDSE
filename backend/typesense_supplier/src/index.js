// index.js
require('dotenv').config();
const { MongoClient } = require('mongodb');
const Typesense = require('typesense');
const {
  createCollectionsInTypesense,
  indexDocument,
  alertsSchema,
  appsSchema,
  dashboardsSchema,
  fieldsSchema,
  indexSchema,
  lookupsSchema,
  reportsSchema,
  sourcesSchema,
} = require('./typesenseSchema');

/**
 * Monitors MongoDB change streams and indexes changes in Typesense.
 *
 * @param {MongoClient} client - The MongoDB client.
 * @param {Typesense.Client} typesense - The Typesense client.
 */
async function monitorChangeStreams(client, typesense) {
  const collections = [
    {
      name: 'alerts',
      collection: client.db(process.env.MONGO_DB_NAME).collection('alerts'),
    },
    {
      name: 'apps',
      collection: client.db(process.env.MONGO_DB_NAME).collection('apps'),
    },
    {
      name: 'dashboards',
      collection: client.db(process.env.MONGO_DB_NAME).collection('dashboards'),
    },
    {
      name: 'fields',
      collection: client.db(process.env.MONGO_DB_NAME).collection('fields'),
    },
    {
      name: 'index',
      collection: client.db(process.env.MONGO_DB_NAME).collection('index'),
    },
    {
      name: 'lookups',
      collection: client.db(process.env.MONGO_DB_NAME).collection('lookups'),
    },
    {
      name: 'reports',
      collection: client.db(process.env.MONGO_DB_NAME).collection('reports'),
    },
    {
      name: 'sources',
      collection: client.db(process.env.MONGO_DB_NAME).collection('sources'),
    },
  ];

  for (const { name, collection } of collections) {
    const changeStream = collection.watch();
    changeStream.on('change', async (next) => {
      console.log(`Detected change in collection: ${name}`);
      console.log(`Change type: ${next.operationType}`);
      console.log(`Full change object: ${JSON.stringify(next, null, 2)}`);

      await indexDocument(next, name, typesense, client); // Pass client here
    });
  }
}

/**
 * Main function to initialize Typesense and MongoDB clients, and start monitoring change streams.
 */
async function main() {
  const typesense = new Typesense.Client({
    nodes: [
      {
        host: process.env.TYPESENSE_HOST,
        port: process.env.TYPESENSE_PORT,
        protocol: process.env.TYPESENSE_PROTOCOL,
      },
    ],
    apiKey: process.env.TYPESENSE_ADMIN_API_KEY,
    connectionTimeoutSeconds: 2,
  });

  await createCollectionsInTypesense(typesense);

  const mongodbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  const client = new MongoClient(process.env.MONGO_URI, mongodbOptions);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(process.env.MONGO_DB_NAME);
    const sourcesCollection = db.collection('sources');
    // Find a test document in the 'sources' collection
    const testDocument = await sourcesCollection.findOne({});

    // Print the found document to the console
    console.log("Test Document from 'sources':", testDocument);
    await monitorChangeStreams(client, typesense);
  } catch (e) {
    console.error(
      'Error connecting to MongoDB or setting up change streams:',
      e
    );
  } finally {
    // Do not close the client connection as we need to keep it open for the change streams to work
    // await client.close();
  }
}

main().catch(console.error);
