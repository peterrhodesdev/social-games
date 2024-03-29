import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Disclosure } from "@headlessui/react";
import { MenuIcon, UserCircleIcon, XIcon } from "@heroicons/react/outline";
import { usePlayer } from "../../contexts/UserContext";
import { ExpandedLinks } from "./ExpandedLinks";
import { CollapsedLinks } from "./CollapsedLinks";

// Style colors defined here so can be easily updated
const TITLE_STYLE = "text-gray-300";
const DISCLOSURE_STYLE = "bg-gray-500";
const LINK_STYLE = "text-gray-100 hover:bg-gray-700 hover:text-white";

const links = [
  { key: "lobby", text: "Lobby", to: "/" },
  {
    key: "guides",
    text: "Guides",
    to: "/guide/",
    subLinks: [
      { key: "math-grid", text: "Math Grid" },
      { key: "nine-letter-word", text: "Nine Letter Word" },
    ],
  },
];

function Header() {
  const { player } = usePlayer();

  return (
    <Disclosure as="nav" className={DISCLOSURE_STYLE}>
      {({ open }) => (
        <>
          {/* Expanded */}
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button
                  className={`${LINK_STYLE} inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white`}
                >
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex items-center">
                  <span className={`${TITLE_STYLE} font-bold`}>
                    Social Games
                  </span>
                </div>
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-4">
                    <ExpandedLinks links={links} linkStyle={LINK_STYLE} />
                  </div>
                </div>
              </div>
              <div className="right-0 select-none cursor-pointer">
                <Link
                  to="/user"
                  className={`${LINK_STYLE} flex flex-row items-center px-3 py-3 rounded-md text-sm font-medium`}
                >
                  <div className="mr-2">
                    {player ? player.name : "connecting..."}
                  </div>
                  <UserCircleIcon
                    className="block h-6 w-6"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* Collapsed */}
          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <CollapsedLinks links={links} linkStyle={LINK_STYLE} />
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

export { Header };
