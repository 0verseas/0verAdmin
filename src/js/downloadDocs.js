(() => {

	/**
	*	cache DOM
	*/

	const $memo = $('#memo');

	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

	async function _init() {
		student.getStudentPersonalData()
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					throw res;
				}
			})
			.then((data) => {
				if(data.student_personal_data.resident_location === '113'){
					$('#alert-hk-order').show();
				}
			})

		student.getStudentRegistrationProgress()
		.then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				throw res;
			}
		})
		.then((data) => {
			//console.log("comeoutttttttttt",data.student_qualification_verify);
			//console.log("system",data.student_qualification_verify.system_id)
			//console.log("identity",data.student_qualification_verify.identity)
			if ((data.student_qualification_verify.system_id === 1 || data.student_qualification_verify.system_id === 2)
				&& (data.student_misc_data.admission_placement_apply_way === 6 || data.student_misc_data.admission_placement_apply_way === 16)) { // 參加澳門學科測驗
				$('#alert-cost').show();
				$('.alert-downloadMoFile').show();
			}
			if ( (data.student_qualification_verify.system_id === 3 || data.student_qualification_verify.system_id === 4) &&
				data.student_qualification_verify.identity > 3) {
				$memo.html("請在期限內列印並繳交或郵寄至海外聯合招生委員會。");
			} else {
				$memo.html("請在期限內列印並繳交至駐外機構。");
			}
		})
		.then(() => {
			$('#btn-smart').attr('href', env.baseUrl + '/students/print-admission-paper');
			loading.complete();
		})
		.catch((err) => {
			if (err.status && err.status === 401) {
				alert('請登入。');
				location.href = "./index.html";
			} else {
				err.json && err.json().then((data) => {
					console.error(data);
					alert(`ERROR: \n${data.messages[0]}`);
				})
			}
			loading.complete();
		});
	}

})();
