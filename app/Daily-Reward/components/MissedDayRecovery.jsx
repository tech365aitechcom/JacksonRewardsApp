"use client";

import React, { useState } from "react";

export const MissedDayRecovery = ({ onRecover, onClose, isVisible }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [recoveryMethod, setRecoveryMethod] = useState('ad'); // 'ad' or 'coins'

    const handleRecovery = async () => {
        setIsLoading(true);
        try {
            await onRecover(recoveryMethod);
            onClose();
        } catch (error) {
            // Recovery failed
        } finally {
            setIsLoading(false);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-black border border-gray-600 rounded-lg p-6 max-w-sm mx-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white text-lg font-semibold">Recover Missed Day</h3>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-400 text-xl"
                    >
                        ✕
                    </button>
                </div>

                <div className="text-white text-sm mb-4">
                    You missed a day! Choose how to recover:
                </div>

                <div className="space-y-3 mb-6">
                    <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                            type="radio"
                            name="recovery"
                            value="ad"
                            checked={recoveryMethod === 'ad'}
                            onChange={(e) => setRecoveryMethod(e.target.value)}
                            className="text-blue-500"
                        />
                        <span className="text-white">Watch an Ad (Free)</span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                            type="radio"
                            name="recovery"
                            value="coins"
                            checked={recoveryMethod === 'coins'}
                            onChange={(e) => setRecoveryMethod(e.target.value)}
                            className="text-blue-500"
                        />
                        <span className="text-white">Use 50 Coins</span>
                    </label>
                </div>

                <div className="flex space-x-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleRecovery}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isLoading ? 'Processing...' : 'Recover'}
                    </button>
                </div>
            </div>
        </div>
    );
};
