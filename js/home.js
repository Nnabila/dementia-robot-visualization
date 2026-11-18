const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const PREVIEW_WIDTH = 240;
const PREVIEW_HEIGHT = 140;
const OUTLINE = "#7b8794";

const previewWords = [
  { text: "social", weight: 10 },
  { text: "engagement", weight: 9 },
  { text: "mood", weight: 8 },
  { text: "interaction", weight: 7 },
  { text: "cognitive", weight: 6 },
  { text: "agitation", weight: 6 },
  { text: "wellbeing", weight: 6 },
  { text: "communication", weight: 5 },
  { text: "loneliness", weight: 5 },
  { text: "caregiver", weight: 4 },
  { text: "behavior", weight: 4 },
  { text: "positive", weight: 3 },
  { text: "reduction", weight: 3 },
];

const previewStudies = [
  { participants: 120, x: 60, y: 41, color: "#4aa394" },
  { participants: 35, x: 135, y: 23, color: "#9ebfc7" },
  { participants: 95, x: 184, y: 65, color: "#f0965a" },
  { participants: 28, x: 128, y: 70, color: "#e2788a" },
  { participants: 80, x: 89, y: 107, color: "#8f86d9" },
];

const previewMatrix = [
  [0.35, 0.9, 0.3, 0.15],
  [0.3, 0.25, 0.45, 0.2],
  [0.85, 0.2, 0.5, 0.8],
];

drawHeroArt(d3.select("#hero-art"));
drawWordCloudPreview(d3.select("#preview-wordcloud"), previewWords);
drawBubblePreview(d3.select("#preview-bubbles"), previewStudies);
drawMatrixPreview(d3.select("#preview-matrix"), previewMatrix);

function drawHeroArt(container) {
  const width = 480;
  const height = 420;
  const svg = container.append("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("role", "img")
    .attr("aria-label", "A friendly robot holding hands with an older man, with a heart floating between them");
  const defs = svg.append("defs");

  drawHatching(svg, defs);

  const bottomFade = defs.append("linearGradient")
    .attr("id", "hero-bottom-fade")
    .attr("x2", 0)
    .attr("y2", 1);
  bottomFade.append("stop").attr("offset", 0.93).attr("stop-color", "#fff");
  bottomFade.append("stop").attr("offset", 1).attr("stop-color", "#000");
  add(defs.append("mask").attr("id", "hero-figures-mask"), "rect", { width, height, fill: "url(#hero-bottom-fade)" });

  const figures = svg.append("g").attr("mask", "url(#hero-figures-mask)");
  drawRobot(figures.append("g"));
  drawPerson(figures.append("g"));

  add(svg, "path", {
    d: heartPath(13),
    transform: "translate(318,106)",
    fill: "#ffe1e6",
    stroke: "#e0566b",
    "stroke-width": 2.5,
    "stroke-linejoin": "round",
  });
}

function drawHatching(svg, defs) {
  defs.append("pattern")
      .attr("id", "hero-hatch")
      .attr("width", 9)
      .attr("height", 9)
      .attr("patternUnits", "userSpaceOnUse")
      .attr("patternTransform", "rotate(30)")
    .append("line")
      .attr("x1", 4.5)
      .attr("x2", 4.5)
      .attr("y2", 9)
      .attr("stroke", "#d8dee6")
      .attr("stroke-width", 2);

  const fade = defs.append("radialGradient").attr("id", "hero-fade");
  fade.append("stop").attr("offset", 0.55).attr("stop-color", "#fff");
  fade.append("stop").attr("offset", 1).attr("stop-color", "#000");

  const area = { cx: 262, cy: 200, rx: 215, ry: 188 };
  add(defs.append("mask").attr("id", "hero-mask"), "ellipse", { ...area, fill: "url(#hero-fade)" });
  add(svg, "ellipse", { ...area, fill: "url(#hero-hatch)", mask: "url(#hero-mask)" });
}

function drawRobot(g) {
  const line = { stroke: OUTLINE, "stroke-width": 2.5, "stroke-linejoin": "round" };
  const arm = "M238,248 C252,300 260,336 284,360";

  add(g, "path", { d: "M100,430 V262 Q100,212 150,212 H200 Q250,212 250,262 V430 Z", fill: "#fff", ...line });
  add(g, "rect", { x: 95, y: 236, width: 32, height: 150, rx: 16, fill: "#fff", ...line });
  add(g, "path", { d: arm, fill: "none", stroke: OUTLINE, "stroke-width": 33, "stroke-linecap": "round" });
  add(g, "path", { d: arm, fill: "none", stroke: "#fff", "stroke-width": 28, "stroke-linecap": "round" });
  add(g, "rect", { x: 143, y: 198, width: 64, height: 18, rx: 9, fill: "#e8ecf1", ...line });
  add(g, "circle", { cx: 175, cy: 148, r: 58, fill: "#fff", ...line });
  add(g, "rect", { x: 135, y: 115, width: 80, height: 70, rx: 26, fill: "#5d646e" });
  add(g, "ellipse", { cx: 161, cy: 143, rx: 4.5, ry: 6.5, fill: "#22262b" });
  add(g, "ellipse", { cx: 189, cy: 143, rx: 4.5, ry: 6.5, fill: "#22262b" });
  add(g, "path", { d: "M160,160 Q175,177 190,160 Z", fill: "#fff" });
}

function drawPerson(g) {
  const skin = { fill: "#f2c8a5", stroke: "#c99272", "stroke-width": 2 };
  const sweater = "#a9bdcf";
  const sweaterLine = "#7f95aa";
  const hairLine = "#9aa1aa";
  const feature = { fill: "none", "stroke-width": 2.2, "stroke-linecap": "round" };
  const arm = "M338,290 C322,314 310,338 304,358";

  add(g, "rect", { x: 383, y: 222, width: 22, height: 36, rx: 8, ...skin });
  add(g, "path", {
    d: "M320,430 L322,298 Q326,258 366,250 Q394,244 422,250 Q462,258 466,298 L468,430 Z",
    fill: sweater,
    stroke: sweaterLine,
    "stroke-width": 2.5,
    "stroke-linejoin": "round",
  });
  add(g, "path", { d: "M452,304 C456,344 458,384 458,430", ...feature, stroke: sweaterLine });
  add(g, "path", { d: "M378,249 L394,276 L410,249", fill: "#f6f3ec", stroke: "#cfc8ba", "stroke-width": 2, "stroke-linejoin": "round" });
  g.append("g").selectAll("circle")
    .data([300, 326, 352])
    .join("circle")
      .attr("cx", 394)
      .attr("cy", d => d)
      .attr("r", 3.5)
      .attr("fill", sweaterLine);
  add(g, "path", { d: arm, fill: "none", stroke: sweaterLine, "stroke-width": 30, "stroke-linecap": "round" });
  add(g, "path", { d: arm, fill: "none", stroke: sweater, "stroke-width": 25, "stroke-linecap": "round" });
  add(g, "ellipse", { cx: 296, cy: 368, rx: 14, ry: 10, ...skin });

  add(g, "ellipse", { cx: 357, cy: 203, rx: 7, ry: 10, ...skin });
  add(g, "ellipse", { cx: 431, cy: 203, rx: 7, ry: 10, ...skin });
  add(g, "ellipse", { cx: 394, cy: 196, rx: 37, ry: 41, ...skin });
  add(g, "path", {
    d: "M356,200 C350,170 362,147 394,147 C426,147 438,170 432,200 C429,188 424,180 416,176 "
      + "Q405,182 394,175 Q383,182 372,176 C364,180 359,188 356,200 Z",
    fill: "#c9ced5",
    stroke: hairLine,
    "stroke-width": 2,
    "stroke-linejoin": "round",
  });
  add(g, "path", { d: "M375,160 q7,-5 14,0 M397,157 q7,-5 14,0", ...feature, stroke: hairLine });
  add(g, "path", { d: "M371,188 Q378,184 385,187 M403,187 Q410,184 417,188", ...feature, stroke: hairLine, "stroke-width": 2.5 });
  add(g, "ellipse", { cx: 378, cy: 198, rx: 3.2, ry: 3.8, fill: "#3b3f45" });
  add(g, "ellipse", { cx: 410, cy: 198, rx: 3.2, ry: 3.8, fill: "#3b3f45" });
  add(g, "path", { d: "M393,203 Q389,211 395,213", ...feature, stroke: "#c99272" });
  add(g, "path", { d: "M383,222 Q394,231 405,222", ...feature, stroke: "#a3613f" });
  add(g, "circle", { cx: 371, cy: 214, r: 6, fill: "#f09d8f", opacity: 0.45 });
  add(g, "circle", { cx: 417, cy: 214, r: 6, fill: "#f09d8f", opacity: 0.45 });
}

function drawWordCloudPreview(container, words) {
  const pad = 6;
  const gap = 6;
  const svg = previewSvg(container);
  const fontSize = d3.scaleSqrt(d3.extent(words, d => d.weight), [10, 20]);
  const color = d3.scaleOrdinal(["#5b7fd6", "#8a6fd0", "#7f97e3"]);

  const text = svg.selectAll("text")
    .data(words.map(d => ({ ...d, size: fontSize(d.weight) })).sort((a, b) => b.size - a.size))
    .join("text")
      .attr("font-size", d => d.size)
      .attr("font-weight", 600)
      .attr("fill", (d, i) => color(i))
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .text(d => d.text)
      .each(function (d) { d.width = this.getComputedTextLength(); });

  // Row widths follow an ellipse so the words form an oval cloud.
  const rowHeight = fontSize.range()[1] * 1.05;
  const rows = d3.range(Math.floor((PREVIEW_HEIGHT - 2 * pad) / rowHeight)).map(i => {
    const y = pad + (i + 0.5) * rowHeight;
    const dy = (y - PREVIEW_HEIGHT / 2) / (PREVIEW_HEIGHT / 2 - pad);
    return { y, maxWidth: (PREVIEW_WIDTH - 2 * pad) * Math.sqrt(1 - dy * dy), words: [], used: 0 };
  });

  const widestFirst = d3.sort(rows, r => -r.maxWidth);
  for (const word of text.data()) {
    const row = widestFirst.find(r => r.used + (r.words.length ? gap : 0) + word.width <= r.maxWidth);
    if (!row) continue;
    row.used += (row.words.length ? gap : 0) + word.width;
    if (row.words.length % 2) row.words.unshift(word);
    else row.words.push(word);
  }

  for (const row of rows) {
    let x = (PREVIEW_WIDTH - row.used) / 2;
    for (const word of row.words) {
      word.x = x + word.width / 2;
      word.y = row.y;
      x += word.width + gap;
    }
  }

  text.filter(d => d.x === undefined).remove();
  const placed = text.filter(d => d.x !== undefined)
    .attr("x", d => d.x)
    .attr("y", d => d.y);
  enter(placed, "opacity", 0, 1, 40);
}

function drawBubblePreview(container, studies) {
  const svg = previewSvg(container);
  const radius = d3.scaleSqrt([0, d3.max(studies, d => d.participants)], [0, 35]);

  const circles = svg.selectAll("circle")
    .data(studies)
    .join("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("fill", d => d.color)
      .attr("stroke", d => d3.color(d.color).darker(0.6))
      .attr("stroke-width", 1.5);
  enter(circles, "r", 0, d => radius(d.participants), 80);
}

function drawMatrixPreview(container, rows) {
  const svg = previewSvg(container);
  const cell = 32;
  const gridWidth = rows[0].length * cell;
  const gridHeight = rows.length * cell;
  const color = d3.scaleSequential([0, 1], t => d3.interpolateBlues(0.12 + 0.68 * t));

  const grid = svg.append("g")
    .attr("transform", `translate(${(PREVIEW_WIDTH - gridWidth) / 2},${(PREVIEW_HEIGHT - gridHeight) / 2})`);

  const cells = grid.selectAll("rect")
    .data(rows.flatMap((row, r) => row.map((value, c) => ({ r, c, value }))))
    .join("rect")
      .attr("x", d => d.c * cell)
      .attr("y", d => d.r * cell)
      .attr("width", cell)
      .attr("height", cell)
      .attr("fill", d => color(d.value))
      .attr("stroke", "#000")
      .attr("stroke-width", 1.5);
  enter(cells, "opacity", 0, 1, 40);

  grid.append("rect")
    .attr("width", gridWidth)
    .attr("height", gridHeight)
    .attr("fill", "none")
    .attr("stroke", "#000")
    .attr("stroke-width", 2.5);
}

function previewSvg(container) {
  return container.append("svg").attr("viewBox", [0, 0, PREVIEW_WIDTH, PREVIEW_HEIGHT]);
}

function enter(selection, attr, from, to, stagger) {
  if (reduceMotion) return selection.attr(attr, to);
  selection.attr(attr, from)
    .transition()
      .delay((d, i) => 150 + i * stagger)
      .duration(600)
      .ease(d3.easeCubicOut)
      .attr(attr, to);
}

function heartPath(size) {
  const path = d3.path();
  path.moveTo(0, 0.7 * size);
  path.bezierCurveTo(-0.15 * size, 0.55 * size, -size, 0.1 * size, -size, -0.35 * size);
  path.bezierCurveTo(-size, -0.8 * size, -0.45 * size, -size, 0, -0.55 * size);
  path.bezierCurveTo(0.45 * size, -size, size, -0.8 * size, size, -0.35 * size);
  path.bezierCurveTo(size, 0.1 * size, 0.15 * size, 0.55 * size, 0, 0.7 * size);
  path.closePath();
  return path.toString();
}

function add(parent, tag, attrs) {
  const node = parent.append(tag);
  for (const [name, value] of Object.entries(attrs)) node.attr(name, value);
  return node;
}
