import React from "react";

const ErrorMessage = ({ errors, errorKey }) => {
  return (
    <div className="h-5 mt-1">
      {errors?.[errorKey] && (
        <span className="text-sm text-red-600 ml-2">{errors?.[errorKey]}</span>
      )}
    </div>
  );
};

export default ErrorMessage;
