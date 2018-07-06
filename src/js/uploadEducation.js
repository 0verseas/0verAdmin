(() => {

	const baseUrl = env.baseUrl + '/students';

	let _diplomaFiles = [];
	let _transcriptsFiles = [];
	let _modalFiletype = "";
	let _modalFilename = "";

	/**
	*	cache DOM
	*/

	const $uploadEducationForm = $('#form-uploadEducation');
	const $fileUpload = $uploadEducationForm.find('.file-upload');

	// 學歷證明
	const $diplomaBlockquote = $('#blockquote-diploma');
	const $diplomaFrom = $('#form-diploma');
	const $diplomaTitle = $('#title-diploma');
	const diplomaImgArea = document.getElementById('diplomaImgArea');

	// 成績單
	const $transcriptsBlockquote = $('#blockquote-transcripts');
	const $transcriptsForm = $('#form-transcripts');
	const $transcriptsTitle = $('#title-transcripts');
	const transcriptsImgArea = document.getElementById('transcriptsImgArea');

	// Modal
	const $imgModal = $('#imgModal');
	const $modalDetailImg = $('#img-modalDetail');
	const $modalDeleteBtn = $('#btn-modalDelete');

	// 重整按鈕
	const $saveBtn = $('#btn-save');

	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

	$fileUpload.on("change", _addImg);
	$modalDeleteBtn.on("click", _deleteImg);
	$saveBtn.on("click", function() {alert('儲存成功。'); window.location.reload();});
	

	function _init() {
		let files = student.getEducationFile()
		.then((res) => {
			if (res[0].ok && res[1].ok && res[2].ok) {
				return [res[0].json(), res[1].json(), res[2].json()];
			} else {
				throw res[0];
			}
		})
		.then((json) => {
			json[0].then((data) => {
				_diplomaFiles = data.student_diploma;
			});

			json[1].then((data) => {  
				_transcriptsFiles = data.student_transcripts;
			});

			Promise.all([json[0], json[1]]).then(() => {
				_renderImgArea();
			});

			json[2].then((data) => {
				if (data.student_qualification_verify.system_id === 2) {
					$diplomaBlockquote.show();
					$transcriptsBlockquote.show();
				}
			});
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
		
		$(":file").filestyle({
			htmlIcon: '<i class="fa fa-folder-open" aria-hidden="true"></i> ',
			btnClass: "btn-success",
			text: " 選擇圖片",
			input: false
		});
	}

	function _renderImgArea() {
		let diplomaAreaHTML = '';
		_diplomaFiles.forEach((file, index) => {
			diplomaAreaHTML += '<img class="img-thumbnail img-edu" src="' + baseUrl + '/diploma/' + file + '" data-toggle="modal" data-target=".img-modal" data-filetype="diploma" data-filename="' + file + '">';
		})
		diplomaImgArea.innerHTML = diplomaAreaHTML;

		let transcriptsAreaHTML = '';
		_transcriptsFiles.forEach((file, index) => {
			transcriptsAreaHTML += '<img class="img-thumbnail img-edu" src="' + baseUrl + '/transcripts/' + file + '" data-toggle="modal" data-target=".img-modal" data-filetype="transcripts" data-filename="' + file + '">';
		})
		transcriptsImgArea.innerHTML = transcriptsAreaHTML;

		const $eduImg = $uploadEducationForm.find('.img-edu');
		$eduImg.on("click", _showDetail);
	}

	function _addImg() {
		const uploadtype = $(this).data('uploadtype');
		const fileList = this.files;
		let sendData = new FormData();
		for (let i = 0; i < fileList.length; i++) {
			sendData.append('files[]', fileList[i]);
		}
		loading.start();
		student.uploadEducationFile(uploadtype, sendData)
		.then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				throw res;
			}
		})
		.then((json) => {
			if (uploadtype == "diploma") {
				_diplomaFiles = _diplomaFiles.concat(json.student_diploma);
			} else if (uploadtype == "transcripts") {
				_transcriptsFiles = _transcriptsFiles.concat(json.student_transcripts);
			}
		})
		.then(() => {
			_renderImgArea();
			loading.complete();
		})
		.catch((err) => {
			if (err.status && err.status === 401) {
				alert('請登入。');
				location.href = "./index.html";
			} else if (err.status && err.status === 400) {
				alert("圖片規格不符");
			}
			err.json && err.json().then((data) => {
				console.error(data.messages[0]);
				alert(data.messages[0]);
			})
			loading.complete();
		})
	}

	function _showDetail() {
		_modalFiletype = $(this).data('filetype');
		_modalFilename = $(this).data('filename');
		$modalDetailImg.attr("src", baseUrl + "/" + _modalFiletype + "/" +_modalFilename);
	}

	function _deleteImg() {
		var deleteConfirm = confirm("確定要刪除嗎？");
		if (deleteConfirm === true) {
			$imgModal.modal('hide');
			loading.start();
			student.deleteEducationFile(_modalFiletype, _modalFilename)
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					throw res;
				}
			})
			.then((json) => {
				if (_modalFiletype === "diploma") {
					_diplomaFiles = json.student_diploma;
				} else if (_modalFiletype === "transcripts") {
					_transcriptsFiles = json.student_transcripts;
				}
			})
			.then(() => {
				_renderImgArea();
				loading.complete();
			})
			.catch((err) => {
				if (err.status && err.status === 401) {
					alert('請登入。');
					location.href = "./index.html";
				} else if (err.status && err.status === 404) {
					alert("沒有這張圖片。");
				}
				err.json && err.json().then((data) => {
					console.error(data.messages[0]);
					alert(data.messages[0]);
				})
				loading.complete();
			})
		}
	}

})();
