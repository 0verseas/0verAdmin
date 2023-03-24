var studentInfo = (function () {
    var _currentUserId = '';
    let _countryList = [];
    let _specailStatus = 0;
    let _disabilityCategory = '視覺障礙';
    let _currentDadStatus = 'alive';
    let _currentMomStatus = 'alive';
    let _systemId = 0;
    let _identityId = 0;
    let _filterStudentList = [];

    const _disabilityCategoryList = ["視覺障礙", "聽覺障礙", "肢體障礙", "語言障礙", "腦性麻痺", "自閉症", "學習障礙"];

    let _hasEduType = false; // 有無學校類別
    let _hasSchoolLocate = false; // 有無學校所在地列表，true 則採用 $schoolNameSelect，否則採用 $schoolNameText
    let _schoolCountryId = "";
    let _currentSchoolType = "";
    let _currentSchoolLocate = "";
    let _currentSchoolName = "";
    let _schoolList = [];
    let _schoolType = { // 有類別的地區
        "105": ["國際學校", "華校", "參與緬甸師資培育專案之華校", "緬校（僅緬十畢業）", "緬十畢業且在當地大學一年級修業完成", "緬十畢業且在當地大學二年級（含）以上修業完成"], // 緬甸
        "109": ["印尼當地中學", "海外臺灣學校"], // 印尼
        "128": ["國民（型）中學、外文中學", "馬來西亞華文獨立中學", "海外臺灣學校", "馬來西亞國際學校（International School）"], // 馬來西亞
        "133": ["海外臺灣學校", "越南當地中學"], // 越南
        "130": ["泰北未立案之華文中學", "泰國當地中學"] // 泰國
    };

    /**
     * cache DOM
     */
    const $studentList = $('#student-list'); // student 列表
    const $studentFilterInput = $('#student-filter-input'); // 搜尋欄
    var $editStudentInfoBtn; // 學生列表每項資料的編輯按鈕，資料取回後再綁定 event
    const $editStudentInfoModal = $('#editStudentInfoModal'); // 學生詳細資料 modal
    const $paginationContainer = $('#pagination-container'); // 分頁區域

    // Modal common elements
    const $modalStudentInfo = $('#modal-studentInfo');
    const $tab = $modalStudentInfo.find('#pills-tab'); // modal 分頁標籤
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

    // 家長資料
    // 父親
    const $dadStatus = $modalStudentInfo.find('.dadStatus'); // 存歿
    const $dadDataForm = $modalStudentInfo.find('#form-dadData'); // 資料表單
    const $dadName = $modalStudentInfo.find('#dadName'); // 姓名（中）
    const $dadEngName = $modalStudentInfo.find('#dadEngName'); // 姓名（英）
    const $dadBirthday = $modalStudentInfo.find('#dadBirthday'); // 生日
    const $dadHometown = $modalStudentInfo.find('#dadHometown'); // 籍貫
    const $dadJob = $modalStudentInfo.find('#dadJob'); // 職業
    const $dadPhone = $modalStudentInfo.find('#dadPhone');  // 電話
    // 母親
    const $momStatus = $modalStudentInfo.find('.momStatus'); // 存歿
    const $momDataForm = $modalStudentInfo.find('#form-momData'); // 資料表單
    const $momName = $modalStudentInfo.find('#momName'); // 姓名（中）
    const $momEngName = $modalStudentInfo.find('#momEngName'); // 姓名（英）
    const $momBirthday = $modalStudentInfo.find('#momBirthday'); // 生日
    const $momHometown = $modalStudentInfo.find('#momHometown'); // 籍貫
    const $momJob = $modalStudentInfo.find('#momJob'); // 職業
    const $momPhone = $modalStudentInfo.find('#momPhone');  // 電話
    // 監護人（父母皆不詳才需要填寫）
    const $guardianForm = $modalStudentInfo.find('#form-guardian'); // 資料表單
    const $guardianName = $modalStudentInfo.find('#guardianName'); // 姓名（中）
    const $guardianEngName = $modalStudentInfo.find('#guardianEngName'); // 姓名（英）
    const $guardianBirthday = $modalStudentInfo.find('#guardianBirthday'); // 生日
    const $guardianHometown = $modalStudentInfo.find('#guardianHometown'); // 籍貫
    const $guardianJob = $modalStudentInfo.find('#guardianJob'); // 職業
    const $guardianPhone = $modalStudentInfo.find('#guardianPhone');  // 電話

    // 在台聯絡人
    const $twContactName = $modalStudentInfo.find('#twContactName'); // 姓名
    const $twContactRelation = $modalStudentInfo.find('#twContactRelation'); // 關係
    const $twContactPhone = $modalStudentInfo.find('#twContactPhone'); // 聯絡電話
    const $twContactAddress = $modalStudentInfo.find('#twContactAddress'); // 地址
    const $twContactWorkplaceName = $modalStudentInfo.find('#twContactWorkplaceName'); // 服務機關名稱
    const $twContactWorkplacePhone = $modalStudentInfo.find('#twContactWorkplacePhone'); // 服務機關電話
    const $twContactWorkplaceAddress = $modalStudentInfo.find('#twContactWorkplaceAddress'); // 服務機關地址

    const $primarySchoolName = $modalStudentInfo.find('#primarySchoolName');
    const $primarySchoolAdmissionsAt = $modalStudentInfo.find('#primarySchoolAdmissionsAt');
    const $primarySchoolGraduatedAt = $modalStudentInfo.find('#primarySchoolGraduatedAt');
    const $highSchool1to3Name = $modalStudentInfo.find('#highSchool1to3Name');
    const $highSchool1to3AdmissionsAt = $modalStudentInfo.find('#highSchool1to3AdmissionsAt');
    const $highSchool1to3GraduatedAt = $modalStudentInfo.find('#highSchool1to3GraduatedAt');
    const $highSchool4to5Name = $modalStudentInfo.find('#highSchool4to5Name');
    const $highSchool4to5AdmissionsAt = $modalStudentInfo.find('#highSchool4to5AdmissionsAt');
    const $highSchool4to5GraduatedAt = $modalStudentInfo.find('#highSchool4to5GraduatedAt');
    const $highSchool6Name = $modalStudentInfo.find('#highSchool6Name');
    const $highSchool6AdmissionsAt = $modalStudentInfo.find('#highSchool6AdmissionsAt');
    const $highSchool6GraduatedAt = $modalStudentInfo.find('#highSchool6GraduatedAt');
    const $transfer = $modalStudentInfo.find('#transfer');


    //const $saveBtn = $('#btn-save');
    //const $saveBtn = $modalStudentInfo.find('#btn-save');

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
    $dadStatus.on('change', _chDadStatus);
    $momStatus.on('change', _chMomStatus);
    //$saveBtn.on('click', _handleSave);

    /**
     * init
     */
    init();

    async function init(){
        let res = await User.isLogin();
        if(res == true) {
            _setData();
        }
    }

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
            // console.log(json);
            //作分頁
            $studentAllList=json;
            $paginationContainer.pagination({
                dataSource: json,
                pageSize: 20,
                callback: function(json, pagination) {
                    _studentListTamplate(json);
                    $editStudentInfoBtn = $('.btn-editStudentInfo'); // 新增學生資料編輯按鈕的觸發事件（開啟 Modal）
                    $editStudentInfoBtn.on('click', _handleEditStudentInfo);
                }
            });



        }).then(() => {
            $.bootstrapSortable(true); // 啟用列表排序功能
            // $editStudentInfoBtn = $('.btn-editStudentInfo'); // 新增學生資料編輯按鈕的觸發事件（開啟 Modal）
            // $editStudentInfoBtn.on('click', _handleEditStudentInfo);

            stopLoading();
        }).catch((err) => {
            err.json && err.json().then((data) => {
                // console.error(data);
                swal({title: `錯誤`, text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false});
                stopLoading();
            });
        })
    }

    function _studentListTamplate(json){
        // 渲染 student 列表
        $studentList.find('tbody').html('');
        json.forEach(function (value, index) {
            const identity = ['港澳生', '港澳具外國國籍之華裔學生', '海外僑生', '在臺港澳生', '在臺僑生', '僑先部結業生', '印輔班結業生'];

            const system = ['學士班', '港二技', '碩士班', '博士班'];

            var system_name = '';
            var identity_name = '';
            var gender_name = '';
            let student_name = encodeHtmlCharacters(value.name);
            let student_eng_name = encodeHtmlCharacters(value.eng_name);

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
                        <tr class="btn-editStudentInfo" data-userid="${value.id}">
                            <td>
                                <span><i class="fa fa-pencil" aria-hidden="true"></i></span>
                            </td>
                            <td>${(value.id).toString().padStart(6, "0")}</td>
                            <td>${value.student_misc_data.overseas_student_id || ""}</td>
                            <td>${student_name} &nbsp;&nbsp;&nbsp;&nbsp; ${student_eng_name}</td>
                            <td>${gender_name}</td>
                            <td>${value.email}</td>
                            <td>${system_name}</td>
                            <td>${identity_name}</td>
                        </tr>`);

        });
        $.bootstrapSortable(true);
    }
    function _filterStudentInput(e) { // 搜尋過濾列表

        const filter = $studentFilterInput.val().toUpperCase();
        //console.log(filter);
        // for (i = 0; i < tr.length; i++) {
        //     let id = tr[i].getElementsByTagName("td")[1]; // 報名序號
        //     let overseas_id = tr[i].getElementsByTagName("td")[2]; // 僑生編號
        //     let name = tr[i].getElementsByTagName("td")[3]; // 姓名
        //     let email = tr[i].getElementsByTagName("td")[4]; // Email
        //
        //     if (id || overseas_id || email || name) {
        //         if (id.innerHTML.toUpperCase().indexOf(filter) > -1
        //             || overseas_id.innerHTML.toUpperCase().indexOf(filter) > -1
        //             || email.innerHTML.toUpperCase().indexOf(filter) > -1
        //             || name.innerHTML.toUpperCase().indexOf(filter) > -1) {
        //             tr[i].style.display = "";
        //         } else {
        //             tr[i].style.display = "none";
        //         }
        //     }
        // }
        //console.log("$studentAllList",$studentAllList);

        _filterStudentList = $studentAllList.filter(function (obj) {
            //有些還不會有僑編，轉成空字串避免後面toUpperCase出錯
            if( obj["student_misc_data"].overseas_student_id == null)
                obj["student_misc_data"].overseas_student_id='';
            //console.log("value===",obj["student_misc_data"].overseas_student_id);
            //console.log("type===",typeof(obj["student_misc_data"].overseas_student_id));

            // 搜尋 報名序號、姓名、email、僑編
            return ( obj["id"].toString().toUpperCase().indexOf(filter) > -1 ||
                obj["name"].toUpperCase().indexOf(filter) > -1 ||
                obj["email"].toUpperCase().indexOf(filter) > -1  ||
                obj["student_misc_data"].overseas_student_id.toUpperCase().indexOf(filter) > -1);
        });



        if (_filterStudentList.length === 0) {
            $studentList
                .find('tbody')
                .html(`
                        <tr>
				<td class="text-center" colspan="2">查無資料。</td>
				</tr>`);
        }
        else{
            $paginationContainer.pagination({
                dataSource: _filterStudentList,
                pageSize: 20,
                callback: function(json, pagination) {
                    _studentListTamplate(json);
                    $editStudentInfoBtn = $('.btn-editStudentInfo'); // 新增學生資料編輯按鈕的觸發事件（開啟 Modal）
                    $editStudentInfoBtn.on('click', _handleEditStudentInfo);
                }
            });
        }

        $.bootstrapSortable(true); // 啟用列表排序功能
        // $editStudentInfoBtn = $('.btn-editStudentInfo'); // 新增學生資料編輯按鈕的觸發事件（開啟 Modal）
        // $editStudentInfoBtn.on('click', _handleEditStudentInfo);

    }

    async function _handleEditStudentInfo() { // 學生列表 Modal 觸發
        await openLoading();

        _currentUserId = $(this).data('userid');
        try {
            const response = await Student.getStudentInfo(_currentUserId);
            if (!response.ok) { throw response; }
            const studentData = await response.json();
            if(studentData.student_qualification_verify){
                _systemId = studentData.student_qualification_verify.system_id;
                _identityId = studentData.student_qualification_verify.identity;
            }
            $('#pills-qualify-tab').click(); // 總之重新渲染就切回填報狀態頁簽
            _renderStudentRegistrationProgress(studentData);
            _renderStudentPersonalInfo(studentData);
            _renderStudentEducationInfo(studentData.student_education_background_data)

            switch(_systemId){
                case 1:
                    _renderStudentAdmissionSelectionOrder(studentData.student_department_admission_selection_order);
                    _renderStudentAdmissionPlacementOrder(studentData.student_department_admission_placement_order);
                    _renderStudentAdmissionOlympiaOrder(studentData.student_olympia_aspiration_order);
                    break;
                case 2:
                    _renderStudentAdmissionSelectionOrder(studentData.student_two_year_tech_department_admission_selection_order);
                    _renderStudentAdmissionPlacementOrder('x');
                    _renderStudentAdmissionOlympiaOrder('x');
                    break;
                case 3:
                case 4:
                    _renderStudentAdmissionSelectionOrder(studentData.student_graduate_department_admission_selection_order);
                    _renderStudentAdmissionPlacementOrder('x');
                    _renderStudentAdmissionOlympiaOrder('x');
                    break;
            }
            _showSpecailForm();
            _handleOtherDisabilityCategoryForm();
            _switchDadDataForm();
            _switchMomDataForm();
            _setResidenceContinent();
            _setSchoolContinent();
            await $editStudentInfoModal.modal({
                backdrop: 'static',
                keyboard: false
            });

            await stopLoading();
        }
        catch(e) {
            e.json && e.json().then((data) => {
                // console.error(data);
                swal({title: `錯誤`, text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false});
                stopLoading();
            });
            if (e.status == 401) {
                location.replace('./login.html');
            }
        }

    }

    function _renderStudentRegistrationProgress(value) {
        // console.log(value);
        const identity = ['港澳生', '港澳具外國國籍之華裔學生', '海外僑生', '在臺港澳生', '在臺僑生', '僑先部結業生', '印輔班結業生'];

        const system = ['學士班', '港二技', '碩士班', '博士班'];

        var system_name = '';
        var identity_name = '';
        var is_join_admission_selection = '';
        var has_olympia = '';
        var is_confirmed = '';
        var is_selection_document_lock = '';
        var countryName = '';
        var admission_placement_apply_name ='';
        var qualification_to_distribute ='';
        let confirmed_placement_at = '非後填志願學生';  // 後填志願鎖定情況
        let not_to_FF = '';

        if (value.student_qualification_verify) {
            if (value.student_qualification_verify.system_id) {
                system_name = system[value.student_qualification_verify.system_id - 1];
            }

            if (value.student_qualification_verify.identity) {
                identity_name = identity[value.student_qualification_verify.identity - 1];
            }
        }
        if (value.student_misc_data.join_admission_selection == 1)
            is_join_admission_selection = '參加個人申請';
        else if (value.student_misc_data.join_admission_selection == 0 )
            is_join_admission_selection = '僅參加聯合分發';
        else if (value.student_misc_data.join_admission_selection == 2)
            is_join_admission_selection = '無參加個人申請資格';
        else
            is_join_admission_selection = '無';

        if (value.student_qualification_verify.system_id == 1) {
            has_olympia = `
                <li>
                    曾獲國際數理奧林匹亞競賽/美國國際科展獎項：${(value.student_misc_data.has_olympia_aspiration)? '是': '否'}
                </li>
            `;
        }

        if (value.student_misc_data.confirmed_at != null)
            is_confirmed = '已完成填報';
        else
            is_confirmed = '尚未完成填報';

        if (value.student_misc_data.admission_selection_document_lock_at != null)
            is_selection_document_lock = '已上傳並鎖定備審資料';
        else if (value.student_misc_data.join_admission_selection != 1)
            is_selection_document_lock = '不需上傳備審資料';
        else
            is_selection_document_lock = '尚未鎖定備審資料';

        if (value.student_personal_data == null || value.student_personal_data.resident_location == null)
            countryName = '無';
        else
            countryName = _findCountryName(_findContinent(value.student_personal_data.resident_location), value.student_personal_data.resident_location);

        if(value.student_misc_data.admission_placement_apply_way_data != null){
            admission_placement_apply_name = value.student_misc_data.admission_placement_apply_way_data.description;
            if(value.student_misc_data.myanmar_test_area){
                admission_placement_apply_name += '<br/> 學科測驗考區：'+value.student_misc_data.myanmar_test_area;
            }
        } else {
            admission_placement_apply_name = '無';
        }
        if(value.student_misc_data.qualification_to_distribute != null)
            qualification_to_distribute = value.student_misc_data.qualification_to_distribute;
        else
            qualification_to_distribute = '無';

        // 為後填志願者才顯示相關訊息
        if(value.student_misc_data.confirmed_placement_at != null){  // 已經有時間戳 => 已經鎖定
            confirmed_placement_at = '已完成後填志願鎖定';
        } else if(value.student_misc_data.admission_placement_apply_way == 2 ||  // 港澳生以DSE、ALE、CEE作為採計方式
            value.student_misc_data.admission_placement_apply_way == 12 ||  // 港澳具外國國籍以DSE、ALE、CEE作為採計方式
            value.student_misc_data.admission_placement_apply_way == 37  // 印尼輔訓班
        ){  // 沒有時間戳 => 先看看是不是後填志願的
            confirmed_placement_at = '尚未完成後填志願鎖定';
        }

        if (value.student_misc_data.not_to_FF){
            not_to_FF = "學生<a class='text-danger'>不願意</a>被分發至僑先部";
        } else {
            not_to_FF = "學生<a class='text-success'>願意</a>被分發至僑先部";
        }

        let propose = value.student_misc_data.propose != null ? value.student_misc_data.propose : '';  // 保薦單位

        let progressListHTML ='';
        progressListHTML =`
            <ul style="font-size: 30px; margin-left: 2%; line-height: 190%; color: sienna;">
                <li>
                    【 ${system_name} 】${identity_name}
                </li>
                <li>
                    僑居地：${countryName}<br/>
                    保薦單位：${propose}
                </li>
                <li>
                    個人申請：${is_join_admission_selection}
                </li>
                ${has_olympia}
                <li>
                    聯分採計：${admission_placement_apply_name}
                </li>
                <li>
                    ${is_confirmed}
                </li>
                <li>
                    ${is_selection_document_lock}
                </li>
                <li>
                    資格不符原因：${qualification_to_distribute}
                </li>
        `;
        if(value.student_misc_data.distribution_school_verify){
            progressListHTML +=`
                <li>
                    最高學歷已核驗
                </li>
            `;
        }
        if(value.student_misc_data.not_for_medicine_dentist){
            progressListHTML +=`
                <li>
                    居留未滿八年，不得分發醫牙相關學系
                </li>
            `;
        }
        if(value.student_misc_data.confirmed_placement_at != null){
            progressListHTML+=`
                <li>
                    ${confirmed_placement_at}
                </li>
            `;
        }
        // 報名學士班且不是僑先部結業生有參加聯合分發不是報名僑先部或特輔班才顯示
        if (value.student_qualification_verify &&
            value.student_qualification_verify.system_id === 1 &&
            (value.student_qualification_verify.identity < 4 || value.student_qualification_verify.identity == 7) &&
            value.student_misc_data.admission_placement_apply_way_data != null &&
            (
                value.student_misc_data.admission_placement_apply_way_data.code != 99999 ||
                value.student_misc_data.admission_placement_apply_way_data.code != 16 ||
                value.student_misc_data.admission_placement_apply_way_data.code != 18
            )
        ){
            progressListHTML+=`
                <li>
                    ${not_to_FF}  <!--願不願意去僑生先修部-->
                </li>
            `;
        }
        // 有stage_of_admit才顯示
        if(value.student_misc_data.stage_of_admit !== null ){
            let admission_result = ''; // 錄取結果
            let department_title = '';
            let school_title = '';
            if(value.student_misc_data.department_data == null
                && value.student_misc_data.two_year_tech_department_data == null
                && value.student_misc_data.graduate_department_data == null){
                school_title = '此學校學系已註銷';
                department_title = '此學系已註銷';
            } else {
                if(value.student_misc_data.stage_of_admit == 'T'){
                    school_title = value.student_misc_data.two_year_tech_department_data.school.title;
                    department_title = value.student_misc_data.two_year_tech_department_data.title;
                } else if(value.student_misc_data.stage_of_admit == 'N'){
                    school_title = value.student_misc_data.graduate_department_data.school.title;
                    department_title = value.student_misc_data.graduate_department_data.title;
                } else{
                    school_title = value.student_misc_data.department_data.school.title;
                    department_title = value.student_misc_data.department_data.title;
                    if(value.student_misc_data.distribution_list_memo === '(特輔班)'){
                        department_title += '(特輔班)';
                    }
                }
            }
            switch(value.student_misc_data.stage_of_admit){
                case 'T':
                    admission_result = '港二技個人申請錄取結果：<br/>' + school_title + '<br/>' + department_title;
                    break;
                case 'N':
                    admission_result = '研究所個人申請錄取結果：<br/>' + school_title + '<br/>' + department_title;
                    break;
                case '0':
                    admission_result = '學士班個人申請錄取結果：<br/>' + school_title + '<br/>' + department_title;
                    break;
                case '1':
                    admission_result = '學士班第一梯次錄取結果：<br/>' + school_title + '<br/>' + department_title;
                    break;
                case '2':
                    admission_result = '學士班第二梯次錄取結果：<br/>' + school_title + '<br/>' + department_title;
                    break;
                case '3':
                    admission_result = '學士班第三梯次錄取結果：<br/>' + school_title + '<br/>' + department_title;
                    break;
                case '4':
                    admission_result = '學士班第四梯次錄取結果：<br/>' + school_title + '<br/>' + department_title;
                    break;
                case '5':
                    admission_result = '學士班第五梯次錄取結果：<br/>' + school_title + '<br/>' + department_title;
                    break;
            }
            progressListHTML +=`
                <li>
                    ${admission_result}
                </li>
            `;
        }
        // school5 = Y 才顯示
        if(value.student_misc_data.school5 == 'Y'){
            progressListHTML +=`
                <li>
                    中五學制學生
                </li>
            `;
        }
        progressListHTML +=`
            </ul>
        `;
        $('#pills-qualify').html(progressListHTML);
    }
    function _renderStudentPersonalInfo(json) {
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
            $residentAddress.val(json.student_personal_data.resident_address);

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
            } else {
                $subjectForm.hide();
                $majorSubject.val();
                $minorSubject.val();
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

            // init 家長資料
            // 父
            _currentDadStatus = json.student_personal_data.dad_status;
            $("input[name=dadStatus][value='"+ json.student_personal_data.dad_status +"']").prop("checked",true);
            $dadName.val(json.student_personal_data.dad_name);
            $dadEngName.val(json.student_personal_data.dad_eng_name);
            $dadBirthday.val(json.student_personal_data.dad_birthday);
            $dadHometown.val(json.student_personal_data.dad_hometown);
            $dadJob.val(json.student_personal_data.dad_job);
            $dadPhone.val(json.student_personal_data.dad_phone);
            // 母
            _currentMomStatus = json.student_personal_data.mom_status;
            $("input[name=momStatus][value='"+ json.student_personal_data.mom_status +"']").prop("checked",true);
            $momName.val(json.student_personal_data.mom_name);
            $momEngName.val(json.student_personal_data.mom_eng_name);
            $momBirthday.val(json.student_personal_data.mom_birthday);
            $momHometown.val(json.student_personal_data.mom_hometown);
            $momJob.val(json.student_personal_data.mom_job);
            $momPhone.val(json.student_personal_data.mom_phone);
            // 監護人
            $guardianName.val(json.student_personal_data.guardian_name);
            $guardianEngName.val(json.student_personal_data.guardian_eng_name);
            $guardianBirthday.val(json.student_personal_data.guardian_birthday);
            $guardianHometown.val(json.student_personal_data.guardian_hometown);
            $guardianJob.val(json.student_personal_data.guardian_job);
            $guardianPhone.val(json.student_personal_data.guardian_phone);

            // init 在台聯絡人
            $twContactName.val(json.student_personal_data.tw_contact_name);
            $twContactRelation.val(json.student_personal_data.tw_contact_relation);
            $twContactPhone.val(json.student_personal_data.tw_contact_phone);
            $twContactAddress.val(json.student_personal_data.tw_contact_address);
            $twContactWorkplaceName.val(json.student_personal_data.tw_contact_workplace_name);
            $twContactWorkplacePhone.val(json.student_personal_data.tw_contact_workplace_phone);
            $twContactWorkplaceAddress.val(json.student_personal_data.tw_contact_workplace_address);
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

            // init 家長資料
            // 父
            _currentDadStatus = 'alive';
            $("input[name=dadStatus]").prop("checked", false);
            $dadName.val("");
            $dadEngName.val("");
            $dadBirthday.val("");
            $dadHometown.val("");
            $dadJob.val("");
            // 母
            _currentMomStatus = 'alive';
            $("input[name=momStatus]").prop("checked", false);
            $momName.val("");
            $momEngName.val("");
            $momBirthday.val("");
            $momHometown.val("");
            $momJob.val("");
            // 監護人
            $guardianName.val("");
            $guardianEngName.val("");
            $guardianBirthday.val("");
            $guardianHometown.val("");
            $guardianJob.val("");

            // init 在台聯絡人
            $twContactName.val("");
            $twContactRelation.val("");
            $twContactPhone.val("");
            $twContactAddress.val("");
            $twContactWorkplaceName.val("");
            $twContactWorkplacePhone.val("");
            $twContactWorkplaceAddress.val("");
        }
    }

    function _renderStudentEducationInfo(student_education_background_data) {
        if (student_education_background_data) {
            $primarySchoolName.val(student_education_background_data.primary_school_name || "");
            $primarySchoolAdmissionsAt.val(student_education_background_data.primary_school_admissions_at || "");
            $primarySchoolGraduatedAt.val(student_education_background_data.primary_school_graduated_at || "");
            $highSchool1to3Name.val(student_education_background_data.high_school_1to3_name || "");
            $highSchool1to3AdmissionsAt.val(student_education_background_data.high_school_1to3_admissions_at || "");
            $highSchool1to3GraduatedAt.val(student_education_background_data.high_school_1to3_graduated_at || "");
            $highSchool4to5Name.val(student_education_background_data.high_school_4to5_name || "");
            $highSchool4to5AdmissionsAt.val(student_education_background_data.high_school_4to5_admissions_at || "");
            $highSchool4to5GraduatedAt.val(student_education_background_data.high_school_4to5_graduated_at || "");
            $highSchool6Name.val(student_education_background_data.high_school_6_name || "");
            $highSchool6AdmissionsAt.val(student_education_background_data.high_school_6_admissions_at || "");
            $highSchool6GraduatedAt.val(student_education_background_data.high_school_6_graduated_at || "");
            $transfer.val(student_education_background_data.transfer || "");
        } else {
            $primarySchoolName.val("");
            $primarySchoolAdmissionsAt.val("");
            $primarySchoolGraduatedAt.val("");
            $highSchool1to3Name.val("");
            $highSchool1to3AdmissionsAt.val("");
            $highSchool1to3GraduatedAt.val("");
            $highSchool4to5Name.val("");
            $highSchool4to5AdmissionsAt.val("");
            $highSchool4to5GraduatedAt.val("");
            $highSchool6Name.val("");
            $highSchool6AdmissionsAt.val("");
            $highSchool6GraduatedAt.val("");
            $transfer.val("");
        }
    }

    function _renderStudentAdmissionSelectionOrder(json) {
        let selectionHTML = '';
        json.forEach((value, index) => {
            index= parseInt(index,10) + 1;
            // console.log(index + 1);
            // console.log(value.department_data.school_code);
            // console.log(value.department_data.school.title);
            // console.log(value.dept_id);
            // console.log(value.department_data.is_extended_department);

            let review_result_string = '';
            if(value.review_result){
                review_result_string = '<strong class="text-success">合格</strong>，合格排序為：'+ value.review_order;
            } else if(value.fail_result_data !== null){  // 不合格者fail_result為必填，審核後退回or不合格review_result都=0
                review_result_string = '<strong class="text-danger">不合格</strong>，原因為：<br/>'+ value.fail_result_data.reason;
            }

            var note ='';
            if(value.deleted_at != null){
                if(value.give_up === 1){
                    note = '註銷，自願放棄';
                } else {
                    note = '註銷，切結放棄';
                }
            }
            let schoo_dept_title = value.department_data.school.title + ' ';
            if(value.department_data.is_extended_department == 1){
                schoo_dept_title = schoo_dept_title + '<span class="badge badge-warning">重點產業系所</span> ' + value.department_data.title;
            } else if(value.department_data.is_extended_department == 2){
                schoo_dept_title = schoo_dept_title + '<span class="badge table-primary">國際專修部</span> ' + value.department_data.title;
            } else {
                schoo_dept_title = schoo_dept_title + value.department_data.title;
            }
            selectionHTML += `
                        <tr>
                        <td>` + index + `</td>
                        <td>` + value.dept_id + `</td>
                        <td>` + schoo_dept_title + `</td>
                        <td>` + review_result_string + `</td>
                        <td>` + note + `</td>
                        </tr>
                        `;
        });
        $('#tbody-selection').html(selectionHTML);

    }

    function _renderStudentAdmissionOlympiaOrder(json) {
        // console.log(json);
        let olympiaHTML = '';
        if ( json == 'x'){
            olympiaHTML = `<tr><td colspan="3" style="font-size: xx-large; text-align: center;">不適用</td></tr>`;
            $('.olympiaList-tab').hide();
        } else {
            $('.olympiaList-tab').show();
            try {
                json.forEach((value, index) => {
                    index= parseInt(index,10) + 1;
                    var note ='';
                    if(value.deleted_at != null)
                        note = '註銷';
                    let schoo_dept_title = '';
                    if (value.department_data != null) {
                        schoo_dept_title = (value.department_data.school!=null) ? value.department_data.school.title + ' ' : '';
                        if(value.department_data.is_extended_department == 1){
                            schoo_dept_title = schoo_dept_title + '<span class="badge badge-warning">重點產業系所</span> ' + value.department_data.title;
                        } else if(value.department_data.is_extended_department == 2){
                            schoo_dept_title = schoo_dept_title + '<span class="badge table-primary">國際專修部</span> ' + value.department_data.title ;
                        } else {
                            schoo_dept_title = schoo_dept_title + value.department_data.title;
                        }
                    }
                    olympiaHTML += `
                                <tr>
                                <td>` + index + `</td>
                                <td>` + value.dept_id + `</td>
                                <td>` + schoo_dept_title + `</td>
                                <td>` + note + `</td>
                                </tr>
                                `;
                });
            } catch (e) {
                // console.log(e);
            }
        }
        $('#tbody-olympia').html(olympiaHTML);
    }

    function _renderStudentAdmissionPlacementOrder(json) {
        //console.log(json);
        let placementHTML = '';
        if ( json == 'x'){
            placementHTML = `<tr><td colspan="3" style="font-size: xx-large; text-align: center;">不適用</td></tr>`;
            $('.placementList-tab').hide();
            $('.educationInfo-tab').hide();
        } else {
            $('.placementList-tab').show();
            $('.educationInfo-tab').show();
            json.forEach((value, index) => {
                index= parseInt(index,10) + 1;
                var note ='';
                if(value.deleted_at != null)
                    note = '註銷';
                let schoo_dept_title = '';
                if (value.department_data != null) {
                    schoo_dept_title = (value.department_data.school!=null) ? value.department_data.school.title + ' ' : '';
                    if(value.department_data.is_extended_department == 1){
                        schoo_dept_title = schoo_dept_title + '<span class="badge badge-warning">重點產業系所</span> ' + value.department_data.title;
                    } else if(value.department_data.is_extended_department == 2){
                        schoo_dept_title = schoo_dept_title + '<span class="badge table-primary">國際專修部</span> ' + value.department_data.title ;
                    } else {
                        schoo_dept_title = schoo_dept_title + value.department_data.title;
                    }
                }
                placementHTML += `
							<tr>
							<td>` + index + `</td>
							<td>` + value.dept_id + `</td>
							<td>` + schoo_dept_title + `</td>
							<td>` + note + `</td>
							</tr>
							`;
            });
        }
        $('#tbody-placement').html(placementHTML);

    }

    function _initCountryList() {
        Miscellaneous.getCountryList()
            .then((json) => {
                _countryList = json;
                let stateHTML = '<option value="-1" data-continentIndex="-1">Continent</option>';
                json.forEach((obj, index) => {
                    stateHTML += `<option value="${index}" data-continentIndex="${index}">${obj.continent}</option>`;
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

    function _findCountryName(ContinentID, countryID) {
        for (let i = 0; i < _countryList[ContinentID].country.length; i++) {
            if( countryID == _countryList[ContinentID].country[i].id)
                 return _countryList[ContinentID].country[i].country;
        }
        return -1;
    }

    function _setResidenceContinent() {
        // 兩種港澳生的洲別只能選到「亞洲」
        if ($residenceContinent && (_identityId === 1 || _identityId === 2 || _identityId === 4)) {
            let residenceContinentOptions = $residenceContinent.find('option');
            for (let i = 0; i < residenceContinentOptions.length; i++) {
                if (!(residenceContinentOptions[i].value === "-1" || residenceContinentOptions[i].value === "0")) {
                    residenceContinentOptions[i].remove();
                }
            }
        }
    }

    function _setSchoolContinent() {
        // 港二技的學校洲別只能選到「亞洲」
        if ($schoolContinent && (_systemId === 2)) {
            let schoolContinentOptions = $schoolContinent.find('option');
            for (let i = 0; i < schoolContinentOptions.length; i++) {
                if (!(schoolContinentOptions[i].value === "-1" || schoolContinentOptions[i].value === "0")) {
                    schoolContinentOptions[i].remove();
                }
            }
        }
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
            countryHTML = '<option value="">Country</option>';
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
            countryHTML = '<option value="">Country</option>';
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
            countryHTML = '<option value="">Country</option>';
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
        let i = phoneNum.indexOf("-");
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
                            // console.error(data);
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

    function _chDadStatus() {
        _currentDadStatus = $(this).val();
        _switchDadDataForm();
    }

    function _switchDadDataForm() {
        if (_currentDadStatus === "undefined") {
            $dadDataForm.hide();
            $('.br-father').hide();
        } else {
            $dadDataForm.fadeIn();
        }
        _switchGuardianForm();
    }

    function _chMomStatus() {
        _currentMomStatus = $(this).val();
        _switchMomDataForm();
    }

    function _switchMomDataForm() {
        if (_currentMomStatus === "undefined") {
            $momDataForm.hide();
            $('.br-mother').hide();
        } else {
            $momDataForm.fadeIn();
        }
        _switchGuardianForm();
    }

    function _switchGuardianForm() {
        if (_currentDadStatus === "undefined" && _currentMomStatus === "undefined") {
            $guardianForm.fadeIn();
        } else {
            $guardianForm.hide();
        }
    }

    // 轉換一些敏感字元避免 XSS
    function encodeHtmlCharacters(bareString) {
        if (bareString === null) return '';
        return bareString.replace(/&/g, "&amp;")  // 轉換 &
            .replace(/</g, "&lt;").replace(/>/g, "&gt;")  // 轉換 < 及 >
            .replace(/'/g, "&apos;").replace(/"/g, "&quot;")  // 轉換英文的單雙引號
            .replace(/ /g, " &nbsp;")
            ;
    }

})();
