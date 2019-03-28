$(() => {
  let options_div = $('.options');
  let optionCount = 2;

  options_div.append(createOption(0));
  $poll = createOption(1);
  let $add_btn = createAddBtn();
  $poll.append($add_btn);
  options_div.append($poll);

  function createOption (num) {
    let $poll = $('<div class="form-group"></div>');
    let $label = $(`<label for="option">${num + 1}:</label>`);
    let $input = $('<input type="text" class="form-control" placeholder="Enter your option">');
    let $del_btn = $('<button><i class="fas fa-times"></i></button>');
    $del_btn.on('click', function(e) {
      e.preventDefault();
      let addBtnRemoved = false;
      if ($poll.find('label').text().replace(/\:/, '') === (optionCount).toString()) {
        addBtnRemoved = true;
      }
      optionCount--;
      $poll.remove();
      let children = $('.options').children();
      let counter = optionCount - 1;
      children.each(function() {
        if (addBtnRemoved && counter === 0) {
          let $add_btn = createAddBtn();
          $(this).append($add_btn);
        }
        $(this).find('label').text(`${optionCount - counter}:`);
        counter--;
      });
    });
    $poll.append($label);
    $poll.append($input);
    $poll.append($del_btn);
    return $poll;
  }

  function createAddBtn() {
    let $add_btn = $('<button><i class="fas fa-plus"></i></button>');
    $add_btn.on('click', function(e) {
      e.preventDefault();
      let $newOption = createOption(optionCount);
      $newOption.append(this);
      options_div.append($newOption);
      optionCount++;
    });
    return $add_btn;
  }
});



                            
                        