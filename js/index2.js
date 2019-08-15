document.addEventListener("DOMContentLoaded", function (event) {
    // 1.2 The Zinq-culator
    // Range slider display text
    var sliderCal = document.getElementById("loanAmt");
    var outputCal = document.getElementById("loanAmtSpan");
    var termLoan = document.getElementById("tmLoan");
    var intRate = document.getElementById("intRate");
    var payFeqVal = document.getElementById("paymentFreq");
    outputCal.innerHTML = '$' + sliderCal.value;


    sliderCal.oninput = function () {

        var loanAmount0 = this.value;
        outputCal.innerHTML = '$' + loanAmount0;

        var paymentFreq = {

            Weekly: 52.17857,
            Fortnightly: 26.08929,
            Monthly: 12,
            Quaterly: 4,
            HalfYearly: 2,
            Yearly: 1
        }

        var P0 = sliderCal.value;
        var r = (intRate.value / 100); // Not mentioned in the report?
        var N = termLoan.value;
        var m = paymentFreq[payFeqVal.value];


        var tempCalNum1 = (r / m);
        var tempCalNum2 = tempCalNum1 * P0;

        var tempCalDen1 = 1 + tempCalNum1;
        var tempCalDen2 = -m * N;

        var tempCalDen3 = Math.pow(tempCalDen1, tempCalDen2);
        var tempCalDen4 = 1 - tempCalDen3;

        var tempCal = (tempCalNum2 / tempCalDen4); // Wanted Integer but In excel its float?

        tempCal = Number(tempCal.toFixed(2));

        if (!isNaN(tempCal)) {
            document.getElementById("estMonRepay").innerHTML = 'Estimated Monthly Repayment: $' + tempCal;
        } else {
            document.getElementById("estMonRepay").innerHTML = 'Estimated Monthly Repayment: $0';
        }


        var tempFtNum1 = (r / m);
        var tempFtNum2 = tempCal / tempFtNum1;

        var tempFtDen1 = 1 + tempFtNum1;
        var tempFtDen2 = m * N;
        var tempFtDen3 = Math.pow(tempFtDen1, tempFtDen2);
        var tempFtDen4 = tempFtDen3 - 1;


        var Ft = (tempFtNum2 * tempFtDen4); // Wanted Integer but In excel its float?

        Ft = Number(Ft.toFixed(2));

        if (!isNaN(Ft)) {
            document.getElementById("totCostLoan").innerHTML = 'Total Cost of Loan(over ' + N + ' years ): $' + Ft;
        } else {
            document.getElementById("totCostLoan").innerHTML = 'Total Cost of Loan(over ' + N + ' years ): $0';
        }

        var zinqFormula = {
            time: undefined,
            startingBalance: undefined,
            interest: undefined,
            repayment: undefined,
            closingBalance: undefined
        }

        var ZGraphDataPts = [];
        var i = 0;
        for (i; i <= N; i++) {
            if (i != 0) {
                zinqFormula = {};
                zinqFormula.time = i;
                zinqFormula.startingBalance = ZGraphDataPts[i - 1].closingBalance;
                zinqFormula.interest = ZGraphDataPts[i - 1].closingBalance * r;
                var repay = tempCal * m;
                repay = Number(repay.toFixed(2))
                zinqFormula.repayment = repay;
                zinqFormula.closingBalance = Math.max((ZGraphDataPts[i - 1].closingBalance + (ZGraphDataPts[i - 1].closingBalance * r) - repay), 0);
                ZGraphDataPts.push(zinqFormula);

            } else {
                zinqFormula = {};
                zinqFormula.time = i;
                zinqFormula.startingBalance = Number(sliderCal.value);
                zinqFormula.interest = Number(sliderCal.value * r);
                var repay = tempCal * m;
                zinqFormula.repayment = Number(repay.toFixed(2));

                var closingBalanceA = Number(sliderCal.value);
                var closingBalanceB = Number(sliderCal.value * r);
                closingBalanceB = Number(closingBalanceB.toFixed(2));
                var closingBalanceC = (tempCal * m);
                var closingBalanceD = (closingBalanceA + closingBalanceB);
                var closingBalanceE = (closingBalanceD - closingBalanceC);
                zinqFormula.closingBalance = closingBalanceE;

                ZGraphDataPts.push(zinqFormula);
            }

        }


        console.log(ZGraphDataPts);

        // For Tooltip Estimated monthly repayment

        var tempCalNum11 = (r / 12); // Ony for Month
        var tempCalNum22 = tempCalNum11 * P0;

        var tempCalDen11 = 1 + tempCalNum11;
        var tempCalDen22 = -12 * N; // For month only

        var tempCalDen33 = Math.pow(tempCalDen11, tempCalDen22);
        var tempCalDen44 = 1 - tempCalDen33;

        var tempCalTool = (tempCalNum22 / tempCalDen44); // Wanted Integer but In excel its float?

        tempCalTool = Number(tempCalTool.toFixed(2));



        updateLine(ZGraphDataPts, tempCalTool, termLoan);

    }


    //   ------------------------------------------- Graph Starts here ---------------------------------------------------------
    // set the dimensions and margins of the graph

    function updateLine(data, estMonthlyRepay, termOfLoan) {

        var margin = {
                top: 10,
                right: 30,
                bottom: 30,
                left: 100
            },
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        d3.select("#my_dataviz").select("svg#duplicate-line").remove();

        // append the svg object to the body of the page
        var svg = d3.select("#my_dataviz")
            .append("svg")
            .attr("id", "duplicate-line")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");



        // Add X axis --> it is a date format
        var x = d3.scaleLinear()
            .domain([0, 30])
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));


        // text label for the x axis
        svg.append("text")
            .attr("transform",
                "translate(" + (width / 2) + " ," +
                (height + margin.top + 20) + ")")
            .style("text-anchor", "middle")
            .text("Time (Years)");

        // Add Y axis
        var y = d3.scaleLinear()
            .domain(d3.extent(data, function (d) {
                return +d.closingBalance;
            }))
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Add the y Axis
        svg.append("g")
            .call(d3.axisLeft(y));

        // text label for the y axis
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Loan Amount (AUD$)");

        // This allows to find the closest X index of the mouse:
        var bisect = d3.bisector(function (d) {
            return d.time;
        }).left;

        // Create the circle that travels along the curve of chart
        var focus = svg
            .append('g')
            .append('circle')
            .style("fill", "none")
            .attr("stroke", "black")
            .attr('r', 8.5)
            .style("opacity", 0)

        // Create the text that travels along the curve of chart
        var focusText = svg
            .append('g')
            .append('text')
            .style("opacity", 0)
            .attr("text-anchor", "left")
            .attr("alignment-baseline", "middle")

        // Create a rect on top of the svg area: this rectangle recovers mouse position
        svg
            .append('rect')
            .style("fill", "none")
            .style("pointer-events", "all")
            .attr('width', width)
            .attr('height', height)
            .on('mouseover', mouseover)
            .on('mousemove', mousemove)
            .on('mouseout', mouseout);

        // Add the line
        svg
            .append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("class", "line")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function (d) {
                    return x(d.time)
                })
                .y(function (d) {
                    return y(d.closingBalance)
                })
            )

        // Add the area
        svg.append("path")
            .datum(data)
            .attr("fill", "#69b3a2")
            .attr("fill-opacity", .3)
            .attr("stroke", "none")
            .attr("d", d3.area()
                .x(function (d) {
                    return x(d.time)
                })
                .y0(height)
                .y1(function (d) {
                    return y(d.closingBalance)
                })
            )

        // Add the line
        svg.selectAll("myCircles")
            .data(data)
            .enter()
            .append("circle")
            .attr("fill", "red")
            .attr("stroke", "none")
            .attr("cx", function (d) {
                return x(d.time)
            })
            .attr("cy", function (d) {
                return y(d.closingBalance)
            })
            .attr("r", 3)


        function mouseover() {
            focus.style("opacity", 1)
            focusText.style("opacity", 1)
        }

        function mousemove() {
            // recover coordinate we need
            var x0 = x.invert(d3.mouse(this)[0]);
            var i = bisect(data, x0, 1);
            selectedData = data[i]

            var progressCompleted = ((selectedData.time / termOfLoan.value) * 100);
            progressCompleted = progressCompleted.toFixed(0);
            var progressRemaining = (100 - progressCompleted);
            progressRemaining = progressRemaining.toFixed(0);



            focus
                .attr("cx", x(selectedData.time))
                .attr("cy", y(selectedData.closingBalance))
            focusText
                .html("Year:" + selectedData.time)
                .attr("x", x(selectedData.time) + 15)
                .attr("y", y(selectedData.closingBalance))
            
                .append("tspan")
                .attr("dy", "1.2em") 
                .attr("x", 0)
                .text("Completed: " + progressCompleted + "%")
                .attr("x", x(selectedData.time) + 15)
                .attr("y", y(selectedData.closingBalance))
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
            
                .append("tspan")
                .attr("dy", "2.2em") 
                .attr("x", 0)
                .text("Remaining: " + progressRemaining + "%")
                .attr("x", x(selectedData.time) + 15)
                .attr("y", y(selectedData.closingBalance))
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
            
                .append("tspan")
                .attr("dy", "3.2em") 
                .attr("x", 0)
                .text("Est monthly Repay: " + estMonthlyRepay + "$")
                .attr("x", x(selectedData.time) + 15)
                .attr("y", y(selectedData.closingBalance))
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px")

        }

        function mouseout() {
            focus.style("opacity", 0)

            focusText.style("opacity", 0)
        }


    }


    //   ------------------------------------------- Graph Ends here ---------------------------------------------------------

})
