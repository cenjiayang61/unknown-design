/*!
 * UNKNOWN DESIGN — 项目注册表 + 导航下拉 + 首页「最新项目」+ 项目索引页
 *
 * 新增项目只改这里：在 PROJECTS 数组里加一条（date 用 YYYY-MM-DD，越大越新）。
 * 以下三处会自动按时间倒序更新，无需改页面 HTML：
 *   1. 首页 PROJECTS 下方的堆叠卡片（最新 5 个 + All Projects）
 *   2. /projects/ 项目索引页（全部项目）
 *   3. MENU 全屏菜单卡（全部项目最新在前 + 末张 All Projects，--total/--index 自动顺延）
 * （导航悬停下拉已按需求关闭，相关代码保留未调用。）
 * 点击顶部 PROJECT 进入 /projects/ 索引页，再点项目进入各自详情页。
 * 注意：本文件必须放在 hoisted.*.js 之前加载（各页 <head> 第一个脚本），
 *       这样菜单卡先渲染、主包再抓取节点做开合动画，新增卡才能参与动画。
 */
(function () {
  if (window.__UNKNOWN_PROJECT_DD__) return;
  window.__UNKNOWN_PROJECT_DD__ = true;

  /* ===== 部署环境路径前缀 =====
   * GitHub Pages 项目站点挂在 /unknown-design/ 子路径下，本地开发在根路径。
   * 注册表里的链接/图片统一为根路径写法，运行时按环境自动加前缀。 */
  var BASE = location.pathname.indexOf('/unknown-design') === 0 ? '/unknown-design' : '';
  function H(p) { return BASE + p; }

  /* ===== 项目注册表（新增项目加在这里） ===== */
  var PROJECTS = [
    { title: 'JMC Garden', cn: 'JMC Garden', sub: 'Restaurant · Foshan Nanhai', href: '/story/jmc-garden/', img: '/images/projects/jmc-garden/01.jpg', date: '2026-11' },
    { title: 'Legent Bar', cn: 'Legent Bar', sub: 'Bar · Foshan Chancheng', href: '/story/legent-bar/', img: '/images/projects/legent-bar/01.jpg', date: '2026-11' },
    { title: 'Xiaoxi Jiazuo · Mixc', cn: '小西家作 · 万象城', sub: 'Dessert · Guangzhou Mixc', href: '/story/xiaoxi-mixc/', img: '/images/projects/xiaoxi-mixc/01.jpg', date: '2026-10' },
    { title: 'Erlun Sweetroom', cn: '贰轮甜室 · 顺德', sub: 'Dessert · Foshan Shunde', href: '/story/erlun-sd/', img: '/images/projects/erlun-sd/01.jpg', date: '2026-10' },
    { title: 'Le Pangzi Pizza', cn: '乐胖子手工pizza', sub: 'Pizzeria · Guilin', href: '/story/lepangzi/', img: '/images/projects/lepangzi/01.jpg', date: '2026-09' },
    { title: 'Xiaoxi Jiazuo · Miaqian', cn: '小西家作 · 庙前西街', sub: 'Dessert · Guangzhou Miaqian Xijie', href: '/story/xiaoxi-miaqian/', img: '/images/projects/xiaoxi-miaqian/01.jpg', date: '2026-05' },
    { title: 'Erlun Sweetroom', cn: '贰轮甜室 · 禅城', sub: 'Dessert · Foshan Chancheng', href: '/story/erlun-cc/', img: '/images/projects/erlun-cc/01.jpg', date: '2026-04' },
    { title: 'Xiaoxi Jiazuo · Pavilion', cn: '小西家作 · 亭台', sub: 'Dessert · Guangzhou Taikoo Li', href: '/story/xiaoxi/', img: '/images/projects/xiaoxi/01.jpg', date: '2026-01' },
    { title: 'Guyongxing', cn: '顾涌兴', sub: 'Restaurant · Shanghai Panlong', href: '/story/guyongxing/', img: '/images/projects/guyongxing/01.jpg', date: '2026-01' },
    { title: 'Mini Bar', cn: 'Mini Bar', sub: 'Lounge Bar · Qingyuan', href: '/story/mini-bar/', img: '/images/projects/mini-bar/01.jpg', date: '2025-12' },
    { title: 'Chushishan', cn: '初拾山', sub: 'Restaurant · Foshan', href: '/story/chushishan/', img: '/images/projects/chushishan/01.jpg', date: '2025-12' },
    { title: 'Xiaoxi Jiazuo · Cloud', cn: '小西家作 · 云朵', sub: 'Dessert · Guangzhou Ali Center', href: '/story/xiaoxi-ali/', img: '/images/projects/xiaoxi-ali/01.jpg', date: '2025-04' },
    { title: 'nini cucina', cn: 'nini cucina', sub: 'Restaurant · Guilin', href: '/story/nini-cucina/', img: '/images/projects/nini-cucina/01.jpg', date: '2025-04' },
    { title: 'Jiao Pho', cn: '蕉Pho', sub: 'Vietnamese · Foshan Nanhai', href: '/story/jiaopho/', img: '/images/projects/jiaopho/01.jpg', date: '2025-03' },
    { title: 'Ruchujian', cn: '如初见', sub: 'Sweet Soup & Buns · Guangzhou', href: '/story/ruchujian/', img: '/images/projects/ruchujian/01.jpg', date: '2025-01' },
    { title: 'HOLY CREAM', cn: 'HOLY CREAM', sub: 'Dessert · Foshan Chancheng', href: '/story/holy-cream/', img: '/images/projects/holy-cream/01.jpg', date: '2024-12' },
    { title: 'nini brunch', cn: 'nini brunch', sub: 'Brunch · Guilin', href: '/story/nini-brunch/', img: '/images/projects/nini-brunch/01.jpg', date: '2024-12' },
    { title: 'Lan Zhenzhen', cn: '兰真真清真包子甜食铺', sub: 'Baozi & Sweets · Shanghai', href: '/story/lanzhenzhen/', img: '/images/projects/lanzhenzhen/01.jpg', date: '2024-12' },
    { title: 'Banshan Teahouse', cn: '半山茶舍', sub: 'Teahouse · Foshan Shunde', href: '/story/banshan/', img: '/images/projects/banshan/01.jpg', date: '2024-12' },
    { title: 'Yinyou Teahouse', cn: '隐幽茶舍', sub: 'Teahouse · Foshan Shunde', href: '/story/yinyou/', img: '/images/projects/yinyou/01.jpg', date: '2024-12' },
    { title: 'olayks', cn: 'olayks', sub: 'Exhibition Booth · Shanghai', href: '/story/olayks/', img: '/images/projects/olayks/01.jpg', date: '2024-10' },
    { title: 'Rice Husk & Malt', cn: '稻壳语麦芽', sub: 'Bakery · Foshan Shunde', href: '/story/rice-malt/', img: '/images/projects/rice-malt/01.jpg', date: '2024-10' },
    { title: 'chuchulab', cn: 'chuchulab', sub: 'Patisserie · Guangzhou Polytrade', href: '/story/chuchulab/', img: '/images/projects/chuchulab/01.jpg', date: '2024-01' },
    { title: 'soho !', cn: 'soho !', sub: 'Café · Foshan Nanhai', href: '/story/soho/', img: '/images/projects/soho/01.jpg', date: '2023-05' }
  ];

  /* 首页堆叠卡由暗到光的灰阶（第 6 张 All Projects 为浅色"门外的光"） */
  var SHADES = ['#161615', '#21211F', '#2E2E2B', '#3D3C39', '#4F4E4A'];
  var LIGHT = '#F1F0ED';

  var CSS = [
    'li[data-project-nav]{position:relative}',
    'li[data-project-nav] .proj-dd{position:absolute;top:100%;left:50%;transform:translateX(-50%);padding-top:16px;opacity:0;visibility:hidden;pointer-events:none;transition:opacity .35s cubic-bezier(0,0,.2,1),visibility .35s;z-index:60}',
    'li[data-project-nav]:hover .proj-dd,li[data-project-nav]:focus-within .proj-dd{opacity:1;visibility:visible;pointer-events:auto}',
    '.proj-dd__inner{width:308px;background:#141413;color:#F1F0ED;border:1px solid #2A2A28;box-shadow:0 24px 48px rgba(0,0,0,.45);padding:16px 14px 10px}',
    '.proj-dd__head{font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#8C8A85;padding:0 8px 12px}',
    'a.proj-dd__item{display:flex;align-items:center;gap:14px;padding:9px 8px;border-top:1px solid #2A2A28;text-decoration:none;color:inherit;transition:background-color .25s cubic-bezier(.4,0,.2,1)}',
    'a.proj-dd__item:hover{background:#1F1F1D}',
    '.proj-dd__thumb{flex:0 0 auto;width:86px;height:62px;overflow:hidden;background:#1C1C1B}',
    '.proj-dd__thumb img{width:100%;height:100%;object-fit:cover;display:block}',
    '.proj-dd__meta{display:flex;flex-direction:column;gap:4px;min-width:0}',
    '.proj-dd__title{font-size:13px;letter-spacing:.04em;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.proj-dd__sub{font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:#8C8A85;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    'a.proj-dd__all{display:block;margin-top:6px;padding:13px 8px 8px;border-top:1px solid #2A2A28;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#B5B3AE;text-decoration:none;transition:color .25s}',
    'a.proj-dd__all:hover{color:#F1F0ED}'
  ].join('');

  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function style() {
    if (document.getElementById('proj-dd-style')) return;
    var s = document.createElement('style');
    s.id = 'proj-dd-style';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function sorted() {
    return PROJECTS.slice().sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; });
  }
  function latest(n) { return sorted().slice(0, n || 5); }

  /* ---------- 1. header dropdown ---------- */
  function itemHTML(p) {
    return '<a class="proj-dd__item" href="' + H(p.href) + '" data-transition="secondaryNav">' +
      '<span class="proj-dd__thumb"><img src="' + H(p.img) + '" alt="" loading="lazy" decoding="async" draggable="false"></span>' +
      '<span class="proj-dd__meta"><span class="proj-dd__title">' + esc(p.title) + '</span>' +
      '<span class="proj-dd__sub">' + esc(p.sub) + '</span></span></a>';
  }
  function renderDropdown() {
    var nodes = document.querySelectorAll('[data-project-dropdown]');
    if (!nodes.length) return;
    var html = '<div class="proj-dd__inner">' +
      '<p class="proj-dd__head">Latest Projects</p>' +
      latest(5).map(itemHTML).join('') +
      '<a class="proj-dd__all" href="' + H('/projects/') + '" data-transition="secondaryNav">All Projects</a>' +
      '</div>';
    for (var i = 0; i < nodes.length; i++) if (nodes[i].innerHTML !== html) nodes[i].innerHTML = html;
  }

  /* ---------- 2. homepage stacked folders (latest 5 + All Projects) ---------- */
  function pd(d) { return d ? String(d).replace('-', '.') : ''; }
  function folderItem(i, bg, href, small, title, date) {
    var c = ' data-astro-cid-hpij2yod';
    return '<li class="item" style="--index:' + i + ';--backgroundColor: #0E0E0D;"' + c + '> ' +
      '<a class="link" style="--bg:' + bg + ';--backgroundColor: #0E0E0D;" href="' + href + '"' + c + '> ' +
      '<span class="micro-3" data-small-title' + c + '> ' + esc(small) + (date ? ' <span class="ud-mono" style="opacity:.55;">— ' + esc(date) + '</span>' : '') + ' </span> ' +
      '<span class="item-title | display-1" data-title' + c + '>' + esc(title) + '</span> ' +
      '</a> </li>';
  }
  function renderFolders() {
    var lists = document.querySelectorAll('[data-latest-folders]');
    if (!lists.length) return;
    var l = latest(5);
    var html = l.map(function (p, i) { return folderItem(i, SHADES[i] || SHADES[SHADES.length - 1], H(p.href), p.sub, p.title, pd(p.date)); }).join('') +
      folderItem(l.length, LIGHT, H('/projects/'), 'Index', 'All Projects');
    for (var i = 0; i < lists.length; i++) {
      var ul = lists[i];
      var have = Array.prototype.map.call(ul.querySelectorAll('a.link'), function (a) { return a.getAttribute('href'); }).join('|');
      var want = l.map(function (p) { return H(p.href); }).concat(H('/projects/')).join('|');
      if (have === want) continue;            // static HTML already matches the registry
      ul.style.setProperty('--total', l.length + 1);
      ul.innerHTML = html;
    }
  }

  /* ---------- 3. /projects/ index page ---------- */
  function renderIndex() {
    var grids = document.querySelectorAll('[data-all-projects]');
    if (!grids.length) return;
    var all = sorted();
    for (var g = 0; g < grids.length; g++) {
      var grid = grids[g];
      var have = Array.prototype.map.call(grid.querySelectorAll('a.ud-pcard'), function (a) { return a.getAttribute('href'); }).join('|');
      if (have === all.map(function (p) { return H(p.href); }).join('|')) continue;
      grid.innerHTML = all.map(function (p, i) {
        var no = (i + 1 < 10 ? '0' : '') + (i + 1);
        return '<a class="ud-pcard" href="' + H(p.href) + '">' +
          '<span class="ud-pcard__img"><img src="' + H(p.img) + '" alt="' + esc(p.title) + '" loading="lazy" decoding="async" draggable="false"></span>' +
          '<span class="ud-pcard__meta"><span class="ud-pcard__no">' + no + '</span>' +
          '<span class="ud-pcard__names"><span class="ud-pcard__cn ud-cn">' + esc(p.cn || '') + '</span>' +
          '<span class="ud-pcard__en">' + esc(p.title) + '</span></span>' +
          '<span class="ud-pcard__sub">' + esc(p.sub) + '</span></span></a>';
      }).join('');
    }
  }

  /* ---------- 4. MENU 全屏菜单卡（全部项目最新在前 + All Projects） ---------- */
  /* 现有 5 级由深到浅的菜单卡底色；超过 5 个项目时继续向浅灰过渡，All Projects 恒为浅色 */
  var MENU_SHADES = ['#1A1A19', '#252523', '#32312F', '#42413E', '#575652'];
  function menuShade(i, total) {
    if (i < MENU_SHADES.length) return MENU_SHADES[i];
    var extra = Math.max(1, total - MENU_SHADES.length);
    var t = Math.min(1, (i - MENU_SHADES.length + 1) / extra);
    function ch(a, b) { return Math.round(a + (b - a) * t); }
    return 'rgb(' + ch(0x57, 0x8C) + ',' + ch(0x56, 0x8A) + ',' + ch(0x52, 0x85) + ')';
  }
  function menuItem(i, bg, href, small, title, transition) {
    var c = ' data-astro-cid-pux6a34n';
    return '<li class="main-links-item" style="--index:' + i + '"' + c + '> ' +
      '<a class="link" style="--bg:' + bg + '" href="' + href + '" data-transition="' + transition + '"' + c + '> ' +
      '<span class="micro-3" data-small-title' + c + '> ' + esc(small) + ' </span> ' +
      '<span class="main-links-item-title | display-1" data-title' + c + '>' + esc(title) + '</span> </a> </li>';
  }
  function renderMenu() {
    var lists = document.querySelectorAll('ul[data-menu-projects]');
    if (!lists.length) return;
    var all = sorted();
    var want = all.map(function (p) { return H(p.href); }).concat(H('/projects/')).join('|');
    for (var i = 0; i < lists.length; i++) {
      var ul = lists[i];
      if (!ul.hasAttribute('data-lenis-prevent-touch')) ul.setAttribute('data-lenis-prevent-touch', '');
      var have = Array.prototype.map.call(ul.querySelectorAll('a.link'), function (a) { return a.getAttribute('href'); }).join('|');
      if (have === want) continue;               // 静态 HTML 已与注册表一致（无 JS 时的兜底）
      var html = all.map(function (p, k) {
        return menuItem(k, menuShade(k, all.length), H(p.href), p.sub, p.title, 'navToStory');
      }).join('') + menuItem(all.length, LIGHT, H('/projects/'), 'Index', 'All Projects', 'secondaryNav');
      ul.style.setProperty('--total', all.length + 1);
      ul.innerHTML = html;
    }
  }

  /* ---------- header readability over light sections ---------- */
  var raf = 0;
  function headerTone() {
    raf = 0;
    var y = 36, on = false;
    var bands = document.querySelectorAll('.ud-exposure, .ud-light-band');
    for (var i = 0; i < bands.length; i++) {
      var r = bands[i].getBoundingClientRect();
      if (r.top <= y && r.bottom >= y) { on = true; break; }
    }
    document.documentElement.classList.toggle('ud-header-ink', on);
  }
  function onScroll() { if (!raf) raf = requestAnimationFrame(headerTone); }

  function renderAll() { renderFolders(); renderIndex(); renderMenu(); headerTone(); }

  function closeAll() {
    var open = document.querySelectorAll('li[data-project-nav].open');
    for (var i = 0; i < open.length; i++) open[i].classList.remove('open');
  }

  function bind() {
    document.addEventListener('click', function (e) {
      var t = e.target;
      if (!(t && t.closest)) return;
      if (t.closest('[data-project-dropdown] a') || !t.closest('[data-project-dropdown]')) closeAll();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    /* pages are swapped in place by the transition engine: re-render when new content arrives */
    var timer = 0;
    new MutationObserver(function () {
      clearTimeout(timer);
      timer = setTimeout(renderAll, 60);
    }).observe(document.body, { childList: true, subtree: true });
  }

  function init() { renderAll(); bind(); }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  window.addEventListener('load', renderAll);
})();
