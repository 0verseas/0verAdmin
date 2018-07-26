var studentInfo = (function () {
    var _currentUserId = '';
    let _countryList = [];
    let _specailStatus = 0;
    let _disabilityCategory = '視覺障礙';
    let _currentDadStatus = 'alive';
    let _currentMomStatus = 'alive';
    let _systemId = 0;
    let _identityId = 0;

    const _disabilityCategoryList = ["視覺障礙", "聽覺障礙", "肢體障礙", "語言障礙", "腦性麻痺", "自閉症", "學習障礙"];

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
    };

    /**
     * cache DOM
     */
    const $studentList = $('#student-list'); // student 列表
    const $studentFilterInput = $('#student-filter-input'); // 搜尋欄
    var $editStudentInfoBtn; // 學生列表每項資料的編輯按鈕，資料取回後再綁定 event
    const $editStudentInfoModal = $('#editStudentInfoModal'); // 學生詳細資料 modal

    // Modal common elements
    const $modalStudentInfo = $('#modal-studentInfo');
    const $id = $modalStudentInfo.find('#id'); // 報名序號
    const $overseasId = $modalStudentInfo.find('#overseasId'); // 僑生編號
    const $name = $modalStudentInfo.find('#name'); // 中文姓名
    const $engName = $modalStudentInfo.find('#engName'); // 英文姓名
    const $email = $modalStudentInfo.find('#email'); // email
    const $backupEmail = $modalStudentInfo.find('#backupEmail'); // 備用 email
    const $gender = $modalStudentInfo.find('.gender'); // 性別
    const $birthday = $modalStudentInfo.find('#birthday'); // 生日
    const $birthContinent = $modalStudentInfo.find('#birthContinent'); // 出生地（州）
    const $birthLocation = $modalStudentInfo.find('#birthLocation'); // 出生地（國）

    const $specail = $modalStudentInfo.find('.specail'); // 是否為「身心障礙」或「特殊照護」或「特殊教育」者
    const $specialForm = $modalStudentInfo.find('#specialForm'); // 身心障礙表單
    const $disabilityCategory = $modalStudentInfo.find('#disabilityCategory'); // 障礙類別
    const $disabilityLevel = $modalStudentInfo.find('#disabilityLevel'); // 障礙等級
    const $otherDisabilityCategoryForm = $modalStudentInfo.find('#otherDisabilityCategoryForm'); // 其他障礙說明表單
    const $otherDisabilityCategory = $modalStudentInfo.find('#otherDisabilityCategory'); // 其他障礙說明

    // 僑居地資料
    const $residenceContinent = $modalStudentInfo.find('#residenceContinent'); // 州
    const $residentLocation = $modalStudentInfo.find('#residentLocation'); // 國
    const $residentId = $modalStudentInfo.find('#residentId'); // 身分證號碼（ID no.）
    const $residentPassportNo = $modalStudentInfo.find('#residentPassportNo'); // 護照號碼
    const $residentPhoneCode = $modalStudentInfo.find('#residentPhoneCode'); // 電話國碼
    const $residentPhone = $modalStudentInfo.find('#residentPhone'); // 電話號碼
    const $residentCellphoneCode = $modalStudentInfo.find('#residentCellphoneCode'); // 手機國碼
    const $residentCellphone = $modalStudentInfo.find('#residentCellphone'); // 手機號碼
    const $residentAddress = $modalStudentInfo.find('#residentAddress'); // 地址（中 / 英）
    const $residentOtherLangAddress = $modalStudentInfo.find('#residentOtherLangAddress'); // 地址（其他語言）

    // 在台資料 (選填)
    const $taiwanIdType = $modalStudentInfo.find('#taiwanIdType'); // 證件類型
    const $taiwanIdNo = $modalStudentInfo.find('#taiwanIdNo'); // 該證件號碼
    const $taiwanPassport = $modalStudentInfo.find('#taiwanPassport'); // 臺灣護照號碼
    const $taiwanPhone = $modalStudentInfo.find('#taiwanPhone'); // 臺灣電話
    const $taiwanAddress = $modalStudentInfo.find('#taiwanAddress'); // 臺灣地址

    // 學歷
    const $educationSystemDescriptionDiv = $modalStudentInfo.find('#div-educationSystemDescription');
    const $educationSystemDescription = $modalStudentInfo.find('#educationSystemDescription'); // 學制描述
    const $schoolContinent = $modalStudentInfo.find('#schoolContinent'); // 學校所在地（州）
    const $schoolCountry = $modalStudentInfo.find('#schoolCountry'); // 學校所在地（國）

    const $schoolTypeForm = $modalStudentInfo.find('#schoolTypeForm'); // 學校類別表單
    const $schoolType = $modalStudentInfo.find('#schoolType'); // 學校類別

    const $schoolLocationForm = $modalStudentInfo.find('#schoolLocationForm'); // 學校所在地、學校名稱 (select) 表單
    const $schoolLocation = $modalStudentInfo.find('#schoolLocation'); // 學校所在地
    const $schoolNameSelect = $modalStudentInfo.find('#schoolNameSelect'); // 學校名稱 (select)

    const $schoolNameTextForm = $modalStudentInfo.find('#schoolNameTextForm'); // 學校名稱表單
    const $schoolNameText = $modalStudentInfo.find('#schoolNameText'); // 學校名稱 (text)

    const $subjectForm = $modalStudentInfo.find('#subjectForm'); // 主、輔修表單
    const $majorSubject = $modalStudentInfo.find('#majorSubject'); // 主修科目
    const $minorSubject = $modalStudentInfo.find('#minorSubject'); // 輔修科目

    const $schoolAdmissionAt = $modalStudentInfo.find('#schoolAdmissionAt'); // 入學時間
    const $schoolGraduateAt = $modalStudentInfo.find('#schoolGraduateAt'); // 畢業時間

    const $twoYearTechClassForm = $modalStudentInfo.find('.twoYearTechClassForm'); // 港二技表單
    const $twoYearTechDiploma = $modalStudentInfo.find('#twoYearTechDiploma'); // 文憑類別（港二技）
    const $twoYearTechClassName = $modalStudentInfo.find('#twoYearTechClassName'); // 課程名稱（港二技）
    const $twoYearTechClassStart = $modalStudentInfo.find('#twoYearTechClassStart'); // 課程開始日期（港二技）
    const $twoYearTechClassEnd = $modalStudentInfo.find('#twoYearTechClassEnd'); // 課程結束日期（港二技）

    /**
     * bind event
     */
    $studentFilterInput.on('keyup', _filterStudentInput); // 學生列表篩選

    $birthContinent.on('change', _reRenderCountry);
    $specail.on('change', _changeSpecail);
    $disabilityCategory.on('change', _switchDisabilityCategory);
    $residenceContinent.on('change', _reRenderResidenceCountry);
    $schoolContinent.on('change', _reRenderSchoolCountry);
    $schoolCountry.on('change', _chSchoolCountry);
    $schoolType.on('change', _chSchoolType);
    $schoolLocation.on('change', _chSchoolLocation);
    //$dadStatus.on('change', _chDadStatus);
    //$momStatus.on('change', _chMomStatus);
    //$saveBtn.on('click', _handleSave);

    /**
     * init
     */
    _setData();

    function _setData() {
        openLoading();

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

            stopLoading();
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
            .then((res) => {
                return res.json();
            }).then((json) => {
                if (json.student_qualification_verify) {
                    _systemId = json.student_qualification_verify.system_id;
                    _identityId = json.student_qualification_verify.identity;
                }

                _renderStudentDetail(json);
            })
            .then(() => {
                //_reviewDivAction();
                _showSpecailForm();
                _handleOtherDisabilityCategoryForm();

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

        if (json.student_personal_data) {
            $("input[name=gender][value='" + json.student_personal_data.gender + "']").prop("checked", true);
            $birthday.val(json.student_personal_data.birthday);
            $birthContinent.val(_findContinent(json.student_personal_data.birth_location)).change();
            $birthLocation.val(json.student_personal_data.birth_location);

            _specailStatus = json.student_personal_data.special;
            $("input[name=special][value='"+ _specailStatus +"']").prop("checked",true).change();
            if (_specailStatus === 1) {
                if (_disabilityCategoryList.indexOf(json.student_personal_data.disability_category) > -1) {
                    $disabilityCategory.val(json.student_personal_data.disability_category).change();
                } else {
                    $disabilityCategory.val("-1").change();
                    $otherDisabilityCategory.val(json.student_personal_data.disability_category);
                }
                $disabilityLevel.val(json.student_personal_data.disability_level);
            }

            $residenceContinent.val(_findContinent(json.student_personal_data.resident_location)).change();
            $residentLocation.val(json.student_personal_data.resident_location);

            $residentId.val(json.student_personal_data.resident_id || "");
            $residentPassportNo.val(json.student_personal_data.resident_passport_no || "");

            $residentPhoneCode.val(_splitWithSemicolon(json.student_personal_data.resident_phone)[0]);
            $residentPhone.val(_splitWithSemicolon(json.student_personal_data.resident_phone)[1]);
            $residentCellphoneCode.val(_splitWithSemicolon(json.student_personal_data.resident_cellphone)[0]);
            $residentCellphone.val(_splitWithSemicolon(json.student_personal_data.resident_cellphone)[1]);
            $residentAddress.val(_splitWithSemicolon(json.student_personal_data.resident_address)[0]);
            $residentOtherLangAddress.val(_splitWithSemicolon(json.student_personal_data.resident_address)[1]);

            $taiwanIdType.val(json.student_personal_data.taiwan_id_type);
            $taiwanIdNo.val(json.student_personal_data.taiwan_id);
            $taiwanPassport.val(json.student_personal_data.taiwan_passport);
            $taiwanPhone.val(json.student_personal_data.taiwan_phone);
            $taiwanAddress.val(json.student_personal_data.taiwan_address);

            // init 學歷
            if (_systemId === 1 || _systemId === 2) { // 學士班、港二技 需要填寫學制描述
                $educationSystemDescription.val(json.student_personal_data.education_system_description);
            } else {
                $educationSystemDescriptionDiv.hide();
            }
            $schoolContinent.val(_findContinent(json.student_personal_data.school_country)).change();
            $schoolCountry.val(json.student_personal_data.school_country);

            _schoolCountryId = json.student_personal_data.school_country;
            _currentSchoolType = (json.student_personal_data.school_type !== null) ? json.student_personal_data.school_type : "";
            _currentSchoolLocate = (json.student_personal_data.school_locate !== null) ? json.student_personal_data.school_locate : "";
            _currentSchoolName = json.student_personal_data.school_name;

            _reRenderSchoolType();

            // 主副修欄位渲染、初始化
            if (_systemId === 3 || _systemId === 4) {
                $subjectForm.show();
                $majorSubject.val(json.student_personal_data.major_subject);
                $minorSubject.val(json.student_personal_data.minor_subject);
            }

            // 入學時間、畢業時間初始化
            $schoolAdmissionAt.val(json.student_personal_data.school_admission_at);
            $schoolGraduateAt.val(json.student_personal_data.school_graduate_at);

            // 港二技文憑渲染、初始化
            if (_systemId === 2) {
                $twoYearTechClassForm.show();
                $twoYearTechDiploma.val(json.student_personal_data.two_year_tech_diploma);
                $twoYearTechClassName.val(json.student_personal_data.two_year_tech_class_name);
                $twoYearTechClassStart.val(json.student_personal_data.two_year_tech_class_start);
                $twoYearTechClassEnd.val(json.student_personal_data.two_year_tech_class_end);
            }
        } else {
            $("input[name=gender]").prop("checked", false);
            $birthday.val("");
            $birthContinent.val(_findContinent(-1)).change();
            $birthLocation.val("");
            $("input[name=special]").prop("checked", false);

            $residenceContinent.val(_findContinent(-1)).change();
            $residentLocation.val("");

            $residentId.val("");
            $residentPassportNo.val("");

            $residentPhoneCode.val("");
            $residentPhone.val("");
            $residentCellphoneCode.val("");
            $residentCellphone.val("");
            $residentAddress.val("");
            $residentOtherLangAddress.val("");

            $taiwanIdType.val("");
            $taiwanIdNo.val("");
            $taiwanPassport.val("");
            $taiwanPhone.val("");
            $taiwanAddress.val("");

            if (_systemId === 1 || _systemId === 2) { // 學士班、港二技 需要填寫學制描述
                $educationSystemDescription.val("");
            } else {
                $educationSystemDescriptionDiv.hide();
            }

            $schoolContinent.val(_findContinent(-1)).change();
            $schoolCountry.val("");

            $subjectForm.hide();
            $majorSubject.val("");
            $minorSubject.val("");

            // 入學時間、畢業時間初始化
            $schoolAdmissionAt.val("");
            $schoolGraduateAt.val("");

            // 港二技文憑渲染、初始化
            $twoYearTechClassForm.hide();
            $twoYearTechDiploma.val("");
            $twoYearTechClassName.val("");
            $twoYearTechClassStart.val("");
            $twoYearTechClassEnd.val("");
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
                $residenceContinent.html(stateHTML);
                $schoolContinent.html(stateHTML);
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

    function _splitWithSemicolon(phoneNum) {
        let i = phoneNum.indexOf(";");
        return [phoneNum.slice(0,i), phoneNum.slice(i+1)];
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

    function _reRenderSchoolList() {
        if (_systemId === 1) {
            // 重新渲染學士班的學校列表
            let locateIndex = _schoolList.findIndex(order => order.locate === _currentSchoolLocate);

            let schoolListHTML = '';
            _schoolList[locateIndex].school.forEach((value, index) => {
                schoolListHTML += `<option value="${value.name}">${value.name}</option>`;
            });
            $schoolNameSelect.html(schoolListHTML);
            if (_currentSchoolName !== "") {
                $schoolNameSelect.val(_currentSchoolName);
            }
        } else {
            // 非學士班，渲染學校名稱 text field
            $schoolNameText.val(_currentSchoolName);
        }
    }

    function _reRenderSchoolType() {
        // 處理該國籍是否需要選擇學校類型，以及學校類型 select bar 渲染工作
        // 學士班才需要學校類別
        if (_systemId === 1) {
            if (_schoolCountryId in _schoolType) {
                let typeHTML = '';
                _schoolType[_schoolCountryId].forEach((value, index) => {
                    typeHTML += `<option value="${value}">${value}</option>`;
                });
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
                Miscellaneous.getSchoolList(_schoolCountryId)
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
                            });
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
})();