el = document.getElementById("btnGetLight")
el.addEventListener('click', onClick)

function showResult(res) {
    window.location.href = res.url
    // res.redirect(res.url)
}

function onClick(e) {
    e.preventDefault();
    grecaptcha.ready(function() {
        grecaptcha.execute('6LfYNG8aAAAAAFi1diblxolGLu9Qd0AhY9VEfs3H', {action: 'click'}).then(function(token) {
            console.log(token)

            var data = {
                hello: 'hhere',
                token: token
            };

            fetch('/new', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'post',
                redirect: 'follow',
                body: JSON.stringify(data)
            })
                .then(response => {
                    // HTTP 301 response
                    // HOW CAN I FOLLOW THE HTTP REDIRECT RESPONSE?
                    if (response.redirected) {
                        window.location.href = response.url;
                    }
                })
                .catch(function(err) {
                    console.info(err + " url: " + url);
                });
        });
    });
}
