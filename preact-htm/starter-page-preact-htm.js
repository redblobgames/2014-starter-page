/*
 * From https://www.redblobgames.com/x/2014-starter-page/
 * Copyright 2020 Red Blob Games <redblobgames@gmail.com>
 * License: Apache-2.0 <http://www.apache.org/licenses/LICENSE-2.0.html>
 */

import { html, render } from 'https://unpkg.com/htm/preact/standalone.module.js';
import {GridWorld, breadthFirstSearch} from '../gridworld.js';

/**
 * Make an interactive bfs diagram on the page
 *
 * @param {HTMLElement} parentElement - where to place the diagram and slider
 * @param {number} cols
 * @param {number} rows
 * @param {number} startCol - where bfs will start
 * @param {number} startRow
 */
function makeBfsDiagram(parentElement, cols, rows, startCol, startRow) {
    let gridWorld = new GridWorld(cols, rows);
    let startId = gridWorld.toId(startCol, startRow);
    let bfsResults = {frontier: [], explored: []};
    let stepLimit = 0;

    /* If anything changes, update our data and then redraw */
    
    function clickEvent(col, row) {
        gridWorld.toggleWall(col, row);
        redraw();
    }

    function setSlider(event) {
        stepLimit = event.target.valueAsNumber;
        redraw();
    }

    /* The drawn grid will have size cols X rows. This means each box
       is 1x1, which is convenient, except when you want to set
       outline widths (maybe 0.02px instead of the usual 1px) and font
       sizes (maybe 0.8px instead of the usual 16px). An alternative
       would be to make the boxes larger so that outlines/fonts are
       normal. */
    
    function makeHtml() {
        let rects = [];
        for (let {col, row} of gridWorld.locations()) {
            let id = gridWorld.toId(col, row);
            let className = gridWorld.walls.has(id) ? "wall"
                : bfsResults.frontier.indexOf(id) >= 0 ? "frontier"
                : bfsResults.explored.indexOf(id) >= 0 ? "explored"
                : "";
            rects.push(html`<rect class="cell ${className}"
                              x=${col} y=${row} width=1 height=1
                              onclick=${() => clickEvent(col, row)} />`);
        }
        
        return html`
             <svg viewBox="0 0 ${cols} ${rows}">
               ${rects}
             </svg>
             <p>
               Time: <input type=range 
                      min=0 max=${cols*rows - gridWorld.walls.size} 
                      value=${stepLimit} oninput=${setSlider} />
             </p>`;
    }

    function redraw() {
        bfsResults = breadthFirstSearch(gridWorld, startId, stepLimit);
        render(makeHtml(), parentElement);
    }

    redraw();
}


makeBfsDiagram(document.querySelector("#diagram1"), 23, 9, 5, 2);
