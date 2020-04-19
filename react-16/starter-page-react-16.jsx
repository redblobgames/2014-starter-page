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

    function setSlider(e) {
        stepLimit = e.target.valueAsNumber;
        redraw();
    }

    /* Construct the html/svg using React JSX

       The drawn grid will have size cols X rows. This means each box
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
            rects.push(<rect className={'cell ' + className}
                              x={col} y={row} width="1" height="1"
                              onClick={() => clickEvent(col, row)} />);
        }
        
        return <div>
             <svg viewBox={`0 0 ${cols} ${rows}`}>
               {rects}
             </svg>
             <p>
               Time: <input type="range"
                      min="0" max={cols*rows - gridWorld.walls.size} 
                      value={stepLimit} onInput={setSlider} />
             </p>
        </div>
    }

    function redraw() {
        bfsResults = breadthFirstSearch(gridWorld, startId, stepLimit);
        ReactDOM.render(makeHtml(), parentElement);
    }

    redraw();
}


makeBfsDiagram(document.querySelector("#diagram1"), 23, 9, 5, 2);
