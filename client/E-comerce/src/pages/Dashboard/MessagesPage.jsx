import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Send, MessageSquare, ArrowLeft, ShoppingBag, ClipboardList, Circle } from 'lucide-react';
import messageService from '../../services/messageService';
import productService from '../../services/productService';
import orderService from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';

const MessagesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const userId = user?._id || user?.id || localStorage.getItem('userId');
  const isDashboard = location.pathname.startsWith('/dashboard');

  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const [sending, setSending] = useState(false);

  // View state for responsive mobile view (either 'list' or 'chat')
  const [mobileView, setMobileView] = useState('list');

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const querySellerId = queryParams.get('sellerId');
  const queryProductId = queryParams.get('productId');
  const queryOrderId = queryParams.get('orderId');

  // 1. Fetch Conversations on Mount and process query parameters
  const fetchChannels = async () => {
    try {
      setError('');
      const data = await messageService.getConversations();
      if (data.success) {
        let loadedConversations = data.conversations || [];
        setConversations(loadedConversations);

        // Check if query params were passed to start a new/existing chat
        if (querySellerId && queryProductId) {
          const existingConv = loadedConversations.find(
            (c) =>
              (c.seller?._id === querySellerId || c.seller === querySellerId) &&
              (c.product?._id === queryProductId || c.product === queryProductId) &&
              (!queryOrderId || c.order?._id === queryOrderId || c.order === queryOrderId)
          );

          if (existingConv) {
            handleSelectChannel(existingConv);
          } else {
            // Fetch product details and order details to create a temporary conversation
            setHistoryLoading(true);
            try {
              const productData = await productService.getProductById(queryProductId);
              let orderData = null;
              if (queryOrderId) {
                orderData = await orderService.getOrderDetails(queryOrderId);
              }

              const tempConv = {
                _id: 'temp-conv',
                buyer: { _id: userId, fullName: user?.fullName },
                seller: { _id: querySellerId, fullName: productData.product?.seller?.fullName || 'Seller' },
                product: { _id: queryProductId, title: productData.product?.title, images: productData.product?.images },
                order: queryOrderId && orderData ? { _id: queryOrderId, orderNumber: orderData.order?.orderNumber } : null,
                lastMessage: '',
                lastMessageTime: new Date(),
                unreadCount: 0,
              };

              setConversations((prev) => [tempConv, ...prev.filter(c => c._id !== 'temp-conv')]);
              setActiveConv(tempConv);
              setMessages([]);
              setMobileView('chat');
            } catch (err) {
              console.error('Failed to prepare temporary conversation:', err);
              setError('Failed to setup message seller details.');
            } finally {
              setHistoryLoading(false);
            }
          }
        } else if (loadedConversations.length > 0 && !activeConv) {
          // If no query params and desktop, auto-select first channel
          if (window.innerWidth >= 768) {
            handleSelectChannel(loadedConversations[0]);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load user channels:', err);
      setError('Failed to load conversations list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchChannels();
    }
  }, [token, location.search]);

  // 2. Select Conversation
  const handleSelectChannel = async (conv) => {
    setActiveConv(conv);
    setOtherTyping(false);
    setMobileView('chat');
    
    if (conv._id === 'temp-conv') {
      setMessages([]);
      return;
    }

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
    if (activeConv && activeConv._id !== 'temp-conv') {
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

    // Handle other user typing status change
    socketRef.current.on('typing_status', (data) => {
      if (activeConv && data.conversation === activeConv._id && data.sender !== userId) {
        setOtherTyping(data.isTyping);
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [activeConv, token, API_URL, userId]);

  // 4. Auto scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, otherTyping]);

  // 5. Send message
  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!inputVal.trim() || !activeConv) return;

    const text = inputVal.trim();
    setInputVal('');
    setSending(true);

    try {
      if (activeConv._id === 'temp-conv') {
        // Send first message - creates conversation dynamically in MongoDB
        const res = await messageService.sendMessage({
          sellerId: activeConv.seller._id,
          productId: activeConv.product._id,
          orderId: activeConv.order?._id || null,
          message: text
        });

        if (res.success) {
          const realConv = res.conversation;
          const sentMsg = res.message;
          
          setActiveConv(realConv);
          setMessages([sentMsg]);
          
          // Clear query params to prevent double temporary rendering on refresh
          navigate(location.pathname, { replace: true });
          
          // Update conversations list state
          setConversations((prev) =>
            prev.map(c => c._id === 'temp-conv' ? realConv : c)
          );
        }
      } else {
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
              sender: userId,
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
      }
    } catch (err) {
      console.error('Failed to dispatch reply:', err);
    } finally {
      setSending(false);
    }
  };

  // 6. Handle Typing Keypress
  const handleTypingText = (e) => {
    setInputVal(e.target.value);
    if (!socketRef.current || !activeConv || activeConv._id === 'temp-conv') return;

    if (!isTyping) {
      setIsTyping(true);
      socketRef.current.emit('typing', {
        conversation: activeConv._id,
        sender: userId,
        isTyping: true,
      });
    }

    const lastTypingTime = new Date().getTime();
    setTimeout(() => {
      const timeNow = new Date().getTime();
      if (timeNow - lastTypingTime >= 2000 && isTyping) {
        socketRef.current.emit('typing', {
          conversation: activeConv._id,
          sender: userId,
          isTyping: false,
        });
        setIsTyping(false);
      }
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center select-none font-sans">
        <p className="text-slate-400 font-bold text-xs animate-pulse">Connecting support center...</p>
      </div>
    );
  }

  // Helper to resolve conversation party details
  const getConvDetails = (c) => {
    const isMeBuyer = c.buyer?._id === userId || c.buyer === userId;
    const otherParty = isMeBuyer ? c.seller : c.buyer;
    return {
      name: otherParty?.fullName || 'User',
      role: isMeBuyer ? 'Seller' : 'Buyer',
      productTitle: c.product?.title || 'General Enquiry',
      productImage: c.product?.images?.[0] || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=100&q=80',
      orderNumber: c.order?.orderNumber || null
    };
  };

  const pageContent = (
    <div className="space-y-6 select-none font-sans">
      
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-sm font-black text-slate-900 tracking-tight uppercase">Messages Hub</h2>
        <p className="text-xs text-slate-400 font-semibold">Communicate with buyers and sellers regarding orders and product listings.</p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-650 text-xs font-bold p-3.5 rounded-lg animate-fadeIn">
          {error}
        </div>
      )}

      {conversations.length > 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden h-[550px] flex shadow-xs">
          
          {/* Left Conversational Sidebar */}
          <div className={`${mobileView === 'chat' ? 'hidden md:flex' : 'flex'} w-full md:w-1/3 border-r border-slate-200 flex-col bg-slate-50/20`}>
            <div className="p-3 border-b border-slate-100 bg-white shrink-0">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Conversations Ledger</span>
            </div>

            <div className="flex-grow overflow-y-auto divide-y divide-slate-100">
              {conversations.map((c) => {
                const isSelected = activeConv?._id === c._id;
                const hasUnread = c.unreadCount > 0;
                const details = getConvDetails(c);
                
                return (
                  <button
                    key={c._id}
                    onClick={() => handleSelectChannel(c)}
                    className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors ${
                      isSelected ? 'bg-slate-100 text-slate-950' : 'bg-transparent text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {/* Product Image Thumbnail / Avatar */}
                    <img 
                      src={details.productImage} 
                      alt={details.productTitle} 
                      className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0 bg-white"
                    />
                    
                    <div className="flex-grow min-w-0 flex flex-col justify-between h-10">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold truncate max-w-[130px] text-slate-900">{details.name}</span>
                        <span className="text-[8px] text-slate-400 font-bold">
                          {new Date(c.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold truncate leading-none">
                        <span className="truncate max-w-[140px]">{details.productTitle}</span>
                        {hasUnread && (
                          <span className="px-1.5 py-0.5 bg-slate-950 text-white rounded text-[8px] font-black leading-none shrink-0">
                            {c.unreadCount}
                          </span>
                        )}
                      </div>
                      
                      <div className="text-[8px] text-slate-400 flex items-center gap-1 leading-none">
                        <span className="bg-slate-200/60 text-slate-600 px-1 rounded font-bold uppercase tracking-wider">{details.role}</span>
                        {details.orderNumber && <span className="font-bold">Order #{details.orderNumber}</span>}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Active chat conversation panel */}
          <div className={`${mobileView === 'list' ? 'hidden md:flex' : 'flex'} w-full md:w-2/3 flex-col bg-white`}>
            {activeConv ? (
              <>
                {/* Active Chat Header */}
                <div className="p-3 border-b border-slate-200 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    {/* Mobile Back Button */}
                    <button 
                      onClick={() => setMobileView('list')}
                      className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-650 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    
                    {/* User Info details */}
                    <div>
                      <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                        {getConvDetails(activeConv).name}
                        <span className="inline-block text-[8px] font-extrabold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                          {getConvDetails(activeConv).role}
                        </span>
                      </h4>
                      <div className="flex items-center gap-1 text-[8px] text-emerald-500 font-bold mt-0.5">
                        <Circle className="w-1.5 h-1.5 fill-emerald-500 text-emerald-500" />
                        <span>Online</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product + Order Context Banner */}
                <div className="bg-slate-50 border-b border-slate-200 p-3 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <ShoppingBag className="w-4 h-4 text-slate-400 shrink-0" />
                    <div className="text-[10px] text-slate-500 leading-normal font-semibold truncate">
                      <span className="font-bold text-slate-800">Product:</span> {getConvDetails(activeConv).productTitle}
                    </div>
                  </div>
                  {getConvDetails(activeConv).orderNumber && (
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded shadow-2xs shrink-0">
                      <ClipboardList className="w-3 h-3 text-slate-450" />
                      <span className="font-bold text-slate-700">Order #{getConvDetails(activeConv).orderNumber}</span>
                    </div>
                  )}
                </div>

                {/* Messages Flow */}
                <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/10">
                  {historyLoading ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-[10px] text-slate-455 font-bold animate-pulse">Syncing chat history...</p>
                    </div>
                  ) : messages.length > 0 ? (
                    messages.map((m, idx) => {
                      const isMe = m.sender === userId;
                      const senderName = isMe 
                        ? 'You' 
                        : getConvDetails(activeConv).name;

                      return (
                        <div 
                          key={idx} 
                          className={`flex flex-col max-w-[75%] gap-0.5 ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                        >
                          <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider block mb-0.5 px-0.5">
                            {senderName}
                          </span>
                          <div className={`p-2.5 rounded-lg text-xs leading-relaxed font-semibold border ${
                            isMe 
                              ? 'bg-slate-950 text-white border-slate-900 rounded-tr-none shadow-3xs' 
                              : 'bg-white text-slate-700 border-slate-200 rounded-tl-none shadow-3xs'
                          }`}>
                            {m.message}
                          </div>
                          <span className="text-[7px] text-slate-400 font-bold px-0.5 flex items-center gap-1.5 mt-0.5">
                            {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {isMe && (
                              <span className={m.isRead ? 'text-blue-500 font-black' : 'text-slate-400'}>
                                {m.isRead ? 'Read' : 'Sent'}
                              </span>
                            )}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-1">
                      <MessageSquare className="w-8 h-8 text-slate-250 animate-bounce" />
                      <p className="text-slate-900 font-bold text-xs">Direct Merchant Message</p>
                      <p className="text-slate-400 text-[9px] font-semibold leading-relaxed max-w-xs">
                        {activeConv._id === 'temp-conv' 
                          ? `Start a conversation with this ${getConvDetails(activeConv).role === 'Seller' ? 'Seller' : 'Buyer'}.`
                          : 'No messages exchange yet.'}
                      </p>
                    </div>
                  )}

                  {otherTyping && (
                    <div className="text-slate-400 text-[9px] font-bold animate-pulse px-0.5">
                      {getConvDetails(activeConv).name} is typing...
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Footer */}
                <form onSubmit={handleSendReply} className="p-3 border-t border-slate-200 flex gap-2 shrink-0 bg-white">
                  <input 
                    type="text" 
                    placeholder="Type message reply..."
                    value={inputVal}
                    onChange={handleTypingText}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold border border-slate-200 focus:border-slate-400 bg-slate-50 focus:bg-white rounded-lg focus:outline-none placeholder-slate-350 text-slate-700 font-sans transition-all"
                  />
                  <button
                    type="submit"
                    disabled={sending || !inputVal.trim()}
                    className="px-4 py-2.5 bg-slate-950 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer shrink-0 flex items-center justify-center"
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
        <div className="bg-white border border-slate-200 p-12 text-center rounded-lg shadow-3xs flex flex-col items-center justify-center space-y-2.5">
          <MessageSquare className="w-8 h-8 text-slate-250" />
          <p className="text-slate-800 text-xs font-bold">No conversations yet.</p>
          <p className="text-[9px] text-slate-400 mt-1 max-w-xs leading-relaxed font-semibold">When buyers initiate a conversation using 'Message Seller', they will appear in this ledger.</p>
        </div>
      )}

    </div>
  );

  if (isDashboard) {
    return pageContent;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {pageContent}
      </div>
    </div>
  );
};

export default MessagesPage;
