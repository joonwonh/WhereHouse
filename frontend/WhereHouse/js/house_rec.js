window.onload = function () {
    var container = document.getElementById("map");
    var options = {
        center: new kakao.maps.LatLng(37.5642135, 127.0016985),
        level: 8
    };

    var map = new kakao.maps.Map(container, options),
        customOverlay = new kakao.maps.CustomOverlay({}),
        infowindow = new kakao.maps.InfoWindow({ removable: true });

    /**
     * json 파싱 및 전처리
     */
    var locate = JSON.parse(JSON.stringify(mapData));
    var feat = locate.features;
    var areas = [];
    feat.forEach(element => {
        var geo = element.geometry;
        var coor = geo.coordinates;
        var name = element.properties.SIG_KOR_NM;
        var path = [];
        coor[0].forEach(point => {
            path.push(new kakao.maps.LatLng(point[1], point[0]));
        })
        var area = { name, path };
        areas.push(area);
    });

    /**
     * 구 별 인구 밀집도 데이터 
     */

    var populationArea = initPopulation();

    /**
     * 화면에 다각형 생성
     */

    for (var i = 0, len = areas.length; i < len; i++) {
        displayArea(areas[i], populationArea[i]);
    }

    // 다각형을 생상하고 이벤트를 등록하는 함수입니다
    function displayArea(area, population) {

        // 다각형을 생성합니다 
        var polygon = new kakao.maps.Polygon({
            map: map, // 다각형을 표시할 지도 객체
            path: area.path,
            strokeWeight: 2,
            // strokeColor: 'rgba(11, 94, 215, 0.50)',
            strokeColor: population.color,
            strokeOpacity: 0.8,
            fillColor: population.color,
            fillOpacity: 0.7
        });

        kakao.maps.event.addListener(polygon, 'mouseover', function () {
            polygon.setOptions({ strokeWeight: 5, strokeColor: "rgba(255, 0, 0, 1)" });//, fillColor: "rgba(255, 255, 255, 0)" });
        });

        kakao.maps.event.addListener(polygon, 'mouseout', function () {
            polygon.setOptions({ strokeWeight: 2, strokeColor: population.color });
            polygon.setOptions({ fillColor: population.color });
        });

        // 다각형에 click 이벤트를 등록하고 이벤트가 발생하면 다각형의 이름과 면적을 인포윈도우에 표시합니다 
        kakao.maps.event.addListener(polygon, 'click', function (mouseEvent) {
            var content = '<div class="info">'
                + '<div class="info_title">' + population.name + '</div>'
                + '<div class="info_rank">'
                + '<div class="info_content" id="info_price_rank">'
                + '<div class="info_content" id="info_charter">전세 : <span id="info_charter_rank">1</span>위 / 25</div>'
                + '<div class="info_content" id="info_deposit">보증금 : <span id="info_deposit_rank">1</span>위 / 25</div>'
                + '<div class="info_content" id="info_monthly">월세 : <span id="info_monthly_rank">1</span>위 / 25</div></div>'
                + '<div class="info_content" id="info_score">'
                + '<div class="info_content" id="info_convenience">편의성 : <span id="info_conv_rank">1</span>위 / 25</div>'
                + '<div class="info_content" id="info_safety">안전성 : <span id="info_safety_rank">1</span>위 / 25</div>'
                + '<div class="info_content" id="info_dense">밀집도 : <span id="info_dense_rank">1</span>위 / 25</div></div></div>';

            infowindow.setContent(content);
            infowindow.setPosition(mouseEvent.latLng);
            infowindow.setMap(map);
        });
    }

    /** 
     * 패널 열고 닫기
     */
    var info = document.querySelector("#information");
    var func = document.querySelector("#btn");

    func.addEventListener("click", panelFunc);

    function panelFunc() {
        if (info.style.left == "0px") {
            info.style.left = "-333px";
            func.innerText = "▶";
        } else {
            info.style.left = "0px";
            func.innerText = "◀";
        }
    }

    // 전세/월세 라디오 버튼 선택

    var rentalType = document.querySelectorAll("input[name='rentalType']");
    rentalType.forEach((radio) => {
        radio.addEventListener("change", (e) => {
            var current = e.currentTarget;
            if (current.value === "charter") {
                showCharter();
                showFirstCharterFee();
                showSecondCharterFee();
                showThirdCharterFee();
            } else {
                showMonthly();
                showFirstMonthlyFee();
                showSecondMonthlyFee();
                showThirdMonthlyFee();
            }
        })
    }
    );

    var safety = document.getElementById("myRange_safety");
    var y = document.getElementById("safety_f");
    safety.addEventListener("change", function () {
        y.innerHTML = this.value + "단계";
    });

    var convenience = document.getElementById("myRange_convenience");
    var c = document.getElementById("convenience_f");
    convenience.addEventListener("change", function () {
        c.innerHTML = this.value + "단계";
    });

}

// 전세 선택 시 보여줄 화면
function showCharter() {
    document.getElementById("charterInput").style.display = "block";
    document.getElementById("monthlyInput").style.display = "none";
}

// 월세 선택 시 보여줄 화면
function showMonthly() {
    document.getElementById("charterInput").style.display = "none";
    document.getElementById("monthlyInput").style.display = "block";
}

// 추천 결과 페이지 전환
function showRecommend() {
    document.getElementById("user-input").style.display = "block";
    document.getElementById("recommend_result_page").style.display = "none";
}

function showResult() {
    document.getElementById("user-input").style.display = "none";
    document.getElementById("recommend_result_page").style.display = "block";
}



// 첫번째 추천결과창
function showDetailFirst() {
    document.getElementById("recommend_first").style.display = "none";
    document.getElementById("recommend_first_info").style.display = "block";
}

function hideDetailFirst() {
    document.getElementById("recommend_first").style.display = "block";
    document.getElementById("recommend_first_info").style.display = "none";
}
function showFirstCharterFee()  {
    document.getElementById("select_first_charter").style.display = "block";
    document.getElementById("select_first_monthly").style.display = "none";
}
function showFirstMonthlyFee()  {
    document.getElementById("select_first_charter").style.display = "none";
    document.getElementById("select_first_monthly").style.display = "block";
}

// 두번째 추천결과창
function showDetailSecond() {
    document.getElementById("recommend_second").style.display = "none";
    document.getElementById("recommend_second_info").style.display = "block";
}

function hideDetailSecond() {
    document.getElementById("recommend_second").style.display = "block";
    document.getElementById("recommend_second_info").style.display = "none";
}
function showSecondCharterFee()  {
    document.getElementById("select_second_charter").style.display = "block";
    document.getElementById("select_second_monthly").style.display = "none";
}
function showSecondMonthlyFee()  {
    document.getElementById("select_second_charter").style.display = "none";
    document.getElementById("select_second_monthly").style.display = "block";
}

// 세번째 추천결과창
function showDetailThird() {
    document.getElementById("recommend_third").style.display = "none";
    document.getElementById("recommend_third_info").style.display = "block";
}

function hideDetailThird() {
    document.getElementById("recommend_third").style.display = "block";
    document.getElementById("recommend_third_info").style.display = "none";
}
function showThirdCharterFee()  {
    document.getElementById("select_third_charter").style.display = "block";
    document.getElementById("select_third_monthly").style.display = "none";
}
function showThirdMonthlyFee()  {
    document.getElementById("select_third_charter").style.display = "none";
    document.getElementById("select_third_monthly").style.display = "block";
}





// 상세비교창 띄우기
function showComparison() {

}


/**
 * 인구밀집도 시각화를 위한 임의 데이터 생성 함수
 * @returns [{name, population, idx}]
 */
function initPopulation() {
    var populationArea = [];
    populationArea.push({ name: "강동구", population: Math.floor(Math.random() * 40000) + 10000, color: "rgba(0,0,0,0)" });
    populationArea.push({ name: "송파구", population: Math.floor(Math.random() * 40000) + 10000, color: "rgba(0,0,0,0)" });
    populationArea.push({ name: "강남구", population: Math.floor(Math.random() * 40000) + 10000, color: "rgba(0,0,0,0)" });
    populationArea.push({ name: "서초구", population: Math.floor(Math.random() * 40000) + 10000, color: "rgba(0,0,0,0)" });
    populationArea.push({ name: "관악구", population: Math.floor(Math.random() * 40000) + 10000, color: "rgba(0,0,0,0)" });
    populationArea.push({ name: "동작구", population: Math.floor(Math.random() * 40000) + 10000, color: "rgba(0,0,0,0)" });
    populationArea.push({ name: "영등포구", population: Math.floor(Math.random() * 40000) + 10000, color: "rgba(0,0,0,0)" });
    populationArea.push({ name: "금천구", population: Math.floor(Math.random() * 40000) + 10000, color: "rgba(0,0,0,0)" });
    populationArea.push({ name: "구로구", population: Math.floor(Math.random() * 40000) + 10000, color: "rgba(0,0,0,0)" });
    populationArea.push({ name: "강서구", population: Math.floor(Math.random() * 40000) + 10000, color: "rgba(0,0,0,0)" });
    populationArea.push({ name: "양천구", population: Math.floor(Math.random() * 40000) + 10000, color: "rgba(0,0,0,0)" });
    populationArea.push({ name: "마포구", population: Math.floor(Math.random() * 40000) + 10000, color: "rgba(0,0,0,0)" });
    populationArea.push({ name: "서대문구", population: Math.floor(Math.random() * 40000) + 10000, color: "rgba(0,0,0,0)" });
    populationArea.push({ name: "은평구", population: Math.floor(Math.random() * 40000) + 10000, color: "rgba(0,0,0,0)" });
    populationArea.push({ name: "노원구", population: Math.floor(Math.random() * 40000) + 10000, color: "rgba(0,0,0,0)" });
    populationArea.push({ name: "도봉구", population: Math.floor(Math.random() * 40000) + 10000, color: "rgba(0,0,0,0)" });
    populationArea.push({ name: "강북구", population: Math.floor(Math.random() * 40000) + 10000, color: "rgba(0,0,0,0)" });
    populationArea.push({ name: "성북구", population: Math.floor(Math.random() * 40000) + 10000, color: "rgba(0,0,0,0)" });
    populationArea.push({ name: "중랑구", population: Math.floor(Math.random() * 40000) + 10000, color: "rgba(0,0,0,0)" });
    populationArea.push({ name: "동대문구", population: Math.floor(Math.random() * 40000) + 10000, color: "rgba(0,0,0,0)" });
    populationArea.push({ name: "광진구", population: Math.floor(Math.random() * 40000) + 10000, color: "rgba(0,0,0,0)" });
    populationArea.push({ name: "성동구", population: Math.floor(Math.random() * 40000) + 10000, color: "rgba(0,0,0,0)" });
    populationArea.push({ name: "용산구", population: Math.floor(Math.random() * 40000) + 10000, color: "rgba(0,0,0,0)" });
    populationArea.push({ name: "중구", population: Math.floor(Math.random() * 40000) + 10000, color: "rgba(0,0,0,0)" });
    populationArea.push({ name: "종로구", population: Math.floor(Math.random() * 40000) + 10000, color: "rgba(0,0,0,0)" });

    var max = populationArea[0].population;
    var min = populationArea[0].population;

    populationArea.forEach(e => {
        var temp = e.population;
        max = temp > max ? temp : max;
        min = temp > min ? min : temp;
    })
    var interval = (max - min) / 7;

    populationArea.forEach(element => {
        if (element.population <= min + (interval * 0)) {
            element.color = "rgba(255, 0, 0, 0.2)";
        } else if (element.population <= min + (interval * 1)) {
            element.color = "rgba(255, 0, 0, 0.275)";
        } else if (element.population <= min + (interval * 2)) {
            element.color = "rgba(255, 0, 0, 0.35)";
        } else if (element.population <= min + (interval * 3)) {
            element.color = "rgba(255, 0, 0, 0.425)";
        } else if (element.population <= min + (interval * 4)) {
            element.color = "rgba(255, 0, 0, 0.5)";
        } else if (element.population <= min + (interval * 5)) {
            element.color = "rgba(255, 0, 0, 0.575)";
        } else {
            element.color = "rgba(255, 0, 0, 0.65)";
        }
    })
    return populationArea;
}