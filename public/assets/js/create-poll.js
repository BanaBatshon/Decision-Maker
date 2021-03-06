$(() => {
  let $options_div = $('.options');
  let optionCount = 2;

  $options_div.append(createOption(0));
  let $poll = createOption(1);
  let $add_btn = createAddBtn();
  $options_div.append($poll);
  $('.row-add-row-btn').prepend($add_btn);

  $('#poll-submit-btn').on('click', function (e) {
    e.preventDefault();
    let user_input = [];
    const form = $('#create-poll-form');

    if (form[0].checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      form.addClass('was-validated');
      return;
    }
    
    $('form').children().find('input').each(function () {
      let input_val = $(this).val();
    
      user_input.push(input_val);
    });

    if (user_input.length > 0) {
      $.post('/polls/new', { data: user_input })
        .done(function (data) {
          let links = data;
          $(location).attr('href', `/admin.html?key=${links[0]}`);
        });
    }
  });

  function createOption(num) {
    let $poll = $('<div class="form-group row d-flex justify-content-center">');
    let $counterColDiv = $('<div class="col-1 p-2">');
    let $label = $(`<label class="col-sm-1 col-form-label">${num + 1}.</label>`);
    let $optionColDiv = $('<div class="col-4 p-2">');
    $input = $('<input type="text" class="form-control form-control-lg" placeholder="Title" required>');

    let $inputValidation = $('<div class="invalid-feedback">Please enter a option title</div>');

    let $descColDiv = $('<div class="col-4 p-2">');
    let $description = $('<input type="text" class="form-control form-control-lg" placeholder="Description (Optional)">');
    let $delColDiv = $('<div class="col-1 p-2">');
    let $del_btn = $('<button class="btn"><i class="fa fa-trash form-icon"></i></button>');

    $del_btn.on('click', function (e) {
      e.preventDefault();
      let addBtnRemoved = false;
      if ($($poll.children('label')['0']).text().replace(/\./, '') === (optionCount).toString()) {
        addBtnRemoved = true;
      }
      optionCount--;
      $poll.remove();
      let $children = $('.options').children();
      let counter = optionCount - 1;
      $children.each(function () {
        $($(this).children('label')['0']).text(`${optionCount - counter}.`);
        counter--;
      });
    });

    $counterColDiv.append($label);
    $poll.append($label);
    $optionColDiv.append($input);
    $optionColDiv.append($inputValidation);
    $poll.append($optionColDiv);
    $descColDiv.append($description);
    $poll.append($descColDiv);
    $delColDiv.append($del_btn);
    $poll.append($delColDiv);

    return $poll;
  }

  function createAddBtn() {
    let $add_btn = $('<button type="button" class="btn btn-primary btn-lg">Add Row</button>');
    $add_btn.on('click', function (e) {
      e.preventDefault();
      let $newOption = createOption(optionCount);
      $('.options').append($newOption);
      optionCount++;
    });
    return $add_btn;
  }
});

const bordaCount = function (rankingArr) {
  const points = [];
  const percentage = 100 / rankingArr.length;

  for (rank of rankingArr) {
    points.push((rankingArr.length - rankingArr[rank + 1]) * percentage)
  }
  return points;
}
