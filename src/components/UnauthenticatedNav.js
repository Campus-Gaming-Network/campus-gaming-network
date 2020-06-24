import React from "react";

// Components
import Link from "./Link";

const UnauthenticatedNav = () => {
  const [isMenuOpen] = React.useState(false);

  return (
    <nav
      role="navigation"
      className={`${
        isMenuOpen ? "block" : "hidden"
      } px-2 pt-2 pb-4 sm:flex items-center sm:p-0`}
    >
      <Link
        to="/login"
        className="text-xl block mx-3 py-1 active:outline sm:rounded hover:underline focus:underline"
      >
        Log In
      </Link>
      <Link
        to="/register"
        className="text-xl mt-1 block ml-3 rounded font-bold text-white bg-purple-700 py-1 px-3 hover:underline focus:underline sm:mt-0 sm:ml-2"
      >
        Sign Up Free
      </Link>
    </nav>
  );
};

export default UnauthenticatedNav;
