$(() => {
  displayResults();
});

function displayResults (){
  $.ajax({url: '/polls',method: 'GET',success: function(resultsObj){
    let resultArr = [];
    for(let choice in resultsObj) {
      resultArr.push({y:Math.round( resultsObj[choice] * 10 ) / 10, label:choice});
    }
    var chart = new CanvasJS.Chart("chartContainer",
    {
      legend: {
        maxWidth: 350,
        itemWidth: 120
      },
      data: [
      {
        type: "pie",
        showInLegend: true,
        legendText: "{indexLabel}",
        dataPoints: resultArr
      }
      ]
    });
    chart.render();
    showTable();
    
    },
    error: function(err){
      console.log("there was an error getting the results");
    }
  });
}

function showTable () {
  let $table = $("#resultsTable")
  let $headingOption = $("<th></th>")
  let $headingRank = $("<th></th>")
  let $row = $("<tr></tr>")
  $headingOption.append('Option')
  $headingRank.append('Rank')
  $row.append($headingOption)
  $row.append($headingRank)
  $table.append($row)
  $.ajax({url: '/polls',method: 'GET',success: function(resultsObj){
    for (let choice in resultsObj) {
      $row = $("<tr></tr>")
      $cellMovie = $("<td></td>") 
      $cellRank = $("<td></td>") 
      $cellMovie.append(choice)
      $cellRank.append(Math.round( resultsObj[choice] * 10 ) / 10)
      $row.append($cellMovie)
      $row.append($cellRank)
      $table.append($row)
    }
    },
    error: function(err){
      console.log("there was an error getting the results");
     }
   });
}
