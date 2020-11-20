var editorInfo = (function () {
    /**
     * cache DOM
     */
    var $schoolEditorList = $('#editor-list'); // school editor 列表
    var $schoolEditorFilterInput = $('#editor-filter-input'); // 搜尋欄

    /**
     * bind event
     */
    $schoolEditorFilterInput.on('keyup', _filterSchoolEditorInput); // 系所列表篩選

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

        SchoolEditor.getSchoolEditorList() // 取得 school editor 列表
            .then((res) => {
                if(res.ok) { // 有資料則開始頁面初始化
                    return res.json();
                } else {
                    throw res;
                }
            }).then((json) => {
                // 渲染 school editor 列表
                $schoolEditorList.find('tbody').html('');
                json.forEach(function (value, index) {
                    let organization = encodeHtmlCharacters(value.organization);
                    let name = encodeHtmlCharacters(value.user.name);
                    let phone = encodeHtmlCharacters(value.user.phone);
                    let schoolAddress = encodeHtmlCharacters(value.school.address);
                    $schoolEditorList
                        .find('tbody')
                        .append(`
                        <tr>
                            <td>
                                <!--<span class="btn-editSchoolEditorInfo" data-userid="${value.user.id}"><i class="fa fa-pencil" aria-hidden="true"></i></span>-->
                            </td>
                            <td>${value.user.username}</td>
                            <td>${value.school.title}</td>
                            <td>${organization}</td>
                            <td>${name}</td>
                            <td>${phone}</td>
                            <td>${value.user.email}</td>
                            <td>${schoolAddress}</td>
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

    function _filterSchoolEditorInput(e) { // 搜尋過濾列表
        let filter = $schoolEditorFilterInput.val().toUpperCase();
        var tr = $schoolEditorList.find('tr');

        for (i = 0; i < tr.length; i++) {
            let username = tr[i].getElementsByTagName("td")[1]; // 帳號
            let school = tr[i].getElementsByTagName("td")[2]; // 學校
            let org = tr[i].getElementsByTagName("td")[3]; // 單位
            let name = tr[i].getElementsByTagName("td")[4]; // 姓名

            if (username || school || org || name) {
                if (username.innerHTML.toUpperCase().indexOf(filter) > -1
                    || school.innerHTML.toUpperCase().indexOf(filter) > -1
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
