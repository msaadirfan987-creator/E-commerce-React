import React, { useState } from 'react';
import contactService from '../../services/contactService';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await contactService.submitContactForm(formData);
      if (response.success) {
        setSuccess(response.message || 'Message submitted successfully.');
        setFormData({
          fullName: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        setError(response.message || 'Failed to submit form details.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Connection issue submitting details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-white select-none py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 sm:p-8 shadow-3xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Send us a Message
            </h2>
            <p className="text-[11px] text-slate-400 font-bold mt-0.5">
              Fill in the form fields below and our admin team will reach out.
            </p>
          </div>

          {success && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold p-3.5 rounded-lg animate-fadeIn">
              {success}
            </div>
          )}

          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-650 text-xs font-bold p-3.5 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-lg bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-450 focus:outline-none focus:border-slate-400 focus:bg-white transition-all"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-lg bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-450 focus:outline-none focus:border-slate-400 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                required
                placeholder="How can we help you?"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-lg bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-450 focus:outline-none focus:border-slate-400 focus:bg-white transition-all"
              />
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                Message Description
              </label>
              <textarea
                name="message"
                required
                rows="5"
                placeholder="Type your message description here..."
                value={formData.message}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-lg bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-450 focus:outline-none focus:border-slate-400 focus:bg-white transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-2.5 text-white font-bold text-xs bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 rounded-lg shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? 'Sending message...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
