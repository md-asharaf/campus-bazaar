import { MeshGradient } from "@paper-design/shaders-react";

interface ShaderBackgroundProps {
    children: React.ReactNode;
}

export default function ShaderBackground({ children }: ShaderBackgroundProps) {
    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Moving gradient backgrounds */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 animate-gradient-shift" />
            <div className="absolute inset-0 bg-gradient-to-tl from-violet-800/50 via-purple-700/30 to-blue-800/40 animate-gradient-shift-reverse" />
            
            {/* SVG Filters */}
            <svg className="absolute inset-0 w-0 h-0">
                <defs>
                    <filter
                        id="glass-effect"
                        x="-50%"
                        y="-50%"
                        width="200%"
                        height="200%"
                    >
                        <feTurbulence
                            baseFrequency="0.005"
                            numOctaves="1"
                            result="noise"
                        />
                        <feDisplacementMap
                            in="SourceGraphic"
                            in2="noise"
                            scale="0.3"
                        />
                        <feColorMatrix
                            type="matrix"
                            values="1 0 0 0 0.02
                      0 1 0 0 0.02
                      0 0 1 0 0.05
                      0 0 0 0.9 0"
                            result="tint"
                        />
                    </filter>
                    <filter
                        id="gooey-filter"
                        x="-50%"
                        y="-50%"
                        width="200%"
                        height="200%"
                    >
                        <feGaussianBlur
                            in="SourceGraphic"
                            stdDeviation="4"
                            result="blur"
                        />
                        <feColorMatrix
                            in="blur"
                            mode="matrix"
                            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                            result="gooey"
                        />
                        <feComposite
                            in="SourceGraphic"
                            in2="gooey"
                            operator="atop"
                        />
                    </filter>
                </defs>
            </svg>

            {/* Enhanced Background Shaders with movement */}
            <div className="absolute inset-0 animate-slow-spin">
                <MeshGradient
                    className="absolute inset-0 w-full h-full"
                    colors={["#1e1b4b", "#8b5cf6", "#ffffff", "#1e1b4b", "#4c1d95"]}
                    speed={0.5}
                />
            </div>
            <div className="absolute inset-0 animate-reverse-spin">
                <MeshGradient
                    className="absolute inset-0 w-full h-full opacity-60"
                    colors={["#000000", "#ffffff", "#8b5cf6", "#1e1b4b"]}
                    speed={0.3}
                />
            </div>

            {/* Multiple moving animated orbs */}
            <div className="absolute inset-0 opacity-40">
                {/* Large moving orbs */}
                <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float-1" />
                <div className="absolute w-80 h-80 bg-blue-500/25 rounded-full blur-3xl animate-float-2" />
                <div className="absolute w-64 h-64 bg-violet-400/15 rounded-full blur-2xl animate-float-3" />
                <div className="absolute w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-float-4" />
                
                {/* Medium moving orbs */}
                <div className="absolute w-48 h-48 bg-purple-300/30 rounded-full blur-2xl animate-drift-1" />
                <div className="absolute w-56 h-56 bg-blue-400/25 rounded-full blur-2xl animate-drift-2" />
                <div className="absolute w-40 h-40 bg-violet-600/20 rounded-full blur-xl animate-drift-3" />
                
                {/* Small floating particles */}
                <div className="absolute w-24 h-24 bg-white/10 rounded-full blur-lg animate-particle-1" />
                <div className="absolute w-32 h-32 bg-purple-200/20 rounded-full blur-lg animate-particle-2" />
                <div className="absolute w-20 h-20 bg-blue-200/25 rounded-full blur-md animate-particle-3" />
                <div className="absolute w-28 h-28 bg-violet-300/15 rounded-full blur-lg animate-particle-4" />
            </div>

            {/* Subtle moving lines/streaks */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-streak-1" />
                <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-streak-2" />
                <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-300 to-transparent animate-streak-3" />
            </div>

            {children}
        </div>
    );
}
