import React from "react";
import { Menu, Transition } from "@headlessui/react";
import { usePopper } from "react-popper";
import { Portal } from "react-portal";

function Dropdown({ options, currentSelection, clickHandler }) {
  const popperElRef = React.useRef(null);
  const [targetElement, setTargetElement] = React.useState(null);
  const [popperElement, setPopperElement] = React.useState(null);
  const { styles, attributes } = usePopper(targetElement, popperElement, {
    placement: "bottom",
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 8],
        },
      },
    ],
  });

  return (
    <div className="inline-block text-left">
      <Menu>
        {({ open }) => (
          <>
            <div ref={setTargetElement} className="rounded-md shadow-sm">
              <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800">
                <span>{currentSelection}</span>
                <svg
                  className="w-5 h-5 ml-2 -mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Menu.Button>
            </div>

            <Portal>
              <div
                ref={popperElRef}
                style={styles.popper}
                {...attributes.popper}
              >
                <Transition
                  show={open}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                  beforeEnter={() => setPopperElement(popperElRef.current)}
                  afterLeave={() => setPopperElement(null)}
                >
                  <Menu.Items
                    static
                    className="w-full origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none"
                  >
                    <div className="py-1">
                      {options.map((option) => (
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              type="button"
                              className={`${
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700"
                              } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left`}
                              onClick={() => clickHandler(option.clickValue)}
                            >
                              {option.displayText}
                            </button>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </div>
            </Portal>
          </>
        )}
      </Menu>
    </div>
  );
}

export { Dropdown };
