/*
 * From https://www.redblobgames.com/x/2014-starter-page/
 * Copyright 2020 Red Blob Games <redblobgames@gmail.com>
 * License: Apache-2.0 <http://www.apache.org/licenses/LICENSE-2.0.html>
 */
'use strict';

import {GridWorld, breadthFirstSearch} from '../gridworld.js';

/** Create an SVG element.
    
    @param {string} name - the tag name, e.g. "rect" will create a <rect> element
    @returns {SVGElement}

    document.createElement creates html elements only, not svg, so we
    need to use this instead; libraries like d3 and vue will do this
    for us automatically */
function createSvgElement(name) {
    return document.createElementNS("http://www.w3.org/2000/svg", name);
}


class DrawGrid {
    /**
       @param {SVGElement} parentElement - should be an <svg> or <g> element
       @param {GridWorld} gridWorld
       @param {(id: number) => string} stateToCssClass - a function from
       location id to a css class string (space separated if you
       want multiple classes to apply)
       @param {(col: number, row: number) => ()) onClick - a function that
       will be called when a grid cell is clicked

       The drawn grid will have size cols X rows. This means each box
       is 1x1, which is convenient, except when you want to set
       outline widths (maybe 0.02px instead of the usual 1px) and font
       sizes (maybe 0.8px instead of the usual 16px). An alternative
       would be to make the boxes larger so that outlines/fonts are
       normal. */
    constructor (parentElement, gridWorld, stateToCssClass, onClick) {
        this.gridWorld = gridWorld;
        this.stateToCssClass = stateToCssClass;
        
        /** @type {Map<number, SVGElement>} - create one <rect> for each
         * location in the grid, and keep track of them */
        this.rects = new Map();

        for (let {col, row} of gridWorld.locations()) {
            let id = gridWorld.toId(col, row);
            let rect = createSvgElement("rect");
            rect.setAttribute("class", "cell");
            rect.setAttribute("x", col);
            rect.setAttribute("y", row);
            rect.setAttribute("width", 1);
            rect.setAttribute("height", 1);
            rect.addEventListener("click", () => onClick(col, row));
            this.rects.set(id, rect);
            parentElement.appendChild(rect);
        }
        this.redraw();
    }

    redraw() {
        for (let [id, rect] of this.rects.entries()) {
            let cssClass = this.stateToCssClass(id);
            rect.setAttribute("class", "cell " + cssClass);
        }
    }
}


class BfsDiagram {
    constructor (parentElement, cols, rows, startCol, startRow) {
        let svg = createSvgElement("svg");
        svg.setAttribute("viewBox", `0 0 ${cols} ${rows}`);
        parentElement.appendChild(svg);

        let sliderParent = document.createElement("p");
        let label = document.createTextNode("Time: ");
        sliderParent.appendChild(label);
        
        this.slider = document.createElement("input");
        this.slider.setAttribute("type", "range");
        this.slider.setAttribute("min", 0);
        this.slider.setAttribute("value", 0);
        this.slider.addEventListener("input",
                                     () => this.redraw(this.slider.valueAsNumber));
        sliderParent.appendChild(this.slider);
        parentElement.appendChild(sliderParent);
        
        this.gridWorld = new GridWorld(cols, rows);
        this.startId = this.gridWorld.toId(startCol, startRow);
        this.bfsResults = {frontier: [], explored: []};
        
        this.gridRender = new DrawGrid(svg, this.gridWorld,
                                       id => this.gridWorld.walls.has(id) ? "wall"
                                       : this.bfsResults.frontier.indexOf(id) >= 0 ? "frontier"
                                       : this.bfsResults.explored.indexOf(id) >= 0 ? "explored"
                                       : "",
                                       (col, row) => this.clickEvent(col, row));
        

        this.redraw();
    }

    /** called by DrawGrid class when clicking on a cell */
    clickEvent(col, row) {
        this.gridWorld.toggleWall(col, row);
        this.redraw();
    }
    
    redraw() {
        let stepLimit = this.slider.valueAsNumber;
        this.slider.setAttribute("max", this.gridWorld.cols * this.gridWorld.rows - this.gridWorld.walls.size);
        this.bfsResults = breadthFirstSearch(this.gridWorld, this.startId, stepLimit);
        this.gridRender.redraw();
    }
}


let diagram1 = new BfsDiagram(document.querySelector("#diagram1"), 23, 9, 5, 2);
