(() => {
  // ../gridworld.js
  var GridWorld = class {
    /** @param {number} cols
     * @param {number} rows
     */
    constructor(cols, rows) {
      this.cols = cols;
      this.rows = rows;
      this.walls = /* @__PURE__ */ new Set();
    }
    /** convert from col, row to id
        @returns {number} */
    toId(col, row) {
      return col + row * this.cols;
    }
    /** convert from id to {col, row}
        @param {number} id
        @returns {{col: number, row: number}} */
    fromId(id) {
      let col = id % this.cols, row = Math.floor(id / this.cols);
      return { col, row };
    }
    /** true if the given col, row is part of this grid 
        @returns {bool} */
    inRange(col, row) {
      return 0 <= col && col < this.cols && 0 <= row && row < this.rows;
    }
    /** toggle whether there's a wall at this location */
    toggleWall(col, row) {
      let id = this.toId(col, row);
      if (this.walls.has(id)) {
        this.walls.delete(id);
      } else {
        this.walls.add(id);
      }
    }
    /** ids of the neighbors of a given tile id 
        @param {number} id
        @returns {Array<number>} */
    neighbors(id) {
      let { col, row } = this.fromId(id);
      let neighbors = [];
      let candidates = [[col + 1, row], [col - 1, row], [col, row + 1], [col, row - 1]];
      for (let [c, r] of candidates) {
        if (this.inRange(c, r) && !this.walls.has(this.toId(c, r))) {
          neighbors.push(this.toId(c, r));
        }
      }
      return neighbors;
    }
    /** @returns {Array<{col: number, row: number}>} - list of locations in the grid */
    locations() {
      let result = [];
      for (let col = 0; col < this.cols; col++) {
        for (let row = 0; row < this.rows; row++) {
          result.push({ col, row });
        }
      }
      return result;
    }
  };
  function breadthFirstSearch(gridWorld, startId, stepLimit = Infinity) {
    let count = 0;
    let frontier = [startId];
    let explored = [startId];
    while (frontier.length > 0 && count++ < stepLimit) {
      let currentId = frontier.shift();
      for (let nextId of gridWorld.neighbors(currentId)) {
        if (explored.indexOf(nextId) < 0) {
          frontier.push(nextId);
          explored.push(nextId);
        }
      }
    }
    return { frontier, explored };
  }

  // starter-page-react-18.jsx
  function makeBfsDiagram(parentElement, cols, rows, startCol, startRow) {
    let gridWorld = new GridWorld(cols, rows);
    let startId = gridWorld.toId(startCol, startRow);
    let bfsResults = { frontier: [], explored: [] };
    let stepLimit = 0;
    function clickEvent(col, row) {
      gridWorld.toggleWall(col, row);
      redraw();
    }
    function setSlider(e) {
      stepLimit = e.target.valueAsNumber;
      redraw();
    }
    function makeHtml() {
      let rects = [];
      for (let { col, row } of gridWorld.locations()) {
        let id = gridWorld.toId(col, row);
        let className = gridWorld.walls.has(id) ? "wall" : bfsResults.frontier.indexOf(id) >= 0 ? "frontier" : bfsResults.explored.indexOf(id) >= 0 ? "explored" : "";
        rects.push(/* @__PURE__ */ React.createElement(
          "rect",
          {
            className: "cell " + className,
            key: col + "," + row,
            x: col,
            y: row,
            width: "1",
            height: "1",
            onClick: () => clickEvent(col, row)
          }
        ));
      }
      return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("svg", { viewBox: `0 0 ${cols} ${rows}` }, rects), /* @__PURE__ */ React.createElement("p", null, "Time: ", /* @__PURE__ */ React.createElement(
        "input",
        {
          type: "range",
          min: "0",
          max: cols * rows - gridWorld.walls.size,
          value: stepLimit,
          onChange: setSlider
        }
      )));
    }
    function redraw() {
      bfsResults = breadthFirstSearch(gridWorld, startId, stepLimit);
      ReactDOM.render(makeHtml(), parentElement);
    }
    redraw();
  }
  makeBfsDiagram(document.querySelector("#diagram1"), 23, 9, 5, 2);
})();
