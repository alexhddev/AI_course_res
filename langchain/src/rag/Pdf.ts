import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'

const model = new ChatOpenAI({
    modelName: 'gpt-3.5-turbo',
    temperature: 0.7,
});

const question = "What themes does Gone with the Wind explore?";

async function main() {

    // create the loader:
    const loader = new PDFLoader('books.pdf', {
        splitPages: false
    });
    const docs = await loader.load();

    // split the docs:
    const splitter = new RecursiveCharacterTextSplitter({
        separators: [`. \n`]
    });

    const splittedDocs = await splitter.splitDocuments(docs);



    // store the data
    const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings());
    await vectorStore.addDocuments(splittedDocs);

    // create data retriever:
    const retriever = vectorStore.asRetriever({
        k: 2
    });

    // get relevant documents:
    const results = await retriever.getRelevantDocuments(question);
    const resultDocs = results.map(
        result => result.pageContent
    );

    //build template:
    const template = ChatPromptTemplate.fromMessages([
        ['system', 'Answer the users question based on the following context: {context}'],
        ['user', '{input}']
    ]);

    const chain = template.pipe(model);

    const response = await chain.invoke({
        input: question,
        context: resultDocs
    });

    console.log(response.content)    
}

main();