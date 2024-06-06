var chartDom = document.getElementById("chart");
var codeDom = document.getElementById("code");
var sankeyChart = echarts.init(chartDom, null, {renderer: "svg"});
var data = null;

function redrawSankey() {
  if (!data) return;
  sankeyChart.setOption({
    tooltip: {
      trigger: "item",
      triggerOn: "mousemove"
    },
    animation: false,
    series: [
      {
        layoutIterations: 0,
        draggable: false,
        type: "sankey",
        data: data.nodes,
        links: data.links,
        emphasis: {
            focus: "adjacency"
        },
        label: {
          overflow: "break",
        },
        labelLayout: {
          width: 60,

        },
        lineStyle: {
            color: "source",
            opacity: 0.6,
            curveness: 0.5,
        }
      }
    ]
  });
}

document.getElementById("data").addEventListener("change", event => {
  let file = event.target.files[0];
  
  let reader = new FileReader();
  reader.readAsText(file, "UTF-8");

  reader.onload = (load_event) => {
    data = JSON.parse(load_event.target.result);
    redrawSankey();
  };
});

window.addEventListener("resize", evt => {
  sankeyChart.resize();
});


// Click to get the diff
sankeyChart.on("click", event => {
  let changes = event.data.changes;
  
  let diffString = "";

  for (const change of changes) {
    diffString += change.diff;
  }

  let targetElement = document.getElementById('myDiffElement');
  let configuration = {
    drawFileList: false,
    fileListToggle: false,
    fileListStartVisible: false,
    fileContentToggle: false,
    matching: 'lines',
    outputFormat: 'side-by-side',
    synchronisedScroll: true,
    highlight: true,
    renderNothingWhenEmpty: false,
  };
  let diff2htmlUi = new Diff2HtmlUI(targetElement, diffString, configuration);
  diff2htmlUi.draw();
  diff2htmlUi.highlightCode();

  targetElement.scrollIntoView();
});