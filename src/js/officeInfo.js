var officeInfo = (function () {
    /**
     * cache DOM
     */
    var $officeList = $('#office-list'); // office 列表
    var $officeFilterInput = $('#office-filter-input'); // 搜尋欄

    /**
     * bind event
     */
    $officeFilterInput.on('keyup', _filterOfficeInput); // 系所列表篩選

    /**
     * init
     */
    init();

    function init(){
        User.isLogin().then(function (res) {
            if(res.ok) {
                return res.json();
            } else {
                throw res.status;
            }
        }).then(function (json) {
            if (!json['admin'] || json['admin'].has_banned) {
                location.replace('./login.html');
            } else {
                _setData();
            }
        }).catch(function (err) {
            if (err == 401) {
                alert('請先登入！！');
            }
        });
    }

    function _setData() {
        //openLoading();

        Office.getOfficeList() // 取得 office 列表
            .then((res) => {
                if(res.ok) { // 有資料則開始頁面初始化
                    return res.json();
                } else {
                    throw res;
                }
            }).then((json) => {
            // 渲染 office 列表
            $officeList.find('tbody').html('');
            json.forEach(function (value, index) {
                var ocac_id;
                var email;
                var can_verify;
                var has_admin;

                if (!value.ocac_id) {
                    ocac_id = "";
                } else {
                    ocac_id = `${value.ocac_id}`;
                }

                if (!value.user.email) {
                    email = "";
                } else {
                    email = `${value.user.email}`;
                }

                if (value.can_verify === true) {
                    can_verify = "是";
                } else {
                    can_verify = "否";
                }

                if (value.has_admin === true) {
                    has_admin = "是";
                } else {
                    has_admin = "否";
                }

                const authority = ['海外聯招會', '香港海華服務基金', '澳門辦事處', '僑務委員會', '海外聯招會在臺碩博窗口'];

                $officeList
                    .find('tbody')
                    .append(`
                        <tr>
                            <td>
                                <!--<span class="btn-editSchoolEditorInfo" data-userid="${value.user.id}"><i class="fa fa-pencil" aria-hidden="true"></i></span>-->
                            </td>
                            <td>${value.user.username}</td>
                            <td>${value.user.name}</td>
                            <td>${authority[value.authority - 1]}</td>
                            <td>${value.user.phone}</td>
                            <td>${email}</td>
                            <td>${ocac_id}</td>
                            <td>${can_verify}</td>
                            <td>${has_admin}</td>
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

    function _filterOfficeInput(e) { // 「系所列表」搜尋過濾列表
        let filter = $officeFilterInput.val().toUpperCase();
        var tr = $officeList.find('tr');

        for (i = 0; i < tr.length; i++) {
            let username = tr[i].getElementsByTagName("td")[1]; // 帳號
            let name = tr[i].getElementsByTagName("td")[2]; // 姓名
            let org = tr[i].getElementsByTagName("td")[3]; // 單位


            if (username || org || name) {
                if (username.innerHTML.toUpperCase().indexOf(filter) > -1
                    || org.innerHTML.toUpperCase().indexOf(filter) > -1
                    || name.innerHTML.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }
})();