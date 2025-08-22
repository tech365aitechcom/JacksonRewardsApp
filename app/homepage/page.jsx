"use client"; // <-- THIS IS THE ONLY LINE YOU NEED TO ADD
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext"; // Ensure path is correct
import { getProfile, getProfileStats, getHomeDashboard } from "@/lib/api";
import { HomeIndicator } from "../../components/HomeIndicator"; //
import { WelcomeOffer } from "../../components/WelcomeOffer";

const Frame = () => {
  const actionButtons = [
    {
      id: 1,
      icon: "https://c.animaapp.com/JKj0xq2Q/img/group-2@2x.png",
      alt: "Group",
      isActive: false,
    },
    {
      id: 2,
      icon: "https://c.animaapp.com/JKj0xq2Q/img/vector.svg",
      alt: "Vector",
      isActive: true,
      badge: "5/5 left",
    },
    {
      id: 3,
      icon: "https://c.animaapp.com/JKj0xq2Q/img/group-3@2x.png",
      alt: "Group",
      isActive: false,
    },
  ];

  return (
    <div
      className="relative w-full max-w-[375px] h-[470px] mx-auto px-4"
      data-model-id="2630:15320"
    >
      <nav
        className="absolute w-[254px] h-[71px] top-[406px] left-1/2 -translate-x-1/2"
        role="navigation"
        aria-label="Action buttons"
      >
        {actionButtons.map((button, index) => (
          <div
            key={button.id}
            className={`h-[62px] absolute w-[62px] top-0 ${
              index === 0 ? "left-0" : index === 1 ? "left-24" : "left-48"
            }`}
          >
            {button.isActive ? (
              <div className="relative h-[71px]">
                <button
                  className="absolute w-[62px] h-[62px] top-0 left-0 rounded-[31px] border-2 border-solid border-[#f7b84b] bg-transparent cursor-pointer hover:bg-[#f7b84b]/10 transition-colors"
                  aria-label="Active action button"
                >
                  <img
                    className="absolute w-6 h-6 top-[19px] left-[19px]"
                    alt={button.alt}
                    src={button.icon}
                  />
                </button>
                <div className="absolute w-[51px] h-[22px] top-[49px] left-[5px] bg-[#f1b24a] rounded overflow-hidden">
                  <span className="absolute top-0.5 left-1 [font-family:'Poppins',Helvetica] font-normal text-white text-xs tracking-[0] leading-4 whitespace-nowrap">
                    {button.badge}
                  </span>
                </div>
              </div>
            ) : (
              <button
                className="h-[62px] w-[62px] rounded-[31px] bg-transparent cursor-pointer hover:bg-white/10 transition-colors"
                aria-label="Action button"
              >
                <img
                  className="h-[62px] w-[62px]"
                  alt={button.alt}
                  src={button.icon}
                />
              </button>
            )}
          </div>
        ))}
      </nav>

      <main className="absolute w-full h-[335px] top-[-9px] left-0 rounded-[12px_12px_0px_0px] overflow-hidden">
        <img
          className="absolute w-52 h-[244px] top-[60px] left-[73px]"
          alt="Frame"
          src="https://c.animaapp.com/JKj0xq2Q/img/frame-2.svg"
        />

        <img
          className="absolute w-52 h-[244px] top-[60px] left-[73px]"
          alt="Frame"
          src="https://c.animaapp.com/JKj0xq2Q/img/frame-3.svg"
        />

        <div className="absolute w-full h-[335px] top-0 left-0 rounded-[12px_12px_0px_0px] overflow-hidden border-t border-r border-l border-[#3a3674] bg-[linear-gradient(180deg,rgba(95,14,58,1)_0%,rgba(16,8,25,1)_100%)]">
          <div className="relative w-[calc(100%-36px)] max-w-[302px] h-[319px] top-4 left-1/2 -translate-x-1/2">
            <img
              className="absolute w-full max-w-[300px] h-[290px] top-[29px] left-1/2 -translate-x-1/2 object-cover"
              alt="Game screenshot"
              src="https://c.animaapp.com/JKj0xq2Q/img/image-3930@2x.png"
            />

            <img
              className="absolute w-[210px] h-10 top-[18px] left-1/2 -translate-x-1/2 ml-[20px] object-contain"
              alt="Game logo"
              src="https://c.animaapp.com/JKj0xq2Q/img/image-3931@2x.png"
            />

            <div className="absolute w-[74px] h-[25px] top-0 right-0">
              <div className="relative w-[72px] h-[25px] bg-[#ffffff4f] rounded-[5.32px] backdrop-blur-[2.66px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(2.66px)_brightness(100%)]">
                <img
                  className="absolute w-[13px] h-2.5 top-2 left-[7px]"
                  alt="Views icon"
                  src="https://c.animaapp.com/JKj0xq2Q/img/vector-1.svg"
                />

                <span className="absolute top-[3px] left-[25px] [font-family:'Poppins',Helvetica] font-bold text-white text-[13px] tracking-[0] leading-[normal]">
                  10.4 K
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="absolute w-full h-14 top-[326px] left-0 rounded-[0px_0px_10px_10px] overflow-hidden bg-[linear-gradient(180deg,rgba(158,173,247,0.5)_0%,rgba(113,106,231,0.5)_100%)]">
        <div className="relative w-[calc(100%-24px)] max-w-[210px] h-[41px] top-[7px] left-3">
          <p className="absolute top-0 left-0 [font-family:'Poppins',Helvetica] font-normal text-white text-[13px] tracking-[0] leading-[normal]">
            <span className="font-light">
              Complete Only 10 Tasks <br />
            </span>

            <span className="font-semibold">
              Earn upto 100&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&amp;
              50&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;points
            </span>
          </p>

          <img
            className="absolute w-[17px] h-[18px] top-[23px] left-[90px] aspect-[0.97]"
            alt="Currency icon"
            src="https://c.animaapp.com/JKj0xq2Q/img/image-3937@2x.png"
          />

          <img
            className="absolute w-[21px] h-[19px] top-[22px] left-[145px]"
            alt="Points icon"
            src="https://c.animaapp.com/JKj0xq2Q/img/pic.svg"
          />
        </div>
      </footer>
    </div>
  );
};
const Homepage = () => {
  return (
    <div
      className="relative w-full min-h-screen bg-black pb-[170px]"
      data-model-id="972:9945"
    >
      <div className="absolute w-full h-[49px] top-0 left-0 z-10 px-5">
        <div className="absolute top-[37px] left-5 [font-family:'Poppins',Helvetica] font-normal text-white text-[10px] tracking-[0] leading-3 whitespace-nowrap">
          App Version: V0.0.1
        </div>
      </div>
      <HeaderSection />
      <MainContentSection />

      <HomeIndicator activeTab="home" />
    </div>
  );
};

const RewardProgress = ({ stats }) => {
  const rewardGoal = 6000;

  const currentProgress = stats?.currentXP ?? 0;
  const pointsNeeded = Math.max(0, rewardGoal - currentProgress);

  const progressPercentage = Math.min(
    (currentProgress / rewardGoal) * 100,
    100
  );

  const pointsData = {
    currentPoints: currentProgress,
    targetPoints: rewardGoal,
    pointsNeeded: pointsNeeded,
    currentLevel: stats?.tier ?? 2,
    nextLevel: (stats?.tier ?? 2) + 1,
  };

  return (
    <div
      className="relative w-full max-w-[375px] mx-auto h-[135px]"
      data-model-id="1151:33569"
    >
      <div className="relative w-full h-[135px]">
        <div className="absolute w-full h-[135px] top-0 left-0">
          <div className="relative w-full h-[135px] bg-black rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8)]">
            <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[0_0_30px_8px_rgba(255,215,0,0.06)]" />
            <div className="absolute w-[calc(100%-34px)] max-w-[302px] h-[37px] top-[73px] left-[17px]">
              <div className="absolute w-full h-[37px] top-0 left-0">
                <div className="w-full h-[37px]">
                  <div className="relative w-full h-[37px]">
                    {/* Progress bar background */}
                    <div className="absolute w-full h-full rounded-full overflow-hidden ring-1 ring-[#8b7332] bg-gradient-to-r from-[#4a3c1a] to-[#6b5424] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-1px_0_rgba(0,0,0,0.25)]"></div>

                    {/* Progress bar fill */}
                    <div
                      className="absolute h-full rounded-full bg-gradient-to-r from-[#ffd700] via-[#ffed4e] to-[#f4d03f] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
                      style={{
                        width: `${
                          (pointsData.currentPoints / pointsData.targetPoints) *
                          100
                        }%`,
                      }}
                    ></div>
                    {/* Current level indicator */}
                    <div className="absolute w-[29px] h-[30px] top-1 left-[3px] bg-[#ffd700] rounded-full border-2 border-[#b8860b] flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.35),0_0_0_3px_rgba(255,215,0,0.25)]">
                      <div className="[font-family:'Poppins',Helvetica] font-semibold text-[#815c23] text-[14.9px] tracking-[0.02px] leading-[normal]">
                        {pointsData.currentLevel}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="absolute top-2.5 left-1/2 -translate-x-1/2  opacity-80 [font-family:'Poppins',Helvetica] font-semibold text-transparent text-[14.9px] tracking-[0.02px] leading-[normal]">
                <span className="text-[#685512] tracking-[0]">
                  {pointsData.currentPoints}
                </span>

                <span className="text-[#8d741b80] tracking-[0]">
                  /{pointsData.targetPoints}
                </span>
              </p>
            </div>

            <header className="absolute w-[calc(100%-40px)] max-w-[299px] h-[42px] top-[19px] left-5">
              <div className="relative w-full h-[42px]">
                <div className="absolute w-full h-[21px] top-0 left-0">
                  <h1 className="absolute w-full top-0 left-0 [font-family:'Poppins',Helvetica] font-semibold text-white text-lg sm:text-xl tracking-[-0.37px] leading-[27.2px] truncate">
                    Hurry! Earn {pointsData.pointsNeeded} more &amp; Claim
                  </h1>
                </div>

                <p className="absolute w-full top-[27px] left-0 [font-family:'Poppins',Helvetica] font-semibold text-[#ffffff99] text-sm tracking-[0.02px] leading-[normal] truncate">
                  {pointsData.pointsNeeded} Points until your next reward
                </p>
              </div>
            </header>
          </div>
        </div>

        <div className="absolute w-8 h-[30px] top-[77px] right-4 opacity-50">
          <div className="relative w-[30px] h-[30px]">
            <div className="absolute w-[30px] h-[30px] top-0 left-0">
              <div className="h-[30px] bg-[url(https://c.animaapp.com/BzW3YOS5/img/ellipse-35-1.svg)] bg-[100%_100%]">
                <div className="relative w-[15px] h-3.5 top-2 left-2 overflow-hidden">
                  <div className="absolute w-[15px] h-3.5 top-0 left-0 bg-[#815c23] rounded-sm"></div>
                </div>
              </div>
            </div>

            <div className="w-[9px] top-1 left-2.5 absolute [font-family:'Poppins',Helvetica] font-semibold text-[#815c23] text-[14.9px] tracking-[0.02px] leading-[normal]">
              {pointsData.nextLevel}
            </div>
          </div>
        </div>

        <img
          className="absolute w-3 h-[11px] top-[85px] left-[99px]"
          alt="Star icon"
          src="https://c.animaapp.com/FQEXnMXW/img/vector.svg"
        />
      </div>
    </div>
  );
};

const XpTierTracker = ({ stats }) => {
  // Define XP goals for each tier. These would ideally come from a config or API.
  const tierGoals = { junior: 0, mid: 5000, senior: 10000 };
  const currentXp = stats?.currentXP ?? 2592;
  const totalXpGoal = tierGoals.senior;

  // Calculate progress - appears to be around 25% based on the image
  const progressPercentage = Math.min((currentXp / totalXpGoal) * 100, 100);

  const progressData = {
    currentXp: currentXp,
    totalXp: totalXpGoal,
    levels: [
      { name: "Junior", position: "left-0" },
      { name: "Mid-level", position: "left-[114px]" },
      { name: "Senior", position: "left-[259px]" },
    ],
  };

  return (
    <div className="relative w-full max-w-[375px] mx-auto h-[169px] bg-black rounded-[10px] border border-solid border-neutral-700">
      <div className="absolute w-[calc(100%-36px)] max-w-[300px] h-[11px] top-[90px] left-[18px]">
        <div className="relative w-full h-6 -top-1.5 -left-1">
          <div className="absolute w-full h-[19px] top-0.5 left-0 bg-[#373737] rounded-[32px] border-4 border-solid border-[#ffffff33]" />

          <div
            className="absolute h-[11px] top-1.5 left-1 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-[32px]"
            style={{
              width: `${Math.min((progressPercentage / 100) * 137, 137)}px`,
            }}
          />

          <div
            className="absolute w-6 h-6 top-0 bg-white rounded-full border-2 border-[#FFD700]"
            style={{
              left: `${Math.min((progressPercentage / 100) * 130, 130)}px`,
            }}
          />

          <div className="right-6 absolute w-6 h-6 top-0 bg-[#373737] rounded-full border-2 border-[#666666]" />
        </div>
      </div>

      <h2 className="w-[calc(100%-80px)] max-w-[210px] h-6 top-4 left-[62px] [font-family:'Poppins-SemiBold',Helvetica] font-semibold text-white text-base leading-6 absolute tracking-[0] truncate">
        You&#39;re off to a great start!
      </h2>

      <div className="absolute w-10 h-8 top-[15px] left-4  rounded-full flex items-center justify-center">
        <img src="/Pic.png" alt="XP" className="w-6 h-6" />
      </div>

      <div className="absolute w-[153px] h-[21px] top-[113px] left-[18px]">
        <div className="h-[21px] -top-px left-[65px] [font-family:'Poppins-Medium',Helvetica] font-medium text-[#dddddd] text-sm text-right leading-[normal] absolute tracking-[0]">
          out of {progressData.totalXp.toLocaleString()}
        </div>

        <div className="h-[21px] -top-px left-0 [font-family:'Poppins-Medium',Helvetica] font-medium text-[#d2d2d2] text-sm leading-[normal] absolute tracking-[0]">
          {progressData.currentXp.toLocaleString()}
        </div>

        <div className="absolute w-5 h-[18px] top-[3px] left-[41px]  rounded-sm flex items-center justify-center">
          <img src="/Pic.png" alt="XP" className="w-5 h-5" />
        </div>
      </div>

      <div className="absolute w-[calc(100%-32px)] max-w-[303px] h-[15px] top-[63px] left-4">
        {progressData.levels.map((level, index) => (
          <div
            key={index}
            className={`h-3.5 -top-px ${level.position} [font-family:'Poppins-Regular',Helvetica] font-normal text-white text-sm leading-[14px] whitespace-nowrap absolute tracking-[0]`}
          >
            {level.name}
          </div>
        ))}
      </div>

      <div className="absolute w-5 h-5 top-36 left-1/2 -translate-x-1/2">
        <div className="w-4 h-4  items-center justify-center">
          <svg
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1.5L6 6.5L11 1.5"
              stroke="#888888"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <svg
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1.5L6 6.5L11 1.5"
              stroke="#888888"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
// --- THIS IS THE FULLY IMPLEMENTED HEADER COMPONENT ---
const HeaderSection = () => {
  const router = useRouter();
  const { user, token } = useAuth();

  const [profile, setProfile] = useState(null);
  const [balance, setBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        try {
          // Fetch profile and balance in parallel
          const [profileData, walletData] = await Promise.all([
            getProfile(token),
            getProfileStats(token),
          ]);
          setProfile(profileData);
          setBalance(walletData.balance);
        } catch (error) {
          console.error("Failed to fetch header data:", error);
          // Set to empty objects to use fallbacks
          setProfile({});
          setBalance(null);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    } else if (user) {
      // Handle case where auth is loaded but no token (should not happen in protected routes)
      setIsLoading(false);
    }
  }, [token, user]);

  const handleProfileClick = () => {
    router.push("/myprofile");
  };
  const handleWalletClick = () => router.push("/wallet"); // Example route, adjust as needed

  // Use fetched first name or fallback from user context or a generic greeting
  const firstName = profile?.firstName || user?.firstName || "there";
  const greeting = `Hi ${firstName}! 👋`;

  return (
    <header className="absolute top-[66px] left-0 w-full px-5 bg-transparent z-20">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <button
            className="relative w-12 h-12 cursor-pointer hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 z-50 rounded-full overflow-hidden"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleProfileClick();
            }}
            type="button"
            aria-label="Go to My Profile"
          >
            <img
              className="w-full h-full pointer-events-none rounded-full object-cover"
              alt="Profile"
              src={
                profile?.profile?.avatar ||
                "https://c.animaapp.com/xCaMzUYh/img/group-4-1@2x.png"
              }
              crossOrigin="anonymous"
              onError={(e) => {
                console.log("Avatar failed to load, falling back to default");
                e.target.src =
                  "https://c.animaapp.com/xCaMzUYh/img/group-4-1@2x.png";
              }}
            />
          </button>
          <div className="flex flex-col items-start gap-1">
            <div className="[font-family:'Poppins',Helvetica] font-normal text-white text-sm tracking-[-0.17px] leading-[18px]">
              Welcome Back {greeting}
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-[87px] h-9 rounded-3xl bg-[linear-gradient(180deg,rgba(158,173,247,0.4)_0%,rgba(113,106,231,0.4)_100%)] flex items-center justify-between px-2.5">
            <div className="text-white text-lg [font-family:'Poppins',Helvetica] font-semibold leading-[normal]">
              {balance || 0}
            </div>
            <img
              className="w-[23px] h-6"
              alt="Image"
              src="https://c.animaapp.com/xCaMzUYh/img/image-3937-3@2x.png"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

const MainContentSection = () => {
  const { token } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        try {
          const data = await getHomeDashboard(token);
          setDashboardData(data);
        } catch (error) {
          console.error(
            "Failed to fetch dashboard data for main content:",
            error
          );
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [token]);

  const mostPlayedGames = [
    {
      id: 1,
      name: "Gates of Olympus",
      image: "https://c.animaapp.com/xCaMzUYh/img/image-3928@2x.png",
      bgImage: "https://c.animaapp.com/xCaMzUYh/img/oval-1@2x.png",
      borderImage: "https://c.animaapp.com/xCaMzUYh/img/oval.svg",
      borderColor: "#FF69B4",
      isNew: false,
    },
    {
      id: 2,
      name: "CS:Go Rall",
      image: "https://c.animaapp.com/xCaMzUYh/img/layer-30@2x.png",
      bgGradient:
        "linear-gradient(180deg,rgba(50,50,50,1)_0%,rgba(30,30,30,1)_100%)",
      borderImage: "https://c.animaapp.com/xCaMzUYh/img/oval-7.svg",
      borderColor: "#FF69B4",
      isNew: false,
    },
    {
      id: 3,
      name: "Fortnite",
      image: "https://c.animaapp.com/xCaMzUYh/img/image@2x.png",
      bgImage: "https://c.animaapp.com/xCaMzUYh/img/oval-4@2x.png",
      borderImage: "https://c.animaapp.com/xCaMzUYh/img/oval-3.svg",
      borderColor: "#FF69B4",
      isNew: true,
    },
    {
      id: 4,
      name: "Sweet Bonanza",
      image: "https://c.animaapp.com/xCaMzUYh/img/image-3926@2x.png",
      bgImage: "https://c.animaapp.com/xCaMzUYh/img/oval-6@2x.png",
      borderImage: "https://c.animaapp.com/xCaMzUYh/img/oval-5.svg",
      borderColor: "#FF69B4",
      isNew: false,
    },
    {
      id: 5,
      name: "Sugar Rush",
      image: "https://c.animaapp.com/xCaMzUYh/img/image-217@2x.png",
      bgGradient:
        "linear-gradient(180deg,rgba(141,173,248,1)_0%,rgba(240,136,249,1)_100%)",
      borderImage: "https://c.animaapp.com/xCaMzUYh/img/oval-2.svg",
      borderColor: "#FF69B4",
      isNew: false,
    },
    {
      id: 6,
      name: "Le Bandit",
      image: "https://c.animaapp.com/xCaMzUYh/img/image-218@2x.png",
      bgGradient:
        "linear-gradient(180deg,rgba(43,113,59,1)_0%,rgba(250,212,39,1)_100%)",
      borderImage: "https://c.animaapp.com/xCaMzUYh/img/oval-8.svg",
      borderColor: "#FF69B4",
      isNew: false,
    },
  ];

  const nonGamingOffers = [
    {
      id: 1,
      name: "Albert- Mobile Banking",
      image: "https://c.animaapp.com/xCaMzUYh/img/image-3981@2x.png",
      bgImage: "https://c.animaapp.com/xCaMzUYh/img/rectangle-74@2x.png",
      bottomBg: "https://c.animaapp.com/xCaMzUYh/img/rectangle-76@2x.png",
      earnAmount: "Earn upto 100",
    },
    {
      id: 2,
      name: "Chime- Mobile Banking",
      image: "https://c.animaapp.com/xCaMzUYh/img/image-3980@2x.png",
      bgImage: "https://c.animaapp.com/xCaMzUYh/img/rectangle-73-1@2x.png",
      bottomBg: "https://c.animaapp.com/xCaMzUYh/img/rectangle-74-1@2x.png",
      earnAmount: "Earn upto 100",
      provider: "BitLabs",
    },
    {
      id: 3,
      name: "Albert- Mobile Banking",
      image: "https://c.animaapp.com/xCaMzUYh/img/image-3982@2x.png",
      bgImage: "https://c.animaapp.com/xCaMzUYh/img/rectangle-74@2x.png",
      bottomBg: "https://c.animaapp.com/xCaMzUYh/img/rectangle-76@2x.png",
      earnAmount: "Earn upto 100",
    },
  ];

  const surveyProviders = [
    {
      id: 1,
      name: "Ayet Studios",
      image: "https://c.animaapp.com/xCaMzUYh/img/image-3979@2x.png",
      bgImage: "https://c.animaapp.com/xCaMzUYh/img/rectangle-74-2@2x.png",
    },
    {
      id: 2,
      name: "BitLabs",
      image: "https://c.animaapp.com/xCaMzUYh/img/image-3974@2x.png",
      bgImage: "https://c.animaapp.com/xCaMzUYh/img/rectangle-73-3@2x.png",
    },
    {
      id: 3,
      name: "CPX Research",
      image: "https://c.animaapp.com/xCaMzUYh/img/image-3977@2x.png",
      bgImage: "https://c.animaapp.com/xCaMzUYh/img/rectangle-74-2@2x.png",
    },
  ];

  // SKELETON LOADER FOR THE MAIN CONTENT
  if (isLoading) {
    return (
      <div className="flex flex-col w-full max-w-[375px] mx-auto items-center gap-8 pt-36 px-4">
        <div className="w-full h-[135px] bg-gray-800 rounded-lg animate-pulse"></div>
        <div className="w-full h-[169px] bg-gray-800 rounded-lg animate-pulse"></div>
        {/* Add more skeleton loaders for other sections as needed */}
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-[375px] mx-auto items-center gap-6 pt-36 px-4 relative">
      {dashboardData?.stats && <RewardProgress stats={dashboardData.stats} />}
      {dashboardData?.stats && <XpTierTracker stats={dashboardData.stats} />}
      <div className="flex flex-col items-start gap-4 relative w-full">
        <div className="flex w-full items-center justify-between">
          <div className="[font-family:'Poppins',Helvetica] font-semibold text-white text-base tracking-[0] leading-[normal]">
            Most Played
          </div>
          <div className="[font-family:'Poppins',Helvetica] font-medium text-[#8b92de] text-base tracking-[0] leading-[normal]">
            See All
          </div>
        </div>
        <div className="flex h-[110px] items-start gap-3 w-full overflow-x-auto scrollbar-hide -mx-4 px-4">
          {mostPlayedGames.map((game) => (
            <div
              key={game.id}
              className="items-start inline-flex flex-col gap-1.5 relative flex-[0_0_auto] cursor-pointer hover:scale-105 transition-transform duration-200"
            >
              <div
                className={`relative w-[72px] h-[72px] rounded-full`}
                style={{
                  border: `2px solid ${game.borderColor}`,
                  boxShadow: `0 0 0 1px rgba(255,255,255,0.1), 0 4px 12px rgba(0,0,0,0.3), 0 0 8px ${game.borderColor}40`,
                  background: `url(${game.borderImage})`,
                  backgroundSize: "100% 100%",
                }}
              >
                <div
                  className={`relative w-16 h-16 top-1 left-1 rounded-[32px] shadow-inner ${
                    game.bgGradient
                      ? `bg-[${game.bgGradient}]`
                      : game.bgImage
                      ? `bg-[url(${game.bgImage})] bg-cover bg-[50%_50%]`
                      : "bg-[#00000033]"
                  }`}
                >
                  <img
                    className={`absolute ${
                      game.id === 1
                        ? "w-16 h-[61px] top-[3px] left-0 aspect-[1.05]"
                        : game.id === 2
                        ? "w-10 h-[44px] top-[10px] left-3 aspect-[0.89] object-cover"
                        : game.id === 3
                        ? "w-[67px] h-[58px] top-1.5 left-0"
                        : game.id === 4
                        ? "w-16 h-[49px] top-[15px] left-0 aspect-[1.3] object-cover"
                        : game.id === 5
                        ? "w-[68px] h-[42px] top-[11px] left-0"
                        : "w-12 h-[54px] top-1.5 left-3 aspect-[0.88]"
                    }`}
                    alt="Image"
                    src={game.image}
                  />
                </div>
              </div>
              <div className="relative w-[72px] [font-family:'Poppins',Helvetica] font-medium text-white text-xs text-center tracking-[0] leading-4 overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">
                {game.name}
              </div>
              {game.isNew && (
                <div className="absolute w-11 h-4 top-[59px] left-3.5 rounded overflow-hidden bg-[linear-gradient(90deg,rgba(98,58,167,1)_0%,rgba(209,151,248,1)_100%)]">
                  <div className="absolute w-[33px] -top-px left-[5px] [font-family:'Poppins',Helvetica] font-semibold text-white text-xs text-center tracking-[0] leading-4 overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">
                    New
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-start gap-4 relative w-full">
        <div className="flex w-full items-center justify-between">
          <p className="text-white [font-family:'Poppins',Helvetica] font-semibold text-xl tracking-[0] leading-[normal] text-nowrap ">
            💸 💸 Fast Fun, Real Rewards!💸 💸
          </p>
        </div>

        {/* Welcome Offer Component */}
        <WelcomeOffer />

        <Frame />
      </div>
      <div className="flex flex-col w-full items-start gap-4 relative">
        <div className="flex w-full items-center justify-between">
          <div className="[font-family:'Poppins',Helvetica] font-semibold text-white text-base tracking-[0] leading-[normal]">
            Non- Gaming Offers
          </div>
        </div>
        <div className="relative w-full h-[220px] overflow-hidden">
          <div className="w-full h-[220px] flex justify-center">
            <div className="relative w-full max-w-[375px] h-[220px]">
              <div className="absolute w-full h-[161px] top-[22px] left-0">
                {nonGamingOffers.slice(0, 2).map((offer, index) => (
                  <div
                    key={offer.id}
                    className={`absolute w-[44%] ${
                      index === 0
                        ? "h-40 top-px left-0"
                        : "h-[161px] top-0 right-0"
                    }`}
                  >
                    <img
                      className={`${
                        index === 0
                          ? "w-[80%] h-40 top-0 left-0"
                          : "w-[80%] h-40 top-px right-0"
                      } absolute object-cover`}
                      alt="Rectangle"
                      src={offer.bgImage}
                    />
                    <img
                      className={`w-full h-[57px] ${
                        index === 0
                          ? "top-[103px] left-0"
                          : "top-[104px] left-0"
                      } absolute object-cover`}
                      alt="Rectangle"
                      src={offer.bottomBg}
                    />
                    <div
                      className={`absolute ${
                        index === 0
                          ? "top-[111px] left-[11px]"
                          : "top-28 left-[11px]"
                      } [font-family:'Poppins',Helvetica] font-semibold text-white text-base text-center tracking-[0] leading-5`}
                    >
                      {offer.name.split(" ").map((word, i) => (
                        <span key={i}>
                          {word}
                          {i === 0 && <br />}
                          {i > 0 && i < offer.name.split(" ").length - 1 && " "}
                        </span>
                      ))}
                    </div>
                    <img
                      className={`absolute ${
                        index === 0
                          ? "w-[62%] h-[102px] top-px left-[3px] aspect-[1.01]"
                          : "w-[62%] h-[104px] top-0 right-[5%] aspect-[1.01]"
                      }`}
                      alt="Image"
                      src={offer.image}
                    />
                    <div
                      className={`w-24 h-[23px] ${
                        index === 0
                          ? "top-[72px] left-2.5"
                          : "top-[73px] left-11"
                      } rounded absolute overflow-hidden bg-[linear-gradient(180deg,rgba(158,173,247,1)_0%,rgba(113,106,231,1)_100%)]`}
                    >
                      <div className="absolute top-[3px] left-1.5 [font-family:'Poppins',Helvetica] font-medium text-white text-[10.2px] tracking-[0] leading-[normal]">
                        {offer.earnAmount}
                      </div>
                      <img
                        className="absolute w-[11px] h-3 top-1.5 left-[78px] aspect-[0.97]"
                        alt="Image"
                        src="https://c.animaapp.com/xCaMzUYh/img/image-3937-1@2x.png"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <img
                className="h-[220px] absolute w-[44%] top-0 left-1/2 -translate-x-1/2 object-cover z-10"
                alt="Rectangle"
                src="https://c.animaapp.com/xCaMzUYh/img/rectangle-73-1@2x.png"
              />
              <img
                className="absolute w-[44%] h-[57px] top-[163px] left-1/2 -translate-x-1/2 object-cover z-10"
                alt="Rectangle"
                src="https://c.animaapp.com/xCaMzUYh/img/rectangle-74-1@2x.png"
              />
              <div className="absolute top-[172px] left-1/2 -translate-x-1/2 [font-family:'Poppins',Helvetica] font-semibold text-white text-base text-center tracking-[0] leading-5 z-20">
                Chime- Mobile
                <br />
                Banking
              </div>
              <div className="absolute w-[61px] h-6 top-[130px] left-1/2 -translate-x-1/2 z-20">
                <div className="absolute top-0 left-0 [font-family:'Poppins',Helvetica] font-semibold text-white text-base tracking-[0] leading-[normal]">
                  BitLabs
                </div>
              </div>
              <img
                className="absolute w-[33%] h-[153px] top-px left-1/2 -translate-x-1/2 aspect-[0.81] object-contain z-20"
                alt="Image"
                src="https://c.animaapp.com/xCaMzUYh/img/image-3980@2x.png"
              />
              <div className="w-[32%] h-[29px] top-[127px] left-1/2 -translate-x-1/2 rounded-[10px] absolute overflow-hidden bg-[linear-gradient(180deg,rgba(158,173,247,1)_0%,rgba(113,106,231,1)_100%)] z-20">
                <div className="absolute top-1 left-2 [font-family:'Poppins',Helvetica] font-medium text-white text-[13px] tracking-[0] leading-[normal]">
                  Earn upto 100
                </div>
                <img
                  className="w-[15px] h-[15px] top-[7px] left-[99px] absolute aspect-[0.97]"
                  alt="Image"
                  src="https://c.animaapp.com/xCaMzUYh/img/image-3937-2@2x.png"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full h-[127px] items-start gap-4 relative">
        <img
          className="h-[127px] relative w-full"
          alt="Race"
          src="https://c.animaapp.com/xCaMzUYh/img/race.svg"
        />
        <img
          className="absolute w-[215px] h-[119px] top-2 left-0"
          alt="Clip path group"
          src="https://c.animaapp.com/xCaMzUYh/img/clip-path-group-1@2x.png"
        />
        <div className="flex flex-col w-[198px] items-start absolute top-[21px] left-[25px]">
          <div className="flex flex-col items-start pt-0 pb-2 px-0 relative self-stretch w-full flex-[0_0_auto]">
            <div className="relative w-fit mt-[-1.00px] [font-family:'Poppins',Helvetica] font-bold text-white text-sm tracking-[0] leading-4 whitespace-nowrap">
              Become a
            </div>
            <div className="relative w-fit ml-[-0.50px] [text-shadow:0px_4px_8px_#1a002f40] [-webkit-text-stroke:0.5px_transparent]  [-webkit-background-clip:text] bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(245,245,245,1)_100%)] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Poppins',Helvetica] font-semibold text-transparent text-[32px] tracking-[0] leading-8 whitespace-nowrap">
              VIP Member
            </div>
          </div>
          <div className="inline-flex items-start gap-2.5 px-3.5 py-2 relative flex-[0_0_auto] bg-[#ffdd8f] rounded-xl">
            <div className="relative w-fit mt-[-1.00px] [font-family:'Poppins',Helvetica] font-semibold text-[#736de8] text-[13px] tracking-[0] leading-[normal]">
              Check Plans
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full items-start gap-4 relative">
        <div className="h-36 rounded-[20px] overflow-hidden bg-[linear-gradient(51deg,rgba(88,41,171,1)_0%,rgba(59,41,171,1)_100%)] overflow-x-scroll relative w-full">
          <div className="relative w-[371px] h-[198px] -top-4 left-2">
            <div className="top-[81px] left-1 font-normal absolute [font-family:'Poppins',Helvetica] text-white text-base tracking-[0] leading-6 whitespace-nowrap">
              Take Part & Win
            </div>
            <div className="absolute w-[371px] h-[198px] top-0 left-0">
              <div className="top-[107px] left-1 text-[#fff57f] absolute [font-family:'Poppins',Helvetica] font-semibold text-[26px] tracking-[0] leading-6 whitespace-nowrap">
                Exciting Rewards
              </div>
              <img
                className="absolute w-[198px] h-[198px] top-0 left-[173px] aspect-[1] object-cover"
                alt="Image"
                src="https://c.animaapp.com/xCaMzUYh/img/image-219@2x.png"
              />
              <img
                className="absolute w-[211px] h-[42px] top-[38px] left-0 mix-blend-lighten"
                alt="Banner DON t REMOVE"
                src="https://c.animaapp.com/xCaMzUYh/img/banner---don-t-remove@2x.png"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full items-start gap-4 relative">
        <div className="flex w-full items-center justify-between">
          <p className="[font-family:'Poppins',Helvetica] font-semibold text-white text-base tracking-[0] leading-[normal]">
            Get Paid to do Surveys
          </p>
        </div>
        <div className="relative w-full h-[190px] overflow-hidden">
          <div className="w-full h-[190px] flex justify-center">
            <div className="relative w-full max-w-[375px] h-[190px]">
              <div className="absolute w-full h-40 top-[11px] left-0">
                {surveyProviders
                  .filter((_, index) => index !== 1)
                  .map((provider, index) => (
                    <div
                      key={provider.id}
                      className={`absolute w-[35%] h-40 top-0 ${
                        index === 0 ? "left-0" : "right-0"
                      } bg-[url(${provider.bgImage})] bg-cover bg-[50%_50%]`}
                    >
                      <div
                        className={`absolute ${
                          index === 0
                            ? "top-[97px] left-[21px]"
                            : "top-[90px] left-[37px]"
                        } [font-family:'Poppins',Helvetica] font-semibold text-white text-base text-center tracking-[0] leading-5`}
                      >
                        {provider.name.split(" ").map((word, i) => (
                          <span key={i}>
                            {word}
                            {i === 0 && <br />}
                            {i > 0 &&
                              i < provider.name.split(" ").length - 1 &&
                              " "}
                          </span>
                        ))}
                      </div>
                      <img
                        className={`absolute ${
                          index === 0
                            ? "w-[65px] h-[65px] top-6 left-[18px] aspect-[1]"
                            : "w-[70px] h-[51px] top-[31px] left-[41px] aspect-[1.37]"
                        }`}
                        alt="Image"
                        src={provider.image}
                      />
                    </div>
                  ))}
              </div>
              <img
                className="h-[190px] absolute w-[44%] top-0 left-1/2 -translate-x-1/2 object-cover z-10"
                alt="Rectangle"
                src="https://c.animaapp.com/xCaMzUYh/img/rectangle-73-3@2x.png"
              />
              <div className="absolute w-[61px] h-6 top-[123px] left-1/2 -translate-x-1/2 z-20">
                <div className="absolute top-0 left-0 [font-family:'Poppins',Helvetica] font-semibold text-white text-base tracking-[0] leading-[normal]">
                  BitLabs
                </div>
              </div>
              <img
                className="absolute w-20 h-[78px] top-[39px] left-1/2 -translate-x-1/2 aspect-[1.03] object-contain z-20"
                alt="Image"
                src="https://c.animaapp.com/xCaMzUYh/img/image-3974@2x.png"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full items-start gap-4 relative">
        <div className="h-[111px] rounded-[20px] overflow-hidden bg-[linear-gradient(64deg,rgba(41,138,171,1)_0%,rgba(41,171,162,1)_100%)] overflow-x-scroll relative w-full">
          <div className="relative w-[285px] h-[207px] top-[-73px] left-5">
            <div className="top-[88px] left-0 font-medium absolute [font-family:'Poppins',Helvetica] text-white text-base tracking-[0] leading-6 whitespace-nowrap">
              30 Days Streak
            </div>
            <div className="absolute top-[141px] left-0 [font-family:'Poppins',Helvetica] font-medium text-white text-base tracking-[0] leading-6 whitespace-nowrap">
              if you login daily
            </div>
            <div className="absolute w-[285px] h-[207px] top-0 left-0">
              <div className="top-[114px] left-0 text-[#b3ffac] absolute [font-family:'Poppins',Helvetica] font-semibold text-[26px] tracking-[0] leading-6 whitespace-nowrap">
                Exciting Rewards
              </div>
              <img
                className="absolute w-[66px] h-[207px] top-0 left-[219px] aspect-[0.32]"
                alt="Image"
                src="https://c.animaapp.com/xCaMzUYh/img/image-3995@2x.png"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
