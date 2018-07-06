(() => {

	/**
	*	private variable
	*/

	let _systemId = 0;
	let _hasOlympia = false;
	let _hasAdmission = false;
	let _hasPlacement = false;

	/**
	*	cache DOM
	*/
	
	const $olympiaForm = $('#form-olympia');
	const $olympiaTbody = $('#tbody-olympia');
	const $admissionForm = $('#form-admission');
	const $admissionTbody = $('#tbody-admission');
	const $placementForm = $('#form-placement');
	const $placementTbody = $('#tbody-placement');
	const $noSelectForm = $('#form-no-select');
	const $previewPersonalDataBtn = $('#btn-previewPersonalData');
	const $previewPlacementListBtn = $('#btn-previewPlacementList');
	const $previewDataDiv = $('#div-previewData');

	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

	async function _init() {
		try {
			const progressResponse = await student.getStudentRegistrationProgress();
			if (!progressResponse.ok) { throw progressResponse; }
			const progressJson = await progressResponse.json();

			_systemId = progressJson.student_qualification_verify.system_id;

			if (_systemId === 1) {
				_hasOlympia = !!progressJson.student_olympia_aspiration_order && progressJson.student_misc_data.has_olympia_aspiration;
				_hasAdmission = !!progressJson.student_department_admission_selection_order && +progressJson.student_misc_data.join_admission_selection === 1;
				_hasPlacement = !!progressJson.student_department_admission_placement_apply_way ;
			} else if (_systemId === 2) {
				_hasAdmission = !!progressJson.student_two_year_tech_department_admission_selection_order && +progressJson.student_misc_data.join_admission_selection === 1;
			} else {
				_hasAdmission = !!progressJson.student_graduate_department_admission_selection_order && +progressJson.student_misc_data.join_admission_selection === 1;
			}

			if (!_hasOlympia && !_hasAdmission && !_hasPlacement) {
				$noSelectForm.show();
			} else {
				const admissionKey = [ // 個人申請在每個學制的 key
				"student_department_admission_selection_order",
				"student_two_year_tech_department_admission_selection_order",
				"student_graduate_department_admission_selection_order",
				"student_graduate_department_admission_selection_order"
				]
				
				if (_systemId === 1) { // 學士班，三種都有可能
					if (_hasOlympia) {
						const url = '/students/olympia-aspiration-order';
						const olympiaResponse = await student.getOrderResultList(url);
						if (!olympiaResponse.ok) { throw olympiaResponse; }
						const olympiaJson = await olympiaResponse.json();
						const olympiaList = olympiaJson.student_olympia_aspiration_order;
						let olympiaHTML = '';
						olympiaList.forEach((val, index) => {
							olympiaHTML += `
							<tr>
							<td>` + val.order + `</td>
							<td>` + val.department_data.card_code + `</td>
							<td>` + val.department_data.school.title + ' ' + val.department_data.title + `</td>
							</tr>
							`
						})
						$olympiaTbody.html(olympiaHTML);
						$olympiaForm.show();
					}
					if (_hasAdmission) {
						const url = '/students/admission-selection-order';
						const admissionResponse = await student.getOrderResultList(url);
						if (!admissionResponse.ok) { throw admissionResponse; }
						const admissionJson = await admissionResponse.json();
						const admissionList = admissionJson[admissionKey[(_systemId - 1)]];
						let admissionHTML = '';
						admissionList.forEach((val, index) => {
							let showId = (_systemId === 1) ? val.department_data.card_code : val.dept_id;
							admissionHTML += `
							<tr>
							<td>` + val.order + `</td>
							<td>` + showId + `</td>
							<td>` + val.department_data.school.title + ' ' + val.department_data.title + `</td>
							</tr>
							`
						})
						$admissionTbody.html(admissionHTML);
						$admissionForm.show();
					}
					// XXX: id 可能會變動
					// 如果 apply_way id 是 1, 11 ,79 （以香港中學文憑考試成績 (DSE)、以香港高級程度會考成績 (ALE)、以香港中學會考成績 (CEE)申請、以僑先部結業成績申請），就不顯示分發志願。
					if (_hasPlacement && (progressJson.student_misc_data.admission_placement_apply_way != 1 )) {
						const url = '/students/admission-placement-order';
						const placementResponse = await student.getOrderResultList(url);
						if (!placementResponse.ok) { throw placementResponse; }
						const placementJson = await placementResponse.json();
						const placementList = placementJson.student_department_admission_placement_order;
						let placementHTML = '';
						placementList.forEach((val, index) => {
							placementHTML += `
							<tr>
							<td>` + val.order + `</td>
							<td>` + val.department_data.card_code + `</td>
							<td>` + val.department_data.school.title + ' ' + val.department_data.title + `</td>
							</tr>
							`
						})
						$placementTbody.html(placementHTML);
						$placementForm.show();
					}
				} else { // 其他學制，只需判斷個人申請
					if (_hasAdmission) {
						const url = '/students/admission-selection-order';
						const admissionResponse = await student.getOrderResultList(url);
						if (!admissionResponse.ok) { throw admissionResponse; }
						const admissionJson = await admissionResponse.json();
						const admissionList = admissionJson[admissionKey[(_systemId - 1)]];
						let admissionHTML = '';
						admissionList.forEach((val, index) => {
							let showId = (_systemId === 1) ? val.department_data.card_code : val.dept_id;
							admissionHTML += `
							<tr>
							<td>` + val.order + `</td>
							<td>` + showId + `</td>
							<td>` + val.department_data.school.title + ' ' + val.department_data.title + `</td>
							</tr>
							`
						})
						$admissionTbody.html(admissionHTML);
						$admissionForm.show();
					}
				}
			}
			$previewPersonalDataBtn.attr('href', env.baseUrl + '/students/admission-paper/department-apply-form');

			// XXX: id 可能會變動
			// 如果 apply_way id 是 1, 11 ,79 （以香港中學文憑考試成績 (DSE)、以香港高級程度會考成績 (ALE)、以香港中學會考成績 (CEE)申請、以僑先部結業成績申請），就不讓按鈕運作。
			if ((progressJson.student_misc_data.admission_placement_apply_way == 1) ) {
				$previewPlacementListBtn.attr('onclick', 'event.preventDefault();');
			} else {
				$previewPlacementListBtn.attr('href', env.baseUrl + '/students/admission-paper/admission-placement-order-checklist');
			}
			
			if (_systemId !== 1) {
				$previewDataDiv.remove();
			}
			loading.complete();
		} catch(e) {
			if (e.status && e.status === 401) {
				alert('請登入。');
				location.href = "./index.html";
			} else if (e.status && e.status === 403) {
				e.json && e.json().then((data) => {
					alert(`ERROR: \n${data.messages[0]}\n` + '即將返回上一頁');
					window.history.back();
				})
			} else {
				e.json && e.json().then((data) => {
					console.error(data);
					alert(`ERROR: \n${data.messages[0]}`);
				})
			}
			loading.complete();
		}
	}

})();
