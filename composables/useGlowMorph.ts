export type GlowCorePos = { x: number; y: number };

export function useGlowMorph() {
  const morph = useState("glow-morph", () => 0);
  const corePos = useState<GlowCorePos>("glow-core-pos", () => ({
    x: 0,
    y: 0,
  }));
  const glowAvailable = useState("glow-available", () => false);

  const setMorph = (value: number) => {
    morph.value = Math.max(0, Math.min(1, value));
  };

  const setCorePos = (x: number, y: number) => {
    corePos.value = { x, y };
  };

  const setGlowAvailable = (available: boolean) => {
    glowAvailable.value = available;
  };

  return {
    morph,
    corePos,
    glowAvailable,
    setMorph,
    setCorePos,
    setGlowAvailable,
  };
}
