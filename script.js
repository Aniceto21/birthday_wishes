(()=>{
  const surpriseBtn = document.getElementById('surpriseBtn');
  const surpriseSection = document.getElementById('surpriseSection');
  const moreMemoriesSection = document.getElementById('moreMemoriesSection');
  const wishes = document.getElementById('wishes');
  const final = document.getElementById('final');
  const modal = document.getElementById('modal');
  const closeModal = document.getElementById('closeModal');
  const playMsg = document.getElementById('playMsg');
  const musicToggle = document.getElementById('musicToggle');
  const bgMusic = document.getElementById('bgMusic');
  
  // Generic slideshow function
  function initSlideshow(id) {
    const el = document.getElementById(id);
    if(!el) return;
    const imgs = Array.from(el.querySelectorAll('img'));
    if(!imgs.length) return;
    let idx = 0;
    const show = (i) => imgs.forEach((img, n) => img.classList.toggle('show', n === i));
    show(0);
    setInterval(() => {
      idx = (idx + 1) % imgs.length;
      show(idx);
    }, 4000);
  }

  initSlideshow('slideshow');
  initSlideshow('slideshow2');

  // Check if autoplay worked
  if (!bgMusic.paused) {
    musicToggle.innerText = '⏸️ Pause Music';
    musicToggle.setAttribute('aria-pressed', 'true');
  }

  // reveal sequence
  surpriseBtn.addEventListener('click', ()=>{
    surpriseSection.classList.remove('hidden');
    setTimeout(()=> wishes.classList.remove('hidden'), 700);
    setTimeout(()=> { if(moreMemoriesSection) moreMemoriesSection.classList.remove('hidden'); }, 1200);
    setTimeout(()=> final.classList.remove('hidden'), 1700);
    // confetti
    launchConfetti();
    // auto-open modal later
    setTimeout(()=>{ modal.classList.remove('hidden'); modal.setAttribute('aria-hidden','false'); }, 2000);
  });

  // modal events
  if(closeModal) closeModal.addEventListener('click', ()=>{ modal.classList.add('hidden'); modal.setAttribute('aria-hidden','true'); });
  modal.addEventListener('click', (e)=>{ if(e.target === modal){ modal.classList.add('hidden'); modal.setAttribute('aria-hidden','true'); }});

  // final message (play a short TTS or audio)
  if(playMsg) playMsg.addEventListener('click', ()=>{
    alert('Record and replace the audio source in index.html to play a personal voice message.');
  });

  // music toggling
  musicToggle.addEventListener('click', ()=>{
    // debug
    console.log('Music toggle clicked');
    console.log('Audio source:', bgMusic.currentSrc || bgMusic.src);
    console.log('Audio paused state:', bgMusic.paused);

    if(bgMusic.paused){ 
      musicToggle.innerText = '⏳ Loading...';
      
      // Ensure the audio is ready
      if(!bgMusic.src && !bgMusic.currentSrc) {
        bgMusic.src = "song.mp3";
      }
      
      const playPromise = bgMusic.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log('Playback started');
          musicToggle.innerText = '⏸️ Pause Music'; 
          musicToggle.setAttribute('aria-pressed','true'); 
        })
        .catch(err => {
          console.error("Playback failed", err);
          alert("Error playing music: " + err.message + "\n\nMake sure 'song.mp3' is in the folder!");
          musicToggle.innerText = '❌ Playback Failed';
        });
      }
    } else { 
      bgMusic.pause(); 
      console.log('Playback paused');
      musicToggle.innerText = '▶️ Play Music'; 
      musicToggle.setAttribute('aria-pressed','false'); 
    }
  });

  // lightweight confetti
  function launchConfetti(){
    const confettiLayer = document.getElementById('confetti');
    if(!confettiLayer) return;
    for(let i=0;i<120;i++){
      const el = document.createElement('div');
      el.className = 'c';
      const size = Math.random()*8+6;
      el.style.position='absolute';
      el.style.width = size+'px';
      el.style.height = size*0.6+'px';
      el.style.left = Math.random()*100+'%';
      el.style.top = '-10%';
      el.style.opacity = Math.random()*0.9+0.2;
      el.style.background = `hsl(${Math.random()*360},70%,60%)`;
      el.style.transform = `rotate(${Math.random()*360}deg)`;
      el.style.borderRadius='2px';
      el.style.pointerEvents='none';
      confettiLayer.appendChild(el);
      // animate
      const fall = el.animate([
        {transform: `translateY(0) rotate(0deg)`, opacity: el.style.opacity},
        {transform: `translateY(${window.innerHeight + 200}px) rotate(${Math.random()*720}deg)`, opacity:0.6}
      ],{duration:3000+Math.random()*2200, easing:'cubic-bezier(.24,.9,.29,1)'});
      fall.onfinish = ()=> el.remove();
    }
  }

})();