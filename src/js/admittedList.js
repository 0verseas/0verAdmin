var admittedList = (function () {
    /**
     * cache DOM
     */
    const $stage_one = $('#s1_admitted_list'); //聯合分發第一梯次錄取

    /**
     * bind event
     */

    /**
     * init
     */
    _setData();

    function _setData() {
        $stage_one.attr('href', env.baseUrl + '/admins/admit/stage_one');
    }
})();