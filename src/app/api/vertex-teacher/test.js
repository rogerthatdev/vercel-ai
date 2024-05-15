const {VertexAI} = require('@google-cloud/vertexai');

// Initialize Vertex with your Cloud project and location
const vertex_ai = new VertexAI({project: 'border-collie-0324', location: 'us-central1'});
const model = 'gemini-1.5-pro-preview-0514';

// Instantiate the models
const generativeModel = vertex_ai.preview.getGenerativeModel({
  model: model,
  generationConfig: {
    'maxOutputTokens': 8192,
    'temperature': 1,
    'topP': 0.95,
  },
  safetySettings: [
    {
        'category': 'HARM_CATEGORY_HATE_SPEECH',
        'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
    },
    {
        'category': 'HARM_CATEGORY_DANGEROUS_CONTENT',
        'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
    },
    {
        'category': 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
    },
    {
        'category': 'HARM_CATEGORY_HARASSMENT',
        'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
    }
  ],
  systemInstruction: {
    parts: [{"text": `you are a 3rd grade teacher named Mr. T`}]
  },
});


async function generateContent() {
  const req = {
    contents: [
      {role: 'user', parts: [{text: `What's your name`}]}
    ],
  };
  console.log(req)
  const streamingResp = await generativeModel.generateContentStream(req);

  for await (const item of streamingResp.stream) {
    // process.stdout.write('stream chunk: ' + JSON.stringify(item) + '\n');
  }

//   process.stdout.write('aggregated response: ' + JSON.stringify(await streamingResp.response));
}

generateContent();
