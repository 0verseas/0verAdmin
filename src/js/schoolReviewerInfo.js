var reviewerInfo = (function () {
    /**
     * cache DOM
     */
    var $schoolReviewerList = $('#reviewer-list'); // school reviewer 列表
    var $schoolReviewerFilterInput = $('#reviewer-filter-input'); // 搜尋欄

    /**
     * bind event
     */
    $schoolReviewerFilterInput.on('keyup', _filterSchoolReviewerInput); // 系所列表篩選

    /**
     * init
     */
    _setData();

    function _setData() {
        //openLoading();

        SchoolReviewer.getSchoolReviewerList() // 取得 school reviewer 列表
            .then((res) => {
                if(res.ok) { // 有資料則開始頁面初始化
                    return res.json();
                } else {
                    throw res;
                }
            }).then((json) => {
            // 渲染 school reviewer 列表
            $schoolReviewerList.find('tbody').html('');
            json.forEach(function (value, index) {
                $schoolReviewerList
                    .find('tbody')
                    .append(`
                        <tr>
                            <td>
                                <!--<span class="btn-editSchoolEditorInfo" data-userid="${value.user.id}"><i class="fa fa-pencil" aria-hidden="true"></i></span>-->
                            </td>
                            <td>${value.user.username}</td>
                            <td>${value.school.title}</td>
                            <td>${value.organization}</td>
                            <td>${value.user.name}</td>
                            <td>${value.user.phone}</td>
                            <td>${value.user.email}</td>
                            <td>${value.school.address}</td>
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

    function _filterSchoolReviewerInput(e) { // 搜尋過濾列表
        let filter = $schoolReviewerFilterInput.val().toUpperCase();
        var tr = $schoolReviewerList.find('tr');

        for (i = 0; i < tr.length; i++) {
            let school = tr[i].getElementsByTagName("td")[2]; // 學校
            let org = tr[i].getElementsByTagName("td")[3]; // 單位
            let name = tr[i].getElementsByTagName("td")[4]; // 姓名

            if (school || org || name) {
                if (school.innerHTML.toUpperCase().indexOf(filter) > -1 || org.innerHTML.toUpperCase().indexOf(filter) > -1 || name.innerHTML.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }
})();
