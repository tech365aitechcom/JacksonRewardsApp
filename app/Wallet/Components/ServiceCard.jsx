"use client";
import Image from 'next/image';
import React from 'react';

const ServiceCard = ({ card }) => {
    if (!card) return null;

    // Special handling for Money Transfer and Donation & Charity cards to ensure correct background color and corner radius
    const isMoneyTransfer = card.id === 1;
    const isDonationCharity = card.id === 3;
    const isCustomCard = isMoneyTransfer || isDonationCharity;

    const backgroundStyle = isMoneyTransfer
        ? { backgroundColor: 'rgba(185, 120, 14, 0.45)' }
        : isDonationCharity
            ? { background: 'linear-gradient(135deg, rgba(52, 168, 83, 0.24) 0%, rgba(52, 168, 83, 0.14) 100%)' }
            : {};

    return (
        <div
            className={`
                ${!isCustomCard ? card.innerBgColor : ''} 
                flex-shrink-0 snap-center 
                w-[90px] h-[176px] 
                ${isCustomCard ? 'rounded-[8px]' : 'rounded-[12px]'}
                opacity-100
                flex flex-col items-center justify-center gap-2 py-4 px-2 
                relative 
                text-center 
                transition-all duration-200 hover:scale-105
            `}
            style={backgroundStyle}
            role="button"
            tabIndex={0}
            aria-label={`Service card for ${card.title}`}
        >
            <Image
                src={card.image}
                alt={card.title}
                width={45}
                height={45}
                className="object-contain"
                loading="eager"
                decoding="async"
            />
            <div className="font-bold text-[#B7B7B7] font-[Libre Franklin] text-[12px] tracking-tight leading-snug">
                {card.title.split("\n").map((line, index) => (
                    <React.Fragment key={index}>
                        {line}
                        {index < card.title.split("\n").length - 1 && <br />}
                    </React.Fragment>
                ))}
            </div>
            {card.hasDescription && card.description && (
                <p className="text-[#B7B7B7] font-[Libre Franklin] text-[9px] font-normal leading-tight px-1">
                    {card.description}
                </p>
            )}
        </div>
    );
};

export default ServiceCard;