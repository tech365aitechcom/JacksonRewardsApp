"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext"; // Ensure this path is correct
import { getProfile, getProfileStats, getVipStatus, updateProfile } from "@/lib/api";


export default function MyProfile() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [vipStatus, setVipStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const achievements = [
    {
      id: 1,
      title: "Your First Win",
      description: "Won your first match in\nSweet Bonanza",
      points: 150,
      bonus: 100,
      image: "https://c.animaapp.com/V1uc3arn/img/image-3926@2x.png",
      bgImage: "https://c.animaapp.com/V1uc3arn/img/oval@2x.png",
    },
    {
      id: 2,
      title: "Level 4 Reached",
      description: "Won your first match in\nGame of Olympus",
      points: 150,
      bonus: 100,
      image: "https://c.animaapp.com/V1uc3arn/img/image-3928@2x.png",
      bgImage: "https://c.animaapp.com/V1uc3arn/img/oval-1@2x.png",
    },
  ];

  // Data for leadership games
  const leadershipGames = [
    {
      id: 1,
      title: "Commando",
      level: "Level 11",
      category: "Action",
      views: "5.6 K",
      image: "https://c.animaapp.com/V1uc3arn/img/rectangle-24@2x.png",
    },
    {
      id: 2,
      title: "Robbery Bob",
      level: "Level 19",
      category: "Action",
      views: "8.1 K",
      image: "https://c.animaapp.com/V1uc3arn/img/rectangle-25@2x.png",
    },
  ];


  // Data for settings sections
  const settingsSections = [
    {
      id: 1,
      items: [
        {
          icon: "https://c.animaapp.com/V1uc3arn/img/line-media-notification-3-line.svg",
          title: "Notifications",
          hasToggle: true,
          asToggle: true,
          // DYNAMIC DATA: Get notification status from the profile state
          isToggled: profile?.profile?.notifications ?? false,
        },
        {
          icon: "https://c.animaapp.com/V1uc3arn/img/line-editor-translate-2.svg",
          title: "Language",
          value: "English",
        },
      ],
    },
    {
      id: 2,
      items: [
        {
          icon: "https://c.animaapp.com/V1uc3arn/img/line-business-projector-2-line.svg",
          title: "Security",
        },
        {
          icon: "https://c.animaapp.com/V1uc3arn/img/line-health-mental-health-line.svg",
          title: "Theme",
          value: profile?.profile?.theme === 'dark' ? "Dark Mode" : "Light Mode",
        },
      ],
    },
    {
      id: 3,
      items: [
        {
          icon: "https://c.animaapp.com/V1uc3arn/img/line-user-contacts-line.svg",
          title: "Tickets / Complaints",
          hasArrow: true,
        },
        {
          icon: "https://c.animaapp.com/V1uc3arn/img/line-communication-chat-quote-line.svg",
          title: "Contact us",
          hasArrow: true,
        },
        {
          icon: "https://c.animaapp.com/V1uc3arn/img/line-system-lock-2-line.svg",
          title: "Privacy policy",
          hasArrow: true,
        },
      ],
    },
  ];


  const handleEditProfile = () => {
    router.push("/edit-profile");
  };

  const handleVipUpgrade = () => {
    router.push("/vip-plans");
  };


  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          // Fetch profile, stats, and VIP status in parallel for better performance
          const [profileData, statsData, vipData] = await Promise.all([
            getProfile(token),
            getProfileStats(token),
            getVipStatus(token),
          ]);
          console.log("profileData", profileData);
          console.log("statsData", statsData);
          console.log("vipData", vipData);


          setProfile(profileData);
          setStats(statsData);
          setVipStatus(vipData);
        } catch (err) {
          setError(err.message || "Failed to fetch profile data.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [token]);




  const handleToggleNotifications = async () => {
    if (!profile || !token) return;

    const originalNotifications = profile.profile.notifications;
    const newNotifications = !originalNotifications;

    try {
      // Optimistic UI update for a snappy feel
      setProfile(prev => ({
        ...prev,
        profile: { ...prev.profile, notifications: newNotifications },
      }));
      // Call the API to persist the change
      await updateProfile({ notifications: newNotifications }, token);
    } catch (err) {
      alert("Failed to update notification settings. Please try again.");
      // Revert the UI change if the API call fails
      setProfile(prev => ({
        ...prev,
        profile: { ...prev.profile, notifications: originalNotifications },
      }));
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-black flex justify-center items-center text-white text-xl">Loading Profile...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-black flex justify-center items-center text-red-500 text-xl">Error: {error}</div>;
  }



  return (
    <div className="min-h-screen bg-black flex justify-center">
      <div
        className="relative w-[375px] h-[2177px] bg-black overflow-hidden"
        data-model-id="2035:8508"
      >
        {/* Header */}
        <header className="flex flex-col w-[375px] items-start gap-2 px-5 py-3 absolute top-[54px] left-0">
          <div className="flex items-center gap-4 relative self-stretch w-full flex-[0_0_auto] rounded-[32px]">
            <button className="relative w-6 h-6" aria-label="Go back">
              <Image
                width={24}
                height={24}
                className="relative w-6 h-6"
                alt="Arrow back ios new"
                src="https://c.animaapp.com/V1uc3arn/img/arrow-back-ios-new@2x.png"
              />
            </button>

            <h1 className="relative w-[271px] [font-family:'Poppins',Helvetica] font-semibold text-white text-xl tracking-[0] leading-5">
              My Profile
            </h1>
          </div>
        </header>

        <main className="flex flex-col w-[375px] items-center gap-6 absolute top-[110px] -left-px">
          {/* Profile Section */}
          <section className="flex flex-col w-[335px] items-center gap-[7px] relative flex-[0_0_auto]">
            <div className="relative w-[120px] h-[122.84px]">
              <div className="relative w-[132px] h-[123px]">
                <Image
                  width={132}
                  height={120}
                  className="absolute w-[132px] h-[120px] top-0 left-0"
                  alt="Profile avatar"
                  src="https://c.animaapp.com/V1uc3arn/img/component-1.svg"
                />

                <button
                  onClick={handleEditProfile}
                  className="absolute w-[43px] h-[43px] top-[79px] left-[77px] bg-darkgray-2 rounded-[21.73px] border-[5px] border-solid border-darkgray-1"
                  aria-label="Edit profile"
                >
                  <Image
                    width={23}
                    height={23}
                    className="absolute w-[23px] h-[23px] top-[5px] left-[5px]"
                    alt="Edit icon"
                    src="https://c.animaapp.com/V1uc3arn/img/line-design-edit-line.svg"
                  />
                </button>
              </div>
            </div>

            <h2 className="relative w-[194px] [font-family:'Poppins',Helvetica] font-semibold text-white text-xl text-center tracking-[0] leading-5">
              {profile.firstName}
            </h2>

            <div className="inline-flex items-center justify-center gap-[7px] relative flex-[0_0_auto]">
              <div className="relative w-8 h-8 shadow-[0px_9.91px_14.86px_#eab02066] aspect-[1]">
                <div className="relative h-8 left-0.5">
                  <div className="absolute w-8 h-8 top-0 left-0">
                    <div className="relative w-[29px] h-[29px] top-px left-px">
                      <Image
                        width={29}
                        height={29}
                        className="absolute w-[29px] h-[29px] top-0 left-0"
                        alt="Star"
                        src="https://c.animaapp.com/V1uc3arn/img/star-7.svg"
                      />

                      <Image
                        width={22}
                        height={22}
                        className="absolute w-[22px] h-[22px] top-1 left-1"
                        alt="Rectangle"
                        src="https://c.animaapp.com/V1uc3arn/img/rectangle-1485.svg"
                      />

                      <div className="absolute h-[15px] left-[7px] w-[15px] top-2" />
                    </div>
                  </div>

                  <Image
                    width={11}
                    height={8}
                    className="absolute w-[11px] h-2 top-3 left-[11px]"
                    alt="Check icon"
                    src="https://c.animaapp.com/V1uc3arn/img/icon-navigation-check-24px.svg"
                  />

                  <Image
                    width={22}
                    height={22}
                    className="absolute w-[22px] h-[22px] top-[5px] left-[5px]"
                    alt="Ellipse"
                    src="https://c.animaapp.com/V1uc3arn/img/ellipse-10.svg"
                  />
                </div>
              </div>

              <span className="relative w-fit [font-family:'Poppins',Helvetica] font-normal text-[#fefefe] text-sm text-center tracking-[0] leading-5 whitespace-nowrap">
                {vipStatus.level} Badge
              </span>
            </div>

            <p className="relative w-fit [font-family:'Poppins',Helvetica] font-normal text-gray-300 text-sm text-center tracking-[0.25px] leading-5 whitespace-nowrap">
              &nbsp;&nbsp;&nbsp;&nbsp;{user.email} | {user.mobile}
            </p>

            <div className="relative w-fit [font-family:'Poppins',Helvetica] font-normal text-gray-300 text-sm text-center tracking-[0.25px] leading-5 whitespace-nowrap">
              |&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;GamePro
            </div>

            <Image
              width={32}
              height={32}
              className="absolute w-8 h-8 top-[225px] left-[122px] aspect-[1] object-cover"
              alt="Flag"
              src="https://c.animaapp.com/V1uc3arn/img/image-3956@2x.png"
            />
          </section>

          <Image
            width={23}
            height={17}
            className="absolute w-[23px] h-[17px] top-[207px] left-5 aspect-[1.33] object-cover"
            alt="Location icon"
            src="https://c.animaapp.com/V1uc3arn/img/image-3958@2x.png"
          />

          {/* Earnings Section */}
          <section className="flex flex-col items-start gap-2.5 pl-5 pr-0 py-0 relative self-stretch w-full flex-[0_0_auto] overflow-x-scroll">
            <div className="relative w-[335px] h-[129px]">
              <div className="relative h-[134px]" style={{ backgroundImage: "url(https://c.animaapp.com/V1uc3arn/img/blank-button03@2x.png)" }}>
                <div className="absolute w-[81px] h-[45px] top-[23px] left-4">
                  <div className="absolute w-[71px] h-[42px] top-0 left-0">
                    <div className="absolute top-0 left-0 [font-family:'Poppins',Helvetica] font-normal text-white text-xs tracking-[-0.12px] leading-[normal]">
                      My Earnings
                    </div>

                    <div className="absolute w-[54px] top-4 left-0 [font-family:'Poppins',Helvetica] font-semibold text-white text-2xl tracking-[0] leading-[normal] whitespace-nowrap">
                      {stats.balance}
                    </div>
                  </div>

                  <Image
                    width={23}
                    height={24}
                    className="top-[21px] left-[58px] absolute w-[23px] h-6 aspect-[0.97]"
                    alt="Coin"
                    src="https://c.animaapp.com/V1uc3arn/img/image-3937@2x.png"
                  />
                </div>

                <div className="absolute w-[74px] h-7 top-[39px] left-[103px]">
                  <div className="absolute w-[54px] top-0 left-0 [font-family:'Poppins',Helvetica] font-semibold text-white text-2xl tracking-[0] leading-[normal] whitespace-nowrap">
                    {stats.xp}
                  </div>

                  <Image
                    width={26}
                    height={21}
                    className="absolute w-[26px] h-[21px] top-[7px] left-12"
                    alt="Trophy icon"
                    src="https://c.animaapp.com/V1uc3arn/img/pic.svg"
                  />
                </div>

                <div className="absolute w-[205px] h-[37px] top-[73px] left-4">
                  <div className="relative w-[178px] h-[37px]">
                    <div className="absolute w-[178px] h-[37px] top-0 left-0" style={{ backgroundImage: "url(https://c.animaapp.com/V1uc3arn/img/group-289352@2x.png)" }}>
                      <Image
                        width={29}
                        height={30}
                        className="absolute w-[29px] h-[30px] top-1 left-[3px]"
                        alt="Level badge"
                        src="https://c.animaapp.com/V1uc3arn/img/ellipse-35.svg"
                      />

                      <div className="absolute w-2 top-2 left-3 [font-family:'Poppins',Helvetica] font-semibold text-[#815c23] text-[14.9px] tracking-[0.02px] leading-[normal]">
                        2
                      </div>
                    </div>
                  </div>

                  <p className="absolute w-[86px] top-[9px] left-[60px] opacity-80 [font-family:'Poppins',Helvetica] font-semibold text-transparent text-xs tracking-[0.02px] leading-[normal]">
                    <span className="text-[#685512] tracking-[0]">{stats.
                      gamesPlayed}</span>
                    <span className="text-[#8d741b80] tracking-[0]">/6000</span>
                  </p>

                  <div className="absolute w-8 h-[30px] top-1 left-[141px] opacity-50">
                    <div className="relative w-[30px] h-[30px]">
                      <div className="absolute w-[30px] h-[30px] top-0 left-0">
                        <div className="h-[30px]" style={{ backgroundImage: "url(https://c.animaapp.com/V1uc3arn/img/ellipse-35-1.svg)" }}>
                          <div className="relative h-3.5 left-2 bg-[url(/img/vector.png)] w-[15px] top-2" />
                        </div>
                      </div>

                      <div className="absolute w-[9px] top-1 left-2.5 [font-family:'Poppins',Helvetica] font-semibold text-[#815c23] text-[14.9px] tracking-[0.02px] leading-[normal]">
                        3
                      </div>
                    </div>
                  </div>

                  <Image
                    width={12}
                    height={11}
                    className="absolute w-3 h-[11px] top-3 left-[41px]"
                    alt="Vector"
                    src="https://c.animaapp.com/V1uc3arn/img/vector.svg"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Achievements Section */}
          <section className="flex flex-col w-[335px] items-start gap-2.5 relative flex-[0_0_auto]">
            <div className="flex w-[335px] items-center justify-between relative flex-[0_0_auto]">
              <div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
                <Image
                  width={43}
                  height={44}
                  className="relative w-[43px] h-11"
                  alt="Trophy"
                  src="https://c.animaapp.com/V1uc3arn/img/trophy@2x.png"
                />

                <h3 className="relative w-fit [font-family:'Poppins',Helvetica] font-semibold text-white-f4f3fc text-base tracking-[0] leading-[normal]">
                  Achievements
                </h3>
              </div>

              <button className="relative w-fit [font-family:'Poppins',Helvetica] font-medium text-[#8b92de] text-base tracking-[0] leading-[normal]">
                See All
              </button>
            </div>

            {achievements.map((achievement) => (
              <article
                key={achievement.id}
                className="relative w-[335px] h-[92px] bg-black rounded-[10px] shadow-[2.48px_2.48px_18.58px_#a6aabc4c,-1.24px_-1.24px_16.1px_#f9faff1a]"
              >
                <div
                  className={`absolute w-16 h-16 top-3.5 left-4 bg-cover bg-[50%_50%]`}
                  style={{ backgroundImage: `url(${achievement.bgImage})` }}
                >
                  <Image
                    width={63}
                    height={49}
                    className="absolute w-[63px] h-[49px] top-[15px] left-0 aspect-[1.3] object-cover"
                    alt={achievement.title}
                    src={achievement.image}
                  />
                </div>

                <h4 className="absolute w-[139px] top-[13px] left-[92px] [font-family:'Poppins',Helvetica] font-bold text-[#d9d9d9] text-base tracking-[0.02px] leading-[normal]">
                  {achievement.title}
                </h4>

                <p className="absolute top-10 left-[92px] [font-family:'Poppins',Helvetica] font-light text-[#d9d9d9] text-[13px] tracking-[0.02px] leading-4 whitespace-pre-line">
                  {achievement.description}
                </p>

                <div className="absolute w-[60px] h-[58px] top-4 left-[261px]">
                  <div className="absolute -top-px left-0 [font-family:'Poppins',Helvetica] font-semibold text-white text-xl text-right tracking-[0.02px] leading-[normal]">
                    {achievement.points}
                  </div>

                  <Image
                    width={21}
                    height={22}
                    className="absolute w-[21px] h-[22px] top-1 left-[38px] aspect-[0.97]"
                    alt="Coin"
                    src="https://c.animaapp.com/V1uc3arn/img/image-3937-2@2x.png"
                  />

                  <div className="absolute w-[59px] h-6 top-[33px] left-0 bg-[#201f58] rounded">
                    <div className="relative w-[49px] h-[15px] top-[5px] left-[5px]">
                      <div className="absolute w-[34px] h-[13px] top-0 left-0 [font-family:'Poppins',Helvetica] font-medium text-white text-[13px] tracking-[0] leading-[13px]">
                        +{achievement.bonus}
                      </div>

                      <Image
                        width={16}
                        height={15}
                        className="absolute w-4 h-[15px] top-0 left-[33px]"
                        alt="Trophy"
                        src={`https://c.animaapp.com/V1uc3arn/img/pic-${achievement.id}.svg`}
                      />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>

          {/* VIP Member Section */}
          {vipStatus?.level === 'BRONZE' ? (
            // If user is a default Bronze member, show the upgrade banner with a functional button
            <section className="flex flex-col w-[335px] h-[127px] items-start gap-2.5 relative">
              <Image
                width={334}
                height={127}
                className="relative w-[334px] h-[127px]"
                alt="VIP background"
                src="https://c.animaapp.com/V1uc3arn/img/race.svg"
              />
              <Image
                width={215}
                height={119}
                className="absolute w-[215px] h-[119px] top-2 left-0"
                alt="VIP decoration"
                src="https://c.animaapp.com/V1uc3arn/img/clip-path-group@2x.png"
              />
              <div className="flex flex-col w-[198px] items-start absolute top-[21px] left-[25px]">
                <div className="flex flex-col items-start pt-0 pb-2 px-0 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="relative w-fit mt-[-1.00px] [font-family:'Poppins',Helvetica] font-bold text-white text-sm tracking-[0] leading-4 whitespace-nowrap">
                    Become a
                  </div>
                  <h3 className="relative w-fit ml-[-0.50px] [text-shadow:0px_4px_8px_#1a002f40] [-webkit-text-stroke:0.5px_transparent]  [-webkit-background-clip:text] bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(245,245,245,1)_100%)] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Poppins',Helvetica] font-semibold text-transparent text-[32px] tracking-[0] leading-8 whitespace-nowrap">
                    VIP Member
                  </h3>
                </div>
                {/* THIS BUTTON IS NOW FUNCTIONAL */}
                <button
                  onClick={handleVipUpgrade}
                  className="inline-flex items-start gap-2.5 px-3.5 py-2 relative flex-[0_0_auto] bg-[#ffdd8f] rounded-xl hover:opacity-90 transition-opacity"
                >
                  <span className="relative w-fit mt-[-1.00px] [font-family:'Poppins',Helvetica] font-semibold text-[#736de8] text-[13px] tracking-[0] leading-[normal]">
                    Check Plans
                  </span>
                </button>
              </div>
            </section>
          ) : (
            // If user is already a Silver, Gold, etc. member, show their status
            <section className="flex flex-col w-[335px] h-[127px] items-start justify-center p-6 relative rounded-lg bg-gradient-to-br from-purple-700 to-indigo-900">
              <div className="relative w-fit [font-family:'Poppins',Helvetica] font-bold text-yellow-300 text-sm tracking-[0] leading-4 whitespace-nowrap">
                You are a
              </div>
              <h3 className="relative w-fit [font-family:'Poppins',Helvetica] font-semibold text-white text-3xl tracking-[0] leading-8 whitespace-nowrap">
                {vipStatus?.level} Member
              </h3>
              {vipStatus?.expires && (
                <p className="mt-2 text-xs text-white opacity-80">
                  Expires on: {new Date(vipStatus.expires).toLocaleDateString()}
                </p>
              )}
            </section>
          )}

          {/* Invite Friends Section */}
          <section className="flex flex-col items-start gap-2.5 pl-5 pr-0 py-0 relative self-stretch w-full flex-[0_0_auto] overflow-x-scroll">
            <div className="relative w-[335px] h-[129px]">
              <div className="relative h-[134px]" style={{ backgroundImage: "url(https://c.animaapp.com/V1uc3arn/img/blank-button03-1@2x.png)" }}>
                <h4 className="absolute top-[19px] left-4 [font-family:'Poppins',Helvetica] font-normal text-white text-lg tracking-[-0.18px] leading-[normal]">
                  Invite Friends
                </h4>

                <div className="absolute top-[46px] left-4 [font-family:'Poppins',Helvetica] font-bold text-white text-lg tracking-[-0.18px] leading-[normal]">
                  Get a Premium Badge
                </div>

                <div className="absolute w-[67px] h-[67px] top-[27px] left-[241px] shadow-[0px_37.16px_55.74px_#eab02066] aspect-[1]">
                  <div className="relative h-[67px] left-1">
                    <div className="absolute w-[67px] h-[67px] top-0 left-0" style={{ backgroundImage: "url(https://c.animaapp.com/V1uc3arn/img/star-6-1.svg)" }}>
                      <div className="relative h-[67px]" style={{ backgroundImage: "url(https://c.animaapp.com/V1uc3arn/img/star-7-1.svg)" }}>
                        <Image
                          width={46}
                          height={47}
                          className="absolute w-[46px] h-[47px] top-[11px] left-2.5"
                          alt="Premium badge"
                          src="https://c.animaapp.com/V1uc3arn/img/rectangle-1485-1.svg"
                        />

                        <div className="absolute w-[31px] h-[31px] top-[19px] left-[18px]" />
                      </div>
                    </div>

                    <Image
                      width={22}
                      height={16}
                      className="absolute w-[22px] h-4 top-[25px] left-[23px]"
                      alt="Check icon"
                      src="https://c.animaapp.com/V1uc3arn/img/icon-navigation-check-24px-1.svg"
                    />

                    <Image
                      width={47}
                      height={47}
                      className="absolute w-[47px] h-[47px] top-[11px] left-2.5"
                      alt="Badge circle"
                      src="https://c.animaapp.com/V1uc3arn/img/ellipse-10-1.svg"
                    />
                  </div>
                </div>

                <button className="inline-flex items-start gap-2.5 px-3.5 py-2 absolute top-[76px] left-4 bg-[#ffdd8f] rounded-xl">
                  <span className="relative w-fit mt-[-1.00px] [font-family:'Poppins',Helvetica] font-semibold text-[#736de8] text-[13px] tracking-[0] leading-[normal]">
                    Know More
                  </span>
                </button>
              </div>
            </div>
          </section>

          {/* Leadership Section */}
          <section className="flex flex-col w-[335px] items-start gap-2.5 relative flex-[0_0_auto]">
            <h3 className="relative self-stretch mt-[-1.00px] [font-family:'Poppins',Helvetica] font-semibold text-white-f4f3fc text-base tracking-[0] leading-[normal]">
              Leadership
            </h3>

            <div className="flex items-center gap-[15px] relative self-stretch w-full flex-[0_0_auto]">
              {leadershipGames.map((game) => (
                <article key={game.id} className="relative w-40 h-[281px]">
                  <div
                    className="absolute w-40 h-[180px] top-0 left-0 bg-cover bg-center rounded-[20px] blur-[2px]"
                    style={{
                      backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.31) 0%, rgba(0,0,0,0.65) 88%), url(${game.image})`
                    }}
                  >
                    <div className="relative w-[68px] h-[25px] top-3 left-[82px]">
                      <div className="relative w-[66px] h-[25px] bg-[#ffffff4f] rounded-[5.32px] backdrop-blur-[2.66px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(2.66px)_brightness(100%)]">
                        <Image
                          width={13}
                          height={10}
                          className="absolute w-[13px] h-2.5 top-2 left-[7px]"
                          alt="Views icon"
                          src="https://c.animaapp.com/V1uc3arn/img/vector-2.svg"
                        />

                        <div className="absolute top-[3px] left-[25px] [font-family:'Poppins',Helvetica] font-bold text-white text-[13px] tracking-[0] leading-[normal]">
                          {game.views}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col w-[154px] items-start gap-2 absolute top-[196px] left-0">
                    <div className="flex flex-col items-start gap-1 relative self-stretch w-full flex-[0_0_auto]">
                      <h4 className="relative self-stretch mt-[-1.00px] [font-family:'Poppins',Helvetica] font-semibold text-white text-base tracking-[0] leading-[normal]">
                        {game.title}
                      </h4>

                      <div className="relative w-[76px] h-[37px] rounded-[10px] overflow-hidden bg-[linear-gradient(180deg,rgba(158,173,247,0.6)_0%,rgba(113,106,231,0.6)_100%)]">
                        <div className="absolute top-1.5 left-[9px] [font-family:'Poppins',Helvetica] font-medium text-white text-base tracking-[0] leading-[normal]">
                          {game.level}
                        </div>
                      </div>

                      <div className="relative self-stretch [font-family:'Poppins',Helvetica] font-normal text-white text-[13px] tracking-[0] leading-[normal]">
                        {game.category}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Spin & Win Section */}
          <section className="flex flex-col items-start gap-2.5 pl-5 pr-0 py-0 relative self-stretch w-full flex-[0_0_auto] overflow-x-scroll">
            <div className="flex flex-col w-[335px] h-[103px] items-start justify-center gap-8 px-0 py-4 relative rounded-[10px] overflow-hidden bg-[linear-gradient(107deg,rgba(200,117,251,1)_0%,rgba(16,4,147,1)_100%)]">
              <div className="inline-flex flex-col items-start pl-4 pr-8 py-0 relative flex-[0_0_auto] mt-[-5.50px] mb-[-5.50px]">
                <div className="inline-flex flex-col items-start gap-2 pt-0 pb-2 px-0 relative flex-[0_0_auto]">
                  <h4 className="relative w-fit mt-[-1.00px] [font-family:'Poppins',Helvetica] font-bold text-[#e5bfff] text-sm tracking-[0] leading-4 whitespace-nowrap">
                    Spin &amp; Win
                  </h4>

                  <div className="relative w-fit ml-[-0.50px] [text-shadow:0px_4px_8px_#1a002f40] [-webkit-text-stroke:0.5px_transparent]  [-webkit-background-clip:text] bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(245,245,245,1)_100%)] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Poppins',Helvetica] font-bold text-transparent text-[32px] tracking-[0] leading-8 whitespace-nowrap">
                    50
                  </div>

                  <Image
                    width={23}
                    height={24}
                    className="top-[27px] left-[46px] absolute w-[23px] h-6 aspect-[0.97]"
                    alt="Coin"
                    src="https://c.animaapp.com/V1uc3arn/img/image-3937-3@2x.png"
                  />
                </div>

                <p className="relative w-fit [font-family:'Poppins',Helvetica] font-medium text-white text-xs tracking-[0] leading-[normal]">
                  Click to spin the wheel
                </p>
              </div>

              <Image
                width={102}
                height={62}
                className="absolute w-[102px] h-[62px] top-[18px] left-[195px]"
                alt="Spin wheel"
                src="https://c.animaapp.com/V1uc3arn/img/spin-icon@2x.png"
              />

              <Image
                width={42}
                height={39}
                className="absolute w-[42px] h-[39px] top-[22px] left-[145px]"
                alt="Decoration element"
                src="https://c.animaapp.com/V1uc3arn/img/-----6@2x.png"
              />

              <Image
                width={30}
                height={31}
                className="absolute w-[30px] h-[31px] top-[63px] left-[175px]"
                alt="Decoration element"
                src="https://c.animaapp.com/V1uc3arn/img/-----9@2x.png"
              />

              <Image
                width={44}
                height={46}
                className="absolute w-11 h-[46px] top-14 left-[275px]"
                alt="Decoration element"
                src="https://c.animaapp.com/V1uc3arn/img/-----5@2x.png"
              />

              <Image
                width={44}
                height={46}
                className="absolute w-11 h-[46px] top-[3px] left-[291px]"
                alt="Decoration element"
                src="https://c.animaapp.com/V1uc3arn/img/-----10@2x.png"
              />

              <Image
                width={8}
                height={8}
                className="absolute w-2 h-2 top-1.5 left-48"
                alt="Star decoration"
                src="https://c.animaapp.com/V1uc3arn/img/vector-3.svg"
              />

              <Image
                width={8}
                height={8}
                className="absolute w-2 h-2 top-[19px] left-[129px]"
                alt="Star decoration"
                src="https://c.animaapp.com/V1uc3arn/img/vector-4.svg"
              />

              <Image
                width={5}
                height={5}
                className="absolute w-[5px] h-[5px] top-[46px] left-48"
                alt="Star decoration"
                src="https://c.animaapp.com/V1uc3arn/img/vector-5.svg"
              />

              <Image
                width={5}
                height={5}
                className="absolute w-[5px] h-[5px] top-11 left-[302px]"
                alt="Star decoration"
                src="https://c.animaapp.com/V1uc3arn/img/vector-6.svg"
              />

              <Image
                width={8}
                height={8}
                className="absolute w-2 h-2 top-[70px] left-[164px]"
                alt="Star decoration"
                src="https://c.animaapp.com/V1uc3arn/img/vector-8.svg"
              />

              <Image
                width={8}
                height={8}
                className="absolute w-2 h-2 top-[13px] left-[270px]"
                alt="Star decoration"
                src="https://c.animaapp.com/V1uc3arn/img/vector-8.svg"
              />

              <Image
                width={26}
                height={24}
                className="absolute w-[26px] h-6 top-[73px] left-[250px]"
                alt="Decoration element"
                src="https://c.animaapp.com/V1uc3arn/img/-----8@2x.png"
              />
            </div>
          </section>

          {/* Settings Section */}
          <section className="flex flex-col w-[335px] items-start gap-2.5 relative flex-[0_0_auto]">
            <h3 className="relative self-stretch mt-[-1.00px] [font-family:'Poppins',Helvetica] font-semibold text-white-f4f3fc text-base tracking-[0] leading-[normal]">
              Settings
            </h3>
            <div className="flex flex-col gap-4 w-full">
              {settingsSections.map((section) => (
                <div
                  key={section.id}
                  className="w-full bg-darkgray-0 rounded-lg border border-solid border-[#494949] shadow-[0px_1px_4px_#00000040] p-4"
                >
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className={`flex items-center justify-between w-full ${itemIndex > 0 ? "mt-6" : ""}`}
                    >
                      <div className="flex items-center gap-4">
                        <Image width={24} height={24} className="w-6 h-6 flex-shrink-0" alt={item.title} src={item.icon} />
                        <span className="[font-family:'Poppins',Helvetica] font-normal text-white text-base tracking-[0.25px] leading-5">
                          {item.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.value && (
                          <span className="[font-family:'Poppins',Helvetica] font-normal text-[#8b92de] text-sm tracking-[0.25px] leading-5">
                            {item.value}
                          </span>
                        )}
                        {item.hasToggle && (
                          <button
                            className={`w-[42px] h-[22px] rounded-[10px] relative transition-all ${item.isToggled ? "bg-[#8b92de]" : "bg-gray-500"}`}
                            // DYNAMIC HANDLER: Call the correct function
                            onClick={item.title === 'Notifications' ? handleToggleNotifications : null}
                            aria-label={`Toggle ${item.title}`}
                          >
                            <div
                              className={`absolute w-4 h-4 top-[3px] bg-white rounded-full transition-all ${item.isToggled ? "left-[22px]" : "left-[3px]"}`}
                            />
                          </button>
                        )}
                        {item.hasArrow && (
                          <button className="w-6 h-6 flex-shrink-0" aria-label={`Go to ${item.title}`}>
                            <Image width={24} height={24} className="w-6 h-6" alt="Arrow" src="https://c.animaapp.com/V1uc3arn/img/arrow-back-ios-new-3@2x.png" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>
        </main>

        <div className="absolute top-[37px] left-5 [font-family:'Poppins',Helvetica] font-normal text-neutral-400 text-[10px] tracking-[0] leading-3 whitespace-nowrap">
          App Version: V0.0.1
        </div>
      </div>
    </div>
  );
};
