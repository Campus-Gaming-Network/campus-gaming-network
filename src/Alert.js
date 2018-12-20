import React from "react";

export default ({ children, className }) => {
  const classNames = [
    "bg-orange-lightest border-l-4 border-orange text-orange-dark p-2",
    className
  ].join(" ");
  return (
    <div className={classNames} role="alert">
      {children}
    </div>
  );
};
