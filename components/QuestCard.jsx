import React, { useState, useEffect, useRef } from "react";
import { useRealTimeCountdown } from "../hooks/useRealTimeCountdown";

export const QuestCard = ({ game }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const tooltipRef = useRef(null);

    // Use real-time countdown hook with game end time
    const {
        formatTime,
        isExpired,
        isLoading,
        timeRemaining
    } = useRealTimeCountdown({
        endTime: game?.quest_end_time,
        defaultDuration: 24 * 60 * 60, // 24 hours in seconds
        persist: false, // Don't persist quest timers
        autoReset: false
    });

    // Toggle tooltip
    const toggleTooltip = () => {
        setShowTooltip(!showTooltip);
    };

    // Toggle expanded state
    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    // Close tooltip when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
                setShowTooltip(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // OPTIMIZED: Transform game goals into quest items format with better text handling
    const displayGoals = game?.goals?.slice(0, 3) || [];

    const questItems = displayGoals.map((goal, index) => ({
        id: goal.goal_id || index + 1,
        number: (index + 1).toString(),
        // OPTIMIZED: Better text truncation and formatting for mobile
        title: (goal.text || goal.title || `Complete Goal ${index + 1}`).length > 50
            ? `${(goal.text || goal.title || `Complete Goal ${index + 1}`).substring(0, 47)}...`
            : (goal.text || goal.title || `Complete Goal ${index + 1}`),
        status: goal.completed ? "Completed" : "Pending",
        statusColor: goal.completed ? "#81e916" : "#ffffff",
        hasBorder: index < (displayGoals.length - 1),
        isLocked: !goal.completed && index > 0 && !displayGoals[index - 1]?.completed,
    }));

    // Determine if first three tasks are completed
    const completedCount = questItems.filter(q => q.status === "Completed").length;
    const showTimer = completedCount < 3 && !isExpired && !isLoading;

    return (
        <>
            <div
                className={`relative w-[334px] mx-auto bg-[#7920cf] rounded-[20px] overflow-hidden shadow-lg transition-all duration-300 ${isExpanded ? "h-[420px]" : "h-[180px]"}`}
                data-model-id="2630:14132"
            >
                <div className={`absolute top-[142px] left-px w-[334px] bg-[#982fbb] rounded-[0px_0px_20px_20px] transition-all duration-300 ${isExpanded ? "h-[290px]" : "h-0"}`} />

                <button
                    className="absolute w-8 h-8 top-[-4px] right-[-4px] z-20 cursor-pointer hover:opacity-80 transition-opacity duration-200 rounded-tr-lg rounded-bl-lg overflow-hidden flex items-center justify-center"
                    aria-label="More information"
                    onClick={toggleTooltip}
                >
                    <img
                        className="w-6 h-6"
                        alt="Information circle"
                        src="https://c.animaapp.com/FYtIEbRF/img/informationcircle.svg"
                        loading="eager"
                        decoding="async"
                        width={24}
                        height={24}
                    />
                </button>

                {showTimer && (
                    <>
                        <div className="absolute top-[102px] -left-px w-[334px] h-12 bg-[#80279e]" />

                        <div className={`absolute top-[106px] left-[172px] w-[100px] h-[37px] flex items-center justify-center rounded-[10px] text-[16px] font-medium overflow-hidden ${isExpired
                            ? 'bg-[linear-gradient(107deg,rgba(255,0,0,0.8)_0%,rgba(139,0,0,1)_100%)]'
                            : 'bg-[linear-gradient(107deg,rgba(200,117,251,1)_0%,rgba(16,4,147,1)_100%)]'
                            }`}>
                            <div className="[font-family:'Poppins',Helvetica] font-medium text-white text-sm tracking-[0]  text-[16px] leading-[normal] text-center">
                                {isLoading ? 'Loading...' : (isExpired ? 'EXPIRED' : formatTime)}
                            </div>
                        </div>

                        <div className="absolute top-[113px] left-[51px] [font-family:'Poppins',Helvetica] font-normal text-white text-[16px]  tracking-[0] leading-6 whitespace-nowrap">
                            Quest ends in:
                        </div>
                    </>
                )}

                {isExpired && (
                    <div className="absolute top-[102px] -left-px w-[334px] h-12 bg-[#8B0000] flex items-center justify-center">
                        <div className="[font-family:'Poppins',Helvetica] font-bold text-white text-sm tracking-[0] leading-[normal] text-center">
                            Quest Expired
                        </div>
                    </div>
                )}

                <div className="absolute top-5 left-5 right-5 flex items-center gap-3">
                    {/* Avatar */}
                    <div className="relative w-[74px] h-[74px] shrink-0 bg-[url(https://c.animaapp.com/FYtIEbRF/img/oval.svg)] bg-[100%_100%]">
                        <img
                            className="absolute top-1 left-1 w-[66px] h-[66px] object-cover rounded-full"
                            alt="Game Image"
                            src={game?.square_image || game?.image}
                            loading="eager"
                            decoding="async"
                            width={66}
                            height={66}
                        />
                    </div>

                    {/* Title + Rewards */}
                    <div className="flex flex-col justify-between  min-w-0">
                        {/* Title */}
                        <span className="font-poppins font-bold text-white text-lg leading-tight break-words">
                            {(() => {
                                const title = game?.title || game?.details?.name;
                                // Remove "Android" text from the title
                                return title
                                    .replace(/\s*Android\s*/gi, '') // Removes "Android"
                                    .replace(/-/g, ' ')             // Replaces all hyphens with a space
                                    .trim();
                            })()}
                        </span>

                        {/* Coins + XP */}
                        <div className="flex flex-wrap   gap-2 mt-2">
                            {/* Coins */}
                            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm">
                                <span className="text-white font-semibold text-sm">
                                    {game?.coins || 100}
                                </span>
                                <img
                                    src="/dollor.png"
                                    alt="Coins"
                                    className="w-4 h-4 object-contain"
                                    loading="eager"
                                    decoding="async"
                                    width={16}
                                    height={16}
                                />
                            </div>

                            {/* XP */}
                            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm">
                                <span className="text-white font-semibold text-sm">
                                    {game?.xp || 20}
                                </span>
                                <img
                                    src="https://c.animaapp.com/mHRmJGe1/img/pic.svg"
                                    alt="XP"
                                    className="w-4 h-4 object-contain"
                                    loading="eager"
                                    decoding="async"
                                    width={16}
                                    height={16}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Toggle button for expanding/collapsing tasks */}
                <div
                    className={`inline-flex items-center justify-center absolute ${showTimer ? "top-[150px]" : "top-[142px]"} mt-1  left-1/2 -translate-x-1/2 transition-all duration-300 z-10`}
                    onClick={toggleExpanded}
                >
                    <img
                        className={`relative w-5 h-5 transition-all duration-300 ${isExpanded ? "rotate-90" : ""} `}
                        alt="Arrow"
                        src="https://c.animaapp.com/iuW6cMRd/img/arrow.svg"
                        loading="eager"
                        decoding="async"
                        width={20}
                        height={20}
                    />
                </div>

                {/* Quest items - only show when expanded */}
                {isExpanded && questItems.map((quest, index) => (
                    <div
                        key={quest.id}
                        className="flex items-center justify-center absolute left-1/2 -translate-x-1/2 animate-fade-in"
                        style={{
                            top: `${158 + index * 87}px`,
                            animationDelay: `${index * 0.1}s`
                        }}
                    >
                        <div
                            className={`relative w-[304px] h-[75px] px-2 ${quest.hasBorder ? "border-b [border-bottom-style:solid] border-[#cacaca80]" : ""}`}
                        >
                            <div className="flex w-[14.14%] mt-[1px] h-[57.33%] items-center justify-around gap-[12.59px] px-[12.59px] py-[10.49px] absolute top-[14.00%] left-0 bg-[#4a347a] rounded-[50px] shadow-[0px_4px_4px_#00000040]">
                                {quest.isLocked ? (
                                    <div className="flex w-[48px] h-[43px] items-center justify-around gap-[12.59px] px-[12.59px] py-[10.49px] absolute top-[2px] left-0.5 rounded-[104.88px]">
                                        <div className="absolute top-px bottom-1 -left-0.5 w-[43px] h-[43px]">
                                            <img
                                                className="absolute top-0.5 left-1 w-[35px] h-[35px] aspect-[1] object-cover"
                                                alt="Lock"
                                                src="https://c.animaapp.com/FYtIEbRF/img/image-3943@2x.png"
                                                loading="eager"
                                                decoding="async"
                                                width={35}
                                                height={35}
                                            />
                                            <div className="absolute top-[-3px] left-[px] w-[45px] h-[44px] bg-[#d6d6d680] rounded-[21.5px]" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative w-fit mt-[-1.04px] [font-family:'Poppins',Helvetica] font-semibold text-white-f4f3fc text-[14.7px] tracking-[0] leading-[normal]">
                                        {quest.number}
                                    </div>
                                )}
                            </div>

                            <p
                                className={`absolute ${quest.isLocked ? "w-[50%] h-[48.00%]" : "w-[50%] h-[29.33%]"} top-1/2 left-[18%] transform -translate-y-1/2 [font-family:'Poppins',Helvetica] font-bold text-white text-sm tracking-[0.02px] leading-[normal] break-words text-center flex items-center justify-center`}
                            >
                                {quest.title}
                            </p>

                            <div
                                className={`absolute w-[28%] h-[22.67%] top-[50%] right-[4px] [font-family:'Poppins',Helvetica] font-bold text-sm text-start tracking-[0] leading-[17px] whitespace-nowrap transform -translate-y-1/2`}
                                style={{ color: quest.statusColor }}
                            >
                                {quest.status}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tooltip - Same style as WelcomeOffer */}
            {showTooltip && (
                <div
                    ref={tooltipRef}
                    className="absolute top-[35px] right-[-3px] z-50 w-[320px] bg-black/95 backdrop-blur-sm rounded-[12px] px-4 py-3 shadow-2xl"
                >
                    <div className="text-white font-medium text-sm [font-family:'Poppins',Helvetica] leading-normal">
                        <div className="text-[#ffe664] font-semibold mb-1 text-center">
                            Quest Card
                        </div>
                        <div className="text-center">
                            You need to complete all tasks in the game before these bonus tasks unlock.
                        </div>
                    </div>
                    {/* Arrow pointing up to the info icon */}
                    <div className="absolute top-[-8px] right-[25px] w-4 h-4 bg-black/95 transform rotate-45"></div>
                </div>
            )}
        </>
    );
};
