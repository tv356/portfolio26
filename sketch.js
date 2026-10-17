/* Original ink drawings and movement for Cheryl's field guide. */
(()=>{
 const ns='http://www.w3.org/2000/svg';
 const svg=(body,view='0 0 120 100')=>`<svg viewBox="${view}" fill="none" xmlns="${ns}" aria-hidden="true">${body}</svg>`;
 const path=(d,extra='')=>`<path d="${d}" ${extra}/>`;
 window.sketchBird=i=>{
 const beaks=['M83 35 114 39 83 41','M83 35 99 40 84 42','M83 36 119 31 84 40','M83 35 100 39 84 42','M83 35 97 39 84 43','M83 35 96 39 84 42'];
 const tails=['M39 62 14 84 43 72','M39 62 22 83 44 73','M39 62 17 76 44 73','M39 62 8 92 28 81 24 94 45 73','M39 62 20 82 44 73','M39 62 8 82 22 85 44 73'];
 return svg(`<g class="ink-bird">${path('M36 68 C28 48 40 40 59 38 C62 19 83 22 87 36 C91 45 80 50 77 57 C67 76 47 81 36 68 Z','fill="var(--paper,#fbf9f2)"')}${path(tails[i],'fill="var(--paper,#fbf9f2)"')}${path('M37 56 Q59 41 72 50 Q60 68 40 67 M43 58 63 52 M43 62 58 58 M46 66 54 63','class="bird-wing"')}${path(beaks[i])}${path('M57 75 54 86 48 89 M54 86 61 87 M67 71 65 84 60 87 M65 84 71 85')}<circle cx="79" cy="34" r="1.8" fill="currentColor"/>${i===0?path('M61 29 68 24 65 32 M62 36 Q74 43 81 44'):i===1?path('M75 46 Q77 62 64 68'):i===5?path('M68 30 Q72 23 80 29'):path('M63 40 72 43')}<g opacity=".4">${path('M39 70 Q51 80 69 67 M33 57 Q31 47 49 41 M64 25 Q79 20 85 32')}</g></g>`);
 };
 const tree=document.querySelector('.sketch-tree');
 const branches=['M194 458 C181 398 214 363 196 307 C175 247 208 183 198 108 M210 460 C204 398 232 352 212 302 C192 249 221 187 207 110','M201 185 C164 174 148 135 113 124 L82 120 M199 192 Q144 161 119 130 L73 126','M207 153 Q238 117 278 101 L320 92 M209 162 Q249 125 287 109 L326 96','M199 285 Q152 250 99 235 L57 228 M199 295 Q142 265 94 244 L48 236','M211 264 Q254 230 307 215 L345 205 M214 276 Q271 242 317 223 L351 209','M193 369 Q146 346 104 344 L78 340 M193 380 Q149 360 102 351 L73 345','M215 338 Q263 313 300 310 L334 301 M217 351 Q272 326 309 317 L340 307'];
 let details='';
 for(let i=0;i<24;i++){const x=85+(i*83%250),y=90+(i*59%265);details+=path(`M${x} ${y} q-9 -18 -19 -13 q2 14 19 13 m0 0 q12 -17 19 -10 q-1 13 -19 10`,'class="leaf"');}
 tree.innerHTML=svg(`<g class="tree-lines">${branches.map(d=>path(d)).join('')}${details}${path('M160 461 Q195 450 238 460 M176 469 226 467 M187 424 194 393 M206 311 201 287 M199 231 205 203','opacity=".4"')}</g>`,'0 0 400 500');
 const scene=tree.parentElement;
 scene.addEventListener('pointermove',e=>{if(matchMedia('(prefers-reduced-motion:reduce)').matches||document.body.classList.contains('still'))return;const b=scene.getBoundingClientRect();scene.style.setProperty('--lean',`${((e.clientX-b.left)/b.width-.5)*2}deg`)});
 scene.addEventListener('pointerleave',()=>scene.style.setProperty('--lean','0deg'));
 window.birdTakeoff=(perch,i)=>{
 if(matchMedia('(prefers-reduced-motion:reduce)').matches||document.body.classList.contains('still'))return;
 const flight=document.createElement('span');flight.className='sketch-flight';flight.innerHTML=window.sketchBird(i);const b=perch.getBoundingClientRect();flight.style.left=b.left+'px';flight.style.top=b.top+'px';flight.style.width=b.width+'px';document.body.append(flight);flight.addEventListener('animationend',()=>flight.remove());
 perch.classList.remove('bird-return');void perch.offsetWidth;perch.classList.add('bird-return');
 };
})();
