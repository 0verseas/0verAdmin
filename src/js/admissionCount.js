(() => {

	// private variable

	const _keyNameMapping = [
	{ key: "hk", name: "香港開通帳號註冊人數" },
	{ key: "hk_confirmed", name: "香港提交人數" },
	{ key: "hk_master_fromtw", name: "在臺香港學生碩士班開通帳號註冊人數" },
	{ key: "hk_master_fromtw_confirmed", name: "在臺香港學生碩士班提交人數" },
	{ key: "hk_phd_fromtw", name: "在臺香港學生博士班開通帳號註冊人數" },
	{ key: "hk_phd_fromtw_confirmed", name: "在臺香港學生博士班提交人數" },
	{ key: "hk_master", name: "海外香港學生碩士班開通帳號註冊人數" },
	{ key: "hk_master_confirmed", name: "海外香港學生碩士班提交人數" },
	{ key: "hk_phd", name: "海外香港學生博士班開通帳號註冊人數" },
	{ key: "hk_phd_confirmed", name: "海外香港學生博士班提交人數" },
	{ key: "mo", name: "澳門開通帳號註冊人數" },
	{ key: "mo_confirmed", name: "澳門提交人數" },
	{ key: "my", name: "馬來西亞開通帳號註冊人數" },
	{ key: "my_confirmed", name:  "馬來西亞提交人數" },
	{ key: "id", name: "印尼開通帳號註冊人數" },
	{ key: "id_confirmed", name: "印尼提交人數" },
	{ key: "hkmo", name: "港澳學士班開通帳號註冊人數" },
	{ key: "hkmo_confirmed", name: "港澳學士班提交人數" },
	{ key: "overseas", name: "海外僑生開通帳號註冊人數" },
	{ key: "overseas_confirmed", name: "海外僑生提交人數" },
	{ key: "master_fromtw", name: "在臺僑生與港澳生碩士班開通帳號註冊人數" },
	{ key: "master_fromtw_confirmed", name:  "在臺僑生與港澳生碩士班提交人數" },
	{ key: "phd_fromtw", name: "在臺僑生與港澳生博士班開通帳號註冊人數" },
	{ key: "phd_fromtw_confirmed", name: "在臺僑生與港澳生博士班提交人數" },
	{ key: "master", name: "海外僑生與港澳生碩士班開通帳號註冊人數" },
	{ key: "master_confirmed", name: "海外僑生與港澳生碩士班提交人數" },
	{ key: "phd", name: "海外僑生與港澳生博士班開通帳號註冊人數" },
	{ key: "phd_confirmed", name: "海外僑生與港澳生博士班提交人數" }
	];
	let _typeChekced = [];
	let _sumTable = [];
	let _chartData = [];
	let _chartLineSeries = {};// {1: {type: 'line'}, 3: {type: 'line'}}
	/**
	*	cache DOM
	*/

	const $dataType = $('#data-type');
	const $countThead = $('#thead-count');
	const $countTbody = $('#tbody-count');
	
	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

	async function _init() {
		try {
			const response = await student.getAdmissionCountDetail();
			if (!response.ok) { throw response; }
			const detailJson = await response.json();

			// init render data-type
			let dataTypeHTML = '';
			_keyNameMapping.forEach(value => {
				dataTypeHTML += `
				<input type="checkbox" name="datatype" id="cb-${value.key}" data-key="${value.key}" />
				<label for="cb-${value.key}">${value.name}</label>
				`
			});
			$dataType.html(dataTypeHTML);
			$('#data-type :checkbox').change(_handleChecked);

			// 在一開始就先算好每個欄位在每個日期的總和。如此未來可以因應要設定日期區間的需求，並防止多次計算的問題。
			// 總和暫存
			let countSum = {};
			_keyNameMapping.forEach(value => {
				countSum[value.key] = 0;
			});
			// 新陣列為原資料的延伸，同個物件下加上欄位數值總和，結構如下：
			// [
			// 	{
			// 		Date: "yyyy-mm-dd", // 原有、必要欄位
			// 		hk: 2, // 原有欄位
			// 		sum_hk: 4, // (增)總和欄位，命名 "sum_" 開頭加上原鍵值
			// 		...
			// 	},
			// 	...
			// ]
			_sumTable = detailJson.map(jsonVal => {
				let returnObj = {};
				returnObj["Date"] = jsonVal.Date;
				_keyNameMapping.forEach(mappingVal => {
					countSum[mappingVal.key] += jsonVal[mappingVal.key];
					returnObj[mappingVal.key] = jsonVal[mappingVal.key];
					returnObj["sum_" + mappingVal.key] = countSum[mappingVal.key];
				});
				return returnObj;
			});

			_reRenderTbody();
			loading.complete();
		} catch(e) {
			e.json && e.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);
			});
			loading.complete();
		}
	}

	function _handleChecked() {
		const keyName = $(this).data('key');
		const keyIndex = _typeChekced.indexOf(keyName);
		if (keyIndex > -1) {
			_typeChekced.splice(keyIndex, 1);
		} else {
			_typeChekced.push(keyName);
		}
		_reRenderTbody();
	}

	function _reRenderTbody() {

		let theadHTML = '';
		let tbodyHTML = '';
		let chartTitle = [];
		let chartBody = [];
		let chartBeLine = 1;
		if (_typeChekced.length > 0) {

            _chartLineSeries = {};

			// thead
			theadHTML += `<tr>`;
			theadHTML += `<th>日期</th>`;
            chartTitle.push('Date');
			_typeChekced.forEach(checkedVal => {
				const mappingIndex = _keyNameMapping.findIndex(i => i.key === checkedVal);
				theadHTML += `
				<th>單日${_keyNameMapping[mappingIndex].name}</th>
				<th>累積${_keyNameMapping[mappingIndex].name}</th>
				`;
                chartTitle.push(`單日${_keyNameMapping[mappingIndex].name}`);
                chartTitle.push(`累積${_keyNameMapping[mappingIndex].name}`);

                _chartLineSeries[chartBeLine] = {type: 'line'};
                chartBeLine += 2;
			});
			theadHTML += `</tr>`;
            _chartData = [chartTitle];

			// tbody
			_sumTable.forEach(tableVal => {
				tbodyHTML += `<tr>`;
				tbodyHTML += `<th scope="row">${tableVal.Date}</th>`;
                chartBody.push(`${tableVal.Date}`);
				_typeChekced.forEach(checkedVal => {
					tbodyHTML += `
					<td>${tableVal[checkedVal]}</td>
					<td>${tableVal['sum_' + checkedVal]}</td>
					`;
                    chartBody.push(parseInt(tableVal[checkedVal]));
                    chartBody.push(parseInt(tableVal['sum_' + checkedVal]));
				});
				tbodyHTML += `</tr>`;
                _chartData.push(chartBody);
                chartBody = [];
			});

            google.charts.load('current', {'packages':['corechart']});
            google.charts.setOnLoadCallback(_drawChart);
        } else {
            document.getElementById('chart').innerHTML = '<div>尚未選擇欄位</div>';

            _chartLineSeries = {};
		}
		$countThead.html(theadHTML);
		$countTbody.html(tbodyHTML);
	}

	function _drawChart() {
		/*
		let chartArr = _typeChekced.map(value => {
			const mappingIndex = _keyNameMapping.findIndex(i => i.key === value);
			const mappingName = "累積" + _keyNameMapping[mappingIndex].name;
			const sum = _sumTable[_sumTable.length - 1]['sum_' + value];
			return [mappingName, sum]
		});
		chartArr.unshift(['title', 'sum']);
		*/

		var data = google.visualization.arrayToDataTable(_chartData);

		var options = {
			title: '報名人數走勢圖',
			vAxis: {title: '人數'},
			hAxis: {title: '日期'},
			seriesType: 'bars',
			series: _chartLineSeries
        };

		var chart = new google.visualization.ComboChart(document.getElementById('chart'));
		chart.draw(data, options);
	}

})();
