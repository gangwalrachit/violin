import { useState, useRef, useCallback } from "react";
import ABCJS from "abcjs";

export function usePlayer() {
  const [playing, setPlaying] = useState(false);
  const [looping, setLooping] = useState(false);
  const synthRef = useRef(null);
  const timingRef = useRef(null);
  const visualObjRef = useRef(null);
  const loopingRef = useRef(false);
  const playingRef = useRef(false);
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
    if (synthRef.current && playingRef.current) {
      synthRef.current.stop();
    }
    synthRef.current = null;
    playingRef.current = false;
    setPlaying(false);
    clearHighlights();
  }, [clearHighlights]);

  const play = useCallback(async () => {
    if (!visualObjRef.current) return;
    if (playingRef.current) {
      stop();
      return;
    }

    if (!ABCJS.synth.supportsAudio()) {
      console.warn("Audio not supported");
      return;
    }

    try {
      const synth = new ABCJS.synth.CreateSynth();
      synthRef.current = synth;

      await synth.init({ visualObj: visualObjRef.current });
      await synth.prime();

      clearHighlights();

      const timing = new ABCJS.TimingCallbacks(visualObjRef.current, {
        eventCallback: (event) => {
          if (!event) {
            clearHighlights();
            playingRef.current = false;
            setPlaying(false);
            if (loopingRef.current) {
              setTimeout(() => play(), 100);
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
      setPlaying(true);
    } catch (err) {
      console.error("Playback failed:", err);
      playingRef.current = false;
      setPlaying(false);
    }
  }, [stop, clearHighlights]);

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

  return { playing, looping, play, stop, toggleLoop, setVisualObj };
}
