var chartDom = document.getElementById("chart");
var codeDom = document.getElementById("code");
var myChart = echarts.init(chartDom);
var option;


document.getElementById("data").addEventListener("change",
event => {
  let file = event.target.files[0];
  
  let reader = new FileReader();
  reader.readAsText(file, "UTF-8");

  reader.onload = (load_event) => {
    let data = JSON.parse(load_event.target.result);
    console.log(data, myChart);
    myChart.setOption(
      (option = {        
        layoutIterations: 0,
        draggable: false,
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove"
        },
        animation: false,
        series: [
          {
            type: "sankey",
            data: data.nodes,
            links: data.links,
            emphasis: {
                focus: "adjacency"
            },
            lineStyle: {
                color: "source",
                opacity: 0.6,
                curveness: 0.5,
            }
          }
        ]
      })
    );
  };
  });

myChart.on("click", event => {
  let data = event.data;
  let changes = data.changes
  
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
});