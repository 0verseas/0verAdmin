var login = (function () {
	// 引入 reCAPTCHA 的 JS 檔案
    var s = document.createElement('script');
    let src = 'https://www.google.com/recaptcha/api.js?render=' + env.reCAPTCHA_site_key;
    s.setAttribute('src', src);
    document.body.appendChild(s);

    /**
     * cache DOM
     */

    const $username = $('#username');
    const $password = $('#password');
    const $loginBtn = $('#btn-login');
    const $errMsg = $('#errMsg');

    /**
     * bind event
     */

    $loginBtn.on('click', _login);
    $password.on('keydown', _login);

    /**
	*	init
	*/

    // 登入：
    // 200: 跳轉至 /school
    // 401: 顯示錯誤訊息
    function _login(e) {
        if (e.type == 'keydown' && e.keyCode != 13) {
            return;
        }

        const username = $username.val();
        const password = $password.val();

        if (!username || !password) {
            return;
        }

        const loginForm = {
            username: username,
            password: sha256(password),
			google_recaptcha_token: ''
        };

		grecaptcha.ready(function() {
            grecaptcha.execute(env.reCAPTCHA_site_key, {
              action: 'AdminLogin'
            }).then(function(token) {
                // token = document.getElementById('btn-login').value
                loginForm.google_recaptcha_token=token;
            }).then(function(){
				User.login(loginForm).then(function(res) {
					if(res.ok) {
						return res.json();
					} else {
						throw res.status;
					}
				}).then(function(json) {
					// console.log(json);
					window.location.href = './schoolEditorInfo.html'
				}).catch(function(err) {
					if (err == 401) {
						$errMsg.finish().show().text('帳號密碼錯誤。').fadeOut(1500);
					} else if(err == 429){  // 429 Too Many Requests
						$errMsg.finish().show().text('錯誤次數太多，請稍後再試。').fadeOut(5000);
					} else if(err == 403){  // 403 Google reCaptcha Failed
						$errMsg.finish().show().text('Google reCaptcha Failed。').fadeOut(5000);
					}
				})
			});
        });
    }
})();
