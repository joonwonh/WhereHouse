var guInfo = [];

//핫플레이스 캐러셀 데이터 초기화
function guInfoInit() {
    guInfo.push({ name: "강동구", place_name: ["천호동 로데오거리", "성내동 카페거리", "성내동 강풀만화거리"] });
    guInfo.push({ name: "송파구", place_name: ["롯데월드 타워", "송리단길", "석촌호수"] });
    guInfo.push({ name: "강남구", place_name: ["압구정동 로데오거리", "강남역 먹자골목", "코엑스 별마당 도서관"] });
    guInfo.push({ name: "서초구", place_name: ["세빛섬", "예술의 전당", "양재천 카페거리"] });
    guInfo.push({ name: "관악구", place_name: ["관악 별빛신사리", "낙성대 공원", "샤로수길"] });
    guInfo.push({ name: "동작구", place_name: ["노량진 수산시장", "보라매공원", "신대방삼거리역 거리"] });
    guInfo.push({ name: "영등포구", place_name: ["타임스퀘어", "여의도 한강공원", "더 현대 서울"] });
    guInfo.push({ name: "금천구", place_name: ["호암산 숲길 공원", "가산 인크 커피", "금빛 공원"] });
    guInfo.push({ name: "구로구", place_name: ["항동 푸른수목원", "구로 깔깔거리", "고척스카이돔"] });
    guInfo.push({ name: "강서구", place_name: ["서울 식물원", "강서구청 먹자골목", "국립 항공 박물관"] });
    guInfo.push({ name: "양천구", place_name: ["서서울 호수공원", "목동 로데오거리", "신정네거리역 거리"] });
    guInfo.push({ name: "마포구", place_name: ["망원 한강공원", "합정 메세나폴리스", "홍대거리"] });
    guInfo.push({ name: "서대문구", place_name: ["연희동거리", "신촌동거리", "디지털 미디어 시티"] });
    guInfo.push({ name: "은평구", place_name: ["연신내 로데오거리", "불광천", "은평 한옥마을"] });
    guInfo.push({ name: "노원구", place_name: ["노원역 문화의 거리 ", "노원 불빛 정원", "공릉동 국수거리"] });
    guInfo.push({ name: "도봉구", place_name: ["쌍문역 쌍리단길", "창동역 포차거리", "서울 창포원"] });
    guInfo.push({ name: "강북구", place_name: ["수유리 먹자골목", "강북구청 앞 거리", "우이천"] });
    guInfo.push({ name: "성북구", place_name: ["성신여대 로데오거리", "석계역 포장마차", "성북천"] });
    guInfo.push({ name: "중랑구", place_name: ["면목동 면리단길", "중랑천 벚꽃길", "상봉동 먹자골목"] });
    guInfo.push({ name: "동대문구", place_name: ["청량리 먹자골목", "회기역 파전골목", "청량리 통닭골목"] });
    guInfo.push({ name: "광진구", place_name: ["뚝섬 한강공원", "건대 맛의거리", "어린이대공원"] });
    guInfo.push({ name: "성동구", place_name: ["서울숲", "뚝섬 한강공원", "마장동 먹자골목"] });
    guInfo.push({ name: "용산구", place_name: ["한남동 카페거리", "이태원 거리", "남산서울타워"] });
    guInfo.push({ name: "중구", place_name: ["명동거리", "신당 포차거리", "을지로 골목"] });
    guInfo.push({ name: "종로구", place_name: ["경복궁", "인사동", "혜화 대학로"] });
}

//카카오맵 커스텀 오버레이
var customOverlay;

window.onload = function () {
    guInfoInit();
    var container = document.getElementById("map");
    var options = {
        center: new kakao.maps.LatLng(37.5642135, 127.0016985),
        level: 8
    };

    var map = new kakao.maps.Map(container, options);


    // 구 선택에 따른 이벤트
    var selectGu = document.getElementById("gu_select");
    selectGu.addEventListener("change", () => {
        var selected_name = $("#gu_select option:selected").val();
        initInfo(selected_name);
    });

    // json 파싱 및 전처리
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
        });
        var area = { name, path };
        areas.push(area);
    });

    // 구 별 인구 밀집도 데이터 초기화
    var populationArea = initPopulation();

    // 화면에 다각형 생성
    for (var i = 0, len = areas.length; i < len; i++) {
        displayArea(areas[i], populationArea[i]);
    }

    function displayArea(area, population) {
        var polygon = new kakao.maps.Polygon({
            map: map,
            path: area.path,
            strokeWeight: 2,
            strokeColor: population.color,
            strokeOpacity: 0.8,
            fillColor: population.color,
            fillOpacity: 0.7
        });

        kakao.maps.event.addListener(polygon, 'mouseover', function () {
            polygon.setOptions({ strokeWeight: 5, strokeColor: "rgba(255, 0, 0, 1)" });
        });

        kakao.maps.event.addListener(polygon, 'mouseout', function () {
            polygon.setOptions({ strokeWeight: 2, strokeColor: population.color });
            polygon.setOptions({ fillColor: population.color });
        });

        // 다각형에 click 이벤트를 등록, 이벤트 시 커스텀 오버레이 표시 
        kakao.maps.event.addListener(polygon, 'click', function (mouseEvent) {
            var content = '<div class="info">'
                + '<div id="info_close_wrap">'
                + '<img src="../images/closeBtn.svg" alt="" srcset="" id="info_close_btn" onclick="infoClose()"></div>'
                + '<div class="info_title">' + population.name + '</div><hr>'
                + '<div class="info_rank">'
                + '<div id="info_price_rank">'
                + '<div class="info_content" id="info_charter">평균 전세금 : <span id="info_charter_rank">1</span>위 / 25</div>'
                + '<div class="info_content" id="info_deposit">평균 보증금 : <span id="info_deposit_rank">1</span>위 / 25</div>'
                + '<div class="info_content" id="info_monthly">평균 월세금 : <span id="info_monthly_rank">1</span>위 / 25</div></div>'
                + '<div id="info_score">'
                + '<div class="info_content" id="info_convenience">생활 편의 : <span id="info_conv_rank">1</span>위 / 25</div>'
                + '<div class="info_content" id="info_safety">생활 안전 : <span id="info_safety_rank">1</span>위 / 25</div>'
                + '<div class="info_content" id="info_dense">인구 밀집도 : <span id="info_dense_rank">1</span>위 / 25</div></div></div>';

            // 기존 커스텀 오버레이 지우기
            if (customOverlay != null) {
                infoClose();
            }

            for (var i = 0; i < selectGu.options.length; i++) {
                if (selectGu.options[i].value === population.name) {
                    selectGu.options[i].selected = true;
                    initInfo(selectGu.options[i].value);
                    break;
                }
            }

            var latLng = { lat: mouseEvent.latLng.La, lng: mouseEvent.latLng.Ma };
            localStorage.setItem("latLng", JSON.stringify(latLng));

            customOverlay = new kakao.maps.CustomOverlay({
                content: content,
                map: map,
                position: mouseEvent.latLng
            });

            customOverlay.setMap(map);
        });
    }

    // 패널 열고 닫기
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
            if (current.getAttribute("id") === "btn_charter") {
                document.getElementById("select_need").style.height = "17%";
                document.getElementById("average-charter").style.display = "block";
                document.getElementById("average-monthly").style.display = "none";
                document.getElementById("hotPlace_wrap").style.top = "51%";
            } else {
                document.getElementById("select_need").style.height = "21%";
                document.getElementById("average-charter").style.display = "none";
                document.getElementById("average-monthly").style.display = "block";
                document.getElementById("hotPlace_wrap").style.top = "55%";
            }
        })
    });

    // 인구밀집도 인덱스 열고 닫기
    var shame_info = document.querySelector("#population-shame-info");
    var bar = document.querySelector("#population-shame-bar");
    var detail = document.querySelector("#population-shame-btn");
    detail.addEventListener("click", hideDetail);

    function hideDetail() {
        if (detail.innerText === "-") {
            detail.innerText = "+";
            shame_info.style.display = "none";
            bar.style.backgroundColor = "rgba(217,217,217,0.3)";
            bar.style.border = "#D9D9D9 1px solid";
        } else {
            detail.innerText = "-";
            bar.style.backgroundColor = "rgba(217, 217, 217, 0.80)";
            bar.style.border = "rgba(0, 0, 0, 0.2) 2px solid";
            shame_info.style.display = "block";
        }
    }
}

/**
 * 커스텀 오버레이 정보창 닫기
 */
function infoClose() {
    customOverlay.setMap(null);
}

/**
 * 지역구 선택 및 변경 시 정보를 다시 뿌려주는 함수
 */
function initInfo(selected_name) {
    if (customOverlay != null) {
        infoClose();
    }
    var div_score = document.getElementById("average-score");
    var div_hPlace = document.getElementById("hotPlace_wrap");
    var select_need = document.getElementById("select_need");

    var charter_fee = document.getElementById("charter-deposit-fee");
    var deposit_fee = document.getElementById("monthly-deposit-fee");
    var monthly_fee = document.getElementById("monthly-month-fee");

    // 전세/월세 가격 표시
    charter_fee.innerText = Math.round(Math.random() * 1000 + 10000);
    deposit_fee.innerText = Math.round(Math.random() * 1000 + 500);
    monthly_fee.innerText = Math.round(Math.random() * 50 + 30);
    if (selected_name === "default") {
        div_score.style.display = "none";
        div_hPlace.style.display = "none";
        select_need.style.display = "none";
    } else {
        div_score.style.display = "block";
        div_hPlace.style.display = "block";
        select_need.style.display = "block";

        //그래프 그리기
        var safety_barChart = document.getElementById("safety_barChart");
        var conv_barChart = document.getElementById("convenience_barChart");

        var tmp1 = (Math.random() * 100 + 0);
        var tmp2 = (Math.random() * 100 + 0);
        document.getElementById("safety_value").innerText = Math.round(tmp1);
        document.getElementById("convenience_value").innerText = Math.round(tmp2);
        safety_barChart.style.height = (tmp1 + 15) + "px";
        conv_barChart.style.height = (tmp2 + 15) + "px";
    }

    var imgPath = "../images/hotPlace/" + selected_name;

    for (var i = 0; i < guInfo.length; i++) {
        if (guInfo[i].name === selected_name) {
            for (var j = 1; j <= 3; j++) {
                document.getElementById("carousel-img" + j).src = imgPath + "/img" + j + ".jpg";
                document.getElementById("carousel-caption" + j).innerText = guInfo[i].place_name[j - 1];
            }
            break;
        }
    }
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