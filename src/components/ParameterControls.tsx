
import React from 'react';
import { TrackData } from '@/hooks/useSequencer';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ParameterControlsProps {
  track: TrackData;
  onUpdateParam: <K extends keyof TrackData>(param: K, value: TrackData[K]) => void;
}

const ParameterControls: React.FC<ParameterControlsProps> = ({
  track,
  onUpdateParam
}) => {
  return (
    <div className="animate-slide-up glass-panel p-2">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <div className="space-y-1">
          <label className="block text-white/80 text-xs font-medium">Sound</label>
          <select 
            value={track.sample}
            onChange={(e) => onUpdateParam('sample', e.target.value as TrackData['sample'])}
            className="w-full p-1 bg-black/50 text-white rounded-md border border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20 text-xs"
          >
            <option value="kick">Kick</option>
            <option value="snare">Snare</option>
            <option value="hihat">Hi-hat</option>
            <option value="clap">Clap</option>
            <option value="tom">Tom</option>
            <option value="rim">Rim</option>
            <option value="cowbell">Cowbell</option>
            <option value="cymbal">Cymbal</option>
          </select>
        </div>
        
        <div className="space-y-1">
          <label className="block text-white/80 text-xs font-medium">Time</label>
          <select 
            value={track.timeSignature}
            onChange={(e) => onUpdateParam('timeSignature', Number(e.target.value))}
            className="w-full p-1 bg-black/50 text-white rounded-md border border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20 text-xs"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 16].map(num => (
              <option key={num} value={num}>{num}/16</option>
            ))}
          </select>
        </div>
        
        <div className="space-y-1">
          <label className="block text-white/80 text-xs font-medium">{track.volume} dB</label>
          <input 
            type="range" 
            min="-40" 
            max="0" 
            value={track.volume}
            onChange={(e) => onUpdateParam('volume', Number(e.target.value))}
            className="w-full slider-thumb h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        
        <div className="space-y-1">
          <label className="block text-white/80 text-xs font-medium">{track.speed.toFixed(1)}x</label>
          <input 
            type="range" 
            min="0.5" 
            max="4" 
            step="0.1"
            value={track.speed}
            onChange={(e) => onUpdateParam('speed', Number(e.target.value))}
            className="w-full slider-thumb h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        
        <div className="space-y-1">
          <label className="block text-white/80 text-xs font-medium">Attack {track.attack.toFixed(2)}s</label>
          <input 
            type="range" 
            min="0.01" 
            max="1" 
            step="0.01"
            value={track.attack}
            onChange={(e) => onUpdateParam('attack', Number(e.target.value))}
            className="w-full slider-thumb h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        
        <div className="space-y-1">
          <label className="block text-white/80 text-xs font-medium">Decay {track.decay.toFixed(1)}s</label>
          <input 
            type="range" 
            min="0.1" 
            max="2" 
            step="0.1"
            value={track.decay}
            onChange={(e) => onUpdateParam('decay', Number(e.target.value))}
            className="w-full slider-thumb h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        
        <div className="flex space-x-1 items-center">
          <Button 
            onClick={() => onUpdateParam('muted', !track.muted)}
            className={cn(
              "flex-1 h-6 text-xs",
              track.muted 
                ? "bg-red-500/80 hover:bg-red-600 text-white" 
                : "bg-white/10 hover:bg-white/20 border border-white/10"
            )}
          >
            {track.muted ? 'Unmute' : 'Mute'}
          </Button>
          
          <Button 
            onClick={() => onUpdateParam('soloed', !track.soloed)}
            className={cn(
              "flex-1 h-6 text-xs",
              track.soloed 
                ? "bg-blue-500/80 hover:bg-blue-600 text-white" 
                : "bg-white/10 hover:bg-white/20 border border-white/10"
            )}
          >
            {track.soloed ? 'Unsolo' : 'Solo'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ParameterControls;
