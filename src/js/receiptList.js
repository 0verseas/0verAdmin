var receiptList = (function () {
    /**
     * cache DOM
     */
    const $mc_card = $('#macau-card');
    const $mc_selection = $('#mc_selection'); // 澳門個人申請
    const $mc_placement = $('#mc_placement'); // 澳門聯合分發
    const $mc_foreign_edu = $('#mc_foreign_edu'); // 澳門持外國學歷(個申+聯分)

    const $myanmar_card = $('#myanmar-card');
    const $test_area_selection = $('#test_area_selection'); // 測驗地區個人申請（文憑別為學科測驗或綜合學科測驗，但不含澳門）
    const $myanmar_teacher_education = $('#myanmar_teacher_education'); // 緬甸師培專案
    const $myanmar_selection = $('#myanmar_selection'); // 緬甸個人申請
    const $myanmar_placement = $('#myanmar_placement'); // 緬甸聯合分發
    const $test_area_placement = $('#test_area_placement'); // 測驗地區聯合分發（文憑別為學科測驗或綜合學科測驗，但不含澳門）
    const $mya_sg_ph_to_preparatory_program = $('#mya_sg_ph_to_preparatory_program'); // 免試申請橋先部（緬十、新、菲）

    const $hk_card = $('#hongkong-card');
    const $hk_selection = $('#hk_selection'); // 香港個人申請
    const $hk_placement = $('#hk_placement'); // 香港聯合分發
    const $hk_to_preparatory_program = $('#hk_to_preparatory_program'); // 香港自願免試申請僑先部
    const $hk_foreign_edu_selection = $('#hk_foreign_edu_selection'); // 香港持外國學歷個人申請
    const $hk_foreign_edu_placement = $('#hk_foreign_edu_placement'); // 香港持外國學歷聯合分發

    const $indonesia_card = $('#indonesia-card');
    const $graduated = $('#graduated'); // 研究所
    const $indonesia_selection = $('#indonesia_selection'); // 印尼個人申請
    const $indonesia_placement = $('#indonesia_placement'); // 印尼聯合分發

    const $malaysia_card = $('#malaysia-card');
    const $malaysia_spring = $('#malaysia_spring'); // 馬春班
    const $malaysia_selection = $('#malaysia_selection'); // 馬來西亞個人申請
    const $malaysia_stage1_placement = $('#malaysia_stage1_placement'); // 馬來西亞聯合分發第一梯次
    const $malaysia_stage2_placement = $('#malaysia_stage2_placement'); // 馬來西亞聯合分發第二梯次

    const $ocac_card = $('#ocac-card');    
    const $preparatory_program_graduated_selection = $('#preparatory_program_graduated_selection'); // 僑先部結業生個人申請收件清冊
    const $preparatory_program_graduated_placement = $('#preparatory-program_graduated_placement'); // 僑先部結業生聯合分發收件清冊
    const $ocac_selection = $('#ocac_selection'); // 免試地區個人申請收件清冊
    const $ocac_placement = $('#ocac_placement'); // 免試地區聯合分發收件清冊
    const $two_year = $('#two_year'); // 港二技收件清冊
    /**
     * bind event
     */

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
        $mc_card[0].textContent = '凱婷';
        $myanmar_card[0].textContent = '楷嘉';
        $hk_card[0].textContent = '楷榕';
        $indonesia_card[0].textContent = '旻燁';
        $malaysia_card[0].textContent = '向榮';
        $ocac_card[0].textContent = '嘉偵';

        $mc_selection.attr('href', env.baseUrl + '/admins/verified/mc-selection');
        $mc_placement.attr('href', env.baseUrl + '/admins/verified/mc-placement');
        $mc_foreign_edu.attr('href', env.baseUrl + '/admins/verified/mc-foreign-edu');

        $test_area_selection.attr('href', env.baseUrl + '/admins/verified/test-area-selection');
        $myanmar_teacher_education.attr('href', env.baseUrl + '/admins/verified/myanmar-teacher-education');
        $myanmar_selection.attr('href', env.baseUrl + '/admins/verified/myanmar-selection');
        $myanmar_placement.attr('href', env.baseUrl + '/admins/verified/myanmar-placement');
        $test_area_placement.attr('href', env.baseUrl + '/admins/verified/test-area-placement');
        $mya_sg_ph_to_preparatory_program.attr('href', env.baseUrl + '/admins/verified/mya-sg-ph-to-preparatory-program');

        $hk_selection.attr('href', env.baseUrl + '/admins/verified/hk-selection');
        $hk_placement.attr('href', env.baseUrl + '/admins/verified/hk-placement');
        $hk_to_preparatory_program.attr('href', env.baseUrl + '/admins/verified/hk-to-preparatory-program');
        $hk_foreign_edu_selection.attr('href', env.baseUrl + '/admins/verified/hk-foreign-edu-selection');
        $hk_foreign_edu_placement.attr('href', env.baseUrl + '/admins/verified/hk-foreign-edu-placement');

        $graduated.attr('href', env.baseUrl + '/admins/verified/graduated');
        $indonesia_selection.attr('href', env.baseUrl + '/admins/verified/indonesia-selection');
        $indonesia_placement.attr('href', env.baseUrl + '/admins/verified/indonesia-placement');

        $malaysia_spring.attr('href', env.baseUrl + '/admins/verified/malaysia-spring');
        $malaysia_selection.attr('href', env.baseUrl + '/admins/verified/malaysia-selection');
        $malaysia_stage1_placement.attr('href', env.baseUrl + '/admins/verified/malaysia_placement_stage1');
        $malaysia_stage2_placement.attr('href', env.baseUrl + '/admins/verified/malaysia_placement_stage2');

        $preparatory_program_graduated_selection.attr('href', env.baseUrl + '/admins/verified/preparatory-program-graduated-selection');
        $preparatory_program_graduated_placement.attr('href', env.baseUrl + '/admins/verified/preparatory-program-graduated-placement');
        $ocac_selection[0].innerHTML = '<i class="fa fa-download" aria-hidden="true"></i>&nbsp;&nbsp;免試地區個人申請收件清冊';
        $ocac_selection.attr('href', env.baseUrl + '/admins/verified/ocac_selection');
        $ocac_placement[0].innerHTML = '<i class="fa fa-download" aria-hidden="true"></i>&nbsp;&nbsp;免試地區聯合分發收件清冊';
        $ocac_placement.attr('href', env.baseUrl + '/admins/verified/ocac_placement');
        $two_year.attr('href', env.baseUrl + '/admins/verified/two-year');
    }
})();