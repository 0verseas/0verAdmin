var Miscellaneous = (function () {

    var baseUrl = env.baseUrl;

    async function getCountryList() {
        if (localStorage.countryList && localStorage.countryList !== "") {
            return JSON.parse(localStorage.countryList);
        } else {
            try {
                const response = await fetch(baseUrl + `/country-lists`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });
                if (!response.ok) { throw response; }
                const json = await response.json();

                let group_to_values = await json.reduce(function (obj, item) {
                    obj[item.continent] = obj[item.continent] || [];
                    obj[item.continent].push({id: item.id, country: item.country});
                    return obj;
                }, {});

                let groups = await Object.keys(group_to_values).map(function (key) {
                    return {continent: key, country: group_to_values[key]};
                });

                localStorage.countryList = JSON.stringify(groups);
                return groups;
            } catch (e) {
                console.log('Boooom!!');
                console.log(e);
            }
        }
    }

    function getSchoolList(countryId) {
        return fetch(baseUrl + `/overseas-school-lists?country_id=` + countryId, {
            method: 'GET'
        });
    }


    return {
        getCountryList,
        getSchoolList,
    };

})();