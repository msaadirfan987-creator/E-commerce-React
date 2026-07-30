import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const ProductTabs = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('description'); 

  // Detailed Specifications Metadata Map
  const tabDataRepository = {
    "1": {
      desc: "Experience studio-quality sound with our advanced wireless headphones. Featuring hybrid active noise cancellation, ambient pass-through mode, and up to 40 hours of battery life on a single charge.",
      specs: [{ key: 'Driver Size', val: '40mm Dynamic' }, { key: 'Bluetooth', val: '5.2 Premium' }, { key: 'Battery', val: 'Up to 40 Hours' }]
    },
    "2": {
      desc: "A sleek, minimalist timepiece designed for everyday elegance. Genuine leather strap, scratch-resistant sapphire glass, and Japanese quartz movement architecture.",
      specs: [{ key: 'Strap Material', val: 'Genuine Leather' }, { key: 'Water Resistance', val: '30m (3 ATM)' }, { key: 'Movement', val: 'Japanese Quartz' }]
    },
    "3": {
      desc: "Tactile mechanical switches for ultimate speed and typing comfort. Hot-swappable keys, customizable RGB lighting, and robust aluminum top frame construct.",
      specs: [{ key: 'Switch Type', val: 'Mechanical (Brown)' }, { key: 'Layout', val: 'Tenkeyless (TKL)' }, { key: 'Backlight', val: 'Per-Key RGB' }]
    },
    "4": {
      desc: "Capture adventures in stunning 4K clarity. Waterproof up to 30m with casing, advanced electronic image stabilization, and dual crisp high-frame screens.",
      specs: [{ key: 'Resolution', val: '4K Ultra HD' }, { key: 'Stabilization', val: 'EIS 2.0' }, { key: 'Waterproof', val: 'Up to 30m with case' }]
    },
    "5": {
      desc: "Deeply hydrating facial serum enriched with pure hyaluronic acid and antioxidant vitamins. Locks in moisture for glowing, plumped, and youthful look.",
      specs: [{ key: 'Volume', val: '50ml' }, { key: 'Skin Type', val: 'All Skin Types' }, { key: 'Key Ingredient', val: 'Hyaluronic Acid' }]
    },
    "6": {
      desc: "Track steps, sleep tracking indexes, continuous heart rate, and 20+ sports active modes. Lightweight sleek waterproof tracker shell design build.",
      specs: [{ key: 'Display', val: '1.47" AMOLED' }, { key: 'Battery life', val: 'Up to 10 Days' }, { key: 'Waterproof Rating', val: '5 ATM' }]
    }
  };

  const currentTabData = tabDataRepository[id] || tabDataRepository["1"];

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mt-8 select-none">
      
      {/* Navigation Tabs Bar */}
      <div className="flex gap-4 border-b border-slate-100 pb-3 mb-6 overflow-x-auto">
        {['description', 'specifications', 'reviews'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-bold capitalize pb-2 transition-all border-b-2 px-2 shrink-0 ${activeTab === tab ? 'border-[#03045e] text-[#03045e]' : 'border-transparent text-slate-400'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Dynamic Content Switching Logic */}
      <div>
        {activeTab === 'description' && (
          <div className="text-slate-600 text-sm leading-relaxed">
            <p>{currentTabData.desc}</p>
          </div>
        )}

        {activeTab === 'specifications' && (
          <div className="max-w-md flex flex-col gap-2">
            {currentTabData.specs.map((spec, i) => (
              <div key={i} className="flex justify-between py-2 border-b border-slate-50 text-xs font-semibold">
                <span className="text-slate-400">{spec.key}</span>
                <span className="text-[#03045e]">{spec.val}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="flex flex-col gap-4">
            <div className="border-b border-slate-50 pb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-sm text-[#03045e]">Zeeshan Ahmed</span>
                <span className="text-xs text-amber-500">★★★★★</span>
              </div>
              <p className="text-xs text-slate-500">Bohot zabardast product hai, delivery bhi on-time mili. Highly recommended!</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default ProductTabs;