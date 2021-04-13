document.getElementById("btnGetLight").addEventListener('click', onClick)

function showResult(res) {
    window.location.href = res.url
    // res.redirect(res.url)
}

function onClick(e) {
    e.preventDefault();
    grecaptcha.ready(function() {
        grecaptcha.execute(API_KEY, {action: 'click'}).then(function(token) {
            // console.log(token)

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
