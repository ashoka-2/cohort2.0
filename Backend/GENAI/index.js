
// import "dotenv/config"
// import readline from "readline/promises"
// import { ChatMistralAI } from "@langchain/mistralai"
// import { HumanMessage, tool, createAgent } from "langchain";
// import { sendEmail } from "./src/services/mail.service.js";
// import { tavily } from "@tavily/core";
// import * as z from "zod";

// const tvly = new tavily({
//     apiKey: process.env.TAVILY_API_KEY
// });

// const searchTool = tool(
//     async ({query}) =>  {
//         const res = await fetch("https://api.tavily.com/search", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },

//             body:JSON.stringify({
//                 api_key: process.env.TAVILY_API_KEY,
//                 query: query,
//                 search_depth: "basic"
//             })
//         })
//         const data = await res.json()
//         return data.results.map(result => `${result.title}: ${result.link}`).join("\n")
//     },
//     {
//         name: "searchInternet",
//         description: "search the internet fot latest news or information",
//         schema: z.object({
//             query: z.string()
//         })
//     }
// )


// const emailTool = tool(
//     sendEmail,
//     {
//         name: "emailTool",
//         description: "Use this tool to send an email",
//         schema: z.object({
//             to: z.string().describe("The recipient's email address"),
//             html: z.string().describe("The HTML content of the email"),
//             subject: z.string().describe("The subject of the email"),
//         })
//     }
// )

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

// const model = new ChatMistralAI({
//     model: "mistral-small-latest",
// })

// const agent = createAgent({
//     model,
//     tools:[ emailTool,searchTool ]
// })

// const messages = []

// while (true) {
//     const userInput = await rl.question("\x1b[32mYou: \x1b[0m ")
//     // console.log(`\x1b[32m[You]\x1b[0m ${userInput}`);

//     messages.push(new HumanMessage(userInput))
    

//     const response = await agent.invoke({messages})

//     const aiMessage = response.messages[ response.messages.length - 1]

//     messages.push(aiMessage)

//     // console.log(response);
    

//     console.log(`\x1b[34m[AI]: \x1b[0m ${aiMessage.content}`);
// }



// rl.close()


import "dotenv/config"
import readline from "readline/promises"
import { ChatMistralAI } from "@langchain/mistralai"
import { HumanMessage, tool, createAgent } from "langchain";
import { sendEmail } from "./src/services/mail.service.js";
import * as z from "zod";

const today = new Date().toLocaleDateString('en-IN', { 
    timeZone: 'Asia/Kolkata',
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' ,
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
});

const searchTool = tool(
    async ({query}) =>  {
        const res = await fetch("https://api.tavily.com/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify({
                api_key: process.env.TAVILY_API_KEY,
                query: query,
                search_depth: "basic"
            })
        })
        const data = await res.json();
        
        return data.results.map(result => `Title: ${result.title}\nDetails: ${result.content}`).join("\n\n");
    },
    {
        name: "searchInternet",
        description: "Search the internet for the latest news, current events, or real-time information.",
        schema: z.object({
            query: z.string()
        })
    }
)

const emailTool = tool(
    sendEmail,
    {
        name: "emailTool",
        description: "Use this tool to send an email",
        schema: z.object({
            to: z.string().describe("The recipient's email address"),
            html: z.string().describe("The HTML content of the email"),
            subject: z.string().describe("The subject of the email"),
        })
    }
)

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const model = new ChatMistralAI({
    model: "mistral-small-latest",
    temperature: 0
})

const agent = createAgent({
    model,
    tools:[ emailTool, searchTool ],
    systemMessage: `You are a helpful AI assistant. 
    CRITICAL: Today's date is ${today}. Your internal training data ends in 2023. 
    You MUST use the 'searchInternet' tool for any questions about current events, dates, or recent news. 
    When answering, summarize the facts from the search results. DO NOT just give the user a list of links.`
})

const messages = []

console.log("\nStart chatting (type 'exit' to quit):");

while (true) {
    const userInput = await rl.question("\x1b[32mYou: \x1b[0m ");
    if (userInput.toLowerCase() === "exit") break;

   

    const groundedInput = `[System Note: Time is ${today}]. User says: ${userInput}`;
    messages.push(new HumanMessage(groundedInput));

    let aiText = "";
    let success = false;
    let attempts = 0;
    const maxRetries = 2; 

    while (attempts < maxRetries && !success) {
        try {
            attempts++;
            const response = await agent.invoke({messages});
            const aiMessage = response.messages[response.messages.length - 1];

            if (typeof aiMessage.content === 'string') {
                aiText = aiMessage.content;
            } else if (Array.isArray(aiMessage.content)) {
                aiText = aiMessage.content
                    .filter(item => item.type === 'text')
                    .map(item => item.text)
                    .join(" ");
            }

            messages.push(aiMessage); 
            success = true; 

        } catch (error) {
            if (attempts >= maxRetries) {
                aiText = "I'm currently updating my search data. Please ask your question one more time.";
            }
        }
    }

    console.log(`\x1b[34m[AI]: \x1b[0m ${aiText}\n`);
}

rl.close()