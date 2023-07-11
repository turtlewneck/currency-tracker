
    function buildSite() {
        
        buildHeader();
        buildSectionDivs();
        buildFooter();
    }

    function buildHeader() {
        const naviArr = [
            ['about', 'about-div'],
            ['currencies', 'currency-div'],
            ['gold prices', 'gold-div'],
            ['gold graphs', 'gold-plot-div']];

        const logo = document.createElement('img');
        logo.setAttribute('id', 'logo')
        logo.setAttribute('src', 'https://pngimg.com/uploads/dollar_sign/dollar_sign_PNG17.png');

        const title = document.createElement('h2');
        title.setAttribute('id', 'title');
        title.innerHTML = 'CURRENCY TRACKER.';

        const navigationBar = document.createElement('ul');
        navigationBar.setAttribute('id', 'navigation-bar');
        
        for(let i = 0; i < naviArr.length; ++i) {
            const elem = document.createElement('li');
            const link = document.createElement('a');
            link.setAttribute('id', naviArr[i]);
            link.setAttribute('href', `#${naviArr[i][1]}`);
            link.textContent = naviArr[i][0].toUpperCase();
            elem.appendChild(link);
            navigationBar.appendChild(elem);
        }

        const header = document.getElementById('header');
        header.appendChild(logo);
        header.appendChild(title);
        header.appendChild(navigationBar);
    }


    function buildSectionDivs() {

        //about div
        const aboutDiv = document.createElement('div');
        aboutDiv.setAttribute('id', 'about-div');

        const aboutDivTitle = document.createElement('h4');
        aboutDivTitle.setAttribute('id', 'about-div-title');
        aboutDivTitle.innerHTML = 'ABOUT';
        aboutDiv.appendChild(aboutDivTitle);

        const aboutPara = document.createElement('p');
        aboutPara.innerHTML = 'This is a simple project created to showcase the usage of API\'s. My goal was to get a hold of basic js, not focusing on styling and design, therefore the page is not responsive.<br><br>I\'ve used NBP (National Polish Bank) data (which is why the default currency is PLN) about currencies and gold prices and displayed them with help of html, css and simple js.<br><br>The graphs have been created with use of Plotly.js.<br><br>If You have any questions feel free to contact me on github.<br><br>Enjoy!';

        aboutDiv.appendChild(aboutPara);
        document.getElementById('section').appendChild(aboutDiv);


        //currency div
        const currencyDiv = document.createElement('div');
        currencyDiv.setAttribute('id', 'currency-div');

        const currencyDivTitle = document.createElement('h4');
        currencyDivTitle.setAttribute('id', 'currency-div-title');
        currencyDivTitle.innerHTML = 'See today\'s exchange rate!';
        currencyDiv.appendChild(currencyDivTitle);
        
        document.getElementById('section').appendChild(currencyDiv);
        getAllCurrencies();
        

        //gold div
        const goldDiv = document.createElement('div');
        goldDiv.setAttribute('id', 'gold-div');
        
        const goldDivTitle = document.createElement('h4');
        goldDivTitle.setAttribute('id', 'gold-div-title');
        goldDivTitle.innerHTML = 'Choose a date and see how much money gold was worth that day';
        goldDiv.appendChild(goldDivTitle);

        document.getElementById('section').appendChild(goldDiv);
        createDatePicker();


        //gold plot div
        const goldPlotDiv = document.createElement('div')
        goldPlotDiv.setAttribute('id', 'gold-plot-div');

        const goldPlotDivTitle = document.createElement('h4');
        goldPlotDivTitle.setAttribute('id', 'gold-plot-div-title');
        goldPlotDivTitle.innerHTML = 'Graphs displaying gold\'s worth across given period';
        goldPlotDiv.appendChild(goldPlotDivTitle);

        document.getElementById('section').appendChild(goldPlotDiv);
        addPlotDiv();
    }


    function buildFooter() {
        const text = '&copy; Michał Wnęk 2023';
        document.getElementById('footer').innerHTML = text;
    }    


    async function getAllCurrencies() {

        const newUrl = 'http://api.nbp.pl/api/exchangerates/tables/C/today/';
        let response;
        let result = '';
        try {
            response = await fetch(newUrl);
            const data = await response.json();
           
            if(response.status == 200) {

                //retreive data 
                const currencies = data.map((({rates}) => rates));
                const currenciesCodes = currencies[0].map(({code}) => code);
                const currenciesNames = currencies[0].map(({currency}) => currency);
                const currenciesValueBid = currencies[0].map(({bid}) => bid);
                const currenciesValueAsk = currencies[0].map(({ask}) => ask);
                const currenciesValueMid = [];
                for(let i = 0; i < currenciesValueAsk.length; ++i){
                    currenciesValueMid.push((currenciesValueAsk[i] + currenciesValueBid[i])/2);
                }
    
                const currencyDiv = document.getElementById('currency-div');

                //adding input field for amount of money
                const inputAmount = document.createElement('input');
                inputAmount.setAttribute('id', 'input-amount');
                inputAmount.setAttribute('type', 'number');
                inputAmount.setAttribute('step','0.01');
                inputAmount.setAttribute('min','0');
                inputAmount.setAttribute('placeholder', 'Insert amount...')

                //adding input label
                const inputLabel = document.createElement('label');
                inputLabel.setAttribute('id', 'input-label');
                inputLabel.textContent = " PLN to ";

                //appending so that label is from the right side
                currencyDiv.appendChild(inputAmount);
                currencyDiv.appendChild(inputLabel);


                //adding select menu
                const select = document.createElement('select');
                select.setAttribute('class', 'select-currency');
                select.setAttribute('id', 'select-currency');

                for(let i = 0; i < currenciesCodes.length; ++i){
                    const opt = document.createElement('option');
                    opt.innerHTML = currenciesCodes[i];
                    opt.setAttribute('id', currenciesCodes[i]);
                    opt.setAttribute('data-name', currenciesNames[i]);
                    opt.setAttribute('value', currenciesCodes[i]);
                    opt.setAttribute('data-mid', currenciesValueMid[i]);
                    select.appendChild(opt);
                }
    
                currencyDiv.appendChild(select);

                //adding a field to display the results
                const para = document.createElement('p');
                para.setAttribute('class', 'display-amount');
                //para.setAttribute("style","display: inline-block;margin:0px")

                currencyDiv.appendChild(para);
            }
        } catch(error){
            result = response.statusText.toUpperCase();
        }
    }


    function addPlotDiv() {
        const namesArr = [
            ['week', 'Last week'],
            ['month', 'Last month'],
            ['threeMonths', 'Last three months'],
            ['halfYear', 'Last half of year'],
            ['year', 'Last year']
    ];

        const plotDiv = document.createElement('div');
        plotDiv.setAttribute('id', 'plot-div');

        const plotBtnDiv = document.createElement('div');
        plotBtnDiv.setAttribute('id', 'plot-btn-div');


        for(let i = 0; i < 5; ++i) {
            const btn = document.createElement('button');
            btn.setAttribute('id', namesArr[i][0]);
            btn.textContent = namesArr[i][1];
            btn.setAttribute('onclick', 'createPlot(' + i + ')');
            plotBtnDiv.appendChild(btn);
        }

        const goldPlotDiv = document.getElementById('gold-plot-div');
        goldPlotDiv.appendChild(plotBtnDiv);
        goldPlotDiv.appendChild(plotDiv);
        
        createPlot();
    }

    async function createPlot(variant) {
        const goldUrl = 'http://api.nbp.pl/api/cenyzlota/';
        const now = new Date();
        let period, newUrl;
        switch(variant){
            case 0: //for last 7 days
                period = 7;
                break;
            case 1: //for last month
                period = 30;
                break;
            case 2: //last 3 months
                period = 90;
                break;
            case 3: //last half year
                period = 180;
                break;
            case 4: //last year
                period = 365;
                break;
            default:    //last 100 days
                period = 0;
                break;
        }

        if(period == 0) {
            newUrl = 'http://api.nbp.pl/api/cenyzlota/last/100';
        }
        else {
            const begin = new Date(now.getTime() - period * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            const end = new Date().toISOString().split('T')[0];
            newUrl = goldUrl + begin + "/" + end + "/";
        }
        

        let x, y, response;
        try {
            response = await fetch(newUrl);
            const data = await response.json();
            if(response.status == 200) {
                x = data.map(({data}) => data);
                y = data.map(({cena}) => cena);

                const plotData = [{x:x, y:y, mode:'lines'}];
                const layout = {title: 'Price for 1g of gold [PLN]'};
                const config = {responsive: true};
                Plotly.newPlot('plot-div', plotData, layout, config);
                 
            }
        } catch(error) {
            const paraError = document.createElement('p');
            paraError.innerHTML = response.statusText.toUpperCase();
            document.getElementById('plot-div').appendChild(paraError);
        }

    }

    function createDatePicker() {
        const dateLabel = document.createElement('label');
        dateLabel.getAttribute('for', 'date');

        const dateInput = document.createElement('input');
        dateInput.setAttribute('id', 'date-input');
        dateInput.setAttribute('type', 'date');

        dateInput.valueAsDate = new Date();

        const dateBtn = document.createElement('button');
        dateBtn.setAttribute('type', 'button');
        dateBtn.setAttribute('onclick', 'getSingleDayGoldData()');
        dateBtn.textContent = 'Show gold price';

        const goldPara = document.createElement('p');
        goldPara.setAttribute('id', 'gold-para');

        const goldDiv = document.getElementById('gold-div');
        goldDiv.appendChild(dateLabel);
        goldDiv.appendChild(dateInput);
        goldDiv.appendChild(dateBtn);
        goldDiv.appendChild(goldPara);
    }


    function setTodaysDate() {
        document.getElementById('date').valueAsDate = new Date();
    }

    async function getSingleDayGoldData() {

        const shortGoldUrl = 'http://api.nbp.pl/api/cenyzlota/'
        const dateValue = document.getElementById('date-input').value;
        const newUrl = shortGoldUrl + dateValue + '/';
        let response;
        let result = '';
        try {
            response = await fetch(newUrl);
            const data = await response.json();
            if(response.ok) {
                result = 'Price for 1g of gold for ' + dateValue + ' : ' + data[0].cena + ' PLN';
            }
        } catch(error){
            result = response.statusText;
        }
        
        document.getElementById('gold-para').textContent = result;
    }

    function loadPage(){
        buildSite();
    }

    document.addEventListener('change', function(e) {
        const target = e.target.closest("#input-amount")

        if(target){
            const selectElement = document.querySelector('.select-currency');
            const multiplier = document.getElementById(selectElement.value).dataset.mid;
            const name = document.getElementById(selectElement.value).dataset.name;
            const result = document.querySelector('.display-amount') 
            
            result.textContent = ' is ' + (target.value * (1/multiplier)).toFixed(2) + ' ' + selectElement.value;
        }
    });

    document.addEventListener('change', function(e) {
        const target = e.target.closest('#select-currency')

        if(target){
            const selectElement = document.getElementById('input-amount').value;
            const multiplier = document.getElementById(target.value).dataset.mid;
            const name = document.getElementById(target.value).dataset.name;
            const result = document.querySelector('.display-amount') 
            
            result.textContent = ' is ' + (selectElement * (1/multiplier)).toFixed(2) + ' ' + target.value;
        }
    });
    