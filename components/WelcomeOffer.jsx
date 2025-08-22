import React from "react";

export const WelcomeOffer = () => {
  const offerData = {
    title: "Play 3 Games for",
    duration: "5 mins",
    reward: "Earn $20",
    questEndTime: "22h:30 mins",
    welcomeOfferText: "Welcome Offer",
  };

  return (
    <div
      className="flex flex-col w-full h-[245px] items-center gap-4 relative"
      data-model-id="1162:38776"
      role="banner"
      aria-label="Welcome offer promotion"
    >
      <div className="flex flex-col w-full h-[200px] items-center gap-2.5 relative">
        <div className="relative w-[335px] h-[245px] mb-[-45.00px] rounded-[20px] overflow-hidden bg-[linear-gradient(103deg,rgba(121,32,207,1)_0%,rgba(205,73,153,1)_80%)]">
          <div className="relative w-[362px] h-[245px]">
            <div className="absolute w-[334px] h-[200px] top-0 left-0">
              <div className="relative w-[333px] h-[218px] top-[-3px] left-5">
                <h1 className="top-[59px] left-0 font-bold text-[#ffe664] text-[44px] leading-[48px] absolute [font-family:'Poppins',Helvetica] tracking-[0] whitespace-nowrap">
                  {offerData.duration}
                </h1>

                <p className="top-[33px] left-0 font-medium text-white text-xl leading-6 absolute [font-family:'Poppins',Helvetica] tracking-[0] whitespace-nowrap">
                  {offerData.title}
                </p>

                <img
                  className="absolute w-[238px] h-[194px] top-6 left-[95px] object-cover"
                  alt="Gaming controller in hands"
                  src="https://c.animaapp.com/cY1GlXnE/img/image@2x.png"
                />

                <button
                  className="absolute w-10 h-10 top-0 left-[274px] cursor-pointer"
                  aria-label="More information about this offer"
                  type="button"
                >
                  <img
                    className="w-full h-full"
                    alt=""
                    src="https://c.animaapp.com/cY1GlXnE/img/informationcircle.svg"
                  />
                </button>

                <div className="absolute w-[102px] h-[39px] top-[115px] left-0 rounded overflow-hidden bg-[linear-gradient(331deg,rgba(237,131,0,1)_0%,rgba(237,166,0,1)_100%)]">
                  <div className="relative h-[39px] bg-[url(https://c.animaapp.com/cY1GlXnE/img/clip-path-group@2x.png)] bg-[100%_100%]">
                    <span className="top-[7px] left-[7px] font-medium text-white text-xl leading-6 absolute [font-family:'Poppins',Helvetica] tracking-[0] whitespace-nowrap">
                      {offerData.reward}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-[73px] top-[172px] bg-[#982fbb] rounded-[0px_0px_20px_20px] absolute w-[334px] left-0" />

            <button
              className="inline-flex items-center gap-1 absolute top-[214px] left-[100px] cursor-pointer"
              type="button"
              aria-label="Check offer details"
            >
              <span className="relative w-fit mt-[-1.00px] font-medium [font-family:'Poppins',Helvetica] text-white text-base tracking-[0] leading-6 whitespace-nowrap">
                Check Details
              </span>

              <img
                className="relative w-5 h-5"
                alt=""
                src="https://c.animaapp.com/cY1GlXnE/img/arrow.svg"
              />
            </button>

            <div className="h-12 top-[161px] bg-[#80279e] absolute w-[334px] left-0" />

            <p className="absolute top-[172px] left-6 font-normal [font-family:'Poppins',Helvetica] text-white text-base tracking-[0] leading-6 whitespace-nowrap">
              Quest ends in:
            </p>

            <div className="absolute w-[81px] h-[81px] top-[135px] left-[280px] rounded-[40.47px] rotate-[-177.48deg] bg-[linear-gradient(149deg,rgba(185,1,231,1)_0%,rgba(89,245,255,1)_100%)]" />

            <div className="absolute w-[122px] h-[37px] top-[166px] left-36 rounded-[10px] overflow-hidden bg-[linear-gradient(107deg,rgba(200,117,251,1)_0%,rgba(16,4,147,1)_100%)]">
              <time className="absolute top-1.5 left-[15px] [font-family:'Poppins',Helvetica] font-medium text-white text-base tracking-[0] leading-[normal]">
                {offerData.questEndTime}
              </time>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute w-[104px] h-6 -top-px left-[115px] rounded-[0px_0px_4px_4px] overflow-hidden border border-solid border-[#ffffff33] bg-[linear-gradient(331deg,rgba(58,19,113,0.3)_0%,rgba(127,35,203,0.3)_100%)]">
        <span className="absolute top-[3px] left-1.5 [font-family:'Poppins',Helvetica] font-semibold text-[#ffbe6b] text-xs tracking-[0] leading-4 whitespace-nowrap">
          {offerData.welcomeOfferText}
        </span>
      </div>
    </div>
  );
};