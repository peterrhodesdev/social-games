import React from "react";

function Tabs({ tabs }) {
  const [openTab, setOpenTab] = React.useState(0);

  return (
    <div className="flex flex-wrap">
      <div className="w-full">
        <ul
          className="flex mb-0 list-none flex-wrap pt-3 pb-4 px-0 flex-row"
          role="tablist"
        >
          {tabs.map((tab, index) => (
            <li
              key={tab.name}
              className="-mb-px mr-2 last:mr-0 flex-auto text-center"
            >
              <a
                className={`text-base font-bold no-underline uppercase px-5 py-3 shadow-lg rounded block leading-normal ${
                  openTab === index
                    ? "text-white bg-gray-500"
                    : "text-gray-500 bg-white"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setOpenTab(index);
                }}
                data-toggle="tab"
                href={`#link${index}`}
                role="tablist"
              >
                {tab.displayName}
              </a>
            </li>
          ))}
        </ul>
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
          <div className="px-4 py-5 flex-auto">
            <div className="tab-content tab-space">
              {tabs.map((tab, index) => (
                <div
                  key={tab.name}
                  className={openTab === index ? "block" : "hidden"}
                  id={`link${index}`}
                >
                  {tab.content}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Tabs };
