// Free-standing dancing mascot used on the rooftop celebration. The castle
// entity has its own peek-mode mascot inline; this one just bobs and waves
// in place forever.

export function makeMascot(x, y, kind = 'burger') {
  const m = add([
    sprite(`mascot-${kind}`, { width: 36, height: 44, frame: 0 }),
    pos(x, y),
    anchor('bot'),
    { _t: Math.random() * 2 },
  ])
  m.onUpdate(() => {
    m._t += dt() * 6
    // Cycle through frames 0,1,2,3 to give a little dance.
    m.frame = Math.floor(m._t) % 4
    m.pos.y = y + Math.sin(time() * 4) * 2
  })
  return m
}
