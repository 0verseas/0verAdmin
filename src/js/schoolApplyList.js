(()=>{
    const $unlockPaginationContainer = $('#unlock-pagination-container'); // 分頁器區域
    const $unlockApplyList = $('#unlock-apply-list'); // 請求列表

    const $lockedPaginationContainer = $('#locked-pagination-container'); // 分頁器區域
    const $lockedApplyList = $('#locked-apply-list'); // 請求列表

    const $executedPaginationContainer = $('#executed-pagination-container'); // 分頁器區域
    const $executedApplyList = $('#executed-apply-list'); // 請求列表

    const $completedPaginationContainer = $('#completed-pagination-container'); // 分頁器區域
    const $completedApplyList = $('#completed-apply-list'); // 請求列表

    const $returnedPaginationContainer = $('#returned-pagination-container'); // 分頁器區域
    const $returnedApplyList = $('#returned-apply-list'); // 請求列表

    const $selectBtn = $('#select-btn'); // 選取按鈕
    const $saveBtn = $('#save-btn'); // 儲存按鈕
    const $verifyBtn = $('#verify-btn'); // 鎖定按鈕
    const $returnBtn = $('#return-btn'); // 退還按鈕
    const $executeBtn = $('#execute-btn').hide(); // 執行按鈕
    const $completeBtn = $('#complete-btn').hide(); // 完成按鈕
    const $refreshBtn = $('#refresh-btn'); // 刷新按鈕

    // 編輯模板上傳檔案相關物件
    const $imgModal = $('#img-modal');
    const $imgModalBody = $('#img-modal-body');
    const $applicantModalBody = $('#applicant-modal-body');

    // 中文名稱陣列 方便 代碼轉換
    const action_array = ['','新增系所','更改系名','更換類組','合併系所'];
    const system_array = ['','學士班','港二技','碩士班','博士班'];
    const type_array = ['一般系所','重點產業系所','國際專修部'];
    const group_array = ['','第一類組','第二類組','第三類組'];

    let unlockApplyListArray = []; // 目前請求有哪些
    let lockedApplyListArray = []; // 目前請求有哪些
    let executedApplyListArray = []; // 目前請求有哪些
    let completedApplyListArray = []; // 目前請求有哪些
    let returnedApplyListArray = []; // 目前請求有哪些

    let selectedApplyListArray = []; // 目前選擇的請求有哪些

    let listType = $('.handle-btn-type.active').data('target').replace('#', ''); // 取得當前的分類頁面
    let username = ''; // 當前使用者帳號
    let currentListArray = [];
    

    $saveBtn.on('click', _handleSave); // 暫存按鈕
    $verifyBtn.on('click', _handleVerify); // 鎖定按鈕
    $returnBtn.on('click', _handleReturn) // 退回按鈕
    $executeBtn.on('click', _handleExecute);  // 執行按鈕
    $completeBtn.on('click', _handleComplete); // 完成按鈕
    $refreshBtn.on('click', _handleRefresh); // 刷新按鈕
    $selectBtn.on('click', async function (event) { // 全選按鈕
        _handleSelectAllItem();
    });
    
   
    $('#pills-tab button').on('click', async function (event) { // 分類按鈕
        $saveBtn.hide();
        $verifyBtn.hide();
        $returnBtn.hide();
        $executeBtn.hide();
        $completeBtn.hide();
        $selectBtn.hide();
        username = User.getUserInfo().username;
        
        selectedApplyListArray = [];
        if ($('#select-btn').html() == "取消全選") {
            $('#select-btn').html("全選");
        }
        listType = $(this).data('target').replace('#','');
        switch (listType) {
            case 'executed':
                $completeBtn.show();
                $selectBtn.show();
                break;
            case 'locked':
                $returnBtn.show();
                if (username === 'admin_IS') { // 更改爲資服組專用的帳號
                    $executeBtn.show();
                }
                $selectBtn.show();
                break;
            case 'unlock':
                $saveBtn.show();
                $verifyBtn.show();
                $returnBtn.show();
                $selectBtn.show();
                break;
        }
        await _getListArray();
        _renderList();
    })

    $('body').on('click', '.img-thumbnail', _handleShowFile); // 查看核定公文按鈕
    $('body').on('click', '.applicant', _handleShowApplicant); // 顯示申請人資料按鈕

    init();

    // 載入初始資料
    async function init() {
        await _getListArray();
        _renderList();
    }

    // 請求列表轉換並渲染
    function _applyListTamplate(datas, page) {
        // 渲染 請求列表
        $unlockApplyList.html('');
        $lockedApplyList.html('');
        $returnedApplyList.html('');
        $executedApplyList.html('');
        $completedApplyList.html('');
        $(document).ready(function() {  // 監聽可以更改的欄位
            $('.chkbox').on('change', function(event) {
                _handleSelectItem(event);
            });
            $('.verified_dept_type').on('change', function(event) {
                _handleTmpChange(event);
            });
            $('.verified_dept_title').on('change', function(event) {
                _handleTmpChange(event);
            });
            $('.dept_id').on('change', function(event) {
                _handleTmpChange(event);
            });
            $('.note').on('change', function(event) {
                _handleTmpChange(event);
            });
            $('.return_reason').on('change', function(event) {
                _handleTmpChange(event);
            });
        });
        
        datas.forEach(function (data, index) {
            const schoolTitle = (data.school.title)? data.school.title: '';
            const schoolCode = (data.school.id)? data.school.id: '';
            const action = action_array[data.action_id];
            const system = system_array[data.system_id];
            const type = type_array[data.dept_type];
            const group = group_array[data.group_code];
            const deptTitle = (data.dept_title) ?data.dept_title:'';
            const stage = (data.completed_at)? 'item-completed': ((data.executed_at)? 'item-executed': ((data.verified_at)? 'item-verified': ((data.returned_at)? 'item-returned': 'item-applied')));

            // 根據不同的請求賦予不同的屬性，好讓各請求使用不同的背景顏色做區分，可以更直觀的知道是什麼請求
            $(document).ready(function() {
                var actions = $(".action-type");

                actions.each(function() {
                    var action = $(this).val().trim();
                    switch (action) {
                        case "新增系所":
                            $(this).addClass("action-new");
                            break;
                        case "更改系名":
                            $(this).addClass("action-rename");
                            break;
                        case "更換類組":
                            $(this).addClass("action-change-group");
                            break;
                        case "合併系所":
                            $(this).addClass("action-merge");
                            break;
                    }
                });
            });

            let listHtml = ``;

            if (index % 2 === 0) {
                listHtml += `
                    <div class="row show-list odd">
                `;
            } else {
                listHtml += `
                    <div class="row show-list even">
                `;
            }

            listHtml += `
                <h5 class="col-12 apply-title" data-id=${data.id}>
                <label class="required-title-type" value=${stage}>
            `;

            if (data.returned_at == null && data.completed_at == null) {
                const isChecked = data.status === 'checked';
                listHtml += `
                    <input type="checkbox" class="chkbox" num=#${index+1+((page-1)*10)} data-id=${data.id} status=${data.status} value=${stage} ${isChecked ? 'checked' : 'uncheck'}> &nbsp;
                `;
            }

            listHtml += `
                #${index+1+((page-1)*10)} &nbsp; ${schoolTitle} (${schoolCode})
                <input type="text" class="form-control action-type" data-id=${data.id} maxlength="191" value="${action}" disabled>
                </label>
            `;

            listHtml += `
                    </h5>
                    <div class="col-8">
                        <div id="list-element">
                            <span class="info-label"> 系所學制 </span>
                            <input type="text" class="form-control apply-info" maxlength ="191" value="${system}" disabled>
                        </div>
                        <div id="list-element">
                            <span class="info-label"> 系所類組 </span>
                            <input type="text" class="form-control apply-info" maxlength ="191" value="${group}" disabled>
                        </div>
                        <div id="list-element">
                            <span class="info-label"> 系所類型 </span>
                            <input type="text" class="form-control apply-info" style="width:130px;" maxlength ="191" value="${type}" disabled>
                        </div>

                        <div id="list-element">
                            <span class="info-label"> 核定系名 </span>
                            <input type="text" class="form-control apply-info" style="width:250px;" maxlength ="191" value="${deptTitle}" disabled>
                        </div><br>
            `;

            if (stage == 'item-applied') {
                listHtml += `
                        <div id="list-element">
                            <span class="info-label"><span style="color:red;">修正</span> 系所類型 </span>
                            <select class="form-control type-selector verified_dept_type" data-id=${data.id}>
                                <option value=""></option>
                                <option value="0">一般系所</option>
                                <option value="1">重點產業系所</option>
                                <option value="2">國際專修部</option>
                            </select>
                        </div><br>
                        <div id="list-element">
                            <span class="info-label"><span style="color:red;">修正</span> 核定系名 </span>
                            <input type="text" class="form-control apply-info verified_dept_title" data-id=${data.id} style="width:250px;" maxlength ="191" value="${(data.verified_dept_title)? data.verified_dept_title:''}">
                        </div><br>
                `;
            } else {
                listHtml += `
                        <div id="list-element">
                            <span class="info-label"><span style="color:red;">修正</span> 系所類型 </span>
                            <select class="form-control type-selector verified_dept_type" data-id=${data.id} disabled>
                                <option value=""></option>
                                <option value="0">一般系所</option>
                                <option value="1">重點產業系所</option>
                                <option value="2">國際專修部</option>
                            </select>
                        </div><br>
                        <div id="list-element">
                            <span class="info-label"><span style="color:red;">修正</span> 核定系名 </span>
                            <input type="text" class="form-control apply-info verified_dept_title" data-id=${data.id} style="width:250px;" maxlength ="191" value="${(data.verified_dept_title)? data.verified_dept_title:''}" disabled>
                        </div><br>
                `;
            }

            switch (data.action_id) {
                case 1:
                    if (stage == 'item-applied') { // 加上已鎖定和已執行後可編輯的欄位判斷是否加以 disabled 屬性
                        listHtml += `
                        <div id="list-element">
                            <span class="info-label"><span style="color:red;"> 原系代碼</span>(選填) </span>
                            <input type="text" class="form-control apply-info dept_id" data-id=${data.id} maxlength ="5" value="${(data.dept_id)? data.dept_id:''}">
                        </div>
                        `;
                    } else {
                        listHtml += `
                        <div id="list-element">
                            <span class="info-label"><span style="color:red;"> 原系代碼</span>(選填) </span>
                            <input type="text" class="form-control apply-info dept_id" data-id=${data.id} maxlength ="5" value="${(data.dept_id)? data.dept_id:''}" disabled>
                        </div>
                        `;
                    }
                    break;
                case 2:
                        listHtml += `
                        <div id="list-element">
                            <span class="info-label"> 學系代碼 </span>
                            <input type="text" class="form-control apply-info" maxlength ="5" value="${data.dept_id}" disabled>
                        </div>
                        <div id="list-element">
                            <span class="info-label"> 新系所名稱 </span>
                            <input type="text" class="form-control apply-info" style="width:250px;" maxlength ="191" value="${data.new_dept_title}" disabled>
                        </div><br>
                        `;
                    break;
                case 3:
                    if (stage == 'item-applied') { // 加上已鎖定和已執行後可編輯的欄位判斷是否加以 disabled 屬性
                        listHtml += `
                        <div id="list-element">
                            <span class="info-label"> 學系代碼 </span>
                            <input type="text" class="form-control apply-info" maxlength ="5" value="${data.dept_id}" disabled>
                        </div>
                        <div id="list-element">
                            <span class="info-label"> 新系所類組 </span>
                            <input type="text" class="form-control apply-info" maxlength ="191" value="${group_array[data.new_group_code]}" disabled>
                        </div><br>
                        <div id="list-element">
                            <span class="info-label"><span style="color:red;">修正</span> 新系所類組 </span>
                            <select class="form-control type-selector verified_new_group_code" data-id=${data.id}>
                                <option value=""></option>
                                <option value="1">第一類組</option>
                                <option value="2">第二類組</option>
                                <option value="3">第三類組</option>
                            </select>
                        </div>
                        `;
                    } else {
                        listHtml += `
                        <div id="list-element">
                            <span class="info-label"> 學系代碼 </span>
                            <input type="text" class="form-control apply-info" maxlength ="5" value="${data.dept_id}" disabled>
                        </div>
                        <div id="list-element">
                            <span class="info-label"> 新系所類組 </span>
                            <input type="text" class="form-control apply-info" maxlength ="191" value="${group_array[data.new_group_code]}" disabled>
                        </div><br>
                        <div id="list-element">
                            <span class="info-label"><span style="color:red;">修正</span> 新系所類組 </span>
                            <select class="form-control type-selector verified_new_group_code" data-id=${data.id} disabled>
                                <option value=""></option>
                                <option value="1">第一類組</option>
                                <option value="2">第二類組</option>
                                <option value="3">第三類組</option>
                            </select>
                        </div>
                        `;
                    }
                    break;
                case 4:
                    listHtml += `
                        <div id="list-element">
                            <span class="info-label"> 欲合併系所代碼1 </span>
                            <input type="text" class="form-control apply-info" style="width:250px;" maxlength ="191" value="${data.conbine_dept_id_1}" disabled>
                        </div>
                        <div id="list-element">
                            <span class="info-label"> 欲合併系所代碼2 </span>
                            <input type="text" class="form-control apply-info" style="width:250px;" maxlength ="191" value="${data.conbine_dept_id_2}" disabled>
                        </div>
                    `;
                    break;
            }

            // 查看核定公文和顯示申請人資料改爲按鈕和 modal 的形式呈現
            listHtml += `
                    </div>
                    <div class="col-4">
                        <button class="info-button btn btn-info applicant"
                            data-toggle="modal"
                            data-target=".applicant-info-modal"
                            data-applicantname="${data.applicant_name}"
                            data-applicantphone="${data.applicant_phone}"
                            data-applicantemail="${data.applicant_email}">
                            顯示申請人資料
                        </button>
            `;

            data.file.forEach(file => {
                if (file) {
                    const fileType = _getFileType(file.split('.')[1]);

                    if (fileType === 'img') {
                        listHtml += `
                        <button class="info-button btn btn-primary img-thumbnail"
                        style="margin-right: 5px;"
                        src="${env.baseUrl}/admins/school-apply-list/${data.id}-${file}/edit"
                        data-toggle="modal"
                        data-filename="${file}"
                        data-target=".img-modal"
                        data-filetype="img"
                        data-filelink="${env.baseUrl}/admins/school-apply-list/${data.id}-${file}/edit">
                            查看核定公文
                        </button>
                        `;
                    } else {
                        listHtml += `
                        <button class="info-button btn btn-primary img-thumbnail non-img-file-thumbnail"
                        data-toggle="modal"
                        data-target=".img-modal"
                        data-filelink="${env.baseUrl}/admins/school-apply-list/${data.id}-${file}/edit"
                        data-filename="${file}"
                        data-filetype="${fileType}"
                        data-icon="fa-file-${fileType}-o">
                            查看核定公文
                        </button>
                        `;
                    }
                }
            });

            // 退回原因和處理說明
            if (stage == 'item-applied') { // 加上已鎖定和已執行後可編輯的欄位判斷是否加以 disabled 屬性
                listHtml += `
                    </div>
                    <div style="display:flex;" class="show-list handle-and-return col-12">
                        <div id="list-element" style="width: 400px;">
                            <span class="info-label"> 退回原因(上限1000字) </span>
                            <textarea class="form-control apply-info return_reason" data-id=${data.id} rows="3" style="width:100%; min-width:150px;" placeholder="請輸入退回請求的原因">${(data.return_reason)? data.return_reason:''}</textarea>
                        </div><br>
                        <div id="list-element" style="flex-grow: 1;">
                            <span class="info-label"> 處理說明(上限2000字) </span>
                            <textarea class="form-control apply-info note" data-id=${data.id} rows="3" style="width:100%; min-width:150px;" placeholder="請輸入處理說明">${(data.note)? data.note:''}</textarea>
                        </div>
                    </div>
                </div>
                <hr class="hr-type">
                `;
            } else {
                if (stage == 'item-verified') {
                    listHtml += `
                    </div>
                    <div style="display:flex;" class="show-list handle-and-return col-12">
                        <div id="list-element" style="width: 400px;">
                            <span class="info-label"> 退回原因(上限1000字) </span>
                            <textarea class="form-control apply-info return_reason" data-id=${data.id} rows="3" style="width:100%; min-width:150px;" placeholder="請輸入退回請求的原因">${(data.return_reason)? data.return_reason:''}</textarea>
                        </div><br>
                        <div id="list-element" style="flex-grow: 1;">
                            <span class="info-label"> 處理說明(上限2000字) </span>
                            <textarea class="form-control apply-info note" data-id=${data.id} rows="3" style="width:100%; min-width:150px;" placeholder="請輸入處理說明" disabled>${(data.note)? data.note:''}</textarea>
                        </div>
                    </div>
                </div>
                <hr class="hr-type">
                    `;
                } else {
                    listHtml += `
                    </div>
                    <div style="display:flex;" class="show-list handle-and-return col-12">
                        <div id="list-element" style="width: 400px;">
                            <span class="info-label"> 退回原因(上限1000字) </span>
                            <textarea class="form-control apply-info return_reason" data-id=${data.id} rows="3" style="width:100%; min-width:150px;" placeholder="請輸入退回請求的原因" disabled>${(data.return_reason)? data.return_reason:''}</textarea>
                        </div><br>
                        <div id="list-element" style="flex-grow: 1;">
                            <span class="info-label"> 處理說明(上限2000字) </span>
                            <textarea class="form-control apply-info note" data-id=${data.id} rows="3" style="width:100%; min-width:150px;" placeholder="請輸入處理說明" disabled>${(data.note)? data.note:''}</textarea>
                        </div>
                    </div>
                </div>
                <hr class="hr-type">
                    `;
                }
            }

            switch (listType){
                case 'returned':
                    $returnedApplyList.append(listHtml);
                    break;
                case 'completed':
                    $completedApplyList.append(listHtml);
                    break;
                case 'executed':
                    $executedApplyList.append(listHtml);
                    break;
                case 'locked':
                    $lockedApplyList.append(listHtml);
                    break;
                case 'unlock':
                    $unlockApplyList.append(listHtml);
                    break;
            }
            if (data.verified_dept_type=="0" || data.verified_dept_type=="1" || data.verified_dept_type=="2") {
                $(`.verified_dept_type[data-id='${data.id}']`).children(`[value=${data.verified_dept_type}]`).prop('selected', true);
            }
            if (data.verified_new_group_code) {
                $(`.verified_new_group_code[data-id='${data.id}']`).children(`[value=${data.verified_new_group_code}]`).prop('selected', true);
            }
        });
    }

    // 儲存修正事件
    async function _handleSave() {
        if(await _confirmExec("確認要儲存修改嗎？")) {
            openLoading();
            // 取要送往後端的資料
            let data = await _validateForm(selectedApplyListArray);
            if (data.length > 0) {
                School.updateApply(data, 0)
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    } else {
                        throw res;
                    }
                })
                .then(async (json) => {
                    await swal({title: "儲存成功", type: 'success', confirmButtonText: '確定'});
                    location.reload();
                    stopLoading();
                })
                .catch((err) => {
                    err.json && err.json().then((data) => {
                        swal({title: 'ERROR', text: data.messages[0], type: 'error', confirmButtonText: "確定", allowOutsideClick: false});
                    });
                    stopLoading();
                });
            } else {
                await swal({title: "錯誤", text: "請選擇至少一筆未鎖定/未執行的請求！", type: 'warning', confirmButtonText: "確定"});
                stopLoading();
                return;
            }
        }
    }

    // 確認鎖定事件
    async function _handleVerify() {
        if(await _confirmExec("確認要儲存修改並鎖定資料嗎？")) {
            openLoading();
            // 取要送往後端的資料
            let data = await _validateForm(selectedApplyListArray);
            if (data.length > 0) {
                School.updateApply(data, 1)
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    } else {
                        throw res;
                    }
                })
                .then(async (json) => {
                    await swal({title: "資料已鎖定！", type: 'success', confirmButtonText: "確定"});
                    location.reload();
                    stopLoading();
                })
                .catch((err) => {
                    err.json && err.json().then((data) => {
                        swal({title: 'ERROR', text: data.messages[0], type: 'error', confirmButtonText: "確定", allowOutsideClick: false});
                    });
                    stopLoading();
                });
            } else {
                await swal({title: "錯誤", text: "請選擇至少一筆未鎖定/未執行的請求！", type: 'warning', confirmButtonText: "確定"});
                stopLoading();
                return;
            }
        }
    }

    // 退回請求事件
    async function _handleReturn(){
        let msg = '';
        let reason_empty = 0; // 計算有多少退回原因是空的
        let data = selectedApplyListArray;

        switch (listType) { // 根據分類頁面執行退回請求的時候對應不同的提示框標題
            case 'unlock':
                msg = "確認要退回請求嗎？";
                break;
            case 'locked':
                msg = "這裏是已鎖定的請求項目。<br\>確定要退回嗎?";
                break;
        }
        if(await _confirmExec(msg)) {
            openLoading();
            if (data.length > 0) { // 有勾選請求項目
                // 計算沒填寫退回原因的請求項目
                for (let i = 0; i < data.length; i++) { 
                    if (data[i].return_reason == null || data[i].return_reason == '') {
                        reason_empty++;
                    }
                }

                if (reason_empty > 0 && reason_empty != data.length) { // 所選請求項目裏有些沒填寫退回請求
                    if (await _confirmExec("有請求沒有填寫退回原因。<br\>需要繼續進行退回請求嗎?")) {
                        // 先儲存退回原因再退回請求
                        School.returnApply(data)
                        .then((res) => {
                            if(res.ok) {
                                return res.json();
                            } else {
                                throw res;
                            }
                        })
                        .then((json) => {
                            $imgModal.modal('hide');
                            swal({title: json.messages[0], type: 'success', confirmButtonText: "確定", allowOutsideClick: false}).then(() => {
                                location.reload();
                                stopLoading();
                                return;
                            });
                        });
                    }
                } else if (reason_empty == data.length){ // 所選的請求項目都沒有填退回原因
                    await swal({title: "錯誤", text: "所選的請求都沒有填寫退回原因！", type:"warning", confirmButtonText: '確定', allowOutsideClick: false}).then(() => {
                        stopLoading();
                        return;
                    });
                } else { // 所選項目都有填寫退回請求
                    // 先儲存退回原因再退回請求
                    School.returnApply(data)
                    .then((res) => {
                        if(res.ok) {
                            return res.json();
                        } else {
                            throw res;
                        }
                    })
                    .then((json) => {
                        $imgModal.modal('hide');
                        swal({title: json.messages[0], type: 'success', confirmButtonText: "確定", allowOutsideClick: false}).then(() => {
                            location.reload();
                            stopLoading();
                            return;
                        });
                    });
                }
            } else { // 完全沒有勾選請求項目
                await swal({title: "錯誤", text: "請選擇至少一筆未執行的請求！", type:"warning", confirmButtonText: '確定', allowOutsideClick: false}).then(() => {
                    // location.reload();
                    stopLoading();
                    return;
                });
            }
        }
    }

    // 執行請求事件
    async function _handleExecute() {
        if (username !== 'admin_IS') { // 更改爲資服組專用的帳號
            await swal({title: "無操作權限！", type: 'error', confirmButtonText: "確定", allowOutsideClick: false});
            return;
        } else {
            if(await _confirmExec("確認要執行請求嗎？")) {
                openLoading();
                let idSelected = [];

                if (selectedApplyListArray.length == 0){
                    await swal({title: "錯誤",text: "請選取至少一項已鎖定的請求！", type: 'warning', confirmButtonText: "確定", allowOutsideClick: false}).then(() => {
                        stopLoading();
                        return;
                    });
                } else {
                    for (let i = 0; i < selectedApplyListArray.length; i++) { 
                        idSelected.push(selectedApplyListArray[i].id);
                    }

                    // 檢查例外
                    let res = await School.checkApply(idSelected.toString());
                    if(res) {
                        $imgModal.modal('hide');
                        let errmsg = '';
                        res.forEach(el => {
                            let data = el.split(',');
                            let label = [];
                            for(let i = 0; i < selectedApplyListArray.length; i++) {
                                if (selectedApplyListArray[i].id == data[0]) {
                                    label.push(selectedApplyListArray[i].num);
                                }
                            }
                            
                            for (let i=0; i<label.length; i++) {
                                if(label[i].includes('#')) {
                                    errmsg += `${label[i]} ${data[1]}<br\>`;
                                    break;
                                }
                            }
                        });
                        if(errmsg.length > 0) {
                            await swal({
                                title: "發現例外情況<br>" + errmsg + "是否要繼續執行？",
                                type: 'warning',
                                showCancelButton: true,
                                confirmButtonText: "繼續",
                                cancelButtonText: "取消",
                                reverseButtons: true,
                                allowOutsideClick: false
                            }).then(async (result) => { // 調整成發現例外情況再選擇繼續後，直接執行操作
                                if (result) {
                                    res = School.executeApply(idSelected.toString());
                                    $imgModal.modal('hide');
                                    await swal({title: "執行成功", type: 'success', confirmButtonText: "確定", allowOutsideClick: false});
                                    location.reload();
                                    _handleRefresh();
                                    stopLoading();
                                    return;
                                }
                            }).catch(async (err) => { // 當發現例外情況再選擇取消後的操作
                                if (err == 'cancel') {
                                    await swal({
                                        title: "已取消執行",
                                        type: 'success',
                                        confirmButtonText: "確定",
                                        allowOutsideClick: false
                                    });
                                    // location.reload();
                                    stopLoading();
                                    return
                                }
                                err.json && err.json().then(async (data) => {
                                    await swal({title: data.messages, type: 'error', confirmButtonText: "確定", allowOutsideClick: false}).then(() => {
                                        // location.reload();
                                        stopLoading();
                                        return;
                                    });
                                });
                            });
                            // location.reload();
                            stopLoading();
                            return;
                        } else { // 新增當沒有出現例外情況的操作
                            res = await School.executeApply(idSelected.toString());
                            if (res.ok) {
                                $imgModal.modal('hide');
                                await swal({
                                    title: '執行成功',
                                    type: "success",
                                    confirmButtonText: '確定',
                                    allowOutsideClick: false
                                });
                                location.reload();
                                _handleRefresh();
                                stopLoading();
                            } else {
                                await swal({
                                    title: '執行途中發生錯誤',
                                    type: "error",
                                    confirmButtonText: '確定',
                                    allowOutsideClick: false
                                });
                                stopLoading();
                            }
                        }
                    }
                }
            }
        }
    }

    // 完成請求事件
    async function _handleComplete() {
        if(await _confirmExec("確認要完成請求嗎？")) {
            openLoading();
            let idSelected = [];
            
            if (selectedApplyListArray.length == 0){ // 利用多一個控制值來判斷是否爲沒有選取任何項目
                await swal({title: "錯誤", text: "請選取至少一項請求！", type: 'warning', confirmButtonText: "確定", allowOutsideClick: false}).then(() => {
                    location.reload();
                    stopLoading();
                    return;
                });
            } else {
                for (let i = 0; i < selectedApplyListArray.length; i++) { 
                    idSelected.push(selectedApplyListArray[i].id);
                }
                
                // 檢查例外
                School.completeApply(idSelected.toString())
                .then((res) => {
                    if(res.ok) {
                        return res.json();
                    } else {
                        throw res;
                    }
                })
                .then((json) => {
                    $imgModal.modal('hide');
                    swal({title: json.messages[0], type: 'success', confirmButtonText: "確定", allowOutsideClick: false}).then(() => {
                        location.reload();
                        stopLoading();
                        return;
                    });
                })
                .catch((err) => {
                    err.json && err.json().then((data) => {
                        swal({title: "錯誤", text: data.messages[0], type: 'warning', confirmButtonText: "確定", allowOutsideClick: false}).then(() => {
                            location.reload();
                            stopLoading();
                            return;
                        });
                    });
                });
            }

            
        }
    }

    // 刷新清單事件
    async function _handleRefresh(){
        await _getListArray();
        _renderList();
        return;
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

    // 申請人資料顯示事件
    function _handleShowApplicant() {
		// 清空 modal 內容
        $applicantModalBody.html('');
        $applicantModalBody.html(`
            <div>
                <span class="info-label"> 申請人姓名 </span>
                <input id="applicantname-modal-body" type="text" id="applicant-name" class="form-control" maxlength="191" value="${this.dataset.applicantname}" disabled style="width: 100%;">
            </div><br>
            <div>
                <span class="info-label"> 申請人電話 </span>
                <input id="applicantphone-modal-body" type="text" id="applicant-phone" class="form-control" maxlength="191" value="${this.dataset.applicantphone}" disabled style="width: 100%;">
            </div><br>
            <div>
                <span class="info-label"> 申請人信箱 </span>
                <input id="applicantemail-modal-body" type="text" id="applicant-email" class="form-control" maxlength="191" value="${this.dataset.applicantemail}" disabled style="width: 100%;">
            </div><br>
		`);
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

    // 暫存未刷新頁面的資料事件
    function _handleTmpChange(event) {
        switch (listType) {
            case 'unlock':
                currentListArray = unlockApplyListArray;
                break;
            case 'lock':
                currentListArray = lockedApplyListArray;
                break;
            case 'executed':
                currentListArray = executedApplyListArray;
                break;
        }
        const itemId = $(event.target).data('id');
        const itemIndex = currentListArray.findIndex(item => item.id === itemId);
        let tmp_verified_dept_type = $(`.verified_dept_type[data-id=${$(event.target).data('id')}]`).find(':selected').val();
        let tmp_verified_dept_title = $(`.verified_dept_title[data-id=${$(event.target).data('id')}]`).val();
        let tmp_dept_id = $(`.dept_id[data-id=${$(event.target).data('id')}]`).val();
        let tmp_new_dept_title = $(`.new_dept_title[data-id=${$(event.target).data('id')}]`).val();
        let tmp_verified_new_group_code = $(`.verified_new_group_code[data-id=${$(event.target).data('id')}]`).find(':selected').val();
        let tmp_note = $(`.note[data-id=${$(event.target).data('id')}]`).val();
        let tmp_return_reason = $(`.return_reason[data-id=${$(event.target).data('id')}]`).val();
        
        if (itemIndex !== -1) {
            currentListArray[itemIndex]['verified_dept_type'] = tmp_verified_dept_type;
            currentListArray[itemIndex]['verified_dept_title'] = tmp_verified_dept_title;
            currentListArray[itemIndex]['dept_id'] = tmp_dept_id;
            currentListArray[itemIndex]['new_dept_title'] = tmp_new_dept_title;
            currentListArray[itemIndex]['verified_new_group_code'] = tmp_verified_new_group_code;
            currentListArray[itemIndex]['note'] = tmp_note;
            currentListArray[itemIndex]['return_reason'] = tmp_return_reason;
        }

        switch (listType) {
            case 'unlock':
                unlockApplyListArray = currentListArray;
                break;
            case 'locked':
                lockedApplyListArray = currentListArray;
                break;
            case 'executed':
                executedApplyListArray = currentListArray;
                break;
        }
    }

    // 單選事件
    function _handleSelectItem(event) {
        switch (listType) {
            case 'unlock':
                currentListArray = unlockApplyListArray;
                break;
            case 'locked':
                currentListArray = lockedApplyListArray;
                break;
            case 'executed':
                currentListArray = executedApplyListArray;
                break;
        }

        const num = $(event.target).attr('num');
        const itemId = $(event.target).data('id');
        const itemIndex = currentListArray.findIndex(item => item.id === itemId);
        const status = $(event.target).prop('checked') ? 'checked' : 'uncheck';
        
        if (itemIndex !== -1) {
            currentListArray[itemIndex]['status'] = status;
        }

        if ($(event.target).prop('checked')) {
            $(event.target).attr('status', 'checked');
            currentListArray[itemIndex].num = num;
            selectedApplyListArray.push(currentListArray[itemIndex]);
        } else {
            $(event.target).attr('status', 'uncheck');
            selectedApplyListArray = selectedApplyListArray.filter(item => item.id !== itemId);
        }

        switch (listType) {
            case 'unlock':
                unlockApplyListArray = currentListArray;
                break;
            case 'locked':
                lockedApplyListArray = currentListArray;
                break;
            case 'executed':
                executedApplyListArray = currentListArray;
                break;
        }
    }

    // 全選事件
    async function _handleSelectAllItem() {
        switch (listType) {
            case 'unlock':
                currentListArray = unlockApplyListArray;
                break;
            case 'locked':
                currentListArray = lockedApplyListArray;
                break;
            case 'executed':
                currentListArray = executedApplyListArray;
                break;
        }

        // 其餘部分保持不變
        if ($('#select-btn').html() == "全選") {
            $('#select-btn').html("取消全選");
            if (currentListArray.length == 0) {
                await swal({title: '錯誤', text: '沒有可選取的項目', type:"error", confirmButtonText: '確定', allowOutsideClick: false});
                location.reload();
            } else {
                selectAllItems(currentListArray);
            }
        } else {
            $('#select-btn').html("全選");
            deselectAllItems(currentListArray);
        }
    }

    // 選擇所有項目的複選框
    function selectAllItems(dataArray) {
        let currentListArray = dataArray;
        selectedApplyListArray = [];
        const num = $(event.target).attr('num');

        for (let i = 0; i < currentListArray.length; i++) {
            $(`.chkbox[data-id="${currentListArray[i].id}"]`).prop('checked', true);
            $(`.chkbox[data-id="${currentListArray[i].id}"]`).attr('status', 'checked');
            let num = i+1;
            
            // 當使用者勾選 checkbox 時，即時更新對應項目的 status
            currentListArray[i]['status'] = 'checked';
            currentListArray[i].num = '#' + num;
            selectedApplyListArray.push(currentListArray[i]);
        }
        switch (listType) {
            case 'unlock':
                unlockApplyListArray = currentListArray;
                break;
            case 'locked':
                lockedApplyListArray = currentListArray;
                break;
            case 'executed':
                executedApplyListArray = currentListArray;
                break;
        }
    }
    
    // 取消選擇所有項目的複選框
    function deselectAllItems(dataArray) {
        let currentListArray = dataArray;

        for (let i = 0; i < currentListArray.length; i++) {
            $(`.chkbox[data-id="${currentListArray[i].id}"]`).prop('checked', false);
            $(`.chkbox[data-id="${currentListArray[i].id}"]`).attr('status', 'uncheck');
            
            currentListArray[i]['status'] = 'uncheck';
            selectedApplyListArray = selectedApplyListArray.filter(item => item.id !== currentListArray[i].id);
        }
        switch (listType) {
            case 'unlock':
                unlockApplyListArray = currentListArray;
                break;
            case 'locked':
                lockedApplyListArray = currentListArray;
                break;
            case 'executed':
                executedApplyListArray = currentListArray;
                break;
        }
    }

    // 修正和鎖定檢查
    async function _validateForm(selectedItems) {
        // 取要送往後端的資料
        let data = [];
        switch (listType) {
            case 'unlock':
                for (let i = 0; i < selectedItems.length; i++) {
                    switch (selectedItems[i].action_id) {
                        case 1:
                            data.push({
                                'id': selectedItems[i].id,
                                'verified_dept_type': selectedItems[i].verified_dept_type,
                                'verified_dept_title': selectedItems[i].verified_dept_title,
                                'dept_id': selectedItems[i].dept_id,
                                'note': selectedItems[i].note
                            });
                            break;
                        case 2:
                            data.push({
                                'id': selectedItems[i].id,
                                'verified_dept_type': selectedItems[i].verified_dept_type,
                                'verified_dept_title': selectedItems[i].verified_dept_title,
                                'verified_new_dept_title': selectedItems[i].verified_new_dept_title,
                                'note': selectedItems[i].note
                            });
                            break;
                        case 3:
                            data.push({
                                'id': selectedItems[i].id,
                                'verified_dept_type': selectedItems[i].verified_dept_type,
                                'verified_dept_title': selectedItems[i].verified_dept_title,
                                'verified_new_group_code': selectedItems[i].verified_new_group_code,
                                'note': selectedItems[i].note
                            });
                            break;
                        case 4:
                            data.push({
                                'id': selectedItems[i].id,
                                'verified_dept_type': selectedItems[i].verified_dept_type,
                                'verified_dept_title': selectedItems[i].verified_dept_title,
                                'note': selectedItems[i].note
                            });
                            break;
                    }
                }
                break;
        }
        return data;
    }

    // 確認提示框
    async function _confirmExec(msg) {
        return swal({
            title: msg,
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: "確認",
            cancelButtonText: "取消",
            reverseButtons: true
        })
        .then(() => {
            return true;
        })
        .catch(async(err) => {
            await swal({title: "已取消執行", type: 'success', confirmButtonText: "確定", allowOutsideClick: false});
            // location.reload();
            stopLoading();
            return;
        })
    }

    // 取得請求列表
    async function _getListArray(){
        let res = await User.isLogin();
        if (res == true) {
            openLoading();
            const response = await School.getSchooApplyList();
            const json = await response.json();
            stopLoading();
            returnedApplyListArray = [];
            completedApplyListArray = [];
            executedApplyListArray = [];
            lockedApplyListArray = [];
            unlockApplyListArray = [];
            if(response.ok){
                await json.forEach(function (data, index) {
                    if(data.returned_at != null){
                        returnedApplyListArray.push(data);
                    } else if(data.completed_at != null){
                        completedApplyListArray.push(data);
                    } else if(data.executed_at != null){
                        data.status = 'uncheck';
                        executedApplyListArray.push(data);
                    } else if(data.verified_at != null){
                        data.status = 'uncheck';
                        lockedApplyListArray.push(data);
                    } else if(data.applied_at != null){
                        data.status = 'uncheck';
                        unlockApplyListArray.push(data);
                    }
                });
            } else {
                await swal({title: '錯誤', text: json.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false});
                location.reload();
            }
        }
    }
    
    // 渲染請求列表
    function _renderList(){
        switch (listType){
            case 'returned':
                if (returnedApplyListArray.length == 0) {
                    $returnedApplyList.html('無被退回的請求。');
                } else {
                    // 進行文憑列表分頁初始化渲染工作
                    $returnedPaginationContainer.pagination({
                        dataSource: returnedApplyListArray,
                        pageSize: 10,
                        callback: function(returnedApplyListArray,pagination) {
                            _applyListTamplate(returnedApplyListArray, pagination.pageNumber);
                        }
                    });
                }
                break;
            case 'completed':
                if (completedApplyListArray.length == 0) {
                    $completedApplyList.html('無已完成的請求。');
                } else {
                    // 進行文憑列表分頁初始化渲染工作
                    $completedPaginationContainer.pagination({
                        dataSource: completedApplyListArray,
                        pageSize: 10,
                        callback: function(completedApplyListArray,pagination) {
                            _applyListTamplate(completedApplyListArray, pagination.pageNumber);
                        }
                    });
                }
                break;
            case 'executed':
                if (executedApplyListArray.length == 0) {
                    $executedApplyList.html('無已執行的請求。');
                } else {
                    // 進行文憑列表分頁初始化渲染工作
                    $executedPaginationContainer.pagination({
                        dataSource: executedApplyListArray,
                        pageSize: 10,
                        callback: function(executedApplyListArray,pagination) {
                            _applyListTamplate(executedApplyListArray, pagination.pageNumber);
                        }
                    });
                }
                break;
            case 'locked':
                if (lockedApplyListArray.length == 0) {
                    $lockedApplyList.html('無已鎖定的請求。');
                } else {
                    // 進行文憑列表分頁初始化渲染工作
                    $lockedPaginationContainer.pagination({
                        dataSource: lockedApplyListArray,
                        pageSize: 10,
                        callback: function(lockedApplyListArray,pagination) {
                            _applyListTamplate(lockedApplyListArray, pagination.pageNumber);
                        }
                    });
                }
                break;
            case 'unlock':
                if (unlockApplyListArray.length == 0) {
                    $unlockApplyList.html('無未鎖定的請求。');
                } else {
                    // 進行文憑列表分頁初始化渲染工作
                    $unlockPaginationContainer.pagination({
                        dataSource: unlockApplyListArray,
                        pageSize: 10,
                        callback: function(unlockApplyListArray, pagination) {
                            _applyListTamplate(unlockApplyListArray, pagination.pageNumber);
                        }
                    });
                }
                break;
        }
    }

})();