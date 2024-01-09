let apiUrl = 'https://localhost:7037/api/';
//let apiUrl = 'https://aktienti-002-site8.htempurl.com/api/';
let auth_token = '';

function validateSession() {
    auth_token = localStorage.getItem('ak-api-token');
    if (auth_token !== null && auth_token !== undefined) {
        $.ajax({
            type: 'GET',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + auth_token);
            },
            url: apiUrl + 'Users/ValidateCurrentUser',
            contentType: 'application/json; utf-8',
            dataType: 'json',
            success: function (response) {
                if (response.succeded) {
                    localStorage.setItem('ak-api-user', JSON.stringify(response.data));
                    validationResult(true);
                } else {
                    localStorage.removeItem('ak-api-token');
                    localStorage.removeItem('ak-api-user');
                    validationResult(false);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                localStorage.removeItem('ak-api-token');
                localStorage.removeItem('ak-api-user');
                validationResult(false);
            }
        });
    } else {
        validationResult(false);
    }
}

function validationResult(isValid) {
    let isLogin = window.location.pathname == '/login';
    if (!isLogin && !isValid) {
        window.location.replace('/login');
    } else if (isLogin && isValid) {
        window.location.replace('inicio');
    }
    if (isValid) {
        let usr = localStorage.getItem('ak-api-user');
        if (usr !== null) {
            aUsr = JSON.parse(usr);
        }
    }
    tokenized = isValid;
}

validateSession();
