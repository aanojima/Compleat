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
<<<<<<< HEAD
					window.location.href = "/";
=======
					window.location.href = "/main/";
>>>>>>> b2279020b05df129db36ad9936d04b0d518a8aee
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
<<<<<<< HEAD
						window.location.href = "/";
=======
						window.location.href = "/main/";
>>>>>>> b2279020b05df129db36ad9936d04b0d518a8aee
					}
				}
			});
		} else {
			alert("Passwords aren't the same! ");
		}
	});

});