import OpenAI from "openai";

const openAI = new OpenAI();

function getTimeOfDay(){
    return '5:45'
}

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
        messages: context,
        tools: [
            {
                type: 'function',
                function: {
                    name: 'getTimeOfDay',
                    description: 'Get the time of day'
                }
            }
        ],
        tool_choice: 'auto'// the engine will decide which tool to use
    });
    // decide if tool call is required  
    const willInvokeFunction = response.choices[0].finish_reason == 'tool_calls'
    const toolCall = response.choices[0].message.tool_calls![0]
    
    if (willInvokeFunction) {
        const toolName = toolCall.function.name

        if (toolName == 'getTimeOfDay') {
            const toolResponse = getTimeOfDay();
            context.push(response.choices[0].message);
            context.push({
                role: 'tool',
                content: toolResponse,
                tool_call_id: toolCall.id
            })
        }
    }

    const secondResponse = await openAI.chat.completions.create({
        model: 'gpt-3.5-turbo-0613',
        messages: context
    })
    console.log(secondResponse.choices[0].message.content)

}

callOpenAIWithTools();



// decide if tool call is required
// invoke the tool
// make a second openAI call with the tool response