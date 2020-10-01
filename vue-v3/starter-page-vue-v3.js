/*
 * From https://www.redblobgames.com/x/2014-starter-page/vue-v2/
 * Copyright 2020 Red Blob Games <redblobgames@gmail.com>
 * License: Apache-2.0 <http://www.apache.org/licenses/LICENSE-2.0.html>
 */
'use strict';

import {createApp} from 'https://cdn.jsdelivr.net/npm/vue@3/dist/vue.esm-browser.js';
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

    /* Construct the html/svg using the vue template in the html file.

       The drawn grid will have size cols X rows. This means each box
       is 1x1, which is convenient, except when you want to set
       outline widths (maybe 0.02px instead of the usual 1px) and font
       sizes (maybe 0.8px instead of the usual 16px). An alternative
       would be to make the boxes larger so that outlines/fonts are
       normal. */

    createApp({
        data: () => ({
            gridWorld,
            startId: gridWorld.toId(startCol, startRow),
            stepLimit: 0,
        }),
        computed: {
            bfsResults() {
                return breadthFirstSearch(this.gridWorld, this.startId, this.stepLimit);
            },
        },
        methods: {
            toggleWall(col, row) {
                this.gridWorld.toggleWall(col, row);
            },
            classFor(col, row) {
                let id = this.gridWorld.toId(col, row);
                return this.gridWorld.walls.has(id) ? "wall"
                    : this.bfsResults.frontier.indexOf(id) >= 0 ? "frontier"
                    : this.bfsResults.explored.indexOf(id) >= 0 ? "explored"
                    : "";
            },
        },
    }).mount(parentElement);
}


makeBfsDiagram(document.querySelector("#diagram1"), 23, 9, 5, 2);
