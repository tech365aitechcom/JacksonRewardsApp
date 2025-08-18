"use client";
import React from "react";
import Image from "next/image";
import { AccountOverviewSection } from "./components/AccountOverviewSection";
import { GameListSection } from "./components/GameListSection";

export default function GamesPage() {
  return (
    <div
      className="relative w-[375px] h-[2274px] bg-black"
      data-model-id="289:1500"
    >
      
      <div className="flex flex-col w-[375px] items-start gap-2 px-5 py- absolute top-[54px] left-0">
        <div className="flex h-12 items-center justify-between relative self-stretch w-full rounded-[32px]">
          <div className="w-[164px] font-semibold text-white text-xl tracking-[0] leading-5 relative [font-family:'Poppins',Helvetica]">
            My Games
          </div>

          <Image
            className="relative w-12 h-12"
            alt="Search"
            src="https://c.animaapp.com/3mn7waJw/img/search.svg"
            width={48}
            height={48}
          />
        </div>
      </div>

      <GameListSection />
      <AccountOverviewSection />
    </div>
  );
}