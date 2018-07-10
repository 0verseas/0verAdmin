var Office = (function () {

    var baseUrl = env.baseUrl;

    function getOfficeList() {
        return fetch(baseUrl + `/admins/offices`, {
            credentials: 'include'
        });
    }
    return {
        getOfficeList,
    };

})();
