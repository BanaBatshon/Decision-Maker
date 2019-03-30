$(() => {
  let search = location.search.substring(1).slice(4);
  let $ul = $('#respond-to-poll-options');
  function createInput(choice, index) {
    let $li;
    if(choice.description.length === 0) {
      $li = $(`<li class="list-group-item"><div class="sortable-number">${index + 1}</div><span class="choice-title">${choice.title}</span> <span class="choice-desc"></span></li>`);
    }
    else {
      $li = $(`<li class="list-group-item"><div class="sortable-number">${index + 1}</div><span class="choice-title">${choice.title}</span> <span class="choice-desc">(${choice.description})</span></li>`);
    }
    
    $li.attr('id', choice.id);
    $li.attr('poll_id', choice.poll_id);
    return $li;
  }
  $('#respond-to-poll-options').sortable({
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

  $.get('/polls/' + search)
    .done(function (result) {
      console.log(result);
      result.choices.forEach(function (choice, index) {
        $ul.append(createInput(choice, index));
      });
      $('.respond-to-poll-title').text(result.title);
    });

  $('button').on('click', function (e) {
    e.preventDefault();
    let choiceArr = [];
    let rank = $ul.children().length;
    let poll_id;
    $ul.children().each(function () {
      let choiceObj = {};
      poll_id = $(this).attr('poll_id');
      choiceObj['choice_id'] = $(this).attr('id');
      choiceObj['rank'] = rank;
      choiceArr.push(choiceObj);
      rank--;
    });
    $.post('/polls/' + search, { 'name': $('input').val(), 'poll_id': poll_id, 'choiceArr': choiceArr })
      .done(function (res) {

      });
  });
});