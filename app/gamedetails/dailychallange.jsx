import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export const DailyChallenge = ({ game }) => {
    const router = useRouter();

    // Preload banner images for faster rendering
    useEffect(() => {
        const preloadImages = [
            "/Dailychallangebanner/bg.svg",
            "/Dailychallangebanner/banner.svg",
            "/Dailychallangebanner/mainimage.png"
        ];

        preloadImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = src.endsWith('.svg') ? 'image/svg+xml' : 'image';
            link.href = src;
            document.head.appendChild(link);
        });

        // Cleanup function to remove preload links
        return () => {
            preloadImages.forEach(src => {
                const links = document.head.querySelectorAll(`link[href="${src}"]`);
                links.forEach(link => link.remove());
            });
        };
    }, []);

    // Sample banner data - you can replace this with actual data from props or API
    const bannerData = [
        {
            id: 1,
            maskingImage: "/img/masking.png",
            bgImage: "/Dailychallangebanner/bg.svg",
            bannerImage: "/Dailychallangebanner/banner.svg",
            reward: "Earn Reward",
            title: "Accept the Challenge",
            mainImage: "/Dailychallangebanner/mainimage.png"
        }
    ];

    return (
        <section
            className="flex flex-col w-[375px] mt-4 mb-8 items-start gap-4 relative"
            data-model-id="2247:7132"
            aria-label="Daily Challenges Section"
        >
            <header className="flex flex-col w-[375px] items-star pt-2 pb-0 px-2 relative flex-[0_0_auto]">
                <h1 className="relative w-fit mt-[-1.00px] [font-family:'Poppins',Helvetica] mr-3 font-semibold text-white text-xl tracking-[0] leading-[normal]">
                    Daily Challenges
                </h1>
                <div
                    className="absolute right-4 bottom-[-22px] w-24 h-6 bg-[linear-gradient(270deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0)_100%)]"
                    aria-hidden="true"
                />
            </header>

            <div className="flex flex-col w-[375px] h-[200px] items-start gap-2.5 pl-5 pr-0 py-0 relative overflow-hidden overflow-x-scroll">
                <div className="inline-flex items-start gap-2.5 px-px py-0 relative flex-[0_0_auto]">
                    {bannerData.map((banner) => (
                        <article
                            key={banner.id}
                            className="relative w-[349px] h-[200px] flex-shrink-0 cursor-pointer"
                            onClick={() => router.push("/dailychallenge")}
                        >
                            {banner.id === 1 ? (
                                <div className="relative w-[413.04px] h-[227.59px]">
                                    <img
                                        className="absolute -top-5 left-0 w-[352px] h-60"
                                        alt=""
                                        src={banner.bgImage}
                                        aria-hidden="true"
                                        loading="eager"
                                        decoding="async"
                                        width={352}
                                        height={240}
                                    />

                                    <img
                                        className="absolute top-[133px] left-6 w-[203px] h-12"
                                        alt=""
                                        src={banner.bannerImage}
                                        aria-hidden="true"
                                        loading="eager"
                                        decoding="async"
                                        width={203}
                                        height={48}
                                    />

                                    <p className="top-[81px] font-bold text-[#ffe664] text-[34px] leading-[48px] absolute left-6 [font-family:'Poppins',Helvetica] tracking-[0] whitespace-nowrap">
                                        {banner.reward}
                                    </p>

                                    <p className="top-[55px] font-medium text-white text-lg leading-6 absolute left-6 [font-family:'Poppins',Helvetica] tracking-[0] whitespace-nowrap">
                                        {banner.title}
                                    </p>

                                    {/* <div
                                        className="absolute top-[119px] left-[268px] w-[106px] h-[106px] rounded-[53.01px] rotate-[-177.48deg] bg-[linear-gradient(149deg,rgba(185,1,231,1)_0%,rgba(89,245,255,1)_100%)]"
                                        aria-hidden="true"
                                    /> */}

                                    <img
                                        className="absolute top-[100px] right-[-1px] w-[90px] h-[100px] object-cover"
                                        alt="Gaming controller illustration"
                                        src={banner.mainImage}
                                        loading="eager"
                                        decoding="async"
                                        width={90}
                                        height={100}
                                    />
                                </div>
                            ) : (
                                <img
                                    className="relative w-[349px] h-[200px]"
                                    alt="Challenge banner"
                                    src={banner.image}
                                />
                            )}
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};
