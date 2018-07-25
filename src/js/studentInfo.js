var studentInfo = (function () {
    var _currentUserId = '';
    let _countryList = [];

    /**
     * cache DOM
     */
    var $studentList = $('#student-list'); // student 列表
    var $studentFilterInput = $('#student-filter-input'); // 搜尋欄
    var $editStudentInfoBtn; // 學生列表每項資料的編輯按鈕，資料取回後再綁定 event
    var $editStudentInfoModal = $('#editStudentInfoModal'); // 學生詳細資料 modal

    // Modal common elements
    var $modalStudentInfo = $('#modal-studentInfo');
    var $id = $modalStudentInfo.find('#id'); // 報名序號
    var $overseasId = $modalStudentInfo.find('#overseasId'); // 僑生編號
    var $name = $modalStudentInfo.find('#name'); // 中文姓名
    var $engName = $modalStudentInfo.find('#engName'); // 英文姓名
    var $email = $modalStudentInfo.find('#email'); // email
    var $backupEmail = $modalStudentInfo.find('#backupEmail'); // 備用 email
    var $gender = $modalStudentInfo.find('.gender'); // 性別
    var $birthday = $modalStudentInfo.find('#birthday'); // 生日
    var $birthContinent = $modalStudentInfo.find('#birthContinent'); // 出生地（州）
    var $birthLocation = $modalStudentInfo.find('#birthLocation'); // 出生地（國）

    /**
     * bind event
     */
    $studentFilterInput.on('keyup', _filterStudentInput); // 學生列表篩選

    $birthContinent.on('change', _reRenderCountry);
    //$specail.on('change', _changeSpecail);
    //$disabilityCategory.on('change', _switchDisabilityCategory);
    //$residenceContinent.on('change', _reRenderResidenceCountry);
    //$schoolContinent.on('change', _reRenderSchoolCountry);
    //$schoolCountry.on('change', _chSchoolCountry);
    //$schoolType.on('change', _chSchoolType);
    //$schoolLocation.on('change', _chSchoolLocation);
    //$dadStatus.on('change', _chDadStatus);
    //$momStatus.on('change', _chMomStatus);
    //$saveBtn.on('click', _handleSave);

    /**
     * init
     */
    _setData();

    function _setData() {
        //openLoading();

        Student.getStudentList() // 取得 student 列表
            .then((res) => {
                if(res.ok) { // 有資料則開始頁面初始化
                    _initCountryList();
                    return res.json();
                } else {
                    throw res;
                }
            }).then((json) => {
            // 渲染 student 列表
            $studentList.find('tbody').html('');
            json.forEach(function (value, index) {
                const identity = ['港澳生', '港澳具外國國籍之華裔學生', '海外僑生', '在臺港澳生', '在臺僑生', '僑先部結業生', '印輔班結業生'];

                const system = ['學士班', '港二技', '碩士班', '博士班'];

                var system_name = '';
                var identity_name = '';
                var gender_name = '';

                if (value.student_qualification_verify) {
                    if (value.student_qualification_verify.system_id) {
                        system_name = system[value.student_qualification_verify.system_id - 1];
                    }

                    if (value.student_qualification_verify.identity) {
                        identity_name = identity[value.student_qualification_verify.identity - 1];
                    }
                }

                if (value.student_personal_data) {
                    if (value.student_personal_data.gender === 'M') {
                        gender_name = '男';
                    } else if (value.student_personal_data.gender === 'F') {
                        gender_name = '女';
                    }
                }

                $studentList
                    .find('tbody')
                    .append(`
                        <tr>
                            <td>
                                <span class="btn-editStudentInfo" data-userid="${value.id}"><i class="fa fa-pencil" aria-hidden="true"></i></span>
                            </td>
                            <td>${(value.id).toString().padStart(6, "0")}</td>
                            <td>${value.student_misc_data.overseas_student_id || ""}</td>
                            <td>${value.name} &nbsp;&nbsp;&nbsp;&nbsp; ${value.eng_name}</td>
                            <td>${gender_name}</td>
                            <td>${value.email}</td>
                            <td>${system_name}</td>
                            <td>${identity_name}</td>
                        </tr>
                    `);
            });
        }).then(() => {
            $.bootstrapSortable(true); // 啟用列表排序功能
            $editStudentInfoBtn = $('.btn-editStudentInfo'); // 新增學生資料編輯按鈕的觸發事件（開啟 Modal）
            $editStudentInfoBtn.on('click', _handleEditStudentInfo);

            //stopLoading();
        }).catch((err) => {
            err.json && err.json().then((data) => {
                console.error(data);
                alert(`ERROR: \n${data.messages[0]}`);

                stopLoading();
            });
        })
    }

    function _filterStudentInput(e) { // 搜尋過濾列表
        let filter = $studentFilterInput.val().toUpperCase();
        var tr = $studentList.find('tr');

        for (i = 0; i < tr.length; i++) {
            let id = tr[i].getElementsByTagName("td")[1]; // 報名序號
            let overseas_id = tr[i].getElementsByTagName("td")[2]; // 僑生編號
            let name = tr[i].getElementsByTagName("td")[3]; // 姓名
            let email = tr[i].getElementsByTagName("td")[4]; // Email

            if (id || overseas_id || email || name) {
                if (id.innerHTML.toUpperCase().indexOf(filter) > -1
                    || overseas_id.innerHTML.toUpperCase().indexOf(filter) > -1
                    || email.innerHTML.toUpperCase().indexOf(filter) > -1
                    || name.innerHTML.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }

    function _handleEditStudentInfo() { // 學生列表 Modal 觸發
        openLoading();

        _currentUserId = $(this).data('userid');

        Student.getStudentInfo(_currentUserId)
            .then((res) => { return res.json(); })
            .then((json) => {
                _renderStudentDetail(json);
            })
            .then(() => {
                //_reviewDivAction();

                $editStudentInfoModal.modal({
                    backdrop: 'static',
                    keyboard: false
                });

                stopLoading();
            })

    }

    function _renderStudentDetail(json) {
        $id.val((json.id).toString().padStart(6, "0"));
        $overseasId.val(json.student_misc_data.overseas_student_id || "");
        $name.val(json.name || "");
        $engName.val(json.eng_name || "");
        $email.val(json.email);
        $backupEmail.val((json.student_personal_data) ? (json.student_personal_data.backup_email || "") : (""));

        if (json.student_personal_data && json.student_personal_data.gender) {
            $("input[name=gender][value='" + json.student_personal_data.gender + "']").prop("checked", true);
        } else {
            $("input[name=gender]").prop("checked", false);
        }

        if (json.student_personal_data && json.student_personal_data.birthday) {
            $birthday.val(json.student_personal_data.birthday);
        } else {
            $birthday.val();
        }

        if (json.student_personal_data && json.student_personal_data.birth_location) {
            $birthContinent.val(_findContinent(json.student_personal_data.birth_location)).change();
            $birthLocation.val(json.student_personal_data.birth_location);
        } else {
            $birthContinent.val(_findContinent(-1)).change();
            $birthLocation.val("");
        }
    }

    function _initCountryList() {
        Miscellaneous.getCountryList()
            .then((json) => {
                _countryList = json;
                let stateHTML = '<option value="-1" data-continentIndex="-1">Continent</option>';
                json.forEach((obj, index) => {
                    stateHTML += `<option value="${index}" data-continentIndex="${index}">${obj.continent}</option>`
                });
                $birthContinent.html(stateHTML);
                // $residenceContinent.html(stateHTML);
                // $schoolContinent.html(stateHTML);
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
})();