var accountEditModal;
$(document).ready(function () {
    accountEditModal = (function () {
        /**
         * cache DOM
         */
        const page = $('.modal-content');
        const username = $('[name=username]');
        const password = $('[name=password]');
        const passwordSecond = $('[name=password-second]');
        const name = $('[name=name]');
        const eng_name = $('[name=eng-name]');
        const jobTitle = $('[name=job-title]');
        const email = $('[name=email]');
        const phone = $('[name=phone]');

        const $modal = $('#modal-editAccount');
        const $storeBtn = $('#store-btn');

        const emailDiv = $('#email-div');
        const emailWarning = $('#email-warning');  // 「請依格式輸入」字樣
        const passwordCheckDiv = $('#password-check-div');
        const passwordCheck = $('#password-check');

        /**
         * bind event
         */
        $storeBtn.on('click', _store);
        password.on('input', _doubleCheck);
        passwordSecond.on('input', _doubleCheck);
        email.on('input', _checkEmail);

        // 密碼二次確認
        function _doubleCheck() {
            if (passwordSecond.val() !== password.val()) {
                passwordCheckDiv.addClass('has-danger');
                passwordSecond.addClass('form-control-danger');
                passwordCheck.show();
            } else {
                passwordCheckDiv.removeClass('has-danger');
                passwordSecond.removeClass('form-control-danger');
                passwordCheck.hide();
            }
        }

        function _checkEmail() {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            // 如果正確
            if (re.test(email.val())) {
                emailDiv.removeClass('has-danger');
                email.removeClass('form-control-danger');
                emailWarning.hide();
            } else {
                emailDiv.addClass('has-danger');
                email.addClass('form-control-danger');
                emailWarning.show();
            }
        }

        function open() {
            // 重新call 登入API 拿到最新身份
            var user = User.getUserInfo();
            username.attr('value', user.username);
            name.attr('value', user.name);
            eng_name.attr('value', user.eng_name);
            jobTitle.attr('value', user.job_title);
            email.attr('value', user.email);
            phone.attr('value', user.phone);
            // 確認身份再選擇跑哪一個modal
            // ↑↑↑我查出來這邊應該是設定互動視窗的屬性才對，不確定當時寫這行註解的人的意思
            $modal.modal({
                backdrop: 'static',  // 鎖定背景，點擊背景時不自動關閉視窗
                keyboard: false  // 是否用ESC鍵關閉
            });
        }

        function _checkForm() {
            var $inputs = page.find('.required');
            var valid = true;
            for (let input of $inputs) {
                if (!$(input).val()) {
                    $(input).focus();
                    valid = false;
                    break;
                }
            }
            // 檢查密碼複雜度
            if (!checkPasswordComplex(password.val())){
                valid = false;
            }
            // 檢查兩次輸入的密碼如果不同
            if (passwordSecond.val() !== password.val()) {
                valid = false;
            }
            return valid;
        }

        // 儲存使用者資料
        function _store() {
            // check dom value
            if (!_checkForm()) {
                alert('輸入有誤');
                return;
            }
            // check password is changed
            var storedPassword = null;
            if (password.val()) {
                storedPassword = sha256(password.val());
            }
            var userInfo = {
                username: username.val(),
                password: storedPassword,
                email: email.val(),
                name: name.val(),
                eng_name: eng_name.val(),
                job_title: jobTitle.val(),
                phone: phone.val(),
                has_banned:	false,
                has_admin: true,
            };

            openLoading();

            // call API
            User.update(userInfo).then(function() {
                $modal.modal('hide');

                stopLoading();
            }).catch(function(err) {
                err.json && err.json().then((data) => {
                    console.error(data);
                    alert(`ERROR: \n${data.messages[0]}`);
                    stopLoading();
                });
            });
        }

        // 確認密碼複雜度
        function checkPasswordComplex(input) {
            // 至少8碼且大寫、小寫、數字或特殊符號（數字那一排不含反斜線和豎線）至少三種
            // ^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#$%^&*()_+\-=]).{8,}$
            const reg = /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])|(?=.*\d)(?=.*[a-z])(?=.*[~!@#$%^&*()_+\-=])|(?=.*\d)(?=.*[A-Z])(?=.*[~!@#$%^&*()_+\-=])|(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#$%^&*()_+\-=])).{8,}$/;
            return !!reg.test(input);
        }

        return {
            open
        }

    })();
});
