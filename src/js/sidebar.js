var Sidebar = (function () {
    /**
     * cache DOM
     */
    var $toggleBtn = $('#btn-toggle');
    var $sidebarWrap = $('#sidebarWrap');
    var $editAccountBtn = $sidebarWrap.find('#btn-editAccount');
    var $logoutBtn = $sidebarWrap.find('#btn-logout');
    var $userSchool = $sidebarWrap.find('#userSchool');
    var $userName = $sidebarWrap.find('#userName');
    var $roleBadge = $sidebarWrap.find('#badge-role');

    /**
     * bind event
     */
    $toggleBtn.on('click', _toggleSidebar);
    $editAccountBtn.on('click', _handleEditAccount);
    $logoutBtn.on('click', _logout);

    /**
     * init
     */
    showUserInfo();

    function _toggleSidebar() {
        $sidebarWrap.toggleClass('open');
    }

    function _handleEditAccount() {
        accountEditModal.open();
    }

    function _logout() {
        User.logout().then(function(res) {
            if(res.ok) {
                window.location.replace('/login.html');
            } else {
                throw res.status;
            }
        }).catch(function(err) {
            console.log("error: " + err);
        })
    }

    function showUserInfo() {
        var userInfo = User.getUserInfo();
        if (!userInfo) {
            setTimeout(showUserInfo, 1);
            return;
        }
        var role = userInfo.admin.has_admin ? '上帝' : '管理員';
        $roleBadge.text(role);
        $userName.text(userInfo.name);
        $userSchool.text(userInfo.school_editor.school.title);
    }

    return {
        showUserInfo
    }

})();
