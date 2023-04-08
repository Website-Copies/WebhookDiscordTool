$(document).ready(function() {
	$(".embed-builder").hide()
	handleChange()
	$('.parallax').parallax();
	$('.dark-toggle').on('click', function() {
		if ($(this).find('i').text() == 'brightness_4') {
			$(this).find('i').text('brightness_high');
		} else {
			$(this).find('i').text('brightness_4');
		}
	})
	const theme = localStorage.getItem('mode')
	const bodyClass = document.body.classList;
	bodyClass.add(theme);
	$('.modal').modal();
	$('.collapsible').collapsible();
	if (localStorage.getItem("docs")) {
		$("#docs").hide()
	}
	$('.materialboxed').materialbox();
	$('.sidenav').sidenav();
	$('.tooltipped').tooltip();
});


document.addEventListener("DOMContentLoaded", function() {
	$('.preloader-background').delay(1700).fadeOut('slow');

	$('.preloader-wrapper')
		.delay(1700)
		.fadeOut();
});

var slider = document.getElementById('slider');
noUiSlider.create(slider, {
	start: [1],
	connect: true,
	step: 1,
	orientation: 'horizontal', // 'horizontal' or 'vertical'
	range: {
		'min': 0,
		'max': 100
	},
	format: wNumb({
		decimals: 0
	})
});

$("#slider").on('touchmove', ontouchmove); //fix slider on mobile for some reason
function ontouchmove(e) {
	if (e.cancelable) {
		e.preventDefault();
	}
}

function handleChange() {
	$("#embed").change(function(e) {
		$(".embed-builder").toggle(800)
		$("#message").toggle(1000)
	})

}

function getData() {
	username = $("#nickname").val();
	avatar_url = $("#avatar_url").val(); //moĹźe byc puste
	message = $("#message").val();
	webhookUrl = $("#url").val();
	destroy = $("#destroy").is(':checked'); // true albo false
	tts = $("#tts").is(':checked');
	embed = $("#embed").is(':checked');
	if (embed) {
		title = $("#title").val();
		description = $("#description").val();
		color = $("#color").val();
		footer_text = $("#footer_text").val();
		footer_icon_url = $("#footer_icon_url").val();
		author = $("#author").val();
	}
	webhookUrl3 = $("#url3").val();
	name3 = $("#name3").val();
	avatar3 = $("#avatar3").val();
}

function load() {
	$("#nickname").val(localStorage.getItem("username"))
	$("#avatar_url").val(localStorage.getItem("avatar_url"))
	$("#message").val(localStorage.getItem("message"))
	$("#url").val(localStorage.getItem("webhookUrl"))
	$("#title").val(localStorage.getItem("title"))
	$("#description").val(localStorage.getItem("description"))
	$("#color").val(localStorage.getItem("color"))
	$("#footer_text").val(localStorage.getItem("footer_text"))
	$("#footer_icon_url").val(localStorage.getItem("footer_icon_url"))
	$("#author").val(localStorage.getItem("author"))
	$("#url2").val(localStorage.getItem("webhookUrl2"))
	$("#url3").val(localStorage.getItem("webhookUrl3"))
	$("#name3").val(localStorage.getItem("name3"))
	$("#avatar3").val(localStorage.getItem("avatar3"))
	$("#nickname").focus()
	$("#avatar_url").focus()
	$("#url").focus()
	$("#title").focus()
	$("#description").focus()
	$("#color").focus()
	$("#footer_text").focus()
	$("#footer_icon_url").focus()
	$("#author").focus()
	$("#url2").focus()
	$("#url3").focus()
	$("#name3").focus()
	$("#avatar3").focus()
	$("#channel_id").focus()
	$("#message").focus()
}

function save() {
	localStorage.setItem("username", $("#nickname").val())
	localStorage.setItem("avatar_url", $("#avatar_url").val())
	localStorage.setItem("message", $("#message").val())
	localStorage.setItem("webhookUrl", $("#url").val())
	localStorage.setItem("title", $("#title").val())
	localStorage.setItem("description", $("#description").val())
	localStorage.setItem("color", $("#color").val())
	localStorage.setItem("footer_text", $("#footer_text").val())
	localStorage.setItem("footer_icon_url", $("#footer_icon_url").val())
	localStorage.setItem("author", $("#author").val())
	localStorage.setItem("webhookUrl2", $("#url2").val())
	localStorage.setItem("webhookUrl3", $("#url3").val())
	localStorage.setItem("name3", $("#name3").val())
	localStorage.setItem("avatar3", $("#avatar3").val())
}

function start() {
	getData()
	if (webhookUrl.substr(0, 4) == 'http' && webhookUrl.length !== 0) {
		if (destroy) {
			for (i = 0; i < slider.noUiSlider.get(); i++) {
				if (embed) {
					sendEmbedMessage()
				} else {
					sendMessage()
				}
			}
			deleteWebhook()
			M.toast({
				html: 'Message/s sent',
				classes: 'rounded green'
			});
			M.toast({
				html: 'Webhook deleted',
				classes: 'rounded orange'
			});
		} else {
			for (i = 0; i < slider.noUiSlider.get(); i++) {
				if (embed) {
					sendEmbedMessage()
				} else {
					sendMessage()
				}
				//jkezli 429 to czeka
			}
			M.toast({
				html: 'Message/s sent',
				classes: 'rounded green'
			});
		}
	} else {
		M.toast({
			html: 'Invalid webhook',
			classes: 'rounded red'
		});
	}
}

function getWebhookInfo() {
	webhookUrl2 = $("#url2").val()
	if (webhookUrl2 == "") {
		$("#wInfo1").text(`invalid webhook url`)
		$('#modal1').modal('open');
	} else {
		fetch(webhookUrl2).then((odpowiedzEtap1) => {
			return odpowiedzEtap1.json()
		}).then((odpowiedzEtap2) => {
			obrobkaDanych(odpowiedzEtap2);
		})
		let obrobkaDanych = (dane) => {
			token = dane.token
			id = dane.id
			webhookName = dane.name
			avatar = dane.avatar
			chanell = dane.channel_id
			guild = dane.guild_id
			$("#wInfo1").text(`Token = ${token}`)
			$("#wInfo2").text(`Id = ${id}`)
			$("#wInfo3").text(`webhookName = ${webhookName}`)
			$("#wInfo4").text(`avatar = ${avatar}`)
			$("#wInfo5").text(`chanell = ${chanell}`)
			$("#wInfo6").text(`guild = ${guild}`)
			$('#modal1').modal('open');
		}
	}
}


var accumulator = 0;
var sendingPossible = true;
const timer1Interval = 300;

function sendMessage() {
	if (accumulator == 0) {
		var timer1 = setInterval(() => {
			if (sendingPossible) {
				sendProcedure();
			}
		}, timer1Interval);
	}
	accumulator++;
	console.log(accumulator);

	function sendProcedure() {
		if (accumulator == 0) return;
		var request = new XMLHttpRequest();
		request.open("POST", webhookUrl);

		request.setRequestHeader('Content-type', 'application/json');
		var params = {
			username: username,
			avatar_url: avatar_url,
			content: message,
			tts: tts
		}
		request.send(JSON.stringify(params));
		sendingPossible = false
		request.addEventListener('load', () => {
			sendingPossible = true;
			if (request.status !== 429) {
				accumulator--;
				console.log(accumulator);
				if (accumulator == 0) {
					clearInterval(timer1);
				}
			}
		})
	}
}

function editWebhookInfo() {
	webhookUrl3 = $("#url3").val();
	name3 = $("#name3").val();
	avatar3 = $("#avatar3").val();
	var request = new XMLHttpRequest();
	request.open("PATCH", webhookUrl3);
	request.setRequestHeader('Content-type', 'application/json');
	var params = {
		name: name3,
		avatar: avatar3
	}
	request.send(JSON.stringify(params));
	M.toast({
		html: 'Edited webhook',
		classes: 'rounded green'
	});
}

function sendEmbedMessage() {
	var request = new XMLHttpRequest();
	request.open("POST", webhookUrl);

	request.setRequestHeader('Content-type', 'application/json');

	var myEmbed = {
		author: {
			name: author
		},
		color: hexToDecimal(color),
		title: title,
		description: description,
		tts: tts,
		footer: {
			text: footer_text,
			icon_url: footer_icon_url
		}
	}
	let embed = {
		title: 'Embed title (required)',
		author: {
			name: '',
			url: '',
			icon: ''
		},
		description: '',
		url: '',
		thumb_url: '',
		color: '',
		fields: [{}],
		footer: ''
	};
	var params = {
		username: username,
		embeds: [myEmbed]
	}

	request.send(JSON.stringify(params));
}

function deleteWebhook() {
	var request = new XMLHttpRequest();
	request.open("DELETE", webhookUrl);
	request.setRequestHeader('Content-type', 'application/json');
	request.send();
}





function hexToDecimal(hex) {
	return parseInt(hex.replace("#", ""), 16)
}



function hideHelpInit() {
	$('#modal2').modal('open');
}

function hideHelp() {
	$("#docs").hide(200)
	localStorage.setItem('docs', true)
}

$('.fixed-action-btn').floatingActionButton({
	toolbarEnabled: true,
	hoverEnabled: false
});