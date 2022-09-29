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

    async function init(){
        let res = await User.isLogin();
        if(res == true) {
            _setData();
        }
    }

    function _setData() {
        //openLoading();

        AccountList.getOfficeList() // 取得 office 列表
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
                let username = encodeHtmlCharacters(value.user.username);
                let name = encodeHtmlCharacters(value.user.name);
                let phone = encodeHtmlCharacters(value.user.phone);

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

                const authority = ['海外聯招會', '香港海華服務基金', '澳門辦事處', '僑務委員會', '海外聯招會在臺碩博窗口', '移民署'];

                $officeList
                    .find('tbody')
                    .append(`
                        <tr>
                            <td>
                                <!--<span class="btn-editSchoolEditorInfo" data-userid="${value.user.id}"><i class="fa fa-pencil" aria-hidden="true"></i></span>-->
                            </td>
                            <td>${username}</td>
                            <td>${name}</td>
                            <td>${authority[value.authority - 1]}</td>
                            <td>${phone}</td>
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
                swal({title: `錯誤`, text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false});

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