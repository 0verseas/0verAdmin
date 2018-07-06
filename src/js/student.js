const student = (() => {

	const baseUrl = env.baseUrl;

	function setHeader(headerData) {
		const $studentInfoHeader = $('#header-studentInfo');
		const $headerSystem = $studentInfoHeader.find('#headerSystem');
		const $headerIdentity = $studentInfoHeader.find('#headerIdentity');
		const $headerId = $studentInfoHeader.find('#headerId');

		headerData = headerData || {
			system: "",
			identity: "請重新整理。",
			id: ""
		}

		$headerSystem.html(headerData.system);
		$headerIdentity.html(headerData.identity);
		$headerId.html(headerData.id);
	}

	function getAdmissionCount () {
		return fetch(baseUrl + `/students/admission-count`, {
			method: 'GET'
		});
	}

	function getAdmissionCountDetail() {
		return fetch(baseUrl + `/students/admission-count/detail`, {
			method: 'GET'
		});
	}

	async function getCountryList() {
		if (localStorage.countryList && localStorage.countryList !== "") {
			return JSON.parse(localStorage.countryList);
		} else {
			try {
				const response = await fetch(baseUrl + `/country-lists`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					},
					credentials: 'include'
				})
				if (!response.ok) { throw response; }
				const json = await response.json();

				let group_to_values = await json.reduce(function (obj, item) {
					obj[item.continent] = obj[item.continent] || [];
					obj[item.continent].push({id: item.id, country: item.country});
					return obj;
				}, {});

				let groups = await Object.keys(group_to_values).map(function (key) {
					return {continent: key, country: group_to_values[key]};
				});

				localStorage.countryList = JSON.stringify(groups);
				return groups;
			} catch (e) {
				console.log('Boooom!!');
				console.log(e);
			}
		}
	}

	function getSchoolList(countryId) {
		return fetch(baseUrl + `/overseas-school-lists?country_id=` + countryId, {
			method: 'GET'
		});
	}

	function register(data) {
		return fetch(baseUrl + `/students/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}, 
			body: JSON.stringify(data),
			credentials: 'include'
		});
	}

	function isLogin() {
		return fetch(baseUrl + `/students/login`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
	}

	function login(data) {
		return fetch(baseUrl + `/students/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}, 
			body: JSON.stringify(data),
			credentials: 'include'
		});
	}

	function logout() {
		return fetch(baseUrl + `/students/logout`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
	}

	function verifyEmail(email, token) {
		return fetch(baseUrl + `/students/verify-email/${email}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			}, 
			credentials: 'include',
			body: JSON.stringify({ token })
		})
	}

	function resendEmail() {
		return fetch(baseUrl + `/students/verify-email`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}, 
			credentials: 'include'
		})
	}

	function getDeptApplicationDoc(schoolId, system, deptId) { // 接系所資料（暫時用在「上傳備審資料」上）
		return fetch(baseUrl + `/schools/` + schoolId + `/systems/` + system + `/departments/` + deptId, {
			method: 'GET'
		});
	}

	function sendResetPassword(data) {
		return fetch(baseUrl + `/students/reset-password`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
	}

	function resetPassword(data, email) {
		return fetch(baseUrl + `/students/reset-password/` + email, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
	}

	function checkResetPasswordToken(email, token) {
		return fetch(baseUrl + `/students/reset-password?email=` + email + `&token=` + token, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		})
	}

	function getStudentPersonalData() {
		return fetch(baseUrl + `/students/personal-data`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
	}

	function setStudentPersonalData(data) {
		return fetch(baseUrl + `/students/personal-data`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data),
			credentials: 'include'
		})
	}

	function getStudentEducationInfoData() {
		return fetch(baseUrl + `/students/education-background`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
	}

	function setStudentEducationInfoData(data) {
		return fetch(baseUrl + `/students/education-background`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data),
			credentials: 'include'
		})
	}

	function getOrderList(type) {
		return fetch(baseUrl + `/students/admission-order-list?type=` + type, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
	}

	function getOlympiaAspirationOrder() {
		var urls = [
		baseUrl + '/students/olympia-aspiration-order',
		baseUrl + '/students/admission-order-list?type=olympia'
		]
		const grabContent = url => fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
		return Promise.all(urls.map(grabContent))
	}

	function setOlympiaAspirationOrder(data) {
		return fetch(baseUrl + `/students/olympia-aspiration-order`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data),
			credentials: 'include'
		})
	}

	function getEducationFile() {
		var urls = [
		baseUrl + '/students/diploma',
		baseUrl + '/students/transcripts',
		baseUrl + '/students/registration-progress'
		]
		const grabContent = url => fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
		return Promise.all(urls.map(grabContent))
	}

	function uploadEducationFile(type, data) {
		return fetch(baseUrl + `/students/` + type, {
			method: 'POST',
			body: data,
			credentials: 'include'
		});
	}

	function deleteEducationFile(type, fileName) {
		return fetch(baseUrl + `/students/` + type + `/` + fileName, {
			method: 'DELETE',
			credentials: 'include'
		});
	}

	function getAdmissionSelectionOrder() {
		var urls = [
		baseUrl + '/students/admission-selection-order',
		baseUrl + '/students/admission-order-list?type=selection'
		]
		const grabContent = url => fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
		return Promise.all(urls.map(grabContent))
	}

	function getAdmissionSelectionWishOrder() {
		return fetch(baseUrl + `/students/admission-selection-order`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
	}

	function setAdmissionSelectionOrder(data) {
		return fetch(baseUrl + `/students/admission-selection-order`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data),
			credentials: 'include'
		})
	}

	// POST /students/verify-qualification
	function verifyQualification(data) {
		return fetch(`${baseUrl}/students/verify-qualification`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data),
			credentials: 'include'
		});
	}

	function getVerifyQualification() {
		return fetch(`${baseUrl}/students/verify-qualification`, {
			method: 'get',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		});
	}

	function getStudentAvailableApplyWayList() {
		return fetch(baseUrl + `/students/available-apply-way`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
	}

	function getStudentAdmissionPlacementApplyWay() {
		return fetch(baseUrl + `/students/admission-placement-apply-way`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
	}

	function setStudentAdmissionPlacementApplyWay(data) {
		return fetch(baseUrl + `/students/admission-placement-apply-way`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data),
			credentials: 'include'
		})
	}

	function getPlacementSelectionOrder() {
		var urls = [
		baseUrl + '/students/admission-placement-order',
		baseUrl + '/students/admission-order-list?type=placement'
		]
		const grabContent = url => fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
		return Promise.all(urls.map(grabContent))
	}

	function setPlacementSelectionOrder(data) {
		return fetch(baseUrl + `/students/admission-placement-order`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data),
			credentials: 'include'
		})
	}

	function SecondPlacementSelectionOrder(data) {
		return fetch(baseUrl + `/students/storeConfirm`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data),
			credentials: 'include'
		})
	}

	function getOrderResultList(url) {
		return fetch(baseUrl + url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
	}

	function getStudentRegistrationProgress() {
		return fetch(baseUrl + `/students/registration-progress`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
	}

	function setReviewItem({ student_id, dept_id, type_id, data }) {
		return fetch(`${baseUrl}/students/${student_id}/admission-selection-application-document/departments/${dept_id}/types/${type_id}/files`, {
			method: 'POST',
			body: data,
			credentials: 'include'
		})
	}

	function getReviewItem({ student_id, dept_id, type_id }) {
		return new Promise((resolve, reject) => {
			fetch(`${baseUrl}/students/${student_id}/admission-selection-application-document/departments/${dept_id}/types/${type_id}/files`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				},
				credentials: 'include'
			})
			.then((res) => {
				if (res.ok) {
					resolve(res.json());
				} else {
					reject(res);
				}
			})
		})
	}

	function delReviewItem({ student_id, dept_id, type_id, filename }) {
		return fetch(`${baseUrl}/students/${student_id}/admission-selection-application-document/departments/${dept_id}/types/${type_id}/files/${filename}`, {
			method: 'Delete',
			credentials: 'include'
		})
	}

	function dataConfirmation(data) {
		return fetch(baseUrl + `/students/data-confirmation`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data),
			credentials: 'include'
		})
	}

	function uploadAndSubmit() {
		return fetch(baseUrl + `/students/admission-selection-application-document-lock`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				confirmed: true
			}),
			credentials: 'include'
		})
	}

	return {
		setHeader,
		getAdmissionCount,
		getAdmissionCountDetail,
		getCountryList,
		getSchoolList,
		register,
		isLogin,
		login,
		logout,
		verifyEmail,
		resendEmail,
		getDeptApplicationDoc,
		sendResetPassword,
		resetPassword,
		checkResetPasswordToken,
		getStudentPersonalData,
		setStudentPersonalData,
		getStudentEducationInfoData,
		setStudentEducationInfoData,
		getOrderList,
		getOlympiaAspirationOrder,
		setOlympiaAspirationOrder,
		getEducationFile,
		uploadEducationFile,
		deleteEducationFile,
		getAdmissionSelectionOrder,
		getAdmissionSelectionWishOrder,
		setAdmissionSelectionOrder,
		verifyQualification,
		getVerifyQualification,
		getStudentAvailableApplyWayList,
		getStudentAdmissionPlacementApplyWay,
		setStudentAdmissionPlacementApplyWay,
		getStudentRegistrationProgress,
		getPlacementSelectionOrder,
		setPlacementSelectionOrder,
		getOrderResultList,
		dataConfirmation,
		setReviewItem,
		getReviewItem,
		delReviewItem,
		uploadAndSubmit,
		SecondPlacementSelectionOrder
	};

})();
