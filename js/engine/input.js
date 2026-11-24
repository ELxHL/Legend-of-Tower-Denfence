// ============================================================
// INPUT - Hop nhat chuot + cam ung (Pointer Events).
// Goi onTap khi la mot cai cham ngan (tap), tranh nham voi keo/scroll.
// ============================================================
export function attachTapInput(canvas, handlers) {
  const { onTap, onMove } = handlers || {};
  let downX = 0, downY = 0, downT = 0, active = false;

  function pt(e) {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top, clientX: e.clientX, clientY: e.clientY };
  }

  const down = (e) => {
    const p = pt(e);
    active = true;
    downX = p.x; downY = p.y;
    downT = performance.now();
    if (e.pointerType === 'touch') e.preventDefault();
  };

  const up = (e) => {
    if (!active) return;
    active = false;
    const p = pt(e);
    const moved = Math.hypot(p.x - downX, p.y - downY);
    const dt = performance.now() - downT;
    if (moved < 14 && dt < 500 && onTap) onTap(p, e);
  };

  const cancel = () => { active = false; };
  const move = (e) => { if (onMove) onMove(pt(e), e); };

  canvas.addEventListener('pointerdown', down, { passive: false });
  canvas.addEventListener('pointerup', up, { passive: false });
  canvas.addEventListener('pointercancel', cancel, { passive: true });
  if (onMove) canvas.addEventListener('pointermove', move, { passive: true });

  // Chan hanh vi mac dinh cua trinh duyet tren mobile (zoom bang 2 ngon, scroll)
  const block = (e) => e.preventDefault();
  canvas.addEventListener('touchstart', block, { passive: false });
  canvas.addEventListener('touchmove', block, { passive: false });

  return () => {
    canvas.removeEventListener('pointerdown', down);
    canvas.removeEventListener('pointerup', up);
    canvas.removeEventListener('pointercancel', cancel);
    canvas.removeEventListener('pointermove', move);
    canvas.removeEventListener('touchstart', block);
    canvas.removeEventListener('touchmove', block);
  };
}
