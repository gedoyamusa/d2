var lineMargin = { top: 60, right: 30, bottom: 50, left: 60 },
  lineWidth = 700 - lineMargin.left - lineMargin.right,
  lineHeight = 400 - lineMargin.top - lineMargin.bottom;

var lineSvg = d3
  .select("#linegraph")
  .append("svg")
  .attr("width", lineWidth + lineMargin.left + lineMargin.right)
  .attr("height", lineHeight + lineMargin.top + lineMargin.bottom)
  .append("g")
  .attr("transform", `translate(${lineMargin.left},${lineMargin.top})`);

d3.csv("temp.csv").then(function (data) {
  const lineX = d3
    .scaleBand()
    .range([0, lineWidth])
    .domain(data.map((d) => d.Year))
    .padding(0.8);
  lineSvg
    .append("g")
    .attr("transform", `translate(0, ${lineHeight})`)
    .call(d3.axisBottom(lineX));

  const lineY = d3.scaleLinear().domain([8, 30]).range([lineHeight, 0]);
  lineSvg.append("g").call(d3.axisLeft(lineY));

  lineSvg
    .append("linearGradient")
    .attr("id", "line-gradient")
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", 0)
    .attr("y1", lineY(8))
    .attr("x2", 0)
    .attr("y2", lineY(30))
    .selectAll("stop")
    .data([
      { offset: "0%", color: "blue" },
      { offset: "100%", color: "red" }
    ])
    .enter()
    .append("stop")
    .attr("offset", function (d) {
      return d.offset;
    })
    .attr("stop-color", function (d) {
      return d.color;
    });

  lineSvg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "url(#line-gradient)")
    .attr("stroke-width", 2)
    .attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return lineX(d.Year);
        })
        .y(function (d) {
          return lineY(d.Celsius);
        })
    );
});
