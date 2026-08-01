import React from 'react';

const MapSection = () => {
  return (
    <section className="w-full bg-white select-none py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="w-full h-80 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 relative">
          {/* We use a standard Embed map for San Francisco as a clean placeholder */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m18!1m2!1s0x8085807d68e826b9%3A0xe67b458c0c45681a!2sVercel!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Cartify Office Map"
            className="filter grayscale contrast-125 opacity-90 hover:opacity-100 transition-opacity duration-300"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
