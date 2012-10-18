var stories = new Array();

var current = -1;


function get_url_parameter(name) {
    // source : http://stackoverflow.com/questions/1403888/get-url-parameter-with-jquery
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}

// loader object
var loader = new Object();

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
  var names = ['<a class="float_right" href="#">COMMENT<a>', 
               '<a class="float_right" href="#">SHARE<a>', 
               '<a class="float_right" href="#">FAVORITE<a>', 
               '<a class="float_right" href="#">VOTE<a>'];
  var result = '<ul class="social">';
  
  for(var i = 0; i < 4; ++i){
      result += "<li id=\"social_link_" + i + "\"><div class=\"float_left\"><div class=\"crop\" ><img id=\"social_image_" + i + "\" src=\"../images/uidevtest-sprites.png\"></img></div>";
      result += names[i] + "</div></li>";
  }
  result += "</ul>";
  $("#social").html(result);
};

loader.load_image = function() {
  var url = stories[current].lead_photo_image_url;
  var caption = stories[current].lead_photo_caption || "";
  var credit = stories[current].lead_photo_credit || "";
  
  $("#image").html("<img src=\"" + url + "\"></img>");
  $("#caption").html("" + caption);
  $("#credit").html(credit);
  
  console.log(caption);
};

loader.load_article = function() {
  var content = stories[current].story;
  var author = stories[current].author || "un-named source";
  
  $("#author").html('by <div class="author_name">' + author + "</div>");
  $("#article").html(content);
}

// list view functions
loader.load_list_view = function() {  
  $("#list_view").html("<ul id=\"list_view_list\">");
  
  var story, id;
  
  // normally might want to only render a certain amount
  for(var i = 0; i < stories.length; ++i) {
    story = stories[i];
    
    id = "list_view_element_" + i;
    $("#list_view_list").append('<li class="list_view_element" id="' + id + "\">");
    $("#" + id).append('<div class="thumb_container"><a class="thumb" href="?story=' + story.url_path + '" onClick="loader.load();"><img src="' + story.lead_photo_image_thumb + '"> </img></a>');
    $("#" + id).append('</div><div class="headline_container">');
    $("#" + id).append('<a class="headline" href ="?story=' + story.url_path + '">' + story.title + "</a>");
    $("#" + id).append(story.summary);
    $("#" + id).append(story.formatted_publish_date + '<br>' +
                           story.formatted_updated_date);
    $("#" + id).append("</div>");
    $("#list_view_list").append("</li>");
  }
  
  $("#list_view").append("</ul>");
}



// main load function
loader.load = function() {
  if(stories.length <= 0)
    loader.load_data();
  
  current = loader.get_index_from_url();  // out of index range means in list view
  console.log(current);
  
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
  loader.load_social();
  loader.load_image();
  loader.load_article();
  
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
