import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({
	apiKey: process.env.PINECONE_KEY!
});

// string value
// embedding

// metadata - more info

type CoolType = {
	coolness: number;
	reference: string;
}

// namespace: partition vectors from an index into smaller groups. Make operations limited to one namespace
async function createNamespace() {
	const index = getIndex();
	const namespace = index.namespace('cool-namespace')
}

function getIndex() {
	const index = pc.index<CoolType>('cool-index')
	return index;
}

async function listIndexes() {
	const result = await pc.listIndexes();
	console.log(result)
}

function generateNumberArray(length: number) {
	return Array.from({ length }, () => Math.random());
}

async function upsertVectors() {
	const embedding = generateNumberArray(1536);
	const index = getIndex();

	const upsertResult = await index.upsert([{
		id: 'id-1',
		values: embedding,
		metadata: {
			coolness: 3,
			reference: 'abdc'
		}
	}])
}

async function queryVectors() {
	const index = getIndex();
	const result = await index.query({
		id: 'id-1',
		topK: 1,
		includeMetadata: true
	});
	console.log(result)
}

async function createIndex() {
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

async function main() {
	await queryVectors()
}

main();