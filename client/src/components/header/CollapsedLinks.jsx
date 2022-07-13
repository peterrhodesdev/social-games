import { Disclosure, Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import React from "react";
import { Link } from "react-router-dom";
import { SubLinks } from "./SubLinks";

function CollapsedLinks({ links, linkStyle }) {
  return links.map((link) => {
    if (!Object.hasOwn(link, "subLinks")) {
      return (
        <Disclosure.Button
          key={link.key}
          as={Link}
          to={link.to}
          className={`${linkStyle} block px-3 py-2 rounded-md text-base font-medium`}
        >
          {link.text}
        </Disclosure.Button>
      );
    }
    return (
      <Menu key={link.key} as="div">
        <div>
          <Menu.Button
            className={`${linkStyle} px-3 py-2 rounded-md text-base font-medium flex flex-row w-full`}
          >
            <div className="mr-2">{link.text}</div>
            <ChevronDownIcon className="h-4 w-4" />
          </Menu.Button>
        </div>
        <SubLinks link={link} isLeftPosition />
      </Menu>
    );
  });
}

export { CollapsedLinks };
