$(()=>{$.ajax({method:"GET",url:"/api/users"}).done(e=>{for(user of e)$("<div>").text(user.name).appendTo($("body"))})});