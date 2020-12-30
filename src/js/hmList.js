var receiptList = (function () {
    /**
     * cache DOM
     */
    const $mc_card = $('#macau-card');
    const $mc_selection_local_immigration = $('#mc-selection-local-immigration'); // 澳門個人申請出入境清冊
    const $mc_placement_local_immigration = $('#mc-placement-local-immigration'); // 澳門聯合分發出入境清冊
    const $mc_foreign_immigration = $('#mc-foreign-immigration'); // 澳門持外國學歷(個申+聯分)出入境清冊

    const $hk_card = $('#hongkong-card');
    const $hk_selection_local_immigration = $('#hk-selection-local-immigration'); // 香港個人申請出入境清冊
    const $hk_placement_local_immigration = $('#hk-placement-local-immigration'); // 香港聯合分發出入境清冊
    const $hk_to_preparatory_immigration = $('#hk-to-preparatory-immigration'); // 香港自願免試申請僑先部出入境清冊
    const $hk_selection_foreign_immigration = $('#hk-selection-foreign-immigration'); // 香港持外國學歷個人申請出入境清冊
    const $hk_placement_foreign_immigration = $('#hk-placement-foreign-immigration'); // 香港持外國學歷聯合分發出入境清冊

    const $graduated_card = $('#graduated-card');
    const $graduated_immigration = $('#graduated-immigration'); // 研究所出入境清冊

    const $two_year_card = $('#two-year-card');    
    const $two_year_immigration = $('#two-year-immigration'); // 港二技出入境清冊
    /**
     * bind event
     */

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
        $mc_card[0].textContent = '凱婷';

        $hk_card[0].textContent = '楷榕';
        $graduated_card[0].textContent = '旻燁';

        $two_year_card[0].textContent = '嘉偵';

        //出入境清冊 連結 append
        $mc_selection_local_immigration.attr('href', env.baseUrl + '/admins/verified/mc-selection-local-immigration');
        $mc_placement_local_immigration.attr('href', env.baseUrl + '/admins/verified/mc-placement-local-immigration');
        $mc_foreign_immigration.attr('href', env.baseUrl + '/admins/verified/mc-foreign-immigration');

        $hk_selection_local_immigration.attr('href', env.baseUrl + '/admins/verified/hk-selection-local-immigration');
        $hk_placement_local_immigration.attr('href', env.baseUrl + '/admins/verified/hk-placement-local-immigration');
        $hk_to_preparatory_immigration.attr('href', env.baseUrl + '/admins/verified/hk-to-preparatory-immigration');
        $hk_selection_foreign_immigration.attr('href', env.baseUrl + '/admins/verified/hk-selection-foreign-immigration');
        $hk_placement_foreign_immigration.attr('href', env.baseUrl + '/admins/verified/hk-placement-foreign-immigration');

        $graduated_immigration.attr('href', env.baseUrl + '/admins/verified/graduated-immigration');

        $two_year_immigration.attr('href', env.baseUrl + '/admins/verified/two-year-immigration');

        //身份查核通報名冊 連結 append
        $('#mc-selection-local-check').attr('href', env.baseUrl + '/admins/verified/mc-selection-local-check');
        $('#mc-placement-local-check').attr('href', env.baseUrl + '/admins/verified/mc-placement-local-check');
        $('#mc-foreign-check').attr('href', env.baseUrl + '/admins/verified/mc-foreign-check');

        $('#hk-selection-local-check').attr('href', env.baseUrl + '/admins/verified/hk-selection-local-check');
        $('#hk-placement-local-check').attr('href', env.baseUrl + '/admins/verified/hk-placement-local-check');
        $('#hk-to-preparatory-check').attr('href', env.baseUrl + '/admins/verified/hk-to-preparatory-check');
        $('#hk-selection-foreign-check').attr('href', env.baseUrl + '/admins/verified/hk-selection-foreign-check');
        $('#hk-placement-foreign-check').attr('href', env.baseUrl + '/admins/verified/hk-placement-foreign-check');

        $('#graduated-check').attr('href', env.baseUrl + '/admins/verified/graduated-check');

        $('#two-year-check').attr('href', env.baseUrl + '/admins/verified/two-year-check');
    }
})();