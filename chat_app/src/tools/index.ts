import OpenAI from "openai";

const openAI = new OpenAI();

async function callOpenAIWithTools() {
    const context: OpenAI.Chat.ChatCompletionMessageParam[] = [
        {
            role: 'system',
            content: 'You are a helpful assistant that gives information about the time of day'
        },
        {
            role: 'user',
            content: 'What is the time of day?'
        }
    ]

    // configure chat tools (first openAI call)
    const response = await openAI.chat.completions.create({
        model: 'gpt-3.5-turbo-0613',
        messages: context
    })    
    console.log(response.choices[0].message.content)
}

callOpenAIWithTools();



// decide if tool call is required
// invoke the tool
// make a second openAI call with the tool response