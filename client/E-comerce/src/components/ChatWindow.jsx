import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Send, X, ArrowDown } from 'lucide-react';
import messageService from '../services/messageService';
import { useAuth } from '../context/AuthContext';

const ChatWindow = ({ orderId, sellerName, onClose }) => {
  const { user } = useAuth();
  const userId = user?._id || user?.id || localStorage.getItem('userId');

  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState(null);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [receiverTyping, setReceiverTyping] = useState(false);

  const socketRef = useRef(null);

  const getSenderName = (senderId) => {
    if (senderId === userId) return `${user?.fullName || 'You'} (You)`;
    if (conversation) {
      if (conversation.buyer && (senderId === conversation.buyer._id || senderId === conversation.buyer)) {
        return conversation.buyer.fullName || 'Buyer';
      }
      if (conversation.seller && (senderId === conversation.seller._id || senderId === conversation.seller)) {
        return conversation.seller.fullName || sellerName || 'Seller';
      }
    }
    return sellerName || 'Support';
  };
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem('token');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // 1. Fetch conversation and history
  useEffect(() => {
    const initChat = async () => {
      try {
        setLoading(true);
        // Find existing conversation for this order
        const convData = await messageService.getConversations();
        const existingConv = convData.conversations?.find(c => c.order?._id === orderId);

        if (existingConv) {
          setConversation(existingConv);
          // Fetch message history
          const msgData = await messageService.getMessages(existingConv._id);
          if (msgData.success) {
            setMessages(msgData.messages || []);
          }
          // Mark as read
          await messageService.markAsRead(existingConv._id);
        }
      } catch (err) {
        console.error('Failed to init chat window:', err);
        setError('Error loading message history.');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      initChat();
    }
  }, [orderId]);

  // 2. Setup Socket Connection
  useEffect(() => {
    if (!conversation) return;

    // Connect to Socket.IO server
    socketRef.current = io(API_URL);

    // Join the private conversation room
    socketRef.current.emit('join_room', conversation._id);

    // Listen for new messages
    socketRef.current.on('receive_message', (messageData) => {
      if (messageData.conversation === conversation._id) {
        setMessages((prev) => {
          // Prevent duplicates
          if (prev.some((m) => m._id === messageData._id)) return prev;
          return [...prev, messageData];
        });
        // Auto mark as read
        messageService.markAsRead(conversation._id).catch(console.error);
      }
    });

    // Listen for typing indicator
    socketRef.current.on('typing_status', (data) => {
      if (data.sender !== userId) {
        setReceiverTyping(data.isTyping);
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [conversation, API_URL]);

  // 3. Auto Scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, receiverTyping]);

  // 4. Typing Indicator
  const handleTyping = (e) => {
    setInputVal(e.target.value);
    if (!socketRef.current || !conversation) return;

    if (!isTyping) {
      setIsTyping(true);
      socketRef.current.emit('typing', {
        conversation: conversation._id,
        sender: userId,
        isTyping: true,
      });
    }

    // Debounce clear typing
    const lastTypingTime = new Date().getTime();
    setTimeout(() => {
      const timeNow = new Date().getTime();
      if (timeNow - lastTypingTime >= 2000 && isTyping) {
        socketRef.current.emit('typing', {
          conversation: conversation._id,
          sender: userId,
          isTyping: false,
        });
        setIsTyping(false);
      }
    }, 2000);
  };

  // 5. Send Message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const messageText = inputVal.trim();
    setInputVal('');
    setSending(true);

    try {
      if (conversation) {
        // Clear old message errors before sending
        setError('');

        // Send via REST and emit via Socket
        const res = await messageService.sendMessage({
          conversationId: conversation._id,
          message: messageText,
        });

        if (res.success) {
          const sentMsg = res.message;
          setMessages((prev) => [...prev, sentMsg]);
          if (socketRef.current) {
            socketRef.current.emit('send_message', sentMsg);
            socketRef.current.emit('typing', {
              conversation: conversation._id,
              sender: userId,
              isTyping: false,
            });
          }
          setIsTyping(false);
        }
      } else {
        // First message - creates conversation
        const res = await messageService.sendMessage({
          orderId,
          message: messageText,
        });

        if (res.success) {
          setConversation(res.conversation);
          setMessages([res.message]);
        }
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Message delivery failed.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 sm:w-96 h-[450px] bg-white border border-slate-200 shadow-2xl rounded-xl flex flex-col overflow-hidden select-none font-sans animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-950 text-white p-3.5 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider">{sellerName}</h4>
          <span className="text-[8px] text-emerald-400 font-bold block mt-0.5 animate-pulse">Online Support Channel</span>
        </div>
        <button 
          onClick={onClose} 
          className="text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/40">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-slate-400 text-[10px] font-bold animate-pulse">Connecting support history...</p>
          </div>
        ) : error ? (
          <div className="h-full flex items-center justify-center p-4 text-center">
            <p className="text-rose-500 text-[10px] font-bold">{error}</p>
          </div>
        ) : messages.length > 0 ? (
          messages.map((m, idx) => {
            const isMe = m.sender === userId;
            const senderLabel = getSenderName(m.sender);
            return (
              <div 
                key={idx} 
                className={`flex flex-col max-w-[80%] gap-0.5 ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}
              >
                <span className="text-[8px] font-semibold text-slate-500 uppercase tracking-wide">
                  {senderLabel}
                </span>
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
                    <span className="ml-1.5 text-slate-400">
                      {m.isRead ? 'Read' : 'Sent'}
                    </span>
                  )}
                </span>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-1">
            <p className="text-slate-900 font-bold text-xs">Direct Merchant Message</p>
            <p className="text-slate-400 text-[9px] font-semibold">Start the dialogue regarding this order. Only you and the seller can view these logs.</p>
          </div>
        )}

        {receiverTyping && (
          <div className="text-slate-400 text-[9px] font-bold animate-pulse">
            {conversation?.seller?._id === userId ? 'Buyer is typing...' : 'Seller is typing...'}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Form Footer */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 flex gap-2 bg-white">
        <input 
          type="text" 
          placeholder="Send a private reply..."
          value={inputVal}
          onChange={handleTyping}
          className="flex-grow px-3 py-2 text-xs font-semibold border border-slate-200 bg-slate-50 focus:border-slate-400 rounded-lg focus:outline-none text-slate-800 placeholder-slate-350"
        />
        <button 
          type="submit"
          disabled={sending}
          className={`p-2 rounded-lg shadow-sm transition-colors shrink-0 ${sending ? 'bg-slate-500 cursor-not-allowed' : 'bg-slate-950 hover:bg-slate-800 text-white'}`}
        >
          {sending ? <span className="text-[10px] font-bold">Sending...</span> : <Send className="w-3.5 h-3.5" />}
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
