import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faHome } from "@fortawesome/free-solid-svg-icons";

// Components
import Link from "./Link";
import Flex from "./Flex";

const Header = props => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sm:flex sm:justify-between sm:items-center sm:px-4 sm:py-3 bg-purple-800">
      <Flex itemsCenter justifyBetween className="px-4 py-3 sm:p-0">
        <Link
          to="/"
          className="active:outline text-gray-200 hover:text-gray-300 hover:underline focus:underline flex items-center text-3xl"
        >
          <FontAwesomeIcon icon={faHome} />
          <span className="font-medium pl-4 text-logo">CGN</span>
        </Link>
        <div className="sm:hidden ml-auto">
          <button
            type="button"
            onClick={toggleMenu}
            className="block text-gray-500 hover:text-gray-600 focus:text-gray-600"
          >
            <FontAwesomeIcon
              icon={isMenuOpen ? faTimes : faBars}
              className="text-3xl"
            />
          </button>
        </div>
      </Flex>
      {props.children}
    </header>
  );
};

export default Header;
