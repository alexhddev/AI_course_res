import { readFileSync, writeFileSync } from 'fs';
import OpenAI from 'openai'
import { join } from 'path';

const openai = new OpenAI();

type DataWithEmbeddings = {
    input: string,
    embedding: number[]
}

async function generateEmbeddings(input: string| string[]){
    const response = await openai.embeddings.create({
        input: input,
        model: 'text-embedding-3-small'
    })
    console.log(response.data[0].embedding)
    return response;
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

async function main(){
    const data = loadJSONData<string[]>('data.json');
    const embeddings = await generateEmbeddings(data);
    const dataWithEmbeddings: DataWithEmbeddings[] = [];
    for(let i = 0; i < data.length; i++){
        dataWithEmbeddings.push({
            input: data[i],
            embedding: embeddings.data[i].embedding
        })
    }
    saveDataToJsonFile(dataWithEmbeddings, 'dataWithEmbeddings.json')
}

main();