'use client'
import React, { useEffect } from "react";
import { useRef } from "react"

export interface AatrixAnimationPanelProps {
    className?: string;
    fontColor?: string;
    text?: string;
    randomPermutaion?: boolean;
    size?: number
}

export default function AatrixAnimationPanel({
    className,
    fontColor = '#A226EF',
    text = 'abcdefghijklmnopqrstuvwxyz',
    randomPermutaion,
    size = 30
}: AatrixAnimationPanelProps) {

    const alphabet = text.split('');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = React.useRef<CanvasRenderingContext2D | null>(null)
    // const ctxRef = canvasRef?.current?.getContext('2d');
    const drops: number[] = []

    useEffect(() => {

        if (!canvasRef.current) return;
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight
        ctxRef.current = canvasRef.current.getContext('2d');
        const columns = canvasRef.current.width / size;
        for (let x = 0; x < columns; x++) {
            drops[x] = 0;
        }
        setInterval(draw, 33);

    }, []);

    function draw() {
        if (!ctxRef.current || !canvasRef.current) return;
        const ctx = ctxRef.current
        ctx.fillStyle = "rgba(0,0,0,0.05)";
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.fillStyle = fontColor // "#0F0";
        ctx.font = `${size}px arial`;

        for (let i = 0; i < drops.length; i++) {
            // const text = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
            const text = randomPermutaion ?
                alphabet[Math.floor(Math.random() * alphabet.length)] :
                alphabet[(drops[i] % alphabet.length)];

            ctx.fillText(text, i * size, (drops[i] + 1) * size);

            if (drops[i] * size > canvasRef.current.height && Math.random() > 0.975)
                drops[i] = 0;
            else
                drops[i]++;
        }
    }

    return <canvas className={`w-full h-full ${className || ''}`} ref={canvasRef} />
}