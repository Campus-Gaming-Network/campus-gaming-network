import React from "react";

export default ({
  className = "",
  loadingText,
  isLoading,
  children,
  ...props
}) => {
  const classNames = [
    "w-full focus:shadow-outline bg-orange hover:bg-orange-light hover:border-orange border-b-4 border-orange-dark text-white font-medium py-4 px-4 rounded",
    ...(props.disabled || isLoading ? ["opacity-75 cursor-not-allowed"] : [""]),
    className
  ].join(" ");

  return (
    <button {...props} className={classNames}>
      {isLoading ? loadingText : children}
    </button>
  );
};
