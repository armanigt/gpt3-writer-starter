import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = "Write me the table of contents for a 5 minute skit designed to be performed by second graders around a camp fire. Each kid should have roughly the same number of lines.";
const generateAction = async (req, res) => {
    console.log(`API: ${basePromptPrefix}${req.body.userInput}`)
  
    const baseCompletion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `${basePromptPrefix}${req.body.userInput}`,
      temperature: 0.8,
      max_tokens: 250,
    });
    
    const basePromptOutput = baseCompletion.data.choices.pop();
  
    // I build Prompt #2.
    const secondPrompt = 
    `
    Write me a detailed script for a 5 minute play to be performed by second graders around a cub scout camp fire based on the title and table of contents below:
  
    ${req.body.userInput}
  
    Table of Contents: ${basePromptOutput.text}
  
    Script:
    `
    
    // I call the OpenAI API a second time with Prompt #2
    const secondPromptCompletion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `${secondPrompt}`,
      // I set a higher temperature for this one. Up to you!
      temperature: 0.85,
          // I also increase max_tokens.
      max_tokens: 1250,
    });
    
    // Get the output
    const secondPromptOutput = secondPromptCompletion.data.choices.pop();
  
    // Send over the Prompt #2's output to our UI instead of Prompt #1's.
    res.status(200).json({ output: secondPromptOutput });
  };
  
  export default generateAction;
