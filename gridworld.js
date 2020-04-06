/*
 * From https://www.redblobgames.com/x/2014-starter-page/
 * Copyright 2020 Red Blob Games <redblobgames@gmail.com>
 * License: Apache-2.0 <http://www.apache.org/licenses/LICENSE-2.0.html>
 */
'use strict';

export class GridWorld {
    /** @param {number} cols
     * @param {number} rows
     */
    constructor(cols, rows) {
        this.cols = cols;
        this.rows = rows;
        /** @type {Set<number>} */
        this.walls = new Set(); // ids of the wall locations
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
        let col = id % this.cols,
            row = Math.floor(id / this.cols);
        return {col, row};
    }

    /** true if the given col, row is part of this grid 
        @returns {bool} */
    inRange(col, row) {
        return 0 <= col && col < this.cols
            && 0 <= row && row < this.rows;
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
        let {col, row} = this.fromId(id);
        let neighbors = [];
        let candidates = [[col+1, row], [col-1, row], [col, row+1], [col, row-1]];
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
                result.push({col, row});
            }
        }
        return result;
    }
}


/** Calculate breadth first search, up to a certain number of steps
 * @param {GridWorld} gridWorld
 * @param {number} startId
 * @param {number} stepLimit
 * @returns {{frontier: Array<number>, explored: Array<number>}}
 */
export function breadthFirstSearch(gridWorld, startId, stepLimit=Infinity) {
    let count = 0;
    let frontier = [startId];
    let explored = [startId];
    while (frontier.length > 0 && count++ < stepLimit) {
        let currentId = frontier.shift();
        for (let nextId of gridWorld.neighbors(currentId)) {
            if (explored.indexOf(nextId) < 0) {
                frontier.push(nextId);
                explored.push(nextId);
                // TODO: replace explored with distance and/or came_from
            }
        }
    }
    return {frontier, explored};
}
