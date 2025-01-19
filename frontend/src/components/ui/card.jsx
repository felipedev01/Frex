import React from 'react';

export const Card = ({ className, children, ...props }) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

export const CardContent = ({ className, children, ...props }) => {
  return (
    <div 
      className={`p-4 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};