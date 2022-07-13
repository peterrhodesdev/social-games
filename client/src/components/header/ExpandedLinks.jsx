import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import React from "react";
import { Link } from "react-router-dom";
import { SubLinks } from "./SubLinks";

function ExpandedLinks({ links, linkStyle }) {
  return links.map((link) => {
    if (!Object.hasOwn(link, "subLinks")) {
      return (
        <Link
          key={link.key}
          to={link.to}
          className={`${linkStyle} px-3 py-2 rounded-md text-sm font-medium`}
        >
          {link.text}
        </Link>
      );
    }
    return (
      <Menu as="div" className="ml-3 relative">
        <div>
          <Menu.Button
            className={`${linkStyle} px-3 py-2 rounded-md text-sm font-medium flex flex-row`}
          >
            <div className="mr-2">{link.text}</div>
            <ChevronDownIcon className="h-4 w-4" />
          </Menu.Button>
        </div>
        <SubLinks link={link} />
      </Menu>
    );
  });
}

export { ExpandedLinks };
