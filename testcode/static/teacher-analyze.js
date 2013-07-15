 
 $(document).ready(function(){
 var color=['#041a6d', '#1a269f', '#05519e', '#059e99','#059e51',  '#059e09' , '#036205', '#498700', '#2d5003', '#847f00']
 var chart1= new Array(), 
     chart2= new Array(),
     chart20= new Array(), 
     chart21= new Array(),
     submission_id= new Array(),
     name,date= new Array(), 
     grade= new Array(), 
     notsubmit= new Array()
     array= new Array()
 var n,ntest 
   
  

  function getInfo()
  { 

   var problem_id=$(".active").attr('id');
   

    $.post( '/testcode/api/viewperformance',
             {
              problem_id:problem_id
             },
             function(data)
                   {
                    var result = jQuery.parseJSON(JSON.stringify(data))             
                    notsubmit=result.unsubmitted
                    submission_id=result.submission_id, 
                    name=result.name, 
                    date=result.date, 
                    array=result.grade                    
                    n=name.length
                    ntest=array[0].length
                    if (n==0)
                      {$("#shit").html("This problem has no submissions")}
                    else
                      { $("#insert").html(n+' students submitted a solution')
                        // Count # of students with each score.
                        var score_histogram = {};
                        for (var student=0; student<array.length; student++) {
                          if (array[student] in score_histogram) {
                            score_histogram[array[student]][1] += 1;
                          } else {
                            score_histogram[array[student]] = [array[student], 1];
                          }
                        }
                        // Get values of hashmap.
                        var score_counts = [];
                        for (var key in score_histogram) {
                          score_counts.push(score_histogram[key]);
                        }

                        var plot1 = jQuery.jqplot ('chart_div', [score_counts], 
                                {  title:'Students\' score chart',
                                  seriesDefaults: {
                                    renderer: jQuery.jqplot.PieRenderer, 
                                    rendererOptions: 
                                    {showDataLabels: true
                                    }
                                  }, 
                                  grid: { background: 'none'   ,
                                    borderColor: 'none',
                                     shadow: false,  
                                    },
                                   legend: { show:true, location: 'e' }
                                }
                              );

                        //The rest of this is not working right now.
                             for (var i=1; i<ntest+1; i++)
                              {
                                chart20[i-1]=[passed[i-1], '#'+i]
                                chart21[i-1]=[failed[i-1], '#'+i]
                              } 
                            chart2=new Array(chart20, chart21)                            
                            var plot2 = $.jqplot('chart_div2', [chart20, chart21], {
                                        title:'Performance per test case',
                                        seriesDefaults: {                                            
                                            renderer:$.jqplot.BarRenderer,                                           
                                            pointLabels: { show: true, location: 'e', edgeTolerance: -15 },
                                            shadowAngle: 135,
                                            rendererOptions: {
                                                barDirection: 'horizontal'
                                            }
                                        },
                                        series:[
                                             {label:'Passed'},
                                             {label:'Failed'},
                                            
                                               ],
                                         grid: { background: 'none'   ,
                                        borderColor: 'none',
                                         shadow: false,  
                                        },
                                        legend: {
                                      show: true,
                                      location: 'e',
                                      placement: 'outside'
                                    } ,
                                        axes: {
                                            yaxis: {
                                                label:'Testcase',
                                                renderer: $.jqplot.CategoryAxisRenderer,
                                                labelRenderer: $.jqplot.CanvasAxisLabelRenderer,                                               
                                        }
                                      }}) } })}                

getInfo()
var checked= new Array()


var icon
var row
$("input:radio").change(function(){   
  var j=0;
  var string=""
 for (var i=1; i<ntest+1; i++)
   {
   checked[i]=$("input:radio[name='"+i+"']:checked").val()
   }
   $("#filter").remove()  
   for (var i=1; i<ntest+1; i++) 
   {
    string=string+'<td> TC #'+i+' </td>'
  }
   string='<table class="table table-hover" id="filter"><thead><tr > <span style="font-weight:900"><td > # </td> <td> Student\'s name </td><td> Date sent </td>'+string+' </span></tr></thead>'
   for (var i=0; i<n; i++)
      {
        
        tohide=false
        row=""        
        for (var k=1; k<ntest+1; k++)
              {                
                if (grade[i][k-1]==true) icon="ok"; else icon="remove"
                row=row+'<td> <i class="icon-'+icon+'"></i></td>'
                if (checked[k]=='pass' && grade[i][k-1]==false) {tohide=true} else{ if (checked[k]=='fail' && grade[i][k-1]==true) {tohide=true}}
                
              }
        if (!(tohide)) {j=j+1; string=string+'<tr id="'+submission_id[i]+'" class="submissionlinks"> <td>'+j+'</td><td>'+name[i]+'</td> <td>'+date[i]+'</td>'+row+'</tr>'}
      }
    string=string+' </tr></table>'
    $("#latest").append(string)  
      })

 $(".submissionlinks").live('click', function() {
                  
                    var id=$(this).attr('id');                   
                    $.post(
                        '/testcode/api/getsubmissionteacher',
                        {
                          submission_id:id
                        },
                        function(data)
                        {
                         var result = jQuery.parseJSON(JSON.stringify(data))
                         var text=result.solution;
                         $(".language-py").html(text)
                         $( "#viewsubmission" ).dialog( "open" )
                        })
                  })                              
 
  $( "#viewsubmission" ).dialog({
      autoOpen: false,
      height: 700,
      show: 'fade',
      hide: 'fade',
      width: 900,
      modal: true,
      // buttons: {
        
      //   Cancel: function() {
      //     $( this ).dialog( "close" );
      //                      }
      //   },
      close: function() {
        allFields.val( "" ).removeClass( "ui-state-error" );
      }
    });

  
        



       }) ;                