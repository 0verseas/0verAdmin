(() => {

	/**
	*	cache DOM
	*/

	const $primarySchoolName = $('#primarySchoolName');
	const $primarySchoolAdmissionsAt = $('#primarySchoolAdmissionsAt');
	const $primarySchoolGraduatedAt = $('#primarySchoolGraduatedAt');
	const $highSchool1to3Name = $('#highSchool1to3Name');
	const $highSchool1to3AdmissionsAt = $('#highSchool1to3AdmissionsAt');
	const $highSchool1to3GraduatedAt = $('#highSchool1to3GraduatedAt');
	const $highSchool4to5Name = $('#highSchool4to5Name');
	const $highSchool4to5AdmissionsAt = $('#highSchool4to5AdmissionsAt');
	const $highSchool4to5GraduatedAt = $('#highSchool4to5GraduatedAt');
	const $highSchool6Name = $('#highSchool6Name');
	const $highSchool6AdmissionsAt = $('#highSchool6AdmissionsAt');
	const $highSchool6GraduatedAt = $('#highSchool6GraduatedAt');
	const $transfer = $('#transfer');
	const $saveBtn = $('#btn-save');

	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

	$saveBtn.on('click', _handleSave);

	function _init() {
		student.getStudentEducationInfoData()
		.then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				throw res;
			}
		})
		.then((json) => {
			console.log(json);
			_initForm(json.student_education_background_data);
		})
		.then(() => {
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
		})
	}

	function _initForm(data) {
		$primarySchoolName.val(data.primary_school_name);
		$primarySchoolAdmissionsAt.val(data.primary_school_admissions_at);
		$primarySchoolGraduatedAt.val(data.primary_school_graduated_at);
		$highSchool1to3Name.val(data.high_school_1to3_name);
		$highSchool1to3AdmissionsAt.val(data.high_school_1to3_admissions_at);
		$highSchool1to3GraduatedAt.val(data.high_school_1to3_graduated_at);
		$highSchool4to5Name.val(data.high_school_4to5_name);
		$highSchool4to5AdmissionsAt.val(data.high_school_4to5_admissions_at);
		$highSchool4to5GraduatedAt.val(data.high_school_4to5_graduated_at);
		$highSchool6Name.val(data.high_school_6_name);
		$highSchool6AdmissionsAt.val(data.high_school_6_admissions_at);
		$highSchool6GraduatedAt.val(data.high_school_6_graduated_at);
		$transfer.val(data.transfer);
	}

	function _handleSave() {
		let sendData = {};
		if (sendData = _validateForm()) {
			console.log(sendData);
			loading.start();
			student.setStudentEducationInfoData(sendData)
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					throw res;
				}
			})
			.then((json) => {
				alert("儲存成功");
				window.location.reload();
				loading.complete();
			})
			.catch((err) => {
				err.json && err.json().then((data) => {
					console.error(data);
					alert(`ERROR: \n${data.messages[0]}`);
				})
				loading.complete();
			})
		} else {
			alert("填寫格式錯誤，請檢查表單。");
			console.log('wrong');
		}
	}

	// 驗證是否有值
	function _validateNotEmpty(obj) {
		let _checkValue = (obj.value) ? obj.value : obj.el.val();
		return _checkValue !== "";
	}

	// 驗證 Email 格式是否正確
	function _validateEmail(obj) {
		let _checkValue = (obj.value) ? obj.value : obj.el.val();
		if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(_checkValue)) {
			return false;
		} else {
			return true;
		}
	}

	// 驗證日期
	function _validateDate(obj) {
		return true;
	}

	function _getDBData(obj) {
		let _sendValue = "";
		if (obj.dbData) {
			_sendValue = obj.dbData;
		} else if (obj.value) {
			_sendValue = obj.value;
		} else {
			_sendValue = obj.el.val();
		}
		return _sendValue;
	}

	function _validateForm() {
		/**
		*	formValidateList: 格式設定表，由此表決定如何驗證表單，並產出要送給後端的 json object。
		*	el: DOM 元素。
		*	require: 是否為必填。
		*	type: 輸出值的格式，之後會驗證是否符合該格式。
		*	value: 預設取值方式為 el.val()，如果有特殊需求(像是 radio 要用 class name 取值)，則填寫在 value 中。
		*	dbKey: 資料送往後端的 key，不需送出則不填。
		*	dbData: 送往後端的資料，預設為 value，其次為 el.val()。如果有特殊需求（像是電話要和國碼合併），則填寫在 dbData 中。
		*/
		let formValidateList = [
		{
			el: $primarySchoolName,
			require: true,
			type: 'string',
			dbKey: 'primary_school_name'
		},
		{
			el: $primarySchoolAdmissionsAt,
			require: true,
			type: 'date',
			dbKey: 'primary_school_admissions_at'
		},
		{
			el: $primarySchoolGraduatedAt,
			require: true,
			type: 'date',
			dbKey: 'primary_school_graduated_at'
		},
		{
			el: $highSchool1to3Name,
			require: true,
			type: 'string',
			dbKey: 'high_school_1to3_name'
		},
		{
			el: $highSchool1to3AdmissionsAt,
			require: true,
			type: 'date',
			dbKey: 'high_school_1to3_admissions_at'
		},
		{
			el: $highSchool1to3GraduatedAt,
			require: true,
			type: 'date',
			dbKey: 'high_school_1to3_graduated_at'
		},
		{
			el: $highSchool4to5Name,
			require: true,
			type: 'string',
			dbKey: 'high_school_4to5_name'
		},
		{
			el: $highSchool4to5AdmissionsAt,
			require: true,
			type: 'date',
			dbKey: 'high_school_4to5_admissions_at'
		},
		{
			el: $highSchool4to5GraduatedAt,
			require: true,
			type: 'date',
			dbKey: 'high_school_4to5_graduated_at'
		},
		{
			el: $highSchool6Name,
			require: true,
			type: 'string',
			dbKey: 'high_school_6_name'
		},
		{
			el: $highSchool6AdmissionsAt,
			require: true,
			type: 'date',
			dbKey: 'high_school_6_admissions_at'
		},
		{
			el: $highSchool6GraduatedAt,
			require: true,
			type: 'date',
			dbKey: 'high_school_6_graduated_at'
		},
		{
			el: $transfer,
			require: false,
			type: 'string',
			dbKey: 'transfer'
		}]

		let _correct = true; // 格式正確
		let sendData = {}; // 送給後端的

		formValidateList.forEach((obj, index) => {
			if (obj.require) {
				if (_validateNotEmpty(obj)) {
					switch(obj.type) {
						case 'email':
						if (_validateEmail(obj)) {
							if (obj.dbKey) sendData[obj.dbKey] = _getDBData(obj);
							obj.el.removeClass('invalidInput');
						} else {
							_correct = false;
							obj.el.addClass('invalidInput');
						}
						break;
						case 'date':
						if (_validateDate(obj)) {
							if (obj.dbKey) sendData[obj.dbKey] = _getDBData(obj);
							obj.el.removeClass('invalidInput');
						} else {
							_correct = false;
							obj.el.addClass('invalidInput');
						}
						break;
						default:
						if (obj.dbKey) sendData[obj.dbKey] = _getDBData(obj);
						obj.el.removeClass('invalidInput');
					}
				} else {
					_correct = false;
					obj.el.addClass('invalidInput');
				}
			} else {
				if (_validateNotEmpty(obj)) {
					switch(obj.type) {
						case 'email':
						if (_validateEmail(obj)) {
							if (obj.dbKey) sendData[obj.dbKey] = _getDBData(obj);
							obj.el.removeClass('invalidInput');
						} else {
							_correct = false;
							obj.el.addClass('invalidInput');
						}
						break;
						case 'date':
						if (_validateDate(obj)) {
							if (obj.dbKey) sendData[obj.dbKey] = _getDBData(obj);
							obj.el.removeClass('invalidInput');
						} else {
							_correct = false;
							obj.el.addClass('invalidInput');
						}
						break;
						default:
						if (obj.dbKey) sendData[obj.dbKey] = _getDBData(obj);
						obj.el.removeClass('invalidInput');
					}
				} else {
					if (obj.dbKey) sendData[obj.dbKey] = _getDBData(obj);
					obj.el.removeClass('invalidInput');
				}
			}
		})

		if (_correct) {
			return sendData;
		} else {
			console.log('==== validate failed ====');
			console.log(sendData);
			console.log("=========================");
			return false;
		}
	}

})();
