import React from "react";

export default ({ children }) => {
  return (
    <div
      className="bg-teal-lightest border-l-4 border-teal text-teal-dark p-4"
      role="alert"
    >
      {children}
    </div>
  );
};
