$(() => {
  let search = location.search.substring(1).slice(4);
  // displayResults(search);
  renderPollDetails(search);
});

function renderPollDetails(key) {
  $.ajax({
    url: `/polls/${key}/admin/`,
    method: 'GET',
    success: function (results) {
      console.log(results);
      // $('#table-poll-details tr:last').after('<tr>test</tr><tr>test2</tr>');
      $('#table-poll-details > tbody').append(`<tr><td class="poll-details-heading">Title:</td><td>${results.poll.title}</td></tr>`);
      $('#table-poll-details > tbody').append(`<tr><td class="poll-details-heading">Creator Email:</td><td>${results.poll.creator_email}</td></tr>`);
      $('#table-poll-details > tbody').append(`<tr><td class="poll-details-heading">Created At:</td><td>${results.poll.timestamp}</td></tr>`);
      $('#table-poll-details > tbody').append(`<tr><td class="poll-details-heading">Admin URL:</td><td>${results.poll.admin_url_id}</td></tr>`);
      $('#table-poll-details > tbody').append(`<tr><td class="poll-details-heading">Submission URL:</td><td>${results.poll.submission_url_id}</td></tr>`);

    },
    error: function (err) {
      console.log(err);
    }
  });
}

function displayResults(key) {
  $.ajax({
    url: `/polls/${key}/admin/`, method: 'GET', success: function (resultsObj) {
      let resultArr = [];
      for (let choice in resultsObj.poll_results) {
        resultArr.push({ y: Math.round(resultsObj.poll_results[choice] * 10) / 10, label: choice });
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
      showTable(key);

    },
    error: function (err) {
      console.log("there was an error getting the results");
    }
  });
}

function showTable(key) {
  let $table = $("#resultsTable")
  let $headingOption = $("<th></th>")
  let $headingRank = $("<th></th>")
  let $row = $("<tr></tr>")
  $headingOption.append('Option')
  $headingRank.append('Rank')
  $row.append($headingOption)
  $row.append($headingRank)
  $table.append($row)
  $.ajax({
    url: `/polls/${key}/admin/`, method: 'GET', success: function (resultsObj) {
      for (let choice in resultsObj.poll_results) {
        $row = $("<tr></tr>")
        $cellMovie = $("<td></td>")
        $cellRank = $("<td></td>")
        $cellMovie.append(choice)
        $cellRank.append(Math.round(resultsObj.poll_results[choice] * 10) / 10)
        $row.append($cellMovie)
        $row.append($cellRank)
        $table.append($row)
      }
    },
    error: function (err) {
      console.log("there was an error getting the results");
    }
  });
}
