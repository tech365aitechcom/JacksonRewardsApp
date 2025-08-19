"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export const GameListSection = () => {
  const [userGames, setUserGames] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // API functions
  const fetchUserGames = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/game`);
      if (response.ok) {
        const data = await response.json();
        setUserGames(data);
      }
    } catch (error) {
      console.error('Failed to fetch user games:', error);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/profile/stats`);
      if (response.ok) {
        const data = await response.json();
        setUserStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    }
  };

  const startNewGame = async (gameId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/game/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId }),
      });
      if (response.ok) {
        await fetchUserGames(); // Refresh games list
      }
    } catch (error) {
      console.error('Failed to start new game:', error);
    }
  };

  const updateGameScore = async (gameId, score) => {
    try {
      const response = await fetch(`${BASE_URL}/api/game/score`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, score }),
      });
      if (response.ok) {
        await fetchUserGames(); // Refresh games list
      }
    } catch (error) {
      console.error('Failed to update game score:', error);
    }
  };

  const completeGame = async (gameId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/game/complete`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId }),
      });
      if (response.ok) {
        await fetchUserGames(); // Refresh games list
      }
    } catch (error) {
      console.error('Failed to complete game:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchUserGames(), fetchUserStats()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Downloaded games data (keeping static data as fallback)
  const downloadedGames = [
    {
      id: 1,
      name: "Fortnite",
      genre: "Action",
      subtitle: "Hey Jatin!",
      image:
        "https://c.animaapp.com/3mn7waJw/img/unsplash-bi91nrppe38-7@2x.png",
      overlayImage: "https://c.animaapp.com/3mn7waJw/img/image-4@2x.png",
      score: "100",
      bonus: "+500",
      coinIcon: "https://c.animaapp.com/3mn7waJw/img/image-3937-12@2x.png",
      picIcon: "https://c.animaapp.com/3mn7waJw/img/pic.svg",
      hasStatusDot: true,
    },
    {
      id: 2,
      name: "Sugar Rush",
      genre: "Puzzle",
      subtitle: "How to play game",
      image: null,
      overlayImage: "https://c.animaapp.com/3mn7waJw/img/image-217@2x.png",
      score: "90",
      bonus: "+400",
      coinIcon: "https://c.animaapp.com/3mn7waJw/img/image-3937-12@2x.png",
      picIcon: "https://c.animaapp.com/3mn7waJw/img/pic-1.svg",
      hasStatusDot: true,
      isGradientBg: true,
    },
    {
      id: 3,
      name: "Sweet Bonanza",
      genre: "Puzzle",
      subtitle: "Hey Jatin!",
      image:
        "https://c.animaapp.com/3mn7waJw/img/unsplash-bi91nrppe38-1@2x.png",
      overlayImage: "https://c.animaapp.com/3mn7waJw/img/image-3926@2x.png",
      score: "70",
      bonus: "+300",
      coinIcon: "https://c.animaapp.com/3mn7waJw/img/image-3937-12@2x.png",
      picIcon: "https://c.animaapp.com/3mn7waJw/img/pic-2.svg",
      hasStatusDot: false,
    },
    {
      id: 4,
      name: "Game of Olympus",
      genre: "Action",
      subtitle: "Hey Jatin!",
      image: null,
      overlayImage: "https://c.animaapp.com/3mn7waJw/img/image-3928@2x.png",
      score: "60",
      bonus: "+200",
      coinIcon: "https://c.animaapp.com/3mn7waJw/img/image-3937-12@2x.png",
      picIcon: "https://c.animaapp.com/3mn7waJw/img/pic-3.svg",
      hasStatusDot: false,
      backgroundImage: "https://c.animaapp.com/3mn7waJw/img/oval@2x.png",
    },
  ];

  // Other games data
  const otherGames = [
    {
      id: 5,
      name: "Orbit Fall",
      genre: "Action",
      subtitle: "Hey Jatin!",
      image:
        "https://c.animaapp.com/3mn7waJw/img/unsplash-bi91nrppe38-2@2x.png",
      overlayImage: "https://c.animaapp.com/3mn7waJw/img/image-3930@2x.png",
      score: "20",
      bonus: "+50.5",
      coinIcon: "https://c.animaapp.com/3mn7waJw/img/image-3937-12@2x.png",
      picIcon: "https://c.animaapp.com/3mn7waJw/img/pic-8.svg",
    },
    {
      id: 6,
      name: "Commado",
      genre: "Action",
      subtitle: "Hey Jatin!",
      image: null,
      overlayImage: null,
      score: "10.1",
      bonus: "+30",
      coinIcon: "https://c.animaapp.com/3mn7waJw/img/image-3937-12@2x.png",
      picIcon: "https://c.animaapp.com/3mn7waJw/img/pic-9.svg",
      backgroundImage:
        "https://c.animaapp.com/3mn7waJw/img/rectangle-24@2x.png",
      hasBlur: true,
    },
    {
      id: 7,
      name: "Robbery Bob",
      genre: "Action",
      subtitle: "Hey Jatin!",
      image: null,
      overlayImage: null,
      score: "9.2",
      bonus: "+10",
      coinIcon: "https://c.animaapp.com/3mn7waJw/img/image-3937-12@2x.png",
      picIcon: "https://c.animaapp.com/3mn7waJw/img/pic-10.svg",
      backgroundImage:
        "https://c.animaapp.com/3mn7waJw/img/rectangle-25@2x.png",
      hasBlur: true,
    },
    {
      id: 8,
      name: "Legends",
      genre: "Action",
      subtitle: "Hey Jatin!",
      image:
        "https://c.animaapp.com/3mn7waJw/img/unsplash-bi91nrppe38-3@2x.png",
      overlayImage:
        "https://c.animaapp.com/3mn7waJw/img/png-transparent-mobile-legends-bang-bang-desktop-mobile-phones-a@2x.png",
      score: "8",
      bonus: "+2.5",
      coinIcon: "https://c.animaapp.com/3mn7waJw/img/image-3937-8@2x.png",
      picIcon: "https://c.animaapp.com/3mn7waJw/img/pic-11.svg",
    },
  ];

  // Recent games data (all Fortnite with different scores)
  const recentGames = [
    {
      id: 9,
      name: "Fortnite",
      genre: "Action",
      subtitle: "Hey Jatin!",
      image:
        "https://c.animaapp.com/3mn7waJw/img/unsplash-bi91nrppe38-7@2x.png",
      overlayImage: "https://c.animaapp.com/3mn7waJw/img/image-4@2x.png",
      score: "2",
      bonus: "+5",
      coinIcon: "https://c.animaapp.com/3mn7waJw/img/image-3937-12@2x.png",
      picIcon: "https://c.animaapp.com/3mn7waJw/img/pic-12.svg",
      scoreWidth: "w-[49px]",
    },
    {
      id: 10,
      name: "Fortnite",
      genre: "Action",
      subtitle: "Hey Jatin!",
      image:
        "https://c.animaapp.com/3mn7waJw/img/unsplash-bi91nrppe38-7@2x.png",
      overlayImage: "https://c.animaapp.com/3mn7waJw/img/image-4@2x.png",
      score: "2",
      bonus: "+1.5",
      coinIcon: "https://c.animaapp.com/3mn7waJw/img/image-3937-12@2x.png",
      picIcon: "https://c.animaapp.com/3mn7waJw/img/pic-13.svg",
      scoreWidth: "w-[54px]",
    },
    {
      id: 11,
      name: "Fortnite",
      genre: "Action",
      subtitle: "Hey Jatin!",
      image:
        "https://c.animaapp.com/3mn7waJw/img/unsplash-bi91nrppe38-7@2x.png",
      overlayImage: "https://c.animaapp.com/3mn7waJw/img/image-4@2x.png",
      score: "1.2",
      bonus: "+5",
      coinIcon: "https://c.animaapp.com/3mn7waJw/img/image-3937-12@2x.png",
      picIcon: "https://c.animaapp.com/3mn7waJw/img/pic-14.svg",
      scoreWidth: "w-[54px]",
    },
    {
      id: 12,
      name: "Fortnite",
      genre: "Action",
      subtitle: "Hey Jatin!",
      image:
        "https://c.animaapp.com/3mn7waJw/img/unsplash-bi91nrppe38-7@2x.png",
      overlayImage: "https://c.animaapp.com/3mn7waJw/img/image-4@2x.png",
      score: "0.8",
      bonus: "+5",
      coinIcon: "https://c.animaapp.com/3mn7waJw/img/image-3937-12@2x.png",
      picIcon: "https://c.animaapp.com/3mn7waJw/img/pic-15.svg",
      scoreWidth: "w-[55px]",
    },
  ];

  // Non-gaming offers data
  const nonGamingOffers = [
    {
      id: 1,
      name: "Albert- Mobile Banking",
      image: "https://c.animaapp.com/3mn7waJw/img/image-3981@2x.png",
      backgroundImage:
        "https://c.animaapp.com/3mn7waJw/img/rectangle-74@2x.png",
      bottomImage: "https://c.animaapp.com/3mn7waJw/img/rectangle-76@2x.png",
      coinIcon: "https://c.animaapp.com/3mn7waJw/img/image-3937-14@2x.png",
    },
    {
      id: 2,
      name: "Chime- Mobile Banking",
      image: "https://c.animaapp.com/3mn7waJw/img/image-3980@2x.png",
      backgroundImage:
        "https://c.animaapp.com/3mn7waJw/img/rectangle-73-1@2x.png",
      bottomImage: "https://c.animaapp.com/3mn7waJw/img/rectangle-74-1@2x.png",
      coinIcon: "https://c.animaapp.com/3mn7waJw/img/image-3937-15@2x.png",
      isCenter: true,
    },
    {
      id: 3,
      name: "Albert- Mobile Banking",
      image: "https://c.animaapp.com/3mn7waJw/img/image-3982@2x.png",
      backgroundImage:
        "https://c.animaapp.com/3mn7waJw/img/rectangle-74@2x.png",
      bottomImage: "https://c.animaapp.com/3mn7waJw/img/rectangle-76@2x.png",
      coinIcon: "https://c.animaapp.com/3mn7waJw/img/image-3937-14@2x.png",
    },
  ];

  const renderGameItem = (game, showBorder = true) => (
    <div
      key={game.id}
      className={`flex items-center justify-between pt-0 pb-4 px-0 relative self-stretch w-full flex-[0_0_auto] ${showBorder ? "border-b [border-bottom-style:solid] border-[#4d4d4d]" : ""}`}
    >
      <div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
        {game.image ? (
          <Image
            className="relative w-[55px] h-[55px] object-cover"
            alt={game.name}
            src={game.image}
            width={55}
            height={55}
          />
        ) : game.backgroundImage ? (
          <div
            className={`${game.hasBlur ? "ml-[-0.56px] " : ""}bg-[url(${game.backgroundImage})] bg-${game.hasBlur ? "[100%_100%]" : "cover bg-[50%_50%]"} relative w-[55px] h-[55px]${game.isGradientBg ? " rounded-[27.5px] bg-[linear-gradient(180deg,rgba(141,173,248,1)_0%,rgba(240,136,249,1)_100%)]" : ""}`}
          >
            {game.hasBlur && (
              <div className="relative h-[55px] -left-px rounded-[27px] blur-[0.61px] bg-[linear-gradient(180deg,rgba(0,0,0,0.31)_0%,rgba(0,0,0,0.65)_88%)]" />
            )}
            {game.overlayImage && !game.hasBlur && (
              <Image
                className="absolute w-[55px] h-[52px] top-[3px] left-0"
                alt="Game overlay"
                src={game.overlayImage}
                width={55}
                height={52}
              />
            )}
          </div>
        ) : (
          <div className="relative w-[55px] h-[55px] rounded-[27.5px] bg-[linear-gradient(180deg,rgba(141,173,248,1)_0%,rgba(240,136,249,1)_100%)]" />
        )}

        <div className="flex-col w-[139px] items-start flex relative">
          <div className="relative self-stretch mb-1 [font-family:'Poppins',Helvetica] font-bold text-white text-base tracking-[0] leading-tight">
            {game.name}
          </div>
          <div className="relative self-stretch mb-1 [font-family:'Poppins',Helvetica] font-normal text-white text-xs tracking-[0] leading-tight">
            ({game.genre})
          </div>
          <div className="relative self-stretch [font-family:'Poppins',Helvetica] font-normal text-[#bdbdbd] text-[13px] tracking-[0] leading-[normal]">
            {game.subtitle}
          </div>
        </div>

        {game.overlayImage && game.image && (
          <Image
            className="absolute w-[67px] h-[58px] -top-0.5 left-[-7px]"
            alt="Game overlay"
            src={game.overlayImage}
            width={67}
            height={58}
          />
        )}

        {game.overlayImage && game.isGradientBg && (
          <Image
            className="absolute w-9 h-[41px] top-[7px] left-2.5 object-cover"
            alt="Game overlay"
            src={game.overlayImage}
            width={36}
            height={41}
          />
        )}

        {game.overlayImage &&
          game.backgroundImage &&
          !game.hasBlur &&
          !game.image && (
            <Image
              className="absolute w-[54px] h-[42px] top-[13px] left-0 object-cover"
              alt="Game overlay"
              src={game.overlayImage}
              width={54}
              height={42}
            />
          )}

        {game.overlayImage && game.name === "Legends" && (
          <Image
            className="absolute w-[55px] h-[55px] top-0 left-0"
            alt="Game overlay"
            src={game.overlayImage}
            width={55}
            height={55}
          />
        )}
      </div>

      <div
        className={`relative ${game.scoreWidth || "w-[62px]"} h-[55px] rounded-[10px] overflow-hidden bg-[linear-gradient(180deg,rgba(158,173,247,0.6)_0%,rgba(113,106,231,0.6)_100%)]`}
      >
        <div className="top-2 left-[3px] text-base leading-5 absolute [font-family:'Poppins',Helvetica] font-medium text-white tracking-[0] whitespace-nowrap">
          {game.score.includes(".") ? game.score : ` ${game.score}`}
        </div>
        <Image
          className="absolute w-[19px] h-[19px] top-[9px] left-[37px]"
          alt="Coin"
          src={game.coinIcon}
          width={19}
          height={19}
        />
        <div className="top-[33px] left-1.5 text-xs leading-4 absolute [font-family:'Poppins',Helvetica] font-medium text-white tracking-[0] whitespace-nowrap">
          {game.bonus}
        </div>
        <Image
          className="absolute w-[17px] h-[13px] top-[34px] left-[39px]"
          alt="Pic"
          src={game.picIcon}
          width={17}
          height={13}
        />
      </div>

      {game.hasStatusDot && (
        <div className="absolute w-2 h-2 top-[26px] left-[253px] bg-[#8b92de] rounded" />
      )}
    </div>
  );

  return (
    <div className="flex flex-col w-[335px] items-start gap-8 absolute top-[146px] left-5">
      <div className="flex flex-col items-start gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
        <div className="flex flex-col w-[335px] items-start gap-[49px] relative flex-[0_0_auto]">
          <div className="inline-flex items-center gap-0.5 relative flex-[0_0_auto]">
            <Image
              className="relative w-5 h-5"
              alt="Badge check"
              src="https://c.animaapp.com/3mn7waJw/img/badgecheck.svg"
              width={20}
              height={20}
            />
            <div className="relative w-fit mt-[-1.00px] [font-family:'Poppins',Helvetica] font-medium text-[#4bba56] text-base tracking-[0] leading-[normal]">
              Downloaded
            </div>
          </div>
        </div>

        <div className="flex flex-col w-[335px] items-start gap-2.5 px-0 py-2.5 relative flex-[0_0_auto] overflow-y-scroll">
          {downloadedGames.map((game, index) =>
            renderGameItem(game, index < downloadedGames.length - 1),
          )}
        </div>
      </div>

      {/* User Games from API */}
      {userGames.length > 0 && (
        <div className="flex flex-col items-start gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex flex-col w-[335px] items-start gap-[49px] relative flex-[0_0_auto]">
            <div className="inline-flex items-center gap-0.5 relative flex-[0_0_auto]">
              <Image
                className="relative w-5 h-5"
                alt="Badge check"
                src="https://c.animaapp.com/3mn7waJw/img/badgecheck.svg"
                width={20}
                height={20}
              />
              <div className="relative w-fit mt-[-1.00px] [font-family:'Poppins',Helvetica] font-medium text-[#4bba56] text-base tracking-[0] leading-[normal]">
                My Games Progress
              </div>
            </div>
          </div>

          <div className="flex flex-col w-[335px] items-start gap-2.5 px-0 py-2.5 relative flex-[0_0_auto] overflow-y-scroll">
            {userGames.map((game, index) => (
              <div
                key={game._id}
                className={`flex items-center justify-between pt-0 pb-4 px-0 relative self-stretch w-full flex-[0_0_auto] ${index < userGames.length - 1 ? "border-b [border-bottom-style:solid] border-[#4d4d4d]" : ""}`}
              >
                <div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
                  <div className="relative w-[55px] h-[55px] rounded-[27.5px] bg-[linear-gradient(180deg,rgba(141,173,248,1)_0%,rgba(240,136,249,1)_100%)]" />

                  <div className="flex-col w-[139px] items-start flex relative">
                    <div className="relative self-stretch mb-1 [font-family:'Poppins',Helvetica] font-bold text-white text-base tracking-[0] leading-tight">
                      {game.gameId.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                    <div className="relative self-stretch mb-1 [font-family:'Poppins',Helvetica] font-normal text-white text-xs tracking-[0] leading-tight">
                      (Puzzle)
                    </div>
                    <div className="relative self-stretch [font-family:'Poppins',Helvetica] font-normal text-[#bdbdbd] text-[13px] tracking-[0] leading-[normal]">
                      {game.completed ? 'Completed' : 'In Progress'}
                    </div>
                  </div>
                </div>

                <div className="relative w-[62px] h-[55px] rounded-[10px] overflow-hidden bg-[linear-gradient(180deg,rgba(158,173,247,0.6)_0%,rgba(113,106,231,0.6)_100%)]">
                  <div className="top-2 left-[3px] text-base leading-5 absolute [font-family:'Poppins',Helvetica] font-medium text-white tracking-[0] whitespace-nowrap">
                    {game.score}
                  </div>
                  <Image
                    className="absolute w-[19px] h-[19px] top-[9px] left-[37px]"
                    alt="Coin"
                    src="https://c.animaapp.com/3mn7waJw/img/image-3937-12@2x.png"
                    width={19}
                    height={19}
                  />
                  <div className="top-[33px] left-1.5 text-xs leading-4 absolute [font-family:'Poppins',Helvetica] font-medium text-white tracking-[0] whitespace-nowrap">
                    +{Math.floor(game.score * 0.1)}
                  </div>
                  <Image
                    className="absolute w-[17px] h-[13px] top-[34px] left-[39px]"
                    alt="Pic"
                    src="https://c.animaapp.com/3mn7waJw/img/pic.svg"
                    width={17}
                    height={13}
                  />
                </div>

                {!game.completed && (
                  <div className="absolute w-2 h-2 top-[26px] left-[253px] bg-[#8b92de] rounded" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      

      <div className="flex flex-col w-[335px] h-[455px] items-start gap-4 relative">
        <div className="flex flex-col h-[532px] items-start gap-2.5 self-stretch w-full mb-[-77.00px] relative overflow-x-scroll">
          <div className="w-[334px] h-[455px] rounded-[20px] overflow-hidden bg-[linear-gradient(103deg,rgba(121,32,207,1)_0%,rgba(205,73,153,1)_80%)] relative overflow-x-scroll">
            <div className="relative w-[334px] h-[455px]">
              <div className="absolute w-[334px] h-[91px] top-0 left-0">
                <div className="top-8 left-20 font-bold text-xl leading-6 absolute [font-family:'Poppins',Helvetica] text-white tracking-[0] whitespace-nowrap">
                  My Account Overview
                </div>
                <Image
                  className="absolute w-[55px] h-[55px] top-4 left-4"
                  alt="Group"
                  src="https://c.animaapp.com/3mn7waJw/img/group-4@2x.png"
                  width={55}
                  height={55}
                />
              </div>

              <div className="absolute w-[334px] h-[332px] top-[123px] left-0 bg-[#982fbb] rounded-[0px_0px_20px_20px]" />

              <div className="absolute w-[304px] h-[75px] top-[138px] left-[15px] border-b [border-bottom-style:solid] border-[#cacaca80]">
                <div className="absolute w-[154px] top-1.5 left-[5px] [font-family:'Poppins',Helvetica] font-bold text-white text-base tracking-[0.02px] leading-[normal]">
                  {userStats ? `${userStats.gamesPlayed}/5 Games Played` : "3/5 Games Played"}
                </div>
                <Image
                  className="absolute w-36 h-[11px] top-[41px] left-[5px]"
                  alt="Progress bar"
                  src="https://c.animaapp.com/3mn7waJw/img/progress-bar.svg"
                  width={144}
                  height={11}
                />
                <div className="w-[78px] top-0 left-[226px] absolute h-14 rounded overflow-hidden bg-[linear-gradient(331deg,rgba(237,131,0,1)_0%,rgba(237,166,0,1)_100%)]">
                  <div className="relative h-14 bg-[url(https://c.animaapp.com/3mn7waJw/img/clip-path-group@2x.png)] bg-[100%_100%]">
                    <div className="top-2 left-2.5 font-medium text-base leading-5 absolute [font-family:'Poppins',Helvetica] text-white tracking-[0] whitespace-nowrap">
                      {userStats ? userStats.xp : "0"}
                    </div>
                    <div className="top-[30px] left-2.5 font-medium text-sm leading-5 absolute [font-family:'Poppins',Helvetica] text-white tracking-[0] whitespace-nowrap">
                      +{userStats ? userStats.balance : "0"}
                    </div>
                    <Image
                      className="absolute w-[17px] h-[13px] top-[34px] left-[52px]"
                      alt="Pic"
                      src="https://c.animaapp.com/3mn7waJw/img/pic-4.svg"
                      width={17}
                      height={13}
                    />
                  </div>
                </div>
              </div>

              <div className="top-[229px] border-b [border-bottom-style:solid] border-[#cacaca80] absolute w-[304px] h-[99px] left-[15px]">
                <div className="absolute w-[178px] top-1.5 left-[5px] [font-family:'Poppins',Helvetica] font-bold text-white text-base tracking-[0.02px] leading-[normal]">
                  {userStats ? `${userStats.balance}/900 Coins Earned (Daily)` : "100/900 Coins Earned (Daily)"}
                </div>
                <Image
                  className="absolute w-[177px] h-[11px] top-[71px] left-[5px]"
                  alt="Progress bar"
                  src="https://c.animaapp.com/3mn7waJw/img/progress-bar-1.svg"
                  width={177}
                  height={11}
                />
                <div className="w-[69px] top-[7px] left-[230px] absolute h-14 rounded overflow-hidden bg-[linear-gradient(331deg,rgba(237,131,0,1)_0%,rgba(237,166,0,1)_100%)]">
                  <div className="relative h-14 bg-[url(https://c.animaapp.com/3mn7waJw/img/clip-path-group-1@2x.png)] bg-[100%_100%]">
                    <div className="left-3 absolute top-2 [font-family:'Poppins',Helvetica] font-medium text-white text-base tracking-[0] leading-5 whitespace-nowrap">
                      {userStats ? userStats.balance : "0"}
                    </div>
                    <div className="left-[11px] absolute top-[30px] [font-family:'Poppins',Helvetica] font-medium text-white text-sm tracking-[0] leading-5 whitespace-nowrap">
                      +{userStats ? Math.floor(userStats.balance * 0.5) : "0"}
                    </div>
                    <Image
                      className="absolute w-[17px] h-[13px] top-[34px] left-[43px]"
                      alt="Pic"
                      src="https://c.animaapp.com/3mn7waJw/img/pic-5.svg"
                      width={17}
                      height={13}
                    />
                  </div>
                </div>
              </div>

              <div className="top-[344px] absolute w-[304px] h-[99px] left-[15px]">
                <div className="absolute w-[178px] top-1.5 left-[5px] [font-family:'Poppins',Helvetica] font-bold text-white text-base tracking-[0.02px] leading-[normal]">
                  {userStats ? `${userStats.surveysCompleted + userStats.racesCompleted}/3 Challenges Finished (Daily)` : "0/3 Challenges Finished (Daily)"}
                </div>
                <Image
                  className="absolute w-[177px] h-[11px] top-[71px] left-[5px]"
                  alt="Progress bar"
                  src="https://c.animaapp.com/3mn7waJw/img/progress-bar-2.svg"
                  width={177}
                  height={11}
                />
                <div className="w-14 top-2 left-[245px] absolute h-14 rounded overflow-hidden bg-[linear-gradient(331deg,rgba(237,131,0,1)_0%,rgba(237,166,0,1)_100%)]">
                  <div className="relative w-16 h-14 -left-2 bg-[url(https://c.animaapp.com/3mn7waJw/img/clip-path-group-2@2x.png)] bg-[100%_100%]">
                    <div className="left-[22px] absolute top-2 [font-family:'Poppins',Helvetica] font-medium text-white text-base tracking-[0] leading-5 whitespace-nowrap">
                      10
                    </div>
                    <div className="left-[19px] absolute top-[30px] [font-family:'Poppins',Helvetica] font-medium text-white text-sm tracking-[0] leading-5 whitespace-nowrap">
                      +5
                    </div>
                    <Image
                      className="absolute w-4 h-[13px] top-[34px] left-10"
                      alt="Pic"
                      src="https://c.animaapp.com/3mn7waJw/img/pic-6.svg"
                      width={16}
                      height={13}
                    />
                  </div>
                </div>
              </div>

              <div className="absolute w-[334px] h-12 top-[78px] left-0 bg-[#80279e]" />

              <div className="left-36 flex w-[87px] h-[30px] items-center gap-[169px] absolute top-[87px]">
                <div className="relative w-[87px] h-[30px]">
                  <div className="relative h-[29px] rounded-3xl bg-[linear-gradient(180deg,rgba(158,173,247,0.4)_0%,rgba(113,106,231,0.4)_100%)]">
                    <div className="top-0 left-2.5 font-semibold text-lg leading-[normal] absolute [font-family:'Poppins',Helvetica] text-white tracking-[0]">
                      {userStats ? userStats.xp + userStats.balance : "1200"}
                    </div>
                    <Image
                      className="w-[23px] h-6 top-px left-[54px] absolute"
                      alt="Image"
                      src="https://c.animaapp.com/3mn7waJw/img/image-3937-4@2x.png"
                      width={23}
                      height={24}
                    />
                  </div>
                </div>
              </div>

              <div className="left-[236px] flex w-[87px] h-[30px] items-center gap-[169px] absolute top-[87px]">
                <div className="relative w-[87px] h-[30px]">
                  <div className="relative w-20 h-[29px] rounded-3xl bg-[linear-gradient(180deg,rgba(158,173,247,0.4)_0%,rgba(113,106,231,0.4)_100%)]">
                    <div className="top-0 left-2.5 font-semibold text-lg leading-[normal] absolute [font-family:'Poppins',Helvetica] text-white tracking-[0]">
                      {userStats ? userStats.balance : "600"}
                    </div>
                    <Image
                      className="absolute w-[23px] h-[18px] top-[5px] left-12"
                      alt="Pic"
                      src="https://c.animaapp.com/3mn7waJw/img/pic-7.svg"
                      width={23}
                      height={18}
                    />
                  </div>
                </div>
              </div>

              <div className="absolute top-[89px] left-5 [font-family:'Poppins',Helvetica] font-normal text-white text-base tracking-[0] leading-6 whitespace-nowrap">
                Total Earnings:
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
        <div className="flex flex-col w-[335px] items-start gap-2.5 px-0 py-2.5 relative flex-[0_0_auto] overflow-y-scroll">
          {otherGames.map((game, index) =>
            renderGameItem(game, index < otherGames.length - 1),
          )}
        </div>
      </div>

      <div className="relative w-[335px] h-[100px] bg-[#360875] rounded-[10px] overflow-hidden">
        <div className="relative h-[99px] top-px bg-[url(https://c.animaapp.com/3mn7waJw/img/clip-path-group-3@2x.png)] bg-[100%_100%]">
          <div className="flex flex-col w-[205px] h-12 items-start absolute top-[25px] left-[116px]">
            <div className="flex flex-col items-start pt-0 pb-2 px-0 relative self-stretch w-full flex-[0_0_auto] mb-[-8.00px]">
              <p className="relative w-fit mt-[-1.00px] [font-family:'Poppins',Helvetica] font-normal text-white text-sm tracking-[0] leading-4 whitespace-nowrap">
                Watch an ad to get a
              </p>
              <div className="relative w-fit ml-[-0.50px] [text-shadow:0px_4px_8px_#1a002f40] [-webkit-text-stroke:0.5px_transparent] [-webkit-background-clip:text] bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(245,245,245,1)_100%)] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Poppins',Helvetica] font-semibold text-transparent text-[28px] tracking-[0] leading-8 whitespace-nowrap">
                Free booster
              </div>
            </div>
          </div>
          <Image
            className="absolute w-[85px] h-[85px] top-[9px] left-[11px] object-cover"
            alt="Image"
            src="https://c.animaapp.com/3mn7waJw/img/image-3941@2x.png"
            width={85}
            height={85}
          />
        </div>
      </div>

      <div className="flex flex-col items-start gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
        <div className="flex flex-col w-[335px] items-start gap-2.5 px-0 py-2.5 relative flex-[0_0_auto] overflow-y-scroll">
          {recentGames.map((game, index) =>
            renderGameItem(game, index < recentGames.length - 1),
          )}
        </div>
      </div>

      <div className="w-[335px] gap-2.5 flex-[0_0_auto] flex flex-col items-start relative">
        <div className="relative w-[166px] h-6">
          <div className="absolute top-0 left-0 [font-family:'Poppins',Helvetica] font-semibold text-white text-base tracking-[0] leading-[normal]">
            Non- Gaming Offers
          </div>
        </div>

        <div className="relative w-[335px] h-[220px]">
          <div className="w-[337px] h-[220px]">
            <div className="relative w-[339px] h-[220px]">
              <div className="absolute w-[339px] h-[161px] top-[22px] left-0">
                {nonGamingOffers.map((offer, index) => {
                  if (offer.isCenter) {
                    return (
                      <div
                        key={offer.id}
                        className="absolute w-[165px] h-[220px] top-[-22px] left-[79px]"
                      >
                        <Image
                          className="absolute w-[165px] h-[220px] top-0 left-0 object-cover"
                          alt="Rectangle"
                          src={offer.backgroundImage}
                          width={165}
                          height={220}
                        />
                        <Image
                          className="absolute w-[165px] h-[57px] top-[163px] left-0 object-cover"
                          alt="Rectangle"
                          src={offer.bottomImage}
                          width={165}
                          height={57}
                        />
                        <div className="absolute top-[172px] left-[18px] [font-family:'Poppins',Helvetica] font-semibold text-white text-base text-center tracking-[0] leading-5">
                          {offer.name}
                        </div>
                        <div className="absolute w-[61px] h-6 top-[130px] left-[51px]">
                          <div className="absolute top-0 left-0 [font-family:'Poppins',Helvetica] font-semibold text-white text-base tracking-[0] leading-[normal]">
                            BitLabs
                          </div>
                        </div>
                        <Image
                          className="absolute w-[125px] h-[153px] top-[1px] left-[20px]"
                          alt="Image"
                          src={offer.image}
                          width={125}
                          height={153}
                        />
                        <div className="absolute w-[122px] h-[29px] top-[127px] left-[10px] rounded-[10px] overflow-hidden bg-[linear-gradient(180deg,rgba(158,173,247,1)_0%,rgba(113,106,231,1)_100%)]">
                          <div className="absolute top-1 left-2 [font-family:'Poppins',Helvetica] font-medium text-white text-[13px] tracking-[0] leading-[normal]">
                            Earn upto 100
                          </div>
                          <Image
                            className="w-[15px] h-[15px] top-[7px] left-[99px] absolute"
                            alt="Image"
                            src={offer.coinIcon}
                            width={15}
                            height={15}
                          />
                        </div>
                      </div>
                    );
                  } else {
                    const leftPosition =
                      index === 0 ? "left-0" : "left-[170px]";
                    const topPosition = index === 0 ? "top-px" : "top-0";
                    const imageLeft =
                      index === 0 ? "left-[3px]" : "left-[60px]";
                    const imageTop = index === 0 ? "top-px" : "top-0";
                    const textLeft =
                      index === 0 ? "left-[11px]" : "left-[11px]";
                    const textTop = index === 0 ? "top-[111px]" : "top-28";
                    const earnLeft = index === 0 ? "left-2.5" : "left-11";
                    const earnTop = index === 0 ? "top-[72px]" : "top-[73px]";
                    const coinLeft =
                      index === 0 ? "left-[78px]" : "left-[78px]";

                    return (
                      <div
                        key={offer.id}
                        className={`absolute w-[165px] h-40 ${topPosition} ${leftPosition}`}
                      >
                        <Image
                          className="absolute w-[132px] h-40 top-0 left-0 object-cover"
                          alt="Rectangle"
                          src={offer.backgroundImage}
                          width={132}
                          height={160}
                        />
                        <Image
                          className="absolute w-[165px] h-[57px] top-[103px] left-0 object-cover"
                          alt="Rectangle"
                          src={offer.bottomImage}
                          width={165}
                          height={57}
                        />
                        <div
                          className={`absolute ${textTop} ${textLeft} [font-family:'Poppins',Helvetica] font-semibold text-white text-base text-center tracking-[0] leading-5`}
                        >
                          {offer.name}
                        </div>
                        <Image
                          className={`absolute w-[103px] h-[102px] ${imageTop} ${imageLeft}`}
                          alt="Image"
                          src={offer.image}
                          width={103}
                          height={102}
                        />
                        <div
                          className={`absolute w-24 h-[23px] ${earnTop} ${earnLeft} rounded overflow-hidden bg-[linear-gradient(180deg,rgba(158,173,247,1)_0%,rgba(113,106,231,1)_100%)]`}
                        >
                          <div className="absolute top-[3px] left-1.5 [font-family:'Poppins',Helvetica] font-medium text-white text-[10.2px] tracking-[0] leading-[normal]">
                            Earn upto 100
                          </div>
                          <Image
                            className={`w-[11px] h-3 top-1.5 ${coinLeft} absolute`}
                            alt="Image"
                            src={offer.coinIcon}
                            width={11}
                            height={12}
                          />
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};