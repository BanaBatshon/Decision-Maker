$(() => {
  let search = location.search.substring(1).slice(4);
  getPollOptionsAndRender(search);
});

/**
 * Get poll options from server and render onto page
 * @param {string} search 
 */
function getPollOptionsAndRender(search) {
  $.ajax({
    url: '/polls/' + search,
    method: 'GET',
    success: function (results) {
      console.log(results);
      renderPollSelectionForm(results);
      renderPollChoices(results.choices);

    },
    error: function (err) {
      console.log(err);
      renderErrorPage();
    }
  });
}
/**
 * Render error page when link is invalid
 */
function renderErrorPage() {
  var $choosePollOptionsSection = $('#choose-poll-options > div')
  $choosePollOptionsSection.css('display','flex');
  var $errorDiv = $('<div class="error-message row d-flex flex-column justify-content-center">');
  var $h1 = $(`<h1>Page not found</h1>`);
  var $p = $('<p>Sorry, the requested url was not found on the server.</p>')
  var $imgDiv = $('<div class="row d-flex flex-column justify-content-center">');
  var $img = $('<img src="/assets/img/404_dude.png">')

  $errorDiv.append($h1);
  $errorDiv.append($p);

  $imgDiv.append($img);
  $choosePollOptionsSection.append($errorDiv);
  $choosePollOptionsSection.append($imgDiv);
}

/**
 * Render page after poll has been submitted successfully
 */
function renderPostSubmissionPage() {
  var $choosePollOptionsSection = $('#choose-poll-options > div');
  $choosePollOptionsSection.empty();
  $choosePollOptionsSection.css('display','flex');
  var $errorDiv = $('<div class="error-message row d-flex flex-column justify-content-center">');
  var $h1 = $(`<h1>Poll submitted!</h1>`);
  var $p = $('<p>Thanks for participating, the poll creator will be notified.</p>')
  var $imgDiv = $('<div class="row d-flex flex-column justify-content-center">');
  var $img = $('<img src="/assets/img/happy_dude.png">')

  $errorDiv.append($h1);
  $errorDiv.append($p);

  $imgDiv.append($img);
  $choosePollOptionsSection.append($errorDiv);
  $choosePollOptionsSection.append($imgDiv);
}

/**
 * Render poll section form layout
 * @param {object} poll 
 */
function renderPollSelectionForm(poll) {
  var $choosePollOptionsSection = $('#choose-poll-options > div')
  var $h1 = $(`<h1 class="heading-page respond-to-poll-title">${poll.title}</h1>`);
  $choosePollOptionsSection.append($h1);

  var $formDiv = $('<div class="form-group row d-flex justify-content-center">');
  var $form = $('<form id="poll-selection-form" class="col-6 needs-validation" novalidate">');
  var $nameLabel = $('<label for="name" class="col-form-label">Please enter your name:</label>');
  var $nameInput = $('<input class="form-control form-control-lg" id="name" type="text" aria-describedby="emailHelp" placeholder="eg. John Smith" required>');
  var $inputValidation = $('<div class="invalid-feedback">Please enter your name.</div>');
  var $h4 = $('<h4 class="heading-form">Rank the following options:</h4>');
  var $ul = $('<ul id="respond-to-poll-options" class="list-group options">');
  var $buttonDiv = $('<div class="row d-flex justify-content-around">');
  var $button = $('<button type="submit" class="btn btn-primary btn-lg btn-custom">Submit</button>');

    $buttonDiv.append($button);

  $form.append($nameLabel);
  $form.append($nameInput);
  $form.append($inputValidation);
  $form.append($h4);
  $form.append($ul);
  $form.append($buttonDiv);

  $formDiv.append($form);
  $choosePollOptionsSection.append($formDiv);

  $button.on('click', function (e) {
    e.preventDefault();
    let choiceArr = [];
    let rank = $ul.children().length;
    let poll_id;

    const $pollSelectionForm = $('#poll-selection-form');

    if ($pollSelectionForm[0].checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      $pollSelectionForm.addClass('was-validated');
      return;
    }

    $ul.children().each(function () {
      let choiceObj = {};
      poll_id = $(this).attr('poll_id');
      choiceObj['choice_id'] = $(this).attr('id');
      choiceObj['rank'] = rank;
      choiceArr.push(choiceObj);
      rank--;
    });
    let search = location.search.substring(1).slice(4);
    $.post('/polls/' + search, { 'name': $('input').val(), 'poll_id': poll_id, 'choiceArr': choiceArr })
      .done(function (res) {

        renderPostSubmissionPage();
      });
  });
}

/**
 * Render poll options
 * @param {*} choice 
 * @param {*} index 
 */
function renderPollChoices(choices) {
  var $ul = $('#respond-to-poll-options');

  choices.forEach(function (choice, index) {
    $ul.append(renderChoiceElement(choice, index));
  });

  $ul.sortable({
    helper: 'clone',
    sort: function (e, ui) {
      $(ui.placeholder).html(Number($("#respond-to-poll-options > li:visible").index(ui.placeholder)) + 1);
    },
    update: function (event, ui) {
      var $lis = $(this).children('li');
      $lis.each(function () {
        var newVal = $(this).index() + 1;
        $(this).children('.sortable-number').html(newVal);
      });
    }
  });
}

/**
 * Return a poll choice <li> element
 * @param {object} choice 
 * @param {integer} index 
 */
function renderChoiceElement(choice, index) {
  var $li;
  if (choice.description.length === 0) {
    $li = $(`<li class="list-group-item"><div class="sortable-number">${index + 1}</div><span class="choice-title">${choice.title}</span> <span class="choice-desc"></span></li>`);
  } else {
    $li = $(`<li class="list-group-item"><div class="sortable-number">${index + 1}</div><span class="choice-title">${choice.title}</span> <span class="choice-desc">(${choice.description})</span></li>`);
  }

  $li.attr('id', choice.id);
  $li.attr('poll_id', choice.poll_id);

  return $li;
}