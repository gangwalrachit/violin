import { useState, useRef, useCallback, useEffect } from "react";
import ABCJS from "abcjs";

export function usePlayer() {
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [looping, setLooping] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(-1);
  const [debugLog, setDebugLog] = useState([]);
  const log = useCallback((msg) => {
    const line = `${new Date().toISOString().slice(11,19)} ${msg}`;
    console.log(line);
    setDebugLog(prev => [...prev.slice(-8), line]);
  }, []);
  const synthRef = useRef(null);
  const timingRef = useRef(null);
  const visualObjRef = useRef(null);
  const loopingRef = useRef(false);
  const playingRef = useRef(false);
  const pausedRef = useRef(false);
  const highlightedRef = useRef([]);
  const onEventRef = useRef(null);
  const noteIndexRef = useRef(-1);
  const wakeLockRef = useRef(null);

  const requestWakeLock = useCallback(async () => {
    if (!("wakeLock" in navigator)) return;
    try {
      wakeLockRef.current = await navigator.wakeLock.request("screen");
    } catch (_) {}
  }, []);

  const releaseWakeLock = useCallback(() => {
    if (wakeLockRef.current) {
      wakeLockRef.current.release();
      wakeLockRef.current = null;
    }
  }, []);

  // Re-request wake lock when page becomes visible again (screen unlock releases it)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && playingRef.current) {
        requestWakeLock();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [requestWakeLock]);

  const clearHighlights = useCallback(() => {
    highlightedRef.current.forEach((el) => {
      el.classList.remove("abcjs-highlight");
    });
    highlightedRef.current = [];
  }, []);

  const stop = useCallback(() => {
    if (timingRef.current) {
      timingRef.current.stop();
      timingRef.current = null;
    }
    if (synthRef.current && (playingRef.current || pausedRef.current)) {
      synthRef.current.stop();
    }
    synthRef.current = null;
    playingRef.current = false;
    pausedRef.current = false;
    setPlaying(false);
    setPaused(false);
    setProgress(0);
    noteIndexRef.current = -1;
    setCurrentNoteIndex(-1);
    clearHighlights();
    releaseWakeLock();
  }, [clearHighlights, releaseWakeLock]);

  const pause = useCallback(() => {
    if (synthRef.current && playingRef.current && !pausedRef.current) {
      synthRef.current.pause();
      if (timingRef.current) timingRef.current.pause();
      pausedRef.current = true;
      setPaused(true);
    }
  }, []);

  const resume = useCallback(() => {
    if (synthRef.current && pausedRef.current) {
      synthRef.current.resume();
      if (timingRef.current) timingRef.current.start();
      pausedRef.current = false;
      setPaused(false);
    }
  }, []);

  const play = useCallback(async () => {
    if (!visualObjRef.current) return;

    if (pausedRef.current) {
      resume();
      return;
    }

    if (playingRef.current) {
      pause();
      return;
    }

    log(`play() start — visualObj: ${!!visualObjRef.current}`);

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) { log("no AudioContext class"); return; }

    if (!window.abcjsAudioContext || window.abcjsAudioContext.state === "closed") {
      window.abcjsAudioContext = new AudioContextClass();
    }
    log(`ctx state before unlock: ${window.abcjsAudioContext.state}`);

    try {
      const ctx = window.abcjsAudioContext;
      if (ctx.state !== "running") {
        const buf = ctx.createBuffer(1, 1, ctx.sampleRate);
        const src = ctx.createBufferSource();
        src.buffer = buf;
        src.connect(ctx.destination);
        src.start(0);
        await ctx.resume();
      }
    } catch (e) { log(`unlock error: ${e.message}`); }
    log(`ctx state after unlock: ${window.abcjsAudioContext.state}`);

    if (!ABCJS.synth.supportsAudio()) { log("supportsAudio false"); return; }

    try {
      const synth = new ABCJS.synth.CreateSynth();
      synthRef.current = synth;

      log("calling synth.init...");
      await synth.init({ visualObj: visualObjRef.current, audioContext: window.abcjsAudioContext });
      log("synth.init done, calling prime...");
      await synth.prime();
      log(`prime done — ctx state: ${window.abcjsAudioContext.state}`);

      if (window.abcjsAudioContext.state === "suspended") {
        await window.abcjsAudioContext.resume();
        log("re-resumed after prime");
      }
      clearHighlights();
      setProgress(0);
      noteIndexRef.current = -1;
      setCurrentNoteIndex(-1);

      const timing = new ABCJS.TimingCallbacks(visualObjRef.current, {
        beatCallback: (beatNumber, totalBeats) => {
          if (totalBeats > 0) {
            setProgress(Math.min((beatNumber / totalBeats) * 100, 100));
          }
        },
        eventCallback: (event) => {
          if (!event) {
            clearHighlights();
            playingRef.current = false;
            pausedRef.current = false;
            setPlaying(false);
            setPaused(false);
            setProgress(100);
            noteIndexRef.current = -1;
            setCurrentNoteIndex(-1);
            releaseWakeLock();
            if (loopingRef.current) {
              const msGap = visualObjRef.current?.millisecondsPerMeasure?.() ?? 2000;
              setTimeout(() => {
                setProgress(0);
                play();
              }, msGap);
            } else {
              setTimeout(() => setProgress(0), 800);
            }
            return;
          }
          clearHighlights();
          if (event.elements) {
            event.elements.forEach((group) => {
              group.forEach((el) => {
                if (el) {
                  el.classList.add("abcjs-highlight");
                  highlightedRef.current.push(el);
                }
              });
            });
          }
          noteIndexRef.current++;
          setCurrentNoteIndex(noteIndexRef.current);
        },
      });

      timingRef.current = timing;
      synth.start();
      timing.start();
      playingRef.current = true;
      pausedRef.current = false;
      setPlaying(true);
      setPaused(false);
      requestWakeLock();
      log("synth.start() called — should hear audio now");
    } catch (err) {
      log(`ERROR: ${err.message}`);
      playingRef.current = false;
      setPlaying(false);
    }
  }, [stop, pause, resume, clearHighlights, requestWakeLock, releaseWakeLock, log]);

  const toggleLoop = useCallback(() => {
    setLooping((prev) => {
      loopingRef.current = !prev;
      return !prev;
    });
  }, []);

  const setVisualObj = useCallback(
    (obj) => {
      stop();
      visualObjRef.current = obj;
    },
    [stop]
  );

  return {
    playing,
    paused,
    looping,
    progress,
    currentNoteIndex,
    debugLog,
    play,
    pause,
    resume,
    stop,
    toggleLoop,
    setVisualObj,
  };
}
