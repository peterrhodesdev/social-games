import { Menu, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { Link } from "react-router-dom";

function SubLinks({ link, isLeftPosition }) {
  return (
    <Transition
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <Menu.Items
        className={`${
          isLeftPosition ? "origin-top-left left-0" : "origin-top-right right-0"
        } absolute mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`}
      >
        {link.subLinks.map((subLink) => (
          <Menu.Item key={`${link.key}-${subLink.key}`}>
            {() => (
              <Link
                to={`${link.to}${subLink.key}`}
                className="block px-4 py-2 text-sm text-gray-700"
              >
                {subLink.text}
              </Link>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Transition>
  );
}

export { SubLinks };
