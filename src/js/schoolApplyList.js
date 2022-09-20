(()=>{
    const $paginationContainer = $('#pagination-container'); // 分頁器區域
    const $applyList = $('#apply-list') // 請求列表
    
    const $rejectBtn = $('#reject-btn'); // 退還按鈕
    const $executeBtn = $('#execute-btn'); // 執行按鈕
    const $completedBtn = $('#completed-btn'); // 完成按鈕
    const $selectBtn = $('#select-btn'); // 選取按鈕

    // 編輯模板上傳檔案相關物件
    const $imgModal = $('#img-modal');
    const $imgModalBody= $('#img-modal-body');

    // 中文名稱陣列 方便 代碼轉換
    const action_array = ['','新增系所','更改系名','更換類組','合併系所'];
    const system_array = ['','學士班','港二技','碩士班','博士班'];
    const type_array = ['一般系所','重點產業系所','國際專修班'];
    const group_array = ['','第一類組','第二類組','第三類組'];

    let applyListArray = []; // 目前請求有哪些
    let currentApplyID = 0; // 當前請求的ID
    var username = ''; // 當前使用者帳號

    $rejectBtn.on('click', _handleReject)
    $completedBtn.on('click', _handleCompleted);
    $executeBtn.on('click', _handleExecute);

    $selectBtn.on('click', _handleSelect); // 全選按鈕
    $('#save-btn').on('click', _handleSave); // 暫存按鈕
    $('#verified-btn').on('click', _handleVerified); // 鎖定按鈕
    
    $('body').on('click', '.img-thumbnail', _handleShowFile);

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
            // 只有admin1可以執行請求
            username = User.getUserInfo().username;
            // console.log(username);
            if (username !== 'admin1') {
                $executeBtn.hide();
            }

            // 進行文憑列表分頁初始化渲染工作
            $paginationContainer.pagination({
                dataSource: applyListArray,
                pageSize: 50,
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
            const schoolTitle = (data.school.title) ?data.school.title:'';
            const action = action_array[data.action_id];
            const system = system_array[data.system_id];
            const type = type_array[data.dept_type];
            const group = group_array[data.group_code];
            const deptTitle = (data.dept_title) ?data.dept_title:'';
            const stage = (data.executed_at)? 'item-executed':((data.verified_at)? 'item-verified':0);
            
            let listHtml = `
                <div class="show-list row">
                    <h5 class="col-12" style="margin:10px; margin-bottom:-7px;">
                        <input type="checkbox" id="select-chk" value="${stage}" data-id=${data.id}> &nbsp;
                        #${index+1+((page-1)*10)} &nbsp;&nbsp; ${schoolTitle}`;
            if (stage == 'item-executed') {
                listHtml += `&nbsp;&nbsp; (已執行)`;
            } else if (stage == 'item-verified') {
                listHtml += `&nbsp;&nbsp; (已鎖定)`;
            }
            listHtml += `
                    </h5>
                    <div style="margin-right: 5px;">
                        <label for="apply-info"><span class="info-label"> 請求動作 </span></label>
                        <input type="text" id="apply-info" class="form-control action-type" data-id=${data.id} maxlength ="191" value="${action}" disabled>
                    </div>
                    <div style="margin-right: 5px;">
                        <label for="apply-info"><span class="info-label"> 系所學制 </span></label>
                        <input type="text" id="apply-info" class="form-control" maxlength ="191" value="${system}" disabled>
                    </div>
                    <div style="margin-right: 5px;">
                        <label for="apply-info"><span class="info-label"> 系所類型 </span></label>
                        <input type="text" id="apply-info" class="form-control" style="width:130px;" maxlength ="191" value="${type}" disabled>
                    </div>
                    <div style="margin-right: 5px;">
                        <label for="apply-info"><span class="info-label"><span style="color:red;">修正</span> 系所類型 </span></label>
                        <select class="form-control new_type" id="type-selector" data-id=${data.id}>
                            <option value=""></option>
                            <option value="0">一般系所</option>
                            <option value="1">重點產業系所</option>
                            <option value="2">國際專修部</option>
                        </select>
                    </div>
                    <div style="margin-right: 5px;">
                        <label for="apply-info"><span class="info-label"> 系所類組 </span></label>
                        <input type="text" id="apply-info" class="form-control" maxlength ="191" value="${group}" disabled>
                    </div>
                    <div style="margin-right: 5px;">
                        <label for="apply-info"><span class="info-label"> 核定系名 </span></label>
                        <input type="text" id="apply-info" class="form-control" style="width:250px;" maxlength ="191" value="${deptTitle}" disabled>
                    </div>
                    <div style="margin-right: 5px;">
                        <label for="apply-info"><span class="info-label"><span style="color:red;">修正</span> 核定系名 </span></label>
                        <input type="text" id="apply-info" class="form-control v_title" data-id=${data.id} style="width:250px;" maxlength ="191" value="${(data.verified_dept_title)? data.verified_dept_title:''}">
                    </div>
            `;

            switch (data.action_id) {
                case 1:
                    listHtml += `
                        <div style="margin-right: 5px;">
                            <label for="apply-info"><span class="info-label"> 原學系代碼(選填) </span></label>
                            <input type="text" id="apply-info" class="form-control org_id" data-id=${data.id} maxlength ="5" value="${(data.dept_id)? dept_id:''}">
                        </div>
                    `;
                    break;
                case 2:
                    listHtml += `
                        <div style="margin-right: 5px;">
                            <label for="apply-info"><span class="info-label"> 學系代碼 </span></label>
                            <input type="text" id="apply-info" class="form-control" maxlength ="5" value="${data.dept_id}" disabled>
                        </div>
                        <div style="margin-right: 5px;">
                        <label for="apply-info"><span class="info-label"> 新系所名稱 </span></label>
                        <input type="text" id="apply-info" class="form-control" style="width:250px;" maxlength ="191" value="${data.new_dept_title}" disabled>
                        </div>
                        <div style="margin-right: 5px;">
                            <label for="apply-info"><span class="info-label"><span style="color:red;">修正</span> 新系所名稱 </span></label>
                            <input type="text" id="apply-info" class="form-control new_title" data-id=${data.id} style="width:250px;" maxlength ="191" value="${(data.verified_new_dept_title)?data.verified_new_dept_title:''}">
                        </div>
                    `;
                    break;
                case 3:
                    listHtml += `
                        <div style="margin-right: 5px;">
                            <label for="apply-info"><span class="info-label"> 學系代碼 </span></label>
                            <input type="text" id="apply-info" class="form-control" maxlength ="5" value="${data.dept_id}" disabled>
                        </div>
                        <div style="margin-right: 5px;">
                        <label for="apply-info"><span class="info-label"> 新系所類組 </span></label>
                        <input type="text" id="apply-info" class="form-control" maxlength ="191" value="${group_array[data.new_group_code]}" disabled>
                        </div>
                        <div style="margin-right: 5px;">
                            <label for="apply-info"><span class="info-label"><span style="color:red;">修正</span> 新系所類組 </span></label>
                            <select class="form-control new_group" id="type-selector" data-id=${data.id}>
                                <option value=""></option>
                                <option value="1">第一類組</option>
                                <option value="2">第二類組</option>
                                <option value="3">第三類組</option>
                            </select>
                        </div>
                    `;
                    break;
                case 4:
                    listHtml += `
                        <div style="margin-right: 5px;">
                            <label for="apply-info"><span class="info-label"> 欲合併系所代碼1 </span></label>
                            <input type="text" id="apply-info" class="form-control" style="width:250px;" maxlength ="191" value="${data.conbine_dept_id_1}" disabled>
                        </div>
                        <div style="margin-right: 5px;">
                            <label for="apply-info"><span class="info-label"> 欲合併系所代碼2 </span></label>
                            <input type="text" id="apply-info" class="form-control" style="width:250px;" maxlength ="191" value="${data.conbine_dept_id_2}" disabled>
                        </div>
                    `;
                    break;
            }
            listHtml += `
                        <div style="margin-right: 5px;">
                            <label for="apply-info"><span class="info-label"> 核定公文 </span></label>
                            <div id="apply-info" class="form-control">
                    `;
            data.file.forEach(file => {
                if (file) {
                    const fileType = _getFileType(file.split('.')[1]);
                    if(fileType === 'img'){
                        listHtml += `
                                <a class="img-thumbnail"
                                style="margin-right: 5px;"
                                src="${env.baseUrl}/admins/school-apply-list/${data.id}-${file}/edit"
                                data-toggle="modal"
                                data-filename="${file}"
                                data-target=".img-modal"
                                data-filetype="img"
                                data-filelink="${env.baseUrl}/admins/school-apply-list/${data.id}-${file}/edit">
                                    <i class="fa fa-file-image-o" aria-hidden="true"></i>
                                </a>
                        `
                    } else {
                        listHtml += `
                                <a
                                    class="img-thumbnail non-img-file-thumbnail"
                                    data-toggle="modal"
                                    data-target=".img-modal"
                                    data-filelink="${env.baseUrl}/admins/school-apply-list/${data.id}-${file}/edit"
                                    data-filename="${file}"
                                    data-filetype="${fileType}"
                                    data-icon="fa-file-${fileType}-o"
                                >
                                    <i class="fa fa-file-${fileType}-o" data-filename="${file}" data-icon="fa-file-${fileType}-o" aria-hidden="true"></i>
                                </a>
                        `;
                    }
                }
            });
            listHtml += `
                            </div>
                        </div>
                        <div style="flex-grow: 1;">
                            <label for="apply-info"><span class="info-label"> 處理說明(上限2000字) </span></label>
                            <textarea class="form-control note" id="apply-info" data-id=${data.id} rows="3" style="width:100%; resize:both; min-width:150px;" placeholder="請輸入處理說明">${(data.note)? data.note:''}</textarea>
                        </div>
                    </div><hr>
            `;
            $applyList.append(listHtml);

            if (data.verified_dept_type=="0" || data.verified_dept_type=="1" || data.verified_dept_type=="2") {
                $(`.new_type[data-id='${data.id}']`).children(`[value=${data.verified_dept_type}]`).prop('selected', true);
            }
            if (data.verified_new_group_code) {
                $(`.new_group[data-id='${data.id}']`).children(`[value=${data.verified_new_group_code}]`).prop('selected', true);
            }
        });
    }

    // 退回請求事件
    function _handleReject(){
        if(confirm('確定要退回請求？')){
            openLoading();
            idSelected = [];
            conti = true; // 確認繼續退回
            $('input[id=select-chk]').each(function (index){
                if ($(this).prop('checked')) {
                    if($(this).val() == 'item-executed') {
                        alert('已執行的請求無法被退回，請聯繫資服組人員或取消勾選');
                        conti = false;
                        return;
                    } else if ($(this).val() == 'item-verified') {
                        if (confirm('欲退回的請求含有已鎖定的項目，是否確認退回？')) {
                            idSelected.push($(this).data('id'));
                        } else {
                            conti = false;
                            return;
                        }
                    } else {
                        idSelected.push($(this).data('id'));
                    }
                }
            });
            if (!conti){
                alert('已取消退回');
                stopLoading();
                return;
            }

            School.rejectApply(idSelected.toString())
            .then((res) => {
                if(res.ok) {
                    return res.json();
                } else {
                    throw res;
                }
            })
            .then((json) => {
                $imgModal.modal('hide');
                alert(json.messages);
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
        // console.log(username);
        if (username !== 'admin1') {
            alert('無操作權限！');
            return;
        } else {
            if(!confirm('確定要執行此請求？')) return;
            idSelected = [];
            conti = true;
            $('input[id=select-chk]').each(function (index){
                if ($(this).prop('checked')) {
                    if($(this).val() == 'item-verified') {
                        idSelected.push($(this).data('id'));
                    } else {
                        conti = false;
                        return;
                    }
                }
            });
            openLoading();

            // 檢查是否合法

            if (!conti){
                alert('僅可執行已鎖定、且未執行的請求！');
                stopLoading();
                return;
            }
            if (idSelected.length == 0){
                alert('請選取至少一項請求！');
                stopLoading();
                return;
            }

            // 執行請求
            School.executeApply(idSelected.toString())
            .then((res) => {
                if(res.ok) {
                    $imgModal.modal('hide');
                    alert('執行成功');
                } else {
                    throw res;
                }
            })
            .then(()=>{
                location.reload();
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
					src="${this.dataset.filelink}"
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

    function _handleSelect() {
        // console.log($('input[name=target]:checked').val());
        if ($selectBtn.html() == '選取') {
            $selectBtn.html('取消選取');
            switch ($('input[name=target]:checked').val()) {
                case 'all':
                    // console.log($('input[id=select-chk]'));
                    $('input[id=select-chk]').prop('checked', true);
                    break;
                case 'verified':
                    $('input[value=item-verified]').prop('checked', true);
                    break;
                case 'executed':
                    $('input[value=item-executed]').prop('checked', true);
                    break;
            }
        } else {
            $selectBtn.html('選取');
            $('input[id=select-chk]').prop('checked', false);
        }
    }

    async function _handleSave() {
        openLoading();
        // 取要送往後端的資料
        let data = await _validateForm();
        if (data.length > 0) {
            School.updateModify(data, 0)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw res;
                }
            })
            .then(async (json) => {
                // console.log(json);
                // swal({title:"儲存成功", type:"success", confirmButtonText: '確定'});
                alert('儲存成功！');
                location.reload();
                stopLoading();
            })
            .catch((err) => {
                err.json && err.json().then((data) => {
                    // console.error(data);
                    // swal({title: `ERROR`, text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false});
                });
                stopLoading();
            });
        } else {
            alert('請選擇至少一筆未鎖定/未執行的請求！');
            stopLoading();
            return;
        }
    }

    async function _handleVerified() {
        openLoading();
        // 取要送往後端的資料
        let data = await _validateForm();
        if (data.length < 1) {
            alert('請選擇至少一筆未鎖定/未執行的請求！');
            stopLoading();
            return;
        }
        School.updateModify(data, 1)
        .then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                throw res;
            }
        })
        .then(async (json) => {
            // console.log(json);
            // swal({title:"儲存成功", type:"success", confirmButtonText: '確定'});
            alert('資料已鎖定！');
            location.reload();
            stopLoading();
        })
        .catch((err) => {
            err.json && err.json().then((data) => {
                console.error(data);
                // swal({title: `ERROR`, text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false});
            });
            stopLoading();
        });
    }

    function _validateForm() {
        // 取要送往後端的資料
        let data = [];
        $('input[id=select-chk]').each(function (index){
            if ($(this).prop('checked')) {
                if($(this).val() != 'item-executed' && $(this).val() != 'item-verified') {
                    switch ($(`.action-type[data-id=${$(this).data('id')}]`).val()) {
                        case '新增系所':
                            data.push({
                                'id': $(this).data('id'),
                                'verified_dept_type': $(`.new_type[data-id=${$(this).data('id')}]`).find(':selected').val(),
                                'verified_dept_title': $(`.v_title[data-id=${$(this).data('id')}]`).val(),
                                'dept_id': $(`.org_id[data-id=${$(this).data('id')}]`).val(),
                                'note': $(`.note[data-id=${$(this).data('id')}]`).val()
                            });
                            break;
                        case '更改系名':
                            data.push({
                                'id': $(this).data('id'),
                                'verified_dept_type': $(`.new_type[data-id=${$(this).data('id')}]`).find(':selected').val(),
                                'verified_dept_title': $(`.v_title[data-id=${$(this).data('id')}]`).val(),
                                'verified_new_dept_title': $(`.new_title[data-id=${$(this).data('id')}]`).val(),
                                'note': $(`.note[data-id=${$(this).data('id')}]`).val()
                            });
                            break;
                        case '更換類組':
                            data.push({
                                'id': $(this).data('id'),
                                'verified_dept_type': $(`.new_type[data-id=${$(this).data('id')}]`).find(':selected').val(),
                                'verified_dept_title': $(`.v_title[data-id=${$(this).data('id')}]`).val(),
                                'verified_new_group_code': $(`.new_group[data-id=${$(this).data('id')}]`).find(':selected').val(),
                                'note': $(`.note[data-id=${$(this).data('id')}]`).val()
                            });
                            break;
                        case '合併系所':
                            data.push({
                                'id': $(this).data('id'),
                                'verified_dept_type': $(`.new_type[data-id=${$(this).data('id')}]`).find(':selected').val(),
                                'verified_dept_title': $(`.v_title[data-id=${$(this).data('id')}]`).val(),
                                'note': $(`.note[data-id=${$(this).data('id')}]`).val()
                            });
                            break;
                    }
                }
            }
        });
        // console.log(data);
        return data;
    }

})();