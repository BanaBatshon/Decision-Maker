$(() => {
  let search = location.search.substring(1).slice(4);
  getPollDataAndRender(search);
});

/**
 * Get poll data from server
 * @param {string} key 
 */
function getPollDataAndRender(key) {
  $.ajax({
    url: `/polls/${key}/admin/`,
    method: 'GET',
    success: function (results) {
      var pollDetails = results.poll_details;
      var tableData = results.table_data;
      var chartData = results.chart_data;

      renderPollDetails(pollDetails);

      // no data to display, remove excess whtie space
      if (tableData === undefined && chartData === undefined) {
        removeChartSection();
        renderNoSubmissionsMessage();
        return;
      }

      renderPollResults(tableData);
      renderChart(chartData);
    },
    error: function (err) {
      console.log(err);
      renderErrorPage();
    }
  });
}

/**
 * Renders poll details
 * @param {object} poll 
 */
function renderPollDetails(poll) {
  $('#poll-details .container').prepend('<h1 class="heading-page">Poll Details</h1>');
  $('#table-poll-details > tbody').append(`<tr><td class="poll-details-heading">Title:</td><td>${poll.title}</td></tr>`);
  $('#table-poll-details > tbody').append(`<tr><td class="poll-details-heading">Creator Email:</td><td>${poll.creator_email}</td></tr>`);
  $('#table-poll-details > tbody').append(`<tr><td class="poll-details-heading">Created On:</td><td>${moment(poll.timestamp).format('MMMM D, YYYY')}</td></tr>`);
  $('#table-poll-details > tbody').append(`<tr><td class="poll-details-heading">Admin URL:</td><td><a href="/admin.html?key=${poll.admin_url_id}">${poll.admin_url_id}</a></td></tr>`);
  $('#table-poll-details > tbody').append(`<tr><td class="poll-details-heading">Submission URL:</td><td><a href="/poll.html?key=${poll.submission_url_id}">${poll.submission_url_id}</a></td></tr>`);
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

/**
 * Renders pie chart
 * @param {object} choices 
 */
function renderChart(choices) {
  let chartData = [];
  choices.forEach(function (choice, index) {
    chartData.push({ y: Math.round(choice['percentage'] * 10) / 10, label: choice['title'] });
  });

  var chart = new CanvasJS.Chart("chartContainer", {
    theme: "dark2",
    exportEnabled: false,
    animationEnabled: true,
    backgroundColor: '#1A1B1D',
    data: [{
      type: "pie",
      startAngle: 25,
      toolTipContent: "<b>{label}</b>: {y}%",
      showInLegend: "true",
      legendText: "{label}",
      indexLabelFontSize: 16,
      indexLabel: "{label} - {y}%",
      dataPoints: chartData
    }]
  });
  chart.render();
}

/**
 * Render error page when link is invalid
 */
function renderErrorPage() {
  var $pollDetailsSection = $('#poll-details > div')
  removeChartSection();
  $pollDetailsSection.css('display','flex');
  var $errorDiv = $('<div class="error-message row d-flex flex-column justify-content-center">');
  var $h1 = $(`<h1>Page not found</h1>`);
  var $p = $('<p>Sorry, the requested url was not found on the server.</p>')
  var $imgDiv = $('<div class="row d-flex flex-column justify-content-center">');
  var $img = $('<img src="/assets/img/404_dude.png">')

  $errorDiv.append($h1);
  $errorDiv.append($p);

  $imgDiv.append($img);
  $pollDetailsSection.append($errorDiv);
  $pollDetailsSection.append($imgDiv);
}

/**
 * Remove the results and chart section from the DOM
 */
function removeChartSection() {
 $('#poll-chart').remove();
}

/**
 * Renders no submissions message
 */
function renderNoSubmissionsMessage() {
  var $pollDetailsSection = $('#poll-details');
  var $pollDetailsDiv = $('#poll-details > div')
  var $h3 = $('<h3 class="subheading-page">No submissions yet</h3>');

  $pollDetailsDiv.append($h3);
  $pollDetailsSection.append($pollDetailsDiv);
}