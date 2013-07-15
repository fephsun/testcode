var input;
var output;
var youroutput; 
var ifpassed=new Array()
var error
var pass
var initialcode
$(document).ready(function(){

$(".problemlinks").eq(0).addClass("active")

$(function(){
       problem_id=$(".problemlinks").eq(0).attr("id");       
       $.post(
                '/testcode/api/getproblem',
                 {
                  problem_id:problem_id,
                 },
                  function(data)
                    {
                        var result = jQuery.parseJSON(JSON.stringify(data))
                        var text=result.solution                       
                        var id=result.submission_id;
                        initialcode = result.initial_code
                        $('form').attr('id', id);   
                        $("#code").data("mirror").setValue(""+text); 
                        var hasNext=result.hasNext;
                        var hasPrev=result.hasPrev;
                        if (hasPrev) {$("#previous").removeClass("disabled")}  else {$("#previous").addClass("disabled")}                        
                        if (hasNext) {$("#next").removeClass("disabled")}   else {$("#next").addClass("disabled")}                   
                     }
             )


 });


 $( "#reset1" ).click(function() {                                                                               
   $("#code").data("mirror").setValue(""+initialcode);
});
 var problem_id=$(".active").attr("id");
 $( ".changecode" ).click(
                          function() 
          { if (! ($(this).is('.disabled')) ) 
                {var type=$(this).attr("id");   
          isNextSubmission=1;
          submission_id=$('form').attr('id');
         
          if (type=="previous") {isNextSubmission=0}                                                                                
                            $.post(
                                    '/testcode/api/getsubmission',
                                    {  

                                      submission_id:submission_id,
                                      isNextSubmission:isNextSubmission
                                    },
                                      function(data)
                                        {
                                            var result = jQuery.parseJSON(JSON.stringify(data))
                                            var text=result.solution;
                                            var hasNext=result.hasNext;
                                            var hasPrev=result.hasPrev;
                                            $("#code").data("mirror").setValue( ""+text);                                           
                                            var id=result.submission_id;
                                            $('form').attr('id', id);
                                            if (hasPrev) {$("#previous").removeClass("disabled")}  else {$("#previous").addClass("disabled")}                       
                                            if (hasNext) {$("#next").removeClass("disabled")}   else {$("#next").addClass("disabled")}
                                        },
                                    "json"
                                  )
                            }
                      }
                            );

 $(".problemlinks").click(function(){
       problem_id=$(this).attr("id");
       $(".active").eq(0).removeClass("active");
       $(this).addClass("active");      
        $.post(
                '/testcode/api/getproblem',
                 {
                  problem_id:problem_id,
                 },
                  function(data)
                    {
                        var result = jQuery.parseJSON(JSON.stringify(data))
                        var text=result.solution                       
                        var hasPrev=result.hasPrev;
                        $("#code").data("mirror").setValue(""+text);
                        var description=result.description;
                        var id=result.submission_id;                        
                        var name=result.name; 
                        initialcode=result.initial_code                       
                        $("#descriptionplace").html(description);
                        $("#insidefeedback").html('Press "Save & Run" to see your results.<br/>') 
                        $('form').attr('id', id);                       
                        if (hasPrev) {$("#previous").removeClass("disabled")}  else {$("#previous").addClass("disabled")}                       
                        $("next").addClass("disabled");                       
                        initialcode=result.initial_code;                        
                    }
             )
 })

 $("#run").click(function()
    {
       problem_id=$(".active").eq(0).attr("id");
       var solution=$("#code").data("mirror").getValue();       
        $("#run").button('loading');
        $("#insidefeedback").fadeOut(1000);

      $.post('/testcode/api/submit',
         {
             problem_id:problem_id,
             solution:solution        
         },
         function(data)
         {
           $("#run").button('reset');
           var result = jQuery.parseJSON(JSON.stringify(data));
           pas=result.grade;
           error=result.errors;
           $("#insidefeedback").html('<pre>' + result.feedback + '</pre><br />' +
              '<span style="color:red"><pre>' + error + '</pre></span>');

           if (error != '') {
             alert(error)
           }

           $("#score").html('Score: ' + pas);

           $("#insidefeedback").fadeIn(800);
          }
       )
    }
)



// No longer used, I think.
$( "#viewtest" ).dialog({
      autoOpen: false,
      height: 'auto',
      show: 'fade',
      hide: 'fade',
      width: 'auto',
      modal: true,
     close: function() {
        allFields.val( "" ).removeClass( "ui-state-error" );
      }
    });

// No longer necessary, I think.
$(".test").live('click', function()
            {
              var id=$(this).attr('id')
              $("#forcorr").html("")
              $("#forwrong").html("")
              if (ifpassed[id-1]) { $("#forcorr").html(error[id-1])} else { $("#forwrong").html(error[id-1])}
              $("#in").html(input[id-1])
              $("#yourout").html(youroutput[id-1])
              $("#corrout").html(output[id-1])
              $("#viewtest").dialog("open")
            }
               )
});