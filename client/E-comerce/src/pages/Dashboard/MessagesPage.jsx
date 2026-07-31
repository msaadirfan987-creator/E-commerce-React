import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Send, MessageSquare } from 'lucide-react';
import messageService from '../../services/messageService';
import { useAuth } from '../../context/AuthContext';

const MessagesPage = () => {
  const { token, user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [buyerTyping, setBuyerTyping] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // 1. Fetch Conversations on Mount
  const fetchChannels = async () => {
    try {
      const data = await messageService.getConversations();
      if (data.success) {
        setConversations(data.conversations || []);
        
        // Auto select first channel if none is selected
        if (data.conversations?.length > 0 && !activeConv) {
          handleSelectChannel(data.conversations[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load merchant channels:', err);
      setError('Failed to load conversations ledger.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchChannels();
    }
  }, [token]);

  // 2. Select Conversation
  const handleSelectChannel = async (conv) => {
    setActiveConv(conv);
    setBuyerTyping(false);
    
    try {
      setHistoryLoading(true);
      const res = await messageService.getMessages(conv._id);
      if (res.success) {
        setMessages(res.messages || []);
      }
      
      // Reset unread count locally and in DB
      setConversations((prev) =>
        prev.map((c) => (c._id === conv._id ? { ...c, unreadCount: 0 } : c))
      );
      await messageService.markAsRead(conv._id);
    } catch (err) {
      console.error('Failed to fetch messages for conversation:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  // 3. Socket.IO Listeners
  useEffect(() => {
    if (!token) return;

    socketRef.current = io(API_URL);

    // Join room when active conversation changes
    if (activeConv) {
      socketRef.current.emit('join_room', activeConv._id);
    }

    // Handle new message reception
    socketRef.current.on('receive_message', (messageData) => {
      // If message is for the currently open conversation
      if (activeConv && messageData.conversation === activeConv._id) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === messageData._id)) return prev;
          return [...prev, messageData];
        });
        messageService.markAsRead(activeConv._id).catch(console.error);
      } else {
        // Increment unread count for other conversations
        setConversations((prev) =>
          prev.map((c) =>
            c._id === messageData.conversation
              ? { ...c, unreadCount: (c.unreadCount || 0) + 1, lastMessage: messageData.message, lastMessageTime: messageData.createdAt }
              : c
          )
        );
      }
    });

    // Handle buyer typing status change
    socketRef.current.on('typing_status', (data) => {
      if (activeConv && data.conversation === activeConv._id && data.sender !== user._id) {
        setBuyerTyping(data.isTyping);
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [activeConv, token, API_URL, user]);

  // 4. Auto scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, buyerTyping]);

  // 5. Send message
  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!inputVal.trim() || !activeConv) return;

    const text = inputVal.trim();
    setInputVal('');

    try {
      const res = await messageService.sendMessage({
        conversationId: activeConv._id,
        message: text,
      });

      if (res.success) {
        const sentMsg = res.message;
        setMessages((prev) => [...prev, sentMsg]);

        // Broadcast to receiver via socket
        if (socketRef.current) {
          socketRef.current.emit('send_message', sentMsg);
          socketRef.current.emit('typing', {
            conversation: activeConv._id,
            sender: user._id,
            isTyping: false,
          });
        }

        // Update list preview
        setConversations((prev) =>
          prev.map((c) =>
            c._id === activeConv._id
              ? { ...c, lastMessage: text, lastMessageTime: new Date().toISOString() }
              : c
          )
        );

        setIsTyping(false);
      }
    } catch (err) {
      console.error('Failed to dispatch reply:', err);
    }
  };

  // 6. Handle Typing Keypress
  const handleTypingText = (e) => {
    setInputVal(e.target.value);
    if (!socketRef.current || !activeConv) return;

    if (!isTyping) {
      setIsTyping(true);
      socketRef.current.emit('typing', {
        conversation: activeConv._id,
        sender: user._id,
        isTyping: true,
      });
    }

    const lastTypingTime = new Date().getTime();
    setTimeout(() => {
      const timeNow = new Date().getTime();
      if (timeNow - lastTypingTime >= 2000 && isTyping) {
        socketRef.current.emit('typing', {
          conversation: activeConv._id,
          sender: user._id,
          isTyping: false,
        });
        setIsTyping(false);
      }
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center select-none">
        <p className="text-slate-400 font-bold text-xs animate-pulse font-sans">Connecting support center...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 select-none animate-fadeIn font-sans">
      
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-sm font-black text-slate-900 tracking-tight uppercase">Customer Messages</h2>
        <p className="text-xs text-slate-400 font-semibold">Answer buyer queries and moderate incoming catalog inquiries.</p>
      </div>

      {conversations.length > 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden h-[520px] flex shadow-xs">
          
          {/* Left Conversational Sidebar */}
          <div className="w-1/3 border-r border-slate-200 flex flex-col bg-slate-50/20">
            <div className="p-3 border-b border-slate-100 bg-white">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Active Conversations</span>
            </div>

            <div className="flex-grow overflow-y-auto divide-y divide-slate-100">
              {conversations.map((c) => {
                const buyerName = c.buyer?.fullName || 'Buyer Client';
                const isSelected = activeConv?._id === c._id;
                const hasUnread = c.unreadCount > 0;
                
                return (
                  <button
                    key={c._id}
                    onClick={() => handleSelectChannel(c)}
                    className={`w-full text-left p-3.5 flex flex-col gap-1 transition-colors ${
                      isSelected ? 'bg-slate-100 text-slate-950' : 'bg-transparent text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold truncate max-w-[120px]">{buyerName}</span>
                      <span className="text-[8px] text-slate-400 font-bold">
                        {new Date(c.lastMessageTime).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate leading-normal font-semibold">
                      {c.lastMessage}
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-[7px] uppercase tracking-wider font-bold text-slate-400">Order #{c.order?.orderNumber}</span>
                      {hasUnread && (
                        <span className="px-1.5 py-0.5 bg-slate-950 text-white rounded text-[8px] font-black leading-none">
                          {c.unreadCount}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Active chat conversation panel */}
          <div className="w-2/3 flex flex-col bg-white">
            {activeConv ? (
              <>
                {/* Active Chat Header */}
                <div className="p-3 border-b border-slate-200 flex items-center justify-between shrink-0">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{activeConv.buyer?.fullName}</h4>
                    <p className="text-[9px] text-slate-400 font-semibold mt-0.5">
                      Order Number: #{activeConv.order?.orderNumber} <span className="text-slate-200">|</span> Status: {activeConv.order?.orderStatus}
                    </p>
                  </div>
                </div>

                {/* Messages Flow */}
                <div className="flex-grow overflow-y-auto p-4 space-y-3.5 custom-scrollbar bg-slate-50/10">
                  {historyLoading ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-[10px] text-slate-450 font-bold animate-pulse">Syncing chat history...</p>
                    </div>
                  ) : messages.length > 0 ? (
                    messages.map((m, idx) => {
                      const isMe = m.sender === user._id;
                      return (
                        <div 
                          key={idx} 
                          className={`flex flex-col max-w-[75%] gap-0.5 ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                        >
                          <div className={`p-2.5 rounded-lg text-xs leading-relaxed font-semibold border ${
                            isMe 
                              ? 'bg-slate-950 text-white border-slate-900 rounded-tr-none' 
                              : 'bg-white text-slate-700 border-slate-200 rounded-tl-none'
                          }`}>
                            {m.message}
                          </div>
                          <span className="text-[7px] text-slate-400 font-bold px-0.5">
                            {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {isMe && (
                              <span className="ml-1.5">
                                {m.isRead ? 'Read' : 'Sent'}
                              </span>
                            )}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-slate-400 text-xs font-semibold">No messages exchange yet.</p>
                    </div>
                  )}

                  {buyerTyping && (
                    <div className="text-slate-400 text-[9px] font-bold animate-pulse">
                      Buyer is typing...
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Footer */}
                <form onSubmit={handleSendReply} className="p-3 border-t border-slate-200 flex gap-2 shrink-0">
                  <input 
                    type="text" 
                    placeholder="Type message reply..."
                    value={inputVal}
                    onChange={handleTypingText}
                    className="w-full px-3 py-2 text-xs font-semibold border border-slate-200 focus:border-slate-400 bg-slate-50/50 rounded-lg focus:outline-none placeholder-slate-300 text-slate-700 font-sans"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
                <MessageSquare className="w-8 h-8 text-slate-300" />
                <p className="text-slate-400 text-xs font-semibold">Please select a channel to read logs.</p>
              </div>
            )}
          </div>

        </div>
      ) : (
        <div className="bg-white border border-slate-200 p-12 text-center rounded-lg">
          <p className="text-slate-400 text-xs font-bold">No Conversations Found</p>
          <p className="text-[10px] text-slate-400 mt-1">When buyers initiate a conversation using 'Contact Seller', they will appear in this log.</p>
        </div>
      )}

    </div>
  );
};

export default MessagesPage;
