var gdpMargin = { top: 30, right: 30, bottom: 70, left: 60 },
  gdpWidth = 860 - gdpMargin.left - gdpMargin.right,
  gdpHeight = 400 - gdpMargin.top - gdpMargin.bottom;

var gdpSvg = d3
  .select("#gdpbar")
  .append("svg")
  .attr("width", gdpWidth + gdpMargin.left + gdpMargin.right)
  .attr("height", gdpHeight + gdpMargin.top + gdpMargin.bottom)
  .append("g")
  .attr("transform", `translate(${gdpMargin.left}, ${gdpMargin.top})`);

//const explicitValues = data.map((d) => d.Explicit);
//const gdpColorScale = d3
//.scaleOrdinal()
//.domain(explicitValues)
//.range(d3.schemeBlues[2]);

d3.csv("gdp.csv", d3.autoType).then(function (data) {
  const x = d3
    .scaleBand()
    .range([0, gdpWidth])
    .domain(data.map((d) => d.CountryName))
    .padding(0.2);
  gdpSvg
    .append("g")
    .attr("transform", `translate(0, ${gdpHeight})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  const y = d3.scaleLinear().domain([0, 140000]).range([gdpHeight, 0]);
  gdpSvg.append("g").call(d3.axisLeft(y));

  gdpSvg
    .selectAll("bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d) => x(d.CountryName))
    .attr("y", (d) => y(d.value))
    .attr("width", x.bandwidth())
    .attr("height", (d) => gdpHeight - y(d.value))
    .attr("fill", function (d) {
      if (d.Explicit === 1) {
        return "#ff0000";
      } else {
        return "#0000ff";
      }
    });
  //function (d) {
  // d.total = data.get(d.Explicit);
  //  return gdpColorScale(d.Explicit);
  // }
});
