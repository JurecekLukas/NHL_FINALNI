$(function(){
    /* Získá všechny záznamy z movies.json prostřednictvím AJAX požadavku */
    function getAll() {
        $.ajax({
            url: 'http://localhost:3000/api/movies',
            type: 'GET',
            dataType: 'json',
            cache: false,
            success: function (data, textStatus, xhr) {
                console.log(textStatus);
                console.log(data);
                $('#list').html('');
                data.forEach(function(film) {
                    $('#list').append('<tr><td>'+film.id
                        +'</td><td><b> <a href="#" data-id="'+film.id+'">'+film.name
                        +'</a></b></td><td>'+film.year+'</td><td>'+film.point+'</td><td>'+film.state+/*'<img src="'+film.picture+'">*/'</td><td>'+film.position+'</td><td><button class="btn btn-danger delete" data-id="'+film.id+'">Smazat</button></td></tr>');
                });
                $('#list a').on('click', function(){
                    getById($(this).data('id'));
                }); 
                $('.delete').on('click', function(){
                    deleteById($(this).data('id'));
                }); 
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        })
    }

    /* Získá jeden záznam podle id */
    function getById(id) {
        $.ajax({
            url: 'http://localhost:3000/api/movies/' + id,
            type: 'GET',
            dataType: 'json',
            cache: false,
            success: function (data, textStatus, xhr) {
                console.log(textStatus);
                console.log(data);
                $('#id').val(data.id);
                $('#name').val(data.name);
                $('#year').val(data.year);
                $('#point').val(data.point);
                $('#state').val(data.state);
                $('#position').val(data.position);
                $('#content').val(data.content);
                $('#modelId').modal('show');
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        })
    }

    /* Smazat záznam podle id */
    function deleteById(id) {
        $.ajax({
            url: 'http://localhost:3000/api/movies/' + id,
            type: 'DELETE',
            dataType: 'json',
            cache: false,
            success: function (data, textStatus, xhr) {
                console.log(textStatus);
                console.log(data);
                getAll();
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        })
    }

    /* Vytvořit nový záznam */
    function create(data) {
        $.ajax({
            url: 'http://localhost:3000/api/movies',
            type: 'POST',
            data: data,
            dataType: 'json',            
            contentType: 'application/json',
            success: function (data, textStatus, xhr) {
                console.log(textStatus);
                console.log(data);
                getAll();
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        })
    }

    /* Editovat záznam */
    function update(id, data) {
        $.ajax({
            url: 'http://localhost:3000/api/movies/' + id,
            type: 'PUT',
            data: data,
            dataType: 'json',
            contentType: 'application/json',
            success: function (data, textStatus, xhr) {
                console.log(textStatus);
                console.log(data);
                getAll();
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        })
    }

    $('button#submit').on('click', function(){
        var json = {};
        json.name = $('#name').val();
        json.year = $('#year').val();
        json.point = $('#point').val();
        json.state = $('#state').val();
        json.position = $('#position').val();
        json.content = $('#content').val();
        var data = JSON.stringify(json);
        if ($('#id').val()) {
            update($('#id').val(), data);
        } else {
            create(data);
        }
    });

    $('button#create').on('click', function(){
        $('#id').val('');
        $('#name').val('');
        $('#year').val('');
        $('#point').val('');
        $('#state').val('');
        $('#position').val('');
        $('#content').val('');
    });

    getAll();
});
    
