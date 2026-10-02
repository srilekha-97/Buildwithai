import { useMemo, useRef, useState } from "react";
import { Focus, Minus, Plus, Search } from "lucide-react";
import type { MindMapNode } from "@/lib/echo/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Pos = { x: number; y: number };

/**
 * Interactive concept graph. Radial SVG hierarchy with zoom, pan, collapsible
 * branches, search highlighting and a detail panel — dependency-free so it stays
 * fast and keyboard accessible.
 */
export function MindMap({ nodes }: { nodes: MindMapNode[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<Pos>({ x: 0, y: 0 });
  const [query, setQuery] = useState("");
  const drag = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);

  const root = nodes.find((n) => n.parent === null);
  const branches = useMemo(() => nodes.filter((n) => n.kind === "branch"), [nodes]);

  const width = 980;
  const height = 620;

  const { positions, visible } = useMemo(() => {
    const positions = new Map<string, Pos>();
    const visible: MindMapNode[] = [];
    if (!root) return { positions, visible };

    const cx = width / 2;
    const cy = height / 2;
    const radius = branches.length > 5 ? 200 : 175;

    positions.set(root.id, { x: cx, y: cy });
    visible.push(root);

    branches.forEach((branch, i) => {
      const angle = (i / Math.max(1, branches.length)) * Math.PI * 2 - Math.PI / 2;
      positions.set(branch.id, { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius });
      visible.push(branch);
      if (collapsed.has(branch.id)) return;
      const leaves = nodes.filter((n) => n.parent === branch.id);
      leaves.forEach((leaf, j) => {
        const spread = Math.min(0.46, 1.6 / Math.max(1, leaves.length)) + 0.16;
        const leafAngle = angle + (j - (leaves.length - 1) / 2) * spread;
        positions.set(leaf.id, {
          x: cx + Math.cos(leafAngle) * (radius + 135),
          y: cy + Math.sin(leafAngle) * (radius + 135),
        });
        visible.push(leaf);
      });
    });
    return { positions, visible };
  }, [nodes, root, branches, collapsed]);

  if (!root) return null;

  const matches = (node: MindMapNode) =>
    query.trim().length > 1 && node.label.toLowerCase().includes(query.trim().toLowerCase());

  const selectedNode = nodes.find((n) => n.id === selected) ?? null;
  const selectedParent = selectedNode?.parent ? nodes.find((n) => n.id === selectedNode.parent) : null;
  const childCount = (id: string) => nodes.filter((n) => n.parent === id).length;

  const isRelated = (node: MindMapNode) =>
    !!selected &&
    (node.id === selected ||
      node.parent === selected ||
      node.id === selectedNode?.parent ||
      (selectedNode?.parent && node.parent === selectedNode.parent));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute top-2.5 left-3 size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a concept or term…"
            className="w-56 rounded-full border bg-background py-2 pr-3 pl-9 text-sm"
          />
        </div>
        <Button variant="outline" size="sm" onClick={() => setZoom((z) => Math.min(2, +(z + 0.2).toFixed(2)))}>
          <Plus className="size-4" /> Zoom in
        </Button>
        <Button variant="outline" size="sm" onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.2).toFixed(2)))}>
          <Minus className="size-4" /> Zoom out
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
            setSelected(null);
          }}
        >
          <Focus className="size-4" /> Reset view
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            setCollapsed((prev) => (prev.size ? new Set() : new Set(branches.map((b) => b.id))))
          }
        >
          {collapsed.size ? "Expand all" : "Collapse all"}
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-card">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full cursor-grab touch-none active:cursor-grabbing"
          role="img"
          aria-label="Concept mind map"
          onPointerDown={(e) => {
            drag.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
            (e.target as Element).setPointerCapture?.(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (!drag.current) return;
            setPan({
              x: drag.current.panX + (e.clientX - drag.current.x),
              y: drag.current.panY + (e.clientY - drag.current.y),
            });
          }}
          onPointerUp={() => (drag.current = null)}
          onPointerLeave={() => (drag.current = null)}
        >
          <g transform={`translate(${pan.x} ${pan.y}) scale(${zoom}) translate(${(width * (1 - zoom)) / (2 * zoom)} ${(height * (1 - zoom)) / (2 * zoom)})`}>
            {visible
              .filter((n) => n.parent)
              .map((node) => {
                const from = positions.get(node.parent!);
                const to = positions.get(node.id);
                if (!from || !to) return null;
                const active = selected === node.id || selected === node.parent;
                const mid = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
                return (
                  <path
                    key={`edge-${node.id}`}
                    d={`M ${from.x} ${from.y} Q ${mid.x} ${mid.y} ${to.x} ${to.y}`}
                    fill="none"
                    stroke={active ? "var(--color-primary)" : "var(--color-border)"}
                    strokeWidth={active ? 2.6 : 1.4}
                    opacity={selected && !active ? 0.35 : 1}
                  />
                );
              })}

            {visible.map((node) => {
              const pos = positions.get(node.id);
              if (!pos) return null;
              const isRoot = node.kind === "root";
              const isBranch = node.kind === "branch";
              const label =
                node.label.length > (isRoot ? 30 : isBranch ? 24 : 18)
                  ? `${node.label.slice(0, isRoot ? 29 : isBranch ? 23 : 17)}…`
                  : node.label;
              const w = Math.max(isRoot ? 200 : isBranch ? 150 : 110, label.length * (isRoot ? 9.5 : 7.6) + 30);
              const h = isRoot ? 56 : isBranch ? 44 : 34;
              const active = selected === node.id;
              const hit = matches(node);
              const dim = (selected && !isRelated(node)) || (query.trim().length > 1 && !hit);
              return (
                <g
                  key={node.id}
                  tabIndex={0}
                  role="button"
                  aria-label={node.label}
                  onClick={() => setSelected(active ? null : node.id)}
                  onDoubleClick={() =>
                    isBranch &&
                    setCollapsed((prev) => {
                      const next = new Set(prev);
                      next.has(node.id) ? next.delete(node.id) : next.add(node.id);
                      return next;
                    })
                  }
                  onKeyDown={(e) => e.key === "Enter" && setSelected(active ? null : node.id)}
                  className="cursor-pointer outline-none"
                  opacity={dim ? 0.3 : 1}
                >
                  <rect
                    x={pos.x - w / 2}
                    y={pos.y - h / 2}
                    width={w}
                    height={h}
                    rx={h / 2}
                    fill={isRoot ? "var(--color-primary)" : isBranch ? "var(--color-accent)" : "var(--color-muted)"}
                    stroke={active || hit ? "var(--color-primary)" : "transparent"}
                    strokeWidth={3}
                  />
                  <text
                    x={pos.x}
                    y={pos.y + 5}
                    textAnchor="middle"
                    fontSize={isRoot ? 16 : isBranch ? 13 : 11.5}
                    fontWeight={isRoot ? 700 : isBranch ? 600 : 500}
                    fill={
                      isRoot
                        ? "var(--color-primary-foreground)"
                        : isBranch
                          ? "var(--color-accent-foreground)"
                          : "var(--color-muted-foreground)"
                    }
                  >
                    {label}
                  </text>
                  {isBranch && childCount(node.id) > 0 && (
                    <g>
                      <circle cx={pos.x + w / 2 - 4} cy={pos.y - h / 2 + 4} r={9} fill="var(--color-primary)" />
                      <text
                        x={pos.x + w / 2 - 4}
                        y={pos.y - h / 2 + 8}
                        textAnchor="middle"
                        fontSize={10}
                        fontWeight={700}
                        fill="var(--color-primary-foreground)"
                      >
                        {collapsed.has(node.id) ? childCount(node.id) : "−"}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="rounded-2xl border bg-card p-4">
          {selectedNode ? (
            <>
              <p className="text-xs tracking-widest text-muted-foreground uppercase">
                {selectedNode.kind === "root" ? "Chapter" : selectedNode.kind === "branch" ? "Main idea" : "Key term"}
                {selectedParent ? ` · part of ${selectedParent.label}` : ""}
              </p>
              <h3 className="mt-1 text-lg font-semibold">{selectedNode.label}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {selectedNode.detail ??
                  (childCount(selectedNode.id)
                    ? `Connects to ${childCount(selectedNode.id)} linked idea${childCount(selectedNode.id) > 1 ? "s" : ""}.`
                    : "Tap a connected node to keep tracing the chapter.")}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Tap any node to see what it means and how it links up. Double-tap a main idea to fold or unfold its
              terms. Drag to move the map, and use zoom for a closer look.
            </p>
          )}
        </div>
        <div className={cn("flex flex-wrap items-center gap-3 rounded-2xl border bg-card p-4 text-xs")}>
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded-full bg-primary" /> Chapter
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded-full bg-accent" /> Main idea
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded-full bg-muted" /> Key term
          </span>
        </div>
      </div>
    </div>
  );
}
