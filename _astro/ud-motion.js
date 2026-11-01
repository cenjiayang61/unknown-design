/*!
 * UNKNOWN DESIGN — 滚动动效（呼应 Our Trip 页的阅读节奏）
 *   [data-ud-reveal]   文字随滚动逐字 / 逐词点亮
 *   [data-ud-drift]    大字随滚动横向漂移（数值为漂移系数，正负决定方向）
 *   [data-ud-parallax] 图片在框内轻微视差
 *   [data-ud-inview]   进入视口时加 .is-in（淡入、地图点亮、品牌墙扫光）
 *   [data-ud-count]    数字从 0 计数到标记里写好的终值
 *   [data-city]        城市示意图与清单联动高亮
 * 系统开启"减少动态效果"时全部停用。
 */
(function () {
  if (window.__UD_MOTION__) return;
  window.__UD_MOTION__ = true;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  document.documentElement.classList.add('ud-motion');

  var TOKEN = /[　-〿㐀-鿿＀-￯]|[^\s　-〿㐀-鿿＀-￯]+|\s+/g;

  function split(el) {
    if (el.__udSplit) return;
    el.__udSplit = true;
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    var nodes = [], n;
    while ((n = walker.nextNode())) nodes.push(n);
    nodes.forEach(function (t) {
      var parts = t.nodeValue.match(TOKEN);
      if (!parts) return;
      var frag = document.createDocumentFragment();
      parts.forEach(function (p) {
        if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
        var s = document.createElement('span');
        s.className = 'ud-w';
        s.textContent = p;
        frag.appendChild(s);
      });
      t.parentNode.replaceChild(frag, t);
    });
    el.__udWords = el.querySelectorAll('.ud-w');
  }

  var reveals = [], drifts = [], pars = [];
  function collect() {
    reveals = Array.prototype.slice.call(document.querySelectorAll('[data-ud-reveal]'));
    reveals.forEach(split);
    drifts = Array.prototype.slice.call(document.querySelectorAll('[data-ud-drift]'));
    pars = Array.prototype.slice.call(document.querySelectorAll('[data-ud-parallax]'));
    observeInview();
    tick();
  }

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  var raf = 0;
  function tick() {
    raf = 0;
    var vh = window.innerHeight, vw = window.innerWidth;
    for (var i = 0; i < reveals.length; i++) {
      var el = reveals[i], r = el.getBoundingClientRect();
      if (r.bottom < -50 || r.top > vh + 50) continue;
      // 0 when the block's top reaches 92% of the viewport, 1 when its bottom reaches 55%
      var start = vh * 0.92, end = vh * 0.55;
      var p = clamp((start - r.top) / (start - end + r.height), 0, 1);
      var w = el.__udWords || [], N = w.length, soft = 4;
      for (var k = 0; k < N; k++) {
        var o = clamp((p * (N + soft) - k) / soft, 0, 1);
        w[k].style.opacity = (0.16 + 0.84 * o).toFixed(3);
      }
    }
    for (var j = 0; j < drifts.length; j++) {
      var d = drifts[j], rr = d.getBoundingClientRect();
      if (rr.bottom < -200 || rr.top > vh + 200) continue;
      var f = parseFloat(d.getAttribute('data-ud-drift')) || 0;
      var off = (rr.top + rr.height / 2 - vh / 2) / vh;      // -1..1 around the centre
      d.style.transform = 'translate3d(' + (off * f * vw).toFixed(1) + 'px,0,0)';
    }
    for (var m = 0; m < pars.length; m++) {
      var im = pars[m], box = im.parentElement.getBoundingClientRect();
      if (box.bottom < 0 || box.top > vh) continue;
      var q = (box.top + box.height / 2 - vh / 2) / vh;
      im.style.transform = 'translate3d(0,' + (q * -8).toFixed(2) + '%,0) scale(1.12)';
    }
  }

  /* ---------- in-view ---------- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      el.classList.add('is-in');
      io.unobserve(el);
      var cs = el.hasAttribute('data-ud-count') ? [el] : el.querySelectorAll('[data-ud-count]');
      Array.prototype.forEach.call(cs, countUp);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }) : null;
  function observeInview() {
    var els = document.querySelectorAll('[data-ud-inview]');
    for (var i = 0; i < els.length; i++) {
      if (els[i].__udIO) continue;
      els[i].__udIO = true;
      if (io) io.observe(els[i]); else els[i].classList.add('is-in');
    }
  }
  function countUp(el) {
    if (el.__udCount) return;
    el.__udCount = true;
    var end = parseInt(el.textContent, 10);
    if (!(end > 0)) return;
    var t0 = 0, D = 1600;
    el.textContent = '0';
    (function step(ts) {
      if (!t0) t0 = ts;
      var k = Math.min(1, (ts - t0) / D), e = 1 - Math.pow(1 - k, 3);
      el.textContent = String(Math.round(end * e));
      if (k < 1) requestAnimationFrame(step);
    })(performance.now());
  }

  /* ---------- city hover sync ---------- */
  var hot = '';
  function setHot(key) {
    if (key === hot) return;
    hot = key;
    var all = document.querySelectorAll('[data-city]');
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      var on = !!key && (el.getAttribute('data-city') === key || el.getAttribute('data-city-self') === key);
      el.classList.toggle('is-hot', on);
    }
  }
  document.addEventListener('mouseover', function (e) {
    var c = e.target && e.target.closest ? e.target.closest('[data-city]') : null;
    setHot(c ? (c.getAttribute('data-city-self') || c.getAttribute('data-city')) : '');
  });

  var t = 0;
  function init() {
    collect();
    new MutationObserver(function () { clearTimeout(t); t = setTimeout(collect, 80); })
      .observe(document.body, { childList: true, subtree: true });
    (function loop() { tick(); requestAnimationFrame(loop); })();   // follows smooth-scroll inertia frame by frame
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
