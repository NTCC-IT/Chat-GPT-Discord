// Set the requirements the bot needs to function
const { Client, Intents } = require('discord.js');
const axios = require('axios');
require('dotenv').config();


// Create the client or bot with its intents
const client = new Client({
     intents: [
        Intents.FLAGS.GUILDS, 
        Intents.FLAGS.GUILD_MESSAGES
        ] 
});


// Configure Open ai so to communicate with chat gpt
const OPENAI_API_KEY = process.env.openaikey;
const OPENAI_URL = 'https://api.openai.com/v1/completions';


// Make an async function to do all the communicating ( I asked chat gpt to do this ironically )
async function ChatGptResponse(messageContent) {
    try {
        const response = await axios.post(OPENAI_URL, {
            model: 'text-davinci-003',  // You can change the model as needed
            prompt: messageContent,
            max_tokens: 150,
            temperature: 0.7,
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            }
        });

        // Return the text of the response
        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error('Error communicating with OpenAI:', error);
        return 'Sorry, I encountered an error while processing your request.';
    }
}


// The Bot with start and prompt the client owner that it has started
client.once('ready', () => {
    console.log(`${client.user.tag} is Ready!`)
    client.user.setPresence({
        status: PresenceUpdateStatus.Online,
        activities: [{name: 'Listening', type: ActivityType.Watching}]
    });
});

// The bot will listen for messages in the specified message channel and send message to and from chat gpt via node fetch
client.on('messageCreate', async (message) =>{
    if(message.channelId !== process.env.chatchannel){
        if( message.author.bot) return;
        // Run the function created eariler
        const chatGptResponse = await getChatGptResponse(message.content);

        // Send the result to whoever messages
        message.reply(chatGptResponse);

    }
})

// The super secret token created at https://discord.com/developers/applications for the client aka the bot
client.login(process.env.token);