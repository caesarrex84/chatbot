let chatResponse; let fails = 0; let oldMessages= [];
let InitialMessage = 'Hola, ¿cómo puedo ayudarte?';
let APIpath = 'https://localhost:7037/api/';
//let APIpath = 'https://aktienti-002-site8.htempurl.com/api/';
let iUser = '<span><i class="fa-solid fa-chalkboard-user"></i></span>';
let iRobot = '<span><i class="fa-solid fa-robot"></i></span>';
let sImage = '<p id="img-chat-loading"><img  class="ak-chat-loading" alt="chat-is-thinking" src="assets/images/loading.gif"/></p>';
let wAnswers = [
	'Preguntame algo para poder ayudarte.',
	'Escribe en el campo <b>Pregunta al Chatbot Aktien TI</b> para poder ayudarte.',
	'Estoy listo para cuando tu lo estés...'];
let restrictedResponse = 'Lo siento, soy un robot y sólo puedo ayudarte con información sobre Aktien Tecnologías de Información.';
let errorResponse = 'Lo lamento, ha ocurrido un error en la comunicación, otro robot se podrá a resolverlo lo antes posible.';

let requestInfoInAdvance = false;
let aditionalQuestions = [];
let ownershipId = 0;
let apiHost = 'www.aktien.mx'; // window.location.host;
let apiKey = 'mEjj4TI7gn6YBpx41ykF4xAzc8SwaAfXE7XRBtVe3jCMeCaWLpGw';
let chatToken = '';
let questionCompletes = false;
let aditionalData = [];
let qMessage = 'Bienvenido al chat de Mubles Placencia, para atenderte mejor te pediremos algunos datos.';

function startakchatbot(){
	setIconTitle(false);
	if(chatToken === '' || chatToken === null) {
		$('#btn-start-chat').html('<i class="fa-solid fa-rotate"></i>');
		$('#btn-start-chat').addClass('animated-icon');
		$.ajax({
			type: 'GET',
			url: APIpath  + 'OwnershipKey/ValidateApiKey/' + apiKey + '/' + apiHost,
			contentType: 'application/json; utf-8',
			dataType: 'json',
			success: function (response) {
				if(response.succeded) {
					ownershipId = response.data.id;
					InitialMessage = response.data.initialMessage;
					requestInfoInAdvance = response.data.requestInfoInAdvance;
					questionCompletes = !requestInfoInAdvance;
					aditionalQuestions = response.data.aditionalQuestions;
					generateChatToken();
				} else {
					$('#btn-start-chat').html('<i class="fa-solid fa-triangle-exclamation"></i>');
					$('#btn-start-chat').removeClass('animated-icon');
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.log(jqXHR);
				$('#btn-start-chat').html('<i class="fa-solid fa-triangle-exclamation"></i>');
				$('#btn-start-chat').removeClass('animated-icon');
			}
		});
	} else {
		$('#btn-start-chat').html('<i class="fa-solid fa-rotate"></i>');
		$('#btn-start-chat').addClass('animated-icon');
		setTimeout(() => {
			$('#btn-start-chat').html('<i class="fa-solid fa-comments"></i>');
			$('#btn-start-chat').removeClass('animated-icon');
			$('#idContainer-pre').slideToggle();
		}, 1000);
	}
}

function newChatConversation(){
	localStorage.removeItem('akbot-chatToken');
	chatToken = '';
	$('#idContainer-pre').slideToggle();
	$('#btn-start-chat').html('<i class="fa-solid fa-rotate"></i>');
	$('#btn-start-chat').addClass('animated-icon');
	startakchatbot();
}

function hidechat(ispre = false){
	$('#idContainer-pre:visible').slideToggle();
	$('#idContainer:visible').slideToggle();
	$('#btn-start-chat').addClass('pulse');
}

function retrieveChatConversation(){
	$('#idContainer-pre').slideToggle();
	$.ajax({
		type: 'GET',
		url: APIpath  + 'ChatSumary/GetMessagesFromToken/' + chatToken,
		contentType: 'application/json; utf-8',
		dataType: 'json',
		success: function (response) {
			if(response.succeded) {
				$.each(response.data.conversation, function (key, R) {
					oldMessages.push({ question: R.label, answer: R.data });
				});
				$('#btn-start-chat').html('<i class="fa-solid fa-comments"></i>');
				$('#btn-start-chat').removeClass('animated-icon');
				$('#idContainer').slideToggle();

				$('#divOutput').html(`<div>${ iRobot } <p>${ InitialMessage }</p></div>`);
				$.each(oldMessages, function (key, R) {
					appendAnswer(`${ iUser } <p> ${ R.question } </p>`, false, "clientAnswer");
					appendAnswer(`${ iRobot } <p> ${ R.answer } </p>`);
				});





				var divOutput = document.querySelector('#divOutput');
				divOutput.scrollTop = divOutput.scrollHeight - divOutput.clientHeight;
			} else {
				localStorage.removeItem('akbot-chatToken');
				chatToken = '';
				setIconTitle(true, 'Iniciar nueva');
				$('#btn-start-chat').html('<i class="fa-solid fa-triangle-exclamation"></i>');
				$('#btn-start-chat').removeClass('animated-icon');
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
			appendAnswer(`${ iRobot } <p> ${ errorResponse } </p>`);
		}
	});
}

function generateChatToken(){
	$.ajax({
		type: 'GET',
		url: APIpath  + 'ChatSumary/CreateChatToken?idPropiedad=' + ownershipId,
		contentType: 'application/json; utf-8',
		dataType: 'json',
		success: function (response) {
			if(response.succeded) {
				chatToken = response.data;
				localStorage.setItem('akbot-chatToken', chatToken)
				$('#idContainer').slideToggle();
				$('#btn-start-chat').html('<i class="fa-solid fa-comments"></i>');
				$('#btn-start-chat').removeClass('animated-icon');
				if(requestInfoInAdvance){
					questionCompletes = false;
					$.each(aditionalQuestions, function (key, R) {
						aditionalData.push({ label: R, data: '' });
					});
					oldMessages= [];
					$('#divOutput').html(`<div>${ iRobot }<p>${ qMessage }</p></div>`);
					requestInfoLoop();
				} else {
					resetChat();
				}
			} else {
				$('#btn-start-chat').html('<i class="fa-solid fa-triangle-exclamation"></i>');
				$('#btn-start-chat').removeClass('animated-icon');
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
			appendAnswer(`${ iRobot } <p> ${ errorResponse } </p>`);
		}
	});
}

function requestInfoLoop(){
	for(let i in aditionalData){
		let q = aditionalData[i];
		if(q.data == ''){
			appendAnswer(`${ iRobot } <p> ${ q.label } </p>`);
			return;
		}
	}
	questionCompletes = true;
	appendAnswer(`${ iRobot } <p>${ InitialMessage }</p>`);
	var req = {
		chatToken: chatToken,
        aditionalData : aditionalData
    };
	$.ajax({
		type: 'POST',
		url: APIpath  + 'ChatSumary/SaveChatData',
		data: JSON.stringify(req),
		contentType: 'application/json; utf-8',
		dataType: 'json',
		success: function (response) {
			if(!response.succeded) {
				console.log(response);
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
			appendAnswer(`${ iRobot } <p> ${ errorResponse } </p>`);
		}
	});
}

function askChatbot() {
	if(questionCompletes){
		let sQuestion = $('#txtMsg').val();
		if (sQuestion !== '') {
			appendAnswer(`${ iUser } <p> ${ sQuestion } </p>`, false, "clientAnswer");
			appendAnswer(`${ iRobot } ${ sImage }`);
			$('#txtMsg').val('');
			moderation(sQuestion);
		} else {
			fails++;
			switch(fails){
				case 1:
					appendAnswer(`${ iRobot } ${ sImage }`);
					setTimeout(() => { appendAnswer(wAnswers[0], true); }, 1000);
				break;
				case 2:
					appendAnswer(`${ iRobot } ${ sImage }`);
					setTimeout(() => { appendAnswer(wAnswers[1], true); }, 1000);
				break;
				case 3:
					appendAnswer(`${ iRobot } ${ sImage }`);
					setTimeout(() => { appendAnswer(wAnswers[2], true); }, 1000);
				break;
			}
			return false;
		}
		return false;
	} else {
		let sAnswer = $('#txtMsg').val();
		if (sAnswer === ''){
			appendAnswer(`${ iRobot } <p>Lo siento, no he podido entender tu respuesta.</p>`);
			requestInfoLoop();
		} else{
			for(let i in aditionalData){
				let q = aditionalData[i];
				if(q.data == ''){
					aditionalData[i].data = sAnswer;
					appendAnswer(`${ iUser } <p> ${ sAnswer } </p>`, false, "clientAnswer");
					$('#txtMsg').val('');
					break;
				}
			}
			requestInfoLoop();
		}
	}
}

function moderation(question){
	var req = {
		chatToken: chatToken,
        prompt : question
    };
	$.ajax({
		type: 'POST',
		url: APIpath  + 'OpenAI/Moderation',
		data: JSON.stringify(req),
		contentType: 'application/json; utf-8',
		dataType: 'json',
		success: function (response) {
			if(response.succeded) {
				chat(question);
			} else {
				setTimeout(() => {
					if(response.message !== ''){
						appendAnswer(response.message, true);
					} else {
						appendAnswer(restrictedResponse, true);
					}
				}, "1000");
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
			appendAnswer(`${ iRobot } <p> ${ errorResponse } </p>`);
		}
	});
}

function chat(question){
	var req = {
		chatToken: chatToken,
        prompt : question,
		oldMessages: oldMessages
    };
	$.ajax({
		type: 'POST',
		url: APIpath  + 'OpenAI/Chat',
		data: JSON.stringify(req),
		contentType: 'application/json; utf-8',
		dataType: 'json',
		success: function (response) {
			if(response.succeded) {
				oldMessages.push({question: question, answer: response.data})
				appendAnswer(response.data, true);
			} else {
				if(response.message !== ''){
					appendAnswer(`${ iRobot } <p> ${ response.message } </p>`);
				} else {
					appendAnswer(`${ iRobot } <p> ${ restrictedResponse } </p>`);
				}
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
			appendAnswer(`${ iRobot } <p> ${ errorResponse } </p>`);
		}
	});
}

function appendAnswer(text, botanswer = false, ccss){
	if(ccss === undefined) {ccss = ''}

	if(botanswer){
		$('#img-chat-loading').html(text);
		$('#img-chat-loading').removeAttr('id');
	} else {
		$('#divOutput').append(`<div class="${ccss}"> ${ text } </div>`);
	}
	var divOutput = document.querySelector('#divOutput');
	divOutput.scrollTop = divOutput.scrollHeight - divOutput.clientHeight;
}

function resetChat(){
	oldMessages= [];
	$('#divOutput').html(`<div>${ iRobot } <p>${ InitialMessage }</p></div>`);
}

function setIconTitle(show = true, title = 'Iniciar chat'){
	if(title === '') { title = 'Iniciar chat';}
	if(show){
		$('#btn-start-chat').attr("title", title);
		$('#btn-start-chat').addClass('pulse');
	} else {
		$('#btn-start-chat').removeClass('pulse');
	}
}

$( document ).ready(function() {
	chatToken = localStorage.getItem('akbot-chatToken');
	$('.headerdivcontainer').html(htmlHeader());
    $('#divOutput').html(`<div>${ iRobot } <p>${ InitialMessage }</p></div>`);
	$('#txtMsg').keypress(function (e) {
		var keycode = (e.keyCode ? e.keyCode : e.which);
		if (keycode == '13') {
			askChatbot();
		}
	});
});

const htmlHeader = () => (`

<div class="headerdiv">
	<div class="header-powered">
		<p>Al utilizar chatBot by Aktien TI aceptas los términos y condiciones de nuestro <a href="https://aktien.mx/aviso-de-privacidad/" target="_blank">Aviso de privacidad</a>.</p>
	</div>
	<div class="header-corporativo">
		<div class="header-aktienti">
			<img src="assets/images/Chat/Logotipo-Aktien-Gray.svg"/>
		</div>
		<div class="header-chatgpt">
			<img src="assets/images/Chat/Logotipo-chatGPT-gray.svg"/>
		</div>
	</div>
</div>

`)
