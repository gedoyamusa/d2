var circleSvg = d3
  .select("#circles")
  .append("svg")
  .attr("width", 400)
  .attr("height", 400);

// Append a circle
circleSvg
  .append("circle")
  .attr("id", "circleBasicTooltip")
  .attr("cx", 150)
  .attr("cy", 200)
  .attr("r", 40)
  .attr("fill", "#69b3a2");

// create a tooltip
var circleTooltip = d3
  .select("#circles")
  .append("div")
  .style("opacity", 1)
  .attr("class", "#tooltip")
  .style("background-color", "black")
  .style("color", "white")
  .style("border-radius", "5px")
  .style("padding", "3px");

var mouseover = function (event, d) {
  circleTooltip.style("opacity", 1);
};
var mousemove = function (event, d) {
  circleTooltip
    .html("Hello, world!")
    .style("left", event.pageX / 2 + "px")
    .style("top", event.pageY / 2 - 10 + "px")
    .style("opacity", 1);

  console.log(circleTooltip.node().innerHTML);
};
var mouseleave = function (event, d) {
  circleTooltip.style("opacity", 0);
};

circleSvg
  .selectAll("circle")
  .on("mouseover", mouseover)
  .on("mousemove", mousemove)
  .on("mouseleave", mouseleave);
