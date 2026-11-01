# UNKNOWN DESIGN 官网源码

版本：2026-10-31（v4）
技术形态：纯静态多页站（原生 HTML/CSS/JS，无构建步骤），可直接部署到任意静态托管。

---

## 一、页面结构与生成逻辑

```
├── index.html              首页
│     · 大字标 UNKNOWN DESIGN（fit-to-width 脚本自动撑满视口宽）
│     · SELECTED WORKS：六张堆叠项目卡（滚动/悬停展开）
│     · PROJECTS 收尾区
├── about/index.html        关于我们（工作室简介 · 2016 深圳成立 · 三要素 · 视频黑占位）
├── history/index.html      History = 获奖信息 + 合作经历
│     · AWARDS：奖项墙图 + 待补文字明细区
│     · COOPERATION：合作经历占位行
├── our-trip/index.html     Our Trip
├── story/                  项目详情页（每页一个项目）
│     ├── xiaoxi/             小西家作 · 太古里
│     ├── wayne/              万象城 Wanxiangcheng
│     ├── teresa/             隐幽茶舍 Yinyou Teahouse
│     ├── dad-grandad/        输出排版 Print Layout
│     └── uncle-ken/          Archive
├── _astro/                 JS/CSS 主包（交互引擎：页面转场、菜单、滚动动画、平滑滚动）
│     ├── hoisted.CVW--kUO.js  主交互包（转场/菜单/滚动动画核心，勿随意改动）
│     └── project-dropdown.js  ★ 导航 Project 下拉「最新 5 个项目」注册表
├── fonts/                  本地化字体（typekit-local.css + woff2）
├── images/                 全站图片
│     ├── projects/           案例图（wxc / teahouse / print / extra 系列，36 张）
│     └── awards-wall.jpg     奖项墙（History 页）
└── favicon/                站点图标 + webmanifest
```

## 二、核心运行机制

### 1. 页面转场（Taxi.js）
- 所有 `<a>` 可带 `data-transition` 属性触发命名转场：`navToStory`（项目卡进详情页）、`secondaryNav`（通用导航）、`siteHeaderToTrip`、`nextToStory`（详情页"下一个项目"）等。
- 头部导航栏在转场容器（`data-taxi-view`）之外 → 换页时头部持久保留，不重复加载。
- **注意**：导航 Project 下拉里的链接只能用 `secondaryNav`，不能用 `navToStory`（该转场仅限项目卡上下文）。
- 每页根节点 `--color-theme-bg` 定义该页主题色（首页 #EDE7DB 米白、History #D69A3F 琥珀、太古里 #8A6E5D 暖木…）。

### 2. 导航 Project 下拉：默认显示最新上传的 5 个项目
数据源集中在 `_astro/project-dropdown.js` 的 `PROJECTS` 数组：

```js
var PROJECTS = [
  { title: '项目英文名', sub: '分类 · 地点', href: '/story/xxx/', img: '/images/projects/xxx-01.jpg', date: '2026-11-05' },
  ...已有条目
];
```

- `date`（YYYY-MM-DD）越大越新；脚本自动按时间倒序取前 5 渲染，页面 HTML 无需改动。
- 交互：桌面悬停展开、点击切换、Esc / 点外部关闭；移动端导航项自动隐藏（由 MENU 接管）。

### 3. 首页 SELECTED WORKS 六卡
`<ul class="main-links">` 内每张卡一个 `<li>`，靠 `--total` / `--index` CSS 变量控制堆叠展开顺序；点击经 `navToStory` 转场进对应 `story/` 页。

### 4. MENU 全屏菜单
每页 HTML 末尾 `<div class="navigation">` 结构，六张卡与首页一致；`--total` 为卡总数，加卡时同步 +1。

### 5. 图片比例驱动布局
每张图两层控制比例：外层 `aspect-ratio: 宽 / 高` + `<img>` 的 `style="--ratio: 宽 / 高"`。**换图必须同步改这两处**，否则布局拉伸。

### 6. 视频黑封面占位
页面 `<video>` 标签无 `src` 时自动显示黑色占位封面；加 `src="/videos/xxx.mp4"` 后占位自动消失。

### 7. 大标题自适应
各页 `<head>` 内 fit-to-width 脚本：按视口宽度自动缩放 `h1.display-1` 至单行撑满（load / resize / 字体就绪多触发）。

## 三、本地预览

必须经 HTTP 服务访问（页面使用绝对路径 `/...`，直接双击 html 无法加载资源）：

```bash
cd 本目录
python -m http.server 8000
# 浏览器打开 http://127.0.0.1:8000/
```

## 四、日常维护

### 新增一个项目（三步）
1. 复制 `story/xiaoxi/` 整目录为 `story/新项目名/`，替换标题、文案、图片（比例变量同步改）。
2. 在每个页面的 `<ul class="main-links">` 里加一张 `<li>`（复制现有卡，`--total` +1）。
3. 在 `_astro/project-dropdown.js` 的 `PROJECTS` 加一条（date 填最新日期）→ 导航下拉自动更新。

### History 页补全获奖 / 合作文字
- `history/index.html` 搜 `Awards` 与 `Cooperation` 两个区块；
- 合作经历按 `c-reference-books__links-title / -author / -link` 三列行结构逐行添加（年份放 link 列）；
- 获奖明细加在奖项墙图下方（替换 "Detailed award list to be updated"）。
- 奖项墙图直接替换 `images/awards-wall.jpg`（建议 2000px+ 宽）。

## 五、注意事项

- **字体授权**：站内字体（Founders Grotesk、New Spirit / Joly Headline 等）为商业字体，正式商用前需取得授权，或替换为开源字体。
- 站点为根路径绝对路径（`/images/...`）；部署到子目录需批量替换路径，根域名部署无影响。
- `_astro/hoisted.CVW--kUO.js` 为交互核心包，改动前先备份。

## 六、待补内容清单

- [ ] 项目视频（太古里 / About 工作室视频）
- [ ] 获奖信息文字明细（History 页）
- [ ] 合作经历文字明细（History 页）
- [ ] 高清奖项墙原图
- [ ] 太古里项目实拍图（当前为占位图）

---

## 七、v5「暗场取光」改版说明（2026-10-31）

在 v4 基础上做的视觉与文案改版。交互引擎、转场、动画脚本（`_astro/hoisted.*.js`）均未修改。

### 1. 视觉：集中在 `_astro/ud-theme.css`
- 色彩只用灰阶：暗 #0E0E0D、深灰 #1C1C1B、线灰 #2A2A28、中灰 #8C8A85、浅灰 #B5B3AE、光 #F1F0ED；信号红 #D7141A 全站只在页尾一个点上。
- 各页 `--color-theme-bg` 已从暖色换为近黑灰阶；菜单与堆叠卡由暗到光，最后一张为浅色。
- 首页首屏下方依次为：主张句 Strategy / Space / Identity → 工作室介绍（英文大段悬挂缩进、逐词点亮）→ 浅色曝光段 → 精选作品 → Plane / Door / Light（与主张句镜像构图，由暗到光）→ PROJECTS 与最新项目堆叠卡（左对齐）。
- 首页"Structure is the bone"一段为浅色曝光段；滚到这里时顶部导航自动转为深色文字。
- 字体层级：一级标题（UNKNOWN DESIGN / SELECTED WORKS / PROJECTS / 菜单与堆叠卡标题）Inter Display SemiBold；二级（主张句、Plane / Door / Light）Inter Display Medium；三级与正文 Inter Display / Inter Regular。均为 SIL OFL 开源可商用，文件在 `fonts/ud/`；中文用系统字体（苹方 / 微软雅黑）。原 Founders Grotesk、New Spirit 文件仍在 `fonts/`，已不再引用。
- Our Trip 页的大字图形原为深色填充，现统一改为浅色，暗底上清晰可读。

### 2. 文字规则
- 中文只出现在：工作室介绍、项目文案、项目标题。其余全部英文。
- 每页 `<html translate="no">` + `<meta name="google" content="notranslate">`，防止浏览器把英文自动翻译成中文（自动翻译会出现"A plane → 一架飞机"之类的错译）。

### 3. 项目结构（新增 `/projects/`）
- 顶部导航 PROJECT：**点击直接进入 `/projects/` 项目索引页**（不再显示悬停下拉），再点项目进入各自详情页。
- `/projects/` 采用错落编排：五张一组循环（大 → 小 → 中 → 宽 → 横幅），左右交错、上下错位，配大号编号。
- 首页 PROJECTS 大标题下方：最新 5 个项目的堆叠卡 + All Projects。
- 全屏菜单最后一张卡改为 All Projects → `/projects/`。
- About / History 页底部的折页堆叠卡已移除（项目入口统一在顶部 PROJECT 与首页）。

### 4. 新增一个项目（更新后的流程）
1. 复制 `story/xiaoxi/` 为 `story/新项目/`，替换内容（图片比例变量同步改）。
2. 在 `_astro/project-dropdown.js` 的 `PROJECTS` 加一条，含 `cn`（中文名）与 `date`。
   → 首页堆叠卡、`/projects/` 索引页自动更新。
3. 全屏菜单 `<ul class="main-links">` 如需展示新项目，仍按原方式手动加卡。

### 5. 滚动动效：`_astro/ud-motion.js`
首页暗底文字呼应 Our Trip 的阅读节奏：带 `data-ud-reveal` 的段落随滚动逐字点亮；带 `data-ud-drift` 的大字随滚动横向漂移；项目索引页图片带轻微视差。系统开启"减少动态效果"时自动停用。

### 6. 本地预览
双击上一级文件夹里的 `preview-v5.bat`（或在本目录运行 `python -m http.server 8942`），打开 http://127.0.0.1:8942/
