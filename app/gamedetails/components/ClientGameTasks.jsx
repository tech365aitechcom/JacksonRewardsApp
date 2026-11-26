"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getGameTasks,
  getGameCoinBox,
  transferGameCoinBox,
} from "@/lib/api";

/**
 * Task list for client (Adjust) games.
 * The server credits milestones by itself, so this is display only: there is
 * no claim flow and nothing here calls /api/game/earn or task completion.
 */
export const ClientGameTasks = ({ gameId, onTotals }) => {
  const { token: contextToken } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coinBox, setCoinBox] = useState(null);
  const [transferring, setTransferring] = useState(false);
  const mountedRef = useRef(true);
  const inFlightRef = useRef(false);
  const onTotalsRef = useRef(onTotals);
  onTotalsRef.current = onTotals;

  const getToken = useCallback(() => {
    if (contextToken) return contextToken;
    try {
      return localStorage.getItem("authToken");
    } catch {
      return null;
    }
  }, [contextToken]);

  const load = useCallback(async () => {
    const token = getToken();
    if (!gameId || !token) {
      if (mountedRef.current) {
        setError("Couldn't load tasks. Please try again later.");
        setLoading(false);
      }
      return;
    }
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    try {
      const [tasksRes, boxRes] = await Promise.all([
        getGameTasks(gameId, token),
        getGameCoinBox(gameId, token),
      ]);
      if (!mountedRef.current) return;
      if (tasksRes?.success) {
        const list = tasksRes.data?.tasks || tasksRes.data || tasksRes.tasks || [];
        const sorted = Array.isArray(list)
          ? [...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          : [];
        setTasks(sorted);
        setError(null);
        if (onTotalsRef.current) {
          let coins = 0;
          let xp = 0;
          sorted.forEach((t) => {
            const v = Number(t.rewardValue) || 0;
            if (t.rewardType === "xp") xp += v;
            else coins += v;
          });
          onTotalsRef.current({ coins, xp });
        }
      } else {
        setError("Couldn't load tasks. Please try again later.");
      }
      setCoinBox(boxRes?.success ? boxRes.data || null : null);
    } catch {
      if (mountedRef.current) setError("Couldn't load tasks. Please try again later.");
    } finally {
      inFlightRef.current = false;
      if (mountedRef.current) setLoading(false);
    }
  }, [gameId, getToken]);

  useEffect(() => {
    mountedRef.current = true;
    load();

    const onVisible = () => {
      if (document.visibilityState === "visible") load();
    };
    document.addEventListener("visibilitychange", onVisible);

    // Capacitor app resume (returning from the game)
    let cancelled = false;
    let resumeHandle = null;
    (async () => {
      try {
        if (window.Capacitor?.isNativePlatform?.()) {
          const { App } = await import("@capacitor/app");
          const handle = await App.addListener("resume", () => load());
          if (cancelled) {
            handle.remove();
          } else {
            resumeHandle = handle;
          }
        }
      } catch {
        /* resume listener is optional */
      }
    })();

    return () => {
      cancelled = true;
      mountedRef.current = false;
      document.removeEventListener("visibilitychange", onVisible);
      if (resumeHandle) resumeHandle.remove();
    };
  }, [load]);

  const claimable =
    coinBox?.canTransfer && Number(coinBox?.coinBoxBalance) > 0
      ? Number(coinBox.coinBoxBalance)
      : 0;

  const handleTransfer = async () => {
    const token = getToken();
    if (!token || transferring) return;
    setTransferring(true);
    try {
      const res = await transferGameCoinBox(gameId, token);
      if (!res?.success) {
        alert(res?.error || "Couldn't move coins, please try again");
      }
    } catch {
      alert("Couldn't move coins, please try again");
    } finally {
      if (mountedRef.current) setTransferring(false);
      load();
    }
  };

  return (
    <div className="w-[375px] h-auto mt-3 mb-3 px-2 flex flex-col">
      <div className="flex w-[375px] h-11 items-center justify-between pt-2 pb-5 px-6">
        <div className="font-semibold text-[#f4f3fc] text-[20px]">Tasks</div>
      </div>

      {claimable > 0 && (
        <div className="px-5 mb-3">
          <button
            onClick={handleTransfer}
            disabled={transferring}
            className="w-full rounded-[10px] bg-[#dcc322] px-4 py-3 text-[14px] font-semibold text-black disabled:opacity-60"
          >
            {transferring
              ? "Moving..."
              : `Move ${claimable} coins to wallet`}
          </button>
        </div>
      )}

      <div className="px-5 space-y-3">
        {loading && (
          <div className="text-[14px] text-gray-300">Loading tasks...</div>
        )}
        {!loading && error && (
          <div className="text-[14px] text-gray-300">{error}</div>
        )}
        {!loading && !error && tasks.length === 0 && (
          <div className="text-[14px] text-gray-300">No tasks yet.</div>
        )}
        {tasks.map((task, index) => {
          const done = task.isCompleted === true;
          const locked = !done && task.isUnlocked === false;
          return (
            <div
              key={task._id || index}
              className="flex items-center justify-between rounded-[10px] border border-solid border-[#363636] px-4 py-3"
            >
              <div className="flex flex-col pr-3">
                <span className="text-[14px] font-semibold text-white">
                  {task.name || `Task ${task.taskNumber ?? index + 1}`}
                </span>
                <span className="text-[12px] text-gray-300">
                  {task.rewardValue ?? 0} {task.rewardType === "xp" ? "XP" : "coins"}
                </span>
              </div>
              <span
                className={`text-[12px] font-semibold ${
                  done
                    ? "text-green-400"
                    : locked
                      ? "text-gray-400"
                      : "text-[#dcc322]"
                }`}
              >
                {done ? "✓ Completed" : locked ? "🔒 Locked" : "Open"}
              </span>
            </div>
          );
        })}
        <p className="pt-1 text-[12px] text-gray-400">
          Rewards are added automatically after you reach each milestone in the
          game. It can take a few minutes.
        </p>
      </div>
    </div>
  );
};
