function drawTurfContours(divId) {
    var zs = [0, 4.5, 9, 13.5, 18];

    var data = [[18, 13, 10, 9, 10, 13, 18],
        [13, 8, 5, 4, 5, 8, 13],
        [10, 5, 2, 1, 2, 5, 10],
        [9, 4, 1, 12, 1, 4, 9],
        [10, 5, 2, 1, 2, 5, 10],
        [13, 8, 5, 4, 5, 8, 13],
        [18, 13, 10, 9, 10, 13, 18],
        [18, 13, 10, 9, 10, 13, 18]]

        //add a set of high values around the so that values on the edge
        //get their own contours
        var cliff = 1000;
        data.push(d3.range(data[0].length).map(function() { return cliff; }));
        data.unshift(d3.range(data[0].length).map(function() { return cliff; }));
        data.forEach(function(d) {
            d.push(cliff);
            d.unshift(cliff);
        });

        var points = {type: "FeatureCollection", features: []}

        // convert our data grid to GeoJSON
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[0].length; j++) {
                var newPoint = { geometry: {
                                    type: "Point",
                                    coordinates: [i,j] },
                                 properties: { 
                                    z: data[i][j]
                                 },
                                 type: "Feature"};
                points.features.push(newPoint);
            }
        }

        var isolined = turf.isobands(points, 'z', 20, zs);

        var xs = d3.range(0, data.length);
        var ys = d3.range(0, data[0].length);
        var width = 150;
        var height = width * ((ys.length - 2) / (xs.length - 2));

        var marginBottomLabel = 0;

        minX = Math.min.apply(null, isolined.features.map(function(d) {
            return Math.min.apply(null, d.geometry.coordinates[0].map(function(d1) { return d1[0]; }))
        }));
        maxX = Math.max.apply(null, isolined.features.map(function(d) {
            return Math.max.apply(null, d.geometry.coordinates[0].map(function(d1) { return d1[0]; }))
        }));

        minY = Math.min.apply(null, isolined.features.map(function(d) {
            return Math.min.apply(null, d.geometry.coordinates[0].map(function(d1) { return d1[1]; }))
        }));
        maxY = Math.max.apply(null, isolined.features.map(function(d) {
            return Math.max.apply(null, d.geometry.coordinates[0].map(function(d1) { return d1[1]; }))
        }));

        var xScale = d3.scale.linear()
        .range([0, width])
        .domain([minX, maxX]);

        var yScale = d3.scale.linear()
        .range([0, height])
        .domain([minY, maxY]);

        var colours = d3.scale.linear().domain([zs[0], zs[zs.length - 1]])
        .range([d3.rgb(0,0,0),
               d3.rgb(200,200,200)]);

        var svg = d3.select(divId).append("svg")
        .attr("width", width)
        .attr("height", height + marginBottomLabel)

        /*
        svg.append('text')
        .attr('transform', 'translate(' + (width/2) + ','+(height+15)+')')
        .attr('text-anchor', 'middle')
        .text("turf.js");
        */

        // sort the contours by xValue in the hopes that they get drawn
        // with a proper ordering
        Array.prototype.max = function() {
            return Math.max.apply(null, this);
        };

        Array.prototype.min = function() {
            return Math.min.apply(null, this);
        };

        isolined.features = isolined.features.sort(function(a,b) {
            return a.geometry.coordinates[0].map(function(d) { return d[0]; }).min()
                  -b.geometry.coordinates[0].map(function(d) { return d[0]; }).min();
        });
        //isolined.features = isolined.features.reverse();

        svg.selectAll("path")
        .data(isolined.features)
        .enter().append("path")
        .style("fill",function(d) { return colours(d.properties.z);})
        //.style('fill', 'transparent')
        .style("stroke","black")
        .attr("d", function(d) { 
            console.log('d', d);
            return d3.svg.line()
            .x(function(dat) { return xScale(dat[0]); })
            .y(function(dat) { return yScale(dat[1]); }) 
            (d.geometry.coordinates[0]);
        })
        .on('mouseover', function(d) { 
            d3.select(this).style('fill', d3.rgb(204,  185,  116));})
            .on('mouseout', function(d) { 
                d3.select(this).style('fill', function(d1) { return colours(d1.properties.z); })})
        .style('opacity', 1)
}
