$(() => {
  $.ajax({
    method: "GET",
    url: "/api/polls"
  }).done((polls) => {
    for(poll of polls) {
      $("<div>").text(user.name).appendTo($("body"));
    }
  });;
});

const bordaCount = function(rankingArr) {
  const points = [];
  const percentage = 100 / rankingArr.length;

  for (rank of rankingArr) {
    points.push((rankingArr.length - rankingArr[rank + 1]) * percentage)
  }
  return points;
}