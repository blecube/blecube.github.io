//Check users device
var isMobile = {
	Android: function() {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function() {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function() {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function() {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function() {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function() {
		return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
	}
};

//Apply styles for mobile version
if (isMobile.iOS() || isMobile.Android() || isMobile.BlackBerry() || isMobile.Opera()) {
	document.getElementById('styleSheet').href = "styles/stylesMobile.css";
}
//Apply styles for PC version
else {
	document.getElementById('styleSheet').href = "styles/stylesPC.css";
}