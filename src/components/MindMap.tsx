"use client";

import { useEffect, useRef, useState } from "react";
import { MindMapData } from "@/lib/types";

interface MindMapProps {
  data: MindMapData;
}

const BRANCH_COLORS = [
  "#a855f7", // purple
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#06b6d4", // cyan
];

export default function MindMap({ data }: MindMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const W = 900;
  const H = 700;
  const cx = W / 2;
  const cy = H / 2;
  const innerRadius = 130;
  const outerRadius = 270;

  const branches = data.branches || [];
  const numBranches = branches.length;

  const branchAngles = branches.map((_, i) => {
    return (2 * Math.PI * i) / numBranches - Math.PI / 2;
  });

  // Mouse pan handlers
  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  };
  const onMouseUp = () => { isDragging.current = false; };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-2 justify-end">
        <button
          onClick={() => setZoom((z) => Math.min(z + 0.2, 2.5))}
          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm"
        >+</button>
        <button
          onClick={() => setZoom((z) => Math.max(z - 0.2, 0.4))}
          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm"
        >−</button>
        <button
          onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm"
        >Reset</button>
        <span className="text-slate-500 text-xs">Drag to pan</span>
      </div>

      {/* SVG Canvas */}
      <div
        className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ height: 500 }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          height="100%"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center",
            transition: isDragging.current ? "none" : "transform 0.1s ease",
            userSelect: "none",
          }}
        >
          {branches.map((branch, bi) => {
            const angle = branchAngles[bi];
            const color = BRANCH_COLORS[bi % BRANCH_COLORS.length];

            const bx = cx + Math.cos(angle) * innerRadius;
            const by = cy + Math.sin(angle) * innerRadius;
            const ex = cx + Math.cos(angle) * (outerRadius - 20);
            const ey = cy + Math.sin(angle) * (outerRadius - 20);

            const children = branch.children || [];
            const numChildren = children.length;

            return (
              <g key={bi}>
                {/* Main branch line */}
                <line
                  x1={bx} y1={by} x2={ex} y2={ey}
                  stroke={color} strokeWidth={2.5} strokeOpacity={0.7}
                />

                {/* Branch label box */}
                <g>
                  <rect
                    x={ex - 60}
                    y={ey - 14}
                    width={120}
                    height={28}
                    rx={8}
                    fill={color}
                    fillOpacity={0.15}
                    stroke={color}
                    strokeOpacity={0.5}
                    strokeWidth={1.5}
                  />
                  <text
                    x={ex}
                    y={ey + 5}
                    textAnchor="middle"
                    fill={color}
                    fontSize={11}
                    fontWeight="600"
                  >
                    {branch.label.length > 16
                      ? branch.label.slice(0, 15) + "…"
                      : branch.label}
                  </text>
                </g>

                {/* Children */}
                {children.map((child, ci) => {
                  const spread = numChildren > 1
                    ? ((ci - (numChildren - 1) / 2) * 0.38)
                    : 0;
                  const childAngle = angle + spread;
                  const childDist = outerRadius + 100;
                  const childX = cx + Math.cos(childAngle) * childDist;
                  const childY = cy + Math.sin(childAngle) * childDist;

                  return (
                    <g key={ci}>
                      <line
                        x1={ex} y1={ey}
                        x2={childX} y2={childY}
                        stroke={color} strokeWidth={1.2} strokeOpacity={0.4}
                        strokeDasharray="4 3"
                      />
                      <circle cx={childX} cy={childY} r={4} fill={color} fillOpacity={0.5} />
                      <text
                        x={childX}
                        y={childY - 10}
                        textAnchor="middle"
                        fill="#cbd5e1"
                        fontSize={10}
                      >
                        {child.label.length > 20
                          ? child.label.slice(0, 19) + "…"
                          : child.label}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* Center node */}
          <circle cx={cx} cy={cy} r={52} fill="#7c3aed" fillOpacity={0.25} />
          <circle cx={cx} cy={cy} r={52} fill="none" stroke="#a855f7" strokeWidth={2} strokeOpacity={0.6} />
          <text x={cx} y={cy - 4} textAnchor="middle" fill="white" fontSize={12} fontWeight="700">
            {data.topic.length > 18 ? data.topic.slice(0, 17) + "…" : data.topic}
          </text>
          <text x={cx} y={cy + 12} textAnchor="middle" fill="#a855f7" fontSize={9}>
            MAIN TOPIC
          </text>
        </svg>
      </div>
    </div>
  );
}
