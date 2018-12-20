import React from "react";

export default ({
  className = "",
  loadingText,
  isLoading,
  children,
  unstyled,
  ...props
}) => {
  let classNames = [
    "focus:shadow-outline text-white",
    ...(props.disabled || isLoading ? ["opacity-75 cursor-not-allowed"] : [""]),
    className
  ];

  if (!unstyled) {
    classNames.push(
      "w-full bg-orange hover:bg-orange-light hover:border-orange border-b-4 border-orange-dark font-medium py-4 px-4 rounded"
    );
  }

  return (
    <button {...props} className={classNames.join(" ")}>
      {isLoading ? loadingText : children}
    </button>
  );
};
