(() => {
	/**
	* private variable
	*/
	let _identity = 1;
	let _typeOfKangAo = 1;
	const _systemID = _getParam('systemid', window.location.href);
	let _savedIdentity = null;
	let _savedSystem = null;
	let _countryList = [];

	/**
	* init
	*/
	function _init() {
		// validate system id
		if (+_systemID !== 3 &&
			+_systemID !== 4) {
			alert('選取之學制有誤');
			window.location.replace('./systemChoose.html');
		} else {
			$('.systemID').text(+_systemID === 3 ? '碩士班' : '博士班');
		}

		// set Continent & Country select option
		student.getCountryList().then((data) => {
			_countryList = data;
			$passportContinentSelect.empty();
			$passportContinentSelect.append('<option value="-1">洲別</option>');
			data.forEach((val, i) => {
				$passportContinentSelect.append(`<option value="${i}">${val.continent}</option>`);
			});

			$passportCountrySelect.append('<option value="-1">國家</option>');
			// $passportCountrySelect.empty();
			// data[0].country.forEach((val, i) => {
			// 	$passportCountrySelect.append(`<option value="${val.id}">${val.country}</option>`);
			// });	
		});

		// get data
		student.getVerifyQualification().then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				throw res;
			}
		})
		.then((json) => {
			console.log(json);
			if (json && json.student_qualification_verify && json.student_qualification_verify.identity) {
				_savedIdentity = json.student_qualification_verify.identity;
				if (json.student_qualification_verify.system_data && json.student_qualification_verify.system_data.id) {
					_savedSystem = json.student_qualification_verify.system_data.id;
				}

				+json.student_qualification_verify.system_id === +_systemID && _setData(json.student_qualification_verify);
			}
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
		});
	}

	/**
	* cache dom
	*/
	const $signUpForm = $('#form-signUp');
	const $identityRadio = $signUpForm.find('.radio-identity');
	const $saveBtn = $signUpForm.find('.btn-save');

	// 在台僑生、在台港澳生
	const $taiwanUniversityRadio = $signUpForm.find('.radio-taiwanUniversity');
	const $applyPeerRadio = $signUpForm.find('.radio-applyPeer');
	const $applyPeerYearInput = $signUpForm.find('.input-applyPeerYear');
	const $applyPeerStatusPadio = $signUpForm.find('.radio-applyPeerStatus');
	// 海外僑生
	const $isDistribution = $signUpForm.find('.isDistribution');
	const $distributionMoreQuestion = $signUpForm.find('.distributionMoreQuestion');
	const $stayLimitRadio = $signUpForm.find('.radio-stayLimit');
	const $hasBeenTaiwanRadio = $signUpForm.find('.radio-hasBeenTaiwan');
	const $whyHasBeenTaiwanRadio = $signUpForm.find('.radio-whyHasBeenTaiwan');
	// 港澳生
	const $idCardRadio = $signUpForm.find('.radio-idCard');
	const $holdpassportRadio = $signUpForm.find('.radio-holdpassport');
	const $taiwanHousehold = $signUpForm.find('.radio-taiwanHousehold');
	const $portugalPassportRadio = $signUpForm.find('.radio-portugalPassport');
	const $portugalPassportTime = $signUpForm.find('.input-portugalPassportTime');
	const $passportContinentSelect = $signUpForm.find('.select-passportContinent');
	const $passportCountrySelect = $signUpForm.find('.select-passportCountry');
	const $KA_isDistributionRadio = $signUpForm.find('.question.kangAo .kangAo_radio-isDistribution');
	const $KA_distributionMoreQuestion = $signUpForm.find('.question.kangAo .kangAo_distributionMoreQuestion');
	const $KA_stayLimitRadio = $signUpForm.find('.question.kangAo .kangAo_radio-stayLimit');
	const $KA_hasBeenTaiwanRadio = $signUpForm.find('.question.kangAo .kangAo_radio-hasBeenTaiwan');
	const $KA1_whyHasBeenTaiwan = $signUpForm.find('.question.kangAo .kangAoType1_radio-whyHasBeenTaiwan');
	const $KA2_whyHasBeenTaiwan = $signUpForm.find('.question.kangAo .kangAoType2_radio-whyHasBeenTaiwan');

	/**
	* bind event
	*/
	$identityRadio.on('change', _handleChangeIdentity);
	$saveBtn.on('click', _handleSave);
	$taiwanUniversityRadio.on('change', _checkTaiwanUniversity);
	$applyPeerRadio.on('change', _checkApplyPeer);
	$applyPeerYearInput.on('blur', _checkApplyPeerYear);
	$applyPeerStatusPadio.on('change', _checkApplyPeerStatus);
	$isDistribution.on('change', _switchShowDistribution);
	$distributionMoreQuestion.on('change', _checkDistributionValidation);
	$stayLimitRadio.on('change', _checkStayLimitValidation);
	$hasBeenTaiwanRadio.on('change', _checkHasBeenTaiwanValidation);
	$whyHasBeenTaiwanRadio.on('change', _checkWhyHasBeenTaiwanValidation);
	$idCardRadio.on('change', _cehckIdCardValidation);
	$holdpassportRadio.on('change', _checkHoldpassport);
	$taiwanHousehold.on('change', _checkTaiwanHousehold);
	$portugalPassportRadio.on('change', _checkPortugalPassport);
	$portugalPassportTime.on('change', _checkPortugalPassportTime);
	$passportContinentSelect.on('change', _setCountryOption);
	$KA_isDistributionRadio.on('change', _handleKAIsDistribution);
	$KA_distributionMoreQuestion.on('change', _checkKADistributionValidation);
	$KA_stayLimitRadio.on('change', _checkKAStayLimitValidation);
	$KA_hasBeenTaiwanRadio.on('change', _checkKAHasBeenTaiwanValidation);
	$KA1_whyHasBeenTaiwan.on('change', _checkKA1WhyHasBeenTaiwanValidation);
	$KA2_whyHasBeenTaiwan.on('change', _checkKA2WhyHasBeenTaiwanValidation);

	/**
	* event handler
	*/
	function _handleChangeIdentity() {
		const identity = _identity = +$(this).val();
		$signUpForm.find('.question').hide();
		switch (identity) {
			case 1:
			case 2:
				_setTypeOfKangAo(1);
				$signUpForm.find('.question.kangAo').fadeIn()[0].reset();
				$signUpForm.find('.question.kangAo .hide').hide();
				break;
			case 3:
				$signUpForm.find('.question.overseas').fadeIn()[0].reset();
				$signUpForm.find('.question.overseas input[type=radio]:checked').trigger('change');
				break;
			case 4:
			case 5:
				$signUpForm.find('.question.inTaiwan').fadeIn()[0].reset();
				$signUpForm.find('.question.inTaiwan input[type=radio]:checked').trigger('change');
				break;
		}
	}

	// 儲存
	function _handleSave() {
		console.log(_identity);
		if (_identity < 3) {
			// 港澳生
			const idCard = +$signUpForm.find('.radio-idCard:checked').val();
			const holdpassport = +$signUpForm.find('.radio-holdpassport:checked').val();
			const taiwanHousehold = +$signUpForm.find('.radio-taiwanHousehold:checked').val();
			const portugalPassport = +$signUpForm.find('.radio-portugalPassport:checked').val();
			const portugalPassportTime = $signUpForm.find('.input-portugalPassportTime').val();
			const passportCountry = $passportCountrySelect.val();
			const isDistribution = +$signUpForm.find('.kangAo_radio-isDistribution:checked').val();
			const distributionTime = $signUpForm.find('.kangAo_input-distributionTime').val();
			const distributionOption = +$signUpForm.find('.kangAo_distributionMoreQuestion:checked').val();
			const stayLimitOption = +$signUpForm.find('.kangAo_radio-stayLimit:checked').val();
			const hasBeenTaiwan = +$signUpForm.find('.kangAo_radio-hasBeenTaiwan:checked').val();
			const KA1_whyHasBeenTaiwan = +$signUpForm.find('.kangAoType1_radio-whyHasBeenTaiwan:checked').val();
			const KA2_whyHasBeenTaiwan = +$signUpForm.find('.kangAoType2_radio-whyHasBeenTaiwan:checked').val();
			if (!idCard) return alert('未擁有香港或澳門永久性居民身分證');
			if (!!isDistribution && distributionTime === '') return alert('未填寫分發來台年');
			if (!!isDistribution && distributionOption > 2) return alert('分發來台選項不具報名資格')
			if (stayLimitOption === 1) return alert('海外居留年限選項不具報名資格');
			if (_typeOfKangAo === null) return alert('請確保上方問題皆已選填');
			if (!!hasBeenTaiwan && _typeOfKangAo === 1 && KA1_whyHasBeenTaiwan === 11) return alert('在台停留選項不具報名資格');
			if (!!hasBeenTaiwan && _typeOfKangAo === 2 && KA2_whyHasBeenTaiwan === 8) return alert('在台停留選項不具報名資格');
			if (!!holdpassport && !portugalPassport && +passportCountry === -1) return alert('護照之國家未選填');

			console.log(`請問您是否擁有香港或澳門永久性居民身分證？ ${!!idCard}`);
			console.log(`是否另持有「香港護照或英國國民（海外）護照」以外之旅行證照，或持有澳門護照以外之旅行證照？ ${!!holdpassport}`);
			console.log(`是否曾在臺設有戶籍？ ${!!taiwanHousehold}`);
			console.log(`是否持有葡萄牙護照？ ${!!portugalPassport}`);
			console.log(`於何時首次取得葡萄牙護照？ ${portugalPassportTime}`);
			console.log(`您持有哪一個國家之護照？ ${passportCountry}`);
			console.log(`曾分發來臺 ${!!isDistribution}`);
			console.log(`西元幾年分發來台？ ${distributionTime}`);
			console.log(`並請就下列選項擇一勾選 ${distributionOption}`);
			console.log(`海外居留年限 ${stayLimitOption}`);
			console.log(`報名截止日往前推算僑居地居留期間內，是否曾在某一年來臺停留超過 120 天？ ${!!hasBeenTaiwan}`);
			console.log(`請就下列選項，擇一勾選，並檢附證明文件：{{type 1}} ${KA1_whyHasBeenTaiwan}`);
			console.log(`請就下列選項，擇一勾選，並檢附證明文件：{{type 2}} ${KA2_whyHasBeenTaiwan}`);
			if ((_savedSystem !== null && _savedIdentity !== null) &&
				(+_savedSystem !== +_systemID || +_savedIdentity !== +_typeOfKangAo)) {
				if(!confirm('若要更換身份別，將重填所有資料，是否確定？')) {
					return;
				}
			}

			loading.start();
			student.verifyQualification({
				system_id: _systemID,
				identity: _typeOfKangAo,
				HK_Macao_permanent_residency: !!idCard,
				except_HK_Macao_passport: !!holdpassport,
				taiwan_census: !!taiwanHousehold,
				portugal_passport: !!portugalPassport,
				first_get_portugal_passport_at: portugalPassportTime,
				which_nation_passport: passportCountry,
				has_come_to_taiwan: !!isDistribution,
				come_to_taiwan_at: distributionTime,
				reason_selection_of_come_to_taiwan: distributionOption,
				overseas_residence_time: stayLimitOption,
				stay_over_120_days_in_taiwan: !!hasBeenTaiwan,
				reason_selection_of_stay_over_120_days_in_taiwan: _typeOfKangAo === 1 ? KA1_whyHasBeenTaiwan : KA2_whyHasBeenTaiwan,
				force_update: true
			})
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					throw res;
				}
			})
			.then((json) => {
				console.log(json);
				window.location.href = './personalInfo.html';
				loading.complete();
			})
			.catch((err) => {
				err.json && err.json().then((data) => {
					console.error(data);
					alert(`ERROR: \n${data.messages[0]}`);
				})
				loading.complete();
			});
		} else if (_identity === 3) {
			// 海外僑生
			const isDistribution = +$signUpForm.find('.isDistribution:checked').val();
			const distributionTime = $signUpForm.find('.input-distributionTime').val();
			const distributionOption = +$signUpForm.find('.distributionMoreQuestion:checked').val();
			const stayLimitOption = +$signUpForm.find('.radio-stayLimit:checked').val();
			const hasBeenTaiwan = +$signUpForm.find('.radio-hasBeenTaiwan:checked').val();
			const whyHasBeenTaiwan = +$signUpForm.find('.radio-whyHasBeenTaiwan:checked').val();
			const invalidDistributionOption = [3, 4, 5, 6];
			if (!!isDistribution && invalidDistributionOption.includes(distributionOption)) return alert('分發來台選項不具報名資格');
			if (!!isDistribution && distributionTime === '') return alert('未填寫分發來台年');
			if (stayLimitOption === 1) return alert('海外居留年限選項不具報名資格');
			if (!!hasBeenTaiwan && whyHasBeenTaiwan === 8) return alert('在台停留選項不具報名資格');

			console.log(`是否曾經分發來臺就學過？ ${!!isDistribution}`);
			console.log(`曾分發來臺於西元幾年分發來台？ ${distributionTime}`);
			console.log(`曾分發來臺請就下列選項擇一勾選 ${distributionOption}`);
			console.log(`海外居留年限 ${stayLimitOption}`);
			console.log(`報名截止日往前推算僑居地居留期間內，是否曾在某一年來臺停留超過 120 天？ ${!!hasBeenTaiwan}`);
			console.log(`請就下列選項，擇一勾選，並檢附證明文件： ${whyHasBeenTaiwan}`);
			if ((_savedSystem !== null && _savedIdentity !== null) &&
				(+_savedSystem !== +_systemID || +_savedIdentity !== 3)) {
				if(!confirm('若要更換身份別，將重填所有資料，是否確定？')) {
					return;
				}
			}

			loading.start();
			student.verifyQualification({
				system_id: _systemID,
				identity: 3,
				has_come_to_taiwan: !!isDistribution,
				come_to_taiwan_at: distributionTime,
				reason_selection_of_come_to_taiwan: distributionOption,
				overseas_residence_time: stayLimitOption,
				stay_over_120_days_in_taiwan: !!hasBeenTaiwan,
				reason_selection_of_stay_over_120_days_in_taiwan: whyHasBeenTaiwan,
				force_update: true // TODO:
			})
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					throw res;
				}
			})
			.then((json) => {
				console.log(json);
				window.location.href = './personalInfo.html';
				loading.complete();
			})
			.catch((err) => {
				err.json && err.json().then((data) => {
					console.error(data);
					alert(`ERROR: \n${data.messages[0]}`);
				})
				loading.complete();
			});
		} else {
			// 在台港澳生、僑生
			const taiwanUniversity = +$signUpForm.find('.radio-taiwanUniversity:checked').val();
			const distributionYear = $signUpForm.find('.input-distributionYear').val();
			const distributionWay = $signUpForm.find('.input-distributionWay').val();
			const distributionSchool = $signUpForm.find('.input-distributionSchool').val();
			const distributionDept = $signUpForm.find('.input-distributionDept').val();
			const distributionNo = $signUpForm.find('.input-distributionNo').val();
			const applyPeer = +$signUpForm.find('.radio-applyPeer:checked').val();
			const applyPeerYear = $signUpForm.find('.input-applyPeerYear').val();
			const applyPeerStatus = +$signUpForm.find('.radio-applyPeerStatus:checked').val();
			if (!taiwanUniversity) return alert('未曾經由本聯招會或各校單招管道分發在臺就讀大學並註冊入學過');
			if (!distributionYear === '') return alert('未填寫分發年份');
			if (distributionWay === '') return alert('未填寫分發管道');
			if (distributionSchool === '') return alert('未填寫分發學校');
			if (distributionDept === '') return alert('未填寫分發學系');
			if (!!applyPeer && applyPeerYear === '') return alert('未填寫向本會申請同級學程並分發之年份');
			if (!!applyPeer && applyPeerStatus !== 1) return alert('曾經向本會申請同級學程並分發之選項不具報名資格');

			console.log(`請問您是否曾經由本聯招會或各校單招管道分發在臺就讀大學並註冊入學過？ ${!!taiwanUniversity}`);
			console.log(`分發年份： ${distributionYear}`);
			console.log(`分發管道： ${distributionWay}`);
			console.log(`分發學校： ${distributionSchool}`);
			console.log(`分發學系： ${distributionDept}`);
			console.log(`分發文字號： ${distributionNo}`);
			console.log(`請問您是否曾經向本會申請同級學程（【帶入報名學生選定之申請類別】），並經由本會分發？ ${!!applyPeer}`);
			console.log(`哪一年： ${applyPeerYear}`);
			console.log(`請就下列選項，擇一勾選：: ${applyPeerStatus}`);
			if ((_savedSystem !== null && _savedIdentity !== null) &&
				(+_savedSystem !== +_systemID || +_savedIdentity !== +_identity)) {
				if(!confirm('若要更換身份別，將重填所有資料，是否確定？')) {
					return;
				}
			}

			loading.start();
			student.verifyQualification({
				system_id: _systemID,
				identity: _identity,
				register_and_admission_at_taiwan: !!taiwanUniversity,
				admission_year: distributionYear,
				admission_way: distributionWay,
				admission_school: distributionSchool,
				admission_department: distributionDept,
				admission_document_no: distributionNo,
				same_grade_course: !!applyPeer,
				same_grade_course_apply_year: applyPeerYear,
				same_grade_course_selection: applyPeerStatus,
				force_update: true // TODO
			})
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					throw res;
				}
			})
			.then((json) => {
				console.log(json);
				window.location.href = './personalInfo.html';
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
	}

	// 請問您是否曾經由本聯招會或各校單招管道分發在臺就讀大學並註冊入學過？
	function _checkTaiwanUniversity() {
		const has = +$(this).val();
		if (!has) {
			const theReallyIdentity = _identity === 4 ? 1 : 3;
			const identityName = { 1: '港澳生或港澳具外國國籍之華裔學生', 3: '海外僑生' };
			alert(`身份別應為 ${identityName[theReallyIdentity]}`);
			$signUpForm.find(`.radio-identity[value="${theReallyIdentity}"]`).prop('checked', true).trigger('change');
		}
	}

	// 請問您是否曾經向本會申請同級學程（【帶入報名學生選定之申請類別】），並經由本會分發？
	function _checkApplyPeer() {
		const has = +$(this).val();
		!!has && $signUpForm.find('.applyPeerMore').fadeIn();
		!!has || $signUpForm.find('.applyPeerMore').fadeOut();
	}

	// 哪一年曾經向本會申請同級學程
	function _checkApplyPeerYear() {
		const $this = $(this);
		!!$this[0].checkValidity() && $this.removeClass('invalidInput');
		!!$this[0].checkValidity() || $this.addClass('invalidInput');
	}

	// 曾經向本會申請同級學程，擇一
	function _checkApplyPeerStatus() {
		const option = +$(this).val();
		$signUpForm.find('.applyPeerStatusAlert').hide();
		if (option === 1) {
			$signUpForm.find('.applyPeerStatusAlert.valid').fadeIn();
		} else {
			$signUpForm.find('.applyPeerStatusAlert.invalid').fadeIn();
		}
	}

	// 海外僑生 曾分發與否
	function _switchShowDistribution() {
		const $this = $(this);
		const isDistribution =  +$this.val();
		!!isDistribution && $signUpForm.find('#distributionMore').fadeIn();
		!!isDistribution || $signUpForm.find('#distributionMore').fadeOut();
	}

	// 海外僑生 曾分發與否 7選1
	function _checkDistributionValidation() {
		const $this = $(this);
		const option = +$this.val();
		const validOption = [1, 2, 7];
		$signUpForm.find('.distributionMoreAlert').hide();
		if (validOption.includes(option)) {
			$signUpForm.find('.distributionMoreAlert.valid').fadeIn();
		} else {
			$signUpForm.find('.distributionMoreAlert.invalid').fadeIn();
		}
	}

	// 海外僑生 海外居留年限
	function _checkStayLimitValidation() {
		const $this = $(this);
		const option = +$this.val();
		$signUpForm.find('.stayLimitAlert').hide();
		switch (option) {
			case 1:
				$signUpForm.find('.stayLimitAlert.invalid').fadeIn();
				break;
			case 2:
				$signUpForm.find('.stayLimitAlert.valid').fadeIn();
				break;
		}
	}

	// 海外僑生 來台超過120天
	function _checkHasBeenTaiwanValidation() {
		const $this = $(this);
		const option = +$this.val();
		!!option && $signUpForm.find('.question.overseas .hasBeenTaiwanQuestion').fadeIn();
		!!option || $signUpForm.find('.question.overseas .hasBeenTaiwanQuestion').fadeOut();
	}

	// 海外僑生 為何來台超過120天
	function _checkWhyHasBeenTaiwanValidation() {
		const $this = $(this);
		const option = +$this.val();
		$('.whyHasBeenTaiwanAlert').hide();
		if (option === 8) {
			$('.whyHasBeenTaiwanAlert.invalid').fadeIn();
		} else {
			$('.whyHasBeenTaiwanAlert.valid').fadeIn();
		}
	}

	// 是否擁有香港或澳門永久性居民身分證
	function _cehckIdCardValidation() {
		const $this = $(this);
		const idCard = +$this.val();
		!!idCard && $signUpForm.find('.idCardAlert.invalid').fadeOut();
		!!idCard || $signUpForm.find('.idCardAlert.invalid').fadeIn();
	}

	// 是否另持有「香港護照或英國國民（海外）護照」以外之旅行證照，或持有澳門護照以外之旅行證照
	function _checkHoldpassport() {
		const $this = $(this);
		const holdpassport = +$this.val();
		!!holdpassport && $signUpForm.find('.isTaiwanHousehold, .holdpassportThanShow').fadeIn() && _setTypeOfKangAo(null);
		!!holdpassport || $signUpForm.find('.isTaiwanHousehold, .holdpassportThanShow').fadeOut() && _setTypeOfKangAo(1);
	}

	// 是否曾在臺設有戶籍
	function _checkTaiwanHousehold() {
		$portugalPassportTime.val('').trigger('change');
		$signUpForm.find('.radio-portugalPassport:checked').trigger('change');
		_setTypeOfKangAo(null);
	}

	// 是否持有葡萄牙護照
	function _checkPortugalPassport() {
		const $this = $(this);
		const portugalPassport = +$this.val();
		$signUpForm.find('.whichPassportAlert.valid1').fadeOut();
		$signUpForm.find('.whichPassportAlert.valid2').fadeOut();
		if (portugalPassport) {
			_identity = 1;
			_setTypeOfKangAo(null);
			$signUpForm.find('.whichPassport').fadeOut();
			$signUpForm.find('.portugalPassportMore').fadeIn();
			$portugalPassportTime.val('').trigger('change');
		} else {
			$signUpForm.find('.whichPassport').fadeIn();
			$signUpForm.find('.portugalPassportMore').fadeOut();
			const isTaiwanHousehold = !!+$('.radio-holdpassport:checked').val() && +$('.radio-taiwanHousehold:checked').val();
			// 在臺曾設有戶籍者身分確認為港澳生【甲】
			if (isTaiwanHousehold) {
				_identity = 1;
				_setTypeOfKangAo(1);
				$signUpForm.find('.whichPassportAlert.valid1').fadeIn();
			} else {
				_identity = 2;
				_setTypeOfKangAo(2);
				$signUpForm.find('.whichPassportAlert.valid2').fadeIn();
			}
		}
	}

	// 於何時首次取得葡萄牙護照
	function _checkPortugalPassportTime() {
		const $this = $(this);
		const portugalPassportTime = $this.val();
		$signUpForm.find('.portugalPassportTimeAlert.valid1').fadeOut();
		$signUpForm.find('.portugalPassportTimeAlert.valid2').fadeOut();
		$signUpForm.find('.portugalPassportTimeAlert.valid3').fadeOut();
		if (portugalPassportTime === '') {
			return;
		}
		
		if (moment(portugalPassportTime).isBefore('1999-12-20')) {
			// 身分確認為港澳生【甲】
			_identity = 1;
			_setTypeOfKangAo(1);
			$signUpForm.find('.portugalPassportTimeAlert.valid1').fadeIn();
		} else {
			const isTaiwanHousehold = !!+$('.radio-holdpassport:checked').val() && +$('.radio-taiwanHousehold:checked').val();
			// 在臺曾設有戶籍者身分確認為港澳生【甲】
			if (isTaiwanHousehold) {
				_identity = 1;
				_setTypeOfKangAo(1);
				$signUpForm.find('.portugalPassportTimeAlert.valid2').fadeIn();
			} else {
				// 身分確認為「港澳具外國國籍之華裔學生」【乙】
				_identity = 2;
				_setTypeOfKangAo(2);
				$signUpForm.find('.portugalPassportTimeAlert.valid3').fadeIn();
			}
		}
	}

	// 選洲，更換國家選項
	function _setCountryOption() {
		const order = $(this).val();
		$passportCountrySelect.empty();
		$passportCountrySelect.append('<option value="-1">國家</option>');
		if (+order === -1) {
			return;
		}

		student.getCountryList().then((data) => {
			data[order].country.forEach((val, i) => {
				if (val.id !== "113" && val.id !== "127" && val.id !== "147") {
					$passportCountrySelect.append(`<option value="${val.id}">${val.country}</option>`);
				}
			});
		});
	}

	// 港澳生 是否分發來台
	function _handleKAIsDistribution() {
		const $this = $(this);
		const isDistribution = +$this.val();
		!!isDistribution && $signUpForm.find('.kangAo_distributionMore').fadeIn();
		!!isDistribution || $signUpForm.find('.kangAo_distributionMore').fadeOut();
	}

	function _checkKADistributionValidation() {
		const $this = $(this);
		const option = +$this.val();
		const valid = [1, 2];
		$signUpForm.find('.kangAo_distributionMoreAlert.valid').fadeOut();
		$signUpForm.find('.kangAo_distributionMoreAlert.invalid').fadeOut();
		if (valid.includes(option)) {
			$signUpForm.find('.kangAo_distributionMoreAlert.valid').fadeIn();
		} else {
			$signUpForm.find('.kangAo_distributionMoreAlert.invalid').fadeIn();
		}
	}

	// 港澳生 海外居留年限
	function _checkKAStayLimitValidation() {
		const $this = $(this);
		const option = +$this.val();
		$signUpForm.find('.kangAo_stayLimitAlert').hide();
		switch (option) {
			case 1:
				$signUpForm.find('.kangAo_stayLimitAlert.invalid').fadeIn();
				break;
			case 2:
				$signUpForm.find('.kangAo_stayLimitAlert.valid').fadeIn();
				break;
		}
	}

	// 港澳生 在台停留日期
	function _checkKAHasBeenTaiwanValidation() {
		const $this = $(this);
		const has = +$this.val();
		$signUpForm.find('.kangAoType1_hasBeenTaiwanQuestion').fadeOut();
		$signUpForm.find('.kangAoType2_hasBeenTaiwanQuestion').fadeOut();
		if (has) {
			switch (_typeOfKangAo) {
				case 1:
					$signUpForm.find('.kangAoType1_hasBeenTaiwanQuestion').fadeIn();
					break;
				case 2:
					$signUpForm.find('.kangAoType2_hasBeenTaiwanQuestion').fadeIn();
					break;
				default:
					alert('請確保上述問題已正確填答');
					$KA_hasBeenTaiwanRadio.last().prop('checked', true).trigger('change');
					break;
			}
		}
	}


	// 港澳生 甲 為何在台停留一堆問題
	function _checkKA1WhyHasBeenTaiwanValidation() {
		const $this = $(this);
		const option = +$this.val();
		$signUpForm.find('.kangAoType1_whyHasBeenTaiwanAlert.invalid').hide();
		$signUpForm.find('.kangAoType1_whyHasBeenTaiwanAlert.valid').hide();
		if (option === 11) {
			$signUpForm.find('.kangAoType1_whyHasBeenTaiwanAlert.invalid').fadeIn();
		} else {
			$signUpForm.find('.kangAoType1_whyHasBeenTaiwanAlert.valid').fadeIn();
		}
	}

	// 港澳生 乙 為何在台停留一堆問題
	function _checkKA2WhyHasBeenTaiwanValidation() {
		const $this = $(this);
		const option = +$this.val();
		$signUpForm.find('.kangAoType2_whyHasBeenTaiwanAlert.invalid').hide();
		$signUpForm.find('.kangAoType2_whyHasBeenTaiwanAlert.valid').hide();
		if (option === 8) {
			$signUpForm.find('.kangAoType2_whyHasBeenTaiwanAlert.invalid').fadeIn();
		} else {
			$signUpForm.find('.kangAoType2_whyHasBeenTaiwanAlert.valid').fadeIn();
		}
	}

	/**
	*	private method
	*/
	function _setTypeOfKangAo(type) {
		console.log(`Kang Ao type changed: ${type}`);
		$KA_hasBeenTaiwanRadio.last().prop('checked', true).trigger('change');
		switch (type) {
			case 1:
				_typeOfKangAo = 1;
				break;
			case 2:
				_typeOfKangAo = 2;
				break;
			default:
				_typeOfKangAo = null;
				break;
		}
	}

	function _getParam(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
		const results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

	function _setData(data) {
		// 身分別
		$signUpForm.find(`.radio-identity[value=${data.identity}]`).trigger('click');
		if (+data.identity >= 4) {
			// 在台僑生
			// 分發年份：
			$signUpForm.find('.input-distributionYear').val(data.admission_year).trigger('change');

			// 分發管道：
			$signUpForm.find('.input-distributionWay').val(data.admission_way).trigger('change');

			// 分發學校：
			$signUpForm.find('.input-distributionSchool').val(data.admission_school).trigger('change');

			// 分發學系：
			$signUpForm.find('.input-distributionDept').val(data.admission_department).trigger('change');

			// 分發文字號：
			$signUpForm.find('.input-distributionNo').val(data.admission_document_no).trigger('change');

			// 請問您是否曾經向本會申請同級學程（【帶入報名學生選定之申請類別】），並經由本會分發？
			!!data.same_grade_course &&
			$signUpForm.find('.radio-applyPeer[value=1]').trigger('click') &&
			$signUpForm.find('.input-applyPeerYear').val(data.same_grade_course_apply_year) &&
			$signUpForm.find(`.radio-applyPeerStatus[value=${data.same_grade_course_selection}]`).trigger('click');
		}

		if (+data.identity === 3) {
			// 海外僑生
			// 曾分發來臺
			!!data.has_come_to_taiwan &&
			$signUpForm.find('.isDistribution[value=1]').trigger('click') &&
			$signUpForm.find('.input-distributionTime').val(data.come_to_taiwan_at).trigger('change') &&
			$signUpForm.find(`.distributionMoreQuestion[value=${data.reason_selection_of_come_to_taiwan}]`).trigger('click');

			// 海外居留年限
			$signUpForm.find(`.radio-stayLimit[value=${data.overseas_residence_time}]`).trigger('click');

			// 在台停留日期
			!!data.stay_over_120_days_in_taiwan &&
			$signUpForm.find('.radio-hasBeenTaiwan[value=1]').trigger('click') &&
			$signUpForm.find(`.radio-whyHasBeenTaiwan[value=${data.reason_selection_of_stay_over_120_days_in_taiwan}]`).trigger('click');
		}

		if (+data.identity === 2) {
			// 港澳具外國國籍之華裔學生
			// 是否另持有「香港護照或英國國民（海外）護照」以外之旅行證照，或持有澳門護照以外之旅行證照？
			!!data.except_HK_Macao_passport && $signUpForm.find('.radio-holdpassport[value=1]').trigger('click');

			// 是否曾在臺設有戶籍？
			!!data.except_HK_Macao_passport && !!data.taiwan_census && $signUpForm.find('.radio-taiwanHousehold[value=1]').trigger('click');

			// 是否持有葡萄牙護照？
			!!data.except_HK_Macao_passport && !data.portugal_passport && $signUpForm.find('.radio-portugalPassport[value=0]').trigger('click');

			// 於何時首次取得葡萄牙護照？
			!!data.except_HK_Macao_passport && !!data.portugal_passport &&
			$signUpForm.find('.input-portugalPassportTime').val(data.first_get_portugal_passport_at.replace(/\//g, '-')).trigger('change');

			// 您持有哪一個國家之護照？
			if (!!data.except_HK_Macao_passport && !data.portugal_passport) {
				const country = _getCountryByID(data.which_nation_passport);
				$signUpForm.find(`.select-passportContinent option[value=${country.index}]`).prop('selected', true);
				$signUpForm.find('.select-passportContinent').trigger('change');
				setTimeout(function () {
					$signUpForm.find(`.select-passportCountry option[value="${country.id}"]`).prop('selected', true);
				}, 500);
			}

			// 曾分發來臺
			!!data.has_come_to_taiwan &&
			$signUpForm.find('.kangAo_radio-isDistribution[value=1]').trigger('click') &&
			$signUpForm.find('.kangAo_input-distributionTime').val(data.come_to_taiwan_at).trigger('change') &&
			$signUpForm.find(`.kangAo_distributionMoreQuestion[value=${data.reason_selection_of_come_to_taiwan}]`).trigger('click');

			// 海外居留年限
			$signUpForm.find(`.kangAo_radio-stayLimit[value=${data.overseas_residence_time}]`).trigger('click');

			// 在台停留日期
			!!data.stay_over_120_days_in_taiwan &&
			$signUpForm.find('.kangAo_radio-hasBeenTaiwan[value=1]').trigger('click');
			const selector = data.identity === 1 ? '.kangAoType1_radio-whyHasBeenTaiwan' : '.kangAoType2_radio-whyHasBeenTaiwan';
			$(`${selector}[value=${data.reason_selection_of_stay_over_120_days_in_taiwan}]`).trigger('click');
		}

		if (+data.identity === 1) {
			// 港澳生
			// 是否另持有「香港護照或英國國民（海外）護照」以外之旅行證照，或持有澳門護照以外之旅行證照？
			!!data.except_HK_Macao_passport && $signUpForm.find('.radio-holdpassport[value=1]').trigger('click');

			//是否曾在臺設有戶籍？
			!!data.taiwan_census && $signUpForm.find('.radio-taiwanHousehold[value=1]').trigger('click');

			// 是否持有葡萄牙護照？
			!data.portugal_passport && $signUpForm.find('.radio-portugalPassport[value=0]').trigger('click');

			// 於何時首次取得葡萄牙護照？
			!!data.portugal_passport && $signUpForm.find('.input-portugalPassportTime').val(data.first_get_portugal_passport_at.replace(/\//g, '-')).trigger('change');

			// 您持有哪一個國家之護照？
			if (!!data.except_HK_Macao_passport && !data.portugal_passport) {
				const country = _getCountryByID(data.which_nation_passport);
				$signUpForm.find(`.select-passportContinent option[value=${country.index}]`).prop('selected', true);
				$signUpForm.find('.select-passportContinent').trigger('change');
				setTimeout(function () {
					$signUpForm.find(`.select-passportCountry option[value="${country.id}"]`).prop('selected', true);
				}, 500);
			}

			// 曾分發來臺
			!!data.has_come_to_taiwan && 
			$signUpForm.find('.kangAo_radio-isDistribution[value=1]').trigger('click') &&
			$signUpForm.find('.kangAo_input-distributionTime').val(data.come_to_taiwan_at).trigger('change') &&
			$signUpForm.find(`.kangAo_distributionMoreQuestion[value=${data.reason_selection_of_come_to_taiwan}]`).trigger('click');

			// 海外居留年限
			$signUpForm.find(`.kangAo_radio-stayLimit[value=${data.overseas_residence_time}]`).trigger('click');

			// 在台停留日期
			!!data.stay_over_120_days_in_taiwan &&
			$signUpForm.find('.kangAo_radio-hasBeenTaiwan[value=1]').trigger('click');
			const selector = data.identity === 1 ? '.kangAoType1_radio-whyHasBeenTaiwan' : '.kangAoType2_radio-whyHasBeenTaiwan';
			$(`${selector}[value=${data.reason_selection_of_stay_over_120_days_in_taiwan}]`).trigger('click');
		}
	}

	function _getCountryByID (id) {
		const result = {};
		_countryList.some((c, i) => {
			result.index = i;
			return Object.values(c.country).some((cc, j) => {
				if (+cc.id === +id) {
					result.id = id;
					return true;
				}

				return false;
			});
		});

		return result;
	}

	_init();
})();
