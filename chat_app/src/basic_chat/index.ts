import OpenAI from 'openai';

const openai = new OpenAI();

process.stdin.addListener('data', async function (input) {
    const userInput = input.toString().trim();
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{
            role: 'system',
            content: 'You are a helpful chatbot'
        }, {
            role: 'user',
            content: userInput
        }]
    })
    console.log(response.choices[0].message.content)

})