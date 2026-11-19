export class WordCloud {
  constructor(containerSelector, options = {}) {
    this.container = typeof containerSelector === "string"
      ? document.querySelector(containerSelector)
      : containerSelector;

    if (!this.container) {
      throw new Error(`Container "${containerSelector}" not found.`);
    }

    // Configurable options with sensible defaults
    this.config = {
      file1: options.file1 || "file1.txt",
      file2: options.file2 || "file2.txt",
      label1: options.label1 || "File 1 Only",
      label2: options.label2 || "File 2 Only",
      labelBoth: options.labelBoth || "Both Files",
      colors: options.colors || ["#1f77b4", "#ff7f0e", "#2ca02c"],
      width: options.width || 800,
      height: options.height || 500,
      maxWords: options.maxWords || 150
    };

    this.categories = [
      { key: "file1", label: this.config.label1, color: this.config.colors[0] },
      { key: "file2", label: this.config.label2, color: this.config.colors[1] },
      { key: "both",  label: this.config.labelBoth, color: this.config.colors[2] }
    ];

    this.colorScale = d3.scaleOrdinal()
      .domain(this.categories.map(c => c.key))
      .range(this.categories.map(c => c.color));

    this.activeSources = new Set(this.categories.map(c => c.key));
    this.searchQuery = "";

    this.initDOM();
    this.loadAndRender();
  }

  initDOM() {
    // Use Shadow DOM to isolate component styles
    this.shadow = this.container.attachShadow({ mode: "open" });

    this.shadow.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: sans-serif;
          position: relative;
        }
        .controls {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 24px;
          margin-bottom: 14px;
        }
        .search-container {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        input {
          padding: 6px 10px;
          font-size: 14px;
          border: 1px solid #ccc;
          border-radius: 4px;
          width: 210px;
        }
        button {
          padding: 6px 10px;
          font-size: 13px;
          cursor: pointer;
          background: #f2f2f2;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .legend {
          display: flex;
          gap: 18px;
          user-select: none;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: opacity 0.2s;
        }
        .legend-item.inactive {
          opacity: 0.35;
          text-decoration: line-through;
        }
        .legend-swatch {
          width: 14px;
          height: 14px;
          border-radius: 3px;
        }
        .tooltip {
          position: fixed;
          pointer-events: none;
          background: rgba(20, 20, 20, 0.9);
          color: #fff;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 13px;
          line-height: 1.4;
          opacity: 0;
          transition: opacity 0.15s;
          z-index: 1000;
        }
        text.word {
          cursor: pointer;
          transition: opacity 0.2s, stroke 0.2s;
        }
      </style>

      <div class="controls">
        <div class="search-container">
          <input type="text" class="search-input" placeholder="Search or highlight words..." />
          <button type="button" class="clear-btn">Clear</button>
        </div>
        <div class="legend"></div>
      </div>
      <div class="canvas"></div>
      <div class="tooltip"></div>
    `;
  }

  async loadAndRender() {
    const [text1, text2] = await Promise.all([
      d3.text(this.config.file1),
      d3.text(this.config.file2)
    ]);

    const words1 = text1.trim().split(/\s+/).filter(Boolean);
    const words2 = text2.trim().split(/\s+/).filter(Boolean);
    const wordMap = new Map();

    words1.forEach(w => {
      const entry = wordMap.get(w) || { text: w, count1: 0, count2: 0 };
      entry.count1 += 1;
      wordMap.set(w, entry);
    });

    words2.forEach(w => {
      const entry = wordMap.get(w) || { text: w, count1: 0, count2: 0 };
      entry.count2 += 1;
      wordMap.set(w, entry);
    });

    const combinedWords = Array.from(wordMap.values())
      .map(d => {
        let source = "both";
        if (d.count1 > 0 && d.count2 === 0) source = "file1";
        else if (d.count2 > 0 && d.count1 === 0) source = "file2";

        return {
          text: d.text,
          count1: d.count1,
          count2: d.count2,
          total: d.count1 + d.count2,
          source
        };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, this.config.maxWords);

    const maxCount = d3.max(combinedWords, d => d.total) || 1;
    const fontSizeScale = d3.scaleSqrt()
      .domain([1, maxCount])
      .range([14, 80]);

    d3.layout.cloud()
      .size([this.config.width, this.config.height])
      .words(combinedWords)
      .padding(4)
      .rotate(() => (Math.random() > 0.5 ? 0 : 90))
      .font("sans-serif")
      .fontSize(d => fontSizeScale(d.total))
      .on("end", placedWords => this.draw(placedWords))
      .start();
  }

  draw(placedWords) {
    const root = d3.select(this.shadow);
    const tooltip = root.select(".tooltip");

    const wordElements = root.select(".canvas")
      .append("svg")
      .attr("width", this.config.width)
      .attr("height", this.config.height)
      .append("g")
      .attr("transform", `translate(${this.config.width / 2},${this.config.height / 2})`)
      .selectAll("text")
      .data(placedWords)
      .join("text")
      .attr("class", "word")
      .style("font-size", d => `${d.size}px`)
      .style("font-family", "sans-serif")
      .style("fill", d => this.colorScale(d.source))
      .attr("text-anchor", "middle")
      .attr("transform", d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
      .text(d => d.text)
      .on("mouseover", (event, d) => {
        d3.select(event.currentTarget).style("font-weight", "bold");
        tooltip
          .style("opacity", 1)
          .html(`
            <strong>${d.text}</strong><br/>
            ${this.config.file1}: ${d.count1}<br/>
            ${this.config.file2}: ${d.count2}<br/>
            Total: ${d.total}
          `);
      })
      .on("mousemove", event => {
        tooltip
          .style("left", `${event.clientX + 12}px`)
          .style("top", `${event.clientY - 28}px`);
      })
      .on("mouseout", (event, d) => {
        const isMatch = this.searchQuery && d.text.toLowerCase().includes(this.searchQuery);
        d3.select(event.currentTarget).style("font-weight", isMatch ? "bold" : "normal");
        tooltip.style("opacity", 0);
      });

    const updateHighlights = () => {
      wordElements
        .style("opacity", d => {
          if (!this.activeSources.has(d.source)) return 0.08;
          if (!this.searchQuery) return 1;
          return d.text.toLowerCase().includes(this.searchQuery) ? 1 : 0.12;
        })
        .style("font-weight", d => {
          const isMatch = this.searchQuery && this.activeSources.has(d.source) && d.text.toLowerCase().includes(this.searchQuery);
          return isMatch ? "bold" : "normal";
        })
        .style("stroke", d => {
          const isMatch = this.searchQuery && this.activeSources.has(d.source) && d.text.toLowerCase().includes(this.searchQuery);
          return isMatch ? "#111" : "none";
        })
        .style("stroke-width", d => {
          const isMatch = this.searchQuery && this.activeSources.has(d.source) && d.text.toLowerCase().includes(this.searchQuery);
          return isMatch ? "0.75px" : "0px";
        });
    };

    const searchInput = root.select(".search-input");
    searchInput.on("input", event => {
      this.searchQuery = event.target.value.trim().toLowerCase();
      updateHighlights();
    });

    root.select(".clear-btn").on("click", () => {
      searchInput.property("value", "");
      this.searchQuery = "";
      updateHighlights();
    });

    const legendItems = root.select(".legend")
      .selectAll(".legend-item")
      .data(this.categories)
      .join("div")
      .attr("class", "legend-item")
      .on("click", (event, category) => {
        if (this.activeSources.has(category.key)) {
          this.activeSources.delete(category.key);
          d3.select(event.currentTarget).classed("inactive", true);
        } else {
          this.activeSources.add(category.key);
          d3.select(event.currentTarget).classed("inactive", false);
        }
        updateHighlights();
      });

    legendItems.append("div")
      .attr("class", "legend-swatch")
      .style("background-color", d => d.color);

    legendItems.append("span")
      .text(d => d.label);
  }
}
