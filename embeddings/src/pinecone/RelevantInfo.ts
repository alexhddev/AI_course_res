import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from "openai";

const pc = new Pinecone({
    apiKey: process.env.PINECONE_KEY!
});
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!
});

const studentInfo = `Alexandra Thompson, a 19-year-old computer science sophomore with a 3.7 GPA,
is a member of the programming and chess clubs who enjoys pizza, swimming, and hiking
in her free time in hopes of working at a tech company after graduating from the University of Washington.`;

const clubInfo = `The university chess club provides an outlet for students to come together and enjoy playing
the classic strategy game of chess. Members of all skill levels are welcome, from beginners learning
the rules to experienced tournament players. The club typically meets a few times per week to play casual games,
participate in tournaments, analyze famous chess matches, and improve members' skills.`;

const universityInfo = `The University of Washington, founded in 1861 in Seattle, is a public research university
with over 45,000 students across three campuses in Seattle, Tacoma, and Bothell.
As the flagship institution of the six public universities in Washington state,
UW encompasses over 500 buildings and 20 million square feet of space,
including one of the largest library systems in the world.`;

type Info = {
    info: string;
    reference: string;
    relevance: number;
}

const dataToEmbed: Info[] = [
    {
        info: studentInfo,
        reference: "some student 123",
        relevance: 0.9
    },
    {
        info: clubInfo,
        reference: "some club 456",
        relevance: 0.8
    },
    {
        info: universityInfo,
        reference: "some university 789",
        relevance: 0.7
    }, 
]

const pcIndex = pc.index<Info>('cool-index');

async function storeEmbeddings(){
    await Promise.all(
        dataToEmbed.map(async (item, index) =>{
            const embeddingResult = await openai.embeddings.create({
                model: 'text-embedding-3-small',
                input: item.info
            });
            const embedding = embeddingResult.data[0].embedding;
            
            await pcIndex.upsert([{
                id: `id-${index}`,
                values: embedding,
                metadata: item
            }])
        })
    );
}

async function queryEmbeddings(question: string){
    const questionEmbeddingResult = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: question
    });
    const questionEmbedding = questionEmbeddingResult.data[0].embedding;

    const queryResult = await pcIndex.query({
        vector: questionEmbedding,
        topK: 1,
        includeMetadata: true,
        includeValues: true
    });

    return queryResult;
}

async function askOpenAI(question: string, relevantInfo: string){
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        temperature: 0,
        messages: [{
            role: 'assistant',
            content: `Answer the next question using this information: ${relevantInfo}` // context injection
        },
        {
            role:'user',
            content: question
        }]
    })
    const responseMessage = response.choices[0].message;
    console.log(responseMessage);
}

async function main() {
    const question = 'What does Alexandra Thompson like to do in her free time?';
    const result = await queryEmbeddings(question);
    const relevantInfo = result.matches[0].metadata
    if (relevantInfo) {
        askOpenAI(question, relevantInfo.info)
    }
}

main();
