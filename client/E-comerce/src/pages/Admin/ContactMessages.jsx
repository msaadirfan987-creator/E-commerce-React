import React, { useState, useEffect } from 'react';
import { Search, Mail, Calendar, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import contactService from '../../services/contactService';

const ContactMessages = () => {
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const fetchMessages = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await contactService.getContactMessages();
      if (data.success) {
        setMessages(data.contacts || []);
      } else {
        setError(data.message || 'Failed to load contact messages.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error reaching contact endpoints.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMessages();
    }
  }, [token]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch = msg.fullName.toLowerCase().includes(search.toLowerCase()) ||
                          msg.email.toLowerCase().includes(search.toLowerCase()) ||
                          msg.subject.toLowerCase().includes(search.toLowerCase()) ||
                          msg.message.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-base font-black text-slate-900 tracking-tight uppercase">Contact Enquiries</h2>
        <p className="text-xs text-slate-400 font-bold">Review inquiries, suggestions, and customer support contact messages saved in MongoDB.</p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-650 text-xs font-bold p-3.5 rounded-lg animate-fadeIn">
          {error}
        </div>
      )}

      {/* Search Filter Controls */}
      <div className="bg-white border border-slate-200 p-4 rounded-lg flex items-center justify-between gap-4 shadow-xs">
        <div className="w-full sm:max-w-xs flex items-center rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1.5 focus-within:border-slate-400">
          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <input 
            type="text" 
            placeholder="Search by sender, email, subject..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-2 text-xs font-semibold bg-transparent focus:outline-none text-slate-700 placeholder-slate-450"
          />
        </div>
      </div>

      {/* Messages Directory Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Sender Info</th>
                <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Subject</th>
                <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Submitted Date</th>
                <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-right">Message Body</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-xs font-bold text-slate-400 animate-pulse">
                    Loading contact inquiries...
                  </td>
                </tr>
              ) : filteredMessages.length > 0 ? (
                filteredMessages.map((msg) => {
                  const isExpanded = expandedId === msg._id;
                  return (
                    <React.Fragment key={msg._id}>
                      <tr className="hover:bg-slate-50/20 transition-colors">
                        {/* Sender details */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-900">{msg.fullName}</span>
                            <span className="text-[10px] text-slate-400 font-semibold">{msg.email}</span>
                          </div>
                        </td>

                        {/* Subject */}
                        <td className="py-3.5 px-4 text-xs font-bold text-slate-750 max-w-xs truncate">
                          {msg.subject}
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-4 text-[11px] font-semibold text-slate-500">
                          {new Date(msg.createdAt).toLocaleString()}
                        </td>

                        {/* Details toggler */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => toggleExpand(msg._id)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                          >
                            <span>{isExpanded ? 'Collapse' : 'Read Msg'}</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr>
                          <td colSpan="4" className="bg-slate-50/50 px-6 py-4 border-t border-slate-100">
                            <div className="space-y-2 text-left">
                              <p className="text-[10px] font-extrabold text-slate-450 uppercase tracking-widest flex items-center gap-1.5">
                                <MessageSquare className="w-3.5 h-3.5" /> Message Details
                              </p>
                              <div className="bg-white border border-slate-205/60 p-4 rounded-lg text-xs font-semibold text-slate-650 leading-relaxed whitespace-pre-wrap shadow-2xs">
                                {msg.message}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-xs font-bold text-slate-400">
                    No matching messages found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContactMessages;
