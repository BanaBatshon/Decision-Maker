$(() => {
  let $options_div = $('.options');
  let optionCount = 2;

  $options_div.append(createOption(0));
  let $poll = createOption(1);
  let $add_btn = createAddBtn();
  $poll.append($add_btn);
  $options_div.append($poll);

  $options_div.siblings('button').on('click', function(e){
    e.preventDefault();
    let user_input = [];
    let count = 0;
    $('form').children().find('input').each(function() {
      let input_val = $(this).val();
      if (count === 0 && input_val.length === 0) {
        user_input = [];
        alert('Please enter a valid email!');
        return false;
      } else if (count === 1 && input_val.length === 0) {
        user_input = [];
        alert('Please enter a name for your poll!');
        return false;
      } else if (count >= 2 && count % 2 === 0 && input_val.length === 0) {
        alert('Please enter your option or remove the field!');
        user_input = [];
        return false;
      } else {
        user_input.push(input_val);
      }
      count++;
    });
    if (user_input.length > 0) {
      $.post('/polls/new', {data: user_input})
      .done(function(data){
        let links = data;
        let $container = $('.container');
        $container.empty();
        $container.append($(`<div><p>User link: ${links[0]}</p><p>Admin link ${links[1]}</p></div>`));
      });
    }
  });

  function createOption (num) {
    // let $poll = $('<div class="form-group"></div>');
    // let $label = $(`<label>${num + 1}:</label>`);
    // let $input = $('<input type="text" class="form-control" placeholder="Enter your option">');
    // let $description_label = $(`<label>Description:</label>`);
    // let $description = $('<input type="text" class="form-control" placeholder="Enter a description (Optional)">');
    // let $del_btn = $('<button><i class="fas fa-times"></i></button>');
    let $poll = $('<div class="form-group row d-flex justify-content-center">'); 
    let $label = $(`<label style="margin-top: 0.3rem;" class="col-sm-1 col-form-label">${num + 1}.</label>`);
    let $optionColDiv= $('<div class="col-4 p-2">');
    $input = $('<input type="text" class="form-control form-control-lg" placeholder="Option (Required)">');
    let $descColDiv = $('<div class="col-4 p-2">');
    let $description = $('<input type="text" class="form-control form-control-lg" placeholder="Description (Optional)">');
    let $delColDiv = $('<div class="col-2 p-2">');
    let $del_btn = $('<button class="btn"><i class="fa fa-trash form-icon"></i></button>');

    $del_btn.on('click', function(e) {
      e.preventDefault();
      let addBtnRemoved = false;
      if ($($poll.children('label')['0']).text().replace(/\:/, '') === (optionCount).toString()) {
        addBtnRemoved = true;
      }
      optionCount--;
      $poll.remove();
      let $children = $('.options').children();
      let counter = optionCount - 1;
      $children.each(function() {
        if (addBtnRemoved && counter === 0) {
          let $add_btn = createAddBtn();
          console.log($(this));
          $(this).parent().append($add_btn);
        }
        $($(this).children('label')['0']).text(`${optionCount - counter}:`);
        counter--;
      });
    });
    // $poll.append($label);
    // $poll.append($input);
    // $poll.append($description_label);
    // $poll.append($description);
    // $poll.append($del_btn);
      $poll.append($label);
      $optionColDiv.append($input);
      $poll.append($optionColDiv);
      $descColDiv.append($description);
      $poll.append($descColDiv);
      $delColDiv.append($del_btn);
      $poll.append($delColDiv);
      
    return $poll;
  }

  function createAddBtn() {
    let $add_btn = $('<div class="form-group row d-flex justify-content-center"><button><i class="fas fa-plus"></i></button></div>');
    $add_btn.on('click', function(e) {
      e.preventDefault();
      let $newOption = createOption(optionCount);
      $newOption.append(this);
      $options_div.append($newOption);
      optionCount++;
    });
    return $add_btn;
  }
});

const bordaCount = function(rankingArr) {
  const points = [];
  const percentage = 100 / rankingArr.length;

  for (rank of rankingArr) {
    points.push((rankingArr.length - rankingArr[rank + 1]) * percentage)
  }
  return points;
}
