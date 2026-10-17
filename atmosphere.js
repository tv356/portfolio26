(()=>{
 const sky=document.createElement('div');sky.className='living-sky';sky.setAttribute('aria-hidden','true');sky.innerHTML='<div class="sky-cloudscape"></div><div class="sky-paper-grid"></div><div class="sky-flock"></div>';document.body.prepend(sky);
 const flock=sky.querySelector('.sky-flock'),reduced=matchMedia('(prefers-reduced-motion:reduce)');let width=innerWidth,height=innerHeight,frame=0,last=0,time=0,dx=0,dy=0,px=0,py=0;const pointer={x:-999,y:-999};
 let seed=19;const random=()=>{seed=seed*16807%2147483647;return(seed-1)/2147483646};
 const birds=Array.from({length:innerWidth<700?16:27},(_,i)=>{const el=document.createElementNS('http://www.w3.org/2000/svg','svg');el.setAttribute('viewBox','0 0 24 24');el.innerHTML='<path class="wing-left" d="M12 13 Q8 6 2 9"/><path class="wing-right" d="M12 13 Q17 6 22 9"/>';const depth=.3+random()*.7;el.style.setProperty('--size',`${9+depth*16}px`);el.style.setProperty('--flap',`${.4+random()*.65}s`);el.style.setProperty('--bird-color',i%3?'#ffffff':'#385d79');el.style.opacity=String(.24+depth*.42);flock.append(el);return{el,x:random()*width,y:random()*height,depth,phase:random()*6.28,speed:9+random()*17,vx:0,vy:0}});
 const paused=()=>reduced.matches||document.body.classList.contains('still');
 function place(b){b.el.style.transform=`translate3d(${b.x.toFixed(1)}px,${b.y.toFixed(1)}px,0) rotate(${(Math.sin(time*.2+b.phase)*18).toFixed(1)}deg)`}
 birds.forEach(place);
 function tick(now){frame=0;if(document.hidden||paused())return;const dt=Math.min(.04,last?(now-last)/1000:.016);last=now;time+=dt;
 dx+=(px-dx)*dt*.6;dy+=(py-dy)*dt*.6;sky.style.setProperty('--sky-drift-x',`${dx+Math.sin(time*.06)*22}px`);sky.style.setProperty('--sky-drift-y',`${dy+Math.cos(time*.05)*15}px`);
 for(const b of birds){const awayX=b.x-pointer.x,awayY=b.y-pointer.y,distance=Math.hypot(awayX,awayY);if(distance<110&&distance>1){b.vx+=awayX/distance*dt*95;b.vy+=awayY/distance*dt*95}b.vx*=.97;b.vy*=.97;b.x+=(b.speed*b.depth+b.vx)*dt;b.y+=(Math.sin(time*.65+b.phase)*8+b.vy)*dt;if(b.x>width+40)b.x=-40;if(b.x<-50)b.x=width+20;if(b.y>height+40)b.y=-25;if(b.y<-40)b.y=height+20;place(b)}frame=requestAnimationFrame(tick)}
 function sync(){cancelAnimationFrame(frame);frame=0;last=0;if(!paused()&&!document.hidden)frame=requestAnimationFrame(tick)}
 addEventListener('pointermove',e=>{pointer.x=e.clientX;pointer.y=e.clientY;px=(e.clientX/width-.5)*20;py=(e.clientY/height-.5)*16},{passive:true});document.addEventListener('pointerleave',()=>{pointer.x=-999;pointer.y=-999;px=py=0});
 addEventListener('resize',()=>{const oldW=width,oldH=height;width=innerWidth;height=innerHeight;birds.forEach(b=>{b.x=b.x/oldW*width;b.y=b.y/oldH*height;place(b)})},{passive:true});
 new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});reduced.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);sync();
})();
