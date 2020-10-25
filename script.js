let unemployment;

d3.csv('unemployment.csv', d3.autoType).then(data => {
    unemployment = data;
    console.log('Unemployment', unemployment);
    let total_col = unemployment.columns.slice(1);
    unemployment.forEach(d => {
        let sum = 0;
        total_col.forEach(element => sum += d[element]);
        d.total = sum;
    });
    console.log(unemployment[0]);

    const areaChart1 = AreaChart(".chart");

    areaChart1.update(data);
    /*
    const areaChart2 = AreaChart(".chart-container2");

    areaChart2.update(data);
*/
});
/*
// create svg with margin convention
const margin = {
        top: 20,
        right: 20,
        bottom: 40,
        left: 50
    },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

let svg = d3
    .select('.chart')
    .append('svg');

let group = svg
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// create scales without domains
let xScale = d3.scaleTime()
    .range([0, width]);

let yScale = d3.scaleLinear()
    .range([height, 0]);

//path
svg.append('path')
    .datum(unemployment)
    .attr('class', 'chart_area')

// create axes and axis title containers
const xAxis = d3.axisBottom()
    .scale(xScale);

const yAxis = d3.axisLeft()
    .scale(yScale);

let xDisplay = group
    .append('g')
    .attr('class', 'axis x-axis');

let yDisplay = group
    .append('g')
    .attr('class', 'axis y-axis');

*/
function AreaChart(container) {

    // initialization
    // create svg with margin convention
    const margin = {
            top: 20,
            right: 20,
            bottom: 40,
            left: 50
        },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    let svg = d3
        .select('.chart')
        .append('svg');

    let group = svg
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // create scales without domains
    let xScale = d3.scaleTime()
        .range([0, width]);

    let yScale = d3.scaleLinear()
        .range([height, 0]);

    //path
    svg.append('path')
        .datum(unemployment)
        .attr('class', 'chart_area')

    // create axes and axis title containers
    const xAxis = d3.axisBottom()
        .scale(xScale);

    const yAxis = d3.axisLeft()
        .scale(yScale);

    let xDisplay = group
        .append('g')
        .attr('class', 'axis x-axis');

    let yDisplay = group
        .append('g')
        .attr('class', 'axis y-axis');

    function update(data) {

        // update scales, encodings, axes (use the total count)
        xScale.domain(d3.extent(data, d => d.date));
        yScale.domain([0, d3.max(data, d => d.total)]);

        xDisplay
            .attr("transform", `translate(0, ${height})`)
            .transition()
            .duration(500)
            .call(xAxis);

        yDisplay
            .transition()
            .duration(500)
            .call(yAxis);


        let area = d3.area()
            .x(d => xScale(d.date))
            .y1(d => yScale(d.total))
            .y0(() => yScale.range()[0]);

        d3.select('.area')
            .datum(data)
            .attr('d', 'area');

    }

    return {
        update // ES6 shorthand for "update": update
    };

}