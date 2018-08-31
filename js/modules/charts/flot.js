denningOnline
  
  //-----------------------------------------------
  // BAR CHART
  //-----------------------------------------------

  .directive('barChart', function(){
    return {
      restrict: 'A',
      link: function(scope, element, attrs){
        var data1 = [[1,60], [2,30], [3,50], [4,100], [5,10], [6,90], [7,85]];
        var data2 = [[1,20], [2,90], [3,60], [4,40], [5,100], [6,25], [7,65]];
        var data3 = [[1,100], [2,20], [3,60], [4,90], [5,80], [6,10], [7,5]];

        /* Create an Array push the data + Draw the bars*/

        var barData = new Array();

        barData.push({
          data : data1,
          label: 'Tokyo',
          bars : {
            show : true,
            barWidth : 0.08,
            order : 1,
            lineWidth: 0,
            fillColor: '#8BC34A'
          }
        });

        barData.push({
          data : data2,
          label: 'Seoul',
          bars : {
            show : true,
            barWidth : 0.08,
            order : 2,
            lineWidth: 0,
            fillColor: '#00BCD4'
          }
        });

        barData.push({
          data : data3,
          label: 'Beijing',
          bars : {
            show : true,
            barWidth : 0.08,
            order : 3,
            lineWidth: 0,
            fillColor: '#FF9800'
          }
        });
        
        /* Let's create the chart */
        $.plot($(element), barData, {
          grid : {
              borderWidth: 1,
              borderColor: '#eee',
              show : true,
              hoverable : true,
              clickable : true
          },

          yaxis: {
            tickColor: '#eee',
            tickDecimals: 0,
            font :{
              lineHeight: 13,
              style: "normal",
              color: "#9f9f9f",
            },
            shadowSize: 0
          },

          xaxis: {
            tickColor: '#fff',
            tickDecimals: 0,
            font :{
              lineHeight: 13,
              style: "normal",
              color: "#9f9f9f"
            },
            shadowSize: 0,
          },

          legend:{
            container: '.flc-bar',
            backgroundOpacity: 0.5,
            noColumns: 0,
            backgroundColor: "white",
            lineWidth: 0
          }
        });
      }
    }
  })



  //-----------------------------------------------
  // DYNAMIC CHART
  //-----------------------------------------------

  .directive('dynamicChart', function(){
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
      
        /* Make some random data*/
  
        var data = [];
        var totalPoints = 300;
        var updateInterval = 30;

        function getRandomData() {
          if (data.length > 0)
            data = data.slice(1);

          while (data.length < totalPoints) {

            var prev = data.length > 0 ? data[data.length - 1] : 50,
              y = prev + Math.random() * 10 - 5;
            if (y < 0) {
              y = 0;
            } else if (y > 90) {
              y = 90;
            }

            data.push(y);
          }

          var res = [];
          for (var i = 0; i < data.length; ++i) {
            res.push([i, data[i]])
          }

          return res;
        }

        /* Create Chart */

        var plot = $.plot(element, [ getRandomData() ], {
          series: {
            label: "Server Process Data",
            lines: {
              show: true,
              lineWidth: 0.2,
              fill: 0.6
            },

            color: '#00BCD4',
            shadowSize: 0,
          },
          yaxis: {
            min: 0,
            max: 100,
            tickColor: '#eee',
            font :{
              lineHeight: 13,
              style: "normal",
              color: "#9f9f9f",
            },
            shadowSize: 0,

          },
          xaxis: {
            tickColor: '#eee',
            show: true,
            font :{
              lineHeight: 13,
              style: "normal",
              color: "#9f9f9f",
            },
            shadowSize: 0,
            min: 0,
            max: 250
          },
          grid: {
            borderWidth: 1,
            borderColor: '#eee',
            labelMargin:10,
            hoverable: true,
            clickable: true,
            mouseActiveRadius:6,
          },
          legend:{
            container: '.flc-dynamic',
            backgroundOpacity: 0.5,
            noColumns: 0,
            backgroundColor: "white",
            lineWidth: 0
          }
        });

        /* Update */  
        function update() {
          plot.setData([getRandomData()]);
          // Since the axes don't change, we don't need to call plot.setupGrid()

          plot.draw();
          setTimeout(update, updateInterval);
        }
        update();
      }
    }
  })


  //-----------------------------------------------
  // PIE AND DONUT
  //-----------------------------------------------

  .directive('pieDonut', function(){
    return {
      restrict: 'A',
      link: function(scope, element, attrs){
        var pieData = [
          {data: 1, color: '#F44336', label: 'Toyota'},
          {data: 2, color: '#03A9F4', label: 'Nissan'},
          {data: 3, color: '#8BC34A', label: 'Hyundai'},
          {data: 4, color: '#FFEB3B', label: 'Scion'},
          {data: 4, color: '#009688', label: 'Daihatsu'},
        ];

        /* Pie Chart */

        if($('#pie-chart')[0]){
          $.plot('#pie-chart', pieData, {
            series: {
              pie: {
                show: true,
                stroke: { 
                  width: 2,
                },
              },
            },
            legend: {
              container: '.flc-pie',
              backgroundOpacity: 0.5,
              noColumns: 0,
              backgroundColor: "white",
              lineWidth: 0
            },
            grid: {
              hoverable: true,
              clickable: true
            },
            tooltip: true,
            tooltipOpts: {
              content: "%p.0%, %s", // show percentages, rounding to 2 decimal places
              shifts: {
                x: 20,
                y: 0
              },
              defaultTheme: false,
              cssClass: 'flot-tooltip'
            }

          });
        }

        /* Donut Chart */

        if($('#donut-chart')[0]){
          $.plot('#donut-chart', pieData, {
            series: {
              pie: {
                innerRadius: 0.5,
                show: true,
                stroke: { 
                  width: 2,
                },
              },
            },
            legend: {
              container: '.flc-donut',
              backgroundOpacity: 0.5,
              noColumns: 0,
              backgroundColor: "white",
              lineWidth: 0
            },
            grid: {
              hoverable: true,
              clickable: true
            },
            tooltip: true,
            tooltipOpts: {
              content: "%p.0%, %s", // show percentages, rounding to 2 decimal places
              shifts: {
                x: 20,
                y: 0
              },
              defaultTheme: false,
              cssClass: 'flot-tooltip'
            }

          });
        }
      }
    }
  })
