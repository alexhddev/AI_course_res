import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({
  apiKey: process.env.PINECONE_KEY!
});

async function main(){
  await pc.createIndex({
    name: 'cool-index',
    dimension: 1536,
    metric: 'cosine',
    spec: {
      serverless: {
        cloud: 'aws',
        region: 'us-west-2'
      }
    }
  })
}

main();