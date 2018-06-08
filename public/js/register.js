$(function () {

    var regFac = $('#facultyRegister');
    var regStu = $('#studentRegister');
    var confirm =  $('#confirmation');
    var confirmation = $('#confirmation');
    var form = $('form#passform');
    var submitBtn = $('button#submitBtn');
    var selection = $('#registerSelect');
    var selectedForm = $('#selectedForm');
    var username, password,pswd, DOB, check, type;

    var formTemplate = "\
                    <form action='' class='form-container-register'>\
                            <div class='mdc-text-field' data-mdc-auto-init='MDCTextField'>\
                                <input class='mdc-text-field__input' type='text' id='id' size='24' maxlength='10' required>\
                                <label for='id' class='mdc-floating-label'>{{labelId}}</label>\
                                <div class='mdc-line-ripple'></div> \
                            </div>\
                            <div class='mdc-text-field' data-mdc-auto-init='MDCTextField'>\
                                <input class='mdc-text-field__input' type='text' id='dob' required readonly>\
                                 <label for='dob' class='mdc-floating-label'>Enter DOB</label>\
                            </div>\
                            <button type='button' data-id='id' data-date='dob' value='{{type}}' id='check' class='mdc-button mdc-button--raised mdc-button--dense'>\
                                <i class='material-icons mdc-button__icon'>done</i>\
                                Confirm\
                            </button>\
                    </form>";

    var confirmTemplate = "<p> Name : {{firstName}}  {{lastName}} </p> " +
     						"<p> Department : {{dept_name}}" +
     						"<p> Email : {{email}} </p>" +
     						"<p>Phone : {{phone}}</p>" +
     						"<p style = 'display : inline'>  Confirm your details : <div class='mdc-form-field'>\
                            <div class='mdc-radio'>\
                                <input class='mdc-radio__native-control' type='radio' name='confirm' value='false' id='no'>\
                                <div class='mdc-radio__background'>\
                                  <div class='mdc-radio__outer-circle'></div>\
                                  <div class='mdc-radio__inner-circle'></div>\
                                </div>\
                            </div>\
                            <label for='no'>No</label>\
                         </div> \
                         <div class='mdc-form-field'>\
                            <div class='mdc-radio'>\
                                <input class='mdc-radio__native-control' type='radio' name='confirm' value='true' id='yes'>\
                                <div class='mdc-radio__background'>\
                                  <div class='mdc-radio__outer-circle'></div>\
                                  <div class='mdc-radio__inner-circle'></div>\
                                </div>\
                            </div>\
                            <label for='yes'>Yes</label>\
                         </div> </p>";

    selection.delegate('input[name=register-type]', 'change', function(event) {
        var formType = $(this).attr('data-frmName');
        var labelId;
        if (formType === 'faculty') this.labelId = "Enter Employee Id";
        else this.labelId = "Enter Student Roll Number";

        var formDetails = {
            type : formType,
            labelId : this.labelId,
        }

        selectedForm.html(Mustache.render(formTemplate, formDetails));

        window.mdc.autoInit();
        $('#dob').on('change', function(event) {
            event.preventDefault();
            if($(this).val() !== '') $(this).siblings('label').addClass('mdc-floating-label--float-above');
            else $(this).siblings('label').removeClass('mdc-floating-label--float-above')
        }).blur(function(event) {
             if($(this).val() == '') $(this).parent().addClass('mdc-text-field--invalid');
             else $(this).parent().removeClass('mdc-text-field--invalid')
        });

        $('#dob').datepicker({
            format : 'yyyy-mm-dd'
        });
        check = $('#check');

        check.on('click', function(event) {
            event.preventDefault();
            confirmation.html("");
            type = $(this).val();
            var id = $('#' + $(this).attr('data-id'));
            var dob = $('#' + $(this).attr('data-date'));
            id = id.val();
            this.dob = dob.val();
            username = id;
            DOB = this.dob;
            if(id !== "" || this.dob !== "" ) {
                $.ajax({
                    url: '/confirm/'+ type + '/' + id + '/' + this.dob,
                    type: 'GET',
                    dataType: 'json',
                    success : function (res) {
                        console.log(res);
                        if (res.confirm.length !== 0) {
                            display(res.confirm[0]);
                        } else {
                            alert("Check your details");
                        }
                    }, 
                    error : function (e, ts, et) {
                            console.log("some error" + ts + et);
                    }
                });
            } else {
                
                alert("Missing Credentials");
            }
        });
   });





    confirmation.delegate('input[name=confirm]', 'change', function(event) {
        event.preventDefault();
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


    submitBtn.on('click', function(event) {
    	event.preventDefault();
    	var user = {
            username : username,
            dob : DOB,
    		password : password,
            type : type
    	};

        console.log(user)

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
            error : function (res,e, ts, et) {

                console.log(res +"some error" + ts + " " + et);
            }
        });
    });

   //  form.delegate('input[type=password]', 'keyup', function(event) {
        

   // });

    $('input[type=password]').keyup(function(event) {
        event.preventDefault();

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