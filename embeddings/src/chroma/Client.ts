import { ChromaClient } from 'chromadb'

const client = new ChromaClient({
    path: 'http://localhost:8000'
})

async function main(){
    const response = await client.createCollection({
        name: 'data-test'
    })
    console.log(response)
}

async function addData() {
    const collection = await client.getCollection({
        name: 'data-test'
    });
    const result = await collection.add({
        ids: ['id1'],
        documents:['Here is my entry'],
    //    embeddings: [[0.1, 0.2]]
    })
    console.log(result)
}

addData();