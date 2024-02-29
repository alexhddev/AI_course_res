import OpenAI from 'openai'
import { writeFileSync, createReadStream } from 'fs'

const openai = new OpenAI()

async function generateFreeImage() {
    const response = await openai.images.generate({
        prompt: 'A photo of a cat on a mat',
        model: 'dall-e-2',
        style: 'vivid',
        size: '256x256',
        quality: 'standard',
        n: 1
    });
    console.log(response)    
}

async function generateFreeLocalImage() {
    const response = await openai.images.generate({
        prompt: 'A photo of a cat on a mat',
        model: 'dall-e-2',
        style: 'vivid',
        size: '256x256',
        quality: 'standard',
        n: 1,
        response_format: 'b64_json'
    });
    const rawImage = response.data[0].b64_json;
    if (rawImage) {
        writeFileSync('catMat.png', Buffer.from(rawImage, 'base64'))
    }  
}

async function generateAdvancedImage(){
    const response = await openai.images.generate({
        prompt: 'Photo of a city at night with skyscrapers',
        model: 'dall-e-3',
        quality: 'hd',
        size: '1024x1024',
        response_format: 'b64_json'
    })
    const rawImage = response.data[0].b64_json;
    if (rawImage) {
        writeFileSync('city.png', Buffer.from(rawImage, 'base64'))
    }  
}

async function generateImageVariation(){
    const response = await openai.images.createVariation({
        image: createReadStream('city.png'),
        model: 'dall-e-2',
        response_format: 'b64_json',
        n: 1
    })
    const rawImage = response.data[0].b64_json;
    if (rawImage) {
        writeFileSync('cityVariation.png', Buffer.from(rawImage, 'base64'))
    }  
}

async function editImage(){
    const response = await openai.images.edit({
        image: createReadStream('city.png'),
        mask:createReadStream('cityMask.png'),
        prompt: 'add thunderstorm to the city',
        model: 'dall-e-2',
        response_format: 'b64_json'
    })
    const rawImage = response.data[0].b64_json;
    if (rawImage) {
        writeFileSync('cityEdited.png', Buffer.from(rawImage, 'base64'))
    }  
}

editImage()