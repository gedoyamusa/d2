const mapSvg = d3.select("#map"),
  mapWidth = +mapSvg.attr("width"),
  mapHeight = +mapSvg.attr("height");

const path = d3.geoPath();
const projection = d3
  .geoMercator()
  .scale(100)
  .center([0, 40])
  .translate([mapWidth / 2, mapHeight / 2]);

let data = new Map();

const colorScale = d3
  .scaleThreshold()
  .domain([0, 5, 10, 15, 20, 25, 30, 35])
  .range(
    d3.range(0, 1, 1 / 8).map(function (i) {
      return d3.interpolateHcl(d3.rgb("#0000ff"), d3.rgb("#ff0000"))(i);
    })
  );

const colorScaleE = d3
  .scaleThreshold()
  .domain([0, 10, 50, 100, 150, 500, 1000, 1500, 2200])
  .range(d3.schemeBlues[7]);

Promise.all([
  d3.json(
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
  ),
  d3.csv("energycountry.csv")
]).then(function (loadData) {
  let topo = loadData[0];
  let csvData = loadData[1];

  csvData.forEach(function (d) {
    data.set(d.name, {
      energy: +d.energy,
      popularity: +d.Popularity,
      temperature: +d.temperature
    });
  });
  // console.log(data);
  var mapToolTip = d3
    .select("#map")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px");

  let mapMouseOver = function (d) {
    d3.selectAll(".name").transition().duration(200).style("opacity", 0.5);
    d3.select(this)
      .transition()
      .duration(200)
      .style("opacity", 1)
      .style("stroke", "red");

    mapToolTip.style("opacity", 1).style("stroke", "black").style("opacity", 1);
  };

  var mapMouseMove = function (d) {
    // console.log(d);
    //console.log(data.get(d.properties.temperature));
    const tooltipData = data.get(d.properties.name);
    console.log(tooltipData);
    if (tooltipData) {
      mapToolTip
        .html(
          `${d.properties.name}<br>Energy: ${tooltipData.energy}<br>popularity: ${tooltipData.Popularity}<br>Temperature: ${tooltipData.temperature}`
        )
        .style("left", d3.event.pageX + 10 + "px")
        .style("top", d3.event.pageY + "px");
    }
  };

  let mapMouseLeave = function (d) {
    d3.selectAll(".name").transition().duration(200).style("opacity", 0.8);
    d3.select(this).transition().duration(200).style("stroke", "transparent");
    mapToolTip.style("opacity", 0);
    d3.select(this).style("stroke", "none").style("opacity", 0.8);
  };
  const button = document.createElement("button");
  button.innerText = "popularity";
  button.addEventListener("click", function () {
    updateMap("popularity");
  });

  // append button to DOM
  document.body.appendChild(button);

  const button2 = document.createElement("button");
  button2.innerText = "temperature";
  button2.addEventListener("click", function () {
    updateMap("temperature");
  });

  // append button to DOM
  document.body.appendChild(button2);

  function updateMap(key) {
    mapSvg
      .append("g")
      .selectAll("path")
      .data(topo.features)
      .join("path")
      .attr("d", d3.geoPath().projection(projection))
      .attr("fill", function (d) {
        const mapData = data.get(d.properties.name);
        let value;
        if (mapData) {
          if (key === "temperature") {
            const spTempData = mapData.temperature;
            return colorScale(spTempData);
          } else if (key === "popularity") {
            value = mapData.popularity;
            return colorScaleE(value);
          }
        }

        // return colorScale(d.total);
      })
      .style("stroke", "transparent")
      .attr("class", function (d) {
        return "name";
      })
      .style("opacity", 0.8)
      .on("mouseover", mapMouseOver)
      .on("mousemove", mapMouseMove)
      .on("mouseleave", mapMouseLeave);
  }
});
