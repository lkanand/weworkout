function getLocation(email, password) {
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position){
			createNewUser(email, password, position.coords.latitude, position.coords.longitude);
		}, function(error){
			createNewUser(email, password, null, null);
		});
	}
	else {
		createNewUser(email, password, null, null);
	}
}

function createNewUser(email, password, latitude, longitude) {
	var newUser = {
		email: email,
		password: password,
		latitude: latitude,
		longitude: longitude,
	};

	$.ajax({
		type: "POST",
		url: "/api/new-user",
		data: newUser
	}).then(function(error){
		if(error){
			if("errors" in error) {
				if(error.errors[0].path === "email")
					$("form p").text("The email you entered is not valid.");
				else if(error.errors[0].path === "password")
					$("form p").text("The password you entered is not valid.");
			}
			else
				$("form p").text("There was an error. Please try again.");
		}
		else {
			window.location.replace("/profile");
		}
	});
}

$(document).ready(function(){	
	$(".signUp").on("click", function(event){
		event.preventDefault();
		var newEmail = $("input[name=email]").val();
		var newPassword = $("input[name=password]").val();
		
		$("input[name=email]").val("");
		$("input[name=password]").val("");

		getLocation(newEmail, newPassword);
	});

	$(".signIn").on("click", function(event){
		event.preventDefault();
		var email = $("input[name=email]").val();
		var password = $("input[name=password]").val(); 

		var credentials = {
			email: email,
			password: password
		};

		$("input[name=email]").val("");
		$("input[name=password]").val("");

		$.ajax({
			type: "POST",
			url: "/api/login-user",
			data: credentials
		}).then(function(data){
			if(data === "error")
				$("form p").text("Sorry. There was a login error");
			else if(data === "user")
				$("form p").text("We could not find that username");
			else if(data === "password")
				$("form p").text("That password is incorrect");
			else {
				window.location.replace("/matches");
			}
		});
	});
});