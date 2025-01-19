import React from 'react';

export const Alert = ({ variant = "default", className, children, ...props }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    destructive: "bg-red-100 text-red-800",
    success: "bg-green-100 text-green-800"
  };

  return (
    <div 
      role="alert"
      className={`rounded-lg p-4 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const AlertDescription = ({ className, children, ...props }) => {
  return (
    <div 
      className={`text-sm ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};