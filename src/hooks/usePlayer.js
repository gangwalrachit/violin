import { useState, useRef, useCallback } from "react";
import ABCJS from "abcjs";

export function usePlayer() {
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [looping, setLooping] = useState(false);
  const [progress, setProgress] = useState(0);
  const synthRef = useRef(null);
  const timingRef = useRef(null);
  const visualObjRef = useRef(null);
  const loopingRef = useRef(false);
  const playingRef = useRef(false);
  const pausedRef = useRef(false);
  const highlightedRef = useRef([]);

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
    clearHighlights();
  }, [clearHighlights]);

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

    if (!ABCJS.synth.supportsAudio()) return;

    try {
      const synth = new ABCJS.synth.CreateSynth();
      synthRef.current = synth;

      await synth.init({ visualObj: visualObjRef.current });
      await synth.prime();
      clearHighlights();
      setProgress(0);

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
            if (loopingRef.current) {
              setTimeout(() => {
                setProgress(0);
                play();
              }, 100);
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
        },
      });

      timingRef.current = timing;
      synth.start();
      timing.start();
      playingRef.current = true;
      pausedRef.current = false;
      setPlaying(true);
      setPaused(false);
    } catch (err) {
      console.error("Playback failed:", err);
      playingRef.current = false;
      setPlaying(false);
    }
  }, [stop, pause, resume, clearHighlights]);

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
    play,
    pause,
    resume,
    stop,
    toggleLoop,
    setVisualObj,
  };
}
