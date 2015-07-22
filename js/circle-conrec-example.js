function drawConrecContours(divId) {
    var zs = [0, 4.5, 9, 13.5, 18];
    var data = [[18, 13, 10, 9, 10, 13, 18],
        [13, 8, 5, 4, 5, 8, 13],
        [10, 5, 2, 1, 2, 5, 10],
        [9, 4, 1, 12, 1, 4, 9],
        [10, 5, 2, 1, 2, 5, 10],
        [13, 8, 5, 4, 5, 8, 13],
        [18, 13, 10, 9, 10, 13, 18],
        [18, 13, 10, 9, 10, 13, 18]];

        //zs = [0,0.5,1,2.5, 4, 6]
        var cliff = 1000;
        data.push(d3.range(data[0].length).map(function() { return cliff; }));
        data.unshift(d3.range(data[0].length).map(function() { return cliff; }));
        data.forEach(function(d) {
            d.push(cliff);
            d.unshift(cliff);
        });

        var xs = d3.range(0, data.length);
        var ys = d3.range(0, data[0].length);
        var c = new Conrec;

        var width = 150;
        var height = width * ((ys.length - 2) / (xs.length - 2));

        var marginBottomLabel = 0;

        var x = d3.scale.linear()
        .range([0, width])
        .domain([1, Math.max.apply(null, xs)-1]);

        var y = d3.scale.linear()
        .range([0, height])
        .domain([1, Math.max.apply(null, ys)-1]);

        var colours = d3.scale.linear().domain([zs[0], zs[zs.length - 1]])
        .range([d3.rgb(0,0,0),
               d3.rgb(200,200,200)]);

        c.contour(data, 0, xs.length - 1, 0, ys.length - 1, xs, ys, zs.length, zs);

        Array.prototype.max = function() {
            return Math.max.apply(null, this);
        };

        Array.prototype.min = function() {
            return Math.min.apply(null, this);
        };

        var contourList = c.contourList().sort(function(a,b) {
            return a.map(function(d) { return d.x; }).min() - b.map(function(d) { return d.x; }).min();
        });

        var svg = d3.select(divId).append("svg")
        .attr("width", width)
        .attr("height", height + marginBottomLabel)

        /*
        svg.append('text')
        .attr('transform', 'translate(' + (width/2) + ','+(height+15)+')')
        .attr('text-anchor', 'middle')
        .text("conrec.js");
        */

        svg.selectAll("path")
        .data(contourList)
        .enter().append("path")
        .style("fill",function(d) { return colours(d.level);})
        .style("stroke","black")
        .style('opacity', 1.0)
        .attr("d", d3.svg.line() .x(function(d) { return x(d.x); })
              .y(function(d) { return y(d.y); }))
              .on('mouseover', function(d) { 
            d3.select(this).style('fill', d3.rgb(204,  185,  116));})
                  .on('mouseout', function(d) { 
                      d3.select(this).style('fill', function(d1) { return colours(d1.level); })});
}

