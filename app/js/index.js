$(document).ready(function(){
	$("#signin").click(function(event){
		event.preventDefault();
		$.ajax({
			method : "GET",
			url : "/validate_old_user/",
			data : {
				email : $("#email").val(),
				password : $("#password").val(),
			},
			success : function(result){
				alert(result["status"]);
				if (result.status == "success"){
					window.location.href = "/";
				}
			}
		})
	});
	$("#signup").click(function(event){
		event.preventDefault();
		if ($("#password").val() == $("#confirm").val()){
			$.ajax({
				method : "GET",
				url : "/validate_new_user/",
				data : {
					first_name : $("#firstname").val(),
					last_name : $("#lastname").val(),
					email : $("#email").val(),
					password : $("#password").val(),
				},
				success : function(result){
					alert(result["status"]);
					if (result.status == "success"){
						window.location.href = "/";
					}
				}
			});
		} else {
			alert("Passwords aren't the same! ");
		}
	});

});