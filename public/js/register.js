$(function () {

    var regFac = $('#facultyRegister');
    var regStu = $('#studentRegister');
    var confirm =  $('#confirmation');
    var check = $('.check')
    var confirmation = $('#confirmation');
    var form = $('form#passform');
    var submitBtn = $('button#submitBtn');
    var username, password,pswd, dob;
    regStu.on('change', changer);
    regFac.on('change', changer);

    var confirmTemplate = "<p> Name : {{name}} </p> " +
     						"<p> Department : {{dept_name}}" +
     						"<p> Email : {{email}} </p>" +
     						"<p>Phone : {{phone}}</p>" +
     						"<p>Confirm your details : <label for='no'><input type='radio' name='confirm' value='false' id='no'> No</label>" +
     						"<label for='yes'><input type='radio' name='confirm' value='true' id='yes'> Yes</label> </p>";

    function changer(event) {
        var frmid = $(this).attr('data-frmName');
        var frm = $('#'+frmid);
        if ($(this).is(':checked')) {
            frm.css('display', 'block');
            frm.siblings().css('display', 'none');
        } else {
            frm.css('display', 'none');
             
        }
    }

    confirmation.delegate('input[name=confirm]', 'change', function(event) {
    	var pwd = $('#pwd');
    	if ($(this).val() === 'true') {
    		pwd.css('display', 'block');
    	} else {
    		pwd.css('display', 'none');
    	}
    });	

    function display (confirm) {
    	confirmation.html(Mustache.render(confirmTemplate, confirm));
    }



    check.on('click', function(event) {
    	event.preventDefault();
    	confirmation.html("");
    	var type = $(this).val();
    	var frm = $('#' + $(this).attr('data-type'));
    	var id = frm.val();
    	username = id;
    	dob = frm.parent().siblings('label').children('.dob').val();
    	$.ajax({
    		url: '/confirm/'+ type + '/' + id + '/' + dob,
    		type: 'GET',
    		dataType: 'json',
    		success : function (res) {
                console.log(res);
    			if (res.confirm.length !== 0) {
    				display(res.confirm[0]);
    			} else {
    				alert("Please Check Your details and try again");
    			}
    		}, 
    		error : function (e, ts, et) {
    				console.log("some error" + ts + et);
    		}
    	});
    });

    submitBtn.on('click', function(event) {
    	event.preventDefault();
    	var user = {
            username : username,
            dob : dob,
    		password : password
    	};
        console.log(user);
        // $.post('/register', {data : 'hii'} , function(data, textStatus, xhr) {
        //     console.log('Success');
        // });


        $.ajax({
            url : '/register',
            type : 'POST',
            contentType: 'application/json',
            data : JSON.stringify(user),
            success : function (res) {
                if(window.confirm(res.msg)) {
                    window.location = res.redirectTo;
                }
            },
            error : function (e, ts, et) {
                console.log("some error" + ts + " " + et);
            }
        });
    });

    $('input[type=password]').keyup(function() {
    pswd = $(this).val();
    var length = $('#length');
    var smallCh = $('#smallCh');
    var capital =  $('#capital');
    var number = $('#number');
    var matches = $('#matches');
    if ( pswd.length < 8 ) {
        length.removeClass('valid').addClass('invalid');
    } else {
        length.removeClass('invalid').addClass('valid');
    }
    if ( pswd.match(/[a-z]/) ) {
        smallCh.removeClass('invalid').addClass('valid');
    } else {
        smallCh.removeClass('valid').addClass('invalid');
    } 
    if ( pswd.match(/[A-Z]/) ) {
        capital.removeClass('invalid').addClass('valid');
    } else {
        capital.removeClass('valid').addClass('invalid');
    } 
    if ( pswd.match(/\d/)) {
        number.removeClass('invalid').addClass('valid');
    } else {
        number.removeClass('valid').addClass('invalid');
    }

    if($('#rePass').val() == $('#pass').val()) {
    matches.removeClass('invalid').addClass('valid');
    } else {
    matches.removeClass('valid').addClass('invalid');
    }

    }).focus(function() {
        var info = $('#' + $(this).attr('data-type'));
        info.show();

    }).blur(function() {
        var info = $('#' + $(this).attr('data-type'));
        info.hide();
    });

    form.on('keyup', function(event) {
        var valid = $(this).children('#pwd-info1, #pwd-info2').children('.invalid').length;
        if(valid === 0 ) {
            submitBtn.removeAttr('disabled');
        	password = pswd;
        }
        else submitBtn.attr('disabled', 'true');
    });
});