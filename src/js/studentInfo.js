var studentInfo = (function () {
    /**
     * cache DOM
     */
    var $studentList = $('#student-list'); // student 列表
    var $studentFilterInput = $('#student-filter-input'); // 搜尋欄

    /**
     * bind event
     */
    $studentFilterInput.on('keyup', _filterStudentInput); // 學生列表篩選

    /**
     * init
     */
    _setData();

    function _setData() {
        //openLoading();

        Student.getStudentList() // 取得 student 列表
            .then((res) => {
                if(res.ok) { // 有資料則開始頁面初始化
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

                if (value.student_qualification_verify && value.student_qualification_verify.system_id) {
                    system_name = system[value.student_qualification_verify.system_id - 1];
                }

                if (value.student_qualification_verify && value.student_qualification_verify.identity) {
                    identity_name = identity[value.student_qualification_verify.identity - 1];
                }

                $studentList
                    .find('tbody')
                    .append(`
                        <tr>
                            <td>
                                <!--<span class="btn-editSchoolEditorInfo" data-userid="${value.id}"><i class="fa fa-pencil" aria-hidden="true"></i></span>-->
                            </td>
                            <td>${value.id}</td>
                            <td>${value.student_misc_data.overseas_student_id || ""}</td>
                            <td>${value.name} &nbsp;&nbsp;&nbsp;&nbsp; ${value.eng_name}</td>
                            <td>${value.email}</td>
                            <td>${system_name}</td>
                            <td>${identity_name}</td>
                        </tr>
                    `);
            });
        }).then(() => {
            $.bootstrapSortable(true); // 啟用列表排序功能
            //$editDeptInfoBtn = $('.btn-editDeptInfo'); // 新增系所編輯按鈕的觸發事件（開啟 Modal）
            //$editDeptInfoBtn.on('click', _handleEditDeptInfo);
            //DeptInfo.renderDeptSelect(_currentSystem); // 產生系所詳細資料 Modal 中下拉式選單

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
})();
