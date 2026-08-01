import React, { useState } from 'react';

const ImageLoader = ({ src, alt, className = '', placeholderClassName = 'bg-slate-100', imgClassName = '', onError, ...props }) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && (
        <div className={`absolute inset-0 ${placeholderClassName} animate-pulse`} />
      )}
      <img
        {...props}
        src={failed ? 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=300&q=80' : src}
        alt={alt}
        loading="lazy"
        className={`w-full h-full object-cover transition-all duration-500 ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          setFailed(true);
          setLoaded(true);
          if (onError) onError(e);
        }}
      />
    </div>
  );
};

export default ImageLoader;
