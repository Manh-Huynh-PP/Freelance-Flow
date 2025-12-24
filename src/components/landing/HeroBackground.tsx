"use client";

import { useEffect, useState, useRef, useCallback } from "react";

// Define curves with their assigned icons - positioned to avoid center text area
const curveIcons = [
    { src: "/landing/icons/tasks.png", curveIndex: 0, position: 0.15 }, // Top-left area
    { src: "/landing/icons/kanban.png", curveIndex: 0, position: 0.85 }, // Top-right area
    { src: "/landing/icons/revenue.png", curveIndex: 1, position: 0.75 }, // Upper-right
    { src: "/landing/icons/ai.png", curveIndex: 2, position: 0.25 }, // Lower-left
    { src: "/landing/icons/analytics.png", curveIndex: 2, position: 0.9 }, // Lower-right
    { src: "/landing/icons/time.png", curveIndex: 3, position: 0.2 }, // Bottom-left
    { src: "/landing/icons/clients.png", curveIndex: 3, position: 0.65 }, // Bottom area
];

interface FloatingIconProps {
    src: string;
    x: number;
    y: number;
}

function FloatingIcon({ src, x, y }: FloatingIconProps) {
    return (
        <div
            className="absolute mix-blend-multiply pointer-events-auto cursor-pointer"
            style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
                willChange: 'left, top',
            }}
        >
            <div className="w-12 h-12 md:w-14 md:h-14 hover:scale-110 transition-transform duration-300 ease-out">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={src}
                    alt=""
                    className="w-full h-full object-contain"
                    style={{
                        filter: 'drop-shadow(0 8px 20px rgba(0, 0, 0, 0.02)) drop-shadow(0 4px 10px rgba(255, 255, 255,0.001))',
                    }}
                    loading="eager"
                />
            </div>
        </div>
    );
}

// Animated flowing lines component
function AnimatedLines({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
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

    // Calculate point on curve at given position (0-1)
    const getPointOnCurve = (curveData: { baseY: number; amplitude: number; frequency: number; phase: number }, position: number) => {
        const x = position * 100;

        // Slower animation
        const baseWave = Math.sin((x * curveData.frequency + time * 0.15 + curveData.phase) * Math.PI * 2) * curveData.amplitude;

        // Calculate distance from cursor
        const cursorX = 50 + mouseX * 50;
        const cursorY = 50 + mouseY * 50;

        const dx = x - cursorX;
        const dy = curveData.baseY - cursorY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Cursor influence
        const influenceRadius = 25;
        const influenceStrength = Math.max(0, 1 - distance / influenceRadius);
        const cursorAmplitude = influenceStrength * curveData.amplitude * 2;

        const y = curveData.baseY + baseWave + cursorAmplitude * Math.sin((x * curveData.frequency * 2) * Math.PI);

        return { x, y };
    };

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

            const midX = (current.x + next.x) / 2;
            const midY = (current.y + next.y) / 2;

            pathData += ` Q ${current.x} ${current.y}, ${midX} ${midY}`;
        }

        const lastPoint = points[points.length - 1];
        pathData += ` L ${lastPoint.x} ${lastPoint.y}`;

        return pathData;
    };

    // Curves positioned at edges to avoid center text area
    const lines = [
        { baseY: 12, amplitude: 6, frequency: 0.02, phase: 0, color: '#60a5fa', opacity: 0.15 },  // Top
        { baseY: 28, amplitude: 5, frequency: 0.025, phase: 1, color: '#a78bfa', opacity: 0.12 }, // Upper
        { baseY: 72, amplitude: 5, frequency: 0.018, phase: 2, color: '#f472b6', opacity: 0.1 },  // Lower
        { baseY: 88, amplitude: 6, frequency: 0.022, phase: 3, color: '#34d399', opacity: 0.13 }, // Bottom
    ];

    return (
        <>
            <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={{
                    transform: `translate(${mouseX * 3}px, ${mouseY * 3}px)`,
                    transition: 'transform 0.3s ease-out',
                }}
            >
                <defs>
                    {lines.map((line, i) => (
                        <linearGradient key={i} id={`lineGradient${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={line.color} stopOpacity="0" />
                            <stop offset="50%" stopColor={line.color} stopOpacity={line.opacity} />
                            <stop offset="100%" stopColor={line.color} stopOpacity="0" />
                        </linearGradient>
                    ))}
                </defs>

                {lines.map((line, i) => (
                    <path
                        key={i}
                        d={generatePath(line.baseY, line.amplitude, line.frequency, line.phase)}
                        fill="none"
                        stroke={`url(#lineGradient${i})`}
                        strokeWidth="0.3"
                        strokeLinecap="round"
                    />
                ))}
            </svg>


            {/* Icons positioned on curves - hidden on mobile for better performance and readability */}
            {curveIcons.map((iconData, index) => {
                const curveData = lines[iconData.curveIndex];
                const point = getPointOnCurve(curveData, iconData.position);
                return (
                    <div key={index} className="hidden md:block">
                        <FloatingIcon
                            src={iconData.src}
                            x={point.x}
                            y={point.y}
                        />
                    </div>
                );
            })}
        </>
    );
}

export function HeroBackground() {
    const [mounted, setMounted] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const x = (e.clientX - centerX) / (rect.width / 2);
        const y = (e.clientY - centerY) / (rect.height / 2);

        setMousePos({ x, y });
    }, []);

    useEffect(() => {
        setMounted(true);

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [handleMouseMove]);

    if (!mounted) return null;

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 overflow-hidden"
            aria-hidden="true"
        >
            {/* Animated flowing lines with icons attached */}
            <div className="absolute inset-0 z-5">
                <AnimatedLines mouseX={mousePos.x} mouseY={mousePos.y} />
            </div>

            {/* Minimal gradient overlay only at very edges */}
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 0%, transparent 85%, hsl(var(--background)) 100%)',
                }}
            />
        </div>
    );
}
