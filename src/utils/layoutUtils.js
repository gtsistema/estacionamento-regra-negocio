/**
 * Radial mind-map layout.
 *
 * Strategy:
 *  - Level 0→1 (root → topics):   full 360°, leaf-weighted, radius 700
 *  - Level 1→2 (topics → subs):   leaf-weighted within topic's arc, radius 400
 *  - Level 2+ (subs → tasks…):    equal distribution, minimum arc enforced, radius 260/180
 *
 * "Leaf weight" allocates more arc to subtrees with more leaf descendants,
 * preventing shallow branches from crowding deeper ones.
 */
export function computeRadialLayout(nodes) {
  if (!nodes.length) return {};

  const root = nodes.find(n => !n.parentId);
  if (!root) return {};

  const positions = {};
  positions[root.id] = { x: 0, y: 0 };

  const getChildren = (pid) => nodes.filter(n => n.parentId === pid);

  // Count leaf descendants (a node with no children counts as 1)
  const _leafCache = new Map();
  function leafCount(id) {
    if (_leafCache.has(id)) return _leafCache.get(id);
    const ch = getChildren(id);
    const v = ch.length === 0 ? 1 : ch.reduce((s, c) => s + leafCount(c.id), 0);
    _leafCache.set(id, v);
    return v;
  }

  // Radius from parent at each depth level
  const DEPTH_RADII = [700, 400, 260, 185, 140];

  function layout(nodeId, startAngle, endAngle, depth) {
    const children = getChildren(nodeId);
    if (!children.length) return;

    const n        = children.length;
    const r        = DEPTH_RADII[depth] ?? 140;
    const parentPos = positions[nodeId];

    // --- Angle allocation ---
    const totalAngle = endAngle - startAngle;
    const totalLeaves = children.reduce((s, c) => s + leafCount(c.id), 0);

    // Minimum arc (px) needed per node to avoid overlap (node width ~190px)
    const minPxPerNode = 210;
    const minAngleDeg  = (minPxPerNode / (2 * Math.PI * r)) * 360;

    // Effective angle: at least enough for minimum arc spacing
    const neededAngle    = n * minAngleDeg;
    const effectiveAngle = Math.max(totalAngle, neededAngle);
    // Centre the subtree on the parent's allocated midpoint
    const mid            = (startAngle + endAngle) / 2;
    const adjStart       = mid - effectiveAngle / 2;

    let cur = adjStart;
    children.forEach((child) => {
      // Proportional share based on leaf descendants (ensures deeper branches get more space)
      const share      = leafCount(child.id) / totalLeaves;
      const childAngle = share * effectiveAngle;
      const childMid   = cur + childAngle / 2;
      const rad        = (childMid * Math.PI) / 180;

      positions[child.id] = {
        x: Math.round(parentPos.x + Math.cos(rad) * r),
        y: Math.round(parentPos.y + Math.sin(rad) * r),
      };

      // Give children 88 % of this node's arc (small gap between sibling subtrees)
      const childSpread = childAngle * 0.88;
      layout(child.id, childMid - childSpread / 2, childMid + childSpread / 2, depth + 1);
      cur += childAngle;
    });
  }

  layout(root.id, -90, 270, 0);   // full 360° starting from top (-90°)
  return positions;
}
