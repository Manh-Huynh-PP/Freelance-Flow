"use client";

import { useState, useEffect } from "react";

interface AnimatedLinesBackgroundProps {
    mouseX: number;
    mouseY: number;
}

export function AnimatedLinesBackground({ mouseX, mouseY }: AnimatedLinesBackgroundProps) {
    const [time, setTime] = useState(0);

    useEffect(() => {
        let animationFrame: number;
        let startTime = Date.now();

        const animate = () => {
            setTime((Date.now() - startTime) / 1000);
            animationFrame = requestAnimationFrame(animate);
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, []);

    // Generate smooth wavy path
    const generatePath = (baseY: number, amplitude: number, frequency: number, phase: number) => {
        const segments = 100;
        const points: Array<{ x: number; y: number }> = [];

        for (let i = 0; i <= segments; i++) {
            const x = (i / segments) * 100;

            const baseWave = Math.sin((x * frequency + time * 0.15 + phase) * Math.PI * 2) * amplitude;

            const cursorX = 50 + mouseX * 50;
            const cursorY = 50 + mouseY * 50;

            const dx = x - cursorX;
            const dy = baseY - cursorY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            const influenceRadius = 25;
            const influenceStrength = Math.max(0, 1 - distance / influenceRadius);
            const cursorAmplitude = influenceStrength * amplitude * 2;

            const y = baseY + baseWave + cursorAmplitude * Math.sin((x * frequency * 2) * Math.PI);

            points.push({ x, y });
        }

        let pathData = `M ${points[0].x} ${points[0].y}`;

        for (let i = 0; i < points.length - 1; i++) {
            const current = points[i];
            const next = points[i + 1];
            const controlX = (current.x + next.x) / 2;
            const controlY = (current.y + next.y) / 2;
            pathData += ` Q ${current.x} ${current.y}, ${controlX} ${controlY}`;
        }
        pathData += ` L ${points[points.length - 1].x} ${points[points.length - 1].y}`;

        return pathData;
    };

    const lines = [
        { baseY: 65, amplitude: 5, frequency: 0.018, phase: 2 },
        { baseY: 90, amplitude: 6, frequency: 0.022, phase: 3 },
    ];

    const gradients = [
        { id: 'gradient3', from: 'hsl(var(--primary) / 0.7)', to: 'hsl(var(--primary) / 0.25)' },
        { id: 'gradient4', from: 'hsl(var(--primary) / 0.9)', to: 'hsl(var(--primary) / 0.35)' },
    ];

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full"
            >
                <defs>
                    {gradients.map((gradient) => (
                        <linearGradient key={gradient.id} id={gradient.id} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={gradient.from} />
                            <stop offset="100%" stopColor={gradient.to} />
                        </linearGradient>
                    ))}
                </defs>

                {lines.map((line, index) => (
                    <path
                        key={index}
                        d={generatePath(line.baseY, line.amplitude, line.frequency, line.phase)}
                        fill="none"
                        stroke={`url(#${gradients[index].id})`}
                        strokeWidth="0.2"
                        opacity="0.4"
                    />
                ))}
            </svg>

            {/* Gradient overlay */}
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 0%, transparent 85%, hsl(var(--background)) 100%)',
                }}
            />
        </div>
    );
}
