import React from "react";

const Homepage = () => {
  return (
    <div className="relative w-full max-w-[375px] mx-auto h-[2528px] bg-black overflow-hidden" data-model-id="972:9945">
      <MainContentSection />
      <div className="absolute w-[375px] h-[49px] top-0 left-0">
        {/* <div className="absolute w-[375px] h-11 top-0 left-0 bg-[url(https://c.animaapp.com/xCaMzUYh/img/iphone-x--11-pro---black.svg)] bg-[100%_100%]" /> */}
        <div className="absolute top-[37px] left-5 [font-family:'Poppins',Helvetica] font-normal text-neutral-400 text-[10px] tracking-[0] leading-3 whitespace-nowrap">
          App Version: V0.0.1
        </div>
      </div>
      <HeaderSection />
      <NavigationSection />
    </div>
  );
};

const HeaderSection = () => {
  return (
    <header className="inline-flex items-center gap-12 absolute top-[66px] left-5 bg-transparent">
      <div className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
        <img
          className="relative w-12 h-12"
          alt="Group"
          src="https://c.animaapp.com/xCaMzUYh/img/group-4-1@2x.png"
        />
        <div className="flex flex-col w-[140px] items-start gap-1 relative">
          <div className="relative self-stretch h-4 [font-family:'Poppins',Helvetica] font-normal text-[#ffffff99] text-sm tracking-[-0.17px] leading-[18px] whitespace-nowrap">
            Welcome Back
          </div>
        </div>
      </div>
      <div className="flex w-[87px] h-9 items-center gap-[169px] relative">
        <div className="relative w-[87px] h-[39px] mt-[-1.50px] mb-[-1.50px]">
          <div className="relative h-9 top-px rounded-3xl bg-[linear-gradient(180deg,rgba(158,173,247,0.4)_0%,rgba(113,106,231,0.4)_100%)]">
            <div className="top-1 left-2.5 text-white text-lg tracking-[0] absolute [font-family:'Poppins',Helvetica] font-semibold leading-[normal]">
              1200
            </div>
            <img
              className="w-[23px] h-6 top-[5px] left-[54px] absolute aspect-[0.97]"
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
  const mostPlayedGames = [
    {
      id: 1,
      name: "Gates of Olympus",
      image: "https://c.animaapp.com/xCaMzUYh/img/image-3928@2x.png",
      bgImage: "https://c.animaapp.com/xCaMzUYh/img/oval-1@2x.png",
      borderImage: "https://c.animaapp.com/xCaMzUYh/img/oval.svg",
      isNew: false,
    },
    {
      id: 2,
      name: "Sugar Rush",
      image: "https://c.animaapp.com/xCaMzUYh/img/image-217@2x.png",
      bgGradient: "linear-gradient(180deg,rgba(141,173,248,1)_0%,rgba(240,136,249,1)_100%)",
      borderImage: "https://c.animaapp.com/xCaMzUYh/img/oval-2.svg",
      isNew: false,
    },
    {
      id: 3,
      name: "Fortnite",
      image: "https://c.animaapp.com/xCaMzUYh/img/image@2x.png",
      bgImage: "https://c.animaapp.com/xCaMzUYh/img/oval-4@2x.png",
      borderImage: "https://c.animaapp.com/xCaMzUYh/img/oval-3.svg",
      isNew: true,
    },
    {
      id: 4,
      name: "Sweet Bonanza",
      image: "https://c.animaapp.com/xCaMzUYh/img/image-3926@2x.png",
      bgImage: "https://c.animaapp.com/xCaMzUYh/img/oval-6@2x.png",
      borderImage: "https://c.animaapp.com/xCaMzUYh/img/oval-5.svg",
      isNew: false,
    },
    {
      id: 5,
      name: "CS:Go Rall",
      image: "https://c.animaapp.com/xCaMzUYh/img/layer-30@2x.png",
      borderImage: "https://c.animaapp.com/xCaMzUYh/img/oval-7.svg",
      isNew: false,
    },
    {
      id: 6,
      name: "Le Bandit",
      image: "https://c.animaapp.com/xCaMzUYh/img/image-218@2x.png",
      bgGradient: "linear-gradient(180deg,rgba(43,113,59,1)_0%,rgba(250,212,39,1)_100%)",
      borderImage: "https://c.animaapp.com/xCaMzUYh/img/oval-8.svg",
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

  return (
    <div className="flex flex-col w-[375px] h-[2232px] items-center gap-8 absolute top-36 left-0">
      <div className="relative w-[335px] h-[135px] shadow-[2.48px_2.48px_18.58px_#3b3b3b80,-1.24px_-1.24px_16.1px_#825700]">
        <div className="relative w-[337px] h-[135px]">
          <div className="absolute w-[337px] h-[135px] top-0 left-0">
            <div className="relative w-[335px] h-[135px] bg-[url(https://c.animaapp.com/xCaMzUYh/img/group-289468@2x.png)] bg-[100%_100%]">
              <div className="absolute w-[302px] h-[37px] top-[73px] left-[17px]">
                <div className="absolute w-[302px] h-[37px] top-0 left-0">
                  <div className="w-[304px] h-[37px]">
                    <div className="relative w-[302px] h-[37px] bg-[url(https://c.animaapp.com/xCaMzUYh/img/group-289352@2x.png)] bg-[100%_100%]">
                      <img
                        className="absolute w-[29px] h-[30px] top-1 left-[3px]"
                        alt="Ellipse"
                        src="https://c.animaapp.com/xCaMzUYh/img/ellipse-35.svg"
                      />
                      <div className="w-2 top-2 left-3 text-[#815c23] text-[14.9px] tracking-[0.02px] absolute [font-family:'Poppins',Helvetica] font-semibold leading-[normal]">
                        2
                      </div>
                    </div>
                  </div>
                </div>
                <p className="absolute w-[86px] top-2.5 left-[101px] opacity-80 [font-family:'Poppins',Helvetica] font-semibold text-transparent text-[14.9px] tracking-[0.02px] leading-[normal]">
                  <span className="text-[#685512] tracking-[0]">5200</span>
                  <span className="text-[#8d741b80] tracking-[0]">/6000</span>
                </p>
              </div>
              <div className="absolute w-[299px] h-[42px] top-[19px] left-5">
                <div className="relative w-[301px] h-[42px]">
                  <div className="absolute w-[301px] h-[21px] top-0 left-0">
                    <p className="absolute w-[299px] top-0 left-0 [font-family:'Poppins',Helvetica] font-semibold text-white text-xl tracking-[-0.37px] leading-[27.2px] whitespace-nowrap">
                      Hurry! Earn 500 more & Claim
                    </p>
                  </div>
                  <p className="absolute w-[235px] top-[27px] left-0 [font-family:'Poppins',Helvetica] font-semibold text-[#ffffff99] text-sm tracking-[0.02px] leading-[normal] whitespace-nowrap">
                    500 Points until your next reward
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute w-8 h-[30px] top-[77px] left-72 opacity-50">
            <div className="relative w-[30px] h-[30px]">
              <div className="absolute w-[30px] h-[30px] top-0 left-0">
                <div className="h-[30px] bg-[url(https://c.animaapp.com/xCaMzUYh/img/ellipse-35-1.svg)] bg-[100%_100%]">
                  <div className="relative w-[15px] h-3.5 top-2 left-2 overflow-hidden">
                    <img
                      className="absolute w-[15px] h-3.5 top-[-380px] left-[11330px]"
                      alt="Vector"
                      src="/img/vector.png"
                    />
                  </div>
                </div>
              </div>
              <div className="w-[9px] top-1 left-2.5 text-[#815c23] text-[14.9px] tracking-[0.02px] absolute [font-family:'Poppins',Helvetica] font-semibold leading-[normal]">
                3
              </div>
            </div>
          </div>
          <img
            className="absolute w-3 h-[11px] top-[85px] left-[99px]"
            alt="Vector"
            src="https://c.animaapp.com/xCaMzUYh/img/vector.svg"
          />
        </div>
      </div>
      <div className="relative w-[335px] h-[169px] bg-black rounded-[10px] border border-solid border-neutral-700">
        <img
          className="absolute w-[304px] h-6 top-[84px] left-3.5"
          alt="Progress bar"
          src="https://c.animaapp.com/xCaMzUYh/img/progress-bar.svg"
        />
        <p className="w-[210px] h-6 top-4 left-[62px] font-semibold text-white text-base leading-6 absolute [font-family:'Poppins',Helvetica] tracking-[0]">
          You're off to a great start!
        </p>
        <img
          className="absolute w-10 h-8 top-[15px] left-4"
          alt="Pic"
          src="https://c.animaapp.com/xCaMzUYh/img/pic.svg"
        />
        <div className="absolute w-[153px] h-[21px] top-[113px] left-[18px]">
          <div className="h-[21px] -top-px left-[65px] font-medium text-[#dddddd] text-sm text-right leading-[normal] absolute [font-family:'Poppins',Helvetica] tracking-[0]">
            out of 10,000
          </div>
          <div className="h-[21px] -top-px left-0 font-medium text-[#d2d2d2] text-sm leading-[normal] absolute [font-family:'Poppins',Helvetica] tracking-[0]">
            2,592
          </div>
          <img
            className="absolute w-5 h-[18px] top-[3px] left-[41px]"
            alt="Pic"
            src="https://c.animaapp.com/xCaMzUYh/img/pic-1.svg"
          />
        </div>
        <div className="absolute w-[303px] h-[15px] top-[63px] left-4">
          <div className="h-3.5 -top-px left-0 font-normal text-white text-sm leading-[14px] whitespace-nowrap absolute [font-family:'Poppins',Helvetica] tracking-[0]">
            Junior
          </div>
          <div className="h-3.5 -top-px left-[114px] font-normal text-white text-sm leading-[14px] whitespace-nowrap absolute [font-family:'Poppins',Helvetica] tracking-[0]">
            Mid-level
          </div>
          <div className="h-3.5 -top-px left-[259px] font-normal text-white text-sm leading-[14px] whitespace-nowrap absolute [font-family:'Poppins',Helvetica] tracking-[0]">
            Senior
          </div>
        </div>
        <img
          className="absolute w-5 h-5 top-36 left-[157px]"
          alt="Arrow"
          src="https://c.animaapp.com/xCaMzUYh/img/arrow.svg"
        />
      </div>
      <div className="flex flex-col items-start gap-2.5 pl-5 pr-0 py-0 relative self-stretch w-full flex-[0_0_auto]">
        <div className="flex w-[335px] items-center justify-between relative flex-[0_0_auto]">
          <div className="relative w-fit mt-[-1.00px] [font-family:'Poppins',Helvetica] font-semibold text-white-f4f3fc text-base tracking-[0] leading-[normal]">
            Most Played
          </div>
          <div className="relative w-fit mt-[-1.00px] [font-family:'Poppins',Helvetica] font-medium text-[#8b92de] text-base tracking-[0] leading-[normal]">
            See All
          </div>
        </div>
        <div className="flex h-[110px] items-start gap-3 relative self-stretch w-full overflow-x-scroll">
          {mostPlayedGames.map((game) => (
            <div
              key={game.id}
              className="items-start inline-flex flex-col gap-1.5 relative flex-[0_0_auto]"
            >
              <div
                className={`relative w-[72px] h-[72px] bg-[url(${game.borderImage})] bg-[100%_100%]`}
              >
                <div
                  className={`relative w-16 h-16 top-1 left-1 ${game.bgGradient ? `bg-[${game.bgGradient}]` : game.bgImage ? `bg-[url(${game.bgImage})] bg-cover bg-[50%_50%]` : "bg-[#00000033]"} ${!game.bgGradient && !game.bgImage ? "rounded-[32px]" : game.bgGradient ? "rounded-[32px]" : ""}`}
                >
                  <img
                    className={`absolute ${game.id === 1 ? "w-16 h-[61px] top-[3px] left-0 aspect-[1.05]" : game.id === 2 ? "w-11 h-[49px] top-[7px] left-2.5 aspect-[0.89] object-cover" : game.id === 3 ? "w-[67px] h-[58px] top-1.5 left-0" : game.id === 4 ? "w-16 h-[49px] top-[15px] left-0 aspect-[1.3] object-cover" : game.id === 5 ? "w-[68px] h-[42px] top-[11px] left-0" : "w-12 h-[54px] top-1.5 left-3 aspect-[0.88]"}`}
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
      <div className="inline-flex flex-col items-start gap-2.5 relative flex-[0_0_auto]">
        <div className="flex w-[335px] items-center justify-between relative flex-[0_0_auto]">
          <p className="relative w-fit mt-[-1.00px] [font-family:'Poppins',Helvetica] font-semibold text-white-f4f3fc text-xl tracking-[0] leading-[normal]">
            💸 💸 Fast Fun, Real Rewards!💸 💸
          </p>
          <div className="relative w-fit ml-[-53px] [font-family:'Poppins',Helvetica] font-medium text-transparent text-base tracking-[0] leading-[normal]">
            See All
          </div>
        </div>
        <div className="relative w-[335px] h-[557px] rounded-[14px] overflow-hidden shadow-[0px_14px_20px_#746ee85c] bg-[linear-gradient(180deg,rgba(94,152,219,1)_0%,rgba(113,106,231,1)_100%)]">
          <div className="absolute w-[372px] h-[155px] top-[-23px] -left-9">
            <div className="absolute w-[372px] h-[155px] top-0 left-0">
              <div className="absolute w-[161px] h-[145px] top-0 left-0 rounded-[80.5px/72.5px] bg-[linear-gradient(180deg,rgba(27,204,231,1)_0%,rgba(154,207,251,0.01)_100%)]" />
              <div className="absolute w-[337px] h-8 top-[22px] left-[34px] border border-solid border-[#ffffff80] bg-[linear-gradient(331deg,rgba(100,51,170,1)_0%,rgba(0,150,237,1)_100%)]">
                <div className="absolute top-[7px] left-3.5 [font-family:'Poppins',Helvetica] font-bold text-white text-sm tracking-[0] leading-4 whitespace-nowrap">
                  Welcome Offer
                </div>
                <div className="absolute w-[98px] h-[23px] top-[5px] left-[233px] bg-[#2f3ba0] rounded-lg">
                  <div className="relative w-[89px] h-[21px] top-px left-[3px]">
                    <div className="absolute top-1.5 left-[25px] [text-shadow:0px_0.66px_0px_#000000] [-webkit-text-stroke:0.4px_#000000] [font-family:'Lilita_One',Helvetica] font-normal text-white text-sm tracking-[-0.07px] leading-[8.3px] whitespace-nowrap">
                      23h:20min
                    </div>
                    <img
                      className="absolute w-[29px] h-[21px] top-0 left-0 aspect-[1.33] object-cover"
                      alt="Image"
                      src="https://c.animaapp.com/xCaMzUYh/img/image-3993@2x.png"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-[174px] items-start absolute top-[66px] left-[54px]">
                <div className="relative self-stretch mt-[-1.00px] font-medium text-white text-xl leading-7 [font-family:'Poppins',Helvetica] tracking-[0]">
                  Choose 3 games
                </div>
                <div className="relative self-stretch w-full h-[27px]">
                  <div className="absolute w-[77px] -top-px left-12 font-normal text-white text-base leading-7 whitespace-nowrap [font-family:'Poppins',Helvetica] tracking-[0]">
                    & play for
                  </div>
                  <img
                    className="absolute w-[42px] h-px top-3.5 left-0"
                    alt="Line"
                    src="https://c.animaapp.com/xCaMzUYh/img/line-7.svg"
                  />
                  <img
                    className="absolute w-[42px] h-px top-3.5 left-[132px]"
                    alt="Line"
                    src="https://c.animaapp.com/xCaMzUYh/img/line-7.svg"
                  />
                </div>
                <div className="relative self-stretch h-[34px] font-bold text-[#ffe664] text-xl leading-9 whitespace-nowrap [font-family:'Poppins',Helvetica] tracking-[0]">
                  just 5 mins each
                </div>
              </div>
            </div>
            <div className="absolute w-[106px] h-10 top-[88px] left-[246px] rounded-[4.62px] overflow-hidden bg-[linear-gradient(331deg,rgba(237,131,0,1)_0%,rgba(253,214,91,1)_100%)]">
              <div className="relative h-10 bg-[url(https://c.animaapp.com/xCaMzUYh/img/clip-path-group@2x.png)] bg-[100%_100%]">
                <div className="absolute top-[9px] left-[13px] font-medium text-white text-lg leading-5 whitespace-nowrap [font-family:'Poppins',Helvetica] tracking-[0]">
                  Earn $20
                </div>
              </div>
            </div>
          </div>
          <div className="absolute w-[335px] h-[412px] top-[151px] left-0">
            <div className="absolute w-[254px] h-[62px] top-[317px] left-10">
              <img
                className="absolute w-[62px] h-[62px] top-0 left-48"
                alt="Group"
                src="https://c.animaapp.com/xCaMzUYh/img/group-3@2x.png"
              />
              <img
                className="absolute w-[62px] h-[62px] top-0 left-0"
                alt="Group"
                src="https://c.animaapp.com/xCaMzUYh/img/group-2@2x.png"
              />
              <img
                className="absolute w-[62px] h-[62px] top-0 left-24"
                alt="Group"
                src="https://c.animaapp.com/xCaMzUYh/img/group-4@2x.png"
              />
            </div>
            <div className="absolute w-[304px] h-[304px] top-[-7px] left-[15px] rounded-[10.89px]">
              <img
                className="absolute w-52 h-[244px] top-[58px] left-[58px]"
                alt="Frame"
                src="https://c.animaapp.com/xCaMzUYh/img/frame-2.svg"
              />
              <div className="absolute w-[168px] h-[204px] top-[50px] left-[68px] rounded-[14px] overflow-hidden shadow-[0px_14px_20px_#1089c357] bg-[linear-gradient(180deg,rgba(28,211,235,1)_0%,rgba(7,82,165,1)_100%)]">
                <div className="relative w-[118px] h-[203px] top-px left-[26px]">
                  <img
                    className="absolute w-[118px] h-[107px] top-24 left-0 aspect-[1] object-cover"
                    alt="Image"
                    src="https://c.animaapp.com/xCaMzUYh/img/image-4025@2x.png"
                  />
                  <img
                    className="absolute w-[101px] h-[101px] top-0 left-2 aspect-[1] object-cover"
                    alt="Image"
                    src="https://c.animaapp.com/xCaMzUYh/img/image-220@2x.png"
                  />
                </div>
              </div>
              <img
                className="absolute w-52 h-[244px] top-[58px] left-[58px]"
                alt="Frame"
                src="https://c.animaapp.com/xCaMzUYh/img/frame-3.svg"
              />
              <div className="absolute w-[304px] h-[304px] top-0 left-0 rounded-[10.89px] overflow-hidden shadow-[0px_9.98px_36.19px_#4d0d3399] bg-[linear-gradient(180deg,rgba(95,14,58,1)_0%,rgba(16,8,25,1)_100%)]">
                <div className="relative w-[274px] h-[289px] top-[15px] left-4">
                  <img
                    className="absolute w-[272px] h-[263px] top-[26px] left-0 aspect-[1]"
                    alt="Image"
                    src="https://c.animaapp.com/xCaMzUYh/img/image-3930@2x.png"
                  />
                  <img
                    className="absolute w-[191px] h-[37px] top-4 left-10 aspect-[5.2]"
                    alt="Image"
                    src="https://c.animaapp.com/xCaMzUYh/img/image-3931@2x.png"
                  />
                  <div className="absolute w-[99px] h-[54px] top-[7px] left-0.5 rounded-[10.89px] overflow-hidden border-[3.63px] border-solid border-[#ff4e3f] opacity-0">
                    <div className="absolute top-[5px] left-[15px] [font-family:'Poppins',Helvetica] font-semibold text-[#ff4e3f] text-[25.4px] tracking-[0] leading-[normal]">
                      NOPE
                    </div>
                  </div>
                  <div className="absolute w-[93px] h-[54px] top-[7px] left-[177px] rounded-[10.89px] overflow-hidden border-[3.63px] border-solid border-[#8b92de] opacity-0">
                    <div className="absolute top-[5px] left-[15px] [font-family:'Poppins',Helvetica] font-semibold text-[#8b92de] text-[25.4px] tracking-[0] leading-[normal]">
                      PLAY
                    </div>
                  </div>
                  <div className="absolute w-[67px] h-[23px] top-0 left-[207px]">
                    <div className="relative w-[65px] h-[23px] bg-[#ffffff4f] rounded-[4.83px] backdrop-blur-[2.41px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(2.41px)_brightness(100%)]">
                      <img
                        className="absolute w-3 h-[9px] top-[7px] left-[7px]"
                        alt="Vector"
                        src="https://c.animaapp.com/xCaMzUYh/img/vector-1.svg"
                      />
                      <div className="absolute top-[3px] left-[23px] [font-family:'Poppins',Helvetica] font-bold text-white text-[11.8px] tracking-[0] leading-[normal]">
                        10.4 K
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-[335px] items-start gap-2.5 relative flex-[0_0_auto]">
        <div className="relative w-[166px] h-6">
          <div className="absolute top-0 left-0 [font-family:'Poppins',Helvetica] font-semibold text-white text-base tracking-[0] leading-[normal]">
            Non- Gaming Offers
          </div>
        </div>
        <div className="relative w-[335px] h-[220px]">
          <div className="w-[337px] h-[220px]">
            <div className="relative w-[339px] h-[220px]">
              <div className="absolute w-[339px] h-[161px] top-[22px] left-0">
                {nonGamingOffers.slice(0, 2).map((offer, index) => (
                  <div
                    key={offer.id}
                    className={`absolute w-[165px] ${index === 0 ? "h-40 top-px left-0" : "h-[161px] top-0 left-[170px]"}`}
                  >
                    <img
                      className={`${index === 0 ? "w-[132px] h-40 top-0 left-0" : "w-[132px] h-40 top-px left-[33px]"} absolute object-cover`}
                      alt="Rectangle"
                      src={offer.bgImage}
                    />
                    <img
                      className={`w-[165px] h-[57px] ${index === 0 ? "top-[103px] left-0" : "top-[104px] left-0"} absolute object-cover`}
                      alt="Rectangle"
                      src={offer.bottomBg}
                    />
                    <div
                      className={`absolute ${index === 0 ? "top-[111px] left-[11px]" : "top-28 left-[11px]"} [font-family:'Poppins',Helvetica] font-semibold text-white text-base text-center tracking-[0] leading-5`}
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
                      className={`absolute ${index === 0 ? "w-[103px] h-[102px] top-px left-[3px] aspect-[1.01]" : "w-[105px] h-[104px] top-0 left-[60px] aspect-[1.01]"}`}
                      alt="Image"
                      src={offer.image}
                    />
                    <div
                      className={`w-24 h-[23px] ${index === 0 ? "top-[72px] left-2.5" : "top-[73px] left-11"} rounded absolute overflow-hidden bg-[linear-gradient(180deg,rgba(158,173,247,1)_0%,rgba(113,106,231,1)_100%)]`}
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
                className="h-[220px] absolute w-[165px] top-0 left-[79px] object-cover"
                alt="Rectangle"
                src="https://c.animaapp.com/xCaMzUYh/img/rectangle-73-1@2x.png"
              />
              <img
                className="absolute w-[165px] h-[57px] top-[163px] left-[79px] object-cover"
                alt="Rectangle"
                src="https://c.animaapp.com/xCaMzUYh/img/rectangle-74-1@2x.png"
              />
              <div className="absolute top-[172px] left-[97px] [font-family:'Poppins',Helvetica] font-semibold text-white text-base text-center tracking-[0] leading-5">
                Chime- Mobile
                <br />
                Banking
              </div>
              <div className="absolute w-[61px] h-6 top-[130px] left-[130px]">
                <div className="absolute top-0 left-0 [font-family:'Poppins',Helvetica] font-semibold text-white text-base tracking-[0] leading-[normal]">
                  BitLabs
                </div>
              </div>
              <img
                className="absolute w-[125px] h-[153px] top-px left-[99px] aspect-[0.81]"
                alt="Image"
                src="https://c.animaapp.com/xCaMzUYh/img/image-3980@2x.png"
              />
              <div className="w-[122px] h-[29px] top-[127px] left-[89px] rounded-[10px] absolute overflow-hidden bg-[linear-gradient(180deg,rgba(158,173,247,1)_0%,rgba(113,106,231,1)_100%)]">
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
      <div className="flex flex-col w-[335px] h-[127px] items-start gap-2.5 relative">
        <img
          className="h-[127px] relative w-[334px]"
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
      <div className="flex flex-col w-[335px] items-start gap-2.5 relative flex-[0_0_auto]">
        <div className="h-36 rounded-[20px] overflow-hidden bg-[linear-gradient(51deg,rgba(88,41,171,1)_0%,rgba(59,41,171,1)_100%)] overflow-x-scroll relative w-[334px]">
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
      <div className="flex flex-col w-[335px] items-start gap-2.5 relative flex-[0_0_auto]">
        <div className="relative w-[184px] h-6">
          <p className="absolute top-0 left-0 [font-family:'Poppins',Helvetica] font-semibold text-white text-base tracking-[0] leading-[normal]">
            Get Paid to do Surveys
          </p>
        </div>
        <div className="relative w-[335px] h-[190px]">
          <div className="w-[335px] h-[190px]">
            <div className="relative w-[339px] h-[190px]">
              <div className="absolute w-[339px] h-40 top-[11px] left-0">
                {surveyProviders
                  .filter((_, index) => index !== 1)
                  .map((provider, index) => (
                    <div
                      key={provider.id}
                      className={`absolute w-[132px] h-40 top-0 ${index === 0 ? "left-0" : "left-[203px]"} bg-[url(${provider.bgImage})] bg-cover bg-[50%_50%]`}
                    >
                      <div
                        className={`absolute ${index === 0 ? "top-[97px] left-[21px]" : "top-[90px] left-[37px]"} [font-family:'Poppins',Helvetica] font-semibold text-white text-base text-center tracking-[0] leading-5`}
                      >
                        {provider.name.split(" ").map((word, i) => (
                          <span key={i}>
                            {word}
                            {i === 0 && <br />}
                            {i > 0 && i < provider.name.split(" ").length - 1 && " "}
                          </span>
                        ))}
                      </div>
                      <img
                        className={`absolute ${index === 0 ? "w-[65px] h-[65px] top-6 left-[18px] aspect-[1]" : "w-[70px] h-[51px] top-[31px] left-[41px] aspect-[1.37]"}`}
                        alt="Image"
                        src={provider.image}
                      />
                    </div>
                  ))}
              </div>
              <img
                className="h-[190px] absolute w-[165px] top-0 left-[79px] object-cover"
                alt="Rectangle"
                src="https://c.animaapp.com/xCaMzUYh/img/rectangle-73-3@2x.png"
              />
              <div className="absolute w-[61px] h-6 top-[123px] left-[130px]">
                <div className="absolute top-0 left-0 [font-family:'Poppins',Helvetica] font-semibold text-white text-base tracking-[0] leading-[normal]">
                  BitLabs
                </div>
              </div>
              <img
                className="absolute w-20 h-[78px] top-[39px] left-[119px] aspect-[1.03]"
                alt="Image"
                src="https://c.animaapp.com/xCaMzUYh/img/image-3974@2x.png"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-[335px] items-start gap-2.5 relative flex-[0_0_auto]">
        <div className="h-[111px] rounded-[20px] overflow-hidden bg-[linear-gradient(64deg,rgba(41,138,171,1)_0%,rgba(41,171,162,1)_100%)] overflow-x-scroll relative w-[334px]">
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

const NavigationSection = () => {
  const navigationItems = [
    {
      id: "home",
      icon: "https://c.animaapp.com/xCaMzUYh/img/home.svg",
      label: "Home",
      isActive: true,
    },
    {
      id: "games",
      icon: "https://c.animaapp.com/xCaMzUYh/img/games.svg",
      label: "My Games",
      isActive: false,
      iconWidth: "w-[35px]",
      iconHeight: "h-[16.28px]",
    },
    {
      id: "wallet",
      icon: "https://c.animaapp.com/xCaMzUYh/img/wallet@2x.png",
      label: "My Wallet",
      isActive: false,
      customIcon: true,
    },
    {
      id: "cash-coach",
      icon: "https://c.animaapp.com/xCaMzUYh/img/money.svg",
      label: "Cash Coach",
      isActive: false,
    },
  ];

  return (
    <nav className="fixed w-full max-w-[375px] h-[116px] top-[2418px] left-1/2 transform -translate-x-1/2" role="navigation" aria-label="Main navigation">
      <div className="absolute w-[375px] h-[37px] top-[79px] left-0 bg-black">
        <div className="relative w-[135px] h-[5px] top-[15px] left-[120px] bg-white rounded-[100px]" />
      </div>
      <div className="absolute w-[375px] h-20 -top-px left-0">
        <div className="relative h-[113px] -top-5">
          <img
            className="absolute w-[375px] h-[103px] top-2.5 left-0"
            alt=""
            src="https://c.animaapp.com/xCaMzUYh/img/botton-nav@2x.png"
            role="presentation"
          />
          <button
            className="flex flex-col w-[60px] items-center gap-2 absolute top-[39px] left-4 cursor-pointer"
            aria-label="Home"
            aria-current={navigationItems[0].isActive ? "page" : undefined}
          >
            <img
              className="relative w-6 h-6"
              alt=""
              src={navigationItems[0].icon}
              role="presentation"
            />
            <span className="relative w-fit [font-family:'Poppins',Helvetica] font-normal text-[#ffffffb2] text-[10px] tracking-[-0.17px] leading-[normal]">
              {navigationItems[0].label}
            </span>
            {navigationItems[0].isActive && (
              <div
                className="absolute w-1 h-1 top-[51px] left-7 bg-[#8b92de] rounded-sm"
                aria-hidden="true"
              />
            )}
          </button>
          <button
            className="flex flex-col w-[60px] items-center gap-3 absolute top-[43px] left-[87px] cursor-pointer"
            aria-label="My Games"
          >
            <img
              className="relative w-[35px] h-[16.28px]"
              alt=""
              src={navigationItems[1].icon}
              role="presentation"
            />
            <span className="relative self-stretch [font-family:'Poppins',Helvetica] font-normal text-[#ffffffb2] text-[10px] text-center tracking-[-0.17px] leading-[normal]">
              {navigationItems[1].label}
            </span>
          </button>
          <button
            className="absolute w-[62px] h-[62px] top-0 left-40 cursor-pointer"
            aria-label="Center action button"
          >
            <img
              className="w-full h-full"
              alt=""
              src="https://c.animaapp.com/xCaMzUYh/img/my-games.svg"
              role="presentation"
            />
          </button>
          <button
            className="flex flex-col w-[60px] items-center gap-2 absolute top-[39px] left-[229px] cursor-pointer"
            aria-label="My Wallet"
          >
            <div className="relative w-6 h-6">
              <img
                className="absolute w-5 h-[18px] top-[3px] left-0.5"
                alt=""
                src={navigationItems[2].icon}
                role="presentation"
              />
            </div>
            <span className="relative w-fit [font-family:'Poppins',Helvetica] font-normal text-[#ffffffb2] text-[10px] text-center tracking-[-0.17px] leading-[normal]">
              {navigationItems[2].label}
            </span>
          </button>
          <button
            className="flex flex-col w-[60px] items-center gap-2 absolute top-[39px] left-[300px] cursor-pointer"
            aria-label="Cash Coach"
          >
            <img
              className="relative w-6 h-6"
              alt=""
              src={navigationItems[3].icon}
              role="presentation"
            />
            <span className="relative w-fit ml-[-0.50px] mr-[-0.50px] [font-family:'Poppins',Helvetica] font-normal text-[#ffffffb2] text-[10px] text-center tracking-[-0.17px] leading-[13px] whitespace-nowrap">
              {navigationItems[3].label}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Homepage;