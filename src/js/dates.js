// time + date stuff
var months = ["Jan","Feb","Mar",
              "Apr","May","June",
              "Jul","Aug","Sep",
              "Oct","Nov","Dec"];
            
var days = ["Monday", "Tuesday", "Wednesday", 
            "Thursday", "Friday", "Saturday", "Sunday"];
          
var formatted_date_function = function(date) {
  var seconds = date.getSeconds();
  if(seconds < 10) seconds = "0" + seconds;
        
  var am_pm = date.getHours() + ":" + seconds + ' a.m. ';
  if(date.getHours() > 12) {
    am_pm = (date.getHours() - 12) + ":" + seconds +' p.m. ';
  }
        
  return am_pm + days[date.getDay()] + ", " + 
  months[date.getMonth()] + " " +
  date.getDate() + ", " + date.getFullYear();
};