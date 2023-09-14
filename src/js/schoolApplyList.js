(()=>{
    const $unlockPaginationContainer = $('#unlock-pagination-container'); // 分頁器區域
    const $unlockApplyList = $('#unlock-apply-list'); // 請求列表

    const $lockPaginationContainer = $('#lock-pagination-container'); // 分頁器區域
    const $lockApplyList = $('#lock-apply-list'); // 請求列表

    const $executedPaginationContainer = $('#executed-pagination-container'); // 分頁器區域
    const $executedApplyList = $('#executed-apply-list'); // 請求列表

    const $completedPaginationContainer = $('#completed-pagination-container'); // 分頁器區域
    const $completedApplyList = $('#completed-apply-list'); // 請求列表

    const $rejectPaginationContainer = $('#reject-pagination-container'); // 分頁器區域
    const $rejectApplyList = $('#reject-apply-list'); // 請求列表

    const $selectBtn = $('#select-btn'); // 選取按鈕
    const $saveBtn = $('#save-btn'); // 儲存按鈕
    const $verifiedBtn = $('#verified-btn'); // 鎖定按鈕
    const $rejectBtn = $('#reject-btn'); // 退還按鈕
    const $executeBtn = $('#execute-btn'); // 執行按鈕
    const $completedBtn = $('#completed-btn'); // 完成按鈕
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
    let lockApplyListArray = []; // 目前請求有哪些
    let executedApplyListArray = []; // 目前請求有哪些
    let completedApplyListArray = []; // 目前請求有哪些
    let rejectApplyListArray = []; // 目前請求有哪些
    let username = ''; // 當前使用者帳號

    $rejectBtn.on('click', _handleReject)
    $completedBtn.on('click', _handleCompleted);
    $executeBtn.on('click', _handleExecute);

    $selectBtn.on('click', _handleSelect); // 全選按鈕
    $saveBtn.on('click', _handleSave); // 暫存按鈕
    $verifiedBtn.on('click', _handleVerified); // 鎖定按鈕

    $refreshBtn.on('click', _handleRefresh);

    $('#pills-tab button').on('click', async function (event) {
        const listType = $(this).data('target').replace('#','');
        await _getListArray();
        _renderList(listType)
    })

    $('body').on('click', '.img-thumbnail', _handleShowFile);
    $('body').on('click', '.applicant', _handleShowApplicant);

    init();

    async function init() {
        let res = await User.isLogin();
        if (res == true) {
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
                ;
                // 只有admin_IS可以執行請求
                username = User.getUserInfo().username;
                if (username !== 'admin_IS') { // 更改爲資服組專用的帳號
                    $executeBtn.hide();
                }

                console.log(json);

                json.forEach(function (data, index) {
                    if(data.returned_at != null){
                        rejectApplyListArray.push(data);
                    } else if(data.completed_at != null){
                        completedApplyListArray.push(data);
                    } else if(data.executed_at != null){
                        executedApplyListArray.push(data);
                    } else if(data.verified_at != null){
                        lockApplyListArray.push(data);
                    } else if(data.applied_at != null){
                        unlockApplyListArray.push(data);
                    }
                });
            }).then(() => {
                const listType = $("#pills-tab").find(`[aria-selected=true]`).data('target').replace('#','');
                _renderList(listType);
                stopLoading();
            })
            .catch((err) => {
                stopLoading();
                err.json && err.json().then((data) => {
                    swal({title: '錯誤', text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false});
                    location.reload();
                });
            });
        }
    }

    // 請求列表轉換並渲染
    function _applyListTamplate(listType,datas,page) {
        // 渲染 請求列表
        $rejectApplyList.html('');
        $completedApplyList.html('');
        $executedApplyList.html('');
        $lockApplyList.html('');
        $unlockApplyList.html('');
        datas.forEach(function (data, index) {
            const schoolTitle = (data.school.title)? data.school.title: '';
            const schoolCode = (data.school.id)? data.school.id: '';
            const action = action_array[data.action_id];
            const system = system_array[data.system_id];
            const type = type_array[data.dept_type];
            const group = group_array[data.group_code];
            const deptTitle = (data.dept_title) ?data.dept_title:'';
            const stage = (data.executed_at)? 'item-executed': ((data.verified_at)? 'item-verified': ((data.returned_at)? 'item-executed': 0));

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
                <h5 class="apply-title" style="margin:10px;" data-id=${data.id}>
                <label class="required-title-type">
            `;

            if(data.returned_at == null && data.completed_at == null){
                listHtml += `
                    <input type="checkbox" id="select-chk" value="${stage}" data-id=${data.id}> &nbsp;
                `;
            }

            listHtml += `
                #${index+1+((page-1)*10)} &nbsp; ${schoolTitle} (${schoolCode})
                <input type="text" id="apply-info" class="form-control action-type" data-id=${data.id} maxlength="191" value="${action}" disabled>
                </label>
            `;

            listHtml += `
                    </h5>
                    <div class="col-10">
                        <div id="list-element">
                            <span class="info-label"> 系所學制 </span>
                            <input type="text" id="apply-info" class="form-control" maxlength ="191" value="${system}" disabled>
                        </div>
                        <div id="list-element">
                            <span class="info-label"> 系所類組 </span>
                            <input type="text" id="apply-info" class="form-control" maxlength ="191" value="${group}" disabled>
                        </div>
                        <div id="list-element">
                            <span class="info-label"> 系所類型 </span>
                            <input type="text" id="apply-info" class="form-control" style="width:130px;" maxlength ="191" value="${type}" disabled>
                        </div>

                        <div id="list-element">
                            <span class="info-label"> 核定系名 </span>
                            <input type="text" id="apply-info" class="form-control" style="width:250px;" maxlength ="191" value="${deptTitle}" disabled>
                        </div><br>
            `;

            if (stage == 'item-verified' || stage == 'item-executed') {
                listHtml += `
                        <div id="list-element">
                            <span class="info-label"><span style="color:red;">修正</span> 系所類型 </span>
                            <select class="form-control new_type" id="type-selector" data-id=${data.id} disabled>
                                <option value=""></option>
                                <option value="0">一般系所</option>
                                <option value="1">重點產業系所</option>
                                <option value="2">國際專修部</option>
                            </select>
                        </div><br>
                        <div id="list-element">
                            <span class="info-label"><span style="color:red;">修正</span> 核定系名 </span>
                            <input type="text" id="apply-info" class="form-control v_title" data-id=${data.id} style="width:250px;" maxlength ="191" value="${(data.verified_dept_title)? data.verified_dept_title:''}" disabled>
                        </div><br>
                `;
            } else {
                listHtml += `
                        <div id="list-element">
                            <span class="info-label"><span style="color:red;">修正</span> 系所類型 </span>
                            <select class="form-control new_type" id="type-selector" data-id=${data.id}>
                                <option value=""></option>
                                <option value="0">一般系所</option>
                                <option value="1">重點產業系所</option>
                                <option value="2">國際專修部</option>
                            </select>
                        </div><br>
                        <div id="list-element">
                            <span class="info-label"><span style="color:red;">修正</span> 核定系名 </span>
                            <input type="text" id="apply-info" class="form-control v_title" data-id=${data.id} style="width:250px;" maxlength ="191" value="${(data.verified_dept_title)? data.verified_dept_title:''}">
                        </div><br>
                `;
            }

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
                        default:
                            break;
                    }
                });
            });

            switch (data.action_id) {
                case 1:
                    if (stage == 'item-verified' || stage == 'item-executed') { // 加上已鎖定和已執行後可編輯的欄位判斷是否加以 disabled 屬性
                        listHtml += `
                        <div id="list-element">
                            <span class="info-label"><span style="color:red;"> 原系代碼</span>(選填) </span>
                            <input type="text" id="apply-info" class="form-control org_id" data-id=${data.id} maxlength ="5" value="${(data.dept_id)? data.dept_id:''}" disabled>
                        </div>
                        `;
                    } else {
                        listHtml += `
                        <div id="list-element">
                            <span class="info-label"><span style="color:red;"> 原系代碼</span>(選填) </span>
                            <input type="text" id="apply-info" class="form-control org_id" data-id=${data.id} maxlength ="5" value="${(data.dept_id)? data.dept_id:''}">
                        </div>
                        `;
                    }
                    break;
                case 2:
                    if (stage == 'item-verified' || stage == 'item-executed') { // 加上已鎖定和已執行後可編輯的欄位判斷是否加以 disabled 屬性
                        listHtml += `
                        <div id="list-element">
                            <span class="info-label"> 學系代碼 </span>
                            <input type="text" id="apply-info" class="form-control" maxlength ="5" value="${data.dept_id}" disabled>
                        </div>
                        <div id="list-element">
                            <span class="info-label"> 新系所名稱 </span>
                            <input type="text" id="apply-info" class="form-control" style="width:250px;" maxlength ="191" value="${data.new_dept_title}" disabled>
                        </div><br>
                        `;
                    } else {
                        listHtml += `
                        <div id="list-element">
                            <span class="info-label"> 學系代碼 </span>
                            <input type="text" id="apply-info" class="form-control" maxlength ="5" value="${data.dept_id}" disabled>
                        </div>
                        <div id="list-element">
                            <span class="info-label"> 新系所名稱 </span>
                            <input type="text" id="apply-info" class="form-control" style="width:250px;" maxlength ="191" value="${data.new_dept_title}" disabled>
                        </div><br>
                        `;
                    }
                    break;
                case 3:
                    if (stage == 'item-verified' || stage == 'item-executed') { // 加上已鎖定和已執行後可編輯的欄位判斷是否加以 disabled 屬性
                        listHtml += `
                        <div id="list-element">
                            <span class="info-label"> 學系代碼 </span>
                            <input type="text" id="apply-info" class="form-control" maxlength ="5" value="${data.dept_id}" disabled>
                        </div>
                        <div id="list-element">
                            <span class="info-label"> 新系所類組 </span>
                            <input type="text" id="apply-info" class="form-control" maxlength ="191" value="${group_array[data.new_group_code]}" disabled>
                        </div><br>
                        <div id="list-element">
                            <span class="info-label"><span style="color:red;">修正</span> 新系所類組 </span>
                            <select class="form-control new_group" id="type-selector" data-id=${data.id} disabled>
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
                            <input type="text" id="apply-info" class="form-control" maxlength ="5" value="${data.dept_id}" disabled>
                        </div>
                        <div id="list-element">
                            <span class="info-label"> 新系所類組 </span>
                            <input type="text" id="apply-info" class="form-control" maxlength ="191" value="${group_array[data.new_group_code]}" disabled>
                        </div><br>
                        <div id="list-element">
                            <span class="info-label"><span style="color:red;">修正</span> 新系所類組 </span>
                            <select class="form-control new_group" id="type-selector" data-id=${data.id}>
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
                            <input type="text" id="apply-info" class="form-control" style="width:250px;" maxlength ="191" value="${data.conbine_dept_id_1}" disabled>
                        </div>
                        <div id="list-element">
                            <span class="info-label"> 欲合併系所代碼2 </span>
                            <input type="text" id="apply-info" class="form-control" style="width:250px;" maxlength ="191" value="${data.conbine_dept_id_2}" disabled>
                        </div>
                    `;
                    break;
            }

            // 查看核定公文和顯示申請人資料改爲按鈕和 modal 的形式呈現
            listHtml += `
                    </div>
                    <div class="col-2">
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
                    listHtml += `
                        <button class="info-button btn btn-info applicant"
                        data-toggle="modal"
                        data-target=".applicant-info-modal"
                        data-applicantname="${data.applicant_name}"
                        data-applicantphone="${data.applicant_phone}"
                        data-applicantemail="${data.applicant_email}">
                            顯示申請人資料
                        </button>
                    `;
                }
            });

            // 退回原因和處理說明
            if (stage == 'item-verified' || stage == 'item-executed') { // 加上已鎖定和已執行後可編輯的欄位判斷是否加以 disabled 屬性
                if (stage == 'item-executed') {
                    listHtml += `
                    </div>
                    <div style="display:flex;" class="show-list handle-and-return col-12">
                        <div id="list-element" style="width: 400px;">
                            <span class="info-label"> 退回原因(上限1000字) </span>
                            <textarea class="form-control return_reason" id="apply-info" data-id=${data.id} rows="3" style="width:100%; min-width:150px;" placeholder="請輸入退回請求的原因" disabled>${(data.return_reason)? data.return_reason:''}</textarea>
                        </div><br>
                        <div id="list-element" style="flex-grow: 1;">
                            <span class="info-label"> 處理說明(上限2000字) </span>
                            <textarea class="form-control note" id="apply-info" data-id=${data.id} rows="3" style="width:100%; min-width:150px;" placeholder="請輸入處理說明" disabled>${(data.note)? data.note:''}</textarea>
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
                            <textarea class="form-control return_reason" id="apply-info" data-id=${data.id} rows="3" style="width:100%; min-width:150px;" placeholder="請輸入退回請求的原因">${(data.return_reason)? data.return_reason:''}</textarea>
                        </div><br>
                        <div id="list-element" style="flex-grow: 1;">
                            <span class="info-label"> 處理說明(上限2000字) </span>
                            <textarea class="form-control note" id="apply-info" data-id=${data.id} rows="3" style="width:100%; min-width:150px;" placeholder="請輸入處理說明" disabled>${(data.note)? data.note:''}</textarea>
                        </div>
                    </div>
                </div>
                <hr class="hr-type">
                    `;
                }
            } else {
                listHtml += `
                    </div>
                    <div style="display:flex;" class="show-list handle-and-return col-12">
                        <div id="list-element" style="width: 400px;">
                            <span class="info-label"> 退回原因(上限1000字) </span>
                            <textarea class="form-control return_reason" id="apply-info" data-id=${data.id} rows="3" style="width:100%; min-width:150px;" placeholder="請輸入退回請求的原因">${(data.return_reason)? data.return_reason:''}</textarea>
                        </div><br>
                        <div id="list-element" style="flex-grow: 1;">
                            <span class="info-label"> 處理說明(上限2000字) </span>
                            <textarea class="form-control note" id="apply-info" data-id=${data.id} rows="3" style="width:100%; min-width:150px;" placeholder="請輸入處理說明">${(data.note)? data.note:''}</textarea>
                        </div>
                    </div>
                </div>
                <hr class="hr-type">
                `;
            }

            switch (listType){
                case 'reject':
                    $rejectApplyList.append(listHtml);
                    break;
                case 'completed':
                    $completedApplyList.append(listHtml);
                    break;
                case 'executed':
                    $executedApplyList.append(listHtml);
                    break;
                case 'lock':
                    $lockApplyList.append(listHtml);
                    break;
                case 'unlock':
                    $unlockApplyList.append(listHtml);
                    break;
            }


            if (data.verified_dept_type=="0" || data.verified_dept_type=="1" || data.verified_dept_type=="2") {
                $(`.new_type[data-id='${data.id}']`).children(`[value=${data.verified_dept_type}]`).prop('selected', true);
            }
            if (data.verified_new_group_code) {
                $(`.new_group[data-id='${data.id}']`).children(`[value=${data.verified_new_group_code}]`).prop('selected', true);
            }
        });
    }

    // 退回請求事件
    async function _handleReject(){
        if(await _confirmExec("確認要退回請求嗎？")) {
            openLoading();
            let data = [];
            let cancelconfirm = 0; // 宣告多一個控制值，用以判斷是否沒有選取任何項目

            for(let i=0; i<$('input[id=select-chk]').length; i++){

                if ($('input[id=select-chk]')[i].checked) {
                    if($('input[id=select-chk]')[i].value == 'item-executed') {
                        await swal({title: "錯誤", text: "已執行的請求無法被退回，請聯繫資服組人員或取消勾選", type: 'error', confirmButtonText: "確定", allowOutsideClick: false});
                        location.reload();
                        stopLoading();
                        return;
                    } else if ($(`.return_reason[data-id=${$('input[id=select-chk]')[i].getAttribute('data-id')}]`).val() == "" || $(`.return_reason[data-id=${$('input[id=select-chk]')[i].getAttribute('data-id')}]`).val() == 0) {
                        await swal({title: "錯誤", text: "無法被退回，請填寫退回原因", type: 'error', confirmButtonText: "確定", allowOutsideClick: false});
                        location.reload();
                        stopLoading();
                        return;
                    } else if ($('input[id=select-chk]')[i].value == 'item-verified') {
                        let label = $(`h5[data-id='${$('input[id=select-chk]')[i].getAttribute('data-id')}']`).html().split(' ');
                        for (let j=0; j<label.length; j++) {
                            if(label[j].includes('#')) {
                                await swal({
                                    title: `項目 ${label[j]} 已鎖定，確認要將此項目退回嗎？`,
                                    type: 'warning',
                                    showCancelButton: true,
                                    confirmButtonText: "確認",
                                    cancelButtonText: "取消",
                                    reverseButtons: true,
                                    allowOutsideClick: false
                                }).then(() => {
                                    data.push({
                                        id: $('input[id=select-chk]')[i].getAttribute('data-id'),
                                        reason: $(`.return_reason[data-id=${$('input[id=select-chk]')[i].getAttribute('data-id')}]`).val()
                                    });
                                }).catch(async (e) => {
                                    if (e == 'cancel') { // 抓取當檢查到例外情況出現再選擇取消後的操作
                                        await swal({
                                            title: "已取消執行",
                                            type: 'success',
                                            confirmButtonText: "確定",
                                            allowOutsideClick: false
                                        });
                                        cancelconfirm = 1;
                                        location.reload();
                                        stopLoading();
                                        return
                                    }
                                });
                                break;
                            }
                        }
                    } else {
                        data.push({
                            id: $('input[id=select-chk]')[i].getAttribute('data-id'),
                            reason: $(`.return_reason[data-id=${$('input[id=select-chk]')[i].getAttribute('data-id')}]`).val()
                        });
                    }
                }
            }
            if (data.length == 0 && cancelconfirm == 0){ // 利用多一個控制值來判斷是否爲沒有選取任何項目
                await swal({title: "錯誤", text: "請選擇至少一筆未鎖定/未執行的請求！", type:"warning", confirmButtonText: '確定', allowOutsideClick: false}).then(() => {
                    location.reload();
                    stopLoading();
                    return;
                });
            }
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
            })
            ;
        }
    }

    // 執行請求事件
    async function _handleExecute() {
        if (username !== 'admin_IS') { // 更改爲資服組專用的帳號
            await swal({title: "無操作權限！", type: 'error', confirmButtonText: "確定", allowOutsideClick: false});
            location.reload();
            return;
        } else {
            if(await _confirmExec("確認要執行請求嗎？")) {
                openLoading();
                let idSelected = [];
                for(let i=0; i<$('input[id=select-chk]').length; i++){
                    if ($('input[id=select-chk]')[i].checked) {
                        if($('input[id=select-chk]')[i].value == 'item-verified') {
                            idSelected.push($('input[id=select-chk]')[i].getAttribute('data-id'));
                        } else {
                            await swal({title: "錯誤", text: "僅可執行已鎖定且未執行的請求！", type: 'error', confirmButtonText: "確定", allowOutsideClick: false});
                            location.reload();
                            stopLoading();
                            return;
                        }
                    }
                }
                if (idSelected.length == 0){
                    await swal({title: "錯誤",text: "請選取至少一項已鎖定的請求！", type: 'warning', confirmButtonText: "確定", allowOutsideClick: false}).then(() => {
                        location.reload();
                        stopLoading();
                        return;
                    });
                }
                // 檢查例外
                let res = await School.checkApply(idSelected.toString());
                if(res) {
                    $imgModal.modal('hide');
                    let errmsg = '';
                    res.forEach(el => {
                        let data = el.split(',');
                        let label = $(`h5[data-id='${data[0]}']`).html().split(' ');
                        if(errmsg.length > 0) errmsg += '，';
                        for (let i=0; i<label.length; i++) {
                            if(label[i].includes('#')) {
                                errmsg += `${label[i]} ${data[1]}`;
                                break;
                            }
                        }
                    });
                    if(errmsg.length > 0) {
                        await swal({
                            title: "發現例外情況",
                            text: `${errmsg}。是否要繼續執行？`,
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
                                location.reload();
                                stopLoading();
                                return
                            }
                            err.json && err.json().then(async (data) => {
                                await swal({title: data.messages, type: 'error', confirmButtonText: "確定", allowOutsideClick: false}).then(() => {
                                    location.reload();
                                    stopLoading();
                                    return;
                                });
                            });
                        });
                        location.reload();
                        stopLoading();
                        return;
                    } else { // 新增當沒有出現例外情況的操作
                        res = await School.executeApply(idSelected.toString());
                        //console.log(res);
                        if (res.ok) {
                            $imgModal.modal('hide');
                            await swal({
                                title: '執行成功',
                                type: "success",
                                confirmButtonText: '確定',
                                allowOutsideClick: false
                            });
                            location.reload();
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

    // 完成請求事件
    async function _handleCompleted() {
        if(await _confirmExec("確認要完成請求嗎？")) {
            openLoading();
            let idSelected = [];
            let cancelconfirm = 0; // 宣告多一個控制值，用以判斷是否沒有選取任何項目
            for(let i=0; i<$('input[id=select-chk]').length; i++){
                if ($('input[id=select-chk]')[i].checked) {
                    if($('input[id=select-chk]')[i].value != 'item-executed') {
                        let label = $(`h5[data-id='${$('input[id=select-chk]')[i].getAttribute('data-id')}']`).html().split(' ');
                        for (let j=0; j<label.length; j++) {
                            if(label[j].includes('#')) {
                                await swal({
                                    title: `項目 ${label[j]} 還未執行`,
                                    text: "確認要將此項目標示為已完成嗎？",
                                    type: 'warning',
                                    showCancelButton: true,
                                    confirmButtonText: "確認",
                                    cancelButtonText: "取消",
                                    reverseButtons: true,
                                    allowOutsideClick: false
                                }).then(() => {
                                    idSelected.push($('input[id=select-chk]')[i].getAttribute('data-id'));
                                }).catch(async (err) => {
                                    if (err == 'cancel') { // 當發現例外情況再選擇取消後的操作
                                        await swal({
                                            title: "已取消執行",
                                            type: 'success',
                                            confirmButtonText: "確定",
                                            allowOutsideClick: false
                                        });
                                        location.reload();
                                        stopLoading();
                                        cancelconfirm = 1; // 確認還是有選擇項目
                                        return;
                                    }
                                });
                                continue;
                            }
                        }
                    } else {
                        idSelected.push($('input[id=select-chk]')[i].getAttribute('data-id'));
                    }
                }
            }
            if (idSelected.length == 0 && cancelconfirm == 0){ // 利用多一個控制值來判斷是否爲沒有選取任何項目
                await swal({title: "錯誤", text: "請選取至少一項請求！", type: 'warning', confirmButtonText: "確定", allowOutsideClick: false}).then(() => {
                    location.reload();
                    stopLoading();
                    return;
                });
            }

            // 檢查例外
            School.updateApply(idSelected.toString())
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

    // 批次選取
    function _handleSelect() {
        if ($selectBtn.html() == "全選") {
            $selectBtn.html("取消全選");
            switch ($('input[name=target]:checked').val()) {
                case 'all':
                    $('input[id=select-chk]').prop('checked', true);
                    break;
                case 'not-verified': // 全選的部分新增未鎖定的條件
                    $('input[value=0]').prop('checked', true);
                    break;
                case 'verified':
                    $('input[value=item-verified]').prop('checked', true);
                    break;
                case 'executed':
                    $('input[value=item-executed]').prop('checked', true);
                    break;
            }
        } else {
            $selectBtn.html("全選");
            $('input[id=select-chk]').prop('checked', false);
        }
    }

    // 儲存修正
    async function _handleSave() {
        if(await _confirmExec("確認要儲存修改嗎？")) {
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
                await swal({title:"錯誤", text: "請選擇至少一筆未鎖定/未執行的請求！", type: 'error', confirmButtonText: "確定"});
                location.reload();
                stopLoading();
                return;
            }
        }
    }

    // 確認鎖定
    async function _handleVerified() {
        if(await _confirmExec("確認要儲存修改並鎖定資料嗎？")) {
            openLoading();
            // 取要送往後端的資料
            let data = await _validateForm();
            if (data.length < 1) {
                await swal({title: "錯誤", text: "請選擇至少一筆未鎖定/未執行的請求！", type: 'error', confirmButtonText: "確定"});
                location.reload();
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
        }
    }

    // 儲存前檢查
    function _validateForm() {
        // 取要送往後端的資料
        let data = [];
        $('input[id=select-chk]').each(function (index){
            if ($(this).prop('checked')) {
                if($(this).val() != 'item-executed' && $(this).val() != 'item-verified') {
                    switch ($(`.action-type[data-id=${$(this).data('id')}]`).val()) {
                        case "新增系所":
                            data.push({
                                'id': $(this).data('id'),
                                'verified_dept_type': $(`.new_type[data-id=${$(this).data('id')}]`).find(':selected').val(),
                                'verified_dept_title': $(`.v_title[data-id=${$(this).data('id')}]`).val(),
                                'dept_id': $(`.org_id[data-id=${$(this).data('id')}]`).val(),
                                'note': $(`.note[data-id=${$(this).data('id')}]`).val()
                            });
                            break;
                        case "更改系名":
                            data.push({
                                'id': $(this).data('id'),
                                'verified_dept_type': $(`.new_type[data-id=${$(this).data('id')}]`).find(':selected').val(),
                                'verified_dept_title': $(`.v_title[data-id=${$(this).data('id')}]`).val(),
                                'verified_new_dept_title': $(`.new_title[data-id=${$(this).data('id')}]`).val(),
                                'note': $(`.note[data-id=${$(this).data('id')}]`).val()
                            });
                            break;
                        case "更換類組":
                            data.push({
                                'id': $(this).data('id'),
                                'verified_dept_type': $(`.new_type[data-id=${$(this).data('id')}]`).find(':selected').val(),
                                'verified_dept_title': $(`.v_title[data-id=${$(this).data('id')}]`).val(),
                                'verified_new_group_code': $(`.new_group[data-id=${$(this).data('id')}]`).find(':selected').val(),
                                'note': $(`.note[data-id=${$(this).data('id')}]`).val()
                            });
                            break;
                        case "合併系所":
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
        return data;
    }

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
            location.reload();
            stopLoading();
            return;
        })
    }

    async function _handleRefresh(){
        await _getListArray();
        const listType = $("#pills-tab").find(`[aria-selected=true]`).data('target').replace('#','');
        _renderList(listType);
        return;
    }

    async function _getListArray(){
        let res = await User.isLogin();
        if (res == true) {
            openLoading();
            const response = await School.getSchooApplyList();
            const json = await response.json();
            stopLoading();
            rejectApplyListArray = [];
            completedApplyListArray = [];
            executedApplyListArray = [];
            lockApplyListArray = [];
            unlockApplyListArray = [];
            if(response.ok){
                await json.forEach(function (data, index) {
                    if(data.returned_at != null){
                        rejectApplyListArray.push(data);
                    } else if(data.completed_at != null){
                        completedApplyListArray.push(data);
                    } else if(data.executed_at != null){
                        executedApplyListArray.push(data);
                    } else if(data.verified_at != null){
                        lockApplyListArray.push(data);
                    } else if(data.applied_at != null){
                        unlockApplyListArray.push(data);
                    }
                });
            } else {
                await swal({title: '錯誤', text: json.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false});
                location.reload();
            }
        }
    }

    function _renderList(listType){
        switch (listType){
            case 'reject':
                if (rejectApplyListArray.length == 0) {
                    $rejectApplyList.html('無被退回的請求。');
                } else {
                    // 進行文憑列表分頁初始化渲染工作
                    $rejectPaginationContainer.pagination({
                        dataSource: rejectApplyListArray,
                        pageSize: 10,
                        callback: function(rejectApplyListArray,pagination) {
                            _applyListTamplate(listType,rejectApplyListArray, pagination.pageNumber);
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
                            _applyListTamplate(listType,completedApplyListArray, pagination.pageNumber);
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
                            _applyListTamplate(listType,executedApplyListArray, pagination.pageNumber);
                        }
                    });
                }
                break;
            case 'lock':
                if (lockApplyListArray.length == 0) {
                    $lockApplyList.html('無已鎖定的請求。');
                } else {
                    // 進行文憑列表分頁初始化渲染工作
                    $lockPaginationContainer.pagination({
                        dataSource: lockApplyListArray,
                        pageSize: 10,
                        callback: function(lockApplyListArray,pagination) {
                            _applyListTamplate(listType,lockApplyListArray, pagination.pageNumber);
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
                        callback: function(unlockApplyListArray,pagination) {
                            _applyListTamplate(listType,unlockApplyListArray, pagination.pageNumber);
                        }
                    });
                }
                break;
        }
    }

})();