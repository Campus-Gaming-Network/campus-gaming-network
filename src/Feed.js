import React, { Component } from "react";
import { Link } from "@reach/router";
import { FaArrowRight } from "react-icons/fa";

class Feed extends Component {
  render() {
    return (
      <article>
        <section className="p-8 max-w-3xl mx-auto text-center">
          <h1 className="text-white">Your Feed</h1>
        </section>
        <section className="p-8 max-w-3xl mx-auto">
          <h2 className="text-white font-medium">
            <span className="text-grey-dark text-base block font-normal pb-2">
              Latest Activity
            </span>
            Illinois Institute of Technology
          </h2>
          <div className="pt-2">
            <ul className="list-reset">
              <li className="my-6 w-1/2">
                <div className="flex items-center">
                  <img
                    src="https://picsum.photos/40/40/?image=1062"
                    alt="Profile"
                    className="shadow rounded-full"
                  />
                  <p className="text-white font-bold pl-4 text-sm">
                    <Link
                      to="/user/jkrasinski"
                      className="no-underline text-white hover:underline"
                    >
                      John Krasinski
                    </Link>{" "}
                    <span className="text-grey-light font-light">
                      posted an announcement.
                    </span>
                  </p>
                </div>
                <div className="mt-4">
                  <p className="py-4 px-6 text-lg text-white bg-grey-darkest rounded-full">
                    "Don’t forget to RSVP for the pizza party by Friday!"
                  </p>
                </div>
              </li>
              <li className="my-6 w-1/2">
                <div className="flex items-center">
                  <img
                    src="https://picsum.photos/40/40/?image=967"
                    alt="Profile"
                    className="shadow rounded-full"
                  />
                  <p className="text-white font-bold pl-4 text-sm">
                    <Link
                      to="/user/rgosling"
                      className="no-underline text-white hover:underline"
                    >
                      Ryan Gosling
                    </Link>{" "}
                    <span className="text-grey-light font-light">
                      left a comment.
                    </span>
                  </p>
                </div>
              </li>
              <li className="my-6 w-1/2">
                <div className="flex items-center">
                  <img
                    src="https://picsum.photos/40/40/?image=856"
                    alt="Profile"
                    className="shadow rounded-full"
                  />
                  <p className="text-white font-bold pl-4 text-sm">
                    <Link
                      to="/user/estone"
                      className="no-underline text-white hover:underline"
                    >
                      Emma Stone
                    </Link>{" "}
                    <span className="text-grey-light font-light">
                      created a event.
                    </span>
                  </p>
                  <Link
                    to="/event/833e9d47-b2a3-4c28-988d-6ea936209cb2"
                    className="pl-2 no-underline text-orange-dark flex items-center"
                  >
                    view
                    <FaArrowRight className="text-xs ml-1" />
                  </Link>
                </div>
              </li>
              <li className="my-6 w-1/2">
                <div className="flex items-center">
                  <img
                    src="https://picsum.photos/40/40/?image=815"
                    alt="Profile"
                    className="shadow rounded-full"
                  />
                  <p className="text-white font-bold pl-4 text-sm">
                    <Link
                      to="/user/ksutherland"
                      className="no-underline text-white hover:underline"
                    >
                      Kiefer Sutherland
                    </Link>{" "}
                    <span className="text-grey-light font-light">
                      left a comment.
                    </span>
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </section>
      </article>
    );
  }
}

export default Feed;
