'use client';
 
import { useChat } from 'ai/react';
// default value for api is /api/chat
const options = {api: '/api/vertex-gen-ai'};
export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat(options);
  console.log(messages)
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map(m => {
        return (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User ' : 'AI:'}
          <span className="text-xs text-neutral-400">{m.createdAt?.toLocaleTimeString()}</span>
          <br />
          {m.content}
        </div>
      )})}
       
      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}