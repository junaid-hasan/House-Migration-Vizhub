(function (d3$1, topojson) {
  'use strict';

  const menu = () => {
    let id;
    let labelText;
    let options;
    const listeners = d3$1.dispatch('change');
    const my = (selection) => {
      // the selection is div
      selection
        .selectAll('label')
        .data([null])
        .join('label')
        .attr('for', id)
        .text(labelText);

      selection
        .selectAll('select')
        .data([null])
        .join('select')
        .attr('name', id)
        .attr('id', id)
        .on('change', (event) => {
          //console.log(event.target.value);
          listeners.call(
            'change',
            null,
            event.target.value
          );
        })
        .selectAll('option')
        .data(options)
        .join('option')
        .attr('value', (d) => d.value)
        .text((d) => d.text);
    };

    my.id = function (_) {
      return arguments.length
        ? ((id = _), my) //return my
        : id;
    };
    my.labelText = function (_) {
      return arguments.length
        ? ((labelText = _), my) //return my
        : labelText;
    };

    my.options = function (_) {
      return arguments.length
        ? ((options = _), my) //return my
        : options;
    };

    my.on = function () {
      let value = listeners.on.apply(
        listeners,
        arguments
      );
      return value === listeners ? my : value;
    };
    return my;
  };

  const width = window.innerWidth - 100;
  const height = window.innerHeight - 100;
  let legendSvg = d3.select("#legend");


  legendSvg.append("circle").attr("cx",210).attr("cy",18).attr("r", 6).style("fill", "red").style("opacity",0.5);
  legendSvg.append("circle").attr("cx",210).attr("cy",38).attr("r", 6).style("fill", "blue").style("opacity",0.5);
  legendSvg.append("text").attr("x", 220).attr("y", 18).text("Positive Flow").style("font-size", "13px").attr("alignment-baseline","middle");
  legendSvg.append("text").attr("x", 220).attr("y", 38).text("Negative Flow").style("font-size", "13px").attr("alignment-baseline","middle");
  legendSvg.append("rect").attr("x",395).attr("y",13).attr("r", 6).attr('width',18).attr('height', 8).style("fill", "purple").style("opacity",0.7);
  legendSvg.append("rect").attr("x",395).attr("y",33).attr("r", 6).attr('width',18).attr('height', 8).style("fill", "green").style("opacity",0.7);
  legendSvg.append("text").attr("x", 420).attr("y", 18).text("origin as pct of dest incomers").style("font-size", "13px").attr("alignment-baseline","middle");
  legendSvg.append("text").attr("x", 420).attr("y", 38).text("dest as pct of origin leavers").style("font-size", "13px").attr("alignment-baseline","middle");


  const svg = d3$1.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const menuContainer = d3$1.select('body')
    .append('div')
    .attr('class', 'menu-container');
  const xMenu = menuContainer.append('div');
  //const yMenu = menuContainer.append('div');
  // Define the target date for filtering
  let targetDate = new Date('2017/1/1');
  let combobox = 'Leaver_Flow';

  const targetDates = [
    new Date('2017/1/1'),
    new Date('2017/4/1'),
    new Date('2017/7/1'),
    new Date('2017/10/1'),
    new Date('2018/1/1'),
    new Date('2018/4/1'),
    new Date('2018/7/1'),
    new Date('2018/10/1'),
    new Date('2019/1/1'),
    new Date('2019/4/1'),
    new Date('2019/7/1'),
    new Date('2019/10/1'),
    new Date('2020/1/1'),
    new Date('2020/4/1'),
    new Date('2020/7/1'),
    new Date('2020/10/1'),
    new Date('2021/1/1'),
    new Date('2021/4/1'),
    new Date('2021/7/1'),
    new Date('2021/10/1'),
    new Date('2022/1/1'),
  ];

  // Filter the data based on the target date
  // let dateData = data.filter(function(d) {
  //   return d.date.getTime() === targetDate.getTime();
  // });

  const clearButton = document.getElementById(
    'clearButton'
  );

  const handleClearButtonClick = function () {
    d3$1.selectAll('.line-leaver').remove();
    d3$1.selectAll('.line-incomer').remove();
    d3$1.selectAll('.pos-bubble').remove();
    d3$1.selectAll('.neg-bubble').remove();
    d3$1.selectAll('.flowtext').remove();
    d3$1.selectAll('.city-clicked').remove();
    d3$1.selectAll('.des-circle').remove();
    d3$1.selectAll('.ori-circle').remove();
    d3$1.selectAll('.city-name').remove();
    d3$1.selectAll('.city').remove();
  };
  clearButton.addEventListener(
    'click',
    handleClearButtonClick
  );

  let season = '4th Season, 2016';

  const projection = d3
    .geoAlbersUsa()
    .translate([width / 2, height / 2])
    .scale(width);
  const path = d3.geoPath().projection(projection);

  let radiusScale = d3
    .scaleLinear()
    .domain([0, 31000])
    .range([10, 100]);

  d3$1.json(
    'https://unpkg.com/us-atlas@3.0.0/states-10m.json'
  ).then((us) => {
    // Converting the topojson to geojson.
    console.log(us);
    const us1 = topojson.feature(us, us.objects.states);
    svg
      .append('g')
      .selectAll('path')
      .data(us1.features)
      .enter()
      .append('path')
      .attr('d', path)
      .style('fill', '#ccc')
      .style('stroke', '#fff')
      .style('stroke-width', '0.5px');
    const options = [
      { value: 'Leaver_Flow', text: 'Leaver Flow' },
      {
        value: 'Incomer_Flow',
        text: 'Incomer Flow',
      },
      //{ value: 'clear_map', text: 'Clear Map' },
    ];
    const iniDate = svg
      .append('text')
      .attr('x', 580)
      .attr('y', 15)
      .attr('class', 'date-text')
      .attr('font-size', 12)
      .attr('fill', 'black')
      .text(
        `${season}, collected by ${targetDate.toDateString()}`
      );
    let slider = document.getElementById(
      'dateSlider1'
    );

    //const slider = d3.select("#dateSlider");
    console.log(slider);
    slider.addEventListener('change', function () {
      const index = parseInt(this.value);
      d3$1.selectAll('.date-text').remove();
      targetDate = targetDates[index];
      console.log(targetDate);
      console.log(combobox);

      if (
        targetDate.getTime() ===
        targetDates[0].getTime()
      ) {
        season = '4th Season, 2016';
      } else if (
        targetDate.getTime() ===
        targetDates[1].getTime()
      ) {
        season = '1st Season, 2017';
      } else if (
        targetDate.getTime() ===
        targetDates[2].getTime()
      ) {
        season = '2nd Season, 2017';
      } else if (
        targetDate.getTime() ===
        targetDates[3].getTime()
      ) {
        season = '3rd Season, 2017';
      } else if (
        targetDate.getTime() ===
        targetDates[4].getTime()
      ) {
        season = '4th Season, 2017';
      } else if (
        targetDate.getTime() ===
        targetDates[5].getTime()
      ) {
        season = '1st Season, 2018';
      } else if (
        targetDate.getTime() ===
        targetDates[6].getTime()
      ) {
        season = '2nd Season, 2018';
      } else if (
        targetDate.getTime() ===
        targetDates[7].getTime()
      ) {
        season = '3rd Season, 2018';
      } else if (
        targetDate.getTime() ===
        targetDates[8].getTime()
      ) {
        season = '4th Season, 2018';
      } else if (
        targetDate.getTime() ===
        targetDates[9].getTime()
      ) {
        season = '1st Season, 2019';
      } else if (
        targetDate.getTime() ===
        targetDates[10].getTime()
      ) {
        season = '2nd Season, 2019';
      } else if (
        targetDate.getTime() ===
        targetDates[11].getTime()
      ) {
        season = '3rd Season, 2019';
      } else if (
        targetDate.getTime() ===
        targetDates[12].getTime()
      ) {
        season = '4th Season, 2019';
      }else if (
        targetDate.getTime() ===
        targetDates[13].getTime()
      ) {
        season = '1st Season, 2020';
      }else if (
        targetDate.getTime() ===
        targetDates[14].getTime()
      ) {
        season = '2nd Season, 2020';
      }else if (
        targetDate.getTime() ===
        targetDates[15].getTime()
      ) {
        season = '3rd Season, 2020';
      }else if (
        targetDate.getTime() ===
        targetDates[16].getTime()
      ) {
        season = '4th Season, 2020';
      }else if (
        targetDate.getTime() ===
        targetDates[17].getTime()
      ) {
        season = '1st Season, 2021';
      }else if (
        targetDate.getTime() ===
        targetDates[18].getTime()
      ) {
        season = '2nd Season, 2021';
      }else if (
        targetDate.getTime() ===
        targetDates[19].getTime()
      ) {
        season = '3rd Season, 2021';
      }else if (
        targetDate.getTime() ===
        targetDates[20].getTime()
      ) {
        season = '4th Season, 2021';
      }

      const citynametext = svg
        .append('text')
        .attr('x', 580)
        .attr('y', 15)
        .attr('class', 'date-text')
        .attr('font-size', 12)
        .attr('fill', 'black')
        .text(
          `${season}, collected by ${targetDate.toDateString()}`
        );

      if (combobox === 'Leaver_Flow') {
        // selectAll('.line-leaver').remove();
        // selectAll('.line-incomer').remove();
        d3$1.selectAll('.pos-bubble').remove();
        d3$1.selectAll('.neg-bubble').remove();
        d3$1.selectAll('.flowtext').remove();
        // selectAll('.city-clicked').remove();
        // selectAll('.des-circle').remove();
        // selectAll('.ori-circle').remove();
        d3$1.selectAll('.city-name').remove();
        d3$1.selectAll('.city').remove();
        svg.call(updateLeaverFlow);
      } else if (combobox === 'Incomer_Flow') {
        // selectAll('.line-leaver').remove();
        // selectAll('.line-incomer').remove();
        d3$1.selectAll('.pos-bubble').remove();
        d3$1.selectAll('.neg-bubble').remove();
        d3$1.selectAll('.flowtext').remove();
        // selectAll('.city-clicked').remove();
        // selectAll('.des-circle').remove();
        // selectAll('.ori-circle').remove();
        d3$1.selectAll('.city-name').remove();
        d3$1.selectAll('.city').remove();
        svg.call(updateIncomerFlow);
      }
    });

    const bubbleButton = document.getElementById(
      'bubbleButton'
    );

    const handleBubbleButtonClick = function () {
      d3$1.selectAll('.line-leaver').remove();
      d3$1.selectAll('.line-incomer').remove();
      d3$1.selectAll('.pos-bubble').remove();
      d3$1.selectAll('.neg-bubble').remove();
      d3$1.selectAll('.flowtext').remove();
      d3$1.selectAll('.city-clicked').remove();
      d3$1.selectAll('.des-circle').remove();
      d3$1.selectAll('.ori-circle').remove();
      d3$1.selectAll('.city-name').remove();
      d3$1.selectAll('.city').remove();
      console.log(targetDate);
      console.log(combobox);
      //date,city,state,netflow,lat,lon
      d3$1.csv('clean_netflow.csv', (d) => {
        return {
          date: new Date(d.date),
          city: d.city,
          netflow: +d.netflow,
          lat: +d.lat,
          lon: +d.lon,
        };
      }).then((cities) => {
        const oneDateCitiesData = cities.filter(
          (d) =>
            d.date.getTime() ===
            targetDate.getTime()
        );
        const positiveBubble = oneDateCitiesData.filter(
          (d) => d.netflow >= 0
        );
        const negativeBubble = oneDateCitiesData.filter(
          (d) => d.netflow < 0
        );
        console.log(positiveBubble);
        let cityCircles1 = svg
          .selectAll('.neg-bubble')
          .data(negativeBubble)
          .enter()
          .append('circle')
          .attr('class', 'neg-bubble')
          .attr('cx', (d) => {
            return projection([d.lon, d.lat])[0];
          })
          .attr('cy', (d) => {
            return projection([d.lon, d.lat])[1];
          })
          .attr('r', (d) => {
            if (d.netflow < 0) {
              return radiusScale(-d.netflow * 0.5);
            }
          })
          .style('fill', 'blue')
          .style('stroke', '#fff')
          .style('stroke-width', '1px')
          .style('opacity', 0.5)
          .on('mouseover', function (mouseD) {
            console.log(mouseD);
            const citynametext = svg
              .append('text')
              .attr('x', 635)
              .attr('y', 300)
              .attr('class', 'city-name')
              .attr('font-size', 22)
              .attr('fill', 'black')
              .text(
                `${mouseD.srcElement.__data__.city}: ${mouseD.srcElement.__data__.netflow} `
              );
          })
          .on('mouseout', function (mouseD) {
            d3$1.selectAll('.city-name').remove();
          });
        let cityCircles = svg
          .selectAll('.pos-bubble')
          .data(positiveBubble)
          .enter()
          .append('circle')
          .attr('class', 'pos-bubble')
          .attr('cx', (d) => {
            return projection([d.lon, d.lat])[0];
          })
          .attr('cy', (d) => {
            return projection([d.lon, d.lat])[1];
          })
          .attr('r', (d) => {
            if (d.netflow >= 0) {
              return radiusScale(d.netflow * 0.5);
            }
          })
          .style('fill', 'red')
          .style('stroke', '#fff')
          .style('stroke-width', '1px')
          .style('opacity', 0.5)
          .on('mouseover', function (mouseD) {
            console.log(mouseD);
            const citynametext = svg
              .append('text')
              .attr('x', 635)
              .attr('y', 300)
              .attr('class', 'city-name')
              .attr('font-size', 22)
              .attr('fill', 'black')
              .text(
                `${mouseD.srcElement.__data__.city}: ${mouseD.srcElement.__data__.netflow} `
              );
          })
          .on('mouseout', function (mouseD) {
            d3$1.selectAll('.city-name').remove();
          });
      });
    };
    bubbleButton.addEventListener(
      'click',
      handleBubbleButtonClick
    );

    svg.call(updateLeaverFlow);
    // menuContainer.call(menu());
    xMenu.call(
      menu()
        .id('x-menu')
        .labelText('Flow Options:  ')
        .options(options)
        .on('change', (column) => {
          // console.log('in index.js');
          console.log(column);
          combobox = column;
          if (column === 'Leaver_Flow') {
            d3$1.selectAll('.line-leaver').remove();
            d3$1.selectAll('.line-incomer').remove();
            d3$1.selectAll('.flowtext').remove();
            d3$1.selectAll('.city-clicked').remove();
            d3$1.selectAll('.des-circle').remove();
            d3$1.selectAll('.ori-circle').remove();
            d3$1.selectAll('.city-name').remove();
            d3$1.selectAll('.city').remove();
            svg.call(updateLeaverFlow);
          } else if (column === 'Incomer_Flow') {
            d3$1.selectAll('.line-leaver').remove();
            d3$1.selectAll('.line-incomer').remove();
            d3$1.selectAll('.flowtext').remove();
            d3$1.selectAll('.city-clicked').remove();
            d3$1.selectAll('.des-circle').remove();
            d3$1.selectAll('.ori-circle').remove();
            d3$1.selectAll('.city-name').remove();
            d3$1.selectAll('.city').remove();
            svg.call(updateIncomerFlow);
          }
        })
    );
    //date,origin,dest,pct_leavers,netflow,origin_lat,origin_lon,dest_lat,dest_lon,origin_city,dest_city
    function updateIncomerFlow() {
      d3$1.csv('clean_dest_incomers.csv', (d) => {
        return {
          date: new Date(d.date),
          pct_incomers: d.pct_incomers,
          //pct_leavers : parseFloat(d.pct_leavers.replace('%', '')),
          netflow: +d.netflow,
          origin_lat: +d.origin_lat,
          origin_lon: +d.origin_lon,
          dest_lat: +d.dest_lat,
          dest_lon: +d.dest_lon,
          origin_city: d.origin_city,
          dest_city: d.dest_city,
        };
      }).then((cities) => {
        // const scaleRadius = scaleLinear()
        //   .domain([0, d3.max(cities, (d) => d.flow)])
        //   .range([2, 20]);
        console.log(targetDate);
        const oneDateCitiesData = cities.filter(
          (d) =>
            d.date.getTime() ===
            targetDate.getTime()
        );
        // Draw the cities

        let cityCircles = svg
          .selectAll('circle')
          .data(oneDateCitiesData)
          .enter()
          .append('circle')
          .attr('class', 'city')
          .attr('cx', (d) => {
            return projection([
              d.dest_lon,
              d.dest_lat,
            ])[0];
          })
          .attr('cy', (d) => {
            return projection([
              d.dest_lon,
              d.dest_lat,
            ])[1];
          })
          .attr('r', 5)
          .style('fill', 'pink')
          .style('stroke', '#fff')
          .style('stroke-width', '1px')
          .on('mouseover', function (d) {
            //console.log(d);
            console.log(
              d.srcElement.__data__.netflow
            );
            //selectAll('.flowtext').remove();
            d3.select(this)
              .transition()
              .duration(200)
              //.attr('r', 10)
              .attr('r', (rData) => {
                if (
                  d.srcElement.__data__.netflow >= 0
                ) {
                  return radiusScale(
                    d.srcElement.__data__.netflow *
                      0.5
                  );
                } else {
                  return radiusScale(
                    -d.srcElement.__data__.netflow *
                      0.5
                  );
                }
              })
              .style('fill', 'blue');
            const citynametext = svg
              .append('text')
              .attr('x', 635)
              .attr('y', 300)
              .attr('class', 'city-name')
              .attr('font-size', 12)
              .attr('fill', 'blue')
              .text(
                `${d.srcElement.__data__.dest_city}, Netflow: ${d.srcElement.__data__.netflow}`
              );
          })
          .on('mouseout', function (d) {
            d3$1.selectAll('.city-name').remove();
            d3.select(this)
              .transition()
              .attr('r', 5)
              .style('fill', 'pink');
          })
          .on('click', function (d) {
            console.log(d);
            console.log(
              d.srcElement.__data__.netflow
            );
            d3$1.selectAll('.line-incomer').remove();
            d3$1.selectAll('.flowtext').remove();
            d3$1.selectAll('.city-clicked').remove();
            d3$1.selectAll('.ori-circle').remove();
            d3$1.selectAll('.city-name').remove();
            let clickedCity = d3$1.select(this);

            // console.log(clickedCity);
            // const curve = d3.line().curve(d3.curveNatural);
            const newCircle = svg
              .append('circle')
              .attr('class', 'city-clicked')
              .attr('cx', clickedCity.attr('cx'))
              .attr('cy', clickedCity.attr('cy'))
              .attr('r', (rData) => {
                if (
                  d.srcElement.__data__.netflow >= 0
                ) {
                  return radiusScale(
                    d.srcElement.__data__.netflow *
                      0.5
                  );
                } else {
                  return radiusScale(
                    -d.srcElement.__data__.netflow *
                      0.5
                  );
                }
              })
              .attr('r', 5)
              .style('fill', 'purple')
              .style('stroke', '#fff')
              .style('stroke-width', '1px')
              .style('opacity', 0.7);

            //Remove the clicked circle
            //clickedCity.remove();
            //console.log(clickedCity);
            const text = svg
              .append('text')
              .attr('x', d.x)
              .attr('y', d.y)
              .attr('class', 'flowtext')
              .attr('font-size', 20)
              .attr('fill', 'red')
              .text(d.srcElement.__data__.netflow);
            let clickedCityCoords = [
              parseFloat(clickedCity.attr('cx')),
              parseFloat(clickedCity.attr('cy')),
            ];
            console.log(oneDateCitiesData);
            let filteredCities = oneDateCitiesData.filter(
              function (oneDateCitiesData) {
                return (
                  d.srcElement.__data__
                    .dest_city ===
                  oneDateCitiesData.dest_city
                );
              }
            );
            console.log(filteredCities);

            svg
              .selectAll('line-incomer')
              .data(filteredCities)
              .enter()
              .append('path')
              .attr('d', function (d) {
                let curve = d3.curveBundle.beta(
                  0.05
                );

                // Create the line generator
                let lineGenerator = d3
                  .line()
                  .x(function (d) {
                    return d[0];
                  })
                  .y(function (d) {
                    return d[1];
                  })
                  .curve(curve);
                let origin = projection([
                  d.origin_lon,
                  d.origin_lat,
                ]);
                let destination = projection([
                  d.dest_lon,
                  d.dest_lat,
                ]);
                let midPoint = [
                  (origin[0] + destination[0]) / 4,
                  (origin[1] + destination[1]) / 4,
                ];
                let midPoint1 = [
                  ((origin[0] + destination[0]) *
                    3) /
                    8,
                  ((origin[1] + destination[1]) *
                    3) /
                    8,
                ];
                let midPoint2 = [
                  (origin[0] + destination[0]) / 2,
                  (origin[1] + destination[1]) / 2,
                ];
                let midPoint3 = [
                  ((origin[0] + destination[0]) *
                    5) /
                    8,
                  ((origin[1] + destination[1]) *
                    5) /
                    8,
                ];

                let midPoint4 = [
                  ((origin[0] + destination[0]) *
                    6) /
                    8,
                  ((origin[1] + destination[1]) *
                    6) /
                    8,
                ];
                let midPoint5 = [
                  ((origin[0] + destination[0]) *
                    7) /
                    8,
                  ((origin[1] + destination[1]) *
                    7) /
                    8,
                ];
                let lineData = [
                  origin,
                  midPoint,
                  midPoint1,
                  midPoint2,
                  midPoint3,
                  midPoint4,
                  midPoint5,
                  destination,
                ];
                //console.log(lineData);
                return lineGenerator(lineData);
              })
              .attr('class', 'line-incomer')
              .style('stroke', 'purple')
              .style('stroke-width', (d) => {
                //console.log(d);
                return parseFloat(
                  d.pct_incomers.replace('%', '')
                );
              })
              .style('opacity', 0.6)
              .attr('fill', 'none');
            //console.log(lineData);
            const ori_cities = svg
              .selectAll('.ori-circle')
              .data(filteredCities)
              .enter()
              .append('circle')
              .attr('cx', function (d) {
                return projection([
                  d.origin_lon,
                  d.origin_lat,
                ])[0];
              })
              .attr('cy', function (d) {
                return projection([
                  d.origin_lon,
                  d.origin_lat,
                ])[1];
              })
              .attr('r', 5)
              .attr('class', 'ori-circle')
              .style('fill', 'red')
              .style('stroke', '#fff')
              .style('stroke-width', '1px')
              .on('mouseover', function (mouseD) {
                console.log(mouseD);
                const citynametext = svg
                  .append('text')
                  .attr('x', 635)
                  .attr('y', 300)
                  .attr('class', 'city-name')
                  .attr('font-size', 12)
                  .attr('fill', 'blue')
                  .text(
                    `${mouseD.srcElement.__data__.origin_city}, Pct of Incomers: ${mouseD.srcElement.__data__.pct_incomers}`
                  );
              })
              .on('mouseout', function (mouseD) {
                d3$1.selectAll('.city-name').remove();
              });
          });
      });
    }
    function updateLeaverFlow() {
      d3$1.csv('clean_origin_leavers.csv', (d) => {
        return {
          date: new Date(d.date),
          pct_leavers: d.pct_leavers,
          //pct_leavers : parseFloat(d.pct_leavers.replace('%', '')),
          netflow: +d.netflow,
          origin_lat: +d.origin_lat,
          origin_lon: +d.origin_lon,
          dest_lat: +d.dest_lat,
          dest_lon: +d.dest_lon,
          origin_city: d.origin_city,
          dest_city: d.dest_city,
        };
      }).then((cities) => {
        // const scaleRadius = scaleLinear()
        //   .domain([0, d3.max(cities, (d) => d.flow)])
        //   .range([2, 20]);
        console.log(cities);
        const oneDateCitiesData = cities.filter(
          (d) =>
            d.date.getTime() ===
            targetDate.getTime()
        );
        // Draw the cities

        let cityCircles = svg
          .selectAll('circle')
          .data(oneDateCitiesData)
          .enter()
          .append('circle')
          .attr('class', 'city')
          .attr('cx', (d) => {
            return projection([
              d.origin_lon,
              d.origin_lat,
            ])[0];
          })
          .attr('cy', (d) => {
            return projection([
              d.origin_lon,
              d.origin_lat,
            ])[1];
          })
          .attr('r', 5)
          .style('fill', 'gold')
          .style('stroke', '#fff')
          .style('stroke-width', '1px')
          .on('mouseover', function (d) {
            //console.log(d);
            console.log(
              d.srcElement.__data__.netflow
            );
            //selectAll('.flowtext').remove();
            d3.select(this)
              .transition()
              .duration(200)
              //.attr('r', 10)
              .attr('r', (rData) => {
                if (
                  d.srcElement.__data__.netflow >= 0
                ) {
                  return radiusScale(
                    d.srcElement.__data__.netflow *
                      0.5
                  );
                } else {
                  return radiusScale(
                    -d.srcElement.__data__.netflow *
                      0.5
                  );
                }
              })
              .style('fill', 'blue');

            const citynametext = svg
              .append('text')
              .attr('x', 635)
              .attr('y', 300)
              .attr('class', 'city-name')
              .attr('font-size', 12)
              .attr('fill', 'blue')
              .text(
                    `${d.srcElement.__data__.origin_city}, Netflow: ${d.srcElement.__data__.netflow}`
                  );
          })
          .on('mouseout', function (d) {
            d3$1.selectAll('.city-name').remove();
            d3.select(this)
              .transition()
              .attr('r', 5)
              .style('fill', 'gold');
          })
          .on('click', function (d) {
            console.log(d);
            console.log(
              d.srcElement.__data__.netflow
            );
            d3$1.selectAll('.line-leaver').remove();
            d3$1.selectAll('.flowtext').remove();
            d3$1.selectAll('.city-clicked').remove();
            d3$1.selectAll('.des-circle').remove();
            d3$1.selectAll('.city-name').remove();
            let clickedCity = d3$1.select(this);

            // console.log(clickedCity);
            // const curve = d3.line().curve(d3.curveNatural);
            const newCircle = svg
              .append('circle')
              .attr('class', 'city-clicked')
              .attr('cx', clickedCity.attr('cx'))
              .attr('cy', clickedCity.attr('cy'))
              .attr('r', (rData) => {
                if (
                  d.srcElement.__data__.netflow >= 0
                ) {
                  return radiusScale(
                    d.srcElement.__data__.netflow *
                      0.5
                  );
                } else {
                  return radiusScale(
                    -d.srcElement.__data__.netflow *
                      0.5
                  );
                }
              })
              .attr('r', 5)
              .style('fill', 'green')
              .style('stroke', '#fff')
              .style('stroke-width', '1px')
              .style('opacity', 0.7);

            //Remove the clicked circle
            //clickedCity.remove();
            //console.log(clickedCity);
            const text = svg
              .append('text')
              .attr('x', d.x)
              .attr('y', d.y)
              .attr('class', 'flowtext')
              .attr('font-size', 20)
              .attr('fill', 'red')
              .text(d.srcElement.__data__.netflow);
            let clickedCityCoords = [
              parseFloat(clickedCity.attr('cx')),
              parseFloat(clickedCity.attr('cy')),
            ];
            console.log(oneDateCitiesData);
            let filteredCities = oneDateCitiesData.filter(
              function (oneDateCitiesData) {
                return (
                  d.srcElement.__data__
                    .origin_city ===
                  oneDateCitiesData.origin_city
                );
              }
            );
            console.log(filteredCities);

            svg
              .selectAll('line-leaver')
              .data(filteredCities)
              .enter()
              .append('path')
              .attr('d', function (d) {
                let curve = d3.curveBundle.beta(
                  0.05
                );

                // Create the line generator
                let lineGenerator = d3
                  .line()
                  .x(function (d) {
                    return d[0];
                  })
                  .y(function (d) {
                    return d[1];
                  })
                  .curve(curve);
                let origin = projection([
                  d.origin_lon,
                  d.origin_lat,
                ]);
                let destination = projection([
                  d.dest_lon,
                  d.dest_lat,
                ]);
                let midPoint = [
                  (origin[0] + destination[0]) / 4,
                  (origin[1] + destination[1]) / 4,
                ];
                let midPoint1 = [
                  ((origin[0] + destination[0]) *
                    3) /
                    8,
                  ((origin[1] + destination[1]) *
                    3) /
                    8,
                ];
                let midPoint2 = [
                  (origin[0] + destination[0]) / 2,
                  (origin[1] + destination[1]) / 2,
                ];
                let midPoint3 = [
                  ((origin[0] + destination[0]) *
                    5) /
                    8,
                  ((origin[1] + destination[1]) *
                    5) /
                    8,
                ];

                let midPoint4 = [
                  ((origin[0] + destination[0]) *
                    6) /
                    8,
                  ((origin[1] + destination[1]) *
                    6) /
                    8,
                ];
                let midPoint5 = [
                  ((origin[0] + destination[0]) *
                    7) /
                    8,
                  ((origin[1] + destination[1]) *
                    7) /
                    8,
                ];
                let lineData = [
                  origin,
                  midPoint,
                  midPoint1,
                  midPoint2,
                  midPoint3,
                  midPoint4,
                  midPoint5,
                  destination,
                ];
                console.log(lineData);
                return lineGenerator(lineData);
              })
              .attr('class', 'line-leaver')
              .style('stroke', 'green')
              .style('stroke-width', (d) => {
                console.log(d);
                return parseFloat(
                  d.pct_leavers.replace('%', '')
                );
              })
              .style('opacity', 0.6)
              .attr('fill', 'none');

            const des_cities = svg
              .selectAll('.des-circle')
              .data(filteredCities)
              .enter()
              .append('circle')
              .attr('cx', function (d) {
                return projection([
                  d.dest_lon,
                  d.dest_lat,
                ])[0];
              })
              .attr('cy', function (d) {
                return projection([
                  d.dest_lon,
                  d.dest_lat,
                ])[1];
              })
              .attr('r', 5)
              .attr('class', 'des-circle')
              .style('fill', 'red')
              .style('stroke', '#fff')
              .style('stroke-width', '1px')
              .on('mouseover', function (mouseD) {
                console.log(mouseD);
                const citynametext = svg
                  .append('text')
                  .attr('x', 635)
                  .attr('y', 300)
                  .attr('class', 'city-name')
                  .attr('font-size', 12)
                  .attr('fill', 'blue')
                  .text(
                    `${mouseD.srcElement.__data__.dest_city}, Pct of Leavers: ${mouseD.srcElement.__data__.pct_leavers}`
                  );
              })
              .on('mouseout', function (mouseD) {
                d3$1.selectAll('.city-name').remove();
              });
          });
      });
    }
  });

}(d3, topojson));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIm1lbnUuanMiLCJpbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBkaXNwYXRjaCB9IGZyb20gJ2QzJztcbmV4cG9ydCBjb25zdCBtZW51ID0gKCkgPT4ge1xuICBsZXQgaWQ7XG4gIGxldCBsYWJlbFRleHQ7XG4gIGxldCBvcHRpb25zO1xuICBjb25zdCBsaXN0ZW5lcnMgPSBkaXNwYXRjaCgnY2hhbmdlJyk7XG4gIGNvbnN0IG15ID0gKHNlbGVjdGlvbikgPT4ge1xuICAgIC8vIHRoZSBzZWxlY3Rpb24gaXMgZGl2XG4gICAgc2VsZWN0aW9uXG4gICAgICAuc2VsZWN0QWxsKCdsYWJlbCcpXG4gICAgICAuZGF0YShbbnVsbF0pXG4gICAgICAuam9pbignbGFiZWwnKVxuICAgICAgLmF0dHIoJ2ZvcicsIGlkKVxuICAgICAgLnRleHQobGFiZWxUZXh0KTtcblxuICAgIHNlbGVjdGlvblxuICAgICAgLnNlbGVjdEFsbCgnc2VsZWN0JylcbiAgICAgIC5kYXRhKFtudWxsXSlcbiAgICAgIC5qb2luKCdzZWxlY3QnKVxuICAgICAgLmF0dHIoJ25hbWUnLCBpZClcbiAgICAgIC5hdHRyKCdpZCcsIGlkKVxuICAgICAgLm9uKCdjaGFuZ2UnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgICBsaXN0ZW5lcnMuY2FsbChcbiAgICAgICAgICAnY2hhbmdlJyxcbiAgICAgICAgICBudWxsLFxuICAgICAgICAgIGV2ZW50LnRhcmdldC52YWx1ZVxuICAgICAgICApO1xuICAgICAgfSlcbiAgICAgIC5zZWxlY3RBbGwoJ29wdGlvbicpXG4gICAgICAuZGF0YShvcHRpb25zKVxuICAgICAgLmpvaW4oJ29wdGlvbicpXG4gICAgICAuYXR0cigndmFsdWUnLCAoZCkgPT4gZC52YWx1ZSlcbiAgICAgIC50ZXh0KChkKSA9PiBkLnRleHQpO1xuICB9O1xuXG4gIG15LmlkID0gZnVuY3Rpb24gKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgPyAoKGlkID0gXyksIG15KSAvL3JldHVybiBteVxuICAgICAgOiBpZDtcbiAgfTtcbiAgbXkubGFiZWxUZXh0ID0gZnVuY3Rpb24gKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgPyAoKGxhYmVsVGV4dCA9IF8pLCBteSkgLy9yZXR1cm4gbXlcbiAgICAgIDogbGFiZWxUZXh0O1xuICB9O1xuXG4gIG15Lm9wdGlvbnMgPSBmdW5jdGlvbiAoXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoXG4gICAgICA/ICgob3B0aW9ucyA9IF8pLCBteSkgLy9yZXR1cm4gbXlcbiAgICAgIDogb3B0aW9ucztcbiAgfTtcblxuICBteS5vbiA9IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgdmFsdWUgPSBsaXN0ZW5lcnMub24uYXBwbHkoXG4gICAgICBsaXN0ZW5lcnMsXG4gICAgICBhcmd1bWVudHNcbiAgICApO1xuICAgIHJldHVybiB2YWx1ZSA9PT0gbGlzdGVuZXJzID8gbXkgOiB2YWx1ZTtcbiAgfTtcbiAgcmV0dXJuIG15O1xufTsiLCJpbXBvcnQge1xuICBjc3YsXG4gIHNlbGVjdCxcbiAgc2VsZWN0QWxsLFxuICBzY2FsZUxpbmVhcixcbiAganNvbixcbiAgZ2VvQWxiZXJzVXNhLFxufSBmcm9tICdkMyc7XG5pbXBvcnQgeyBmZWF0dXJlIH0gZnJvbSAndG9wb2pzb24nO1xuaW1wb3J0IHsgbWVudSB9IGZyb20gJy4vbWVudSc7XG5jb25zdCB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoIC0gMTAwO1xuY29uc3QgaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0IC0gMTAwO1xubGV0IGxlZ2VuZFN2ZyA9IGQzLnNlbGVjdChcIiNsZWdlbmRcIilcblxuXG5sZWdlbmRTdmcuYXBwZW5kKFwiY2lyY2xlXCIpLmF0dHIoXCJjeFwiLDIxMCkuYXR0cihcImN5XCIsMTgpLmF0dHIoXCJyXCIsIDYpLnN0eWxlKFwiZmlsbFwiLCBcInJlZFwiKS5zdHlsZShcIm9wYWNpdHlcIiwwLjUpXG5sZWdlbmRTdmcuYXBwZW5kKFwiY2lyY2xlXCIpLmF0dHIoXCJjeFwiLDIxMCkuYXR0cihcImN5XCIsMzgpLmF0dHIoXCJyXCIsIDYpLnN0eWxlKFwiZmlsbFwiLCBcImJsdWVcIikuc3R5bGUoXCJvcGFjaXR5XCIsMC41KVxubGVnZW5kU3ZnLmFwcGVuZChcInRleHRcIikuYXR0cihcInhcIiwgMjIwKS5hdHRyKFwieVwiLCAxOCkudGV4dChcIlBvc2l0aXZlIEZsb3dcIikuc3R5bGUoXCJmb250LXNpemVcIiwgXCIxM3B4XCIpLmF0dHIoXCJhbGlnbm1lbnQtYmFzZWxpbmVcIixcIm1pZGRsZVwiKVxubGVnZW5kU3ZnLmFwcGVuZChcInRleHRcIikuYXR0cihcInhcIiwgMjIwKS5hdHRyKFwieVwiLCAzOCkudGV4dChcIk5lZ2F0aXZlIEZsb3dcIikuc3R5bGUoXCJmb250LXNpemVcIiwgXCIxM3B4XCIpLmF0dHIoXCJhbGlnbm1lbnQtYmFzZWxpbmVcIixcIm1pZGRsZVwiKVxubGVnZW5kU3ZnLmFwcGVuZChcInJlY3RcIikuYXR0cihcInhcIiwzOTUpLmF0dHIoXCJ5XCIsMTMpLmF0dHIoXCJyXCIsIDYpLmF0dHIoJ3dpZHRoJywxOCkuYXR0cignaGVpZ2h0JywgOCkuc3R5bGUoXCJmaWxsXCIsIFwicHVycGxlXCIpLnN0eWxlKFwib3BhY2l0eVwiLDAuNylcbmxlZ2VuZFN2Zy5hcHBlbmQoXCJyZWN0XCIpLmF0dHIoXCJ4XCIsMzk1KS5hdHRyKFwieVwiLDMzKS5hdHRyKFwiclwiLCA2KS5hdHRyKCd3aWR0aCcsMTgpLmF0dHIoJ2hlaWdodCcsIDgpLnN0eWxlKFwiZmlsbFwiLCBcImdyZWVuXCIpLnN0eWxlKFwib3BhY2l0eVwiLDAuNylcbmxlZ2VuZFN2Zy5hcHBlbmQoXCJ0ZXh0XCIpLmF0dHIoXCJ4XCIsIDQyMCkuYXR0cihcInlcIiwgMTgpLnRleHQoXCJvcmlnaW4gYXMgcGN0IG9mIGRlc3QgaW5jb21lcnNcIikuc3R5bGUoXCJmb250LXNpemVcIiwgXCIxM3B4XCIpLmF0dHIoXCJhbGlnbm1lbnQtYmFzZWxpbmVcIixcIm1pZGRsZVwiKVxubGVnZW5kU3ZnLmFwcGVuZChcInRleHRcIikuYXR0cihcInhcIiwgNDIwKS5hdHRyKFwieVwiLCAzOCkudGV4dChcImRlc3QgYXMgcGN0IG9mIG9yaWdpbiBsZWF2ZXJzXCIpLnN0eWxlKFwiZm9udC1zaXplXCIsIFwiMTNweFwiKS5hdHRyKFwiYWxpZ25tZW50LWJhc2VsaW5lXCIsXCJtaWRkbGVcIilcblxuXG5jb25zdCBzdmcgPSBzZWxlY3QoJ2JvZHknKVxuICAuYXBwZW5kKCdzdmcnKVxuICAuYXR0cignd2lkdGgnLCB3aWR0aClcbiAgLmF0dHIoJ2hlaWdodCcsIGhlaWdodCk7XG5cbmNvbnN0IG1lbnVDb250YWluZXIgPSBzZWxlY3QoJ2JvZHknKVxuICAuYXBwZW5kKCdkaXYnKVxuICAuYXR0cignY2xhc3MnLCAnbWVudS1jb250YWluZXInKTtcbmNvbnN0IHhNZW51ID0gbWVudUNvbnRhaW5lci5hcHBlbmQoJ2RpdicpO1xuLy9jb25zdCB5TWVudSA9IG1lbnVDb250YWluZXIuYXBwZW5kKCdkaXYnKTtcbi8vIERlZmluZSB0aGUgdGFyZ2V0IGRhdGUgZm9yIGZpbHRlcmluZ1xubGV0IHRhcmdldERhdGUgPSBuZXcgRGF0ZSgnMjAxNy8xLzEnKTtcbmxldCBjb21ib2JveCA9ICdMZWF2ZXJfRmxvdyc7XG5cbmNvbnN0IHRhcmdldERhdGVzID0gW1xuICBuZXcgRGF0ZSgnMjAxNy8xLzEnKSxcbiAgbmV3IERhdGUoJzIwMTcvNC8xJyksXG4gIG5ldyBEYXRlKCcyMDE3LzcvMScpLFxuICBuZXcgRGF0ZSgnMjAxNy8xMC8xJyksXG4gIG5ldyBEYXRlKCcyMDE4LzEvMScpLFxuICBuZXcgRGF0ZSgnMjAxOC80LzEnKSxcbiAgbmV3IERhdGUoJzIwMTgvNy8xJyksXG4gIG5ldyBEYXRlKCcyMDE4LzEwLzEnKSxcbiAgbmV3IERhdGUoJzIwMTkvMS8xJyksXG4gIG5ldyBEYXRlKCcyMDE5LzQvMScpLFxuICBuZXcgRGF0ZSgnMjAxOS83LzEnKSxcbiAgbmV3IERhdGUoJzIwMTkvMTAvMScpLFxuICBuZXcgRGF0ZSgnMjAyMC8xLzEnKSxcbiAgbmV3IERhdGUoJzIwMjAvNC8xJyksXG4gIG5ldyBEYXRlKCcyMDIwLzcvMScpLFxuICBuZXcgRGF0ZSgnMjAyMC8xMC8xJyksXG4gIG5ldyBEYXRlKCcyMDIxLzEvMScpLFxuICBuZXcgRGF0ZSgnMjAyMS80LzEnKSxcbiAgbmV3IERhdGUoJzIwMjEvNy8xJyksXG4gIG5ldyBEYXRlKCcyMDIxLzEwLzEnKSxcbiAgbmV3IERhdGUoJzIwMjIvMS8xJyksXG5dO1xuXG4vLyBGaWx0ZXIgdGhlIGRhdGEgYmFzZWQgb24gdGhlIHRhcmdldCBkYXRlXG4vLyBsZXQgZGF0ZURhdGEgPSBkYXRhLmZpbHRlcihmdW5jdGlvbihkKSB7XG4vLyAgIHJldHVybiBkLmRhdGUuZ2V0VGltZSgpID09PSB0YXJnZXREYXRlLmdldFRpbWUoKTtcbi8vIH0pO1xuXG5jb25zdCBjbGVhckJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAnY2xlYXJCdXR0b24nXG4pO1xuXG5jb25zdCBoYW5kbGVDbGVhckJ1dHRvbkNsaWNrID0gZnVuY3Rpb24gKCkge1xuICBzZWxlY3RBbGwoJy5saW5lLWxlYXZlcicpLnJlbW92ZSgpO1xuICBzZWxlY3RBbGwoJy5saW5lLWluY29tZXInKS5yZW1vdmUoKTtcbiAgc2VsZWN0QWxsKCcucG9zLWJ1YmJsZScpLnJlbW92ZSgpO1xuICBzZWxlY3RBbGwoJy5uZWctYnViYmxlJykucmVtb3ZlKCk7XG4gIHNlbGVjdEFsbCgnLmZsb3d0ZXh0JykucmVtb3ZlKCk7XG4gIHNlbGVjdEFsbCgnLmNpdHktY2xpY2tlZCcpLnJlbW92ZSgpO1xuICBzZWxlY3RBbGwoJy5kZXMtY2lyY2xlJykucmVtb3ZlKCk7XG4gIHNlbGVjdEFsbCgnLm9yaS1jaXJjbGUnKS5yZW1vdmUoKTtcbiAgc2VsZWN0QWxsKCcuY2l0eS1uYW1lJykucmVtb3ZlKCk7XG4gIHNlbGVjdEFsbCgnLmNpdHknKS5yZW1vdmUoKTtcbn07XG5jbGVhckJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFxuICAnY2xpY2snLFxuICBoYW5kbGVDbGVhckJ1dHRvbkNsaWNrXG4pO1xuXG5sZXQgc2Vhc29uID0gJzR0aCBTZWFzb24sIDIwMTYnO1xuXG5jb25zdCBwcm9qZWN0aW9uID0gZDNcbiAgLmdlb0FsYmVyc1VzYSgpXG4gIC50cmFuc2xhdGUoW3dpZHRoIC8gMiwgaGVpZ2h0IC8gMl0pXG4gIC5zY2FsZSh3aWR0aCk7XG5jb25zdCBwYXRoID0gZDMuZ2VvUGF0aCgpLnByb2plY3Rpb24ocHJvamVjdGlvbik7XG5cbmxldCByYWRpdXNTY2FsZSA9IGQzXG4gIC5zY2FsZUxpbmVhcigpXG4gIC5kb21haW4oWzAsIDMxMDAwXSlcbiAgLnJhbmdlKFsxMCwgMTAwXSk7XG5cbmpzb24oXG4gICdodHRwczovL3VucGtnLmNvbS91cy1hdGxhc0AzLjAuMC9zdGF0ZXMtMTBtLmpzb24nXG4pLnRoZW4oKHVzKSA9PiB7XG4gIC8vIENvbnZlcnRpbmcgdGhlIHRvcG9qc29uIHRvIGdlb2pzb24uXG4gIGNvbnNvbGUubG9nKHVzKTtcbiAgY29uc3QgdXMxID0gZmVhdHVyZSh1cywgdXMub2JqZWN0cy5zdGF0ZXMpO1xuICBzdmdcbiAgICAuYXBwZW5kKCdnJylcbiAgICAuc2VsZWN0QWxsKCdwYXRoJylcbiAgICAuZGF0YSh1czEuZmVhdHVyZXMpXG4gICAgLmVudGVyKClcbiAgICAuYXBwZW5kKCdwYXRoJylcbiAgICAuYXR0cignZCcsIHBhdGgpXG4gICAgLnN0eWxlKCdmaWxsJywgJyNjY2MnKVxuICAgIC5zdHlsZSgnc3Ryb2tlJywgJyNmZmYnKVxuICAgIC5zdHlsZSgnc3Ryb2tlLXdpZHRoJywgJzAuNXB4Jyk7XG4gIGNvbnN0IG9wdGlvbnMgPSBbXG4gICAgeyB2YWx1ZTogJ0xlYXZlcl9GbG93JywgdGV4dDogJ0xlYXZlciBGbG93JyB9LFxuICAgIHtcbiAgICAgIHZhbHVlOiAnSW5jb21lcl9GbG93JyxcbiAgICAgIHRleHQ6ICdJbmNvbWVyIEZsb3cnLFxuICAgIH0sXG4gICAgLy97IHZhbHVlOiAnY2xlYXJfbWFwJywgdGV4dDogJ0NsZWFyIE1hcCcgfSxcbiAgXTtcbiAgY29uc3QgaW5pRGF0ZSA9IHN2Z1xuICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgIC5hdHRyKCd4JywgNTgwKVxuICAgIC5hdHRyKCd5JywgMTUpXG4gICAgLmF0dHIoJ2NsYXNzJywgJ2RhdGUtdGV4dCcpXG4gICAgLmF0dHIoJ2ZvbnQtc2l6ZScsIDEyKVxuICAgIC5hdHRyKCdmaWxsJywgJ2JsYWNrJylcbiAgICAudGV4dChcbiAgICAgIGAke3NlYXNvbn0sIGNvbGxlY3RlZCBieSAke3RhcmdldERhdGUudG9EYXRlU3RyaW5nKCl9YFxuICAgICk7XG4gIGxldCBzbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAnZGF0ZVNsaWRlcjEnXG4gICk7XG5cbiAgLy9jb25zdCBzbGlkZXIgPSBkMy5zZWxlY3QoXCIjZGF0ZVNsaWRlclwiKTtcbiAgY29uc29sZS5sb2coc2xpZGVyKTtcbiAgc2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBpbmRleCA9IHBhcnNlSW50KHRoaXMudmFsdWUpO1xuICAgIHNlbGVjdEFsbCgnLmRhdGUtdGV4dCcpLnJlbW92ZSgpO1xuICAgIC8vY29uc29sZS5sb2codGhpcy52YWx1ZSk7XG4gICAgY29uc3QgbmV3RGF0ZSA9IHRhcmdldERhdGVzW2luZGV4XTtcbiAgICB0YXJnZXREYXRlID0gdGFyZ2V0RGF0ZXNbaW5kZXhdO1xuICAgIGNvbnNvbGUubG9nKHRhcmdldERhdGUpO1xuICAgIGNvbnNvbGUubG9nKGNvbWJvYm94KTtcblxuICAgIGlmIChcbiAgICAgIHRhcmdldERhdGUuZ2V0VGltZSgpID09PVxuICAgICAgdGFyZ2V0RGF0ZXNbMF0uZ2V0VGltZSgpXG4gICAgKSB7XG4gICAgICBzZWFzb24gPSAnNHRoIFNlYXNvbiwgMjAxNic7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHRhcmdldERhdGUuZ2V0VGltZSgpID09PVxuICAgICAgdGFyZ2V0RGF0ZXNbMV0uZ2V0VGltZSgpXG4gICAgKSB7XG4gICAgICBzZWFzb24gPSAnMXN0IFNlYXNvbiwgMjAxNyc7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHRhcmdldERhdGUuZ2V0VGltZSgpID09PVxuICAgICAgdGFyZ2V0RGF0ZXNbMl0uZ2V0VGltZSgpXG4gICAgKSB7XG4gICAgICBzZWFzb24gPSAnMm5kIFNlYXNvbiwgMjAxNyc7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHRhcmdldERhdGUuZ2V0VGltZSgpID09PVxuICAgICAgdGFyZ2V0RGF0ZXNbM10uZ2V0VGltZSgpXG4gICAgKSB7XG4gICAgICBzZWFzb24gPSAnM3JkIFNlYXNvbiwgMjAxNyc7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHRhcmdldERhdGUuZ2V0VGltZSgpID09PVxuICAgICAgdGFyZ2V0RGF0ZXNbNF0uZ2V0VGltZSgpXG4gICAgKSB7XG4gICAgICBzZWFzb24gPSAnNHRoIFNlYXNvbiwgMjAxNyc7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHRhcmdldERhdGUuZ2V0VGltZSgpID09PVxuICAgICAgdGFyZ2V0RGF0ZXNbNV0uZ2V0VGltZSgpXG4gICAgKSB7XG4gICAgICBzZWFzb24gPSAnMXN0IFNlYXNvbiwgMjAxOCc7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHRhcmdldERhdGUuZ2V0VGltZSgpID09PVxuICAgICAgdGFyZ2V0RGF0ZXNbNl0uZ2V0VGltZSgpXG4gICAgKSB7XG4gICAgICBzZWFzb24gPSAnMm5kIFNlYXNvbiwgMjAxOCc7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHRhcmdldERhdGUuZ2V0VGltZSgpID09PVxuICAgICAgdGFyZ2V0RGF0ZXNbN10uZ2V0VGltZSgpXG4gICAgKSB7XG4gICAgICBzZWFzb24gPSAnM3JkIFNlYXNvbiwgMjAxOCc7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHRhcmdldERhdGUuZ2V0VGltZSgpID09PVxuICAgICAgdGFyZ2V0RGF0ZXNbOF0uZ2V0VGltZSgpXG4gICAgKSB7XG4gICAgICBzZWFzb24gPSAnNHRoIFNlYXNvbiwgMjAxOCc7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHRhcmdldERhdGUuZ2V0VGltZSgpID09PVxuICAgICAgdGFyZ2V0RGF0ZXNbOV0uZ2V0VGltZSgpXG4gICAgKSB7XG4gICAgICBzZWFzb24gPSAnMXN0IFNlYXNvbiwgMjAxOSc7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHRhcmdldERhdGUuZ2V0VGltZSgpID09PVxuICAgICAgdGFyZ2V0RGF0ZXNbMTBdLmdldFRpbWUoKVxuICAgICkge1xuICAgICAgc2Vhc29uID0gJzJuZCBTZWFzb24sIDIwMTknO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICB0YXJnZXREYXRlLmdldFRpbWUoKSA9PT1cbiAgICAgIHRhcmdldERhdGVzWzExXS5nZXRUaW1lKClcbiAgICApIHtcbiAgICAgIHNlYXNvbiA9ICczcmQgU2Vhc29uLCAyMDE5JztcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgdGFyZ2V0RGF0ZS5nZXRUaW1lKCkgPT09XG4gICAgICB0YXJnZXREYXRlc1sxMl0uZ2V0VGltZSgpXG4gICAgKSB7XG4gICAgICBzZWFzb24gPSAnNHRoIFNlYXNvbiwgMjAxOSc7XG4gICAgfWVsc2UgaWYgKFxuICAgICAgdGFyZ2V0RGF0ZS5nZXRUaW1lKCkgPT09XG4gICAgICB0YXJnZXREYXRlc1sxM10uZ2V0VGltZSgpXG4gICAgKSB7XG4gICAgICBzZWFzb24gPSAnMXN0IFNlYXNvbiwgMjAyMCc7XG4gICAgfWVsc2UgaWYgKFxuICAgICAgdGFyZ2V0RGF0ZS5nZXRUaW1lKCkgPT09XG4gICAgICB0YXJnZXREYXRlc1sxNF0uZ2V0VGltZSgpXG4gICAgKSB7XG4gICAgICBzZWFzb24gPSAnMm5kIFNlYXNvbiwgMjAyMCc7XG4gICAgfWVsc2UgaWYgKFxuICAgICAgdGFyZ2V0RGF0ZS5nZXRUaW1lKCkgPT09XG4gICAgICB0YXJnZXREYXRlc1sxNV0uZ2V0VGltZSgpXG4gICAgKSB7XG4gICAgICBzZWFzb24gPSAnM3JkIFNlYXNvbiwgMjAyMCc7XG4gICAgfWVsc2UgaWYgKFxuICAgICAgdGFyZ2V0RGF0ZS5nZXRUaW1lKCkgPT09XG4gICAgICB0YXJnZXREYXRlc1sxNl0uZ2V0VGltZSgpXG4gICAgKSB7XG4gICAgICBzZWFzb24gPSAnNHRoIFNlYXNvbiwgMjAyMCc7XG4gICAgfWVsc2UgaWYgKFxuICAgICAgdGFyZ2V0RGF0ZS5nZXRUaW1lKCkgPT09XG4gICAgICB0YXJnZXREYXRlc1sxN10uZ2V0VGltZSgpXG4gICAgKSB7XG4gICAgICBzZWFzb24gPSAnMXN0IFNlYXNvbiwgMjAyMSc7XG4gICAgfWVsc2UgaWYgKFxuICAgICAgdGFyZ2V0RGF0ZS5nZXRUaW1lKCkgPT09XG4gICAgICB0YXJnZXREYXRlc1sxOF0uZ2V0VGltZSgpXG4gICAgKSB7XG4gICAgICBzZWFzb24gPSAnMm5kIFNlYXNvbiwgMjAyMSc7XG4gICAgfWVsc2UgaWYgKFxuICAgICAgdGFyZ2V0RGF0ZS5nZXRUaW1lKCkgPT09XG4gICAgICB0YXJnZXREYXRlc1sxOV0uZ2V0VGltZSgpXG4gICAgKSB7XG4gICAgICBzZWFzb24gPSAnM3JkIFNlYXNvbiwgMjAyMSc7XG4gICAgfWVsc2UgaWYgKFxuICAgICAgdGFyZ2V0RGF0ZS5nZXRUaW1lKCkgPT09XG4gICAgICB0YXJnZXREYXRlc1syMF0uZ2V0VGltZSgpXG4gICAgKSB7XG4gICAgICBzZWFzb24gPSAnNHRoIFNlYXNvbiwgMjAyMSc7XG4gICAgfVxuXG4gICAgY29uc3QgY2l0eW5hbWV0ZXh0ID0gc3ZnXG4gICAgICAuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyKCd4JywgNTgwKVxuICAgICAgLmF0dHIoJ3knLCAxNSlcbiAgICAgIC5hdHRyKCdjbGFzcycsICdkYXRlLXRleHQnKVxuICAgICAgLmF0dHIoJ2ZvbnQtc2l6ZScsIDEyKVxuICAgICAgLmF0dHIoJ2ZpbGwnLCAnYmxhY2snKVxuICAgICAgLnRleHQoXG4gICAgICAgIGAke3NlYXNvbn0sIGNvbGxlY3RlZCBieSAke3RhcmdldERhdGUudG9EYXRlU3RyaW5nKCl9YFxuICAgICAgKTtcblxuICAgIGlmIChjb21ib2JveCA9PT0gJ0xlYXZlcl9GbG93Jykge1xuICAgICAgLy8gc2VsZWN0QWxsKCcubGluZS1sZWF2ZXInKS5yZW1vdmUoKTtcbiAgICAgIC8vIHNlbGVjdEFsbCgnLmxpbmUtaW5jb21lcicpLnJlbW92ZSgpO1xuICAgICAgc2VsZWN0QWxsKCcucG9zLWJ1YmJsZScpLnJlbW92ZSgpO1xuICAgICAgc2VsZWN0QWxsKCcubmVnLWJ1YmJsZScpLnJlbW92ZSgpO1xuICAgICAgc2VsZWN0QWxsKCcuZmxvd3RleHQnKS5yZW1vdmUoKTtcbiAgICAgIC8vIHNlbGVjdEFsbCgnLmNpdHktY2xpY2tlZCcpLnJlbW92ZSgpO1xuICAgICAgLy8gc2VsZWN0QWxsKCcuZGVzLWNpcmNsZScpLnJlbW92ZSgpO1xuICAgICAgLy8gc2VsZWN0QWxsKCcub3JpLWNpcmNsZScpLnJlbW92ZSgpO1xuICAgICAgc2VsZWN0QWxsKCcuY2l0eS1uYW1lJykucmVtb3ZlKCk7XG4gICAgICBzZWxlY3RBbGwoJy5jaXR5JykucmVtb3ZlKCk7XG4gICAgICBzdmcuY2FsbCh1cGRhdGVMZWF2ZXJGbG93KTtcbiAgICB9IGVsc2UgaWYgKGNvbWJvYm94ID09PSAnSW5jb21lcl9GbG93Jykge1xuICAgICAgLy8gc2VsZWN0QWxsKCcubGluZS1sZWF2ZXInKS5yZW1vdmUoKTtcbiAgICAgIC8vIHNlbGVjdEFsbCgnLmxpbmUtaW5jb21lcicpLnJlbW92ZSgpO1xuICAgICAgc2VsZWN0QWxsKCcucG9zLWJ1YmJsZScpLnJlbW92ZSgpO1xuICAgICAgc2VsZWN0QWxsKCcubmVnLWJ1YmJsZScpLnJlbW92ZSgpO1xuICAgICAgc2VsZWN0QWxsKCcuZmxvd3RleHQnKS5yZW1vdmUoKTtcbiAgICAgIC8vIHNlbGVjdEFsbCgnLmNpdHktY2xpY2tlZCcpLnJlbW92ZSgpO1xuICAgICAgLy8gc2VsZWN0QWxsKCcuZGVzLWNpcmNsZScpLnJlbW92ZSgpO1xuICAgICAgLy8gc2VsZWN0QWxsKCcub3JpLWNpcmNsZScpLnJlbW92ZSgpO1xuICAgICAgc2VsZWN0QWxsKCcuY2l0eS1uYW1lJykucmVtb3ZlKCk7XG4gICAgICBzZWxlY3RBbGwoJy5jaXR5JykucmVtb3ZlKCk7XG4gICAgICBzdmcuY2FsbCh1cGRhdGVJbmNvbWVyRmxvdyk7XG4gICAgfVxuICB9KTtcblxuICBjb25zdCBidWJibGVCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAnYnViYmxlQnV0dG9uJ1xuICApO1xuXG4gIGNvbnN0IGhhbmRsZUJ1YmJsZUJ1dHRvbkNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgIHNlbGVjdEFsbCgnLmxpbmUtbGVhdmVyJykucmVtb3ZlKCk7XG4gICAgc2VsZWN0QWxsKCcubGluZS1pbmNvbWVyJykucmVtb3ZlKCk7XG4gICAgc2VsZWN0QWxsKCcucG9zLWJ1YmJsZScpLnJlbW92ZSgpO1xuICAgIHNlbGVjdEFsbCgnLm5lZy1idWJibGUnKS5yZW1vdmUoKTtcbiAgICBzZWxlY3RBbGwoJy5mbG93dGV4dCcpLnJlbW92ZSgpO1xuICAgIHNlbGVjdEFsbCgnLmNpdHktY2xpY2tlZCcpLnJlbW92ZSgpO1xuICAgIHNlbGVjdEFsbCgnLmRlcy1jaXJjbGUnKS5yZW1vdmUoKTtcbiAgICBzZWxlY3RBbGwoJy5vcmktY2lyY2xlJykucmVtb3ZlKCk7XG4gICAgc2VsZWN0QWxsKCcuY2l0eS1uYW1lJykucmVtb3ZlKCk7XG4gICAgc2VsZWN0QWxsKCcuY2l0eScpLnJlbW92ZSgpO1xuICAgIGNvbnNvbGUubG9nKHRhcmdldERhdGUpO1xuICAgIGNvbnNvbGUubG9nKGNvbWJvYm94KTtcbiAgICAvL2RhdGUsY2l0eSxzdGF0ZSxuZXRmbG93LGxhdCxsb25cbiAgICBjc3YoJ2NsZWFuX25ldGZsb3cuY3N2JywgKGQpID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGRhdGU6IG5ldyBEYXRlKGQuZGF0ZSksXG4gICAgICAgIGNpdHk6IGQuY2l0eSxcbiAgICAgICAgbmV0ZmxvdzogK2QubmV0ZmxvdyxcbiAgICAgICAgbGF0OiArZC5sYXQsXG4gICAgICAgIGxvbjogK2QubG9uLFxuICAgICAgfTtcbiAgICB9KS50aGVuKChjaXRpZXMpID0+IHtcbiAgICAgIGNvbnN0IG9uZURhdGVDaXRpZXNEYXRhID0gY2l0aWVzLmZpbHRlcihcbiAgICAgICAgKGQpID0+XG4gICAgICAgICAgZC5kYXRlLmdldFRpbWUoKSA9PT1cbiAgICAgICAgICB0YXJnZXREYXRlLmdldFRpbWUoKVxuICAgICAgKTtcbiAgICAgIGNvbnN0IHBvc2l0aXZlQnViYmxlID0gb25lRGF0ZUNpdGllc0RhdGEuZmlsdGVyKFxuICAgICAgICAoZCkgPT4gZC5uZXRmbG93ID49IDBcbiAgICAgICk7XG4gICAgICBjb25zdCBuZWdhdGl2ZUJ1YmJsZSA9IG9uZURhdGVDaXRpZXNEYXRhLmZpbHRlcihcbiAgICAgICAgKGQpID0+IGQubmV0ZmxvdyA8IDBcbiAgICAgICk7XG4gICAgICBjb25zb2xlLmxvZyhwb3NpdGl2ZUJ1YmJsZSk7XG4gICAgICBsZXQgY2l0eUNpcmNsZXMxID0gc3ZnXG4gICAgICAgIC5zZWxlY3RBbGwoJy5uZWctYnViYmxlJylcbiAgICAgICAgLmRhdGEobmVnYXRpdmVCdWJibGUpXG4gICAgICAgIC5lbnRlcigpXG4gICAgICAgIC5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICduZWctYnViYmxlJylcbiAgICAgICAgLmF0dHIoJ2N4JywgKGQpID0+IHtcbiAgICAgICAgICByZXR1cm4gcHJvamVjdGlvbihbZC5sb24sIGQubGF0XSlbMF07XG4gICAgICAgIH0pXG4gICAgICAgIC5hdHRyKCdjeScsIChkKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHByb2plY3Rpb24oW2QubG9uLCBkLmxhdF0pWzFdO1xuICAgICAgICB9KVxuICAgICAgICAuYXR0cigncicsIChkKSA9PiB7XG4gICAgICAgICAgaWYgKGQubmV0ZmxvdyA8IDApIHtcbiAgICAgICAgICAgIHJldHVybiByYWRpdXNTY2FsZSgtZC5uZXRmbG93ICogMC41KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5zdHlsZSgnZmlsbCcsICdibHVlJylcbiAgICAgICAgLnN0eWxlKCdzdHJva2UnLCAnI2ZmZicpXG4gICAgICAgIC5zdHlsZSgnc3Ryb2tlLXdpZHRoJywgJzFweCcpXG4gICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDAuNSlcbiAgICAgICAgLm9uKCdtb3VzZW92ZXInLCBmdW5jdGlvbiAobW91c2VEKSB7XG4gICAgICAgICAgY29uc29sZS5sb2cobW91c2VEKTtcbiAgICAgICAgICBjb25zdCBjaXR5bmFtZXRleHQgPSBzdmdcbiAgICAgICAgICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAgICAgLmF0dHIoJ3gnLCA2MzUpXG4gICAgICAgICAgICAuYXR0cigneScsIDMwMClcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdjaXR5LW5hbWUnKVxuICAgICAgICAgICAgLmF0dHIoJ2ZvbnQtc2l6ZScsIDIyKVxuICAgICAgICAgICAgLmF0dHIoJ2ZpbGwnLCAnYmxhY2snKVxuICAgICAgICAgICAgLnRleHQoXG4gICAgICAgICAgICAgIGAke21vdXNlRC5zcmNFbGVtZW50Ll9fZGF0YV9fLmNpdHl9OiAke21vdXNlRC5zcmNFbGVtZW50Ll9fZGF0YV9fLm5ldGZsb3d9IGBcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pXG4gICAgICAgIC5vbignbW91c2VvdXQnLCBmdW5jdGlvbiAobW91c2VEKSB7XG4gICAgICAgICAgc2VsZWN0QWxsKCcuY2l0eS1uYW1lJykucmVtb3ZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgbGV0IGNpdHlDaXJjbGVzID0gc3ZnXG4gICAgICAgIC5zZWxlY3RBbGwoJy5wb3MtYnViYmxlJylcbiAgICAgICAgLmRhdGEocG9zaXRpdmVCdWJibGUpXG4gICAgICAgIC5lbnRlcigpXG4gICAgICAgIC5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdwb3MtYnViYmxlJylcbiAgICAgICAgLmF0dHIoJ2N4JywgKGQpID0+IHtcbiAgICAgICAgICByZXR1cm4gcHJvamVjdGlvbihbZC5sb24sIGQubGF0XSlbMF07XG4gICAgICAgIH0pXG4gICAgICAgIC5hdHRyKCdjeScsIChkKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHByb2plY3Rpb24oW2QubG9uLCBkLmxhdF0pWzFdO1xuICAgICAgICB9KVxuICAgICAgICAuYXR0cigncicsIChkKSA9PiB7XG4gICAgICAgICAgaWYgKGQubmV0ZmxvdyA+PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gcmFkaXVzU2NhbGUoZC5uZXRmbG93ICogMC41KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5zdHlsZSgnZmlsbCcsICdyZWQnKVxuICAgICAgICAuc3R5bGUoJ3N0cm9rZScsICcjZmZmJylcbiAgICAgICAgLnN0eWxlKCdzdHJva2Utd2lkdGgnLCAnMXB4JylcbiAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMC41KVxuICAgICAgICAub24oJ21vdXNlb3ZlcicsIGZ1bmN0aW9uIChtb3VzZUQpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhtb3VzZUQpO1xuICAgICAgICAgIGNvbnN0IGNpdHluYW1ldGV4dCA9IHN2Z1xuICAgICAgICAgICAgLmFwcGVuZCgndGV4dCcpXG4gICAgICAgICAgICAuYXR0cigneCcsIDYzNSlcbiAgICAgICAgICAgIC5hdHRyKCd5JywgMzAwKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2NpdHktbmFtZScpXG4gICAgICAgICAgICAuYXR0cignZm9udC1zaXplJywgMjIpXG4gICAgICAgICAgICAuYXR0cignZmlsbCcsICdibGFjaycpXG4gICAgICAgICAgICAudGV4dChcbiAgICAgICAgICAgICAgYCR7bW91c2VELnNyY0VsZW1lbnQuX19kYXRhX18uY2l0eX06ICR7bW91c2VELnNyY0VsZW1lbnQuX19kYXRhX18ubmV0Zmxvd30gYFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKCdtb3VzZW91dCcsIGZ1bmN0aW9uIChtb3VzZUQpIHtcbiAgICAgICAgICBzZWxlY3RBbGwoJy5jaXR5LW5hbWUnKS5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG4gIGJ1YmJsZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICdjbGljaycsXG4gICAgaGFuZGxlQnViYmxlQnV0dG9uQ2xpY2tcbiAgKTtcblxuICBzdmcuY2FsbCh1cGRhdGVMZWF2ZXJGbG93KTtcbiAgLy8gbWVudUNvbnRhaW5lci5jYWxsKG1lbnUoKSk7XG4gIHhNZW51LmNhbGwoXG4gICAgbWVudSgpXG4gICAgICAuaWQoJ3gtbWVudScpXG4gICAgICAubGFiZWxUZXh0KCdGbG93IE9wdGlvbnM6ICAnKVxuICAgICAgLm9wdGlvbnMob3B0aW9ucylcbiAgICAgIC5vbignY2hhbmdlJywgKGNvbHVtbikgPT4ge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnaW4gaW5kZXguanMnKTtcbiAgICAgICAgY29uc29sZS5sb2coY29sdW1uKTtcbiAgICAgICAgY29tYm9ib3ggPSBjb2x1bW47XG4gICAgICAgIGlmIChjb2x1bW4gPT09ICdMZWF2ZXJfRmxvdycpIHtcbiAgICAgICAgICBzZWxlY3RBbGwoJy5saW5lLWxlYXZlcicpLnJlbW92ZSgpO1xuICAgICAgICAgIHNlbGVjdEFsbCgnLmxpbmUtaW5jb21lcicpLnJlbW92ZSgpO1xuICAgICAgICAgIHNlbGVjdEFsbCgnLmZsb3d0ZXh0JykucmVtb3ZlKCk7XG4gICAgICAgICAgc2VsZWN0QWxsKCcuY2l0eS1jbGlja2VkJykucmVtb3ZlKCk7XG4gICAgICAgICAgc2VsZWN0QWxsKCcuZGVzLWNpcmNsZScpLnJlbW92ZSgpO1xuICAgICAgICAgIHNlbGVjdEFsbCgnLm9yaS1jaXJjbGUnKS5yZW1vdmUoKTtcbiAgICAgICAgICBzZWxlY3RBbGwoJy5jaXR5LW5hbWUnKS5yZW1vdmUoKTtcbiAgICAgICAgICBzZWxlY3RBbGwoJy5jaXR5JykucmVtb3ZlKCk7XG4gICAgICAgICAgc3ZnLmNhbGwodXBkYXRlTGVhdmVyRmxvdyk7XG4gICAgICAgIH0gZWxzZSBpZiAoY29sdW1uID09PSAnSW5jb21lcl9GbG93Jykge1xuICAgICAgICAgIHNlbGVjdEFsbCgnLmxpbmUtbGVhdmVyJykucmVtb3ZlKCk7XG4gICAgICAgICAgc2VsZWN0QWxsKCcubGluZS1pbmNvbWVyJykucmVtb3ZlKCk7XG4gICAgICAgICAgc2VsZWN0QWxsKCcuZmxvd3RleHQnKS5yZW1vdmUoKTtcbiAgICAgICAgICBzZWxlY3RBbGwoJy5jaXR5LWNsaWNrZWQnKS5yZW1vdmUoKTtcbiAgICAgICAgICBzZWxlY3RBbGwoJy5kZXMtY2lyY2xlJykucmVtb3ZlKCk7XG4gICAgICAgICAgc2VsZWN0QWxsKCcub3JpLWNpcmNsZScpLnJlbW92ZSgpO1xuICAgICAgICAgIHNlbGVjdEFsbCgnLmNpdHktbmFtZScpLnJlbW92ZSgpO1xuICAgICAgICAgIHNlbGVjdEFsbCgnLmNpdHknKS5yZW1vdmUoKTtcbiAgICAgICAgICBzdmcuY2FsbCh1cGRhdGVJbmNvbWVyRmxvdyk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICk7XG4gIC8vZGF0ZSxvcmlnaW4sZGVzdCxwY3RfbGVhdmVycyxuZXRmbG93LG9yaWdpbl9sYXQsb3JpZ2luX2xvbixkZXN0X2xhdCxkZXN0X2xvbixvcmlnaW5fY2l0eSxkZXN0X2NpdHlcbiAgZnVuY3Rpb24gdXBkYXRlSW5jb21lckZsb3coKSB7XG4gICAgY3N2KCdjbGVhbl9kZXN0X2luY29tZXJzLmNzdicsIChkKSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBkYXRlOiBuZXcgRGF0ZShkLmRhdGUpLFxuICAgICAgICBwY3RfaW5jb21lcnM6IGQucGN0X2luY29tZXJzLFxuICAgICAgICAvL3BjdF9sZWF2ZXJzIDogcGFyc2VGbG9hdChkLnBjdF9sZWF2ZXJzLnJlcGxhY2UoJyUnLCAnJykpLFxuICAgICAgICBuZXRmbG93OiArZC5uZXRmbG93LFxuICAgICAgICBvcmlnaW5fbGF0OiArZC5vcmlnaW5fbGF0LFxuICAgICAgICBvcmlnaW5fbG9uOiArZC5vcmlnaW5fbG9uLFxuICAgICAgICBkZXN0X2xhdDogK2QuZGVzdF9sYXQsXG4gICAgICAgIGRlc3RfbG9uOiArZC5kZXN0X2xvbixcbiAgICAgICAgb3JpZ2luX2NpdHk6IGQub3JpZ2luX2NpdHksXG4gICAgICAgIGRlc3RfY2l0eTogZC5kZXN0X2NpdHksXG4gICAgICB9O1xuICAgIH0pLnRoZW4oKGNpdGllcykgPT4ge1xuICAgICAgLy8gY29uc3Qgc2NhbGVSYWRpdXMgPSBzY2FsZUxpbmVhcigpXG4gICAgICAvLyAgIC5kb21haW4oWzAsIGQzLm1heChjaXRpZXMsIChkKSA9PiBkLmZsb3cpXSlcbiAgICAgIC8vICAgLnJhbmdlKFsyLCAyMF0pO1xuICAgICAgY29uc29sZS5sb2codGFyZ2V0RGF0ZSk7XG4gICAgICBjb25zdCBvbmVEYXRlQ2l0aWVzRGF0YSA9IGNpdGllcy5maWx0ZXIoXG4gICAgICAgIChkKSA9PlxuICAgICAgICAgIGQuZGF0ZS5nZXRUaW1lKCkgPT09XG4gICAgICAgICAgdGFyZ2V0RGF0ZS5nZXRUaW1lKClcbiAgICAgICk7XG4gICAgICAvLyBEcmF3IHRoZSBjaXRpZXNcblxuICAgICAgbGV0IGNpdHlDaXJjbGVzID0gc3ZnXG4gICAgICAgIC5zZWxlY3RBbGwoJ2NpcmNsZScpXG4gICAgICAgIC5kYXRhKG9uZURhdGVDaXRpZXNEYXRhKVxuICAgICAgICAuZW50ZXIoKVxuICAgICAgICAuYXBwZW5kKCdjaXJjbGUnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnY2l0eScpXG4gICAgICAgIC5hdHRyKCdjeCcsIChkKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHByb2plY3Rpb24oW1xuICAgICAgICAgICAgZC5kZXN0X2xvbixcbiAgICAgICAgICAgIGQuZGVzdF9sYXQsXG4gICAgICAgICAgXSlbMF07XG4gICAgICAgIH0pXG4gICAgICAgIC5hdHRyKCdjeScsIChkKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHByb2plY3Rpb24oW1xuICAgICAgICAgICAgZC5kZXN0X2xvbixcbiAgICAgICAgICAgIGQuZGVzdF9sYXQsXG4gICAgICAgICAgXSlbMV07XG4gICAgICAgIH0pXG4gICAgICAgIC5hdHRyKCdyJywgNSlcbiAgICAgICAgLnN0eWxlKCdmaWxsJywgJ3BpbmsnKVxuICAgICAgICAuc3R5bGUoJ3N0cm9rZScsICcjZmZmJylcbiAgICAgICAgLnN0eWxlKCdzdHJva2Utd2lkdGgnLCAnMXB4JylcbiAgICAgICAgLm9uKCdtb3VzZW92ZXInLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgIC8vY29uc29sZS5sb2coZCk7XG4gICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICBkLnNyY0VsZW1lbnQuX19kYXRhX18ubmV0Zmxvd1xuICAgICAgICAgICk7XG4gICAgICAgICAgLy9zZWxlY3RBbGwoJy5mbG93dGV4dCcpLnJlbW92ZSgpO1xuICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKVxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgLmR1cmF0aW9uKDIwMClcbiAgICAgICAgICAgIC8vLmF0dHIoJ3InLCAxMClcbiAgICAgICAgICAgIC5hdHRyKCdyJywgKHJEYXRhKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBkLnNyY0VsZW1lbnQuX19kYXRhX18ubmV0ZmxvdyA+PSAwXG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHJldHVybiByYWRpdXNTY2FsZShcbiAgICAgICAgICAgICAgICAgIGQuc3JjRWxlbWVudC5fX2RhdGFfXy5uZXRmbG93ICpcbiAgICAgICAgICAgICAgICAgICAgMC41XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmFkaXVzU2NhbGUoXG4gICAgICAgICAgICAgICAgICAtZC5zcmNFbGVtZW50Ll9fZGF0YV9fLm5ldGZsb3cgKlxuICAgICAgICAgICAgICAgICAgICAwLjVcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0eWxlKCdmaWxsJywgJ2JsdWUnKTtcbiAgICAgICAgICBjb25zdCBjaXR5bmFtZXRleHQgPSBzdmdcbiAgICAgICAgICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAgICAgLmF0dHIoJ3gnLCA2MzUpXG4gICAgICAgICAgICAuYXR0cigneScsIDMwMClcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdjaXR5LW5hbWUnKVxuICAgICAgICAgICAgLmF0dHIoJ2ZvbnQtc2l6ZScsIDEyKVxuICAgICAgICAgICAgLmF0dHIoJ2ZpbGwnLCAnYmx1ZScpXG4gICAgICAgICAgICAudGV4dChcbiAgICAgICAgICAgICAgYCR7ZC5zcmNFbGVtZW50Ll9fZGF0YV9fLmRlc3RfY2l0eX0sIE5ldGZsb3c6ICR7ZC5zcmNFbGVtZW50Ll9fZGF0YV9fLm5ldGZsb3d9YFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKCdtb3VzZW91dCcsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgc2VsZWN0QWxsKCcuY2l0eS1uYW1lJykucmVtb3ZlKCk7XG4gICAgICAgICAgZDMuc2VsZWN0KHRoaXMpXG4gICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAuYXR0cigncicsIDUpXG4gICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAncGluaycpO1xuICAgICAgICB9KVxuICAgICAgICAub24oJ2NsaWNrJywgZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhkKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgIGQuc3JjRWxlbWVudC5fX2RhdGFfXy5uZXRmbG93XG4gICAgICAgICAgKTtcbiAgICAgICAgICBzZWxlY3RBbGwoJy5saW5lLWluY29tZXInKS5yZW1vdmUoKTtcbiAgICAgICAgICBzZWxlY3RBbGwoJy5mbG93dGV4dCcpLnJlbW92ZSgpO1xuICAgICAgICAgIHNlbGVjdEFsbCgnLmNpdHktY2xpY2tlZCcpLnJlbW92ZSgpO1xuICAgICAgICAgIHNlbGVjdEFsbCgnLm9yaS1jaXJjbGUnKS5yZW1vdmUoKTtcbiAgICAgICAgICBzZWxlY3RBbGwoJy5jaXR5LW5hbWUnKS5yZW1vdmUoKTtcbiAgICAgICAgICBsZXQgY2xpY2tlZENpdHkgPSBzZWxlY3QodGhpcyk7XG5cbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhjbGlja2VkQ2l0eSk7XG4gICAgICAgICAgLy8gY29uc3QgY3VydmUgPSBkMy5saW5lKCkuY3VydmUoZDMuY3VydmVOYXR1cmFsKTtcbiAgICAgICAgICBjb25zdCBuZXdDaXJjbGUgPSBzdmdcbiAgICAgICAgICAgIC5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnY2l0eS1jbGlja2VkJylcbiAgICAgICAgICAgIC5hdHRyKCdjeCcsIGNsaWNrZWRDaXR5LmF0dHIoJ2N4JykpXG4gICAgICAgICAgICAuYXR0cignY3knLCBjbGlja2VkQ2l0eS5hdHRyKCdjeScpKVxuICAgICAgICAgICAgLmF0dHIoJ3InLCAockRhdGEpID0+IHtcbiAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGQuc3JjRWxlbWVudC5fX2RhdGFfXy5uZXRmbG93ID49IDBcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJhZGl1c1NjYWxlKFxuICAgICAgICAgICAgICAgICAgZC5zcmNFbGVtZW50Ll9fZGF0YV9fLm5ldGZsb3cgKlxuICAgICAgICAgICAgICAgICAgICAwLjVcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiByYWRpdXNTY2FsZShcbiAgICAgICAgICAgICAgICAgIC1kLnNyY0VsZW1lbnQuX19kYXRhX18ubmV0ZmxvdyAqXG4gICAgICAgICAgICAgICAgICAgIDAuNVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuYXR0cigncicsIDUpXG4gICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAncHVycGxlJylcbiAgICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlJywgJyNmZmYnKVxuICAgICAgICAgICAgLnN0eWxlKCdzdHJva2Utd2lkdGgnLCAnMXB4JylcbiAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDAuNyk7XG5cbiAgICAgICAgICAvL1JlbW92ZSB0aGUgY2xpY2tlZCBjaXJjbGVcbiAgICAgICAgICAvL2NsaWNrZWRDaXR5LnJlbW92ZSgpO1xuICAgICAgICAgIC8vY29uc29sZS5sb2coY2xpY2tlZENpdHkpO1xuICAgICAgICAgIGNvbnN0IHRleHQgPSBzdmdcbiAgICAgICAgICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAgICAgLmF0dHIoJ3gnLCBkLngpXG4gICAgICAgICAgICAuYXR0cigneScsIGQueSlcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdmbG93dGV4dCcpXG4gICAgICAgICAgICAuYXR0cignZm9udC1zaXplJywgMjApXG4gICAgICAgICAgICAuYXR0cignZmlsbCcsICdyZWQnKVxuICAgICAgICAgICAgLnRleHQoZC5zcmNFbGVtZW50Ll9fZGF0YV9fLm5ldGZsb3cpO1xuICAgICAgICAgIGxldCBjbGlja2VkQ2l0eUNvb3JkcyA9IFtcbiAgICAgICAgICAgIHBhcnNlRmxvYXQoY2xpY2tlZENpdHkuYXR0cignY3gnKSksXG4gICAgICAgICAgICBwYXJzZUZsb2F0KGNsaWNrZWRDaXR5LmF0dHIoJ2N5JykpLFxuICAgICAgICAgIF07XG4gICAgICAgICAgY29uc29sZS5sb2cob25lRGF0ZUNpdGllc0RhdGEpO1xuICAgICAgICAgIGxldCBmaWx0ZXJlZENpdGllcyA9IG9uZURhdGVDaXRpZXNEYXRhLmZpbHRlcihcbiAgICAgICAgICAgIGZ1bmN0aW9uIChvbmVEYXRlQ2l0aWVzRGF0YSkge1xuICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIGQuc3JjRWxlbWVudC5fX2RhdGFfX1xuICAgICAgICAgICAgICAgICAgLmRlc3RfY2l0eSA9PT1cbiAgICAgICAgICAgICAgICBvbmVEYXRlQ2l0aWVzRGF0YS5kZXN0X2NpdHlcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuICAgICAgICAgIGNvbnNvbGUubG9nKGZpbHRlcmVkQ2l0aWVzKTtcblxuICAgICAgICAgIHN2Z1xuICAgICAgICAgICAgLnNlbGVjdEFsbCgnbGluZS1pbmNvbWVyJylcbiAgICAgICAgICAgIC5kYXRhKGZpbHRlcmVkQ2l0aWVzKVxuICAgICAgICAgICAgLmVudGVyKClcbiAgICAgICAgICAgIC5hcHBlbmQoJ3BhdGgnKVxuICAgICAgICAgICAgLmF0dHIoJ2QnLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICBsZXQgY3VydmUgPSBkMy5jdXJ2ZUJ1bmRsZS5iZXRhKFxuICAgICAgICAgICAgICAgIDAuMDVcbiAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAvLyBDcmVhdGUgdGhlIGxpbmUgZ2VuZXJhdG9yXG4gICAgICAgICAgICAgIGxldCBsaW5lR2VuZXJhdG9yID0gZDNcbiAgICAgICAgICAgICAgICAubGluZSgpXG4gICAgICAgICAgICAgICAgLngoZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBkWzBdO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnkoZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBkWzFdO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmN1cnZlKGN1cnZlKTtcbiAgICAgICAgICAgICAgbGV0IG9yaWdpbiA9IHByb2plY3Rpb24oW1xuICAgICAgICAgICAgICAgIGQub3JpZ2luX2xvbixcbiAgICAgICAgICAgICAgICBkLm9yaWdpbl9sYXQsXG4gICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgICBsZXQgZGVzdGluYXRpb24gPSBwcm9qZWN0aW9uKFtcbiAgICAgICAgICAgICAgICBkLmRlc3RfbG9uLFxuICAgICAgICAgICAgICAgIGQuZGVzdF9sYXQsXG4gICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgICBsZXQgbWlkUG9pbnQgPSBbXG4gICAgICAgICAgICAgICAgKG9yaWdpblswXSArIGRlc3RpbmF0aW9uWzBdKSAvIDQsXG4gICAgICAgICAgICAgICAgKG9yaWdpblsxXSArIGRlc3RpbmF0aW9uWzFdKSAvIDQsXG4gICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgIGxldCBtaWRQb2ludDEgPSBbXG4gICAgICAgICAgICAgICAgKChvcmlnaW5bMF0gKyBkZXN0aW5hdGlvblswXSkgKlxuICAgICAgICAgICAgICAgICAgMykgL1xuICAgICAgICAgICAgICAgICAgOCxcbiAgICAgICAgICAgICAgICAoKG9yaWdpblsxXSArIGRlc3RpbmF0aW9uWzFdKSAqXG4gICAgICAgICAgICAgICAgICAzKSAvXG4gICAgICAgICAgICAgICAgICA4LFxuICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICBsZXQgbWlkUG9pbnQyID0gW1xuICAgICAgICAgICAgICAgIChvcmlnaW5bMF0gKyBkZXN0aW5hdGlvblswXSkgLyAyLFxuICAgICAgICAgICAgICAgIChvcmlnaW5bMV0gKyBkZXN0aW5hdGlvblsxXSkgLyAyLFxuICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICBsZXQgbWlkUG9pbnQzID0gW1xuICAgICAgICAgICAgICAgICgob3JpZ2luWzBdICsgZGVzdGluYXRpb25bMF0pICpcbiAgICAgICAgICAgICAgICAgIDUpIC9cbiAgICAgICAgICAgICAgICAgIDgsXG4gICAgICAgICAgICAgICAgKChvcmlnaW5bMV0gKyBkZXN0aW5hdGlvblsxXSkgKlxuICAgICAgICAgICAgICAgICAgNSkgL1xuICAgICAgICAgICAgICAgICAgOCxcbiAgICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgICBsZXQgbWlkUG9pbnQ0ID0gW1xuICAgICAgICAgICAgICAgICgob3JpZ2luWzBdICsgZGVzdGluYXRpb25bMF0pICpcbiAgICAgICAgICAgICAgICAgIDYpIC9cbiAgICAgICAgICAgICAgICAgIDgsXG4gICAgICAgICAgICAgICAgKChvcmlnaW5bMV0gKyBkZXN0aW5hdGlvblsxXSkgKlxuICAgICAgICAgICAgICAgICAgNikgL1xuICAgICAgICAgICAgICAgICAgOCxcbiAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgbGV0IG1pZFBvaW50NSA9IFtcbiAgICAgICAgICAgICAgICAoKG9yaWdpblswXSArIGRlc3RpbmF0aW9uWzBdKSAqXG4gICAgICAgICAgICAgICAgICA3KSAvXG4gICAgICAgICAgICAgICAgICA4LFxuICAgICAgICAgICAgICAgICgob3JpZ2luWzFdICsgZGVzdGluYXRpb25bMV0pICpcbiAgICAgICAgICAgICAgICAgIDcpIC9cbiAgICAgICAgICAgICAgICAgIDgsXG4gICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgIGxldCBsaW5lRGF0YSA9IFtcbiAgICAgICAgICAgICAgICBvcmlnaW4sXG4gICAgICAgICAgICAgICAgbWlkUG9pbnQsXG4gICAgICAgICAgICAgICAgbWlkUG9pbnQxLFxuICAgICAgICAgICAgICAgIG1pZFBvaW50MixcbiAgICAgICAgICAgICAgICBtaWRQb2ludDMsXG4gICAgICAgICAgICAgICAgbWlkUG9pbnQ0LFxuICAgICAgICAgICAgICAgIG1pZFBvaW50NSxcbiAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbixcbiAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhsaW5lRGF0YSk7XG4gICAgICAgICAgICAgIHJldHVybiBsaW5lR2VuZXJhdG9yKGxpbmVEYXRhKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbGluZS1pbmNvbWVyJylcbiAgICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlJywgJ3B1cnBsZScpXG4gICAgICAgICAgICAuc3R5bGUoJ3N0cm9rZS13aWR0aCcsIChkKSA9PiB7XG4gICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZCk7XG4gICAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KFxuICAgICAgICAgICAgICAgIGQucGN0X2luY29tZXJzLnJlcGxhY2UoJyUnLCAnJylcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwLjYpXG4gICAgICAgICAgICAuYXR0cignZmlsbCcsICdub25lJyk7XG4gICAgICAgICAgLy9jb25zb2xlLmxvZyhsaW5lRGF0YSk7XG4gICAgICAgICAgY29uc3Qgb3JpX2NpdGllcyA9IHN2Z1xuICAgICAgICAgICAgLnNlbGVjdEFsbCgnLm9yaS1jaXJjbGUnKVxuICAgICAgICAgICAgLmRhdGEoZmlsdGVyZWRDaXRpZXMpXG4gICAgICAgICAgICAuZW50ZXIoKVxuICAgICAgICAgICAgLmFwcGVuZCgnY2lyY2xlJylcbiAgICAgICAgICAgIC5hdHRyKCdjeCcsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgIHJldHVybiBwcm9qZWN0aW9uKFtcbiAgICAgICAgICAgICAgICBkLm9yaWdpbl9sb24sXG4gICAgICAgICAgICAgICAgZC5vcmlnaW5fbGF0LFxuICAgICAgICAgICAgICBdKVswXTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuYXR0cignY3knLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICByZXR1cm4gcHJvamVjdGlvbihbXG4gICAgICAgICAgICAgICAgZC5vcmlnaW5fbG9uLFxuICAgICAgICAgICAgICAgIGQub3JpZ2luX2xhdCxcbiAgICAgICAgICAgICAgXSlbMV07XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmF0dHIoJ3InLCA1KVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ29yaS1jaXJjbGUnKVxuICAgICAgICAgICAgLnN0eWxlKCdmaWxsJywgJ3JlZCcpXG4gICAgICAgICAgICAuc3R5bGUoJ3N0cm9rZScsICcjZmZmJylcbiAgICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlLXdpZHRoJywgJzFweCcpXG4gICAgICAgICAgICAub24oJ21vdXNlb3ZlcicsIGZ1bmN0aW9uIChtb3VzZUQpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2cobW91c2VEKTtcbiAgICAgICAgICAgICAgY29uc3QgY2l0eW5hbWV0ZXh0ID0gc3ZnXG4gICAgICAgICAgICAgICAgLmFwcGVuZCgndGV4dCcpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3gnLCA2MzUpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3knLCAzMDApXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2NpdHktbmFtZScpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2ZvbnQtc2l6ZScsIDEyKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdmaWxsJywgJ2JsdWUnKVxuICAgICAgICAgICAgICAgIC50ZXh0KFxuICAgICAgICAgICAgICAgICAgYCR7bW91c2VELnNyY0VsZW1lbnQuX19kYXRhX18ub3JpZ2luX2NpdHl9LCBQY3Qgb2YgSW5jb21lcnM6ICR7bW91c2VELnNyY0VsZW1lbnQuX19kYXRhX18ucGN0X2luY29tZXJzfWBcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5vbignbW91c2VvdXQnLCBmdW5jdGlvbiAobW91c2VEKSB7XG4gICAgICAgICAgICAgIHNlbGVjdEFsbCgnLmNpdHktbmFtZScpLnJlbW92ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIHVwZGF0ZUxlYXZlckZsb3coKSB7XG4gICAgY3N2KCdjbGVhbl9vcmlnaW5fbGVhdmVycy5jc3YnLCAoZCkgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZGF0ZTogbmV3IERhdGUoZC5kYXRlKSxcbiAgICAgICAgcGN0X2xlYXZlcnM6IGQucGN0X2xlYXZlcnMsXG4gICAgICAgIC8vcGN0X2xlYXZlcnMgOiBwYXJzZUZsb2F0KGQucGN0X2xlYXZlcnMucmVwbGFjZSgnJScsICcnKSksXG4gICAgICAgIG5ldGZsb3c6ICtkLm5ldGZsb3csXG4gICAgICAgIG9yaWdpbl9sYXQ6ICtkLm9yaWdpbl9sYXQsXG4gICAgICAgIG9yaWdpbl9sb246ICtkLm9yaWdpbl9sb24sXG4gICAgICAgIGRlc3RfbGF0OiArZC5kZXN0X2xhdCxcbiAgICAgICAgZGVzdF9sb246ICtkLmRlc3RfbG9uLFxuICAgICAgICBvcmlnaW5fY2l0eTogZC5vcmlnaW5fY2l0eSxcbiAgICAgICAgZGVzdF9jaXR5OiBkLmRlc3RfY2l0eSxcbiAgICAgIH07XG4gICAgfSkudGhlbigoY2l0aWVzKSA9PiB7XG4gICAgICAvLyBjb25zdCBzY2FsZVJhZGl1cyA9IHNjYWxlTGluZWFyKClcbiAgICAgIC8vICAgLmRvbWFpbihbMCwgZDMubWF4KGNpdGllcywgKGQpID0+IGQuZmxvdyldKVxuICAgICAgLy8gICAucmFuZ2UoWzIsIDIwXSk7XG4gICAgICBjb25zb2xlLmxvZyhjaXRpZXMpO1xuICAgICAgY29uc3Qgb25lRGF0ZUNpdGllc0RhdGEgPSBjaXRpZXMuZmlsdGVyKFxuICAgICAgICAoZCkgPT5cbiAgICAgICAgICBkLmRhdGUuZ2V0VGltZSgpID09PVxuICAgICAgICAgIHRhcmdldERhdGUuZ2V0VGltZSgpXG4gICAgICApO1xuICAgICAgLy8gRHJhdyB0aGUgY2l0aWVzXG5cbiAgICAgIGxldCBjaXR5Q2lyY2xlcyA9IHN2Z1xuICAgICAgICAuc2VsZWN0QWxsKCdjaXJjbGUnKVxuICAgICAgICAuZGF0YShvbmVEYXRlQ2l0aWVzRGF0YSlcbiAgICAgICAgLmVudGVyKClcbiAgICAgICAgLmFwcGVuZCgnY2lyY2xlJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2NpdHknKVxuICAgICAgICAuYXR0cignY3gnLCAoZCkgPT4ge1xuICAgICAgICAgIHJldHVybiBwcm9qZWN0aW9uKFtcbiAgICAgICAgICAgIGQub3JpZ2luX2xvbixcbiAgICAgICAgICAgIGQub3JpZ2luX2xhdCxcbiAgICAgICAgICBdKVswXTtcbiAgICAgICAgfSlcbiAgICAgICAgLmF0dHIoJ2N5JywgKGQpID0+IHtcbiAgICAgICAgICByZXR1cm4gcHJvamVjdGlvbihbXG4gICAgICAgICAgICBkLm9yaWdpbl9sb24sXG4gICAgICAgICAgICBkLm9yaWdpbl9sYXQsXG4gICAgICAgICAgXSlbMV07XG4gICAgICAgIH0pXG4gICAgICAgIC5hdHRyKCdyJywgNSlcbiAgICAgICAgLnN0eWxlKCdmaWxsJywgJ2dvbGQnKVxuICAgICAgICAuc3R5bGUoJ3N0cm9rZScsICcjZmZmJylcbiAgICAgICAgLnN0eWxlKCdzdHJva2Utd2lkdGgnLCAnMXB4JylcbiAgICAgICAgLm9uKCdtb3VzZW92ZXInLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgIC8vY29uc29sZS5sb2coZCk7XG4gICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICBkLnNyY0VsZW1lbnQuX19kYXRhX18ubmV0Zmxvd1xuICAgICAgICAgICk7XG4gICAgICAgICAgLy9zZWxlY3RBbGwoJy5mbG93dGV4dCcpLnJlbW92ZSgpO1xuICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKVxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgLmR1cmF0aW9uKDIwMClcbiAgICAgICAgICAgIC8vLmF0dHIoJ3InLCAxMClcbiAgICAgICAgICAgIC5hdHRyKCdyJywgKHJEYXRhKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBkLnNyY0VsZW1lbnQuX19kYXRhX18ubmV0ZmxvdyA+PSAwXG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHJldHVybiByYWRpdXNTY2FsZShcbiAgICAgICAgICAgICAgICAgIGQuc3JjRWxlbWVudC5fX2RhdGFfXy5uZXRmbG93ICpcbiAgICAgICAgICAgICAgICAgICAgMC41XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmFkaXVzU2NhbGUoXG4gICAgICAgICAgICAgICAgICAtZC5zcmNFbGVtZW50Ll9fZGF0YV9fLm5ldGZsb3cgKlxuICAgICAgICAgICAgICAgICAgICAwLjVcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0eWxlKCdmaWxsJywgJ2JsdWUnKTtcblxuICAgICAgICAgIGNvbnN0IGNpdHluYW1ldGV4dCA9IHN2Z1xuICAgICAgICAgICAgLmFwcGVuZCgndGV4dCcpXG4gICAgICAgICAgICAuYXR0cigneCcsIDYzNSlcbiAgICAgICAgICAgIC5hdHRyKCd5JywgMzAwKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2NpdHktbmFtZScpXG4gICAgICAgICAgICAuYXR0cignZm9udC1zaXplJywgMTIpXG4gICAgICAgICAgICAuYXR0cignZmlsbCcsICdibHVlJylcbiAgICAgICAgICAgIC50ZXh0KFxuICAgICAgICAgICAgICAgICAgYCR7ZC5zcmNFbGVtZW50Ll9fZGF0YV9fLm9yaWdpbl9jaXR5fSwgTmV0ZmxvdzogJHtkLnNyY0VsZW1lbnQuX19kYXRhX18ubmV0Zmxvd31gXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKCdtb3VzZW91dCcsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgc2VsZWN0QWxsKCcuY2l0eS1uYW1lJykucmVtb3ZlKCk7XG4gICAgICAgICAgZDMuc2VsZWN0KHRoaXMpXG4gICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAuYXR0cigncicsIDUpXG4gICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAnZ29sZCcpO1xuICAgICAgICB9KVxuICAgICAgICAub24oJ2NsaWNrJywgZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhkKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgIGQuc3JjRWxlbWVudC5fX2RhdGFfXy5uZXRmbG93XG4gICAgICAgICAgKTtcbiAgICAgICAgICBzZWxlY3RBbGwoJy5saW5lLWxlYXZlcicpLnJlbW92ZSgpO1xuICAgICAgICAgIHNlbGVjdEFsbCgnLmZsb3d0ZXh0JykucmVtb3ZlKCk7XG4gICAgICAgICAgc2VsZWN0QWxsKCcuY2l0eS1jbGlja2VkJykucmVtb3ZlKCk7XG4gICAgICAgICAgc2VsZWN0QWxsKCcuZGVzLWNpcmNsZScpLnJlbW92ZSgpO1xuICAgICAgICAgIHNlbGVjdEFsbCgnLmNpdHktbmFtZScpLnJlbW92ZSgpO1xuICAgICAgICAgIGxldCBjbGlja2VkQ2l0eSA9IHNlbGVjdCh0aGlzKTtcblxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGNsaWNrZWRDaXR5KTtcbiAgICAgICAgICAvLyBjb25zdCBjdXJ2ZSA9IGQzLmxpbmUoKS5jdXJ2ZShkMy5jdXJ2ZU5hdHVyYWwpO1xuICAgICAgICAgIGNvbnN0IG5ld0NpcmNsZSA9IHN2Z1xuICAgICAgICAgICAgLmFwcGVuZCgnY2lyY2xlJylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdjaXR5LWNsaWNrZWQnKVxuICAgICAgICAgICAgLmF0dHIoJ2N4JywgY2xpY2tlZENpdHkuYXR0cignY3gnKSlcbiAgICAgICAgICAgIC5hdHRyKCdjeScsIGNsaWNrZWRDaXR5LmF0dHIoJ2N5JykpXG4gICAgICAgICAgICAuYXR0cigncicsIChyRGF0YSkgPT4ge1xuICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgZC5zcmNFbGVtZW50Ll9fZGF0YV9fLm5ldGZsb3cgPj0gMFxuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmFkaXVzU2NhbGUoXG4gICAgICAgICAgICAgICAgICBkLnNyY0VsZW1lbnQuX19kYXRhX18ubmV0ZmxvdyAqXG4gICAgICAgICAgICAgICAgICAgIDAuNVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJhZGl1c1NjYWxlKFxuICAgICAgICAgICAgICAgICAgLWQuc3JjRWxlbWVudC5fX2RhdGFfXy5uZXRmbG93ICpcbiAgICAgICAgICAgICAgICAgICAgMC41XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5hdHRyKCdyJywgNSlcbiAgICAgICAgICAgIC5zdHlsZSgnZmlsbCcsICdncmVlbicpXG4gICAgICAgICAgICAuc3R5bGUoJ3N0cm9rZScsICcjZmZmJylcbiAgICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlLXdpZHRoJywgJzFweCcpXG4gICAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwLjcpO1xuXG4gICAgICAgICAgLy9SZW1vdmUgdGhlIGNsaWNrZWQgY2lyY2xlXG4gICAgICAgICAgLy9jbGlja2VkQ2l0eS5yZW1vdmUoKTtcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKGNsaWNrZWRDaXR5KTtcbiAgICAgICAgICBjb25zdCB0ZXh0ID0gc3ZnXG4gICAgICAgICAgICAuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgICAgIC5hdHRyKCd4JywgZC54KVxuICAgICAgICAgICAgLmF0dHIoJ3knLCBkLnkpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnZmxvd3RleHQnKVxuICAgICAgICAgICAgLmF0dHIoJ2ZvbnQtc2l6ZScsIDIwKVxuICAgICAgICAgICAgLmF0dHIoJ2ZpbGwnLCAncmVkJylcbiAgICAgICAgICAgIC50ZXh0KGQuc3JjRWxlbWVudC5fX2RhdGFfXy5uZXRmbG93KTtcbiAgICAgICAgICBsZXQgY2xpY2tlZENpdHlDb29yZHMgPSBbXG4gICAgICAgICAgICBwYXJzZUZsb2F0KGNsaWNrZWRDaXR5LmF0dHIoJ2N4JykpLFxuICAgICAgICAgICAgcGFyc2VGbG9hdChjbGlja2VkQ2l0eS5hdHRyKCdjeScpKSxcbiAgICAgICAgICBdO1xuICAgICAgICAgIGNvbnNvbGUubG9nKG9uZURhdGVDaXRpZXNEYXRhKTtcbiAgICAgICAgICBsZXQgZmlsdGVyZWRDaXRpZXMgPSBvbmVEYXRlQ2l0aWVzRGF0YS5maWx0ZXIoXG4gICAgICAgICAgICBmdW5jdGlvbiAob25lRGF0ZUNpdGllc0RhdGEpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICBkLnNyY0VsZW1lbnQuX19kYXRhX19cbiAgICAgICAgICAgICAgICAgIC5vcmlnaW5fY2l0eSA9PT1cbiAgICAgICAgICAgICAgICBvbmVEYXRlQ2l0aWVzRGF0YS5vcmlnaW5fY2l0eVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG4gICAgICAgICAgY29uc29sZS5sb2coZmlsdGVyZWRDaXRpZXMpO1xuXG4gICAgICAgICAgc3ZnXG4gICAgICAgICAgICAuc2VsZWN0QWxsKCdsaW5lLWxlYXZlcicpXG4gICAgICAgICAgICAuZGF0YShmaWx0ZXJlZENpdGllcylcbiAgICAgICAgICAgIC5lbnRlcigpXG4gICAgICAgICAgICAuYXBwZW5kKCdwYXRoJylcbiAgICAgICAgICAgIC5hdHRyKCdkJywgZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgbGV0IGN1cnZlID0gZDMuY3VydmVCdW5kbGUuYmV0YShcbiAgICAgICAgICAgICAgICAwLjA1XG4gICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgLy8gQ3JlYXRlIHRoZSBsaW5lIGdlbmVyYXRvclxuICAgICAgICAgICAgICBsZXQgbGluZUdlbmVyYXRvciA9IGQzXG4gICAgICAgICAgICAgICAgLmxpbmUoKVxuICAgICAgICAgICAgICAgIC54KGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZFswXTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC55KGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZFsxXTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jdXJ2ZShjdXJ2ZSk7XG4gICAgICAgICAgICAgIGxldCBvcmlnaW4gPSBwcm9qZWN0aW9uKFtcbiAgICAgICAgICAgICAgICBkLm9yaWdpbl9sb24sXG4gICAgICAgICAgICAgICAgZC5vcmlnaW5fbGF0LFxuICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgICAgbGV0IGRlc3RpbmF0aW9uID0gcHJvamVjdGlvbihbXG4gICAgICAgICAgICAgICAgZC5kZXN0X2xvbixcbiAgICAgICAgICAgICAgICBkLmRlc3RfbGF0LFxuICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgICAgbGV0IG1pZFBvaW50ID0gW1xuICAgICAgICAgICAgICAgIChvcmlnaW5bMF0gKyBkZXN0aW5hdGlvblswXSkgLyA0LFxuICAgICAgICAgICAgICAgIChvcmlnaW5bMV0gKyBkZXN0aW5hdGlvblsxXSkgLyA0LFxuICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICBsZXQgbWlkUG9pbnQxID0gW1xuICAgICAgICAgICAgICAgICgob3JpZ2luWzBdICsgZGVzdGluYXRpb25bMF0pICpcbiAgICAgICAgICAgICAgICAgIDMpIC9cbiAgICAgICAgICAgICAgICAgIDgsXG4gICAgICAgICAgICAgICAgKChvcmlnaW5bMV0gKyBkZXN0aW5hdGlvblsxXSkgKlxuICAgICAgICAgICAgICAgICAgMykgL1xuICAgICAgICAgICAgICAgICAgOCxcbiAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgbGV0IG1pZFBvaW50MiA9IFtcbiAgICAgICAgICAgICAgICAob3JpZ2luWzBdICsgZGVzdGluYXRpb25bMF0pIC8gMixcbiAgICAgICAgICAgICAgICAob3JpZ2luWzFdICsgZGVzdGluYXRpb25bMV0pIC8gMixcbiAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgbGV0IG1pZFBvaW50MyA9IFtcbiAgICAgICAgICAgICAgICAoKG9yaWdpblswXSArIGRlc3RpbmF0aW9uWzBdKSAqXG4gICAgICAgICAgICAgICAgICA1KSAvXG4gICAgICAgICAgICAgICAgICA4LFxuICAgICAgICAgICAgICAgICgob3JpZ2luWzFdICsgZGVzdGluYXRpb25bMV0pICpcbiAgICAgICAgICAgICAgICAgIDUpIC9cbiAgICAgICAgICAgICAgICAgIDgsXG4gICAgICAgICAgICAgIF07XG5cbiAgICAgICAgICAgICAgbGV0IG1pZFBvaW50NCA9IFtcbiAgICAgICAgICAgICAgICAoKG9yaWdpblswXSArIGRlc3RpbmF0aW9uWzBdKSAqXG4gICAgICAgICAgICAgICAgICA2KSAvXG4gICAgICAgICAgICAgICAgICA4LFxuICAgICAgICAgICAgICAgICgob3JpZ2luWzFdICsgZGVzdGluYXRpb25bMV0pICpcbiAgICAgICAgICAgICAgICAgIDYpIC9cbiAgICAgICAgICAgICAgICAgIDgsXG4gICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgIGxldCBtaWRQb2ludDUgPSBbXG4gICAgICAgICAgICAgICAgKChvcmlnaW5bMF0gKyBkZXN0aW5hdGlvblswXSkgKlxuICAgICAgICAgICAgICAgICAgNykgL1xuICAgICAgICAgICAgICAgICAgOCxcbiAgICAgICAgICAgICAgICAoKG9yaWdpblsxXSArIGRlc3RpbmF0aW9uWzFdKSAqXG4gICAgICAgICAgICAgICAgICA3KSAvXG4gICAgICAgICAgICAgICAgICA4LFxuICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICBsZXQgbGluZURhdGEgPSBbXG4gICAgICAgICAgICAgICAgb3JpZ2luLFxuICAgICAgICAgICAgICAgIG1pZFBvaW50LFxuICAgICAgICAgICAgICAgIG1pZFBvaW50MSxcbiAgICAgICAgICAgICAgICBtaWRQb2ludDIsXG4gICAgICAgICAgICAgICAgbWlkUG9pbnQzLFxuICAgICAgICAgICAgICAgIG1pZFBvaW50NCxcbiAgICAgICAgICAgICAgICBtaWRQb2ludDUsXG4gICAgICAgICAgICAgICAgZGVzdGluYXRpb24sXG4gICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKGxpbmVEYXRhKTtcbiAgICAgICAgICAgICAgcmV0dXJuIGxpbmVHZW5lcmF0b3IobGluZURhdGEpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdsaW5lLWxlYXZlcicpXG4gICAgICAgICAgICAuc3R5bGUoJ3N0cm9rZScsICdncmVlbicpXG4gICAgICAgICAgICAuc3R5bGUoJ3N0cm9rZS13aWR0aCcsIChkKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKGQpO1xuICAgICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChcbiAgICAgICAgICAgICAgICBkLnBjdF9sZWF2ZXJzLnJlcGxhY2UoJyUnLCAnJylcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwLjYpXG4gICAgICAgICAgICAuYXR0cignZmlsbCcsICdub25lJyk7XG5cbiAgICAgICAgICBjb25zdCBkZXNfY2l0aWVzID0gc3ZnXG4gICAgICAgICAgICAuc2VsZWN0QWxsKCcuZGVzLWNpcmNsZScpXG4gICAgICAgICAgICAuZGF0YShmaWx0ZXJlZENpdGllcylcbiAgICAgICAgICAgIC5lbnRlcigpXG4gICAgICAgICAgICAuYXBwZW5kKCdjaXJjbGUnKVxuICAgICAgICAgICAgLmF0dHIoJ2N4JywgZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHByb2plY3Rpb24oW1xuICAgICAgICAgICAgICAgIGQuZGVzdF9sb24sXG4gICAgICAgICAgICAgICAgZC5kZXN0X2xhdCxcbiAgICAgICAgICAgICAgXSlbMF07XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmF0dHIoJ2N5JywgZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHByb2plY3Rpb24oW1xuICAgICAgICAgICAgICAgIGQuZGVzdF9sb24sXG4gICAgICAgICAgICAgICAgZC5kZXN0X2xhdCxcbiAgICAgICAgICAgICAgXSlbMV07XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmF0dHIoJ3InLCA1KVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2Rlcy1jaXJjbGUnKVxuICAgICAgICAgICAgLnN0eWxlKCdmaWxsJywgJ3JlZCcpXG4gICAgICAgICAgICAuc3R5bGUoJ3N0cm9rZScsICcjZmZmJylcbiAgICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlLXdpZHRoJywgJzFweCcpXG4gICAgICAgICAgICAub24oJ21vdXNlb3ZlcicsIGZ1bmN0aW9uIChtb3VzZUQpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2cobW91c2VEKTtcbiAgICAgICAgICAgICAgY29uc3QgY2l0eW5hbWV0ZXh0ID0gc3ZnXG4gICAgICAgICAgICAgICAgLmFwcGVuZCgndGV4dCcpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3gnLCA2MzUpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3knLCAzMDApXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2NpdHktbmFtZScpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2ZvbnQtc2l6ZScsIDEyKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdmaWxsJywgJ2JsdWUnKVxuICAgICAgICAgICAgICAgIC50ZXh0KFxuICAgICAgICAgICAgICAgICAgYCR7bW91c2VELnNyY0VsZW1lbnQuX19kYXRhX18uZGVzdF9jaXR5fSwgUGN0IG9mIExlYXZlcnM6ICR7bW91c2VELnNyY0VsZW1lbnQuX19kYXRhX18ucGN0X2xlYXZlcnN9YFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLm9uKCdtb3VzZW91dCcsIGZ1bmN0aW9uIChtb3VzZUQpIHtcbiAgICAgICAgICAgICAgc2VsZWN0QWxsKCcuY2l0eS1uYW1lJykucmVtb3ZlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn0pO1xuIl0sIm5hbWVzIjpbImRpc3BhdGNoIiwic2VsZWN0Iiwic2VsZWN0QWxsIiwianNvbiIsImZlYXR1cmUiLCJjc3YiXSwibWFwcGluZ3MiOiI7OztFQUNPLE1BQU0sSUFBSSxHQUFHLE1BQU07RUFDMUIsRUFBRSxJQUFJLEVBQUUsQ0FBQztFQUNULEVBQUUsSUFBSSxTQUFTLENBQUM7RUFDaEIsRUFBRSxJQUFJLE9BQU8sQ0FBQztFQUNkLEVBQUUsTUFBTSxTQUFTLEdBQUdBLGFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztFQUN2QyxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsU0FBUyxLQUFLO0VBQzVCO0VBQ0EsSUFBSSxTQUFTO0VBQ2IsT0FBTyxTQUFTLENBQUMsT0FBTyxDQUFDO0VBQ3pCLE9BQU8sSUFBSSxDQUFDLENB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S0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUM7RUFDOUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFDO0VBQy9HLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLEVBQUM7RUFDMUksU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsRUFBQztFQUMxSSxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDLEtB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QUdyQyxJQUFJLFVBQVUsR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDcEMsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0VBQzVCLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMxQjtFQUNBLElBQUk7RUFDSixNQUFNLFVBQVUsQ0FBQyxPQUFPLEVBQUU7RUFDMUIsTUFBTSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFO0VBQzlCLE1BQU07RUFDTixNQUFNLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQztFQUNsQyxLQUFLLE1BQU07RUFDWCxNQUFNLFVBQVUsQ0FBQyxPQUFPLEVBQUU7RUFDMUIsTUFBTSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFO0VBQzlCLE1BQU07RUFDTixNQUFNLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQztFQUNsQyxLQUFLLE1BQU07RUFDWCxNQUFNLFVBQVUsQ0FBQyxPQUFPLEVBQUU7RUFDMUIsTUFBTSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFO0VBQzlCLE1BQU07RUFDTixNQUFNLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQztFQUNsQyxLQUFLLE1BQU07RUFDWCxNQUFNLFVBQVUsQ0FBQyxPQUFPLEVBQUU7RUFDMUIsTUFBTSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFO0VBQzlCLE1BQU07RUFDTixNQUFNLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQztFQUNsQyxLQUFLLE1BQU07RUFDWCxNQUFNLFVBQVUsQ0FBQyxPQUFPLEVBQUU7RUFDMUIsTUFBTSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFO0VBQzlCLE1BQU07RUFDTixNQUFNLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQztFQUNsQyxLQUFLLE1BQU07RUFDWCxNQUFNLFVBQVUsQ0FBQyxPQUFPLEVBQUU7RUFDMUIsTUFBTSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFO0VBQzlCLE1BQU07RUFDTixNQUFNLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQztFQUNsQyxLQUFLLE1BQU07RUFDWCxNQUFNLFVBQVUsQ0FBQyxPQUFPLEVBQUU7RUFDMUIsTUFBTSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFO0VBQzlCLE1BQU07RUFDTixNQUFNLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQztFQUNsQyxLQUFLLE1BQU07RUFDWCxNQUFNLFVBQVUsQ0FBQyxPQUFPLEVBQUU7RUFDMUIsTUFBTSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFO0VBQzlCLE1BQU07RUFDTixNQUFNLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQztFQUNsQyxLQUFLLE1BQU07RUFDWCxNQUFNLFVBQVUsQ0FBQyxPQUFPLEVBQUU7RUFDMUIsTUFBTSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFO0VBQzlCLE1BQU07RUFDTixNQUFNLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQztFQUNsQyxLQUFLLE1BQU07RUFDWCxNQUFNLFVBQVUsQ0FBQyxPQUFPLEVBQUU7RUFDMUIsTUFBTSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFO0VBQzlCLE1BQU07RUFDTixNQUFNLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQztFQUNsQyxLQUFLLE1BQU07RUFDWCxNQUFNLFVBQVUsQ0FBQyxPQUFPLEVBQUU7RUFDMUIsTUFBTSxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFO0VBQy9CLE1BQU07RUFDTixNQUFNLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQztFQUNsQyxLQUFLLE1BQU07RUFDWCxNQUFNLFVBQVUsQ0FBQyxPQUFPLEVBQUU7RUFDMUIsTUFBTSxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFO0VBQy9CLE1BQU07RUFDTixNQUFNLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQztFQUNsQyxLQUFLLE1BQU07RUFDWCxNQUFNLFVBQVUsQ0FBQyxPQUFPLEVBQUU7RUFDMUIsTUFBTSxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFO0VBQy9CLE1BQU07RUFDTixNQUFNLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQztFQUNsQyxLQUFLLEtBQUs7RUFDVixNQUFNLFVBQVUsQ0FBQyxPQUFPLEVBQUU7RUFDMUIsTUFBTSxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFO0VBQy9CLE1BQU07RUFDTixNQUFNLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQztFQUNsQyxLQUFLLEtBQUs7RUFDVixNQUFNLFVBQVUsQ0FBQyxPQUFPLEVBQUU7RUFDMUIsTUFBTSxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFO0VBQy9CLE1BQU07RUFDTixNQUFNLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQztFQUNsQyxLQUFLLEtBQUs7RUFDVixNQUFNLFVBQVUsQ0FBQyxPQUFPLEVBQUU7RUFDMUIsTUFBTSxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFO0VBQy9CLE1BQU07RUFDTixNQUFNLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQztFQUNsQyxLQUFLLEtBQUs7RUFDVixNQUFNLFVBQVUsQ0FBQyxPQUFPLEVBQUU7RUFDMUIsTUFBTSxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFO0VBQy9CLE1BQU07RUFDTixNQUFNLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQztFQUNsQyxLQUFLLEtBQUs7RUFDVixNQUFNLFVBQVUsQ0FBQyxPQUFPLEVBQUU7RUFDMUIsTUFBTSxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFO0VBQy9CLE1BQU07RUFDTixNQUFNLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQztFQUNsQyxLQUFLLEtBQUs7RUFDVixNQUFNLFVBQVUsQ0FBQyxPQUFPLEVBQUU7RUFDMUIsTUFBTSxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFO0VBQy9CLE1BQU07RUFDTixNQUFNLE1BQU0sR0FBRyxrQkFBa0IsQ0FB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QztFQUM1QixRQUFRLFFBQVEsR0FBRyxNQUFNLENBQUM7RUFDMUIsUUFBUSxJQUFJLE1BQU0sS0FBSyxhQUFhLEVBQUU7RUFDdEMsVUFBVUEsY0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0VBQzdDLFVBQVVBLGNBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztFQUM5QyxVQUFVQSxjQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7RUFDMUMsVUFBVUEsY0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0VBQzlDLFVBQVVBLGNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztFQUM1QyxVQUFVQSxjQUFTLENBQUMsYUFBYSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7RUFDNUMsVUFBVUEsY0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0VBQzNDLFVBQVVBLGNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztFQUN0QyxVQUFVLEdBQUcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztFQUNyQyxTQUFTLE1BQU0sSUFBSSxNQUFNLEtBQUssY0FBYyxFQUFFO0VBQzlDLFVBQVVBLGNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztFQUM3QyxVQUFVQSxjQUFTLENBQUMsZUFBZSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7RUFDOUMsVUFBVUEsY0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0VBQzFDLFVBQVVBLGNBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztFQUM5QyxVQUFVQSxjQUFTLENBQUMsYUFBYSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7RUFDNUMsVUFBVUEsY0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0VBQzVDLFVBQVVBLGNB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