$(document).ready(function(){

  // Hide the input area until the user actually picks a problem.
  $("#latest").css("display", "none");

  $(".viewsubmissions").live('click', function(){ 
    var id=$(this).attr('id')
    $(location).attr('href','/testcode/teacher/edit/performance/'+id);
  })



    lectureid=$(".lectureelement").attr('id');  
    var  pname=$( "#problemname" );


  $( "#dialog-formproblem" ).dialog({
    autoOpen: false,
    height: 220,
    width: 450,
    modal: true,
    buttons: {
      "Create a problem": function() {
        var name=pname.val()
        allFields = $( [] ).add( pname )
          
        $.post('/testcode/api/createproblem',
          {
            problem_name:pname.val(),
            lecture_id:lectureid
          },
          function(data){                    
            var result = jQuery.parseJSON(JSON.stringify(data))
            var isOkay = result.isOkay
            var error = result.error                     
            var id= result.problem_id
            if (isOkay==false)
            {
              color = "red";

            }
            else
            {
              color = "green";
              // We could do some complicated formatting stuff, or we could just
              // reload the page.
              location.reload();

            }
            $("#problem_message_box").html("<span style='color:"+color+"'>"+error+"</span>")
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
   
  $( "#create-problem" )
   .button()
   .click(function() {
    $( "#dialog-formproblem" ).dialog( "open" );
  });

  //Make the problem names sortable, so teachers can reorder
  //the problems.
  $("#problemlist").sortable();

  $("#problemlist").on("sortstop", function(event, ui){
    console.debug("Sort changed");
    var order = $(this).sortable("toArray");
    $.post('/testcode/api/reorder',
      {'id_list': order},
      function(data){
        result = jQuery.parseJSON(JSON.stringify(data))
        if (result.isOkay) {
          location.reload()
        } else {
          $(this).html('Delete failed');
        }
      })
  });

  var problem_id;
  var i;

  $(document).on("click",".problemlinks",function(){

    $(".active").eq(1).removeClass("active");
    $(this).addClass("active");
    problem_id=$(this).attr('id'); 
    var name
    var description                   
    var code
    var timelimit
    var testingscript
    var soln
    $.post( '/testcode/api/getproblemteacher',
    {
      problem_id:problem_id                        
    },
    function(data){
      var result = jQuery.parseJSON(JSON.stringify(data));
      name=result.name;
      description=result.problem_description;                       
      code=result.initial_code;
      timelimit=result.timeout;
      testingscript = result.testing_script;
      soln = result.soln;

      $("#problemtitle").html(name);
      $("#description1").val(description);
      $("#appendedInput").val(timelimit);
      $("#incode").data("mirror").setValue(code);
      $("#incode").data("mirror").refresh();
      $("#testscript").data("mirror").setValue(testingscript);
      $("#testscript").data("mirror").refresh();
      $("#soln").data("mirror").setValue(soln);
      $("#soln").data("mirror").refresh();
      $("#latest").css("display", "block");
   },

   "json"
   );
  });

  $(".delete-problem").on('click', function(event) {
    // Delete the problem.  If the instructor clicks on this button, the text
    // changes to "Confirm".  He must click again to actually delete.
    if ($(this).data('confirm') != 'Go') {
      $(this).html('Confirm');
      $(this).data('confirm', 'Go');
    } else {
      // Actually delete.
      id = $(this).attr('problem-id')
      url_chunks = window.location.pathname.split('/')
      //This is really hackish, but we need the course id, which is only available
      //through the url :(
      course = url_chunks[url_chunks.length - 2]
      $.post('/testcode/api/delete',
        {problem_id: id,
         course: course},
        function(data)
          {

            result = jQuery.parseJSON(JSON.stringify(data))
            if (result.isOkay) {
              location.reload()
            } else {
              $(this).html('Delete failed');
            }
      });
    }


  });

  $(document).on("click","#savedescription",function(){
    var descr=$("#description1").val();
    var initialcode=$("#incode").data("mirror").getValue();
    var timelimit=$("#appendedInput").val();
    var testingscript = $("#testscript").data("mirror").getValue();
    var soln = $("#soln").data("mirror").getValue();
    $.post('/testcode/api/createproblem',
    {
      problem_id:problem_id,
      description:descr,
      timeout:timelimit,
      initial_code:initialcode,
      testing_script: testingscript,
      soln: soln
    },
    function(data){
     var result = jQuery.parseJSON(JSON.stringify(data));
     isOkay=result.isOkay
     error=result.error
     console.debug(isOkay)

     if (isOkay)
      {
        console.debug("Good")
        var date= new Date();
        $("#desc").html('<span style="color:green; font-weight:normal; font-size:12; float:right"> Saved '+date.toLocaleTimeString()+'  </span>');
        $("#results").html('<pre>' + result.results + '</pre>' + '<div style="color:red"><pre>' + error + '</pre></div>');
      }
      else
      {
        console.debug("Bad")
        $("#desc").html('<span style="color:red; font-weight:normal; font-size:12; float:right">'+error+'</span>')
      }

    }

    )
  });




});
