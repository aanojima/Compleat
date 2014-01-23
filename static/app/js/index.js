$(document).ready(function(){
	$("#login").click(function(event){
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
					window.location.href = "/main/";
				}
			}
		})
	});
	$("#signup").click(function(event){
		event.preventDefault();
		if ($("#new_password").val() == $("#new_confirm_pw").val()){
			$.ajax({
				method : "GET",
				url : "/validate_new_user/",
				data : {
					first_name : $("#new_first_name").val(),
					last_name : $("#new_last_name").val(),
					email : $("#new_email").val(),
					password : $("#new_password").val(),
				},
				success : function(result){
					alert(result["status"]);
					if (result.status == "success"){
						window.location.href = "/main/";
					}
				}
			});
		} else {
			alert("Passwords aren't the same! ");
		}
	});

});