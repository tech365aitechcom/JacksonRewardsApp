import React from "react";

export const Banner = () => {
    const decorativeStars = [
        { id: 1, top: "44px", left: "248px" },
        { id: 2, top: "125px", left: "12px" },
        { id: 3, top: "220px", left: "213px" },
        { id: 4, top: "54px", left: "16px" },
        { id: 5, top: "104px", left: "312px" },
        { id: 6, top: "33px", left: "79px" },
        { id: 7, top: "0px", left: "271px" },
        { id: 8, top: "29px", left: "13px" },
    ];

    const progressData = {
        currentPoints: 2592,
        maxPoints: 10000,
        currentLevel: "Junior",
        nextLevel: "Mid-level",
        achievementText: "You discovered Mid-level feature",
    };

    return (
        <div
            className="relative w-[335px] h-[486px] rounded-[20px] overflow-hidden border border-solid border-[#ffffff80] bg-[linear-gradient(0deg,rgba(0,0,0,1)_0%,rgba(0,0,0,1)_100%)]"
            data-model-id="2035:13685"
            role="dialog"
            aria-labelledby="banner-title"
            aria-describedby="banner-description"
        >
            {/* Close Button */}
            <button
                className="absolute w-[31px] h-[31px] top-6 left-[280px] cursor-pointer"
                aria-label="Close banner"
                type="button"
            >
                <img
                    alt=""
                    src="https://c.animaapp.com/b76V1iGo/img/close.svg"
                    className="w-full h-full"
                />
            </button>

            {/* Title Section */}
            <header className="absolute w-52 h-11 top-[141px] left-[68px]">
                <div className="flex flex-col w-[198px] items-center pt-0 pb-2 px-0 absolute top-0 left-0">
                    <h1
                        id="banner-title"
                        className="relative w-fit mt-[-1.50px] [text-shadow:0px_4px_8px_#1a002f40] [-webkit-text-stroke:0.5px_transparent]  [-webkit-background-clip:text] bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(245,245,245,1)_100%)] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Poppins',Helvetica] font-bold text-transparent text-[32px] tracking-[0] leading-8 whitespace-nowrap"
                    >
                        XP Points
                    </h1>
                </div>

                <img
                    className="absolute w-[19px] h-[19px] top-[25px] left-[189px]"
                    alt=""
                    src="https://c.animaapp.com/b76V1iGo/img/vector-8.svg"
                />
            </header>

            {/* Decorative Stars */}
            {decorativeStars.map((star, index) => (
                <img
                    key={star.id}
                    className={`absolute w-[19px] h-[19px]`}
                    style={{ top: star.top, left: star.left }}
                    alt=""
                    src={
                        index < 4
                            ? "https://c.animaapp.com/b76V1iGo/img/vector-2.svg"
                            : index < 6
                                ? "https://c.animaapp.com/b76V1iGo/img/vector-8.svg"
                                : index === 6
                                    ? "https://c.animaapp.com/b76V1iGo/img/vector-4.svg"
                                    : index === 7
                                        ? "https://c.animaapp.com/b76V1iGo/img/vector-5.svg"
                                        : "https://c.animaapp.com/b76V1iGo/img/vector-7.svg"
                    }
                />
            ))}

            {/* Description Section */}
            <section className="absolute w-[284px] h-[55px] top-[185px] left-[25px]">
                <p
                    id="banner-description"
                    className="absolute w-[284px] top-0.5 left-0 [font-family:'Poppins',Helvetica] font-light text-white text-sm text-center tracking-[0] leading-5"
                >
                    Compete against bots by completing tasks. Finish first to win extra XP & coins. Higher XP tiers unlock tougher races with bigger rewards.
                </p>
            </section>

            {/* Main XP Icon */}
            <img
                className="absolute w-[125px] h-[108px] top-[27px] left-[99px]"
                alt="XP Points icon"
                src="https://c.animaapp.com/b76V1iGo/img/pic.svg"
            />

            {/* Progress Section */}
            <section className="flex flex-col w-[294px] h-[99px] items-center justify-center gap-3 absolute top-[296px] left-5">
                <img
                    className="relative w-[50px] h-[54px] mt-[-40.00px] aspect-[0.94]"
                    alt="Achievement unlock icon"
                    src="https://c.animaapp.com/b76V1iGo/img/image-3966@2x.png"
                />

                <div className="flex items-center justify-center gap-2 pt-0 pb-3 px-0 relative self-stretch w-full flex-[0_0_auto] border-b [border-bottom-style:solid] border-[#383838]">
                    <div className="relative w-[237px] mt-[-1.00px] [font-family:'Poppins',Helvetica] font-semibold text-[#ffb568] text-sm tracking-[0] leading-5">
                        {progressData.achievementText}
                    </div>
                </div>

                <div className="relative w-[303px] h-[15px] ml-[-4.50px] mr-[-4.50px]">
                    <div className="absolute h-3.5 -top-px left-0 [font-family:'Poppins',Helvetica] font-normal text-white text-sm tracking-[0] leading-[14px] whitespace-nowrap">
                        {progressData.currentLevel}
                    </div>

                    <div className="absolute h-3.5 -top-px left-[234px] [font-family:'Poppins',Helvetica] font-normal text-white text-sm tracking-[0] leading-[14px] whitespace-nowrap">
                        {progressData.nextLevel}
                    </div>
                </div>

                <div
                    className="relative w-[304px] h-6 mb-[-24.00px] ml-[-7.00px] mr-[-3.00px]"
                    role="progressbar"
                    aria-valuenow={progressData.currentPoints}
                    aria-valuemin={0}
                    aria-valuemax={progressData.maxPoints}
                    aria-label={`Progress: ${progressData.currentPoints} out of ${progressData.maxPoints} XP points`}
                >
                    <img
                        alt=""
                        src="https://c.animaapp.com/b76V1iGo/img/progress-bar.svg"
                        className="w-full h-full"
                    />
                </div>

                <div className="flex items-center justify-center gap-1 relative w-full mb-[-50.00px]">
                    <div className="[font-family:'Poppins',Helvetica] font-medium text-[#d2d2d2] text-sm tracking-[0] leading-[normal]">
                        {progressData.currentPoints.toLocaleString()}
                    </div>

                    <img
                        className="w-5 h-[18px]"
                        alt=""
                        src="https://c.animaapp.com/b76V1iGo/img/pic-1.svg"
                    />

                    <div className="[font-family:'Poppins',Helvetica] font-medium text-[#dddddd] text-sm tracking-[0] leading-[normal]">
                        out of {progressData.maxPoints.toLocaleString()}
                    </div>
                </div>
            </section>
        </div>
    );
};
