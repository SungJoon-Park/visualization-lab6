export default function StackedAreaChart(container) {
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

    const tooltip = svg
        .append('text')
        .attr('x', 60)
        .attr('y', 20)
        .attr('font-size', 12);


    let selected = null,
        xDomain, data;

    // clip for stacked chart
    svg
        .append('clipPath')
        .attr('id', 'clip-area')
        .append('rect')
        .attr('width', width)
        .attr('height', height);

    function update(_data) {
        data = _data;
        const keys = selected ? [selected] : data.columns.slice(1);
        let stack = d3.stack()
            .keys(keys)
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetNone);

        let stackedData = stack(data);
        // update scales, encodings, axes (use the total count)
        xScale.domain(xDomain ? xDomain : d3.extent(data, (d) => d.date));
        yScale.domain([0, d3.max(stackedData, (d) => d3.max(d, (d) => d[1]))]);
        cScale.domain(keys);

        xDisplay
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);

        yDisplay
            .call(yAxis);


        let area = d3.area()
            .x((d) => xScale(d.data.date))
            .y1((d) => yScale(d[1]))
            .y0((d) => yScale(d[0]));

        const areas = group.selectAll('.area')
            .data(stackedData, (d) => d.key);

        areas
            .enter()
            .append('path')
            .style('clip-path', 'url(#clip-area)')
            .attr('class', 'area')
            .style('fill', (d) => cScale(d.key))
            .on('mouseover', (event, d, i) => tooltip.text(d.key))
            .on('mouseout', (event, d, i) => tooltip.text(''))
            .on('click', (event, d) => {
                if (selected === d.key) {
                    selected = null;
                } else {
                    selected = d.key;
                }
                update(data);
            })
            .merge(areas)
            .attr('d', area);


        areas
            .exit()
            .remove();
    }

    function filterByDate(range) {
        xDomain = range;
        update(data);
    }

    return {
        update,
        filterByDate
    };
}