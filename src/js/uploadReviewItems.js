(() => {

	/**
	*	private variable
	*/

	let _system = 1;
	let _studentID;
	let _isDocumentLock = true; // 備審資料是否已提交
	let _wishList = [];
	let _orderIndex;
	let _schoolID;
	let _deptID;
	let _hasWorks = false; // 項目中是否有作品集，有的話要儲存作品集文字
	let _worksRequired = false;
	let _workTypeId; // 作品集的項目編號
	let _workUrls = [];

	/**
	*	cache DOM
	*/

	const $wishListWrap = $('#wrap-wishList');
	const $wishList = $('#wishList');
	const $uploadForm = $('#form-upload'); // 點下「上傳」按鈕後出現的表單
	const $deptId = $('#deptId'); // 顯示，志願代碼
	const $schoolName = $('#schoolName'); // 顯示，學校名稱
	const $deptName = $('#deptName'); // 顯示，系所名稱
	const $reviewItemsArea = $('#reviewItemsArea'); // 各備審項目
	const $downloadBtn = $('#btn-download'); // modal 下載按鈕
	const $imgModalBody= $('#img-modal-body'); // modal 本體
	const $saveBtn = $('#btn-save');
	const $exitBtn = $('#btn-exit');

	const wishList = document.getElementById('wishList');
	const reviewItemsArea = document.getElementById('reviewItemsArea');

	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

	$wishListWrap.on('click.edit', '.btn-wishEdit', _handleEditForm);
	$saveBtn.on('click', _handleSave);
	$exitBtn.on('click', _handleExit);
	$('body').on('change.upload', '.file-certificate', _handleUpload);
	$('body').on('click.showOriImg', '.img-thumbnail', _showOriImg);
	$('.btn-delImg').on('click', _handleDelImg);

	async function _init() {

		try {
			const response = await student.getAdmissionSelectionWishOrder();
			if (!response.ok) { throw response; }
			const orderJson = await response.json();

			_studentID = orderJson.id;
			_system = orderJson.student_qualification_verify.system_id;
			_isDocumentLock = !!orderJson.student_misc_data.admission_selection_document_lock_at;
			let key = '';
			switch (_system) {
				case 1:
					key = 'student_department_admission_selection_order';
				break;
				case 2:
					key = 'student_two_year_tech_department_admission_selection_order';
				break;
				case 3:
				case 4:
					key = 'student_graduate_department_admission_selection_order';
				break;
			}
			_wishList = orderJson[key];

			_renderWishList();
			loading.complete();
		} catch(e) {
			if (e.status && e.status === 401) {
				alert('請登入。');
				location.href = "./index.html";
			} else {
				e.json && e.json().then((data) => {
					console.error(data);
					alert(`ERROR: \n${data.messages[0]}`);
				})
			}
			loading.complete();
		}
	}

	function _renderWishList() {
		let wishHTML = '';
		_wishList.forEach((value, index) => {
			let showId = (_system === 1) ? value.department_data.card_code : value.department_data.id;
			wishHTML += `
				<tr class="table-warning">
					<td>${index + 1}</td>
					<td>${showId}</td>
					<td>${value.department_data.school.title} ${value.department_data.title}</td>
					<td class="text-right">
						<button type="button" class="btn btn-info btn-wishEdit" data-deptid="${value.dept_id}">
							<i class="fa fa-upload" aria-hidden="true"></i>
							<span class="hidden-sm-down"> 上傳</span>
						</button>
					</td>
				</tr>
			`

			if (_isDocumentLock) {
				wishHTML += `
					<tr>
						<td colspan="4">
							<h6>繳交狀況：</h6>
							<blockquote class="blockquote">
							`
				value.uploaded_file_list.forEach((doc, docIndex) => {
					const requiredBadge = (doc.required) ? '<span class="badge badge-danger">必繳</span>' : '<span class="badge badge-warning">選繳</span>';
					let filesNum = '';

					if (doc.type.name === "作品集") { // 作品集檔案
						filesNum = (doc.work_files.length + ' 份檔案');
					} else if (doc.paper === null) { // 非紙本資料
						filesNum = (doc.files.length + ' 份檔案');
					} else { // 紙本資料
						filesNum = '請於期限內寄紙本資料至指定收件處';
					}

					wishHTML += `
						${requiredBadge} ${doc.type.name}：${filesNum}<br />
					`
				});

				wishHTML += `
							</blockquote>
						</td>
					</tr>
					`
			}
		});
		$wishList.html(wishHTML);
	}

	function _handleEditForm() {
		loading.start();
		_hasWorks = false;
		const deptId = _deptID = $(this).data('deptid') || _deptID;
		_orderIndex = _wishList.findIndex(i => i.dept_id === (deptId + ""));

		if (_system === 1) {
			$deptId.text(_wishList[_orderIndex].department_data.card_code);
		} else {
			$deptId.text(_wishList[_orderIndex].department_data.id);
		}
		$schoolName.text(_wishList[_orderIndex].department_data.school.title);
		$deptName.text(_wishList[_orderIndex].department_data.title);

		let reviewItemHTML = '';
		let requiredBadge = '';

		_wishList[_orderIndex].uploaded_file_list.forEach((fileListItem, index) => {
			requiredBadge = (fileListItem.required === true) ? '<span class="badge badge-danger">必繳</span>' : '<span class="badge badge-warning">選繳</span>'
			if (fileListItem.type.name === "作品集") {
				_hasWorks = true;
				_worksRequired  = fileListItem.required;
				_workTypeId = fileListItem.type_id;
				_workUrls = (fileListItem.work_urls !== "") ? fileListItem.work_urls : [];

				let authorizationHTML = _getFileAreaHTML(fileListItem, "authorization_files");
				let worksHTML = _getFileAreaHTML(fileListItem, "work_files");

				reviewItemHTML += `
					<div class="row">
						<div class="col-12">
							<div class="card">
								<div class="card-header bg-primary text-white">
									${fileListItem.type.name} ${requiredBadge}
								</div>
								<div class="card-block">
									<blockquote class="blockquote">
										說明：${fileListItem.description}
									</blockquote>

									<div>
										<div class="form-group">
											<label class="text-danger" for="workName">* 作品名稱</label>
											<input type="text" class="form-control" id="workName" value="${fileListItem.name.replace(/"/g, '&quot;')}">
										</div>
										<div class="form-group">
											<label class="text-danger" for="workPosition">* 個人參與的職位或項目</label>
											<input type="text" class="form-control" id="workPosition" value="${fileListItem.position.replace(/"/g, '&quot;')}">
										</div>
										<div class="form-group">
											<label class="text-danger" for="workType">* 術科類型</label>
											<input type="text" class="form-control" id="workType" value="${fileListItem.work_type.replace(/"/g, '&quot;')}">
										</div>
										<div class="form-group">
											<label for="workMemo">備註</label>
											<textarea class="form-control" id="workMemo" rows="3">${fileListItem.memo}</textarea>
										</div>
										<div class="form-group">
											<label class="text-danger" for="workUrl">* 作品連結</label>
											<div class="input-group">
												<input type="text" class="form-control" id="workUrl">
												<span class="input-group-btn">
													<button class="btn btn-primary" type="button" id="btn-addWorkUrl">
														<i class="fa fa-plus" aria-hidden="true"></i>
													</button>
												</span>
											</div>
										</div>
										<div>已填寫連結：</div>
										<ul id="workUrls"></ul>
										<hr />
									</div>

									<h4 style="margin-bottom: 15px;">作品授權書</h4>
									<div class="row" style="margin-bottom: 15px;">
										<div class="col-12">
											<div>
												<a href="${env.baseUrl + '/forms/作品著作權切結書.pdf'}" class="btn btn-info" target="_blank">
													<i class="fa fa-download" aria-hidden="true"></i> 作品著作權切結書
												</a>
											</div>
											<div>
												<small class="text-danger">請下載作品著作權切結書填妥後親自簽名，並掃描成圖檔上傳作品及目錄中備查。</small>
											</div>
										</div>
									</div>
									<div class="row" style="margin-bottom: 15px;">
										<div class="col-12">
											<input type="file" class="filestyle file-certificate" data-workstype="authorization" data-type="${fileListItem.type_id}" data-deptid="${fileListItem.dept_id}" multiple>
										</div>
									</div>
									<div class="card">
										<div class="card-block">
											<h4 class="card-title"><span>已上傳授權書</span> <small class="text-muted">(點圖可放大或刪除)</small></h4>
											${authorizationHTML}
										</div>
									</div>
									<hr />

									<h4 style="margin-bottom: 15px;">作品集檔案</h4>
									<div class="row" style="margin-bottom: 15px;">
										<div class="col-12">
											<input type="file" class="filestyle file-certificate" data-workstype="works" data-type="${fileListItem.type_id}" data-deptid="${fileListItem.dept_id}" multiple>
										</div>
									</div>
									<div class="card">
										<div class="card-block">
											<h4 class="card-title"><span>已上傳作品檔案</span> <small class="text-muted">(點圖可放大或刪除)</small></h4>
											${worksHTML}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<hr>
				`
			} else if (!!fileListItem.paper) {
				console.log('paper');
				reviewItemHTML += `
					<div class="row">
						<div class="col-12">
							<div class="card">
								<div class="card-header bg-primary text-white">
									${fileListItem.type.name} ${requiredBadge}
								</div>
								<div class="card-block">
									<blockquote class="blockquote">
										說明：${fileListItem.description}
									</blockquote>

									<div class="card">
										<div class="card-block">
											<p>只接受紙本，請於 <span class="text-danger">${fileListItem.paper.deadline}</span> 前逕行寄送到下列地址</p>
											<dl class="row">
												<dt class="col-md-3 col-lg-2">收件人：</dt>
												<dd class="col-md-9 col-lg-10">${fileListItem.paper.recipient}</dd>
												<dt class="col-md-3 col-lg-2">地址：</dt>
												<dd class="col-md-9 col-lg-10">${fileListItem.paper.address}</dd>
												<dt class="col-md-3 col-lg-2">聯絡電話：</dt>
												<dd class="col-md-9 col-lg-10">${fileListItem.paper.phone}</dd>
												<dt class="col-md-3 col-lg-2">E-mail：</dt>
												<dd class="col-md-9 col-lg-10">${fileListItem.paper.email}</dd>
											</dl>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<hr>
				`
			} else {
				let filesHtml = _getFileAreaHTML(fileListItem, "files");
				reviewItemHTML += `
					<div class="row">
						<div class="col-12">
							<div class="card">
								<div class="card-header bg-primary text-white">
									${fileListItem.type.name} ${requiredBadge}
								</div>
								<div class="card-block">
									<blockquote class="blockquote">
										說明：${fileListItem.description}
									</blockquote>

									<div class="row" style="margin-bottom: 15px;">
										<div class="col-12">
											<input type="file" class="filestyle file-certificate" data-type="${fileListItem.type_id}" data-deptid="${fileListItem.dept_id}" multiple>
										</div>
									</div>

									<div class="card">
										<div class="card-block">
											<h4 class="card-title"><span>已上傳檔案</span> <small class="text-muted">(點圖可放大或刪除)</small></h4>
											${filesHtml}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<hr>
				`
			}
		})

		$reviewItemsArea.html(reviewItemHTML);

		if (_hasWorks) {
			_renderWorkUrlList();
			$('#btn-addWorkUrl').on('click', _handleAddWorkUrl);
			$('#workUrl').keyup((e) => { e.keyCode == 13 && _handleAddWorkUrl(); });
		}

		$(":file").filestyle({
			htmlIcon: '<i class="fa fa-folder-open" aria-hidden="true"></i> ',
			btnClass: "btn-success",
			text: " 選擇檔案",
			input: false
		});
		$wishListWrap.hide();
		$uploadForm.fadeIn();

		loading.complete();
	}

	function _getFileAreaHTML(fileListItem, fileListKey) {
		let html = '';
		fileListItem[fileListKey].forEach((fileName, index) => {
			const fileType = _getFileType(fileName.split('.')[1]);
			if (fileType === 'img') {
				html += `<img
					class="img-thumbnail"
					src="${env.baseUrl}/students/${_studentID}/admission-selection-application-document/departments/${fileListItem.dept_id}/types/${fileListItem.type_id}/files/${fileName}"
					data-toggle="modal"
					data-target=".img-modal"
					data-type="${fileListItem.type_id}"
					data-filelink="${env.baseUrl}/students/${_studentID}/admission-selection-application-document/departments/${fileListItem.dept_id}/types/${fileListItem.type_id}/files/${fileName}"
					data-filename="${fileName}"
					data-filetype="img"
				/> `;
			} else {
				html += `
					<div
						class="img-thumbnail non-img-file-thumbnail"
						data-toggle="modal"
						data-target=".img-modal"
						data-type="${fileListItem.type_id}"
						data-filelink="${env.baseUrl}/students/${_studentID}/admission-selection-application-document/departments/${fileListItem.dept_id}/types/${fileListItem.type_id}/files/${fileName}"
						data-filename="${fileName}"
						data-filetype="${fileType}"
						data-icon="fa-file-${fileType}-o"
					>
						<i class="fa fa-file-${fileType}-o" aria-hidden="true"></i>
					</div>
				`;
			}
		})
		return html;
	}

	function _handleAddWorkUrl() {
		let workUrl = $('#workUrl').val();
		var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
		var regex = new RegExp(expression);
		if (workUrl.match(regex)) {
			_workUrls.push(workUrl);
			$('#workUrl').val('');
		} else {
			alert("網址格式錯誤。");
		}
		_renderWorkUrlList();
	}

	function _handleRemoveUrl() {
		const workIndex = +$(this).data('workindex');
		_workUrls.splice(workIndex, 1);
		_renderWorkUrlList();
	}

	function _renderWorkUrlList() {
		let workUrlHTML = '';
		_workUrls.forEach((val, index) => {
			workUrlHTML += `
				<li>
					${val}
					<button class="btn btn-danger btn-sm btn-removeWorkUrl" data-workindex="${index}" type="button">
						<i class="fa fa-times" aria-hidden="true"></i>
					</button>
				</li>
			`
		})
		$('#workUrls').html(workUrlHTML);
		$('.btn-removeWorkUrl').on('click', _handleRemoveUrl);
	}

	async function _handleSave() {
		// 儲存按鈕在有作品集的狀況下才會作動，否則直接 pass
		if (_hasWorks) {
			const workTypeIndex = _wishList[_orderIndex].uploaded_file_list.findIndex(i => i.type_id === (+_workTypeId));
			// sendType: 判斷是否需要送資料、送的方式。
			// complete: 完整資料, empty: 傳送空資料（選繳清空資料用）。
			let sendType = '';
			if (_worksRequired) {
				// 必填的話，要填，要檢驗
				sendType = 'complete';
			} else {
				// 選填的話，檢查作品集欄位如果有填任何資料，要進行檢驗，否則傳送空值清資料
				let isEmpty = true; // 資料是不是空的
				if ($('#workName').val() !== "") { isEmpty = false; }
				if ($('#workPosition').val() !== "") { isEmpty = false; }
				if ($('#workType').val() !== "") { isEmpty = false; }
				if ($('#workMemo').val() !== "") { isEmpty = false; }
				if (_workUrls.length > 0) { isEmpty = false; }
				if (_wishList[_orderIndex].uploaded_file_list[workTypeIndex].authorization_files.length > 0) { isEmpty = false; }
				if (_wishList[_orderIndex].uploaded_file_list[workTypeIndex].work_files.length > 0) { isEmpty = false; }

				if (isEmpty) {
					sendType = 'empty';
				} else {
					sendType = 'complete';
				}
			}

			if (sendType === 'complete') {
				let correct = true;
				let errorMsg = [];
				if ($('#workName').val() === "") {
					correct = false;
					$('#workName').addClass('invalidInput');
					errorMsg.push('作品名稱');
				} else {
					$('#workName').removeClass('invalidInput');
				}
				if ($('#workPosition').val() === "") {
					correct = false;
					$('#workPosition').addClass('invalidInput');
					errorMsg.push('個人參與的職位或項目');
				} else {
					$('#workPosition').removeClass('invalidInput');
				}
				if ($('#workType').val() === "") {
					correct = false;
					$('#workType').addClass('invalidInput');
					errorMsg.push('術科類型');
				} else {
					$('#workType').removeClass('invalidInput');
				}

				// 作品連結、檔案擇一上傳。沒檔案，才強制上傳 url
				if (_wishList[_orderIndex].uploaded_file_list[workTypeIndex].work_files.length === 0 && _workUrls.length === 0) {
					correct = false;
					$('#workUrl').addClass('invalidInput');
					errorMsg.push('作品連結');
				} else {
					$('#workUrl').removeClass('invalidInput');
				}

				if (correct) {
					let data = new FormData();
					data.append('name', $('#workName').val());
					data.append('position', $('#workPosition').val());
					data.append('work_type', $('#workType').val());
					data.append('memo', $('#workMemo').val());

					if (_workUrls.length === 0) {
						data.append('urls', '');
					} else {
						_workUrls.forEach((val, index) => {
							data.append('urls[]', val);
						})
					}

					try {
						loading.start();
						const response = await student.setReviewItem({data, type_id: _workTypeId, dept_id: _deptID, student_id: _studentID});
						if (!response.ok) { throw response; }

						alert('儲存完成');
						loading.complete();
						window.location.reload();
					} catch(e) {
						e.json && e.json().then((data) => {
							console.error(data);
							alert(`ERROR: \n${data.messages[0]}`);
						})
						loading.complete();
					}
				} else {
					alert(errorMsg.join('、') + " 欄位必填");
				}
			} else if (sendType === 'empty') {
				let data = new FormData();
				data.append('name', '');
				data.append('position', '');
				data.append('work_type', '');
				data.append('memo', '');
				data.append('urls', '');

				try {
					loading.start();
					const response = await student.setReviewItem({data, type_id: _workTypeId, dept_id: _deptID, student_id: _studentID});
					if (!response.ok) { throw response; }

					alert('儲存完成');
					loading.complete();
					window.location.reload();
				} catch(e) {
					e.json && e.json().then((data) => {
						console.error(data);
						alert(`ERROR: \n${data.messages[0]}`);
					})
					loading.complete();
				}
			}
		} else {
			alert('儲存完成');
			loading.complete();
			window.location.reload();
		}
	}
	
	function _handleExit() {
		window.location.reload();
	}

	async function _handleUpload() {
		const type_id = $(this).data('type');
		const dept_id = $(this).data('deptid');
		const workType = ($(this).attr('data-workstype')) ? $(this).data('workstype') : false;

		const fileList = this.files;
		let data = new FormData();
		for (let i = 0; i < fileList.length; i++) {
			data.append('files[]', fileList[i]);
		}
		if (!!workType) {
			data.append('file_type', workType);
		}

		try {
			loading.start();
			const response = await student.setReviewItem({data, type_id, dept_id, student_id: _studentID});
			if (!response.ok) { throw response; }
			const responseJson = await response.json();

			const uploadFileItemIndex = _wishList[_orderIndex].uploaded_file_list.findIndex(i => i.type_id === (+responseJson.type_id ));
			if (!!workType) {
				if (workType === "authorization") {
					_wishList[_orderIndex].uploaded_file_list[uploadFileItemIndex].authorization_files = responseJson.authorization_files;
				} else if (workType === "works") {
					_wishList[_orderIndex].uploaded_file_list[uploadFileItemIndex].work_files = responseJson.work_files;
				}
			} else {
				_wishList[_orderIndex].uploaded_file_list[uploadFileItemIndex].files = _wishList[_orderIndex].uploaded_file_list[uploadFileItemIndex].files.concat(responseJson.files);
			}
			_handleEditForm();
			loading.complete();
		} catch(e) {
			e.json && e.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);
			})
			loading.complete();
		}
	}

	// 顯示檔案 modal
	function _showOriImg() {
		const type = this.dataset.type;
		const fileName = this.dataset.filename;
		const fileType = this.dataset.filetype;

		// 清空 modal 內容
		$imgModalBody.html('');

		// 是圖放圖，非圖放 icon
		if (fileType === 'img') {
			const src = this.src;

			$imgModalBody.html(`
				<img
					src="${src}"
					class="img-fluid rounded img-ori"
				>
			`);
		} else {
			const icon = this.dataset.icon;
			const fileLink = this.dataset.filelink;

			$imgModalBody.html(`
				<div>
					<i class="fa ${icon} non-img-file-ori" aria-hidden="true"></i>
				</div>

				<a class="btn btn-primary non-img-file-download" href="${fileLink}" target="_blank" >
					<i class="fa fa-download" aria-hidden="true"></i> 下載
				</a>
			`);
		}
		const fileListIndex = _wishList[_orderIndex].uploaded_file_list.findIndex(i => i.type_id === parseInt(type));
		const isWork = (_wishList[_orderIndex].uploaded_file_list[fileListIndex].type.name === "作品集") // 是不是作品集

		$('.btn-delImg').attr({
			'data-type': type,
			'data-filename': fileName,
			'data-iswork': isWork
		});
	}

	async function _handleDelImg() {
		if (!confirm('確定刪除？')) {
			return;
		}
		console.log("back to end",_studentID,_deptID,$(this).attr('data-type'),$(this).attr('data-filename'));
		try {
			loading.start();
			const response = await student.delReviewItem({
				student_id: _studentID,
				dept_id: _deptID,
				type_id: $(this).attr('data-type'),
				filename: $(this).attr('data-filename')
			});
			if (!response.ok) { throw response; }
			const responseJson = await response.json();

			const uploadFileItemIndex = _wishList[_orderIndex].uploaded_file_list.findIndex(i => i.type_id === (+responseJson[0].type_id ));
			if ($(this).attr('data-iswork') === "true") {
				_wishList[_orderIndex].uploaded_file_list[uploadFileItemIndex].authorization_files = responseJson[0].authorization_files;
				_wishList[_orderIndex].uploaded_file_list[uploadFileItemIndex].work_files = responseJson[0].work_files;
			} else {
				_wishList[_orderIndex].uploaded_file_list[uploadFileItemIndex].files = responseJson[0].files;
			}
			_handleEditForm();
			$('.img-modal').modal('hide');
			loading.complete();
		} catch(e) {
			e.json && e.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);
			})
			loading.complete();
		}
	}

	// 副檔名與檔案型態對應（回傳值須符合 font-awesome 規範）
	function _getFileType(fileNameExtension = '') {
		switch (fileNameExtension) {
			case 'doc':
			case 'docx':
				return 'word';

			case 'mp3':
				return 'audio';

			case 'mp4':
			case 'avi':
				return 'video';

			case 'pdf':
				return 'pdf';

			default:
				return 'img';
		}
	}

})();
