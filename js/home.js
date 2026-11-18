//Sets the size of the drawing grid for the tile previews and the outline color used in the illustration.
const PREVIEW_WIDTH = 240;
const PREVIEW_HEIGHT = 140;
const OUTLINE = "#7b8794";

//Lists the words shown in the word cloud preview, and a bigger weight draws a word bigger.
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

//Lists the studies shown in the bubble graph preview, where x and y set each circle's center and participants sets its size.
const previewStudies = [
  { participants: 120, x: 60, y: 41, color: "#4aa394" },
  { participants: 35, x: 135, y: 23, color: "#9ebfc7" },
  { participants: 95, x: 184, y: 65, color: "#f0965a" },
  { participants: 28, x: 128, y: 70, color: "#e2788a" },
  { participants: 80, x: 89, y: 107, color: "#8f86d9" },
];

//Lists the values shown in the matrix preview, where each inner list is one row and a value closer to 1 makes a darker cell.
const previewMatrix = [
  [0.35, 0.9, 0.3, 0.15],
  [0.3, 0.25, 0.45, 0.2],
  [0.85, 0.2, 0.5, 0.8],
];

//Draws the hero illustration and the three tile previews into their spots on the page.
drawHeroArt(d3.select("#hero-art"));
drawWordCloudPreview(d3.select("#preview-wordcloud"), previewWords);
drawBubblePreview(d3.select("#preview-bubbles"), previewStudies);
drawMatrixPreview(d3.select("#preview-matrix"), previewMatrix);

//Draws the hero illustration of the robot, the older man, and the heart.
function drawHeroArt(container) {
  //Sets the size of the illustration's grid, creates the SVG with a description for screen readers, and adds a place to store reusable effects.
  const width = 480;
  const height = 420;
  const svg = container.append("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("role", "img")
    .attr("aria-label", "A friendly robot holding hands with an older man, with a heart floating between them");
  const defs = svg.append("defs");

  //Draws the hatched background behind the figures.
  drawHatching(svg, defs);

  //Builds a mask that fades out the bottom edge of the figures.
  const bottomFade = defs.append("linearGradient")
    .attr("id", "hero-bottom-fade")
    .attr("x2", 0)
    .attr("y2", 1);
  bottomFade.append("stop").attr("offset", 0.93).attr("stop-color", "#fff");
  bottomFade.append("stop").attr("offset", 1).attr("stop-color", "#000");
  add(defs.append("mask").attr("id", "hero-figures-mask"), "rect", { width, height, fill: "url(#hero-bottom-fade)" });

  //Draws the robot and the older man inside the fading mask.
  const figures = svg.append("g").attr("mask", "url(#hero-figures-mask)");
  drawRobot(figures.append("g"));
  drawPerson(figures.append("g"));

  //Draws the heart, and the translate values set its position.
  add(svg, "path", {
    d: heartPath(13),
    transform: "translate(318,106)",
    fill: "#ffe1e6",
    stroke: "#e0566b",
    "stroke-width": 2.5,
    "stroke-linejoin": "round",
  });
}

//Draws the diagonal pencil-style hatching behind the figures.
function drawHatching(svg, defs) {
  //Defines a repeating pattern of thin tilted lines.
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

  //Creates a gradient that stays solid in the middle and fades out toward the edges.
  const fade = defs.append("radialGradient").attr("id", "hero-fade");
  fade.append("stop").attr("offset", 0.55).attr("stop-color", "#fff");
  fade.append("stop").attr("offset", 1).attr("stop-color", "#000");

  //Fills an oval with the line pattern and uses the gradient as a mask so the oval's edges fade away.
  const area = { cx: 262, cy: 200, rx: 215, ry: 188 };
  add(defs.append("mask").attr("id", "hero-mask"), "ellipse", { ...area, fill: "url(#hero-fade)" });
  add(svg, "ellipse", { ...area, fill: "url(#hero-hatch)", mask: "url(#hero-mask)" });
}

//Draws the robot.
function drawRobot(g) {
  //Sets the outline style and the curved path of the arm that reaches toward the man's hand.
  const line = { stroke: OUTLINE, "stroke-width": 2.5, "stroke-linejoin": "round" };
  const arm = "M238,248 C252,300 260,336 284,360";

  //Draws the robot's body.
  add(g, "path", { d: "M100,430 V262 Q100,212 150,212 H200 Q250,212 250,262 V430 Z", fill: "#fff", ...line });
  //Draws the arm hanging at the robot's side.
  add(g, "rect", { x: 95, y: 236, width: 32, height: 150, rx: 16, fill: "#fff", ...line });
  //Draws the reaching arm as a thick gray stroke with a thinner white stroke on top.
  add(g, "path", { d: arm, fill: "none", stroke: OUTLINE, "stroke-width": 33, "stroke-linecap": "round" });
  add(g, "path", { d: arm, fill: "none", stroke: "#fff", "stroke-width": 28, "stroke-linecap": "round" });
  //Draws the ring around the robot's neck.
  add(g, "rect", { x: 143, y: 198, width: 64, height: 18, rx: 9, fill: "#e8ecf1", ...line });
  //Draws the round helmet of the robot's head.
  add(g, "circle", { cx: 175, cy: 148, r: 58, fill: "#fff", ...line });
  //Draws the dark screen that makes up the robot's face.
  add(g, "rect", { x: 135, y: 115, width: 80, height: 70, rx: 26, fill: "#5d646e" });
  //Draws the robot's eyes.
  add(g, "ellipse", { cx: 161, cy: 143, rx: 4.5, ry: 6.5, fill: "#22262b" });
  add(g, "ellipse", { cx: 189, cy: 143, rx: 4.5, ry: 6.5, fill: "#22262b" });
  //Draws the robot's smile.
  add(g, "path", { d: "M160,160 Q175,177 190,160 Z", fill: "#fff" });
}

//Draws the older man facing forward.
function drawPerson(g) {
  //Sets the colors and line styles for his skin, sweater, hair, and face, plus the curved path of his reaching arm.
  const skin = { fill: "#f2c8a5", stroke: "#c99272", "stroke-width": 2 };
  const sweater = "#a9bdcf";
  const sweaterLine = "#7f95aa";
  const hairLine = "#9aa1aa";
  const feature = { fill: "none", "stroke-width": 2.2, "stroke-linecap": "round" };
  const arm = "M338,290 C322,314 310,338 304,358";

  //Draws his neck.
  add(g, "rect", { x: 383, y: 222, width: 22, height: 36, rx: 8, ...skin });
  //Draws his sweater and shoulders.
  add(g, "path", {
    d: "M320,430 L322,298 Q326,258 366,250 Q394,244 422,250 Q462,258 466,298 L468,430 Z",
    fill: sweater,
    stroke: sweaterLine,
    "stroke-width": 2.5,
    "stroke-linejoin": "round",
  });
  //Draws the line that marks his other arm resting at his side.
  add(g, "path", { d: "M452,304 C456,344 458,384 458,430", ...feature, stroke: sweaterLine });
  //Draws his white shirt collar.
  add(g, "path", { d: "M378,249 L394,276 L410,249", fill: "#f6f3ec", stroke: "#cfc8ba", "stroke-width": 2, "stroke-linejoin": "round" });
  //Draws the three cardigan buttons, and each number in the list is one button's height on the grid.
  g.append("g").selectAll("circle")
    .data([300, 326, 352])
    .join("circle")
      .attr("cx", 394)
      .attr("cy", d => d)
      .attr("r", 3.5)
      .attr("fill", sweaterLine);
  //Draws his reaching arm as a dark stroke with a lighter sweater-colored stroke on top.
  add(g, "path", { d: arm, fill: "none", stroke: sweaterLine, "stroke-width": 30, "stroke-linecap": "round" });
  add(g, "path", { d: arm, fill: "none", stroke: sweater, "stroke-width": 25, "stroke-linecap": "round" });
  //Draws his hand where it meets the robot's hand.
  add(g, "ellipse", { cx: 296, cy: 368, rx: 14, ry: 10, ...skin });

  //Draws his ears.
  add(g, "ellipse", { cx: 357, cy: 203, rx: 7, ry: 10, ...skin });
  add(g, "ellipse", { cx: 431, cy: 203, rx: 7, ry: 10, ...skin });
  //Draws his head.
  add(g, "ellipse", { cx: 394, cy: 196, rx: 37, ry: 41, ...skin });
  //Draws his gray hair.
  add(g, "path", {
    d: "M356,200 C350,170 362,147 394,147 C426,147 438,170 432,200 C429,188 424,180 416,176 "
      + "Q405,182 394,175 Q383,182 372,176 C364,180 359,188 356,200 Z",
    fill: "#c9ced5",
    stroke: hairLine,
    "stroke-width": 2,
    "stroke-linejoin": "round",
  });
  //Draws the small curls on top of his hair.
  add(g, "path", { d: "M375,160 q7,-5 14,0 M397,157 q7,-5 14,0", ...feature, stroke: hairLine });
  //Draws his eyebrows.
  add(g, "path", { d: "M371,188 Q378,184 385,187 M403,187 Q410,184 417,188", ...feature, stroke: hairLine, "stroke-width": 2.5 });
  //Draws his eyes.
  add(g, "ellipse", { cx: 378, cy: 198, rx: 3.2, ry: 3.8, fill: "#3b3f45" });
  add(g, "ellipse", { cx: 410, cy: 198, rx: 3.2, ry: 3.8, fill: "#3b3f45" });
  //Draws his nose.
  add(g, "path", { d: "M393,203 Q389,211 395,213", ...feature, stroke: "#c99272" });
  //Draws his smile.
  add(g, "path", { d: "M383,222 Q394,231 405,222", ...feature, stroke: "#a3613f" });
  //Draws his rosy cheeks.
  add(g, "circle", { cx: 371, cy: 214, r: 6, fill: "#f09d8f", opacity: 0.45 });
  add(g, "circle", { cx: 417, cy: 214, r: 6, fill: "#f09d8f", opacity: 0.45 });
}

//Draws the word cloud preview.
function drawWordCloudPreview(container, words) {
  //Sets the spacing, creates the SVG, and makes scales that pick each word's font size and color.
  const pad = 6;
  const gap = 6;
  const svg = previewSvg(container);
  const fontSize = d3.scaleSqrt(d3.extent(words, d => d.weight), [10, 20]);
  const color = d3.scaleOrdinal(["#5b7fd6", "#8a6fd0", "#7f97e3"]);

  //Adds one text element per word, biggest word first, and measures how wide each word is.
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

  //Row widths follow an ellipse so the words form an oval cloud.
  const rowHeight = fontSize.range()[1] * 1.05;
  const rows = d3.range(Math.floor((PREVIEW_HEIGHT - 2 * pad) / rowHeight)).map(i => {
    const y = pad + (i + 0.5) * rowHeight;
    const dy = (y - PREVIEW_HEIGHT / 2) / (PREVIEW_HEIGHT / 2 - pad);
    return { y, maxWidth: (PREVIEW_WIDTH - 2 * pad) * Math.sqrt(1 - dy * dy), words: [], used: 0 };
  });

  //Puts each word in the widest row that still has room, alternating sides so the biggest words stay in the middle.
  const widestFirst = d3.sort(rows, r => -r.maxWidth);
  for (const word of text.data()) {
    const row = widestFirst.find(r => r.used + (r.words.length ? gap : 0) + word.width <= r.maxWidth);
    if (!row) continue;
    row.used += (row.words.length ? gap : 0) + word.width;
    if (row.words.length % 2) row.words.unshift(word);
    else row.words.push(word);
  }

  //Works out the x and y position of every word so that each row is centered.
  for (const row of rows) {
    let x = (PREVIEW_WIDTH - row.used) / 2;
    for (const word of row.words) {
      word.x = x + word.width / 2;
      word.y = row.y;
      x += word.width + gap;
    }
  }

  //Removes the words that did not fit and moves the rest into place.
  text.filter(d => d.x === undefined).remove();
  text.filter(d => d.x !== undefined)
    .attr("x", d => d.x)
    .attr("y", d => d.y);
}

//Draws the bubble graph preview.
function drawBubblePreview(container, studies) {
  //Creates the SVG and a scale that turns participant counts into circle sizes, with the biggest circle getting a radius of 35.
  const svg = previewSvg(container);
  const radius = d3.scaleSqrt([0, d3.max(studies, d => d.participants)], [0, 35]);

  //Draws one circle per study at its x and y position, sized by its number of participants.
  svg.selectAll("circle")
    .data(studies)
    .join("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", d => radius(d.participants))
      .attr("fill", d => d.color)
      .attr("stroke", d => d3.color(d.color).darker(0.6))
      .attr("stroke-width", 1.5);
}

//Draws the matrix preview.
function drawMatrixPreview(container, rows) {
  //Sets the cell size, measures the grid, and makes a scale that turns each value into a shade of blue.
  const svg = previewSvg(container);
  const cell = 32;
  const gridWidth = rows[0].length * cell;
  const gridHeight = rows.length * cell;
  const color = d3.scaleSequential([0, 1], t => d3.interpolateBlues(0.12 + 0.68 * t));

  //Creates a group that centers the grid inside the preview.
  const grid = svg.append("g")
    .attr("transform", `translate(${(PREVIEW_WIDTH - gridWidth) / 2},${(PREVIEW_HEIGHT - gridHeight) / 2})`);

  //Draws one cell per value with a black border.
  grid.selectAll("rect")
    .data(rows.flatMap((row, r) => row.map((value, c) => ({ r, c, value }))))
    .join("rect")
      .attr("x", d => d.c * cell)
      .attr("y", d => d.r * cell)
      .attr("width", cell)
      .attr("height", cell)
      .attr("fill", d => color(d.value))
      .attr("stroke", "#000")
      .attr("stroke-width", 1.5);

  //Draws the thicker black border around the whole grid.
  grid.append("rect")
    .attr("width", gridWidth)
    .attr("height", gridHeight)
    .attr("fill", "none")
    .attr("stroke", "#000")
    .attr("stroke-width", 2.5);
}

//Creates an SVG that uses the shared 240 by 140 preview grid.
function previewSvg(container) {
  return container.append("svg").attr("viewBox", [0, 0, PREVIEW_WIDTH, PREVIEW_HEIGHT]);
}

//Builds the outline of a heart centered on 0,0, and size sets how big the heart is.
function heartPath(size) {
  //Traces the heart with four curves that start and end at its bottom point.
  const path = d3.path();
  path.moveTo(0, 0.7 * size);
  path.bezierCurveTo(-0.15 * size, 0.55 * size, -size, 0.1 * size, -size, -0.35 * size);
  path.bezierCurveTo(-size, -0.8 * size, -0.45 * size, -size, 0, -0.55 * size);
  path.bezierCurveTo(0.45 * size, -size, size, -0.8 * size, size, -0.35 * size);
  path.bezierCurveTo(size, 0.1 * size, 0.15 * size, 0.55 * size, 0, 0.7 * size);
  path.closePath();
  return path.toString();
}

//Adds a shape to the drawing and sets all of its attributes at once.
function add(parent, tag, attrs) {
  const node = parent.append(tag);
  for (const [name, value] of Object.entries(attrs)) node.attr(name, value);
  return node;
}
