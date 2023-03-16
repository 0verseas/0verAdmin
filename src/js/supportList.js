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

        res = await User.getAdmissionOpenTime();
        if(res.ok){
            let admissionOpenTimeData = await res.json();
            console.log(admissionOpenTimeData);
            let html = '';
            admissionOpenTimeData.forEach((element, index) => {
                let start = new Date(element.admission_start_at);
                let end = new Date(element.admission_end_at);
                let now =  new Date();
                let description = element.description;
                let colorClass;
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