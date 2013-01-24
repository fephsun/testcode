
 /*$(function(){ $("#create-lecture").hide() }); */

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
  var csrftoken = getCookie('csrftoken');
  function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
function sameOrigin(url) {
    // test that a given url is a same-origin URL
    // url could be relative or scheme relative or absolute
    var host = document.location.host; // host + port
    var protocol = document.location.protocol;
    var sr_origin = '//' + host;
    var origin = protocol + sr_origin;
    // Allow absolute or scheme relative URLs to same origin
    return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
        (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
        // or any other URL that isn't scheme relative or absolute i.e relative.
        !(/^(\/\/|http:|https:).*/.test(url));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
            // Send the token to same-origin, relative URLs only.
            // Send the token only if the method warrants CSRF protection
            // Using the CSRFToken value acquired earlier
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
   });


      
$("#homelink" )
      .button()
      .click(function() {
        $.post('/api/userhome'
               );
      });

$(function() {
    var id = $( "#idclass" ),
        password = $( "#passwordclass" ),
      
        
        allFields = $( [] ).add( idclass ).add( passwordclass ),
        tips = $( ".validateTips" );
 
    
    
 
    $( "#dialog-formaddclass" ).dialog({
      autoOpen: false,
      height: 260,
      width: 450,
      modal: true,
      buttons: {
          "Add a class": function() {         
          allFields.removeClass( "ui-state-error" );        
           
                 
          $.post('/api/addcourse',
                      {
                      course_id:id.val(),
                      password:password.val(),
                      },
           function(data){                    
                     var result = jQuery.parseJSON(JSON.stringify(data))
                     var isOkay = result.isOkay
                     var error = result.error
                     var name= result.name
                     var id= result.course_id
                     var num_lectures = result.num_lectures
                     var num_problems = result.num_problems
                     if (isOkay==false)
                        {
                        color = "red";
                                 
                        }
                    else
                       { color = "green"
                         
                        setTimeout(function(){$("#dialog-formclass").dialog( "close" )
                        $("#shit").remove();
                        $("#classlist").prepend("<li id="+id+" class='classlinks'><a href='#''>"+name+"</a></li>");
                        $("#problemstable").prepend("<tr><td>"+ num_lectures+ " lectures</td><td >"+num_problems+" problems</td><td >"+num_problems+" unsolved problems</td></tr>")}, 600);
                            
                        }
                   $("#create_message_box").html("<span style='color:"+color+"'>"+error+"</span>")
           },
           "json"
           
          )
                 
        },
        Cancel: function() {
          $( this ).dialog( "close" );
                           }
        },
      close: function() {
        allFields.val( "" ).removeClass( "ui-state-error" );
      }
    });
 
    $( "#add-class" )
      .button()
      .click(function() {
        $( "#dialog-formaddclass" ).dialog( "open" );
      });

  
    });