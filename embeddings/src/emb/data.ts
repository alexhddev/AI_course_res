import OpenAI from 'openai'

const openai = new OpenAI();

async function generateEmbeddings(input: string| string[]){
    const response = await openai.embeddings.create({
        input: input,
        model: 'text-embedding-3-small'
    })
    console.log(response.data[0].embedding)
    return response;
}

generateEmbeddings(['Cat is on the roof', 'Dog is on the car'])