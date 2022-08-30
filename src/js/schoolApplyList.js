(()=>{
    const $paginationContainer = $('#pagination-container'); // 分頁器區域
    const $applyList = $('#apply-list') // 請求列表
    const $applyModal = $('#editApplyModal'); // 請求編輯模板
    const $refreshBtn = $('#refresh-btn'); // 請求編輯模板

    // 請求編輯模板物件
    const $action = $('#action') // 請求之動作
    const $system = $('#system') // 請求之系所學制
    const $departmentType = $('#department-type') // 請求之系所類型
    const $departmentGroup = $('#department-group') // 請求之系所類組
    const $departmentTitle = $('#department-title') // 請求之核定系名
    const $applyDetailedInput = $('.apply-detailed-input'); // 請求之詳細資訊輸入區域
    const $deptIdForm = $('#deptIdForm');
    const $changeDepartmentTitleForm = $('#changeDepartmentTitleForm');
    const $changeGroupCodeForm = $('#changeGroupCodeForm');
    const $ConbineDeptIdForm = $('#ConbineDeptIdForm');
    const $deptIdInput = $('#dept-id');
    const $oldDepeTitleInput = $('#old-dept-title');
    const $newDepeTitleInput = $('#new-dept-title');
    const $oldGroupCodeSelector = $('#old-group-code-selector');
    const $newGroupCodeSelector = $('#new-group-code-selector');
    const $conbineDeptIdInput1 = $('#conbine-dept-id-1');
    const $conbineDeptIdInput2 = $('#conbine-dept-id-2');
    
    const $rejectBtn = $('#reject-btn'); // 退還按鈕
    const $executeBtn = $('#execute-btn'); // 執行按鈕
    const $completedBtn = $('#completed-btn'); // 完成按鈕

    // 編輯模板上傳檔案相關物件
    const $uploadedFileArea = document.getElementById('uploadedFileArea');
    const $imgModal = $('#img-modal');
    const $imgModalBody= $('#img-modal-body');

    // 中文名稱陣列 方便 代碼轉換
    const action_array = ['','新增系所','更改系名','更換類組','合併系所'];
    const system_array = ['','學士班','港二技','碩士班','博士班'];
    const type_array = ['一般系所','重點產業系所','國際專修班'];
    const group_array = ['','第一類組','第二類組','第三類組'];

    let applyListArray = []; // 目前請求有哪些
    let $uploadedFiles = []; // 當前請求有哪些檔案
    let currentApplyID = 0; // 當前請求的ID
    let username = ''; // 當前使用者帳號

    $refreshBtn.on('click', init);
    $rejectBtn.on('click', _handleReject)
    $completedBtn.on('click', _handleCompleted);
    $executeBtn.on('click', _handleExecute);
    
    $('body').on('click', '.img-thumbnail', _handleShowFile);
    // 如果關閉已上傳檔案modal 依舊保持focus在文憑成績編輯modal上
    $imgModal.on('hidden.bs.modal', function(e){
        $('body').addClass('modal-open');
    });

    init();

    function init() {
        openLoading();
        School.getSchooApplyList()
        .then((res) => {
			if(res.ok) {
				return res.json();
			} else {
				throw res;
			}
		})
        .then((json) => {
            // console.log(json);
            applyListArray = json;

            // 進行文憑列表分頁初始化渲染工作
            $paginationContainer.pagination({
                dataSource: applyListArray,
                pageSize: 10,
                callback: function(applyListArray,pagination) {
                    _applyListTamplate(applyListArray, pagination.pageNumber);
                    const $editApplyInfoBtn = $('.btn-editApplyInfo'); // 新增編輯按鈕的觸發事件（開啟 Modal）
                    $editApplyInfoBtn.on('click', _handleEditModalShow);
                }
            });

            stopLoading();
		})
		.catch((err) => {
            stopLoading();
			err.json && err.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);
                location.reload();
			});
		});
    }

    // 請求列表轉換並渲染
    function _applyListTamplate(datas,page) {
        // 渲染 請求列表
        $applyList.html('');
        // console.log(datas);
        datas.forEach(function (data, index) {
            // console.log(data);
            const schoolCode = data.school_code;
            const schoolTitle = (data.school.title) ?data.school.title:'';
            const action = action_array[data.action_id];
            const system = system_array[data.system_id];
            const type = type_array[data.dept_type];
            const group = group_array[data.group_code];
            const deptTitle = (data.dept_title) ?data.dept_title:'';
            
            let listHtml = `<tr class="btn-editApplyInfo" data-id="${data.id}">`;
            listHtml += `<td>${index+1+((page-1)*10)}</td>`;
            listHtml += `<td>${schoolCode}</td>`;
            listHtml += `<td>${schoolTitle}</td>`;
            listHtml += `<td>${action}</td>`;
            listHtml += `<td>${system}</td>`;
            listHtml += `<td>${type}</td>`;
            listHtml += `<td>${group}</td>`;
            listHtml += `<td>${deptTitle}</td>`;
            listHtml += `<td><button class="btn btn-outline-info" id="btn-apply-edit"><i class="fa fa-search fa-fw" aria-hidden="true"></i> 點擊查看</button></td>`;
            listHtml += `<td></td>`;
            listHtml += `</tr>`
            $applyList.append(listHtml);
        });
    }

    // 開啟編輯model
    function _handleEditModalShow() {
        // show modal
        $applyModal.modal();
        // 只有admin1可以執行請求
        username = User.getUserInfo().username;
        if (username !== 'admin1') {
            $executeBtn.hide();
        }
        // 取得 請求的id
        currentApplyID = $(this).data('id');
        // 呼叫渲染文憑成績資料事件
        _setApplyData(currentApplyID);
    }

    // 渲染請求資訊到編輯模板
    function _setApplyData(id) {
        openLoading();
        School.getApplyInfo(id)
        .then((res) => {
			if(res.ok) {
				return res.json();
			} else {
				throw res;
			}
		})
        .then((json) => {
            // console.log(json[1]);
            const actionText = action_array[json[0].action_id];
            const systemText = system_array[json[0].system_id];
            const typeText = type_array[json[0].dept_type];
            const groupText = group_array[json[0].group_code];
            const departmentTitleText = (json[0].dept_title) ?json[0].dept_title:'';

            $action.val(actionText);
            $system.val(systemText);
            $departmentType.val(typeText);
            $departmentGroup.val(groupText);
            $departmentTitle.val(departmentTitleText);
            $deptIdInput.val(json[0].dept_id);
            $oldDepeTitleInput.val(json[0].old_dept_title);
            $newDepeTitleInput.val(json[0].new_dept_title);
            $oldGroupCodeSelector.val(json[0].old_group_code);
            $newGroupCodeSelector.val(json[0].new_group_code);
            $conbineDeptIdInput1.val(json[0].conbine_dept_id_1);
            $conbineDeptIdInput2.val(json[0].conbine_dept_id_2);

            $deptIdForm.hide();
            $changeDepartmentTitleForm.hide();
            $changeGroupCodeForm.hide();
            $ConbineDeptIdForm.hide();

            switch(json[0].action_id){
                case 1:
                    $applyDetailedInput.hide();
                    break;
                case 2:
                    $applyDetailedInput.show();
                    $deptIdForm.show();
                    $changeDepartmentTitleForm.show();
                    break;
                case 3:
                    $applyDetailedInput.show();
                    $deptIdForm.show();
                    $changeGroupCodeForm.show();
                    break;
                case 4:
                    $applyDetailedInput.show();
                    $ConbineDeptIdForm.show();
                    break;
            }
            $uploadedFiles = json[1];            
		}).then(()=>{
            _handleRenderFile();
            stopLoading();
        })
		.catch((err) => {
            stopLoading();
			err.json && err.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);
                location.reload();
			});
		});
    }

    // 退回請求事件
    function _handleReject(){
        if(confirm('確定要退回此請求？')){
            openLoading();
            School.rejectApply(currentApplyID)
            .then((res) => {
                if(res.ok) {
                    return res.json();
                } else {
                    throw res;
                }
            })
            .then((json) => {
                // console.log(json);
                $imgModal.modal('hide');
                alert('退回成功');
            })
            .then(()=>{
                location.reload();
            })
            .then(()=>{
                stopLoading();
            })
            .catch((err) => {
                err.json && err.json().then((data) => {
                    console.error(data);
                    alert(`ERROR: \n${data.messages[0]}`);
                    stopLoading();
                });
            });
        }
    }

    // 執行請求事件
    function _handleExecute() {
        if (username !== 'admin') {
            alert('無操作權限！');
            return;
        } else {
            School.executeApply(currentApplyID)
            .then((res) => {
                if(res.ok) {
                    return res.json();
                } else {
                    throw res;
                }
            })
            .then((json) => {
                // console.log(json);
                $imgModal.modal('hide');
                alert('執行成功');
            })
            .then(()=>{
                location.reload();
            })
            .then(()=>{
                stopLoading();
            })
            .catch((err) => {
                err.json && err.json().then((data) => {
                    console.error(data);
                    alert(`ERROR: \n${data.messages[0]}`);
                    stopLoading();
                });
            });
        }
        
    }

    // 完成請求事件
    function _handleCompleted() {
        if(confirm('確定要更新此請求為已完成？')){
            openLoading();
            School.updateApply(currentApplyID)
            .then((res) => {
                if(res.ok) {
                    return res.json();
                } else {
                    throw res;
                }
            })
            .then((json) => {
                // console.log(json);
                alert(json.messages[0]);
                stopLoading();
                location.reload();
            })
            .catch((err) => {
                err.json && err.json().then((data) => {
                    console.error(data);
                    alert(`ERROR: \n${data.messages[0]}`);
                    stopLoading();
                });
            });
        }
    }

    // 檔案渲染事件
    function _handleRenderFile() {
        let uploadedAreaHtml = '';
        $uploadedFiles.forEach((file) => {
            const fileType = _getFileType(file.split('.')[1]);
            if(fileType === 'img'){
                uploadedAreaHtml += `
                    <img
                        class="img-thumbnail"
                        src="${env.baseUrl}/admins/school-apply-list/${currentApplyID}-${file}/edit"
                        data-toggle="modal"
                        data-filename="${file}"
						data-target=".img-modal"
                        data-filetype="img"
                        data-filelink="${env.baseUrl}/admins/school-apply-list/${currentApplyID}-${file}/edit"
                    />
                `
            } else {
                uploadedAreaHtml += `
					<div
						class="img-thumbnail non-img-file-thumbnail"
						data-toggle="modal"
						data-target=".img-modal"
						data-filelink="${env.baseUrl}/admins/school-apply-list/${currentApplyID}-${file}/edit"
						data-filename="${file}"
                        data-filetype="${fileType}"
						data-icon="fa-file-${fileType}-o"
					>
						<i class="fa fa-file-${fileType}-o" data-filename="${file}" data-icon="fa-file-${fileType}-o" aria-hidden="true"></i>
					</div>
				`;
            }
        })
        $uploadedFileArea.innerHTML = uploadedAreaHtml;
    }

    // 檔案放大顯示事件
    function _handleShowFile() {
        // 取得點選的檔案名稱及類別
		const fileType = $(this).data('filetype');

		// 清空 modal 內容
		$imgModalBody.html('');

		// 是圖用 img tag pdf用 embed tag
		if (fileType === 'img') {
			$imgModalBody.html(`
				<img
					src="${this.src}"
					class="img-fluid rounded img-ori"
				>
			`);
		} else {
			$imgModalBody.html(`
				<div style="margin: 0 auto">
					<embed src="${this.dataset.filelink}" width="550" height="800" type="application/pdf">
				</div>
			`);
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