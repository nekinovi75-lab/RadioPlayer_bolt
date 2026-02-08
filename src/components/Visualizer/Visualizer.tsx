import React from 'react';
import './Visualizer.css';

export interface VisualizerProps {
    /** Whether the visualizer is active and animating */
    isPlaying?: boolean;
    /** Optional additional CSS classes */
    className?: string;
    /** Optional override for the bar background color/gradient */
    color?: string;
}

/**
 * Visualizer Component
 * 
 * A sleek, animated bar visualizer for audio playback.
 * Extracted and enhanced for React + TypeScript.
 */
const Visualizer: React.FC<VisualizerProps> = ({
    isPlaying = false,
    className = '',
    color
}) => {
    const bars = Array.from({ length: 5 });

    return (
        <div
            className={`audio-visualizer ${!isPlaying ? 'stopped' : ''} ${className}`}
            aria-hidden="true"
        >
            {bars.map((_, index) => (
                <div
                    key={index}
                    className="visualizer-bar"
                    style={color ? { background: color } : {}}
                />
            ))}
        </div>
    );
};

export default Visualizer;
