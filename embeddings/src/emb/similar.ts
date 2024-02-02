import { DataWithEmbeddings, generateEmbeddings, loadJSONData } from "./main";

export function dotProduct(a: number[], b: number[]) {
    return a.map((value, index) => value * b[index]).reduce((a, b) => a + b, 0);
}

function cosineSimilarity(a: number[], b: number[]) {
    const product = dotProduct(a, b);
    const aMagnitude = Math.sqrt(a.map(value => value * value).reduce((a, b) => a + b, 0));
    const bMagnitude = Math.sqrt(b.map(value => value * value).reduce((a, b) => a + b, 0));
    return product / (aMagnitude * bMagnitude);
}

async function main() {
    const dataWithEmbeddings = loadJSONData<DataWithEmbeddings[]>('dataWithEmbeddings2.json')

    const input = 'How old is John?';

    const inputEmbedding = await generateEmbeddings(input);

    const similarities: {
        input: string,
        similarity: number
    }[] = [];

    for (const entry of dataWithEmbeddings) {
        const similarity = dotProduct(
            entry.embedding,
            inputEmbedding.data[0].embedding
        )
        similarities.push({
            input: entry.input,
            similarity
        })
    }

    console.log(`Similarity of ${input} with:`)
    const sortedSimilarities = similarities.sort((a, b) => b.similarity - a.similarity);
    sortedSimilarities.forEach(similarity => {
        console.log(`${similarity.input}: ${similarity.similarity}`);
    })
}
