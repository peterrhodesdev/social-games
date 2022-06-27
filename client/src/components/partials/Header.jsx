import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Disclosure } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";

const TITLE = "Social Games";
const TITLE_STYLE = "text-gray-100 font-bold";
const DISCLOSURE_STYLE = "bg-gray-500";
const LINK_CURRENT_STYLE = "bg-gray-900 text-white";
const LINK_NOT_CURRENT_STYLE =
  "text-gray-300 hover:bg-gray-700 hover:text-white";

function Header() {
  const [links, setLinks] = useState([
    { key: "lobby", text: "Lobby", to: "/", current: true },
  ]);

  function updateLinks(linkClickedKey) {
    setLinks(
      links.map((link) => ({ ...link, current: link.key === linkClickedKey }))
    );
  }

  return (
    <Disclosure as="nav" className={DISCLOSURE_STYLE}>
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
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
                  <span className={TITLE_STYLE}>{TITLE}</span>
                </div>
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-4">
                    {links.map((link) => (
                      <Link
                        key={link.key}
                        to={link.to}
                        className={`${
                          link.current
                            ? LINK_CURRENT_STYLE
                            : LINK_NOT_CURRENT_STYLE
                        } px-3 py-2 rounded-md text-sm font-medium`}
                        aria-current={link.current ? "page" : undefined}
                        onClick={() => updateLinks(link.key)}
                      >
                        {link.text}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {links.map((link) => (
                <Disclosure.Button
                  key={link.key}
                  as={Link}
                  to={link.to}
                  className={`${
                    link.current ? LINK_CURRENT_STYLE : LINK_NOT_CURRENT_STYLE
                  } block px-3 py-2 rounded-md text-base font-medium`}
                  aria-current={link.current ? "page" : undefined}
                  onClick={() => updateLinks(link.key)}
                >
                  {link.text}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

export { Header };
