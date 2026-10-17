(() => {
  const bird = document.querySelector('.bird');
  const hero = document.querySelector('.hero');
  const pauseButton = document.querySelector('.motion');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const skyVideo=document.querySelector('.sky-film');
  const skyJourney=document.querySelector('.sky-journey');
  const skyStops=[
    {at:0,dawn:.9,sunset:0,sepia:.38,saturation:1.16,brightness:1.02,hue:-18},
    {at:.32,dawn:0,sunset:0,sepia:0,saturation:1.12,brightness:1.08,hue:0},
    {at:.68,dawn:0,sunset:1,sepia:.65,saturation:1.45,brightness:.85,hue:-28},
    {at:1,dawn:.9,sunset:0,sepia:.38,saturation:1.16,brightness:1.02,hue:-18}
  ];
  function skyTime(){
    const travel=Math.max(1,skyJourney.offsetHeight-height);
    const progress=Math.max(0,Math.min(1,(scrollPosition-skyJourney.offsetTop)/travel));
    let index=0;while(index<skyStops.length-2&&progress>skyStops[index+1].at)index++;
    const from=skyStops[index],to=skyStops[index+1];
    let t=(progress-from.at)/(to.at-from.at);t=t*t*(3-2*t);
    for(const [key,css,unit] of [['dawn','--dawn-opacity',''],['sunset','--sunset-opacity',''],['sepia','--sky-sepia',''],['saturation','--sky-saturation',''],['brightness','--sky-brightness',''],['hue','--sky-hue','deg']]){
      hero.style.setProperty(css,(from[key]+(to[key]-from[key])*t).toFixed(3)+unit);
    }
  }
  const reveals = [...document.querySelectorAll('.opening > div, .gallery-intro, .photo, .work > div, .about > div, .footer > div')];
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }, {threshold: .12});
  reveals.forEach((element, i) => {
    element.style.setProperty('--reveal-delay', `${element.classList.contains('photo') ? i % 3 * 130 : 0}ms`);
    element.classList.add('reveal');
    observer.observe(element);
  });

  // Smooth normalized scroll through a continuous Catmull–Rom flight path.
  const route = [[.73,.24],[.86,.38],[.23,.27],[.11,.62],[.78,.22],[.87,.60],[.20,.28],[.12,.67],[.82,.34],[.75,.67],[.23,.41]];
  function curve(progress) {
    const index = Math.min(route.length - 2, Math.floor(progress));
    const t = Math.min(1, progress - index), t2 = t*t, t3 = t2*t;
    const a=route[Math.max(0,index-1)], b=route[index], c=route[index+1], d=route[Math.min(route.length-1,index+2)];
    return [0,1].map(axis => .5*((2*b[axis])+(-a[axis]+c[axis])*t+(2*a[axis]-5*b[axis]+4*c[axis]-d[axis])*t2+(-a[axis]+3*b[axis]-3*c[axis]+d[axis])*t3));
  }
  let width=innerWidth, height=innerHeight, maxScroll=1;
  let scrollTarget=scrollY, scrollPosition=scrollY;
  let frame=0, previousTime=0, flightTime=0, heading=-12;
  let previousX=null, previousY=null;
  let skyX=0,skyY=0,skyTargetX=0,skyTargetY=0;
  const paused=()=>document.body.classList.contains('still')||reducedMotion.matches;
  hero.addEventListener('pointermove',event=>{
    if(paused()||event.pointerType==='touch')return;
    const bounds=hero.getBoundingClientRect();
    skyTargetX=((event.clientX-bounds.left)/bounds.width-.5)*24;
    skyTargetY=((event.clientY-bounds.top)/bounds.height-.5)*18;
  },{passive:true});
  hero.addEventListener('pointerleave',()=>{skyTargetX=0;skyTargetY=0},{passive:true});
  function measure(){width=innerWidth;height=innerHeight;maxScroll=Math.max(1,document.documentElement.scrollHeight-height)}
  measure();
  addEventListener('resize',measure,{passive:true});
  new ResizeObserver(measure).observe(document.body);
  addEventListener('scroll',()=>{scrollTarget=scrollY},{passive:true});
  function tick(now){
    frame=0;
    if(paused()||document.hidden)return;
    const dt=Math.min(40,previousTime?now-previousTime:16.7);previousTime=now;
    // The bird holds still while its story is open or it has keyboard focus.
    const inspecting=bird.getAttribute('aria-expanded')==='true'||document.activeElement===bird;
    scrollPosition+=(scrollTarget-scrollPosition)*(1-Math.exp(-dt/180));
    skyTime();
    if(!inspecting){
      flightTime+=dt/1000;
      const p=Math.max(0,Math.min(1,scrollPosition/maxScroll));
      const point=curve(p*(route.length-1));
      const mobile=width<761;
      // A broad oval while resting at the top; quieter drifting farther down.
      const driftX=Math.sin(flightTime*.43)*Math.cos(flightTime*.17)*(p<.06?width*.075:width*.025);
      const driftY=Math.sin(flightTime*.69)*(p<.06?30:18);
      const birdWidth=mobile?100:164, birdHeight=mobile?88:144;
      let x=point[0]*(width-birdWidth)+driftX, y=point[1]*(height-birdHeight)+driftY;
      if(mobile)x=point[0]>.5?width-birdWidth-3:3;
      x=Math.max(0,Math.min(width-birdWidth,x));y=Math.max(35,Math.min(height-birdHeight-20,y));
      if(previousX!==null){
        const dx=x-previousX,dy=y-previousY;
        if(Math.hypot(dx,dy)>.08){
          let desired=Math.atan2(dy,dx)*180/Math.PI-12;
          const delta=((desired-heading+540)%360)-180;
          heading+=delta*(1-Math.exp(-dt/350));
        }
      }
      previousX=x;previousY=y;
      bird.style.transform=`translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) rotate(${heading.toFixed(2)}deg)`;
    }
    hero.style.setProperty('--sky-position',`${50+Math.min(scrollPosition/height,1)*12}%`);
    skyX+=(skyTargetX-skyX)*(1-Math.exp(-dt/500));
    skyY+=(skyTargetY-skyY)*(1-Math.exp(-dt/500));
    hero.style.setProperty('--sky-x',`${skyX.toFixed(2)}px`);
    hero.style.setProperty('--sky-y',`${(skyY+Math.min(scrollPosition/height,1)*35).toFixed(2)}px`);
    hero.style.setProperty('--glow-x',`${(78+skyX*.6).toFixed(2)}%`);
    hero.style.setProperty('--glow-y',`${(22+skyY*.8).toFixed(2)}%`);
    frame=requestAnimationFrame(tick);
  }
  function start(){if(!frame&&!paused()&&!document.hidden){previousTime=0;frame=requestAnimationFrame(tick)}}
  function sync(){
    if(paused()){
      skyVideo.pause();
      cancelAnimationFrame(frame);frame=0;
      bird.style.transform='translate(72vw,22vh) rotate(-12deg)';
      hero.style.removeProperty('--sky-position');
      reveals.forEach(element=>element.classList.add('visible'));
    }else {if(getComputedStyle(skyVideo).display!=='none')skyVideo.play().catch(()=>{});else skyVideo.pause();start();}
  }
  pauseButton.addEventListener('click',sync);
  reducedMotion.addEventListener('change',sync);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0}else start()});
  sync();
})();
