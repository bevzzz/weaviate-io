// TODO: Configure as part of the test harness
// TODO: Needs tests

// Imports
import weaviate, { dataType, WeaviateClient,vectorizer, configure } from 'weaviate-client';

// Delete pre-existing collections
function deleteCollection(client: WeaviateClient, collectionName: string){

var success = false;
 try {
   client.collections.delete(collectionName)
   success = true;
} catch (e) {
  // ignore error if class doesn't exist
}

return success
}

// Create client connection
async function getClient(){
  const client: WeaviateClient = weaviate.connectToLocal();
  return client;
}

////////////////////
// ENABLE DYNAMIC //
////////////////////

// START EnableDynamic
// Add this import line
// import { vectorizer, dataType, configure } from 'weaviate-client';

async function createDynamicCollection(client: WeaviateClient, collectionName: string){
 await client.collections.create({
   name: collectionName,
   vectorizers: vectorizer.text2VecOpenAI({
     vectorIndexConfig: configure.vectorIndex.dynamic(),
       }),
     })
}
// END EnableDynamic


///////////////////////
// CONFIGURE DYNAMIC //
///////////////////////

// START ConfigDynamic
// Add this import line
// import { vectorizer, dataType, configure } from 'weaviate-client';

async function configureDynamicCollection(client: WeaviateClient, collectionName: string){
 await client.collections.create({
   name: collectionName,
   vectorizers: vectorizer.text2VecOpenAI({
     vectorIndexConfig: configure.vectorIndex.dynamic({
      distanceMetric: 'cosine',
      hnsw: {
        distanceMetric: 'cosine',
        efConstruction: 256,         // Dynamic list size during construction
        maxConnections: 128,         // Maximum number of connections per node
        ef: -1,                      // Dynamic list size during search; -1 enables dynamic Ef
        dynamicEfFactor: 15,         // Multiplier for dynamic Ef
        dynamicEfMin: 200,           // Minimum threshold for dynamic Ef
        dynamicEfMax: 1000,          // Maximum threshold for dynamic Ef
        quantizer: configure.vectorIndex.quantizer.pq() // Compression
      },
      flat: {
       distanceMetric: 'cosine',
       vectorCacheMaxObjects: 1000000,
       quantizer: configure.vectorIndex.quantizer.bq(),
       },
     }),
       }),
     })
}
// END ConfigDynamic

/////////////////////////////
/// AVOID TOP LEVEL AWAIT ///
/////////////////////////////

// Main
async function main(){
  const collectionName = "ConfigCollection";

  const client = await getClient();

  // Only safe to run one at a time due to async code

  // // Run enable dynamic collection code
  // deleteCollection(client, collectionName)
  // if(await client.collections.get(collectionName).exists() != true){
  //   createDynamicCollection(client, collectionName);
  // }

  // Run configure dynamic collection code
  deleteCollection(client, collectionName)
  if(await client.collections.get(collectionName).exists() != true){
    configureDynamicCollection(client, collectionName);
  }
 }

main()
