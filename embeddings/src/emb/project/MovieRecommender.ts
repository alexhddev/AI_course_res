import { generateEmbeddings } from "../main";
import { dotProduct } from "../similar";
import { join } from 'path'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { CreateEmbeddingResponse } from "openai/resources/embeddings";

type movie = {
    name: string,
    description: string,
}

type MovieWithEmbedding = movie & { embedding: number[] };

const data = loadJSONData<movie[]>('movies.json');

console.log('What movies do you like?')
console.log('...............')
process.stdin.addListener('data', async function (input) {
    let userInput = input.toString().trim();
    await recommendMovies(userInput);
});

async function recommendMovies(input: string) {

    const embedding = await generateEmbeddings(input);

    const descriptionEmbeddings = await getMovieEmbeddings();

    const moviesWithEmbeddings: MovieWithEmbedding[] = [];
    for (let i = 0; i < data.length; i++) {
        moviesWithEmbeddings.push({
            name: data[i].name,
            description: data[i].description,
            embedding: descriptionEmbeddings.data[i].embedding
        });
    }

    const similarities: { input: string, similarity: number }[] = [];

    for(const movie of moviesWithEmbeddings){
        const similarity = dotProduct(
            movie.embedding,
            embedding.data[0].embedding
        );
        similarities.push({
            input: movie.name,
            similarity
        })        
    }
    console.log(`If you like ${input}, we recommend:`);
    console.log('...............')
    const sortedSimilarity = similarities.sort((a, b) => b.similarity - a.similarity);
    sortedSimilarity.forEach(similarity => {
        console.log(`${similarity.input}: ${similarity.similarity}`);
    });
}

async function getMovieEmbeddings(){
    const fileName = 'movieEmbeddings.json'
    const filePath = join(__dirname, fileName);
    if (existsSync(filePath)) {
        const descriptionEmbeddings =  loadJSONData<CreateEmbeddingResponse>(fileName);
        return descriptionEmbeddings;
    } else {
        const descriptionEmbeddings = await generateEmbeddings(data.map(d => d.description));
        saveDataToJsonFile(descriptionEmbeddings, fileName)
        return descriptionEmbeddings;
    }
}

function loadJSONData<T>(fileName: string):T{
    const path = join(__dirname, fileName);
    const rawData = readFileSync(path);
    return JSON.parse(rawData.toString());
}

function saveDataToJsonFile(data: any, fileName: string){
    const dataString = JSON.stringify(data);
    const dataBuffer = Buffer.from(dataString);
    const path = join(__dirname, fileName);
    writeFileSync(path, dataBuffer);
    console.log(`saved data to ${fileName}`);
}
