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
    var rating = new Array()
    $.getJSON('api/movies', function(data)
    {
        var genres = new Array();
       
        $
        $.each(data,function(key,value){
            if (genres.indexOf(value.Genre) === -1) {
                genres.push(value.Genre)
            }
            if(rating.indexOf(value.Rating)===-1)
            {

                rating.push(value.Rating)
            }


        })
        $.each(genres, function (key, value) {
            var movies = $("<li><a class='thickbox' href='#ctable'></a></li>")
            $('#genres').append(movies).find('a:last').text(value).attr("data-genre", value)
        })

    }) 
    .promise()
    .done(function () {
        $('#genres').after("<a class='thickbox' href='#addnew'  id='add'>Add&nbsp+<a>")
        $('#add').on('click', function (e) {
            $('#addnew').remove()
            e.preventDefault()
            var option
            $.each(rating, function (data, rat) {
                option +=("<option>"+rat+"</option>")

            })
            fr = ('<form id="addnew"><label for="gnr">Genre</label><input placeholder="Enter Genre" id="gnr" class="form-control"  /><label for="tl">Title</label><input placeholder="Enter Title" id="tl" class="form-control"  /><label for="yr">Year</label><input placeholder="Enter Year" id="yr" class="form-control"  /><br /><select>' + option + '</select><br /><br /><input id="sub" type="submit" value="Save" class="btn btn-success" class="form-control"  /></form>')
            $('#tab').append(fr)
            $('#add').fancybox()
           
            $('#addnew').submit(function(e){
                //e.preventDefault()
                

                $(':input').each(function () {
                    
                    if ($(this).val() == "")
                    {
                        $(this).css("border-color", "red")
                        check=false

                    }
                })
                if ($(':input').val()!="")
                {

                    alert('The data is saved')
                }
               
            })
           
            $(':input').each(function(){
              
                $(this).focus(function () {
                    
                    $(this).css("border-color", "black")

                })
                

            })


        })

    

        $("#genres li a").on("click", function (event) {
            $("li a").fancybox();
            event.preventDefault();
            $('table').remove()
            var tb = ("<table class='table table-bordered' id='ctable'><thead><tr><td>Title</td><td>Year</td><td>Rating</td><td>Edit  <input id='checkbox' type='checkbox' unchecked/></tr></thead><tbody><tr></tr></tbody></table>")
            $('#tab').append(tb)
            Genre = $(this).attr("data-genre");
            $.getJSON('api/movies/?genre=' + Genre, function (genre) {
                $.each(genre, function (data, genres) {
                    td = ("<tr><td><span data-obj='Title'>" + genres.Title + "</span></td><td><span data-obj='Year'>" + genres.Year + "</span></td><td><span data-obj='Rating'>" + genres.Rating + "</span></td><td id='last'></td></tr>")
                    $('tbody').append(td).find('tr:last').attr({data:genres.ID,"data-genre":Genre})
                })
            })
            .promise()
            .done(function () {
                $('#checkbox').change(function () {
                    tr = $('tbody tr')
                    td = tr.find('td').not('#last')
                    if (this.checked)
                    {
                       $('button').remove()
                       tr.find('td:last').append('<button class="btn btn-success save ">Save</button>')
                       td.append('<input type="text" />')
                       td.each(function () {
                           $(this).find('input').attr({ value: $(this).text() })
                         / $(this).find('span').hide()
                         //update size of fancybox
                           $.fancybox.update()
                       })
                       $('.save').on("click", function () {
                           str = $(this).parent().parent().find('input')
                           var obj =new Object();
                           str.each(function(){
                              obj.Genre = $(this).parent().parent().attr('data-genre')
                              obj.ID = $(this).parent().parent().attr('data')
                              obj[$(this).prev().attr('data-obj')] = ($(this).val())
                           })
                               $.ajax({
                                   type:"PUT",
                                   url: "api/movies/" + obj.ID,
                                   data:obj
                               }).done(function () {
                                   alert("Data is saved")
                               })
                           console.log(obj)
                       })
                    }
                    else if (this.checked==false)
                    {
                        $('button').remove()
                        tr.find('input').remove()
                        td.find('span').show()
                        $.fancybox.update()
                    }
                })
            })

        })
    })
    /* This is basic - uses default settings */
})(jQuery);
