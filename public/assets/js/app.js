$(() => {
  let search = location.search.substring(1).slice(4);
  getPollDetails(search);
});

/**
 * Get poll data from server
 * @param {string} key 
 */
function getPollDetails(key) {
  $.ajax({
    url: `/polls/${key}/admin/`,
    method: 'GET',
    success: function (results) {
      renderPollDetails(results.poll_details);

      // Render only if poll has 1 or more submissions
      if (results.table_data !== undefined) {
        renderPollResults(results.table_data);
      }
    },
    error: function (err) {
      console.log(err);
    }
  });
}

/**
 * Renders poll details
 * @param {object} poll 
 */
function renderPollDetails(poll) {
  $('#table-poll-details > tbody').append(`<tr><td class="poll-details-heading">Title:</td><td>${poll.title}</td></tr>`);
  $('#table-poll-details > tbody').append(`<tr><td class="poll-details-heading">Creator Email:</td><td>${poll.creator_email}</td></tr>`);
  $('#table-poll-details > tbody').append(`<tr><td class="poll-details-heading">Created At:</td><td>${poll.timestamp}</td></tr>`);
  $('#table-poll-details > tbody').append(`<tr><td class="poll-details-heading">Admin URL:</td><td><a href="/admin.html?key=${poll.admin_url_id}">${poll.admin_url_id}</a></td></tr>`);
  $('#table-poll-details > tbody').append(`<tr><td class="poll-details-heading">Submission URL:</td><td><a href="/fill_poll.html?key=${poll.submission_url_id}">${poll.submission_url_id}</a></td></tr>`);
}

/**
 * Renders poll results
 * @param {object} choices 
 */
function renderPollResults(choices) {
  var $pollResultsSection = $('#poll-results > div')
  var $h3 = $('<h3 class="subheading-page">Poll Results</h3>');
  $pollResultsSection.append($h3);

  var $tableDiv = $('<div class="form-group row d-flex justify-content-center">');
  var $table = $('<table id="table-poll-results" class="table w-auto table-borderless">');
  var $thead = $('<thead>');
  var $tbody = $('<tbody>');
  var $tr = $('<tr>');
  var $rankHeading = $('<th scope="col">Rank</th>');
  var $titleHeading = $('<th scope="col">Option Title</th>');
  var $descHeading = $('<th scope="col">Option Description</th>');
  var $pointsHeading = $('<th scope="col">Points</th>');

  $tr.append($rankHeading);
  $tr.append($titleHeading);
  $tr.append($descHeading);
  $tr.append($pointsHeading);

  $thead.append($tr);
  $table.append($thead);
  $table.append($tbody);
  $tableDiv.append($table);
  $pollResultsSection.append($tableDiv);

  choices.forEach(function (choice, index) {
    $('#table-poll-results > tbody').append(`<tr><td class="poll-details-heading">${index + 1}</td><td>${choice.title}</td><td>${choice.description}</td><td>${choice.points}</td></tr>`);
  })
}

function displayResults(key) {
  $.ajax({
    url: `/polls/${key}/admin/`, method: 'GET', success: function (resultsObj) {
      let resultArr = [];
      resultsObj.chart_data.forEach(function (choice, index) {
        resultArr.push({ y: Math.round(choice['percentage'] * 10) / 10, label: choice['title'] });
      })
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
      for (let choice in resultsObj.chart_data) {
        $row = $("<tr></tr>")
        $cellMovie = $("<td></td>")
        $cellRank = $("<td></td>")
        $cellMovie.append(choice)
        $cellRank.append(Math.round(resultsObj.chart_data[choice] * 10) / 10)
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
