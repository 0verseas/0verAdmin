(() => {
	/**
	*	cache DOM
	*/
	const $HK_MacaoNum = $('#HK_MacaoNum');
	const $otherNum = $('#otherNum');
	const $email = $('#email');
	const $pass = $('#password');
	const $loginBtn = $('#btn-login');

	/**
	*	init
	*/

	_init();
	
	/**
	*	bind event
	*/
	$loginBtn.on('click', _handleLogin);
	$pass.keyup((e) => { e.keyCode == 13 && _handleLogin(); });

	/**
	*	event handlet
	*/

	async function _init() {
		try {
		const response = await student.getAdmissionCount();
		if (!response.ok) { throw response; }
		const admissionCount = await response.json();
		$HK_MacaoNum.text(admissionCount.HK_Macao);
		$otherNum.text(admissionCount.other);

		} catch (e) {
			console.log(e);
		}
		loading.complete();
	}

	function _handleLogin() {
		const email = $email.val();
		const pass = $pass.val();

		const loginData = {
			email: email,
			password: sha256(pass)
		}

		loading.start();
		student.login(loginData)
		.then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				throw res.status;
			}
		})
		.then((json) => {
			console.log(json);
			if( typeof(json.student_qualification_verify) === 'undefined')
				location.href = './systemChoose.html';

			if( (json.student_qualification_verify.identity=== 6 &&
					json.student_misc_data.join_admission_selection=== 1 &&
					json.student_misc_data.confirmed_at !=null &&
					json.can_admission_placement == true) ||
				(json.student_qualification_verify.identity === 7 &&
					json.student_misc_data.confirmed_at != null &&
					json.student_misc_data.confirmed_placement_at === null) ||
				(json.student_misc_data.admission_placement_apply_way_data.code == "23" &&
					json.student_misc_data.confirmed_at != null &&
					json.student_misc_data.confirmed_placement_at === null) ){
				location.href = './placementSelection.html';
			}
			else if (!!json.student_misc_data.confirmed_at) {
				location.href = './downloadDocs.html';
			}
			else {
				location.href = './systemChoose.html';
			}
			loading.complete();
		})
		.catch((err) => {
			err === 401 && alert('帳號或密碼輸入錯誤。');
			loading.complete();
		})
	}

})();
