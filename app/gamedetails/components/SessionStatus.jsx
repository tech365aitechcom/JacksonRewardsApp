import React, { useState, useEffect } from "react";
import sessionManager from "@/lib/sessionManager";

export const SessionStatus = ({ game, currentSession }) => {
    const [sessionStats, setSessionStats] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (currentSession) {
            const stats = sessionManager.getSessionStats();
            setSessionStats(stats);
        }
    }, [currentSession]);

    if (!currentSession || !isVisible) {
        return (
            <button
                onClick={() => setIsVisible(true)}
                className="fixed bottom-4 right-4 w-12 h-12 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
                title="Session Status"
            >
                <svg className="w-6 h-6 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            </button>
        );
    }

    const formatDuration = (ms) => {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) return `${hours}h ${minutes % 60}m`;
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    };

    const sessionDuration = Date.now() - currentSession.startTime;

    return (
        <div className="fixed bottom-4 right-4 w-80 bg-gray-900 rounded-lg shadow-xl border border-gray-700 z-50">
            <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-white font-semibold text-sm">Session Status</h3>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Session ID:</span>
                        <span className="text-white font-mono">{currentSession.id.split('_')[1]}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-400">Game:</span>
                        <span className="text-white">{game?.title?.split(' - ')[0] || 'Unknown'}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-400">Duration:</span>
                        <span className="text-white">{formatDuration(sessionDuration)}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className={`font-semibold ${currentSession.isActive ? 'text-green-400' : 'text-red-400'}`}>
                            {currentSession.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-400">Coins Earned:</span>
                        <span className="text-yellow-400 font-semibold">${currentSession.sessionCoins.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-400">XP Earned:</span>
                        <span className="text-blue-400 font-semibold">{currentSession.sessionXP}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-400">Tasks Completed:</span>
                        <span className="text-white">{currentSession.tasksCompleted.length}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-400">Milestones:</span>
                        <span className="text-white">{currentSession.milestonesReached.length}</span>
                    </div>
                </div>

                {sessionStats && (
                    <div className="mt-3 pt-3 border-t border-gray-700">
                        <div className="text-xs text-gray-400 mb-1">Overall Stats</div>
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Active Sessions:</span>
                            <span className="text-white">{sessionStats.activeSessions}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Total Coins:</span>
                            <span className="text-yellow-400">${sessionStats.totalCoins.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Total XP:</span>
                            <span className="text-blue-400">{sessionStats.totalXP}</span>
                        </div>
                    </div>
                )}

                <div className="mt-3 flex gap-2">
                    <button
                        onClick={() => {
                            // Debug button - functionality removed for performance
                        }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-2 rounded transition-colors"
                    >
                        Debug
                    </button>
                    <button
                        onClick={() => {
                            if (confirm('Clear all sessions? This will reset your progress.')) {
                                sessionManager.clearAllSessions();
                                window.location.reload();
                            }
                        }}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs py-1 px-2 rounded transition-colors"
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>
    );
};
