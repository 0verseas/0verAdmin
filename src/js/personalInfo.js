(() => {

	/**
	*	private variable
	*/

	let _specailStatus = 0;
	let _disabilityCategory = '視覺障礙';
	let _currentDadStatus = 'alive';
	let _currentMomStatus = 'alive';
	let _countryList = [];
	let _systemId = 0;
	let _identityId = 0;

	let _hasEduType = false; // 有無學校類別
	let _hasSchoolLocate = false; // 有無學校所在地列表，true 則採用 $schoolNameSelect，否則採用 $schoolNameText
	let _schoolCountryId = "";
	let _currentSchoolType = "";
	let _currentSchoolLocate = "";
	let _currentSchoolName = "";
	let _schoolList = [];
	let _schoolType = { // 有類別的地區
		"106": ["國際學校", "華校", "緬校"], // 緬甸
		"115": ["印尼當地中學", "海外臺灣學校"], // 印尼
		"128": ["國民型或國民中學；或持 O-Level、A-Level 文憑者", "馬來西亞華文獨立中學", "海外臺灣學校", "馬來西亞國際學校"], // 馬來西亞
		"140": ["海外臺灣學校", "越南當地中學"], // 越南
		"143": ["泰北未立案之華文中學", "泰國當地中學"] // 泰國
	}
	const _disabilityCategoryList = ["視覺障礙", "聽覺障礙", "肢體障礙", "語言障礙", "腦性麻痺", "自閉症", "學習障礙"];
	let _errormsg = [];

	/**
	*	cache DOM
	*/

	const $personalInfoForm = $('#form-personalInfo'); // 個人資料表單

	// 申請人資料表
	const $email = $('#email');
	const $backupEmail = $('#backupEmail'); // 備用 E-Mail
	const $name = $('#name'); // 姓名（中）
	const $engName = $('#engName');	// 姓名（英）
	const $gender = $personalInfoForm.find('.gender'); // 性別
	const $birthday = $('#birthday'); // 生日
	const $birthContinent = $('#birthContinent'); // 出生地（州）
	const $birthLocation = $('#birthLocation'); // 出生地（國）
	const $homeTownForm = $('#form-homeTown'); // 籍貫表單
	const $homeTownProvince = $('#homeTownProvince'); // 籍貫-省
	const $homeTownCity = $('#homeTownCity'); // 籍貫-市
	const $whenToResident = $('#whenToResident'); // 籍貫搬遷年份
	const $whereToResident = $('#whereToResident'); // 籍貫搬遷來源地
	const $specail = $personalInfoForm.find('.specail'); // 是否為「身心障礙」或「特殊照護」或「特殊教育」者
	const $specialForm = $('#specialForm'); // 身心障礙表單
	const $disabilityCategory = $('#disabilityCategory'); // 障礙類別
	const $disabilityLevel = $('#disabilityLevel'); // 障礙等級
	const $otherDisabilityCategoryForm = $('#otherDisabilityCategoryForm'); // 其他障礙說明表單
	const $otherDisabilityCategory = $('#otherDisabilityCategory'); // 其他障礙說明

	// 僑居地資料
	const $residenceContinent = $('#residenceContinent'); // 州
	const $residentLocation = $('#residentLocation'); // 國
	const $residentId = $('#residentId'); // 身分證號碼（ID no.）
	const $residentPassportNo = $('#residentPassportNo'); // 護照號碼
	const $residentPhoneCode = $('#residentPhoneCode'); // 電話國碼
	const $residentPhone = $('#residentPhone'); // 電話號碼
	const $residentCellphoneCode = $('#residentCellphoneCode'); // 手機國碼
	const $residentCellphone = $('#residentCellphone'); // 手機號碼
	const $residentAddress = $('#residentAddress'); // 地址（中 / 英）
	const $residentOtherLangAddress = $('#residentOtherLangAddress'); // 地址（其他語言）

	// 在台資料 (選填)
	const $taiwanIdType = $('#taiwanIdType'); // 證件類型
	const $taiwanIdNo = $('#taiwanIdNo'); // 該證件號碼
	const $taiwanPassport = $('#taiwanPassport'); // 臺灣護照號碼
	const $taiwanPhone = $('#taiwanPhone'); // 臺灣電話
	const $taiwanAddress = $('#taiwanAddress'); // 臺灣地址

	// 學歷
	const $educationSystemDescriptionDiv = $('#div-educationSystemDescription');
	const $educationSystemDescription = $('#educationSystemDescription'); // 學制描述
	const $schoolContinent = $('#schoolContinent'); // 學校所在地（州）
	const $schoolCountry = $('#schoolCountry'); // 學校所在地（國）

	const $schoolTypeForm = $('#schoolTypeForm'); // 學校類別表單
	const $schoolType = $('#schoolType'); // 學校類別

	const $schoolLocationForm = $('#schoolLocationForm'); // 學校所在地、學校名稱 (select) 表單
	const $schoolLocation = $('#schoolLocation'); // 學校所在地
	const $schoolNameSelect = $('#schoolNameSelect'); // 學校名稱 (select)

	const $schoolNameTextForm = $('#schoolNameTextForm'); // 學校名稱表單
	const $schoolNameText = $('#schoolNameText'); // 學校名稱 (text)

	const $subjectForm = $('#subjectForm'); // 主、輔修表單
	const $majorSubject = $('#majorSubject'); // 主修科目
	const $minorSubject = $('#minorSubject'); // 輔修科目

	const $schoolAdmissionAt = $('#schoolAdmissionAt'); // 入學時間
	const $schoolGraduateAt = $('#schoolGraduateAt'); // 畢業時間

	const $twoYearTechClassForm = $('.twoYearTechClassForm'); // 港二技表單
	const $twoYearTechDiploma = $('#twoYearTechDiploma'); // 文憑類別（港二技）
	const $twoYearTechClassName = $('#twoYearTechClassName'); // 課程名稱（港二技）
	const $twoYearTechClassStart = $('#twoYearTechClassStart'); // 課程開始日期（港二技）
	const $twoYearTechClassEnd = $('#twoYearTechClassEnd'); // 課程結束日期（港二技）

	// 家長資料
	// 父親
	const $dadStatus = $('.dadStatus'); // 存歿
	const $dadDataForm = $('#form-dadData'); // 資料表單
	const $dadName = $('#dadName'); // 姓名（中）
	const $dadEngName = $('#dadEngName'); // 姓名（英）
	const $dadBirthday = $('#dadBirthday'); // 生日
	const $dadHometown = $('#dadHometown'); // 籍貫
	const $dadJob = $('#dadJob'); // 職業
	// 母親
	const $momStatus = $('.momStatus'); // 存歿
	const $momDataForm = $('#form-momData'); // 資料表單
	const $momName = $('#momName'); // 姓名（中）
	const $momEngName = $('#momEngName'); // 姓名（英）
	const $momBirthday = $('#momBirthday'); // 生日
	const $momHometown = $('#momHometown'); // 籍貫
	const $momJob = $('#momJob'); // 職業
	// 監護人（父母皆不詳才需要填寫）
	const $guardianForm = $('#form-guardian'); // 資料表單
	const $guardianName = $('#guardianName'); // 姓名（中）
	const $guardianEngName = $('#guardianEngName'); // 姓名（英）
	const $guardianBirthday = $('#guardianBirthday'); // 生日
	const $guardianHometown = $('#guardianHometown'); // 籍貫
	const $guardianJob = $('#guardianJob'); // 職業

	// 在台聯絡人
	const $twContactName = $('#twContactName'); // 姓名
	const $twContactRelation = $('#twContactRelation'); // 關係
	const $twContactPhone = $('#twContactPhone'); // 聯絡電話
	const $twContactAddress = $('#twContactAddress'); // 地址
	const $twContactWorkplaceName = $('#twContactWorkplaceName'); // 服務機關名稱
	const $twContactWorkplacePhone = $('#twContactWorkplacePhone'); // 服務機關電話
	const $twContactWorkplaceAddress = $('#twContactWorkplaceAddress'); // 服務機關地址
	const $saveBtn = $('#btn-save');

	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

	$birthContinent.on('change', _reRenderCountry);
	$specail.on('change', _changeSpecail);
	$disabilityCategory.on('change', _switchDisabilityCategory);
	$residenceContinent.on('change', _reRenderResidenceCountry);
	$schoolContinent.on('change', _reRenderSchoolCountry);
	$schoolCountry.on('change', _chSchoolCountry);
	$schoolType.on('change', _chSchoolType);
	$schoolLocation.on('change', _chSchoolLocation);
	$dadStatus.on('change', _chDadStatus);
	$momStatus.on('change', _chMomStatus);
	$saveBtn.on('click', _handleSave);

	function _init() {
		student.getStudentPersonalData()
		.then((res) => {
			if (res.ok) {
				_initCountryList();
				return res.json();
			} else {
				throw res;
			}
		})
		.then((json) => {
			_systemId = json.student_qualification_verify.system_id;
			_identityId = json.student_qualification_verify.identity;
			let formData = json.student_personal_data;
			if (formData === null) {
				formData = {
					"backup_email": "",
					"gender": "F",
					"birthday": "",
					"birth_location": "",
					"special": 0,
					"disability_category": "",
					"disability_level": "",
					"resident_location": "",
					"resident_id": "",
					"resident_passport_no": "",
					"resident_phone": "",
					"resident_cellphone": "",
					"resident_address": ";",
					"taiwan_id_type": "",
					"taiwan_id": "",
					"taiwan_passport": "",
					"taiwan_phone": "",
					"taiwan_address": "",
					"education_system_description": "",
					"school_country": "",
					"school_name": "",
					"school_type": "",
					"school_locate": "",
					"school_admission_at": "",
					"school_graduate_at": "",
					"major_subject": null,
					"minor_subject": null,
					"dad_status": "alive",
					"dad_name": "",
					"dad_eng_name": "",
					"dad_birthday": "",
					"dad_hometown": "",
					"dad_job": "",
					"mom_status": "alive",
					"mom_name": "",
					"mom_eng_name": "",
					"mom_birthday": "",
					"mom_hometown": "",
					"mom_job": "",
					"guardian_name": "",
					"guardian_eng_name": "",
					"guardian_birthday": "",
					"guardian_hometown": "",
					"guardian_job": "",
					"tw_contact_name": "",
					"tw_contact_relation": "",
					"tw_contact_phone": "",
					"tw_contact_address": "",
					"tw_contact_workplace_name": "",
					"tw_contact_workplace_phone": "",
					"tw_contact_workplace_address": "",
					"home_town": "省市",
					"when_to_resident": null,
					"where_to_resident": null,
					"two_year_tech_diploma": "",
					"two_year_tech_class_name": "",
					"two_year_tech_class_start": "",
					"two_year_tech_class_end": ""
				}
			}

			// init 申請人資料表
			$email.val(json.email);
			$backupEmail.val(formData.backup_email);
			$name.val(json.name);
			$engName.val(json.eng_name);
			$("input[name=gender][value='"+ formData.gender +"']").prop("checked",true);
			$birthday.val(formData.birthday);
			$birthContinent.val(_findContinent(formData.birth_location)).change();
			$birthLocation.val(formData.birth_location);

			if (_identityId === 3) {
				$homeTownForm.show();
				$homeTownProvince.val(_splitHomeTown(formData.home_town)[0]);
				$homeTownCity.val(_splitHomeTown(formData.home_town)[1]);
				$whenToResident.val(formData.when_to_resident);
				$whereToResident.val(formData.where_to_resident);
			}

			_specailStatus = formData.special;
			$("input[name=special][value='"+ _specailStatus +"']").prop("checked",true).change();
			if (_specailStatus === 1) {
				if (_disabilityCategoryList.indexOf(formData.disability_category) > -1) {
					$disabilityCategory.val(formData.disability_category).change();
				} else {
					$disabilityCategory.val("-1").change();
					$otherDisabilityCategory.val(formData.disability_category);
				}
				$disabilityLevel.val(formData.disability_level);
			}

			// init 僑居地資料
			$residenceContinent.val(_findContinent(formData.resident_location)).change();
			$residentLocation.val(formData.resident_location);
			$residentId.val(formData.resident_id);
			$residentPassportNo.val(formData.resident_passport_no);
			$residentPhoneCode.val(_splitWithSemicolon(formData.resident_phone)[0]);
			$residentPhone.val(_splitWithSemicolon(formData.resident_phone)[1]);
			$residentCellphoneCode.val(_splitWithSemicolon(formData.resident_cellphone)[0]);
			$residentCellphone.val(_splitWithSemicolon(formData.resident_cellphone)[1]);
			$residentAddress.val(_splitWithSemicolon(formData.resident_address)[0]);
			$residentOtherLangAddress.val(_splitWithSemicolon(formData.resident_address)[1]);

			// init 在台資料
			$taiwanIdType.val(formData.taiwan_id_type);
			$taiwanIdNo.val(formData.taiwan_id);
			$taiwanPassport.val(formData.taiwan_passport);
			$taiwanPhone.val(formData.taiwan_phone);
			$taiwanAddress.val(formData.taiwan_address);

			// init 學歷
			if (_systemId === 1 || _systemId === 2) { // 學士班、港二技 需要填寫學制描述
				$educationSystemDescription.val(formData.education_system_description);
			} else {
				$educationSystemDescriptionDiv.hide();
			}
			$schoolContinent.val(_findContinent(formData.school_country)).change();
			$schoolCountry.val(formData.school_country);

			_schoolCountryId = formData.school_country;
			_currentSchoolType = (formData.school_type !== null) ? formData.school_type : "";
			_currentSchoolLocate = (formData.school_locate !== null) ? formData.school_locate : "";
			_currentSchoolName = formData.school_name;

			_reRenderSchoolType();

			// 主副修欄位渲染、初始化
			if (_systemId === 3 || _systemId === 4) {
				$subjectForm.show();
				$majorSubject.val(formData.major_subject);
				$minorSubject.val(formData.minor_subject);
			}

			// 入學時間、畢業時間初始化
			$schoolAdmissionAt.val(formData.school_admission_at);
			$schoolGraduateAt.val(formData.school_graduate_at);

			// 港二技文憑渲染、初始化
			if (_systemId === 2) {
				$twoYearTechClassForm.show();
				$twoYearTechDiploma.val(formData.two_year_tech_diploma);
				$twoYearTechClassName.val(formData.two_year_tech_class_name);
				$twoYearTechClassStart.val(formData.two_year_tech_class_start);
				$twoYearTechClassEnd.val(formData.two_year_tech_class_end);
			}

			// init 家長資料
			// 父
			_currentDadStatus = formData.dad_status;
			$("input[name=dadStatus][value='"+ formData.dad_status +"']").prop("checked",true);
			$dadName.val(formData.dad_name);
			$dadEngName.val(formData.dad_eng_name);
			$dadBirthday.val(formData.dad_birthday);
			$dadHometown.val(formData.dad_hometown);
			$dadJob.val(formData.dad_job);
			// 母
			_currentMomStatus = formData.mom_status;
			$("input[name=momStatus][value='"+ formData.mom_status +"']").prop("checked",true);
			$momName.val(formData.mom_name);
			$momEngName.val(formData.mom_eng_name);
			$momBirthday.val(formData.mom_birthday);
			$momHometown.val(formData.mom_hometown);
			$momJob.val(formData.mom_job);
			// 監護人
			$guardianName.val(formData.guardian_name);
			$guardianEngName.val(formData.guardian_eng_name);
			$guardianBirthday.val(formData.guardian_birthday);
			$guardianHometown.val(formData.guardian_hometown);
			$guardianJob.val(formData.guardian_job);

			// init 在台聯絡人
			$twContactName.val(formData.tw_contact_name);
			$twContactRelation.val(formData.tw_contact_relation);
			$twContactPhone.val(formData.tw_contact_phone);
			$twContactAddress.val(formData.tw_contact_address);
			$twContactWorkplaceName.val(formData.tw_contact_workplace_name);
			$twContactWorkplacePhone.val(formData.tw_contact_workplace_phone);
			$twContactWorkplaceAddress.val(formData.tw_contact_workplace_address);
		})
		.then(() => {
			_showSpecailForm();
			_handleOtherDisabilityCategoryForm();
			_switchDadDataForm();
			_switchMomDataForm();
			_setResidenceContinent();
			_setSchoolContinent();
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

	function _findContinent(locationId) { // 找到州別
		let continent = '';
		for (let i = 0; i < _countryList.length; i++) {
			let countryObj = _countryList[i].country.filter((obj) => {
				return obj.id === locationId;
			});
			if (countryObj.length > 0) {
				return '' + i;
			}
		}
		return -1;
	}

	function _splitWithSemicolon(phoneNum) {
		let i = phoneNum.indexOf(";");
		return [phoneNum.slice(0,i), phoneNum.slice(i+1)];
	}

	function _splitHomeTown(homeTown) {
		let returnArr = [];
		if (homeTown !== null && homeTown !== "") {
			let provinceIndex = homeTown.indexOf("省");
			let cityIndex = homeTown.lastIndexOf("市");
			returnArr[0] = homeTown.slice(0, provinceIndex);
			returnArr[1] = homeTown.slice(provinceIndex + 1, cityIndex);
		}
		return returnArr;
	}

	function _initCountryList() {
		student.getCountryList()
		.then((json) => {
			_countryList = json;
			let stateHTML = '<option value="-1" data-continentIndex="-1">Continent</option>';
			json.forEach((obj, index) => {
				stateHTML += `<option value="${index}" data-continentIndex="${index}">${obj.continent}</option>`
			})
			$birthContinent.html(stateHTML);
			$residenceContinent.html(stateHTML);
			$schoolContinent.html(stateHTML);
		})
	}

	function _setResidenceContinent() {
		// 兩種港澳生的洲別只能選到「亞洲」
		if ($residenceContinent && (_identityId === 1 || _identityId === 2 || _identityId === 4)) {
			let residenceContinentOptions = $residenceContinent.find('option');
			for (let i = 0; i < residenceContinentOptions.length; i++) {
				if (!(residenceContinentOptions[i].value === "-1" || residenceContinentOptions[i].value === "0")) {
					residenceContinentOptions[i].remove();
				}
			}
		}
	}

	function _setSchoolContinent() {
		// 港二技的學校洲別只能選到「亞洲」
		if ($schoolContinent && (_systemId === 2)) {
			let schoolContinentOptions = $schoolContinent.find('option');
			for (let i = 0; i < schoolContinentOptions.length; i++) {
				if (!(schoolContinentOptions[i].value === "-1" || schoolContinentOptions[i].value === "0")) {
					schoolContinentOptions[i].remove();
				}
			}
		}
	}

	function _reRenderCountry() {
		const continent = $(this).find(':selected').data('continentindex');
		const $row = $(this).closest('.row');
		const $countrySelect = $row.find('.country');

		let countryHTML = '<option value="">Country</option>';
		if (continent !== -1) {
			_countryList[continent]['country'].forEach((obj, index) => {
				countryHTML += `<option value="${obj.id}">${obj.country}</option>`;
			})
		} else {
			countryHTML = '<option value="">Country</option>'
		}
		$countrySelect.html(countryHTML);
		$countrySelect.change();
	}

	function _reRenderResidenceCountry() {
		const continent = $(this).find(':selected').data('continentindex');
		const identity124Rule = ["113", "127"]; // 港澳生、港澳具外國國籍之華裔學生、在臺港澳生，只能選到香港、澳門
		const identity3Rule = ["113", "127", "147", "148"]; // 海外不能選到香港、澳門、臺灣跟大陸
        const identity6Rule = ["147"]; // 僑先部結業生不能選到臺灣

		let countryHTML = '<option value="">Country</option>';
		if (continent !== -1) {
			_countryList[continent]['country'].forEach((obj, index) => {
				if (_identityId === 1 || _identityId === 2 || _identityId === 4) {
					if (identity124Rule.indexOf(obj.id) === -1) { return; }
				} else if (_identityId === 3 || _identityId === 5) {
					if (identity3Rule.indexOf(obj.id) > -1) { return; }
				} else {
					if (identity6Rule.indexOf(obj.id) > -1) { return; }
				}
				countryHTML += `<option value="${obj.id}">${obj.country}</option>`;
			})
		} else {
			countryHTML = '<option value="">Country</option>'
		}
		$residentLocation.html(countryHTML);
	}

	function _reRenderSchoolCountry() {
		const continent = $(this).find(':selected').data('continentindex');
		// 港二技學制只能選擇香港
		const system2Rule = ["113"];

		let countryHTML = '<option value="">Country</option>';
		if (continent !== -1) {
			_countryList[continent]['country'].forEach((obj, index) => {
				if (_systemId === 2) {
					if (system2Rule.indexOf(obj.id) === -1) { return; }
				}
				countryHTML += `<option value="${obj.id}">${obj.country}</option>`;
			})
		} else {
			countryHTML = '<option value="">Country</option>'
		}
		$schoolCountry.html(countryHTML);
		$schoolCountry.change();
	}

	function _switchDisabilityCategory() {
		_disabilityCategory = $(this).val();
		_handleOtherDisabilityCategoryForm();
	}

	function _handleOtherDisabilityCategoryForm() {
		if (_disabilityCategory === "-1") {
			$otherDisabilityCategoryForm.fadeIn();
		} else {
			$otherDisabilityCategoryForm.hide();
		}
	}

	function _changeSpecail() {
		_specailStatus = Number($(this).val());
		_showSpecailForm();
	}

	function _showSpecailForm() {
		if (_specailStatus === 1) {
			$specialForm.fadeIn();
		} else {
			$specialForm.hide();
		}
	}

	function _chSchoolCountry() {
		// 更換學校國家時，取得國家 id 作為後續渲染使用
		// 並初始化相關變數，接下去觸發渲染學校類型事件
		_schoolCountryId = $(this).val();
		_currentSchoolType = "";
		_currentSchoolLocate = "";
		_currentSchoolName = "";
		_reRenderSchoolType();
	}

	function _reRenderSchoolType() {
		// 處理該國籍是否需要選擇學校類型，以及學校類型 select bar 渲染工作
		// 學士班才需要學校類別
		if (_systemId === 1) {
			if (_schoolCountryId in _schoolType) {
				let typeHTML = '';
				_schoolType[_schoolCountryId].forEach((value, index) => {
					typeHTML += `<option value="${value}">${value}</option>`;
				})
				$schoolType.html(typeHTML);
				if (_currentSchoolType !== "") {
					$schoolType.val(_currentSchoolType);
				}
				$schoolTypeForm.fadeIn();
				_hasEduType = true;
			} else {
				$schoolTypeForm.hide();
				_hasEduType = false;
			}
		} else {
			$schoolTypeForm.hide();
			_hasEduType = false;
		}
		_reRenderSchoolLocation();
	}

	function _chSchoolType() {
		// 取得修改後的學校類型，以此判斷是否要渲染學校列表
		// 初始化學校所在地、名稱變數，接下去觸發渲染學校列表事件
		_currentSchoolType = $(this).val();
		_currentSchoolLocate = "";
		_currentSchoolName = "";
		_reRenderSchoolLocation();
	}

	function _reRenderSchoolLocation() {
		// 沒有選國家則不會出現學校名稱欄位
		if (!!_schoolCountryId) {
			// 學士班才需要出現學校所在地、名稱列表
			if (_systemId === 1) {
				student.getSchoolList(_schoolCountryId)
				.then((res) => {
					if (res.ok) {
						return res.json();
					} else {
						throw res;
					}
				})
				.then((json) => {
					// schoolWithType: 當前類別的學校列表
					let schoolWithType = [];
					if (_schoolCountryId in _schoolType) {
						schoolWithType = json.filter((obj) => {
							return obj.type === _currentSchoolType;
						})
					} else {
						schoolWithType = json;
					}

					if (schoolWithType.length > 0) {
						// 當前類別有學校列表的話，渲染所在地、學校名稱列表
						let group_to_values = schoolWithType.reduce(function (obj, item) {
							obj[item.locate] = obj[item.locate] || [];
							obj[item.locate].push({name: item.name});
							return obj;
						}, {});

						// group by 學校所在地
						let groups = Object.keys(group_to_values).map(function (key) {
							return {locate: key, school: group_to_values[key]};
						});
						let schoolLocationHTML = '';
						_schoolList = groups;
						// 渲染學校所在地、隱藏學校名稱輸入
						_schoolList.forEach((value, index) => {
							schoolLocationHTML += `<option value="${value.locate}">${value.locate}</option>`;
						})
						$schoolLocation.html(schoolLocationHTML);
						if (_currentSchoolLocate !== "") {
							$schoolLocation.val(_currentSchoolLocate);
						} else {
							_currentSchoolLocate = _schoolList[0].locate;
						}
						$schoolLocationForm.fadeIn();
						$schoolNameTextForm.hide();
						_hasSchoolLocate = true;
					} else {
						// 沒有學校列表，則單純顯示學校名稱 text field
						$schoolLocationForm.hide();
						$schoolNameTextForm.fadeIn();
						$schoolNameText.val(_currentSchoolName);
						_hasSchoolLocate = false;
					}
				})
				.then(() => {
					setTimeout(_reRenderSchoolList(), 500);
				})
				.catch((err) => {
					err.json && err.json().then((data) => {
						console.error(data);
					})
				})
			} else {
				$schoolLocationForm.hide();
				$schoolNameTextForm.fadeIn();
				$schoolNameText.val(_currentSchoolName);
				_hasSchoolLocate = false;
			}
		} else {
			$schoolLocationForm.hide();
			$schoolNameTextForm.hide();
		}
	}

	function _chSchoolLocation() {
		_currentSchoolLocate = $(this).val();
		_currentSchoolName = "";
		_reRenderSchoolList();
	}

	function _reRenderSchoolList() {
		if (_systemId === 1) {
			// 重新渲染學士班的學校列表
			let locateIndex = _schoolList.findIndex(order => order.locate === _currentSchoolLocate);

			let schoolListHTML = '';
			_schoolList[locateIndex].school.forEach((value, index) => {
				schoolListHTML += `<option value="${value.name}">${value.name}</option>`;
			})
			$schoolNameSelect.html(schoolListHTML);
			if (_currentSchoolName !== "") {
				$schoolNameSelect.val(_currentSchoolName);
			}
		} else {
			// 非學士班，渲染學校名稱 text field
			$schoolNameText.val(_currentSchoolName);
		}
	}

	function _chDadStatus() {
		_currentDadStatus = $(this).val();
		_switchDadDataForm();
	}

	function _switchDadDataForm() {
		if (_currentDadStatus === "undefined") {
			$dadDataForm.hide();
		} else {
			$dadDataForm.fadeIn();
		}
		_switchGuardianForm();
	}

	function _chMomStatus() {
		_currentMomStatus = $(this).val();
		_switchMomDataForm();
	}

	function _switchMomDataForm() {
		if (_currentMomStatus === "undefined") {
			$momDataForm.hide();
		} else {
			$momDataForm.fadeIn();
		}
		_switchGuardianForm();
	}

	function _switchGuardianForm() {
		if (_currentDadStatus === "undefined" && _currentMomStatus === "undefined") {
			$guardianForm.fadeIn();
		} else {
			$guardianForm.hide();
		}
	}

	function _handleSave() {
		let sendData = {};
		if (sendData = _validateForm()) {
			for (let i in sendData) {
				if (sendData[i] === null) {
					sendData[i] = "";
				}
			}
			if (!_hasEduType) { sendData.school_type = ""; }
			if (!_hasSchoolLocate) { sendData.school_locate = ""; }
			loading.start();
			student.setStudentPersonalData(sendData)
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					throw res;
				}
			})
			.then((json) => {
				console.log(json);
				alert('儲存成功');
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
			console.log('==== validate failed ====');
			alert("填寫格式錯誤，請檢查以下表單：\n———————————————\n" + _errormsg.join('、'));
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
			el: $backupEmail,
			require: false,
			type: 'email',
			dbKey: 'backup_email',
			colName: '備用 E-Mail'
		},
		{
			el: $name,
			require: true,
			type: 'string',
			dbKey: 'name',
			colName: '姓名（中）'
		},
		{
			el: $engName,
			require: true,
			type: 'string',
			dbKey: 'eng_name',
			colName: '姓名（英）'
		},
		{
			el: $gender,
			require: true,
			type: 'radio',
			value: $(".gender:checked").val(),
			dbKey: 'gender',
			colName: '性別'
		},
		{
			el: $birthday,
			require: true,
			type: 'date',
			dbKey: 'birthday',
			colName: '生日'
		},
		{
			el: $birthLocation,
			require: true,
			type: 'string',
			dbKey: 'birth_location',
			colName: '出生國別'
		},
		{
			el: $specail,
			require: true,
			type: 'radio',
			value: $(".specail:checked").val(),
			dbKey:'special',
			colName: '身心障礙選項'
		},
		{
			el: $residentLocation,
			require: true,
			type: 'string',
			dbKey: 'resident_location',
			colName: '僑居地國別'
		},
		{
			el: $residentId,
			require: true,
			type: 'string',
			dbKey: 'resident_id',
			colName: '身分證號碼'
		},
		{
			el: $residentPassportNo,
			require: false,
			type: 'string',
			dbKey: 'resident_passport_no'
		},
		{ // 電話國碼，需驗證，合併在電話號碼一起送出。
			el: $residentPhoneCode,
			require: true,
			type: 'string',
			colName: '僑居地電話國碼'
		}, 
		{
			el: $residentPhone,
			require: true,
			type: 'string',
			dbKey: 'resident_phone',
			dbData: $residentPhoneCode.val() + ';' + $residentPhone.val(),
			colName: '僑居地電話號碼'
		},
		{ // 手機國碼，需驗證，合併在手機號碼一起送出。
			el: $residentCellphoneCode,
			require: true,
			type: 'string',
			colName: '僑居地手機國碼'
		},
		{
			el: $residentCellphone,
			require: true,
			type: 'string',
			dbKey: 'resident_cellphone',
			dbData: $residentCellphoneCode.val() + ';' + $residentCellphone.val(),
			colName: '僑居地手機號碼'
		},
		{
			el: $residentAddress,
			require: true,
			type: 'string',
			dbKey: 'resident_address',
			dbData: $residentAddress.val() + ';' + $residentOtherLangAddress.val(),
			colName: '僑居地地址'
		},
		{
			el: $residentOtherLangAddress,
			require: false,
			type: 'string'
		},
		{
			el: $taiwanIdType,
			require: false,
			type: 'string',
			dbKey: 'taiwan_id_type'
		},
		{
			el: $taiwanPassport,
			require: false,
			type: 'string',
			dbKey: 'taiwan_passport'
		},
		{
			el: $taiwanPhone,
			require: false,
			type: 'string',
			dbKey: 'taiwan_phone'
		},
		{
			el: $taiwanAddress,
			require: false,
			type: 'string',
			dbKey: 'taiwan_address'
		},
		{
			el: $schoolCountry,
			require: true,
			type: 'string',
			dbKey: 'school_country',
			colName: '學校所在地國家'
		},
		{
			el: $schoolType,
			require: false,
			type: 'string',
			dbKey: 'school_type',
			dbData: _currentSchoolType
		},
		{
			el: $schoolLocation,
			require: false,
			type: 'string',
			dbKey: 'school_locate',
			dbData: _currentSchoolLocate
		},
		{
			el: $schoolAdmissionAt,
			require: true,
			type: 'date',
			dbKey: 'school_admission_at',
			colName: '入學時間'
		},
		{
			el: $schoolGraduateAt,
			require: true,
			type: 'date',
			dbKey: 'school_graduate_at',
			colName: '畢業時間'
		},
		{
			el: $dadStatus,
			require: true,
			type: 'radio',
			value: _currentDadStatus,
			dbKey: 'dad_status',
			colName: '父親存歿'
		},
		{
			el: $momStatus,
			require: true,
			type: 'radio',
			value: _currentMomStatus,
			dbKey: 'mom_status',
			colName: '母親存歿'
		},
		{
			el: $twContactName,
			require: false,
			type: 'string',
			dbKey: 'tw_contact_name'
		},
		{
			el: $twContactRelation,
			require: false,
			type: 'string',
			dbKey: 'tw_contact_relation'
		},
		{
			el: $twContactPhone,
			require: false,
			type: 'string',
			dbKey: 'tw_contact_phone'
		},
		{
			el: $twContactAddress,
			require: false,
			type: 'string',
			dbKey: 'tw_contact_address'
		},
		{
			el: $twContactWorkplaceName,
			require: false,
			type: 'string',
			dbKey: 'tw_contact_workplace_name'
		},
		{
			el: $twContactWorkplacePhone,
			require: false,
			type: 'string',
			dbKey: 'tw_contact_workplace_phone'
		},
		{
			el: $twContactWorkplaceAddress,
			require: false,
			type: 'string',
			dbKey: 'tw_contact_workplace_address'
		}]

		// 海外僑生要填寫籍貫
		if (_identityId === 3) {
			formValidateList.push(
				{el: $homeTownProvince, require: true, type: 'string', dbKey: 'home_town', dbData: $homeTownProvince.val() + '省' + $homeTownCity.val() + '市', colName: '籍貫(省)'},
				{el: $homeTownCity, require: true, type: 'string', colName: '籍貫(市)'},
				{el: $whenToResident, require: false, type: 'string', dbKey: 'when_to_resident'},
				{el: $whereToResident, require: false, type: 'string', dbKey: 'where_to_resident'}
				);
		} else {
			formValidateList.push(
				{el: $homeTownProvince, require: false, type: 'string', dbKey: 'home_town', dbData: $homeTownProvince.val() + '省' + $homeTownCity.val() + '市'},
				{el: $homeTownCity, require: false, type: 'string'},
				{el: $whenToResident, require: false, type: 'string', dbKey: 'when_to_resident'},
				{el: $whereToResident, require: false, type: 'string', dbKey: 'where_to_resident'}
				);
		}

		// 身心障礙選項
		if ($(".specail:checked").val() === "1" && $disabilityCategory.val() === "-1") {
			formValidateList.push(
				{el: $otherDisabilityCategory, require: true, type: 'string', dbKey: 'disability_category', colName: '其他身心障礙類別'},
				{el: $disabilityLevel, require: true, type: 'string', dbKey: 'disability_level', colName: '身心障礙程度'}
				);
		} else if ($(".specail:checked").val() === "1") {
			formValidateList.push(
				{el: $disabilityCategory, require: true, type: 'string', dbKey: 'disability_category', colName: '身心障礙類別'},
				{el: $disabilityLevel, require: true, type: 'string', dbKey: 'disability_level', colName: '身心障礙程度'}
				);
		}

		// 父親不為「不詳」時增加的驗證
		if (_currentDadStatus !== "undefined") {
			formValidateList.push(
				{el: $dadName, require: true, type: 'string', dbKey: 'dad_name', colName: '父親姓名（中）'},
				{el: $dadEngName, require: true, type: 'string', dbKey: 'dad_eng_name', colName: '父親姓名（英）'},
				{el: $dadBirthday, require: true, type: 'date', dbKey: 'dad_birthday', colName: '父親生日'},
				{el: $dadHometown, require: false, type: 'string', dbKey: 'dad_hometown'},
				{el: $dadJob, require: true, type: 'string', dbKey: 'dad_job', colName: '父親職業'}
				);
		}

		// 母親不為「不詳」時增加的驗證
		if (_currentMomStatus !== "undefined") {
			formValidateList.push(
				{el: $momName, require: true, type: 'string', dbKey: 'mom_name', colName: '母親姓名（中）'},
				{el: $momEngName, require: true, type: 'string', dbKey: 'mom_eng_name', colName: '母親姓名（英）'},
				{el: $momBirthday, require: true, type: 'date', dbKey: 'mom_birthday', colName: '母親生日'},
				{el: $momHometown, require: false, type: 'string', dbKey: 'mom_hometown'},
				{el: $momJob, require: true, type: 'string', dbKey: 'mom_job', colName: '母親職業'}
				);
		}

		// 父母皆為「不詳」時，增加「監護人」驗證
		if (_currentDadStatus === "undefined" && _currentMomStatus === "undefined") {
			formValidateList.push(
				{el: $guardianName, require: true, type: 'string', dbKey: 'guardian_name', colName: '監護人姓名（中）'},
				{el: $guardianEngName, require: true, type: 'string', dbKey: 'guardian_eng_name', colName: '監護人姓名（英）'},
				{el: $guardianBirthday, require: true, type: 'date', dbKey: 'guardian_birthday', colName: '監護人生日'},
				{el: $guardianHometown, require: false, type: 'string', dbKey: 'guardian_hometown'},
				{el: $guardianJob, require: true, type: 'string', dbKey: 'guardian_job', colName: '監護人職業'}
				);
		}

		// 有證件類型再送 ID
		if ($taiwanIdType.val() !== "") {
			formValidateList.push(
				{el: $taiwanIdNo, require: false, type: 'string', dbKey: 'taiwan_id'}
				);
		}

		// 判斷 schoolName 要送 select 的還是 text 的
		if (_hasSchoolLocate) {
			formValidateList.push(
				{el: $schoolNameSelect, require: true, type: 'string', dbKey: 'school_name', colName: '學校名稱'}
				);
		} else {
			formValidateList.push(
				{el: $schoolNameText, require: true, type: 'string', dbKey: 'school_name', colName: '學校名稱'}
				);
		}

		// 學士班、港二技 需要送出學歷學制描述
		if (_systemId === 1 || _systemId === 2) {
			formValidateList.push(
				{el: $educationSystemDescription, require: true, type: 'string', dbKey: 'education_system_description', colName: '學制描述'}
				);
		} else {
			formValidateList.push(
				{el: $educationSystemDescription, require: false, type: 'string', dbKey: 'education_system_description', dbData: ''}
				);
		}

		// 判斷是否送主、輔修科目
		if (_systemId === 3 || _systemId === 4) {
			formValidateList.push(
				{el: $majorSubject, require: true, type: 'string', dbKey: 'major_subject', colName: '主修科目'},
				{el: $minorSubject, require: false, type: 'string', dbKey: 'minor_subject'}
				);
		}

		// 判斷是否送港二技的文憑類別與課程
		if (_systemId === 2) {
			formValidateList.push(
				{el: $twoYearTechDiploma, require: true, type: 'string', dbKey: 'two_year_tech_diploma', colName: '文憑類別'},
				{el: $twoYearTechClassName, require: true, type: 'string', dbKey: 'two_year_tech_class_name', colName: '課程名稱'},
				{el: $twoYearTechClassStart, require: true, type: 'string', dbKey: 'two_year_tech_class_start', colName: '課程開始日期'},
				{el: $twoYearTechClassEnd, require: false, type: 'string', dbKey: 'two_year_tech_class_end'},
				);
		} else {
			formValidateList.push(
				{el: $twoYearTechDiploma, require: false, type: 'string', dbKey: 'two_year_tech_diploma', dbData: ''},
				{el: $twoYearTechClassName, require: false, type: 'string', dbKey: 'two_year_tech_class_name', dbData: ''},
				{el: $twoYearTechClassStart, require: false, type: 'string', dbKey: 'two_year_tech_class_start', dbData: ''},
				{el: $twoYearTechClassEnd, require: false, type: 'string', dbKey: 'two_year_tech_class_end', dbData: ''},
				);
		}

		let _correct = true; // 格式正確
		let sendData = {}; // 送給後端的
		_errormsg = [];

		formValidateList.forEach((obj, index) => {
			if (obj.require) {
				if (_validateNotEmpty(obj)) {
					switch(obj.type) {
						case 'email':
						if (_validateEmail(obj)) {
							if (obj.dbKey) sendData[obj.dbKey] = _getDBData(obj);
							obj.el.removeClass('invalidInput');
						} else {
							_errormsg.push(obj.colName);
							_correct = false;
							obj.el.addClass('invalidInput');
						}
						break;
						case 'date':
						if (_validateDate(obj)) {
							if (obj.dbKey) sendData[obj.dbKey] = _getDBData(obj);
							obj.el.removeClass('invalidInput');
						} else {
							_errormsg.push(obj.colName);
							_correct = false;
							obj.el.addClass('invalidInput');
						}
						break;
						default:
						if (obj.dbKey) sendData[obj.dbKey] = _getDBData(obj);
						obj.el.removeClass('invalidInput');
					}
				} else {
					_errormsg.push(obj.colName);
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
							_errormsg.push(obj.colName);
							_correct = false;
							obj.el.addClass('invalidInput');
						}
						break;
						case 'date':
						if (_validateDate(obj)) {
							if (obj.dbKey) sendData[obj.dbKey] = _getDBData(obj);
							obj.el.removeClass('invalidInput');
						} else {
							_errormsg.push(obj.colName);
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
			return false;
		}
	}

})();
