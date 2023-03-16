var estimateAdmissionCountFile = (function () {
    /**
     * cache DOM
     */

    const $all_student_list = $('#all-student-list');
    const $has_restrict_department = $('#has-restrict-department');
    const $bachelor_has_english_taught_department = $('#bachelor-has-english-taught-department');
    const $twoYear_has_english_taught_department = $('#twoYear-has-english-taught-department');
    const $master_has_english_taught_department = $('#master-has-english-taught-department');
    const $phd_has_english_taught_department = $('#phd-has-english-taught-department');
    const $admission_open_time_table = $('#open-time-table');
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

        // 跟後台發送請求抓取開放時間資料
        res = await User.getAdmissionOpenTime();
        // 有成功抓到就渲染
        if(res.ok){
            let admissionOpenTimeData = await res.json();
            let html = '';
            // 把每一條開放時間 轉換成 html table body 格式
            admissionOpenTimeData.forEach((element, index) => {
                let start = new Date(element.admission_start_at); // 開始時間
                let end = new Date(element.admission_end_at); // 結束時間
                let now =  new Date(); // 目前時間
                let description = element.description;
                let colorClass;
                // 根據目前時間顯示不同文字與顏色
                if(now>end){
                    description += `<a class="text-danger">（已截止）</a>`;
                    colorClass = `table-secondary`;
                } else if(now<start){
                    description += `<a class="text-info">（未開放）</a>`;
                    colorClass = `table-light`;
                } else {
                    description += `<a class="text-primary">（開放中）</a>`;
                    colorClass = `table-success`;
                }
                let start_at = _formatDate(start);
                let end_at = _formatDate(end);
                html +=`<tr class="${colorClass}">
                    <th>${index+1}</th>
                    <td>${description}</td>
                    <td>${start_at}</td>
                    <td>${end_at}</td>
                </tr>`;
            });
            $admission_open_time_table.html(html);
        }
    }

    function _setData() {

        $all_student_list.attr('href', env.baseUrl + '/admins/students/create');
        $has_restrict_department.attr('href', env.baseUrl + '/admins/has-birth-and-gender-limit-department-list');
        $bachelor_has_english_taught_department.attr('href', env.baseUrl + '/admins/all-english-department-list/bachelor');
        $twoYear_has_english_taught_department.attr('href', env.baseUrl + '/admins/all-english-department-list/twoYear');
        $master_has_english_taught_department.attr('href', env.baseUrl + '/admins/all-english-department-list/master');
        $phd_has_english_taught_department.attr('href', env.baseUrl + '/admins/all-english-department-list/phd');

    }

    function _formatDate(date){
        let year = date.getFullYear()+'';
        let month = (date.getMonth()+1)+'';
        let day = date.getDate()+'';
        let hour = date.getHours()+'';
        let minute = date.getMinutes()+'';
        let second = date.getSeconds()+'';
        month = month.padStart(2, 0);
        day = day.padStart(2, 0);
        hour = hour.padStart(2, 0);
        minute = minute.padStart(2, 0);
        second = second.padStart(2, 0);

        return year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second;
    }
})();