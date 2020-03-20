import { useState } from "react";

export default function useVisualMode(init) {
  const [mode, setMode] = useState(init);
  const [history, setHistory] = useState([init]);

  const transition = (newmode, replace = false) => {
    if (replace) {
      setMode(newmode);

      setHistory(prev => {
        prev.pop();
        prev.push(newmode);
        return prev;
      });
    } else {
      setMode(newmode);

      setHistory(prev => [...prev, newmode]);
    }
  };

  const back = () => {
    if (mode === init) {
      return mode;
    }
    const newhis = [...history];
    newhis.pop();
    console.log(newhis);
    setHistory(newhis);
    setMode(newhis[newhis.length - 1]);
  };

  return {
    mode,
    history,
    transition,
    back
  };
}
