var old = 0;

$(window).resize(function() {
  var new_width = $(window).width();
  var range = loader.get_large_viewport_value();
  
  if(old >= range && new_width < range) {
    loader.load();
  }else if(old <= range && new_width > range) {
    loader.load();
  }
  
  loader.handle_resize(new_width);
  old = new_width;
});

$(document).ready(function() {
  old = $(window).width();
  loader.load();
});