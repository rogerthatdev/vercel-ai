import { 
  HarmBlockThreshold,
  HarmCategory,
  VertexAI,
} from "@google-cloud/vertexai";

import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from 'ai';


const project = 'border-collie-0324';
const location = 'us-central1';
const textModel =  'gemini-1.0-pro';

const vertexAI = new VertexAI({project: project, location: location});

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

// Instantiate Gemini models
const generativeModel = vertexAI.getGenerativeModel({
  model: textModel,
  // The following parameters are optional
  // They can also be passed to individual content generation requests
  safetySettings: [{category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE}],
  generationConfig: {maxOutputTokens: 256},
});

const buildGenAIprompt = (messages: Message[]) => ({
  contents: messages
    .filter(message => message.role === 'user' || message.role === 'assistant')
    .map(message => ({
      role: message.role === 'user' ? 'user' : 'model',
      parts: [{ text: message.content }],
    })),
});

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  // const { messages } = await req.json();
  const {messages} = await req.json();
  const geminiStream = await generativeModel.generateContentStream(buildGenAIprompt(messages)) 
  // // Convert the response into a friendly text-stream
  // //  GoogleGenerativeAIStream class decodes/extracts the text tokens in the response and then re-encodes them properly for simple consumption.
  const stream = GoogleGenerativeAIStream(geminiStream);
 
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
