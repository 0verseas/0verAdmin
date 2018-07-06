(() => {

	/**
	*	private variable
	*/

	let _passValid = false;

	/**
	*	cache DOM
	*/

	const $resetPassword = $('#input-resetPassword');
	const $resetPasswordConfirm = $('#input-resetPasswordConfirm');
	const $resetPasswordSubmitBtn = $('#btn-resetPasswordSubmit');
	
	const $passwordWarning = $('#password-warning');

	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

	$resetPassword.on('blur', _checkPassword);
	$resetPasswordConfirm.on('blur', _checkPassword);
	$resetPasswordConfirm.keyup((e) => { e.keyCode == 13 && _handleSubmit(); });
	$resetPasswordSubmitBtn.on('click', _handleSubmit);

	function _init() {
		const email = _getParameterByName('email');
		const token = _getParameterByName('token');

		student.checkResetPasswordToken(email, token)
		.then((res) => {
			if (!res.ok) {
				throw res;
				console.log('2');
			}
		})
		.then(() => {
			loading.complete();
		})
		.catch((err) => {
			err.json && err.json().then((data) => {
				console.log(data.messages[0]);
				alert('您並無重設密碼之請求。');
				location.href="./index.html";
			})
			loading.complete();
		})
	}

	function _getParameterByName(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2]);
	}

	function _checkPassword() {
		const oriPass = $resetPassword.val();
		const passConfirm = $resetPasswordConfirm.val();

		// 判斷密碼長度
		if (oriPass.length >= 6) {
			$resetPassword.removeClass('invalidInput');
			$passwordWarning.hide();
			_passValid = true;
		} else {
			$resetPassword.addClass('invalidInput');
			$passwordWarning.show();
			_passValid = false;
		}

		// 判斷確認密碼長度與以及是否與密碼相同
		if ((passConfirm.length >= 6) && (passConfirm === oriPass)) {
			$resetPasswordConfirm.removeClass('invalidInput');
			_passValid = true;
		} else {
			$resetPasswordConfirm.addClass('invalidInput');
			_passValid = false;
		}
	}

	function _handleSubmit() {
		const email = _getParameterByName('email');
		const token = _getParameterByName('token');
		const oriPass = $resetPassword.val();
		const passConfirm = $resetPasswordConfirm.val();

		if (!_passValid) {
			alert('密碼格式錯誤，或「確認密碼」與「密碼」內容不符。');
			return;
		}

		const data = {
			email,
			token,
			password: sha256(oriPass),
			password_confirmation: sha256(passConfirm)
		}
		loading.start();
		student.resetPassword(data, email)
		.then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				throw res;
			}
		})
		.then((json) => {
			alert("密碼重設成功，請重新登入。");
			location.href="./index.html";
			loading.complete();
		})
		.catch((err) => {
			err.json && err.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);
			})
			loading.complete();
		});
	}

})();
