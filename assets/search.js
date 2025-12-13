(function(){
  // Simple client-side search index. Update this list when adding pages.
  const INDEX = [
    {title: 'AI Best Tools', url: '/', description: 'Find the best AI tools for writing, images, video and productivity.' , tags:['home']},
    {title: 'Tools', url: '/tools.html', description: 'Browse featured and categorized AI tools.', tags:['tools','list']},
    {title: 'Categories', url: '/categories.html', description: 'Find tools by category.', tags:['categories']},
    {title: 'ChatGPT', url: '/tools.html#chatgpt', description: 'General-purpose AI assistant for writing and coding.', tags:['chatgpt','assistant','writing','coding']},
    {title: 'Canva AI', url: '/tools.html#canva', description: 'Design and image generation tools.', tags:['canva','design','images']},
    {title: 'Midjourney', url: '/tools.html#midjourney', description: 'AI image generation for creative visuals.', tags:['midjourney','images','art']},
    {title: 'Claude AI', url: '/tools.html#claude', description: 'Long-form reasoning and research assistant.', tags:['claude','research']},
    {title: 'Grammarly', url: '/tools.html#grammarly', description: 'Writing enhancement and grammar checking.', tags:['writing','grammar']},
    {title: 'ElevenLabs', url: '/tools.html#elevenlabs', description: 'AI voice synthesis and dubbing.', tags:['voice','audio']},
    {title: 'Runway', url: '/tools.html#runway', description: 'AI video tools.', tags:['video','runway']},
    {title: 'Perplexity', url: '/tools.html#perplexity', description: 'AI-powered search and research assistant.', tags:['search','research']},
    {title: 'Opus Clip', url: '/tools.html#opusclip', description: 'Creates short clips from long videos.', tags:['video','clips']},
    {title: 'Pika Labs', url: '/tools.html#pika', description: 'Text-to-video AI.', tags:['video','pika']},

    // Blog posts
    {title: 'Top 10 AI Tools You Must Use in 2025', url: '/blog/top-10-ai-tools.html', description: 'Top tools for 2025 — ChatGPT, Midjourney, Claude and more.', tags:['top','2025','blog']},
    {title: 'ChatGPT Complete Guide (2025)', url: '/blog/chatgpt-guide-2025.html', description: 'Guide to using ChatGPT effectively.', tags:['chatgpt','guide','2025']},
    {title: 'Gemini Nano Banana — Quick Start', url: '/blog/gemini-nano-banana.html', description: 'Quick guide to Nano Banana Pro.', tags:['gemini','nano','guide']},
    {title: 'Top 10 Free AI Tools 2026', url: '/blog/top-10-ai-tools.html', description: 'Best free tools for productivity in 2026.', tags:['top','2026','free']},
  ];

  // DOM refs
  const input = document.getElementById('site-search');
  const btn = document.getElementById('site-search-btn');
  const box = document.getElementById('search-suggestions');

  if(!input || !box) return;

  let results = [];
  let selected = -1;

  function normalize(s){return (s||'').toLowerCase();}

  function doSearch(q){
    q = normalize(q).trim();
    if(!q){
      box.innerHTML=''; box.classList.remove('show'); return [];
    }
    const parts = q.split(/\s+/).filter(Boolean);
    results = INDEX.map(item => {
      const text = normalize(item.title+' '+item.description+' '+(item.tags||[]).join(' '));
      let score = 0;
      for(const p of parts){
        if(text.indexOf(p) !== -1) score += 10;
      }
      // boost startsWith matches
      if(normalize(item.title).startsWith(q)) score += 5;
      return {item,score};
    }).filter(r=>r.score>0).sort((a,b)=>b.score-a.score).slice(0,8).map(r=>r.item);

    renderSuggestions(results);
    return results;
  }

  function renderSuggestions(items){
    if(!items || items.length===0){ box.innerHTML=''; box.classList.remove('show'); return; }
    const ul = document.createElement('ul');
    items.forEach(it => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = it.url;
      a.textContent = it.title;
      const desc = document.createElement('div');
      desc.style.fontSize='13px'; desc.style.opacity='0.8'; desc.textContent = it.description;
      li.appendChild(a);
      li.appendChild(desc);
      ul.appendChild(li);
    });
    box.innerHTML=''; box.appendChild(ul); box.classList.add('show'); box.setAttribute('aria-hidden','false'); selected = -1;
  }

  const debounced = debounce(function(e){ doSearch(e.target.value); }, 180);

  input.addEventListener('input', debounced);

  // handle keyboard navigation
  input.addEventListener('keydown', function(e){
    if(!box.classList.contains('show')) return;
    const lis = box.querySelectorAll('li');
    if(e.key === 'ArrowDown'){
      e.preventDefault(); selected = Math.min(selected+1, lis.length-1); updateSelection(lis); }
    else if(e.key === 'ArrowUp'){
      e.preventDefault(); selected = Math.max(selected-1, 0); updateSelection(lis); }
    else if(e.key === 'Enter'){
      e.preventDefault(); if(selected>=0 && lis[selected]){ window.location = lis[selected].querySelector('a').href; } else {
        const q = input.value.trim(); const res = doSearch(q); if(res.length) window.location = res[0].url;
      }
    }
  });

  function updateSelection(lis){ lis.forEach((li,i)=> li.style.background = (i===selected)?'rgba(99,102,241,0.06)':'transparent'); if(selected>=0 && lis[selected]) lis[selected].scrollIntoView({block:'nearest'}); }

  btn.addEventListener('click', function(){ const q = input.value.trim(); if(!q) return; const res = doSearch(q); if(res.length) window.location = res[0].url; });

  // close when clicking outside
  document.addEventListener('click', function(e){ if(!box.contains(e.target) && e.target !== input && e.target !== btn){ box.classList.remove('show'); box.setAttribute('aria-hidden','true'); } });

  function debounce(fn,ms){ let t; return function(){ clearTimeout(t); t = setTimeout(()=> fn.apply(this,arguments), ms); }; }

})();
