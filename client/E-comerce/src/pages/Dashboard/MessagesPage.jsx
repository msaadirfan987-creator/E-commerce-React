import React, { useState } from 'react';

const MessagesPage = () => {
  const [chats, setChats] = useState([
    { id: 1, name: 'Sarah Connor', email: 'sarah@example.com', lastMsg: 'Is the mechanical keyboard hot-swappable?', time: '3m ago', unread: true },
    { id: 2, name: 'John Smith', email: 'john@example.com', lastMsg: 'Thank you for shipping the order early!', time: '2h ago', unread: false },
    { id: 3, name: 'Bob Vance', email: 'bob@vance.com', lastMsg: 'Can I request a custom bulk pricing quote?', time: '1d ago', unread: false }
  ]);

  const [activeChat, setActiveChat] = useState(chats[0]);
  const [messages, setMessages] = useState([
    { sender: 'client', text: 'Hi, I had a question about the mechanical keyboard.', time: '10:30 AM' },
    { sender: 'merchant', text: 'Hello! Sure, feel free to ask your query.', time: '10:32 AM' },
    { sender: 'client', text: 'Is the mechanical keyboard hot-swappable?', time: '10:34 AM' }
  ]);

  const [inputVal, setInputVal] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    setMessages([...messages, {
      sender: 'merchant',
      text: inputVal.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);

    setChats(chats.map(c => {
      if (c.id === activeChat.id) {
        return { ...c, lastMsg: inputVal.trim(), time: 'Just now' };
      }
      return c;
    }));

    setInputVal('');
  };

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Customer Messages</h2>
        <p className="text-xs text-slate-400 font-bold">Answer buyer questions and moderate catalog inquiries.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden h-[500px] flex shadow-xs">
        
        {/* Left Chats Sidebar */}
        <div className="w-1/3 border-r border-slate-200 flex flex-col bg-slate-50/30">
          <div className="p-3 border-b border-slate-100 bg-white">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Active Conversations</span>
          </div>

          <div className="flex-grow overflow-y-auto divide-y divide-slate-100">
            {chats.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setActiveChat(c);
                  if (c.unread) {
                    setChats(chats.map(ch => ch.id === c.id ? { ...ch, unread: false } : ch));
                  }
                }}
                className={`w-full text-left p-3.5 flex flex-col gap-1 transition-colors ${
                  activeChat.id === c.id ? 'bg-slate-100 text-slate-900' : 'bg-transparent text-slate-650 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold truncate max-w-[100px]">{c.name}</span>
                  <span className="text-[8px] text-slate-400 font-semibold">{c.time}</span>
                </div>
                <p className="text-[10px] text-slate-400 truncate leading-normal font-medium">
                  {c.lastMsg}
                </p>
                {c.unread && (
                  <span className="w-1.5 h-1.5 bg-slate-950 rounded-full mt-1.5 self-end" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right Active Chat Panel */}
        <div className="w-2/3 flex flex-col bg-white">
          {/* Header */}
          <div className="p-3 border-b border-slate-200 flex items-center justify-between shrink-0">
            <div>
              <h4 className="text-xs font-bold text-slate-800">{activeChat.name}</h4>
              <p className="text-[9px] text-slate-400 font-semibold mt-0.5">{activeChat.email}</p>
            </div>
          </div>

          {/* Messages Flow */}
          <div className="flex-grow overflow-y-auto p-4 space-y-3.5 custom-scrollbar bg-slate-50/20">
            {messages.map((m, i) => {
              const isMerchant = m.sender === 'merchant';
              return (
                <div 
                  key={i} 
                  className={`flex flex-col max-w-[70%] gap-1 ${isMerchant ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                >
                  <div className={`p-2.5 rounded-lg text-xs leading-relaxed font-semibold border ${
                    isMerchant 
                      ? 'bg-slate-900 text-white border-slate-800' 
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}>
                    {m.text}
                  </div>
                  <span className="text-[8px] text-slate-400 font-semibold px-1">{m.time}</span>
                </div>
              );
            })}
          </div>

          {/* Text Input Footer */}
          <form onSubmit={handleSend} className="p-3.5 border-t border-slate-200 flex gap-2 shrink-0">
            <input 
              type="text" 
              placeholder="Type message reply..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold border border-slate-200 focus:border-slate-400 bg-slate-50/50 rounded-lg focus:outline-none placeholder-slate-300 text-slate-700"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer shrink-0"
            >
              Send
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};

export default MessagesPage;
