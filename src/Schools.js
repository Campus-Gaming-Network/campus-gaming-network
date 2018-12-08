import React, { Component } from "react";
import { Link } from "@reach/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Schools extends Component {
  render() {
    return (
      <article>
        <section className="p-8 w-full">
          <h1 className="text-white">Schools</h1>
          <p className="text-white">
            When this page renders, query the database for the list of schools
            that have been registered.
          </p>
          <ul className="list-reset flex flex-wrap">
            <li className="lg:w-1/4 md:1/2 p-2">
              <div className="bg-grey-darker text-sm shadow p-4 rounded-lg mt-4">
                <h4 className="text-white font-hairline mb-2">
                  Illinois Institute of Technology
                </h4>
                <span className="text-xs rounded-full bg-grey-dark text-grey-light py-1 px-2">
                  13
                  <FontAwesomeIcon icon="user" className="ml-2 text-xs" />
                </span>
              </div>
            </li>
            <li className="lg:w-1/4 md:1/2 p-2">
              <div className="bg-grey-darker text-sm shadow p-4 rounded-lg mt-4">
                <h4 className="text-white font-hairline mb-2">
                  Northern Illinois University
                </h4>
                <span className="text-xs rounded-full bg-grey-dark text-grey-light py-1 px-2">
                  24
                  <FontAwesomeIcon icon="user" className="ml-2 text-xs" />
                </span>
              </div>
            </li>{" "}
            <li className="lg:w-1/4 md:1/2 p-2">
              <div className="bg-grey-darker text-sm shadow p-4 rounded-lg mt-4">
                <h4 className="text-white font-hairline mb-2">
                  South Illinois University - Carbondale
                </h4>
                <span className="text-xs rounded-full bg-grey-dark text-grey-light py-1 px-2">
                  7
                  <FontAwesomeIcon icon="user" className="ml-2 text-xs" />
                </span>
              </div>
            </li>{" "}
            <li className="lg:w-1/4 md:1/2 p-2">
              <div className="bg-grey-darker text-sm shadow p-4 rounded-lg mt-4">
                <h4 className="text-white font-hairline mb-2">
                  University of Chicago
                </h4>
                <span className="text-xs rounded-full bg-grey-dark text-grey-light py-1 px-2">
                  4
                  <FontAwesomeIcon icon="user" className="ml-2 text-xs" />
                </span>
              </div>
            </li>{" "}
            <li className="lg:w-1/4 md:1/2 p-2">
              <div className="bg-grey-darker text-sm shadow p-4 rounded-lg mt-4">
                <h4 className="text-white font-hairline mb-2">
                  Florida State University
                </h4>
                <span className="text-xs rounded-full bg-grey-dark text-grey-light py-1 px-2">
                  999
                  <FontAwesomeIcon icon="user" className="ml-2 text-xs" />
                </span>
              </div>
            </li>{" "}
            <li className="lg:w-1/4 md:1/2 p-2">
              <div className="bg-grey-darker text-sm shadow p-4 rounded-lg mt-4">
                <h4 className="text-white font-hairline mb-2">
                  Massachusetts Institute of Technology
                </h4>
                <span className="text-xs rounded-full bg-grey-dark text-grey-light py-1 px-2">
                  1
                  <FontAwesomeIcon icon="user" className="ml-2 text-xs" />
                </span>
              </div>
            </li>{" "}
            <li className="lg:w-1/4 md:1/2 p-2">
              <div className="bg-grey-darker text-sm shadow p-4 rounded-lg mt-4">
                <h4 className="text-white font-hairline mb-2">ITT Tech</h4>
                <span className="text-xs rounded-full bg-grey-dark text-grey-light py-1 px-2">
                  68
                  <FontAwesomeIcon icon="user" className="ml-2 text-xs" />
                </span>
              </div>
            </li>
          </ul>
        </section>
      </article>
    );
  }
}

export default Schools;
