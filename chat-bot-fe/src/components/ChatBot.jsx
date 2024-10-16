import React, { useState } from 'react';
import axios from 'axios';
import { AiOutlineSend } from 'react-icons/ai';
import { FiMoon, FiSun } from 'react-icons/fi'; // Import icons for dark and light mode

const ChatBot = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false); // State for theme

  const handleSubmit = async (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default behavior (new line)
      await sendMessage();
    }
  };

  const sendMessage = async () => {
    setLoading(true);
    setError('');

    // Add the user's message to the chat
    setMessages(prev => [...prev, { text: prompt, type: 'user' }]);

    try {
      const res = await axios.post('http://localhost:3000/generate', { prompt });
      // Add the bot's response to the chat
      setMessages(prev => [...prev, { text: res.data.response, type: 'bot' }]);
      setPrompt(''); // Clear the input
    } catch (err) {
      setError('An error occurred while generating content.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <div className={`bg-white w-full max-w-md p-4 rounded-md shadow-md flex flex-col ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
        <h1 className="text-2xl font-bold mb-4 flex items-center justify-between">
          <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Chat Bot</span>
          <button onClick={toggleTheme} className="text-gray-500 focus:outline-none">
            {isDarkMode ? <FiSun size={24} className="text-yellow-500" /> : <FiMoon size={24} />}
          </button>
        </h1>
        <div className="flex-grow overflow-auto mb-4 h-[70vh]" style={{ maxHeight: '70vh' }}>
          <div className="flex flex-col space-y-2 overflow-auto scrollbar-hidden" style={{ maxHeight: '100%' }}>
            {messages.map((msg, index) => (
              <div key={index} className={`p-2 rounded-md ${msg.type === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-gray-300 text-black self-start'}`}>
                {msg.text}
              </div>
            ))}
          </div>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex">
          <textarea
            value={prompt}
            onKeyDown={handleSubmit}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your message..."
            rows="2"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-500 text-white p-2 rounded-md ml-2 focus:outline-none ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
          >
            <AiOutlineSend size={24} />
          </button>
        </form>
      </div>
      {error && <p className="mt-2 text-red-500">{error}</p>}
      
      <style jsx>{`
        .scrollbar-hidden::-webkit-scrollbar {
          display: none; /* Safari and Chrome */
        }
        .scrollbar-hidden {
          -ms-overflow-style: none; /* Internet Explorer and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </div>
  );
};

export default ChatBot;
