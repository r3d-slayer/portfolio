(() => {
  const pointer = matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  const dot=document.createElement('span');
  dot.className='custom-cursor-dot';
  cursor.append(dot);
  const topLayer = typeof cursor.showPopover === 'function';
  if (topLayer) cursor.setAttribute('popover', 'manual');
  document.body.append(cursor);
  let visible = false;
  let frame = 0, x = 0, y = 0, targetX = 0, targetY = 0, velocityX = 0, velocityY = 0, lastTime = 0;
  let anchorX = 0, anchorY = 0, scrollForce = 0, lastScrollY = window.scrollY;
  let dotX=0,dotY=0,dotVelocityX=0,dotVelocityY=0;
  function paint() {
    cursor.style.left = `${x}px`; cursor.style.top = `${y}px`;
    dot.style.transform=`translate(-50%, -50%) translate(${dotX}px, ${dotY}px)`;
  }
  function animate(time) {
    frame = 0;
    const step = Math.min((time - (lastTime || time - 16.67)) / 16.67, 2);
    lastTime = time;
    const damping = Math.pow(.72, step);
    scrollForce *= Math.pow(.9, step);
    targetX = anchorX; targetY = anchorY + scrollForce;
    velocityX = (velocityX + (targetX - x) * .18 * step) * damping;
    velocityY = (velocityY + (targetY - y) * .18 * step) * damping;
    x += velocityX * step; y += velocityY * step;
    const dotTargetX=Math.max(-7,Math.min(7,-velocityX*.55));
    const dotTargetY=Math.max(-7,Math.min(7,scrollForce*.45-velocityY*.55));
    dotVelocityX=(dotVelocityX+(dotTargetX-dotX)*.2*step)*Math.pow(.7,step);
    dotVelocityY=(dotVelocityY+(dotTargetY-dotY)*.2*step)*Math.pow(.7,step);
    dotX=Math.max(-8,Math.min(8,dotX+dotVelocityX*step));
    dotY=Math.max(-8,Math.min(8,dotY+dotVelocityY*step)); paint();
    if (visible && Math.abs(targetX-x)+Math.abs(targetY-y)+Math.abs(velocityX)+Math.abs(velocityY)+Math.abs(scrollForce)+Math.abs(dotX)+Math.abs(dotY)+Math.abs(dotVelocityX)+Math.abs(dotVelocityY)>.08) frame=requestAnimationFrame(animate);
    else { x=targetX; y=targetY; dotX=0; dotY=0; paint(); lastTime=0; }
  }
  function hide() {
    visible = false;
    cancelAnimationFrame(frame); frame=0; lastTime=0; velocityX=0; velocityY=0; scrollForce=0;
    dotX=0;dotY=0;dotVelocityX=0;dotVelocityY=0;
    document.documentElement.classList.remove('custom-cursor-active');
    cursor.classList.remove('is-visible');
    if (topLayer && cursor.matches(':popover-open')) cursor.hidePopover();
  }
  document.addEventListener('pointermove', event => {
    if (!pointer.matches || event.pointerType !== 'mouse') { hide(); return; }
    targetX=event.clientX; targetY=event.clientY;
    if (!reducedMotion.matches) {
      const element=document.elementFromPoint(event.clientX,event.clientY)?.closest('a, button, summary');
      if (element && !element.disabled) {
        const bounds=element.getBoundingClientRect();
        // A bounded attraction keeps the cursor close to the actual pointer.
        targetX+=Math.max(-12,Math.min(12,(bounds.left+bounds.width/2-event.clientX)*.22));
        targetY+=Math.max(-12,Math.min(12,(bounds.top+bounds.height/2-event.clientY)*.22));
      }
    }
    anchorX=targetX; anchorY=targetY;
    if (!visible || reducedMotion.matches) { x=targetX; y=targetY; velocityX=0; velocityY=0; dotX=0;dotY=0;dotVelocityX=0;dotVelocityY=0;paint(); }
    if (!visible) {
      if (topLayer) cursor.showPopover();
      cursor.classList.add('is-visible');
      document.documentElement.classList.add('custom-cursor-active');
      visible = true;
    }
    if (!reducedMotion.matches && !frame) frame=requestAnimationFrame(animate);
  }, {passive:true});
  document.documentElement.addEventListener('pointerleave', hide);
  document.addEventListener('pointerdown', event => { if (event.pointerType !== 'mouse') hide(); }, {passive:true});
  window.addEventListener('blur', hide);
  document.addEventListener('visibilitychange', () => { if (document.hidden) hide(); });
  pointer.addEventListener('change', hide);
  reducedMotion.addEventListener('change', hide);
  window.addEventListener('scroll', () => {
    const delta = window.scrollY - lastScrollY;
    lastScrollY = window.scrollY;
    if (!visible || !pointer.matches || reducedMotion.matches) return;
    scrollForce = Math.max(-32, Math.min(32, scrollForce + delta * .22));
    velocityY += Math.max(-6, Math.min(6, delta * .04));
    if (!frame) frame=requestAnimationFrame(animate);
  }, {passive:true});
  // Keep the cursor above dialogs in browsers supporting the top layer.
  document.addEventListener('toggle', event => {
    if (topLayer && visible && event.target instanceof HTMLDialogElement && event.target.open) {
      cursor.hidePopover(); cursor.showPopover();
    }
  }, true);
})();
