/* All Media & Marketing — site interactions */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Mobile menu ---------------- */
  var menuBtn = $('button[aria-label="Open menu"]');
  if (menuBtn) {
    var panel = document.createElement('div');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-label', 'Menu');
    panel.style.cssText = 'position:fixed;inset:0;z-index:100;background:#121212;display:none;flex-direction:column;padding:16px 20px 32px;overflow:auto;font-family:\'Inter Tight\',system-ui,sans-serif;-webkit-font-smoothing:antialiased';
    var links = [['Work', '#work'], ['Services', '#services'], ['Process', '#process'], ['Packages', '#pricing'], ['About', '#about'], ['Contact', '#contact']];
    var html = '<div style="display:flex;justify-content:space-between;align-items:center;max-width:1240px;width:100%;margin:0 auto">' +
      '<span style="font-weight:700;font-size:30px;letter-spacing:-0.045em;color:#F2F2F2">allmedia<span style="font-family:\'Instrument Serif\',serif;font-style:italic;font-weight:400;color:#FF3B3F;font-size:33px">in</span></span>' +
      '<button type="button" aria-label="Close menu" class="menu-close" style="width:48px;height:48px;border-radius:14px;border:none;background:#262626;color:#F2F2F2;display:flex;align-items:center;justify-content:center;cursor:pointer">' +
      '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15"></path></svg></button></div>' +
      '<nav aria-label="Menu" style="display:flex;flex-direction:column;gap:4px;max-width:1240px;width:100%;margin:48px auto 0">';
    links.forEach(function (l) {
      html += '<a href="' + l[1] + '" style="font-size:clamp(40px,9vw,72px);font-weight:700;letter-spacing:-0.05em;color:#F2F2F2;text-decoration:none;line-height:1.1">' + l[0] + '</a>';
    });
    html += '</nav><div style="max-width:1240px;width:100%;margin:40px auto 0;display:flex;gap:6px">' +
      '<a href="https://wa.me/918368189888" style="height:56px;padding:0 28px;border-radius:28px;background:#E11D21;color:#fff;font-size:17px;font-weight:600;text-decoration:none;display:inline-flex;align-items:center">Get a quote</a></div>';
    panel.innerHTML = html;
    document.body.appendChild(panel);
    var openMenu = function () { panel.style.display = 'flex'; document.body.style.overflow = 'hidden'; $('.menu-close', panel).focus(); };
    var closeMenu = function () { panel.style.display = 'none'; document.body.style.overflow = ''; menuBtn.focus(); };
    menuBtn.addEventListener('click', openMenu);
    $('.menu-close', panel).addEventListener('click', closeMenu);
    $$('nav a', panel).forEach(function (a) { a.addEventListener('click', function () { panel.style.display = 'none'; document.body.style.overflow = ''; }); });
    panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }

  /* ---------------- YouTube lightbox ---------------- */
  function ytId(url) {
    var m = url.match(/(?:youtu\.be\/|shorts\/|v=|embed\/)([\w-]{11})/);
    return m ? m[1] : null;
  }
  var lb = document.createElement('div');
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Video');
  lb.style.cssText = 'position:fixed;inset:0;z-index:120;background:rgba(10,10,10,0.92);display:none;align-items:center;justify-content:center;padding:20px';
  lb.innerHTML = '<button type="button" aria-label="Close video" class="lb-close" style="position:absolute;top:16px;right:16px;width:48px;height:48px;border-radius:14px;border:none;background:#262626;color:#F2F2F2;display:flex;align-items:center;justify-content:center;cursor:pointer"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15"></path></svg></button><div class="lb-frame" style="border-radius:20px;overflow:hidden;background:#000;box-shadow:0 30px 80px rgba(0,0,0,0.6)"></div>';
  document.body.appendChild(lb);
  var lbFrame = $('.lb-frame', lb), lastFocus = null;
  function closeLb() { lb.style.display = 'none'; lbFrame.innerHTML = ''; document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); }
  $('.lb-close', lb).addEventListener('click', closeLb);
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && lb.style.display === 'flex') closeLb(); });
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="youtu"]');
    if (!a) return;
    var id = ytId(a.href);
    if (!id) return;
    e.preventDefault();
    lastFocus = a;
    var vertical = /shorts\//.test(a.href);
    lbFrame.style.cssText = 'border-radius:20px;overflow:hidden;background:#000;box-shadow:0 30px 80px rgba(0,0,0,0.6);' +
      (vertical ? 'height:min(86vh,820px);aspect-ratio:9/16;max-width:100%' : 'width:min(100%,1100px);aspect-ratio:16/9');
    lbFrame.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&playsinline=1&rel=0" title="Video player" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen style="width:100%;height:100%;border:0;display:block"></iframe>';
    lb.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    $('.lb-close', lb).focus();
  });

  /* ---------------- YouTube thumbnails on video cards ---------------- */
  function loadThumb(el, id, vertical) {
    var names = vertical ? ['oardefault', 'hq720', 'hqdefault'] : ['maxresdefault', 'hq720', 'hqdefault'];
    var i = 0;
    var img = new Image();
    img.alt = '';
    img.decoding = 'async';
    img.loading = 'lazy';
    img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;opacity:0;transition:opacity .5s ease';
    img.onload = function () {
      if (img.naturalWidth <= 120 && i < names.length - 1) { i++; img.src = 'https://i.ytimg.com/vi/' + id + '/' + names[i] + '.jpg'; return; }
      img.style.opacity = '1';
    };
    img.onerror = function () {
      if (i < names.length - 1) { i++; img.src = 'https://i.ytimg.com/vi/' + id + '/' + names[i] + '.jpg'; }
    };
    var shade = document.createElement('div');
    shade.style.cssText = 'position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.15) 100%)';
    Array.prototype.forEach.call(el.children, function (ch) {
      if (getComputedStyle(ch).position === 'static') ch.style.position = 'relative';
      ch.style.zIndex = '2';
    });
    el.style.position = 'relative';
    el.style.overflow = 'hidden';
    el.insertBefore(shade, el.firstChild);
    el.insertBefore(img, el.firstChild);
    img.src = 'https://i.ytimg.com/vi/' + id + '/' + names[0] + '.jpg';
  }
  /* Looping, muted video previews: only cards on screen get a player, so the page stays light */
  var saveData = navigator.connection && navigator.connection.saveData;
  function sizePlayer(el, f) {
    var w = el.offsetWidth, h = el.offsetHeight, va = f.dataset.va === 'v' ? 9 / 16 : 16 / 9;
    var fw, fh;
    if (w / h > va) { fw = w; fh = w / va; } else { fh = h; fw = h * va; }
    f.style.width = Math.ceil(fw) + 'px';
    f.style.height = Math.ceil(fh) + 'px';
  }
  function startPlayer(el) {
    if (el._yt) return;
    var id = el.dataset.ytid;
    var f = document.createElement('iframe');
    f.dataset.va = el.dataset.va;
    f.setAttribute('title', '');
    f.setAttribute('aria-hidden', 'true');
    f.setAttribute('tabindex', '-1');
    f.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
    f.style.cssText = 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scale(1.18);border:0;z-index:0;pointer-events:none;opacity:0;transition:opacity .6s ease';
    sizePlayer(el, f);
    f.onload = function () { setTimeout(function () { f.style.opacity = '1'; }, 1200); };
    f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&mute=1&loop=1&playlist=' + id +
      '&controls=0&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&showinfo=0';
    var img = el.querySelector('img');
    if (img && img.nextSibling) el.insertBefore(f, img.nextSibling); else el.insertBefore(f, el.firstChild);
    el._yt = f;
  }
  function stopPlayer(el) {
    if (!el._yt) return;
    el._yt.remove();
    el._yt = null;
  }
  var io = ('IntersectionObserver' in window && !saveData && !reduceMotion) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) startPlayer(en.target); else stopPlayer(en.target); });
  }, { rootMargin: '80px 0px' }) : null;
  window.addEventListener('resize', function () {
    $$('a[data-ytid]').forEach(function (el) { if (el._yt) sizePlayer(el, el._yt); });
  });

  // The videos speak for themselves: drop the pixel play icons on the reel cards
  $$('a.reel svg').forEach(function (s) { if (s.parentElement) s.parentElement.style.display = 'none'; });

  $$('a[href*="youtu"]').forEach(function (a) {
    if (a.offsetWidth < 120) return; // skip small arrow buttons
    var id = ytId(a.href);
    if (!id) return;
    var vertical = /shorts\//.test(a.href);
    loadThumb(a, id, vertical && a.classList.contains('reel'));
    a.dataset.ytid = id;
    a.dataset.va = vertical ? 'v' : 'h';
    if (io) io.observe(a);
  });

  /* ---------------- Format carousel ---------------- */
  var rail = $('#tabRail');
  if (rail) {
    var tabs = $$('.tab');
    var names = ['Reels', 'Ad films', 'Packaging', 'Branding'];
    var captions = ['9:16 · hook in 3s', 'Story first · premium visuals', 'Brand voice on the shelf', 'Identity · logo · guidelines'];
    var pillBase = 'flex: 0 0 140px; width: 140px; height: 44px; padding: 0; border-radius: 22px; font-family: inherit; font-size: 15px; font-weight: 500; cursor: pointer; white-space: nowrap; transition: color .4s ease, border-color .4s ease, background .4s ease; ';
    var on = 'background: #141414; color: #F2F2F2; border: 2px solid #E11D21;';
    var off = 'background: transparent; color: #8F8F8F; border: 2px solid #2A2A2A;';
    var icons = [
      [[2,0],[2,1],[3,1],[2,2],[3,2],[4,2],[2,3],[3,3],[4,3],[5,3],[2,4],[3,4],[4,4],[2,5],[3,5],[2,6]],
      [[0,0],[2,0],[4,0],[6,0],[1,1],[3,1],[5,1],[0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5],[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6]],
      [[1,1],[2,1],[3,1],[4,1],[5,1],[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[0,3],[3,3],[6,3],[0,4],[3,4],[6,4],[0,5],[3,5],[6,5],[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6]],
      [[3,0],[3,1],[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[1,3],[2,3],[3,3],[4,3],[5,3],[1,4],[2,4],[4,4],[5,4],[0,5],[1,5],[5,5],[6,5],[0,6],[6,6]]
    ];
    var icon = $('#tabIcon'), cap = $('#tabCaption');
    var pos = 40, timer = null;
    function drawIcon(idx, gl) {
      var s = '';
      icons[idx].forEach(function (c, k) {
        var dx = 0, dy = 0, fill = '#FFFFFF';
        if (gl) {
          dx = (((k * 7 + gl * 13 + idx * 5) % 5) - 2) * 6;
          dy = (((k * 11 + gl * 3 + idx * 7) % 5) - 2) * 6;
          fill = (k + gl) % 3 === 0 ? '#E11D21' : ((k + gl) % 4 === 0 ? 'rgba(255,255,255,0.35)' : '#FFFFFF');
        }
        s += '<rect x="' + (c[0] * 10 + dx) + '" y="' + (c[1] * 10 + dy) + '" width="10" height="10" fill="' + fill + '"></rect>';
      });
      icon.innerHTML = s;
    }
    function place(animate) {
      rail.style.transition = animate ? 'transform .65s cubic-bezier(.7,0,.3,1)' : 'none';
      rail.style.transform = 'translateX(-' + (pos * 150 + 70) + 'px)';
    }
    function go(next) {
      if (next === pos) return;
      tabs[pos].style.cssText = pillBase + off;
      pos = next;
      tabs[pos].style.cssText = pillBase + on;
      var idx = pos % 4;
      cap.textContent = captions[idx];
      place(true);
      drawIcon(idx, 1);
      setTimeout(function () { drawIcon(idx, 2); }, 120);
      setTimeout(function () { drawIcon(idx, 0); }, 260);
      if (pos >= 72 || pos <= 8) {
        setTimeout(function () {
          tabs[pos].style.cssText = pillBase + off;
          pos = pos >= 72 ? pos - 32 : pos + 32;
          tabs[pos].style.cssText = pillBase + on;
          place(false);
        }, 750);
      }
    }
    function start() { if (timer) clearInterval(timer); if (!reduceMotion) timer = setInterval(function () { go(pos + 1); }, 2200); }
    tabs.forEach(function (t) { t.addEventListener('click', function () { go(+t.getAttribute('data-i')); start(); }); });
    drawIcon(0, 0);
    start();
  }

  /* ---------------- "No AI" switch ---------------- */
  var tog = $('#aiToggle');
  if (tog) {
    var knob = $('#aiKnob'), ic = $('#aiIcons'), dots = $('#aiDots');
    var trackBase = tog.style.cssText.replace(/background:[^;]*;?/, '').replace(/flex-direction:[^;]*;?/, '');
    var busy = false;
    function setAi(onState) {
      tog.style.background = onState ? 'linear-gradient(180deg, #FF4A4D, #B5131A)' : '#2A2A2A';
      tog.style.flexDirection = onState ? 'row-reverse' : 'row';
      tog.setAttribute('aria-pressed', onState ? 'true' : 'false');
      knob.textContent = onState ? 'NOPE' : 'NO AI';
      ic.style.color = onState ? '#FFFFFF' : '#6A6A6A';
      dots.style.backgroundImage = 'radial-gradient(' + (onState ? '#3a3a3a' : '#E11D21') + ' 1.3px, transparent 1.7px)';
    }
    tog.addEventListener('click', function () {
      if (busy) return; busy = true;
      setAi(true);
      setTimeout(function () { setAi(false); busy = false; }, 650);
    });
  }

  /* ---------------- Process cards ---------------- */
  var steps = $$('.step');
  if (steps.length) {
    var cardBase = 'min-height: 300px; border-radius: 28px; padding: 26px; display: flex; flex-direction: column; text-align: left; font-family: inherit; cursor: pointer; transition: background .25s ease, transform .25s ease; ';
    var act = 'background: #E11D21; color: #FFFFFF; border: none; transform: rotate(-1.5deg); box-shadow: 0 30px 60px rgba(225,29,33,0.25);';
    var idle = 'background: #1B1B1B; color: #F2F2F2; border: 1px solid #2A2A2A;';
    steps.forEach(function (s, i) {
      s.addEventListener('click', function () {
        steps.forEach(function (o, j) { o.style.cssText = cardBase + (i === j ? act : idle); });
      });
    });
  }

  /* ---------------- 3D computer scroll story ---------------- */
  var storyEl = $('#process'), c = $('#storyCanvas');
  if (!storyEl || !c) return;

  var story = [
    { title: 'FIND AN AGENCY', caption: 'Find an agency that gets it', lines: ['const agency = search({', '  style: "cinematic",', '  output: "every week"', '});', '> match found'] },
    { title: 'WATCH THE REEL', caption: 'Watch the reel, feel the pacing', lines: ['const reel = agency.work.play();', 'review(reel, {', '  hooks: true, pacing: "tight"', '});', '> this feels right'] },
    { title: 'SEND THE FOOTAGE', caption: 'Send us your raw footage', lines: ['upload(raw, { to: "allmedia" });', 'brief.goals = ["reach",', '  "authority", "sales"];', 'brief.refs = client.links;', '> footage received'] },
    { title: 'GET THE FINAL CUT', caption: 'Get the final cut, ready to post', lines: ['const cut = edit(raw, {', '  hook: "3s", grade: true', '});', 'export(cut, ["9:16","16:9"]);', '> views climbing'] }
  ];
  var fills = $$('.sfill'), numEl = $('#storyNum'), capEl = $('#storyCaption');
  var fb = $('#storyFallback'), fbTitle = $('#fbTitle'), fbCode = $('#fbCode');
  var cells = $$('.mcell');
  var cellBase = cells.map(function (el, i) {
    var v = (i * 37 + (i % 7) * 11 + Math.floor(i / 16) * 5) % 13;
    return v === 0 || v === 7 ? '#E11D21' : (v === 3 || v === 10 ? '#3A3A3A' : (v === 5 ? '#2A2A2A' : 'transparent'));
  });
  var cur = { step: -1, sp: -1, flash: -1 };

  function updateDom(step, sp, flash) {
    if (step !== cur.step) {
      numEl.textContent = '0' + (step + 1) + ' / 04';
      capEl.textContent = story[step].caption;
      if (fbTitle) { fbTitle.textContent = story[step].title; fbCode.textContent = story[step].lines.join('\n'); }
    }
    if (sp !== cur.sp) {
      fills.forEach(function (f, i) {
        var local = Math.max(0, Math.min(1, sp / 25 - i));
        f.style.width = Math.round(local * 100) + '%';
      });
    }
    if (flash !== cur.flash) {
      cells.forEach(function (el, i) {
        var thr = ((i * 53 + 17) % 97) / 97;
        if (thr < flash * 0.7) { el.style.background = (i % 3 === 0) ? '#E11D21' : '#3A3A3A'; el.style.opacity = '1'; }
        else { el.style.background = cellBase[i]; el.style.opacity = '0.45'; }
      });
    }
    cur = { step: step, sp: sp, flash: flash };
  }

  function progress() {
    var rect = storyEl.getBoundingClientRect();
    var stickyH = (storyEl.firstElementChild && storyEl.firstElementChild.offsetHeight) || 720;
    var span = Math.max(1, rect.height - stickyH);
    return { p: Math.min(1, Math.max(0, (64 - rect.top) / span)), rect: rect };
  }

  function fallback() {
    c.style.display = 'none';
    fb.style.display = 'flex';
    var tick = function () {
      var pr = progress().p;
      var step = Math.min(3, Math.floor(pr * 4));
      updateDom(step, Math.round(pr * 100), 0);
    };
    window.addEventListener('scroll', tick, { passive: true });
    tick();
  }

  var T = window.THREE;
  var renderer;
  if (!T) { fallback(); return; }
  try { renderer = new T.WebGLRenderer({ canvas: c, antialias: true, alpha: true }); }
  catch (e) { fallback(); return; }
  if (T.ColorManagement) T.ColorManagement.legacyMode = false;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = T.sRGBEncoding;
  renderer.toneMapping = T.NoToneMapping;
  renderer.setClearColor(0x000000, 0);

  var scene = new T.Scene();
  var camera = new T.PerspectiveCamera(30, 1, 0.1, 100);

  var pm = new T.PMREMGenerator(renderer);
  var env = new T.Scene();
  env.add(new T.Mesh(new T.SphereGeometry(20, 32, 16), new T.MeshBasicMaterial({ color: 0x1c1c1c, side: T.BackSide })));
  function panelM(w, h, color, x, y, z) {
    var m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: color, side: T.DoubleSide }));
    m.position.set(x, y, z); m.lookAt(0, 0, 0); env.add(m);
  }
  panelM(14, 5, 0xffffff, 0, 10, 4);
  panelM(6, 10, 0xd8d8d8, -10, 2, 6);
  panelM(5, 8, 0xff2a2a, 10, 0, -2);
  panelM(10, 3, 0x9a9a9a, 0, -8, 6);
  scene.environment = pm.fromScene(env, 0.04).texture;

  scene.add(new T.AmbientLight(0xffffff, 0.25));
  var key = new T.DirectionalLight(0xffffff, 1.6); key.position.set(4, 6, 7); scene.add(key);
  var rim = new T.DirectionalLight(0xffffff, 0.6); rim.position.set(-6, 2, -5); scene.add(rim);
  var fillL = new T.DirectionalLight(0xffffff, 0.35); fillL.position.set(-5, -2, 6); scene.add(fillL);

  function rr(w, h, r) {
    var s = new T.Shape(); var x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    return s;
  }
  function ex(w, h, r, depth, bevel) {
    var g = new T.ExtrudeGeometry(rr(w, h, r), { depth: depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 6, curveSegments: 24 });
    g.center(); return g;
  }
  var silver = new T.MeshStandardMaterial({ color: 0xdcdcd6, metalness: 0.75, roughness: 0.26 });
  var red = new T.MeshStandardMaterial({ color: 0xe11d21, emissive: 0xb5131a, emissiveIntensity: 0.22, metalness: 0.0, roughness: 0.5, envMapIntensity: 0.35 });
  var dark = new T.MeshStandardMaterial({ color: 0x141414, metalness: 0.2, roughness: 0.6 });
  var lip = new T.MeshStandardMaterial({ color: 0xa6a6a1, metalness: 0.7, roughness: 0.35 });

  var crt = new T.Group();
  crt.add(new T.Mesh(ex(3.3, 2.9, 0.55, 2.0, 0.2), red));
  var face = new T.Mesh(ex(3.5, 3.1, 0.62, 0.3, 0.14), silver); face.position.z = 1.15; crt.add(face);
  var bezel = new T.Mesh(ex(2.7, 1.95, 0.34, 0.06, 0.03), red); bezel.position.set(0, 0.32, 1.47); crt.add(bezel);

  var sc = document.createElement('canvas'); sc.width = 1024; sc.height = 720;
  var sctx = sc.getContext('2d');
  var tex = new T.CanvasTexture(sc); tex.encoding = T.sRGBEncoding; tex.anisotropy = 4;
  var sw = 2.45, sh = 1.72;
  var sg = new T.ShapeGeometry(rr(sw, sh, 0.24), 24);
  var posA = sg.attributes.position, uv = sg.attributes.uv;
  for (var i = 0; i < posA.count; i++) uv.setXY(i, (posA.getX(i) + sw / 2) / sw, (posA.getY(i) + sh / 2) / sh);
  uv.needsUpdate = true;
  var screen = new T.Mesh(sg, new T.MeshBasicMaterial({ map: tex, toneMapped: false }));
  screen.position.set(0, 0.32, 1.535); crt.add(screen);
  var glass = new T.Mesh(sg, new T.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0, roughness: 0.06, transparent: true, opacity: 0.1, clearcoat: 1 }));
  glass.position.set(0, 0.32, 1.545); crt.add(glass);
  var lipM = new T.Mesh(ex(1.85, 0.34, 0.12, 0.04, 0.02), lip); lipM.position.set(-0.25, -1.05, 1.45); crt.add(lipM);
  var slot = new T.Mesh(new T.BoxGeometry(1.6, 0.12, 0.08), dark); slot.position.set(-0.25, -1.05, 1.49); crt.add(slot);
  var btn = new T.Mesh(ex(0.3, 0.3, 0.08, 0.08, 0.04), red); btn.position.set(1.15, -1.05, 1.5); crt.add(btn);
  var footG = new T.CylinderGeometry(0.18, 0.22, 0.14, 24);
  var f1 = new T.Mesh(footG, dark); f1.position.set(-1.1, -1.62, 0.3); crt.add(f1);
  var f2 = new T.Mesh(footG, dark); f2.position.set(1.1, -1.62, 0.3); crt.add(f2);
  scene.add(crt);

  var shc = document.createElement('canvas'); shc.width = 256; shc.height = 256;
  var sx = shc.getContext('2d');
  var gr = sx.createRadialGradient(128, 128, 10, 128, 128, 128);
  gr.addColorStop(0, 'rgba(0,0,0,0.55)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
  sx.fillStyle = gr; sx.fillRect(0, 0, 256, 256);
  var shadow = new T.Mesh(new T.PlaneGeometry(5.2, 2.4), new T.MeshBasicMaterial({ map: new T.CanvasTexture(shc), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = -1.9; scene.add(shadow);

  function drawScreen(step, typed, blink, glitch) {
    var x = sctx, W = 1024, H = 720;
    var g = x.createRadialGradient(W * 0.4, H * 0.35, 40, W * 0.5, H * 0.5, W * 0.75);
    g.addColorStop(0, '#2c1415'); g.addColorStop(1, '#0c0707');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    var d = story[step];
    x.fillStyle = '#ff5a4e';
    x.globalAlpha = 0.6;
    x.font = '500 26px "JetBrains Mono", monospace';
    x.fillText('ALLMEDIA / PROCESS', 80, 96);
    x.fillText('0' + (step + 1) + ':04', W - 190, 96);
    x.globalAlpha = 1;
    x.font = '54px "Silkscreen", monospace';
    x.shadowColor = 'rgba(255,70,60,0.75)'; x.shadowBlur = 18;
    x.fillText(d.title, 80, 176);
    x.font = '500 34px "JetBrains Mono", monospace';
    var total = 0, k;
    for (k = 0; k < d.lines.length; k++) total += d.lines[k].length;
    var left = Math.floor(total * typed), y = 262, cx = 80, cy = 262;
    for (k = 0; k < d.lines.length; k++) {
      var ln = d.lines[k];
      var show = ln.slice(0, Math.max(0, Math.min(ln.length, left)));
      left -= ln.length;
      if (show.length) { x.fillText(show, 80, y); cx = 80 + x.measureText(show).width; cy = y; }
      if (left <= 0 && show.length < ln.length) break;
      y += 54;
    }
    if (blink) x.fillRect(cx + 6, cy - 30, 20, 36);
    x.shadowBlur = 0;
    x.fillStyle = 'rgba(0,0,0,0.22)';
    for (var s = 0; s < H; s += 5) x.fillRect(0, s, W, 2);
    if (glitch > 0) {
      for (var q = 0; q < 40 * glitch; q++) {
        x.fillStyle = (q % 3 === 0) ? '#e11d21' : '#3a3a3a';
        x.fillRect(((q * 137) % 16) * 64, ((q * 71) % 12) * 60, 64, 60);
      }
    }
    var vg = x.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, W * 0.7);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.55)');
    x.fillStyle = vg; x.fillRect(0, 0, W, H);
    tex.needsUpdate = true;
  }

  var lastKey = '', rotY = -0.5, rotX = 0.1, cw = 0, ch = 0;
  if (document.fonts && document.fonts.load) {
    Promise.all([document.fonts.load('48px "Silkscreen"'), document.fonts.load('500 34px "JetBrains Mono"')])
      .then(function () { lastKey = ''; }).catch(function () {});
  }

  function frame(now) {
    requestAnimationFrame(frame);
    var pr = progress(), p = pr.p, rect = pr.rect;
    var vh = window.innerHeight || 800;
    if (rect.bottom < -50 || rect.top > vh + 50) return;

    var step = Math.min(3, Math.floor(p * 4));
    var frac = Math.min(1, p * 4 - step);
    var typed = Math.min(1, Math.max(0, (frac - 0.06) / 0.55));
    var dEdge = Math.min(step === 0 ? 1 : frac, step === 3 ? 1 : 1 - frac);
    var flash = dEdge < 0.035 ? 1 : (dEdge < 0.08 ? 0.5 : 0);
    var blink = Math.floor(now / 450) % 2 === 0;

    var k2 = step + '|' + Math.floor(typed * 200) + '|' + blink + '|' + flash;
    if (k2 !== lastKey) { lastKey = k2; drawScreen(step, typed, blink, flash); }
    updateDom(step, Math.round(p * 100), flash);

    var w = c.clientWidth, h = c.clientHeight;
    if (w && h && (w !== cw || h !== ch)) {
      cw = w; ch = h;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      var t = Math.tan((camera.fov * Math.PI / 180) / 2);
      camera.position.set(0, 0.25, Math.max(4.4 / (2 * t), 4.9 / (2 * t * camera.aspect)));
      camera.lookAt(0, -0.05, 0);
      camera.updateProjectionMatrix();
    }
    var idleMove = reduceMotion ? 0 : 1;
    var tY = -0.62 + p * 1.24 + Math.sin(now / 1600) * 0.05 * idleMove;
    var tX = 0.16 - p * 0.12 + Math.sin(now / 2100) * 0.03 * idleMove;
    rotY += (tY - rotY) * 0.08;
    rotX += (tX - rotX) * 0.08;
    crt.rotation.set(rotX, rotY, Math.sin(now / 2600) * 0.025 * idleMove);
    crt.position.y = Math.sin(now / 1300) * 0.07 * idleMove;
    renderer.render(scene, camera);
  }
  updateDom(0, 0, 0);
  requestAnimationFrame(frame);
})();
