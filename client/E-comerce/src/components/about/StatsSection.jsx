import React, { useEffect, useState } from 'react';

const CountUp = ({ to, duration = 1500, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(to);
    if (isNaN(end)) return;
    if (start === end) return;

    const totalMiliseconds = duration;
    let incrementTime = Math.abs(Math.floor(totalMiliseconds / end));
    if (incrementTime < 16) incrementTime = 16; // limit to roughly 60fps

    const timer = setInterval(() => {
      start += Math.ceil(end / (totalMiliseconds / incrementTime));
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [to, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
};

const StatsSection = () => {
  const stats = [
    { label: 'Happy Customers', value: 15000, suffix: '+' },
    { label: 'Trusted Sellers', value: 350, suffix: '+' },
    { label: 'Products Listed', value: 45000, suffix: '+' },
    { label: 'Orders Delivered', value: 24000, suffix: '+' }
  ];

  return (
    <section className="w-full py-12 bg-slate-900 text-white select-none border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                <CountUp to={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
