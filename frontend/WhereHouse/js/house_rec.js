var guSpec = [];
var guName = ["강동구", "송파구", "강남구", "서초구", "관악구",
    "동작구", "영등포구", "금천구", "구로구", "강서구",
    "양천구", "마포구", "서대문구", "은평구", "노원구",
    "도봉구", "강북구", "성북구", "중랑구", "동대문구",
    "광진구", "성동구", "용산구", "중구", "종로구"];

var map;
var populationArea;
var areas = [];
var polygons = [];
var recommendIdx = [];
var opacity = 0.7;
var isIncrease = true;
var polygon_interval;

function initGuSpec() {
    guName.forEach(e => {
        guSpec.push({
            name: e,
            charter: Math.floor(Math.random() * 10000) + 10000,
            deposit: Math.floor(Math.random() * 1000) + 500,
            monthly: Math.floor(Math.random() * 50) + 50,
            safety: Math.floor(Math.random() * 10) + 1,
            convenience: Math.floor(Math.random() * 10) + 1,
            convenienceStore: Math.floor(Math.random() * 50) + 100,
            cafe: Math.floor(Math.random() * 50) + 100,
            restaurant: Math.floor(Math.random() * 50) + 100,
            olive: Math.floor(Math.random() * 50) + 100,
            daiso: Math.floor(Math.random() * 50) + 100,
            polliceOffice: Math.floor(Math.random() * 50) + 100,
            cctv: Math.floor(Math.random() * 50) + 100,
            arrest: Math.floor(Math.random() * 50) + 50
        });
    })
}

//카카오맵 커스텀 오버레이
var customOverlay;

window.onload = function () {
    initGuSpec();
    var container = document.getElementById("map");
    var options = {
        center: new kakao.maps.LatLng(37.5642135, 127.0016985),
        level: 8
    };

    map = new kakao.maps.Map(container, options);

    //json 파싱 및 전처리
    var locate = JSON.parse(JSON.stringify(mapData));
    var feat = locate.features;
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

    // 구 별 인구 밀집도 데이터 초기화
    populationArea = initPopulation();

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
    });

    // 슬라이드 바 변경 이벤트
    var safety = document.getElementById("myRange_safety");
    var y = document.getElementById("safety_f");
    safety.addEventListener("change", function () {
        y.innerHTML = this.value + "단계";
        document.getElementById("descript_safety").innerText = "안전 " + this.value + "단계는 이러이러이러합니다."
    });

    var convenience = document.getElementById("myRange_convenience");
    var c = document.getElementById("convenience_f");
    convenience.addEventListener("change", function () {
        c.innerHTML = this.value + "단계";
        document.getElementById("descript_convenience").innerText = "편의 " + this.value + "단계는 이러이러이러합니다."
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

    // 상세보기 모달창 띄우기
    var compBtn = document.getElementById("compBtn");
    compBtn.addEventListener("click", showComparison);

    // 상세보기 모달창 닫기
    var modalCloseBtn = document.getElementById("modalCloseBtn");
    modalCloseBtn.addEventListener("click", function () {
        var modal = document.querySelector(".modal");
        modal.style.display = "none";
        modal.style.zIndex = 0;
    })


    // 거주지 추천 결과에서 체크여부
    var check_first = document.getElementById("check_first");
    var check_second = document.getElementById("check_second");
    var check_third = document.getElementById("check_third");
    var check_first_info = document.getElementById("check_first_info");
    var check_second_info = document.getElementById("check_second_info");
    var check_third_info = document.getElementById("check_third_info");

    check_first.addEventListener("change", function () {
        check_first_info.checked = check_first.checked;
    });
    check_second.addEventListener("change", function () {
        check_second_info.checked = check_second.checked;
    });
    check_third.addEventListener("change", function () {
        check_third_info.checked = check_third.checked;
    });
    check_first_info.addEventListener("change", function () {
        check_first.checked = check_first_info.checked;
    });
    check_second_info.addEventListener("change", function () {
        check_second.checked = check_second_info.checked;
    });
    check_third_info.addEventListener("change", function () {
        check_third.checked = check_third_info.checked;
    });

    // 모달창 이벤트
    var btn_safety = document.getElementById("btn_safety");
    var btn_conv = document.getElementById("btn_convenience");

    btn_safety.addEventListener("click", () => selectModal(1, btn_safety, btn_conv));
    btn_conv.addEventListener("click", () => selectModal(2, btn_safety, btn_conv));

    // 모달창 안전시설 버튼
    var pollice_content_btn = document.getElementById("pollice_content_btn");
    var cctv_content_btn = document.getElementById("cctv_content_btn");
    var arrest_content_btn = document.getElementById("arrest_content_btn");

    pollice_content_btn.addEventListener("click", () => { initSafety(1); searchGu("safety", "pollice"); });
    cctv_content_btn.addEventListener("click", () => { initSafety(2); searchGu("safety", "cctv"); });
    arrest_content_btn.addEventListener("click", () => { initSafety(3); searchGu("safety", "arrest"); });

    // 모달창 편의시설 버튼
    var convStore_content_btn = document.getElementById("convStore_content_btn");
    var restaurant_content_btn = document.getElementById("restaurant_content_btn");
    var cafe_content_btn = document.getElementById("cafe_content_btn");
    var olive_content_btn = document.getElementById("olive_content_btn");
    var daiso_content_btn = document.getElementById("daiso_content_btn");

    convStore_content_btn.addEventListener("click", () => { initConv(1); searchGu("conv", "convStore"); });
    restaurant_content_btn.addEventListener("click", () => { initConv(2); searchGu("conv", "restaurant"); });
    cafe_content_btn.addEventListener("click", () => { initConv(3); searchGu("conv", "cafe"); });
    olive_content_btn.addEventListener("click", () => { initConv(4); searchGu("conv", "olive"); });
    daiso_content_btn.addEventListener("click", () => { initConv(5); searchGu("conv", "daiso"); });

}
// window.onload 끝
function initSafety(num) {
    var pollice_content_btn = document.getElementById("pollice_content_btn");
    var cctv_content_btn = document.getElementById("cctv_content_btn");
    var arrest_content_btn = document.getElementById("arrest_content_btn");

    pollice_content_btn.style.color = "#7b7b7b";
    cctv_content_btn.style.color = "#7b7b7b";
    arrest_content_btn.style.color = "#7b7b7b";

    // 파출소
    if (num === 1) {
        pollice_content_btn.style.color = "#000";
    } else if (num === 2) { //CCTV
        cctv_content_btn.style.color = "#000";
    } else { //검거율
        arrest_content_btn.style.color = "#000";
    }
}

function initConv(num) {
    var convStore_content_btn = document.getElementById("convStore_content_btn");
    var restaurant_content_btn = document.getElementById("restaurant_content_btn");
    var cafe_content_btn = document.getElementById("cafe_content_btn");
    var olive_content_btn = document.getElementById("olive_content_btn");
    var daiso_content_btn = document.getElementById("daiso_content_btn");

    convStore_content_btn.style.color = "#7b7b7b";
    restaurant_content_btn.style.color = "#7b7b7b";
    cafe_content_btn.style.color = "#7b7b7b";
    olive_content_btn.style.color = "#7b7b7b";
    daiso_content_btn.style.color = "#7b7b7b";

    // 편의점
    if (num === 1) {
        convStore_content_btn.style.color = "#000";
    } else if (num === 2) { //음식점
        restaurant_content_btn.style.color = "#000";
    } else if (num === 3) { //카페
        cafe_content_btn.style.color = "#000";
    } else if (num === 4) { //올리브영
        olive_content_btn.style.color = "#000";
    } else { //다이소
        daiso_content_btn.style.color = "#000";
    }
}

function selectModal(num, btn_safety, btn_conv) {
    if (num === 1) {
        document.getElementById("modal-select-conv").style.display = "none";
        document.getElementById("modal-select-safety").style.display = "flex";
        btn_safety.style.color = "#000";
        btn_conv.style.color = "#7b7b7b";
    } else {
        document.getElementById("modal-select-conv").style.display = "flex";
        document.getElementById("modal-select-safety").style.display = "none";
        btn_safety.style.color = "#7b7b7b";
        btn_conv.style.color = "#000";
    }
}


function displayArea(area, population, isRecommend) {
    var polygon = new kakao.maps.Polygon({
        map: map,
        path: area.path,
        strokeWeight: 2,
        strokeColor: isRecommend ? population.color : "rgba(0,0,0,0.3)",
        strokeOpacity: 0.8,
        fillColor: isRecommend ? population.color : "rgba(255,255,255,0.1)",
        fillOpacity: 0.7
    });

    polygons.push(polygon);

    if (isRecommend) {
        kakao.maps.event.addListener(polygon, 'mouseover', function () {
            polygon.setOptions({ strokeWeight: 5, strokeColor: "rgba(255, 0, 0, 1)" });
        });

        kakao.maps.event.addListener(polygon, 'mouseout', function () {
            polygon.setOptions({ strokeWeight: 2, strokeColor: isRecommend ? population.color : "rgb(0,0,0)" });
            polygon.setOptions({ fillColor: isRecommend ? population.color : "none" });
        });

        // 다각형에 click 이벤트를 등록하고 이벤트가 발생하면 다각형의 이름과 면적을 인포윈도우에 표시합니다 
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
}
/**
 * 커스텀 오버레이 정보창 닫기
 */
function infoClose() {
    customOverlay.setMap(null);
}

// 전세 선택 시 보여줄 화면
function showCharter() {
    document.getElementById("charterInput").style.display = "block";
    document.getElementById("monthlyInput").style.display = "none";
    document.querySelector(".select_need").style.height = "150px";
}

// 월세 선택 시 보여줄 화면
function showMonthly() {
    document.getElementById("charterInput").style.display = "none";
    document.getElementById("monthlyInput").style.display = "block";
    document.querySelector(".select_need").style.height = "200px";
}

// 추천 결과 페이지 전환
function showRecommend() {
    document.getElementById("user-input").style.display = "block";
    document.getElementById("recommend_result_page").style.display = "none";

    document.getElementById("recommend_first").style.display = "blcok";
    document.getElementById("recommend_second").style.display = "blcok";
    document.getElementById("recommend_third").style.display = "blcok";

    document.getElementById("recommend_first_info").style.display = "none";
    document.getElementById("recommend_second_info").style.display = "none";
    document.getElementById("recommend_third_info").style.display = "none";
}

function showResult() {
    document.getElementById("recommend_first").style.display = "block";
    document.getElementById("recommend_first_info").style.display = "none";
    document.getElementById("recommend_second").style.display = "block";
    document.getElementById("recommend_second_info").style.display = "none";
    document.getElementById("recommend_third").style.display = "block";
    document.getElementById("recommend_third_info").style.display = "none";

    var rand = [];
    recommendIdx = [];
    clearInterval(polygon_interval);

    polygons.forEach(polygon => {
        polygon.setMap(null);
    })

    polygons = []; //다각형 초기화
    while (rand.length < 3) {
        var num = Math.floor(Math.random() * 25);
        if (rand.indexOf(num) == -1) {
            rand.push(num);
            recommendIdx.push(num);
        }
    }

    document.getElementById("user-input").style.display = "none";
    document.getElementById("recommend_result_page").style.display = "block";

    // 거주지 추천 결과 랜덤 데이터 보여주기
    var orders = ["first", "second", "third"];

    for (var i = 0; i < rand.length; i++) {
        var recommend_result = "recommend_" + orders[i] + "_result";

        document.getElementById(recommend_result).innerText = guSpec[rand[i]].name;

        var recommend_detail = recommend_result + "_detail";
        document.getElementById(recommend_detail).innerText = guSpec[rand[i]].name;

        var select_charter = orders[i] + "_charter_fee";
        document.getElementById(select_charter).innerText = guSpec[rand[i]].charter;

        var select_deposit = orders[i] + "_deposit_fee";
        document.getElementById(select_deposit).innerText = guSpec[rand[i]].deposit;

        var select_monthly = orders[i] + "_monthly_fee";
        document.getElementById(select_monthly).innerText = guSpec[rand[i]].monthly;
    }

    // 추천 지역 다시 그리기
    var randIdx = 0;
    for (var i = 0; i < areas.length; i++) {
        if (rand.indexOf(i) != -1) {
            displayArea(areas[i], populationArea[i], true);
            randIdx++;
        } else {
            displayArea(areas[i], populationArea[i], false);
        }
    }

    polygon_interval = setInterval(intervalFunc, 500);
}

function intervalFunc() {
    if (polygons[recommendIdx[0]].Eb[0].strokeColor == "none") {
        polygons[recommendIdx[0]].setOptions({ strokeColor: "rgba(255,0,0,1)" });
        polygons[recommendIdx[1]].setOptions({ strokeColor: "rgba(255,0,0,1)" });
        polygons[recommendIdx[2]].setOptions({ strokeColor: "rgba(255,0,0,1)" });
    } else {
        polygons[recommendIdx[0]].setOptions({ strokeColor: "none" });
        polygons[recommendIdx[1]].setOptions({ strokeColor: "none" });
        polygons[recommendIdx[2]].setOptions({ strokeColor: "none" });
    }
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
function showFirstCharterFee() {
    document.getElementById("select_first_charter").style.display = "block";
    document.getElementById("select_first_monthly").style.display = "none";
}
function showFirstMonthlyFee() {
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
function showSecondCharterFee() {
    document.getElementById("select_second_charter").style.display = "block";
    document.getElementById("select_second_monthly").style.display = "none";
}
function showSecondMonthlyFee() {
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
function showThirdCharterFee() {
    document.getElementById("select_third_charter").style.display = "block";
    document.getElementById("select_third_monthly").style.display = "none";
}
function showThirdMonthlyFee() {
    document.getElementById("select_third_charter").style.display = "none";
    document.getElementById("select_third_monthly").style.display = "block";
}


// 상세비교창 띄우기
function showComparison(selMenu) {
    var check_first = document.getElementById("check_first");
    var check_second = document.getElementById("check_second");
    var check_third = document.getElementById("check_third");

    var isChecked = [check_first.checked, check_second.checked, check_third.checked];
    var cnt = 0;

    isChecked.forEach(e => {
        if (e) {
            cnt++;
        }
    });
    var increaseLeft = 100 / cnt;

    //선택된 구 개수에 따라서 그래프
    if (cnt == 0) {
        alert("1개 이상의 구를 선택해주세요");
        return;
    } else if (cnt == 1) {
        $(".graph_bar").each((index, element) => {
            element.style.left = "48.7%";
        });
    } else if (cnt == 2) {
        $(".graph_bar").each((index, element) => {
            element.style.left = "47.5%";
        });
    } else {
        $(".graph_bar").each((index, element) => {
            element.style.left = "46.5%";
        });
    }


    var recommend_first_name = $("#recommend_first_result").text();
    var recommend_second_name = $("#recommend_second_result").text();
    var recommend_third_name = $("#recommend_third_result").text();
    var recommend_names = [recommend_first_name, recommend_second_name, recommend_third_name];

    var orders = ["first", "second", "third"];

    // 체크박스 선택에 따른 동적 화면 변경
    var preLeft = -increaseLeft;
    for (var i = 0; i < 3; i++) {
        var wraps = document.querySelectorAll("." + orders[i] + "_wrap");

        if (isChecked[i]) {
            preLeft += increaseLeft;
            $("." + orders[i] + "_wrap").each((index, div) => {
                div.style.width = increaseLeft + "%";
                div.style.left = preLeft + "%";
                div.style.display = "block";
            });

            $(".label_gu" + (i + 1)).each((index, element) => {
                element.innerText = recommend_names[i];
                element.style.width = "100%";
                element.display = "block";
            });
        } else {
            $("." + orders[i] + "_wrap").each((index, div) => {
                div.style.width = "0%";
                div.style.display = "none";
            });

            $(".label_gu" + (i + 1)).each((index, element) => {
                element.innerText = "";
                element.style.width = "0%";
                element.display = "none";
            });

        }
    }

    var modal = document.querySelector(".modal");
    modal.style.display = "flex";
    modal.style.zIndex = 2;

    searchGu("safety", "pollice");
}

function searchGu(selMenu, selContent) {
    var check_first = document.getElementById("check_first");
    var check_second = document.getElementById("check_second");
    var check_third = document.getElementById("check_third");

    var recommend_first_name = $("#recommend_first_result").text();
    var recommend_second_name = $("#recommend_second_result").text();
    var recommend_third_name = $("#recommend_third_result").text();

    for (var i = 0; i < guSpec.length; i++) {
        if (check_first.checked && guSpec[i].name === recommend_first_name) {
            graphInit(guSpec[i], 1, selMenu, selContent);
            continue;
        }
        if (check_second.checked && guSpec[i].name === recommend_second_name) {
            graphInit(guSpec[i], 2, selMenu, selContent);
            continue;
        }
        if (check_third.checked && guSpec[i].name === recommend_third_name) {
            graphInit(guSpec[i], 3, selMenu, selContent);
            continue;
        }
    }
}

function graphInit(spec, num, selMenu, selContent) {
    if (selMenu === "safety") {
        if (selContent === "pollice") {
            document.getElementById("content_graph_title").innerText = "파출소";
            document.getElementById("content_bar" + num).style.height = spec.polliceOffice + 100 + "px";
            document.getElementById("content_value" + num).innerText = spec.polliceOffice;
        } else if (selContent === "cctv") {
            document.getElementById("content_graph_title").innerText = "CCTV";
            document.getElementById("content_bar" + num).style.height = spec.cctv + 100 + "px";
            document.getElementById("content_value" + num).innerText = spec.cctv;
        } else {
            document.getElementById("content_graph_title").innerText = "검거율";
            document.getElementById("content_bar" + num).style.height = spec.arrest + 100 + "px";
            document.getElementById("content_value" + num).innerText = spec.arrest;
        }
    } else {
        if (selContent === "convStore") {
            document.getElementById("content_graph_title").innerText = "편의점";
            document.getElementById("content_bar" + num).style.height = spec.convenienceStore + 100 + "px";
            document.getElementById("content_value" + num).innerText = spec.convenienceStore;
        } else if (selContent === "restaurant") {
            document.getElementById("content_graph_title").innerText = "음식점";
            document.getElementById("content_bar" + num).style.height = spec.restaurant + 100 + "px";
            document.getElementById("content_value" + num).innerText = spec.restaurant;
        } else if (selContent === "cafe") {
            document.getElementById("content_graph_title").innerText = "카페";
            document.getElementById("content_bar" + num).style.height = spec.cafe + 100 + "px";
            document.getElementById("content_value" + num).innerText = spec.cafe;
        } else if (selContent === "olive") {
            document.getElementById("content_graph_title").innerText = "올리브영";
            document.getElementById("content_bar" + num).style.height = spec.olive + 100 + "px";
            document.getElementById("content_value" + num).innerText = spec.olive;
        } else {
            document.getElementById("content_graph_title").innerText = "다이소";
            document.getElementById("content_bar" + num).style.height = spec.daiso + 100 + "px";
            document.getElementById("content_value" + num).innerText = spec.daiso;
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