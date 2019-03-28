$(() => {
    let search = location.search.substring(1).slice(4);
    let $ul = $('.options');
    function createInput(choice){
        let $li = $(`<li class="form-group">${choice.title} - ${choice.description}</li>`);
        $li.attr('id', choice.id);
        $li.attr('poll_id', choice.poll_id);
        return $li;
    }
    $('.options').sortable();

    $.get('/polls/' + search)
    .done(function(result){
        result.forEach(function(choice){
            $ul.append(createInput(choice));
        });
    });

    $('button').on('click', function(e){
        e.preventDefault();
        let choiceArr = [];
        let rank = $ul.children().length;
        $ul.children().each(function() {
            let choiceObj = {};
            choiceObj['id'] = $(this).attr('id');
            choiceObj['poll_id'] = $(this).attr('poll_id');
            choiceObj['rank'] = rank;
            choiceArr.push(choiceObj);
            rank--;
        });
        $.post('/polls/' + search, {'choiceArr': choiceArr})
        .done(function(res){

        });
    });
});