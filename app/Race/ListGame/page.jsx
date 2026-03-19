"use client";
import React, { Suspense } from "react";
import { ListGame } from "../components/ListGame";

export default function ListGamePage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col w-full min-h-screen bg-black px-5 pt-4 max-w-md mx-auto">
        <div className="h-3 w-20 bg-gray-800 rounded mt-2 mb-4" />
        <div className="flex items-center gap-4 mb-6">
          <div className="w-8 h-8 rounded-full bg-gray-800" />
          <div className="h-5 w-40 bg-gray-800 rounded animate-pulse" />
        </div>
        {[0,1,2,3,4].map(i => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gray-800 animate-pulse" style={{animationDelay:`${i*0.1}s`}} />
              <div className="flex flex-col gap-2">
                <div className="h-3 w-32 bg-gray-800 rounded animate-pulse" style={{animationDelay:`${i*0.1+0.1}s`}} />
                <div className="h-3 w-20 bg-gray-800 rounded animate-pulse" style={{animationDelay:`${i*0.1+0.2}s`}} />
              </div>
            </div>
            <div className="w-16 h-8 bg-gray-800 rounded animate-pulse" style={{animationDelay:`${i*0.1+0.3}s`}} />
          </div>
        ))}
      </div>
    }>
      <div className="flex justify-center w-full">
        <div className="relative w-full max-w-md min-h-screen bg-black mx-auto">
          <ListGame />
        </div>
      </div>
    </Suspense>
  );
}
