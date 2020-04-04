/*
 * From https://www.redblobgames.com/x/2014-starter-page/vanilla/
 * Copyright 2020 Red Blob Games <redblobgames@gmail.com>
 * License: Apache-2.0 <http://www.apache.org/licenses/LICENSE-2.0.html>
 */
'use strict';

console.info("I'm happy to answer questions about the code; email me at redblobgames@gmail.com");

class GridWorld {
    constructor(cols, rows) {
        this.cols = cols;
        this.rows = rows;
    }

    /** convert from col, row to id */
    toId(col, row) {
        return col + row * this.cols;
    }

    /** convert from id to {col, row} */
    fromId(id) {
        let col = id % this.cols,
            row = Math.floor(id / this.cols);
        return {col, row};
    }

    /** true if the given col, row is part of this grid */
    inRange(col, row) {
        return 0 <= col && col < this.cols
            && 0 <= row && row < this.rows;
    }

    /** ids of the neighbors of a given tile id */
    neighbors(id) {
        let {col, row} = this.fromId(id);
        let neighbors = [];
        let candidates = [[col+1, row], [col-1, row], [col, row+1], [col, row-1]];
        for (let [c, r] of candidates) {
            if (this.inRange(c, r)) {
                neighbors.push(this.toId(c, r));
            }
        }
        return neighbors;
    }

    /** list of {col, row} locations in the grid */
    locations() {
        let result = [];
        for (let col = 0; col < this.cols; col++) {
            for (let row = 0; row < this.rows; row++) {
                result.push({col, row});
            }
        }
        return result;
    }
}


const gridWorld = new GridWorld(23, 9);


/* document.createElement creates html elements only, not svg, so we need to use this instead;
   libraries like d3 and vue will do this for us automatically */
function createSvgElement(name) {
    return document.createElementNS("http://www.w3.org/2000/svg", name);
}


class DrawGrid {
    /* parentElement should be an <svg> or <g> element;
       grid should be the GridWorld

       The drawn grid will have size cols X rows. This means each box
       is 1x1, which is convenient, except when you want to set
       outline widths (maybe 0.02px instead of the usual 1px) and font
       sizes (maybe 0.8px instead of the usual 16px). An alternative
       would be to make the boxes larger so that outlines/fonts are
       normal. */
    constructor (parentElement, grid) {
        this.grid = grid;

        /* create one <rect> for each location in the grid, and keep track of them */
        this.rects = new Map();
        for (let {col, row} of grid.locations()) {
            let id = grid.toId(col, row);
            let rect = createSvgElement("rect");
            rect.setAttribute("class", "cell" + id);
            rect.setAttribute("x", col);
            rect.setAttribute("y", row);
            rect.setAttribute("width", 1);
            rect.setAttribute("height", 1);
            this.rects.set(id, rect);
            parentElement.appendChild(rect);
        }
    }

    /** state should be a function from location id to a css class string
        (space separated if you want multiple classes to apply); this
        method will set the each grid square to have its corresponding
        css class */
    update(state) {
        for (let [id, rect] of this.rects.entries()) {
            let cssClass = state(id);
            rect.setAttribute("class", "cell " + cssClass);
        }
    }
}

let diagram1 = document.querySelector("#diagram1");
diagram1.setAttribute("viewBox", `0 0 ${gridWorld.cols} ${gridWorld.rows}`);
let drawnGrid = new DrawGrid(diagram1, gridWorld);

let startId = gridWorld.toId(5, 2);

function breadthFirstSearch(grid, startId, stepLimit=Infinity) {
  let count = 0;
  let frontier = [startId];
  let explored = [startId];
  while (frontier.length > 0 && count++ < stepLimit) {
    let currentId = frontier.shift();
    for (let nextId of grid.neighbors(currentId)) {
      if (explored.indexOf(nextId) < 0) {
        frontier.push(nextId);
        explored.push(nextId);
      }
    }
  }
  return {frontier, explored};
}

function redraw(stepLimit) {
    let bfsResults = breadthFirstSearch(gridWorld, startId, stepLimit);
    drawnGrid.update(id =>
        bfsResults.frontier.indexOf(id) >= 0? "frontier"
            : bfsResults.explored.indexOf(id) >= 0? "explored"
            : "");
}

let slider = document.querySelector("#time");
slider.addEventListener("input", () => redraw(slider.valueAsNumber));
slider.setAttribute("max", gridWorld.cols * gridWorld.rows);
redraw(0);
