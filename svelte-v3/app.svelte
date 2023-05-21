<script>
  import {GridWorld, breadthFirstSearch} from '../gridworld.js';
  
  let startCol = 5, startRow = 2
  let gridWorld = new GridWorld(23, 9)
  let startId = gridWorld.toId(startCol, startRow)
  let stepLimit = 0
  
  $: bfsResults = breadthFirstSearch(gridWorld, startId, stepLimit)
  
  function toggleWall(col, row) {
      gridWorld.toggleWall(col, row);
      gridWorld = gridWorld // force update, because Svelte only catches top level changes
  }

  function classFor(gridWorld, bfsResults, col, row) {
      // NOTE: Svelte's static analyzer can't pick up that classFor reads
      // the gridWorld or bfsResults reactive variables, so the
      // workaround is to explicitly pass them in as parameters.
      let id = gridWorld.toId(col, row);
      return gridWorld.walls.has(id) ? "wall"
           : bfsResults.frontier.indexOf(id) >= 0 ? "frontier"
           : bfsResults.explored.indexOf(id) >= 0 ? "explored"
           : "";
  }

</script>


<h1>Breadth first search</h1>

<figure id="diagram1">
  <svg viewBox="0 0 {gridWorld.cols} {gridWorld.rows}">
    {#each gridWorld.locations() as {col, row} }
      <rect class="cell {classFor(gridWorld, bfsResults, col, row)}"
            x={col} y={row} width="1" height="1"
            on:click={toggleWall(col, row)} />
    {/each}
  </svg>
  <p>
    Time: <input type=range bind:value={stepLimit}
                 min=0 max={gridWorld.cols*gridWorld.rows - gridWorld.walls.size} />
  </p>
</figure>

<p>
  Click to toggle walls.
</p>

<style>
    .cell { fill: hsl(60, 10%, 90%); stroke: hsl(60, 0%, 100%); stroke-width: 0.02px; }
    .wall { fill: hsl(30, 20%, 40%); stroke: hsl(30, 50%, 40%); }
    .explored { fill: hsl(45, 20%, 70%); }
    .frontier { fill: hsl(220, 50%, 70%); }
</style>
