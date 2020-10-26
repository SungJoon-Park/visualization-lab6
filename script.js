var unemployment;

d3.csv('unemployment.csv', d3.autoType).then(data => {
    unemployment = data;
    console.log('Unemployment', unemployment);
    let row = unemployment.columns.slice(1);
    unemployment.forEach(d => {
        let sum = 0;
        row.forEach(element => sum += d[element]);
        d.total = sum;
    });
    console.log(unemployment[0]);

    const areaChart1 = AreaChart(".area_chart");
    areaChart1.update(unemployment);

    const areaChart2 = StackedAreaChart(".stacked_chart");

    areaChart2.update(data);

});

function AreaChart(container) {

    // initialization
    // create svg with margin convention
    const margin = {
            top: 20,
            right: 30,
            bottom: 30,
            left: 50
        },
        width = 600 - margin.left - margin.right,
        height = 100 - margin.top - margin.bottom;

    let svg = d3
        .select(container)
        .append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    let group = svg
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // create scales without domains
    let xScale = d3.scaleTime()
        .range([0, width]);

    let yScale = d3.scaleLinear()
        .range([height, 0]);

    //path
    group.append('path')
        .attr('class', 'area');

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
            .call(xAxis);

        yDisplay
            .call(yAxis);


        let area = d3.area()
            .x(d => xScale(d.date))
            .y1(d => yScale(d.total))
            .y0(() => yScale.range()[0]);

        d3.select('.area')
            .datum(data)
            .attr('d', area);

    }

    return {
        update // ES6 shorthand for "update": update
    };

}

function StackedAreaChart(container) {
    // initialization
    // create svg with margin convention
    const margin = {
            top: 20,
            right: 30,
            bottom: 30,
            left: 50
        },
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    let svg = d3
        .select(container)
        .append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    let group = svg
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // create scales without domains
    let xScale = d3.scaleTime()
        .range([0, width]);

    let yScale = d3.scaleLinear()
        .range([height, 0]);

    let cScale = d3.scaleOrdinal()
        .range(d3.schemeTableau10);

    //path
    group.append('path')
        .attr('class', 'stacked');

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
        let keys = data.columns.slice(1);
        let stack = d3.stack()
            .keys(keys)
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetNone);

        let stackedData = stack(data);
        // update scales, encodings, axes (use the total count)
        xScale.domain(d3.extent(data, d => d.date));
        yScale.domain([0, d3.max(stackedData, a => d3.max(a, d => d[1]))]);
        cScale.domain(keys);

        xDisplay
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);

        yDisplay
            .call(yAxis);


        let area = d3.area()
            .x(d => xScale(d.date))
            .y1(d => yScale(d[1]))
            .y0(() => yScale(d[0]));

        const areas = svg.selectAll('.area')
            .data(stackedData, d => d.key);

        areas
            .enter()
            .append('path')
            .attr('class', 'area')
            .style('fill', d => cScale(d.key))
            .merge(areas)
            .attr('d', area);

        areas
            .exit()
            .remove();

    }
    return {
        update
    }
}