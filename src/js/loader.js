var stories = new Array();

var current = -1;


function get_url_parameter(name) {
    // source : http://stackoverflow.com/questions/1403888/get-url-parameter-with-jquery
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}

// loader object
var loader = new Object();

loader.get_large_viewport_value = function() {
  return 480;
}

// 
loader.should_render_large_view = function() {
  var viewport_width = $(window).width();
  return viewport_width >= loader.get_large_viewport_value();
};

// story view
loader.load_data = function() {
  for(var i in data.objects) {
    var obj = data.objects[i];
    
    var date_published = new Date(obj.pub_date);
    var date_updated = new Date(obj.updated);
    
    obj.pub_date = date_published;
    obj.updated = date_updated;
    
    obj.formatted_publish_date = formatted_date_function(date_published);
    obj.formatted_updated_date = formatted_date_function(date_updated);
    
    stories.push(obj);
  }
  
  stories.sort(function(a, b) {
    return a.updated.getTime() - b.updated.getTime();
  });
};

loader.load_header = function() {
  // TODO :: send breadcrumbs parameters
  $("#top_links_list").html('<li><a class="story_link" href="./index.html">HOME</a></li><li id="breadcrumb">></li>' +
                            '    <li><a class="story_link" id = "news">NEWS</a></li></li>');
};

loader.load_headline = function() {
  $("#story_headline").html(stories[current].title);
}

loader.load_dates = function() {
  $("#datetime").html("Updated: " + stories[current].formatted_updated_date +
                      " | Posted: " + stories[current].formatted_publish_date);
}

loader.load_social = function() {
  var class_str = '';
  if(loader.should_render_large_view()) 
    class_str = 'social_link_large';
  
  var names = ['<a href="#">COMMENT<a>', 
               '<a href="#">SHARE<a>', 
               '<a href="#">FAVORITE<a>', 
               '<a href="#">VOTE<a>'];
  var result = '<div id= "' + class_str + '"><ul>';
  
  for(var i = 0; i < 4; ++i){
      result += "<li id=\"social_link_" + i + "\" class=\"float_left\"><div class=\"float_left\"><div class=\"crop\" ><img id=\"social_image_" + i + "\" src=\"../images/uidevtest-sprites.png\"></img></div>";
      result += names[i] + "</div></li>";
  }
  result += "</ul></div>";
  $("#social").html(result);
  
  if(loader.should_render_large_view()) {
    var li, img;
    for(var i = 0; i < names.length; ++i) {
      li = $("#social_link_" + i);
      img = $('#social_image_' + i);
        
      li.mouseover((function(image) {
        return function() {
          if(loader.should_render_large_view()) {
            image.attr('class', 'no_filters');
          }
        }
      })(img));
      
      li.mouseout((function(image) {
        return function() {
          if(loader.should_render_large_view()) {
            image.attr('class', 'greyscale');
          }
        }
      })(img));
      
      img.attr('class', 'greyscale');
    }
  }
};

loader.load_image = function() {
  var url = stories[current].lead_photo_image_url;
  var caption = stories[current].lead_photo_caption || "";
  var credit = stories[current].lead_photo_credit || "";
  
  $("#image").html("<img id=\"img\"src=\"" + url + "\"></img>");
  $("#caption").html("" + caption);
  $("#credit").html(credit);
  
  loader.position_credit(false);
};

loader.load_article = function() {
  var content = stories[current].story;
  var author = stories[current].author || "un-named source";
  
  if (loader.should_render_large_view()) {
    loader.handle_large_view_article(content, author);
    return;
  } else {
    $('#large_article').html(" ");
  }
  
  $("#author").html('<div class="clear_left">by <div class="author_name">' + author + "</div></div>");
  $("#article").html('<div class="clear_left">' + content + '</div>');
}

// helper method to format a str of the categories
loader.get_categories_string_from_story = function(story) {
  var categories = story.categories_name || [];
  var categories_str = "";
  
  for(var j = 0; j < categories.length; ++j) {
      categories_str += categories[j] + ', '
  }
  
  return categories_str.substring(0, categories_str.length - 2);
}


// list view functions
loader.load_list_view = function() {  
  var story, id, categories_str;
  var markup = "<ul id=\"list_view_list\">";
  var actual_headline = "";
  // normally might want to only render a certain amount
  for(var i = 0; i < stories.length; ++i) {
    story = stories[i];
    categories_str = loader.get_categories_string_from_story(story);
    
    actual_headline = story.title;
    if(actual_headline.length > 35)
      actual_headline = actual_headline.substring(0, 35) + '...';
    
    id = "list_view_element_" + i;
    markup += '<li class="list_view_element" id="' + id + '">' 
    + '          <div class="thumb_container">' 
    + '             <a href="?story=' + story.url_path + '" onClick="loader.load();">' 
    + '               <img class="thumb" src="' + story.lead_photo_image_thumb + '"> </img>' 
    + '             </a>' 
    + '           </div>' 
    + '           <div class="headline_container">' 
    + '             <a class="headline" href ="?story=' + story.url_path + '">' + actual_headline + '</a>' 
    + '             <div id="categories">' + categories_str + ' / ' + story.summary 
    + '             </div>' 
    + '           <ul id="list_datetime">' 
    + '             <li>Posted: ' + story.formatted_publish_date + '</li>' 
    + '             <li>Updated: ' + story.formatted_updated_date + '</li>' 
    + '           </ul>' 
    + '           </div>' 
    + '</li>';
  }
  
  $("#list_view").html(markup + "</ul>");
}

// main load function
loader.load = function() {
  if(stories.length <= 0)
    loader.load_data();
  
  current = loader.get_index_from_url();  // out of index range means in list view
  
  if(current < 0 || current >= stories.length) {
    $("#story_view").hide();
    loader.load_list_view();
    $("#list_view").show();
    return;
  }
  
  $("#list_view").hide();
    
  loader.load_header();
  
  loader.load_dates();
  loader.load_headline();
  loader.handle_dates_headline_position();
  
  loader.load_social();
  loader.load_image();
  loader.load_article();
  
  $('#img').load(function() {
    var large = loader.get_large_viewport_value();
    loader.position_credit(large);
    loader.position_social(large)
    loader.position_article();
  });
  
  $("#story_view").show();
};

loader.get_index_from_url = function() {
  var story_url = get_url_parameter('story');
  if(story_url == null) return -1;
  
  for(var i = 0; i < stories.length; ++i) {
    if(stories[i].url_path == story_url)
      return i;
  }
  
  return -1;
}


loader.handle_dates_headline_position = function() {
  var date_position = $("#datetime").offset();
  var headline_position = $("#story_headline").offset();
  
  if(loader.should_render_large_view()) {
    if(headline_position.top > date_position.top) {
      jQuery("#datetime").before(jQuery("#story_headline"));
    }
  } else {
    if(headline_position.top < date_position.top) {
      jQuery("#datetime").after(jQuery("#story_headline"));
    }
  }
}

loader.handle_large_view_article = function(content, author) {
  var markup = 'by ' +
                 '<div class="author_name">' + author + '</div>' +
               '<div class="columns">' +
                 '<div>' + content + '</div>' +
               '</div>';
             
  $("#author").html('');
  $("#article").html('');
  $('#large_article').html(markup);
  
  loader.position_credit(true);
}

loader.position_social = function(large_view) {
  if(large_view) {
    var above = $('#datetime');
    var left = $('#image');
    
    var bar = $('#social_link_large');
    
    bar.css({'top' : above.offset().top + above.height() + 8,
             'left' : left.offset().left + left.width() + 9});
  }
}

loader.position_credit = function(large_view) {
  var img = $('#image');
  var img_pos = img.offset();
  var credit = $('#credit');
  
  if(large_view) {
    credit.css({ "top": img_pos.top + img.height() - credit.height() - 8, 
                 "left" : img_pos.left + img.width() - credit.width() - 3});
    credit.css({"background" : '#ffffff', 'opacity' : 0.6});
    $("#caption").css({ 'padding-top' : 0 });
  } else {
    credit.css({ "top": img_pos.top + img.height(), 
                 "left" : img_pos.left + img.width() - credit.width() - 8});
    credit.css({"background" : '#0', 'opacity' : 1});
    $("#caption").css({ 'padding-top' : 12 });
  }
}
  
loader.position_article = function() {
  if(loader.should_render_large_view()) {
    var bar = $('#social_link_large');
    var article = $("#large_article");
    
    article.css({'top' : bar.offset().top + bar.height() + 3,
                 'left' : bar.offset().left + 9});
  }
}
  
loader.handle_resize = function(w) {
  var large = loader.should_render_large_view();
  loader.position_credit(large);
  loader.position_social(large);
  loader.position_article();
}

