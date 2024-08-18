// typesenseSchema.js

// Definition of common fields that will be used in multiple schemas
const commonFields = [
  { name: '_id', type: 'string', facet: false, sort: true },
  { name: 'name', type: 'string', facet: false, sort: true },
  { name: 'description', type: 'string', facet: false },
  { name: 'owner', type: 'string', facet: false },
  { name: 'custom_classification', type: 'string', facet: false },
  { name: 'tags', type: 'string[]', facet: true },
];

// Schema for the 'alerts' collection
const alertsSchema = {
  name: 'alerts',
  fields: commonFields,
  default_sorting_field: 'name',
};

// Schema for the 'apps' collection
const appsSchema = {
  name: 'apps',
  fields: commonFields,
  default_sorting_field: 'name',
};

// Schema for the 'dashboards' collection
const dashboardsSchema = {
  name: 'dashboards',
  fields: commonFields,
  default_sorting_field: 'name',
};

// Schema for the 'fields' collection
const fieldsSchema = {
  name: 'fields',
  fields: commonFields,
  default_sorting_field: 'name',
};

// Schema for the 'index' collection
const indexSchema = {
  name: 'index',
  fields: commonFields,
  default_sorting_field: 'name',
};

// Schema for the 'lookups' collection
const lookupsSchema = {
  name: 'lookups',
  fields: commonFields,
  default_sorting_field: 'name',
};

// Schema for the 'reports' collection
const reportsSchema = {
  name: 'reports',
  fields: commonFields,
  default_sorting_field: 'name',
};

// Schema for the 'sources' collection
const sourcesSchema = {
  name: 'sources',
  fields: commonFields,
  default_sorting_field: 'name',
};

/**
 * Creates collections in Typesense if they do not exist.
 *
 * @param {Typesense.Client} typesense - The Typesense client.
 */
async function createCollectionsInTypesense(typesense) {
  const schemas = [
    alertsSchema,
    appsSchema,
    dashboardsSchema,
    fieldsSchema,
    indexSchema,
    lookupsSchema,
    reportsSchema,
    sourcesSchema,
  ];

  for (const schema of schemas) {
    const collectionsList = await typesense.collections().retrieve();
    const toCreate = collectionsList.find(
      (value) => value.name === schema.name
    );

    if (!toCreate) {
      await typesense.collections().create(schema);
      console.log(`Collection created: ${schema.name}`);
    }
  }
}

const { MongoClient } = require('mongodb');

/**
 * Indexes a document in Typesense based on changes in MongoDB.
 *
 * @param {Object} next - The MongoDB change object.
 * @param {string} collectionName - The name of the collection.
 * @param {Typesense.Client} typesense - The Typesense client.
 * @param {MongoClient} mongoClient - The MongoDB client.
 */
async function indexDocument(next, collectionName, typesense, mongoClient) {
  try {
    if (next.operationType === 'delete') {
      console.log(`Deleting document from collection: ${collectionName}`);
      await typesense
        .collections(collectionName)
        .documents(next.documentKey._id)
        .delete();
    } else {
      if (!next.ns || !next.ns.db || !next.ns.coll) {
        throw new Error('Namespace (ns) is not defined in the change object.');
      }

      const db = mongoClient.db(next.ns.db);
      const collection = db.collection(next.ns.coll);
      let document = await collection.findOne({ _id: next.documentKey._id });
      console.log('Document:', document);
      if (!document) {
        throw new Error(
          `Document with _id ${next.documentKey._id} not found in MongoDB.`
        );
      }

      Object.assign(document, next.updateDescription.updatedFields);

      const requiredFields = ['name', 'description'];
      requiredFields.forEach((field) => {
        if (!document[field]) {
          document[field] = '';
        }
      });

      document._id = document._id.toString();
      document.id = document._id;

      if (typeof document.description !== 'string') {
        document.description = document.description
          ? String(document.description)
          : '';
      }

      console.log(`Indexing document in collection: ${collectionName}`);
      await typesense.collections(collectionName).documents().upsert(document);
      console.log(`Document added/updated in collection: ${collectionName}`);
    }
    console.log(
      `Document successfully indexed in collection: ${collectionName}`
    );
  } catch (error) {
    console.error(
      `Error indexing document in collection: ${collectionName}`,
      error
    );
  }
}

// Export schemas and functions for use in other modules
module.exports = {
  alertsSchema,
  appsSchema,
  dashboardsSchema,
  fieldsSchema,
  indexSchema,
  lookupsSchema,
  reportsSchema,
  sourcesSchema,
  createCollectionsInTypesense,
  indexDocument,
};
