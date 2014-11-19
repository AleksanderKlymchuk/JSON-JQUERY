(function ($) {
    setInterval(function () {
    $('#down').animate(
        {
            opacity: 0.4,
            height: "3.5em",
            width: "43.5em"
        }, 900)
        $('#down').animate(
           {
               opacity: 0.6,
               height: "3em",
               width: "3em"
           }, 900)
    })
    //$('#down').on('onclick',function()
    //{
    //    $('body').scrollTo('#section');

    //}
    //)
    var rating = new Array()
    var id = null;
    var genres = new Array();
    var  fancytable= function(Genre) {
        
        //$("li a").fancybox();
         
        $('table').remove()
        var tb = ("<table class='table table-bordered' id='ctable'><thead><tr><td>Title</td><td>Year</td><td>Rating</td><td>Edit  <input id='checkbox' type='checkbox' class='thickbox' unchecked/></tr></thead><tbody></tbody></table>")
        $('#tab').append(tb)
        //Genre = $(el).attr("data-genre");
       
        $.getJSON('api/movies/?genre=' + Genre, function (genre) {

            $.each(genre, function (data, genres) {
                td = ("<tr><td><span data-obj='Title'>" + genres.Title + "</span></td><td><span data-obj='Year'>" + genres.Year + "</span></td><td><span data-obj='Rating'>" + genres.Rating + "</span></td><td id='last'></td></tr>")
                $('tbody').append(td).find('tr:last').attr({ data: genres.ID, "data-genre": Genre })
            })
        }).then(function () {
            
            CheckEdit();

        })



    }

    var CheckEdit = function () {
        //listen on check box event change in order to change a form status from display to update (if check box is not checked the table shows data in span. If it's checked it hide span and add input fields with data from span) 
        $('#checkbox').change(function () {

            tr = $('tbody tr ')
            td = tr.find('td').not('#last').prev()

            if (this.checked) {
                $('button').remove()
                tr.find('td:last').append('<button class="btn btn-success save ">Save</button><a class="glyphicon glyphicon-trash delete "></a>')
                td.append('<input type="text" />')

                var option
                $.each(rating, function (data, rat) {
                    option += ("<option >" + rat + "</option>")
                })
                select = "<select data='Rating'>" + option + "</select>"
                tr.each(function () {

                    // lst = $(this).find('td').last().prev().text('').append(select)
                    $(this).find('td').last().prev().append(select)
                })
                var element = $('span[data-obj=Rating]');
                console.log(element.length)
                element.each(function () {
                    $('span[data-obj=Rating]').hide()

                })
                td.each(function () {
                    $(this).find('input').attr({ value: $(this).text() })

                    $(this).find('span,span[data-obj=Rating]').hide()
                    //update size of fancybox
                    $.fancybox.update()
                })
                //update movies on button click
                $('.save').on("click", function () {
                    str = $(this).parent().parent().find('input')
                    var obj = new Object();
                    data = $(this).parent().parent().find('select')
                    data.each(function () {
                    })
                    str.each(function () {
                        obj.Genre = $(this).parent().parent().attr('data-genre')
                        obj.ID = $(this).parent().parent().attr('data')
                        obj[$(this).prev().attr('data-obj')] = ($(this).val())
                        obj.Rating = $(this).parent().parent().find('select').val()
                    })

                    $.ajax({
                        type: "PUT",
                        url: "api/movies/" + obj.ID,
                        data: obj

                    }).done(function () {
                        cont = confirm("Data is saved!\n \n Do you want continue editing?")
                        if (cont === true) {


                        }
                        else {

                            $.fancybox.close();

                        }


                    })

                })
                $('.delete').on('click', function () {
                    var ers = confirm("Delete data?")
                    if (ers === true) {

                        $.ajax({
                            type: "DELETE",
                            url: "api/movies/" + $(this).parent().parent().attr('data'),

                        }).done(function (msg) {


                            $.fancybox.close()
                            location.reload()
                        })


                    }


                })
            }
            else if (this.checked === false) {
                var genre = $('tr[data-genre').attr('data-genre');
                //$('button').remove()
                //$(" td a").remove()
                //tr.find('input,select').remove()
                //$('span').show()
                $.fancybox.close()
                var table = $('#ctable');
               
                fancytable(genre);
                //$.fancybox.close()
            }
        })
    }


    //Get all movies with ajax request 
    $.getJSON('api/movies', function( data)
    {
        //Create an array to keep a distinct genres of received json object 
        
        id=data[data.length -1].ID
        
        //iteray through  genre and rating data objects and push to array 
        $.each(data, function (key, value) {

           
            //indexOf returns position of (string,number..) of the first occurance in the array, if the search value never occur it returns -1
           
            if (genres.indexOf(value.Genre) === -1) {
               
                genres.push(value.Genre)
            }
            if(rating.indexOf(value.Rating)===-1)
            {

                rating.push(value.Rating)
            }

  
        })
        //Forach genre in array create li element and append this element to ul of the DOM
        $.each(genres, function (key, value) {
            var movies = $("<li><a class='thickbox' href='#ctable'></a></li>")
            $('#genres').append(movies).find('a:last').text(value).attr("data-genre", value)
        })

    }) 
    .promise() //when it resolve at least once add new element(add new movie) into the DOM 
    .done(function () {
        $('#genres').after("<a class='thickbox' href='#addnew'  id='add'>Add&nbsp+<a>")
        $('#add').on('click', function (e) {
            $('#addnew').remove()
            
            //add options into select element from rating array
            var option
            $.each(rating, function (data, rat) {
                option +=("<option >"+rat+"</option>")

            })
            //create form element with input fields and submit button
            fr = ('<form id="addnew"><label for="gnr">Genre</label><input placeholder="Enter Genre" data="Genre" id="gnr" class="form-control"  /><label for="tl">Title</label><input data="Title" placeholder="Enter Title" id="tl" class="form-control"  /><label for="yr">Year</label><input placeholder="Enter Year" data="Year" id="yr" class="form-control"  /><br /><select data="Rating">' + option + '</select><br /><br /><input id="sub" type="submit" value="Save" class="btn btn-success" class="form-control"  /></form>')
            //append form into the dom
            $('#tab').append(fr)
            //use fancybox to display form
            $('#add').fancybox()
            //listen to the submit event of form 
            $('#addnew').submit(function (e) {
                e.preventDefault();
                $('form input').each(function () {

                   // alert("sadf")
                    if ($(this).val() === "")
                    {
                   
                        $(this).css("border-color", "red")
                    }
                })
                if ($('form input').val()!=="")
                {
                  
                    obj = new Object()
                    obj.ID = id+1
                    $.each($(':input').not('#sub'), function () {
                    obj[$(this).attr('data')] = $(this).val()
                    })
                    $.ajax({
                        type:"POST",
                        url: "api/Movies",
                        data: obj
                        
                    }
                    )
                    
                }
            })
            $(':input').each(function(){
                $(this).focus(function () {
                    $(this).css("border-color", "black")
                })
            })
        })
      
        //Display all movies of particular genres in table 
        $("#genres li a").on("click", function (event) {
            $('[id=active]').attr("id","")
            $(this).attr("id", "active")
            var data = $(this).attr("data-genre");
            $.when(fancytable(data))
        })
    })


    /* This is basic - uses default settings */
})(jQuery);
