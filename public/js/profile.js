$(function() {
	// console.log(window.location.href);
	var editBtn = $('#edit-btn');
	var cancelBtn = $('#cancel-btn');
	var profileTable = $('#profileTable');
  


  	window.mdc.autoInit();

  	$('#dob').datepicker({
            format : 'yyyy-mm-dd'
        });
	editBtn.on('click', function(event) {
		event.preventDefault();
		var edit = $(this).parents("#profileTable").find('.edit');
		$.each(edit, function(i, btn) {
			$(this).removeClass('edit').addClass('no-edit');
		});
		$(this).removeClass('no-edit').addClass('edit');
	});
	
	cancelBtn.on('click', function(event) {
		event.preventDefault();
		var edit = $(this).parents("#profileTable").find('.no-edit');
		var check1 = $(this).parents("#profileTable").find('.editable-no-edit').length;
		var check2 = $(this).parents("#profileTable").find('.editable-edit').length;
		if (check1 < 12 && check2 > 6 ) {
			alert("Save or Delete the edits");
		} else {
			$.each(edit, function(i, btn) {
				$(this).removeClass('no-edit').addClass('edit');
			});
			editBtn.removeClass('edit').addClass('no-edit');	
		}
	});

	var editElement;
	profileTable.delegate('button.editor', 'click', function(event) {
		$(this).closest('td').children('.editable-no-edit').addClass('editable-edit').removeClass('editable-no-edit');
		$(this).addClass('editable-no-edit').removeClass('editable-edit');
		$(this).closest('tr').find('div.editor-noedit').addClass('editor-edit').removeClass('editor-noedit');
		$(this).closest('tr').find('span.editor-edit').addClass('editor-noedit').removeClass('editor-edit');
		editElement = $(this).attr('data-data');
		// $('#' + value).val($(this).closest('tr').find('span.editor-noedit').html());
		// console.log($(this).closest('tr').find('span.editor-noedit').html())
	});

	profileTable.delegate('button.cancel', 'click', function(event) {
		$(this).closest('td').children('.editable-edit').addClass('editable-no-edit').removeClass('editable-edit');
		$(this).closest('td').children('.editor').addClass('editable-edit').removeClass('editable-no-edit');
		$(this).closest('tr').find('div.editor-edit').addClass('editor-noedit').removeClass('editor-edit');
		$(this).closest('tr').find('span.editor-noedit').addClass('editor-edit').removeClass('editor-noedit');
	});


	profileTable.delegate('button.save', 'click', function(event) {

		var value = $('#' + editElement).val();

		var edit = {
			name : editElement,
			value : value
		}


		$.ajax({
			url: window.location.href,
			type: 'PUT',
			dataType: 'json',
			data: JSON.stringify(edit),
			success : function (res) {
				console.log(res);
			}
		})
	});

});