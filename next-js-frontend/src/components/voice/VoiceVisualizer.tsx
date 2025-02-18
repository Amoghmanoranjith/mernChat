import { useEffect, useState } from "react";

const VoiceBars = ({ audioStream }: { audioStream: MediaStream | null }) => {
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    if (!audioStream) return;

    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = ctx.createAnalyser();
    const source = ctx.createMediaStreamSource(audioStream);
    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const updateVolume = () => {
      analyser.getByteFrequencyData(dataArray);
      const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      setVolume(avg);
      requestAnimationFrame(updateVolume);
    };

    updateVolume();
  }, [audioStream]);

  return (
    <div className="flex gap-1 h-8 items-end">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="w-2 bg-blue-500 rounded transition-all"
          style={{ height: `${Math.max(4, (volume / 255) * 32)}px` }}
        ></div>
      ))}
    </div>
  );
};

export default VoiceBars;
