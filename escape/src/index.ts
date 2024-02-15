import { HfInference } from '@huggingface/inference'

const inference = new HfInference(
    process.env.HF_TOKEN
)

async function embed() {

    const output = await inference.featureExtraction({
        inputs: 'My Cool Embeddings',
        model: 'BAAI/bge-small-en-v1.5'
    });

    console.log(output)    
}
embed()