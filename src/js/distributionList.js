var distributionList = (function () {
    /**
     * cache DOM
     */
    const $s0_list_bachelor = $('#s0_list_bachelor'); // 個人申請 學士班 分發名單
    const $s0_selection_order_bachelor = $('#s0_selection_order_bachelor'); // 個人申請 學士班 志願母檔

    const $s0_list_graduate = $('#s0_list_graduate'); // 個人申請 研究所 分發名單
    const $s0_selection_order_graduate = $('#s0_selection_order_graduate'); // 個人申請 研究所 志願母檔

    /**
     * bind event
     */

    /**
     * init
     */
    _setData();

    function _setData() {
        $s0_list_bachelor.attr('href', env.baseUrl + '/admins/distribution/s0_bachelor');
        //$s0_selection_order_bachelor.attr('href', env.baseUrl + '/');

        $s0_list_graduate.attr('href', env.baseUrl + '/admins/distribution/s0_graduate');
        //$s0_selection_order_grasuate.attr('href', env.baseUrl + '/');
    }
})();