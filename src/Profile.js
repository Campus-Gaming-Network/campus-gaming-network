import React, { Component } from "react";
import { Link } from "@reach/router";
import { FaDiscord, FaSteam, FaXbox, FaPlaystation } from "react-icons/fa";

class Profile extends Component {
  render() {
    return (
      <article className="p-8 max-w-md mx-auto">
        <section className="text-center">
          <img
            src="https://picsum.photos/100/100/?image=1027"
            alt="Profile"
            className="rounded-full"
          />
          <div>
            <h1 className="text-white mt-4">Jane Doe</h1>
            <h3 className="block text-grey-dark font-normal">
              Illinois Institute of Technology
            </h3>
          </div>
        </section>
        <section className="mt-8">
          <div className="pl-1 flex items-center justify-center">
            <span className="flex rounded-full bg-grey-darkest py-2 px-4 items-center mr-3">
              <FaDiscord className="text-grey text-md mr-2" />
              <span className="text-white text-xs">jdoe#3981</span>
            </span>
            <span className="flex rounded-full bg-grey-darkest py-2 px-4 items-center mr-3">
              <FaSteam className="text-grey mr-2" />
              <span className="text-white text-xs">jdoe1</span>
            </span>
            <span className="flex rounded-full bg-grey-darkest py-2 px-4 items-center mr-3">
              <FaXbox className="text-grey mr-2" />
              <span className="text-white text-xs">jdoe25</span>
            </span>
            <span className="flex rounded-full bg-grey-darkest py-2 px-4 items-center">
              <FaPlaystation className="text-grey mr-2" />
              <span className="text-white text-xs">jdoe3</span>
            </span>
          </div>
        </section>
        <section className="mt-10">
          <div className="pl-1">
            <h3 className="text-grey-darker font-medium pb-2 text-sm">Major</h3>
            <p className="text-grey-lightest">
              Information Technology &amp; Management (4th year)
            </p>
          </div>
        </section>
        <section className="mt-10">
          <div className="pl-1">
            <h3 className="text-grey-darker font-medium pb-2 text-sm">Bio</h3>
            <p className="text-grey-lightest pb-4">
              Jane Doe is a 20-year-old intelligence researcher who enjoys
              swimming, baking and cookery. She is gentle and giving, but can
              also be very rude and a bit unfriendly.
            </p>
            <p className="text-grey-lightest pb-4">
              She is an Afghan Christian who defines herself as straight. She
              finished school and then left academia. She has a severe phobia of
              buttons Physically, Jenny is in pretty good shape.
            </p>
            <p className="text-grey-lightest pb-4">
              She is average-height with cocao skin, black hair and brown eyes.
            </p>
          </div>
        </section>
        <section className="mt-10">
          <div className="pl-1">
            <h3 className="text-grey-darker font-medium pb-2 text-sm">
              Favorite Games
            </h3>
            <ul className="list-reset flex justify-center justify-around flex-wrap">
              <li className="flex justify-center items-center p-2 pl-0">
                <img
                  className="rounded-lg h-24 shadow-lg"
                  src="https://images.igdb.com/igdb/image/upload/t_cover_big/lxoumgqbbj3erxgq6a6l.jpg"
                  alt="The video game cover for League of Legends"
                />
              </li>
              <li className="flex w-1/5 justify-center items-center p-2">
                <img
                  className="rounded-lg h-24 shadow-lg"
                  src="https://images.igdb.com/igdb/image/upload/t_cover_big/hjfe6xe6k5oqprn8vnkz.jpg"
                  alt="The video game cover for Call of Duty 2"
                />
              </li>
              <li className="flex w-1/5 justify-center items-center p-2">
                <img
                  className="rounded-lg h-24 shadow-lg"
                  src="https://images.igdb.com/igdb/image/upload/t_cover_big/yfk9f2lbo0r7slytuhra.jpg"
                  alt="The video game cover for Red Dead Redemption 2"
                />
              </li>
              <li className="flex w-1/5 justify-center items-center p-2">
                <img
                  className="rounded-lg h-24 shadow-lg"
                  src="https://images.igdb.com/igdb/image/upload/t_cover_big/co1hjh.jpg"
                  alt="The video game cover for EarthBound"
                />
              </li>
              <li className="flex w-1/5 justify-center items-center p-2 pr-0">
                <img
                  className="rounded-lg h-24 shadow-lg"
                  src="https://images.igdb.com/igdb/image/upload/t_cover_big/obcjdcsaq2ndxqi7zqdf.jpg"
                  alt="The video game cover for Half-Life 2"
                />
              </li>
            </ul>
          </div>
        </section>
        <section className="mt-16 text-center">
          <Link
            to="/account/profile"
            className="text-xs no-underline font-medium uppercase inline-block px-3 py-2 border rounded text-white border-grey-darker hover:border-grey-dark"
          >
            EDIT PROFILE
          </Link>
        </section>
      </article>
    );
  }
}

export default Profile;
