"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import { usePathname, useRouter } from "next/navigation";
import { syncMyGames } from "@/lib/api";

const MoreMenu = ({ onClose }) => {
  const router = useRouter();

  const menuItems = [
    {
      id: 1,
      icon: "/assets/animaapp/vuiLipjk/img/vector.svg",
      label: "Daily Challenges",
      iconWidth: "w-5",
      iconHeight: "h-[18px]",
      marginTop: "mt-[45px]",
      marginLeft: "ml-[53px]",
      labelWidth: "w-14",
      href: "/dailychallenge",
    },

    {
      id: 2,
      icon: "/assets/animaapp/vuiLipjk/img/vector.svg",
      label: "DEALS",
      iconWidth: "w-5",
      iconHeight: "h-[18px]",
      marginTop: "mt-[45px]",
      marginLeft: "ml-[80px]",
      labelWidth: "w-14",
      href: "/deals",
    },

    {
      id: 3,
      icon: "/assets/animaapp/vuiLipjk/img/group-2x.png",
      label: "Daily Rewards",
      iconWidth: "w-[20px]",
      iconHeight: "h-[20px]",
      marginTop: "mt-11",
      marginLeft: "",
      labelWidth: "w-[52px]",
      href: "/Daily-Reward",
    },
  ];

  const handleMenuClick = (href) => {
    onClose(); // Close the menu
    router.push(href); // Navigate to the page
  };

  return (
    <nav
      className="w-full h-[100px] flex justify-end items-end relative"
      data-model-id="2035:12830"
      role="navigation"
      aria-label="More menu options"
    >
      <div
        className="flex flex-row justify-center items-end gap-2 pr- relative z-10"
        style={{
          position: "absolute",
          bottom: "28px",
          right: "12%",
          width: "auto",
        }}
      >
        {menuItems.map((item) => (
          <button
            key={item.id}
            className="
              flex flex-col items-center justify-center
              w-[60px] h-[60px]
              bg-black rounded-full border border-solid border-[#474747]
              shadow-[0px_0px_11px_#d8d8d840] cursor-pointer
              hover:border-[#5a5a5a] transition-colors
              focus:outline-none focus:ring-2 focus:ring-[#5a5a5a] 
              focus:ring-offset-2 focus:ring-offset-black
            "
            aria-label={item.label}
            type="button"
            onClick={() => handleMenuClick(item.href)}
            // style={{
            //   minWidth: "60px",
            //   minHeight: "60px",
            //   borderRadius: "50%",
            //   aspectRatio: "1/1",
            //   padding: "6px 3px 3px 3px",
            // }}
            style={{
              minWidth: "60px",
              minHeight: "60px",
              borderRadius: "50%",
              aspectRatio: "1/1",
              padding: "6px 3px 3px 3px",

              // 👇 THIS creates the semi-circle
              transform:
                item.id === 2
                  ? "translateY(-8px)"   // middle item (DEALS) goes up
                  : "translateY(20px)",   // side items slightly up
            }}
          >
            {item.label === "DEALS" ? (
              <span
                className={`relative ${item.iconWidth} ${item.iconHeight}`}
                aria-hidden="true"
              >
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  <path
                    d="M28.9745 12.9128C28.512 12.5619 28.1787 12.0678 28.0266 11.5075C27.8745 10.9472 27.9122 10.3523 28.1338 9.8157C28.2881 9.44338 28.3547 9.04056 28.3284 8.63838C28.3022 8.2362 28.1838 7.84545 27.9824 7.49635C27.781 7.14725 27.5021 6.84915 27.1671 6.62511C26.8322 6.40108 26.4502 6.25711 26.0507 6.20434C25.4778 6.12637 24.9465 5.86155 24.5394 5.45093C24.1322 5.04031 23.8719 4.50682 23.7987 3.93316C23.7447 3.53363 23.5996 3.15187 23.3745 2.81744C23.1494 2.483 22.8504 2.20485 22.5006 2.00452C22.1508 1.80418 21.7596 1.68703 21.3573 1.66214C20.955 1.63724 20.5523 1.70526 20.1805 1.86094C19.6452 2.08379 19.0512 2.12326 18.4911 1.97319C17.931 1.82313 17.4363 1.49196 17.084 1.0313C16.8388 0.710604 16.5229 0.450744 16.161 0.271891C15.7991 0.0930373 15.4009 0 14.9972 0C14.5935 0 14.1952 0.0930373 13.8333 0.271891C13.4714 0.450744 13.1556 0.710604 12.9103 1.0313C12.5581 1.49196 12.0634 1.82313 11.5033 1.97319C10.9432 2.12326 10.3492 2.08379 9.81385 1.86094C9.4416 1.70662 9.03885 1.64001 8.63675 1.66626C8.23465 1.69251 7.84397 1.81091 7.49494 2.01232C7.1459 2.21372 6.84786 2.49273 6.62387 2.82775C6.39987 3.16278 6.25593 3.54485 6.20317 3.94442C6.12906 4.52085 5.86598 5.05644 5.4551 5.46739C5.04423 5.87835 4.50874 6.14147 3.93242 6.2156C3.53535 6.27039 3.15607 6.41532 2.82363 6.63931C2.49119 6.86329 2.2144 7.16038 2.01444 7.50784C1.81448 7.8553 1.69666 8.24391 1.66999 8.64393C1.64332 9.04395 1.70852 9.44477 1.86059 9.8157C2.0834 10.3511 2.12286 10.9452 1.97282 11.5054C1.82278 12.0656 1.49168 12.5604 1.03111 12.9128C0.71047 13.1581 0.450659 13.474 0.27184 13.8359C0.0930197 14.1979 0 14.5962 0 15C0 15.4038 0.0930197 15.8021 0.27184 16.1641C0.450659 16.526 0.71047 16.8419 1.03111 17.0872C1.49168 17.4396 1.82278 17.9344 1.97282 18.4946C2.12286 19.0548 2.0834 19.6489 1.86059 20.1843C1.7063 20.5566 1.6397 20.9594 1.66594 21.3616C1.69219 21.7638 1.81057 22.1545 2.01194 22.5037C2.2133 22.8528 2.49226 23.1508 2.82722 23.3749C3.16219 23.5989 3.54419 23.7429 3.94367 23.7957C4.51723 23.8689 5.05062 24.1293 5.46116 24.5365C5.87171 24.9437 6.13648 25.475 6.21443 26.0481C6.26666 26.4469 6.40973 26.8284 6.6326 27.1631C6.85547 27.4979 7.1522 27.7771 7.49993 27.9791C7.84766 28.1811 8.23711 28.3005 8.63828 28.3283C9.03945 28.356 9.44164 28.2913 9.81385 28.1391C10.3492 27.9162 10.9432 27.8767 11.5033 28.0268C12.0634 28.1769 12.5581 28.508 12.9103 28.9687C13.1556 29.2894 13.4714 29.5493 13.8333 29.7281C14.1952 29.907 14.5935 30 14.9972 30C15.4009 30 15.7991 29.907 16.161 29.7281C16.5229 29.5493 16.8388 29.2894 17.084 28.9687C17.4363 28.508 17.931 28.1769 18.4911 28.0268C19.0512 27.8767 19.6452 27.9162 20.1805 28.1391C20.5527 28.2934 20.9555 28.36 21.3576 28.3337C21.7597 28.3075 22.1504 28.1891 22.4994 27.9877C22.8485 27.7863 23.1465 27.5073 23.3705 27.1722C23.5945 26.8372 23.7384 26.4551 23.7912 26.0556C23.8682 25.4853 24.1302 24.9561 24.5371 24.5492C24.9439 24.1423 25.473 23.8802 26.0432 23.8032C26.4443 23.7518 26.8281 23.6085 27.1648 23.3844C27.5014 23.1603 27.7818 22.8615 27.9841 22.5113C28.1864 22.1611 28.3052 21.769 28.3311 21.3653C28.3571 20.9617 28.2896 20.5575 28.1338 20.1843C27.911 19.6489 27.8715 19.0548 28.0215 18.4946C28.1716 17.9344 28.5027 17.4396 28.9632 17.0872C29.2845 16.8428 29.5452 16.5276 29.725 16.1661C29.9048 15.8046 29.9989 15.4065 30 15.0028C30.0011 14.599 29.9091 14.2004 29.7313 13.838C29.5534 13.4755 29.2945 13.1589 28.9745 12.9128ZM7.66321 11.5726C7.44055 11.0218 7.38621 10.4174 7.50707 9.83575C7.62792 9.2541 7.91853 8.72137 8.34213 8.30494C8.76574 7.88851 9.30332 7.60709 9.88686 7.49628C10.4704 7.38548 11.0737 7.45026 11.6204 7.68244C12.1671 7.91462 12.6327 8.30376 12.9583 8.80064C13.2839 9.29752 13.4548 9.87981 13.4494 10.4739C13.4441 11.0679 13.2627 11.647 12.9282 12.138C12.5938 12.6289 12.1212 13.0096 11.5704 13.2319C10.8323 13.5297 10.0061 13.5223 9.2734 13.2112C8.54075 12.9 7.96158 12.3106 7.66321 11.5726ZM9.96399 23.7619L8.48518 22.7295L20.0304 6.23812L21.5092 7.27048L9.96399 23.7619ZM20.6722 22.3354C20.1215 22.558 19.5172 22.6124 18.9357 22.4915C18.3541 22.3706 17.8215 22.08 17.4052 21.6563C16.9888 21.2326 16.7074 20.6949 16.5967 20.1113C16.4859 19.5276 16.5506 18.9242 16.7828 18.3774C17.0149 17.8306 17.404 17.3649 17.9008 17.0393C18.3975 16.7136 18.9797 16.5427 19.5737 16.548C20.1676 16.5534 20.7466 16.7348 21.2375 17.0693C21.7283 17.4039 22.1089 17.8765 22.3311 18.4274C22.629 19.1657 22.6215 19.9921 22.3104 20.7249C21.9994 21.4576 21.4101 22.0369 20.6722 22.3354Z"
                    fill="#756F83"
                  />
                </svg>
              </span>
            ) : (
              <img
                className={`relative ${item.iconWidth} ${item.iconHeight}`}
                alt=""
                src={item.icon}
                aria-hidden="true"
              />
            )}
            <span
              className={`relative max-w-[54px] [font-family:'Poppins',Helvetica] font-normal text-[#ffffffb2] text-[8px] text-center tracking-[-0.17px] leading-tight mt-0.5 px-0.5`}
              style={{
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export const HomeIndicator = ({ activeTab }) => {
  const pathname = usePathname();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMoreMenu(false);
      }
    };

    if (showMoreMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMoreMenu]);

  const getActiveTab = () => {
    if (activeTab) return activeTab;
    if (pathname === "/homepage" || pathname === "/homepage/") return "home";
    if (pathname === "/games" || pathname === "/games/") return "games";
    if (pathname === "/Wallet" || pathname === "/Wallet/") return "wallet";
    if (pathname === "/cash-coach" || pathname === "/cash-coach/") return "cash";
    return "home";
  };
  const currentActiveTab = getActiveTab();

  // Sync my-games when user navigates to any HomeIndicator tab (non-blocking)
  // Only sync my-games on screens that use it (Cash Coach does not)
  const homeIndicatorPaths = ["/homepage", "/homepage/", "/games", "/games/", "/Wallet", "/Wallet/"];
  useEffect(() => {
    if (!pathname || !homeIndicatorPaths.includes(pathname)) return;
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") || localStorage.getItem("x-auth-token") : null;
    if (token) syncMyGames(token).catch(() => { });
  }, [pathname]);

  const getActiveIconStyle = (tabId) => {
    if (currentActiveTab === tabId) {
      return { filter: 'brightness(1.8)' };
    }
    return { filter: 'brightness(0.7) opacity(0.7)' };
  };


  return (
    <nav
      className="fixed bottom-0 left-0 right-0 w-full z-[9999]"
      data-model-id="730:32095"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="w-full">
        <div className="w-full h-[100px] relative">
          <div className="absolute bottom-0 left-0 right-0 bg-black w-full h-[78px]"></div>
          <div className="absolute bottom-[5px] left-1/2 transform -translate-x-1/2 w-[135px] h-[5px] bg-white rounded-[100px]"></div>
          <div className="absolute bottom-0 left-0 right-0 h-[78px] flex items-center justify-between px-4">
            <div className="flex items-center justify-between w-full relative">

              <Link
                href="/homepage"
                className="group flex flex-col items-center gap-1 cursor-pointer focus:outline-none rounded-lg p-1 min-w-[50px] relative"
                aria-label="Navigate to Home"
                aria-current={currentActiveTab === "home" ? "page" : undefined}
              >
                {currentActiveTab === "home" && (
                  <div className="absolute bottom-[6px] left-1/2 transform -translate-x-1/2 w-[60px] h-[12px] bg-[#AF7DE6] blur-sm rounded-full opacity-40 z-0" />
                )}
                <img
                  className="w-6 h-6 z-10"
                  alt=""
                  src="/assets/animaapp/Tbz6Qwwg/img/home.svg"
                  role="presentation"
                  style={getActiveIconStyle("home")}
                />
                <span className={`text-[10px] font-normal z-10 ${currentActiveTab === "home" ? "text-white" : "text-[#ffffffb2]"}`}>
                  Home
                </span>
                {currentActiveTab === "home" && (
                  <div className="absolute w-1 h-1 -bottom-1 left-1/2 transform -translate-x-1/2 bg-[#8b92de] rounded-full z-10" />
                )}
              </Link>

              <Link
                href="/games"
                className="group flex flex-col items-center gap-1 cursor-pointer focus:outline-none rounded-lg p-1 min-w-[50px] relative -ml-14"
                aria-label="Navigate to My Games"
                aria-current={currentActiveTab === "games" ? "page" : undefined}
              >
                {currentActiveTab === "games" && (
                  <div className="absolute bottom-[6px] left-1/2 transform -translate-x-1/2 w-[60px] h-[12px] bg-[#AF7DE6] blur-sm rounded-full opacity-40 z-0" />
                )}
                <img
                  className="w-[35px] h-[16px] z-10"
                  alt=""
                  src="/game.png"
                  role="presentation"
                  style={getActiveIconStyle("games")}
                />
                <span className={`text-[10px] font-normal text-center z-10 ${currentActiveTab === "games" ? "text-white" : "text-[#ffffffb2]"}`}>
                  My Games
                </span>
                {currentActiveTab === "games" && (
                  <div className="absolute w-1 h-1 -bottom-1 left-1/2 transform -translate-x-1/2 bg-[#8b92de] rounded-full z-10" />
                )}
              </Link>

              <div ref={menuRef} className="flex flex-col items-center cursor-pointer focus:outline-none rounded-full absolute -top-[42px] left-1/2 transform -translate-x-1/2 z-30">
                <button
                  className="flex flex-col items-center justify-center w-[62px] h-[62px] rounded-full focus:outline-none relative transition-all duration-300 hover:opacity-80"
                  aria-label="Open more options"
                  tabIndex={0}
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  type="button"
                >
                  <img
                    className="w-[62px] h-[62px]"
                    alt=""
                    src="/assets/animaapp/Tbz6Qwwg/img/more.svg"
                    role="presentation"
                  />
                </button>

                {/* More Menu - positioned above the middle button, shifted very far left */}
                {showMoreMenu && (
                  <div className="absolute bottom-[36px] left-1/2 transform -translate-x-[200%] z-40">
                    <MoreMenu onClose={() => setShowMoreMenu(false)} />
                  </div>
                )}

              </div>

              <Link
                href="/Wallet"
                className="group flex flex-col items-center gap-1 cursor-pointer focus:outline-none rounded-lg p-1 min-w-[50px] relative -mr-16"
                aria-label="Navigate to My Wallet"
                aria-current={currentActiveTab === "wallet" ? "page" : undefined}
              >
                {currentActiveTab === "wallet" && (
                  <div className="absolute bottom-[6px] left-1/2 transform -translate-x-1/2 w-[60px] h-[12px] bg-[#AF7DE6] blur-sm rounded-full opacity-40 z-0" />
                )}
                <div className="w-6 h-6 relative z-10">
                  <img
                    className="absolute w-5 h-[18px] top-[3px] left-0.5"
                    alt=""
                    src="/assets/animaapp/Tbz6Qwwg/img/wallet-2x.png"
                    role="presentation"
                    style={getActiveIconStyle("wallet")}
                  />
                </div>
                <span className={`text-[10px] font-normal text-center z-10 ${currentActiveTab === "wallet" ? "text-white" : "text-[#ffffffb2]"}`}>
                  My Wallet
                </span>
                {currentActiveTab === "wallet" && (
                  <div className="absolute w-1 h-1 -bottom-1 left-1/2 transform -translate-x-1/2 bg-[#8b92de] rounded-full z-10" />
                )}
              </Link>

              <Link
                href="/cash-coach"
                className="group flex flex-col items-center gap-1 cursor-pointer focus:outline-none rounded-lg p-1 min-w-[50px] relative"
                aria-label="Navigate to Cash Coach"
                aria-current={currentActiveTab === "cash" ? "page" : undefined}
              >
                {currentActiveTab === "cash" && (
                  <div className="absolute bottom-[6px] left-1/2 transform -translate-x-1/2 w-[60px] h-[12px] bg-[#AF7DE6] blur-sm rounded-full opacity-40 z-0" />
                )}
                <img
                  className="w-6 h-6 z-10"
                  alt=""
                  src="/assets/animaapp/Tbz6Qwwg/img/money.svg"
                  role="presentation"
                  style={getActiveIconStyle("cash")}
                />
                <span className={`text-[10px] font-normal text-center whitespace-nowrap z-10 ${currentActiveTab === "cash" ? "text-white" : "text-[#ffffffb2]"}`}>
                  Cash Coach
                </span>
                {currentActiveTab === "cash" && (
                  <div className="absolute w-1 h-1 -bottom-1 left-1/2 transform -translate-x-1/2 bg-[#8b92de] rounded-full z-10" />
                )}
              </Link>

            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};