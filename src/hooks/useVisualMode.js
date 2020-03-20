import { useState } from "react";

export default function useVisualMode(init) {
  const [mode, setMode] = useState(init);
  const [history, setHistory] = useState([init]);

  const transition = (newmode, replace = false) => {
    setMode(newmode);
    if (replace) {
      const newhis = [...history];
      newhis[newhis.length - 1] = newmode;
      setHistory(newhis);
    } else {
      setHistory([...history, newmode]);
    }
  };

  const back = () => {
    if (mode === init) {
      return;
    }
    const newhis = [...history];
    newhis.pop();
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
