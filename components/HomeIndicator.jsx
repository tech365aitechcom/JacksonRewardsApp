"use client";
import React from "react";
import { useRouter } from "next/navigation";

export const HomeIndicator = ({ activeTab = "games" }) => {
  const router = useRouter();

  const navigationItems = [
    {
      id: "home",
      icon: "https://c.animaapp.com/Tbz6Qwwg/img/home.svg",
      label: "Home",
      route: "/homepage",
    },
    {
      id: "games",
      icon: "https://c.animaapp.com/Tbz6Qwwg/img/games.svg",
      label: "My Games",
      route: "/games",
    },
    {
      id: "more",
      icon: "https://c.animaapp.com/Tbz6Qwwg/img/more.svg",
      label: "",
      isCenter: true,
      route: null,
    },
    {
      id: "wallet",
      icon: "https://c.animaapp.com/Tbz6Qwwg/img/wallet@2x.png",
      label: "My Wallet",
      route: "/wallet",
    },
    {
      id: "cash",
      icon: "https://c.animaapp.com/Tbz6Qwwg/img/money.svg",
      label: "Cash Coach",
      route: "/cash-coach",
    },
  ];

  const handleTabClick = (tabId, route) => {
    if (route) {
      router.push(route);
    }
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 w-full max-w-[375px] mx-auto h-[157px] z-50"
      data-model-id="730:32095"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="relative h-[120px] -top-px">
        <div
          className="absolute w-[135px] h-[5px] top-[115px] left-[120px] bg-white rounded-[100px]"
          role="presentation"
          aria-hidden="true"
        />

        <div className="absolute w-[375px] h-20 top-9 left-0">
          <div className="relative h-[113px] -top-5">
            <img
              className="absolute w-[375px] h-[103px] top-2.5 left-0"
              alt=""
              src="https://c.animaapp.com/Tbz6Qwwg/img/botton-nav@2x.png"
              role="presentation"
              aria-hidden="true"
            />

            <button
              className="flex flex-col w-[60px] items-center gap-2 absolute top-[39px] left-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg p-1"
              onClick={() => handleTabClick("home", "/homepage")}
              aria-label="Navigate to Home"
              tabIndex={0}
            >
              <img
                className="relative w-6 h-6"
                alt=""
                src="https://c.animaapp.com/Tbz6Qwwg/img/home.svg"
                role="presentation"
              />

              <span className={`relative w-fit [font-family:'Poppins',Helvetica] font-normal text-[10px] tracking-[-0.17px] leading-[normal] ${activeTab === "home" ? "text-white" : "text-[#ffffffb2]"}`}>
                Home
              </span>

              {activeTab === "home" && (
                <div
                  className="absolute w-1 h-1 top-[51px] left-[26px] bg-[#8b92de] rounded-sm"
                  role="presentation"
                  aria-hidden="true"
                />
              )}
            </button>

            <button
              className="flex flex-col w-[60px] items-center gap-3 absolute top-[43px] left-[87px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg p-1"
              onClick={() => handleTabClick("games", "/games")}
              aria-label="Navigate to My Games"
              aria-current={activeTab === "games" ? "page" : undefined}
              tabIndex={0}
            >
              <img
                className="relative w-[35px] h-[16.28px]"
                alt=""
                src="https://c.animaapp.com/Tbz6Qwwg/img/games.svg"
                role="presentation"
              />

              <span className={`relative self-stretch [font-family:'Poppins',Helvetica] font-normal text-[10px] text-center tracking-[-0.17px] leading-[normal] ${activeTab === "games" ? "text-white" : "text-[#ffffffb2]"}`}>
                My Games
              </span>

              {activeTab === "games" && (
                <div
                  className="absolute w-1 h-1 top-[47px] left-[26px] bg-[#8b92de] rounded-sm"
                  role="presentation"
                  aria-hidden="true"
                />
              )}
            </button>

            <button
              className="flex flex-col w-[62px] items-center gap-[12.4px] absolute top-0 left-40 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg p-1"
              onClick={() => handleTabClick("more", null)}
              aria-label="More options"
              tabIndex={0}
            >
              <img
                className="relative w-[62px] h-[62px]"
                alt=""
                src="https://c.animaapp.com/Tbz6Qwwg/img/more.svg"
                role="presentation"
              />
            </button>

            <button
              className="flex flex-col w-[60px] items-center gap-2 absolute top-[39px] left-[229px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg p-1"
              onClick={() => handleTabClick("wallet", "/wallet")}
              aria-label="Navigate to My Wallet"
              tabIndex={0}
            >
              <div className="relative w-6 h-6">
                <img
                  className="absolute w-5 h-[18px] top-[3px] left-0.5"
                  alt=""
                  src="https://c.animaapp.com/Tbz6Qwwg/img/wallet@2x.png"
                  role="presentation"
                />
              </div>

              <span className={`relative w-fit [font-family:'Poppins',Helvetica] font-normal text-[10px] text-center tracking-[-0.17px] leading-[normal] ${activeTab === "wallet" ? "text-white" : "text-[#ffffffb2]"}`}>
                My Wallet
              </span>

              {activeTab === "wallet" && (
                <div
                  className="absolute w-1 h-1 top-[51px] left-[26px] bg-[#8b92de] rounded-sm"
                  role="presentation"
                  aria-hidden="true"
                />
              )}
            </button>

            <button
              className="flex flex-col w-[60px] items-center gap-2 absolute top-[39px] left-[300px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg p-1"
              onClick={() => handleTabClick("cash", "/cash-coach")}
              aria-label="Navigate to Cash Coach"
              tabIndex={0}
            >
              <img
                className="relative w-6 h-6"
                alt=""
                src="https://c.animaapp.com/Tbz6Qwwg/img/money.svg"
                role="presentation"
              />

              <span className={`relative w-fit ml-[-0.50px] mr-[-0.50px] [font-family:'Poppins',Helvetica] font-normal text-[10px] text-center tracking-[-0.17px] leading-[13px] whitespace-nowrap ${activeTab === "cash" ? "text-white" : "text-[#ffffffb2]"}`}>
                Cash Coach
              </span>

              {activeTab === "cash" && (
                <div
                  className="absolute w-1 h-1 top-[51px] left-[26px] bg-[#8b92de] rounded-sm"
                  role="presentation"
                  aria-hidden="true"
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};