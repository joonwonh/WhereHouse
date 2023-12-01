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
    console.log(populationArea);

    /**
     * 화면에 다각형 생성
     */

    for (var i = 0, len = areas.length; i < len; i++) {
        displayArea(areas[i], populationArea[i].color);
    }

    // 다각형을 생상하고 이벤트를 등록하는 함수입니다
    function displayArea(area, color) {

        // 다각형을 생성합니다 
        var polygon = new kakao.maps.Polygon({
            map: map, // 다각형을 표시할 지도 객체
            path: area.path,
            strokeWeight: 2,
            // strokeColor: 'rgba(11, 94, 215, 0.50)',
            strokeColor: color,
            strokeOpacity: 0.8,
            fillColor: color,
            fillOpacity: 0.7
        });

        kakao.maps.event.addListener(polygon, 'mouseover', function () {
            polygon.setOptions({ strokeWeight: 5, strokeColor: "rgba(255, 0, 0, 1)" });//, fillColor: "rgba(255, 255, 255, 0)" });
        });

        kakao.maps.event.addListener(polygon, 'mouseout', function () {
            polygon.setOptions({ strokeWeight: 2, strokeColor: color });
            polygon.setOptions({ fillColor: color });
        });

        // 다각형에 click 이벤트를 등록하고 이벤트가 발생하면 다각형의 이름과 면적을 인포윈도우에 표시합니다 
        kakao.maps.event.addListener(polygon, 'click', function (mouseEvent) {
            var content = '<div class="info">' +
                '   <div class="title">' + area.name + '</div>' +
                '   <div class="size">총 면적 : 약 ' + Math.floor(polygon.getArea()) + ' m<sup>2</sup></div>' +
                '</div>';

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
    var info = document.querySelector("#population-shame-info");
    var bar = document.querySelector("#population-shame-bar");
    var detail = document.querySelector("#population-shame-btn");
    detail.addEventListener("click", hideDetail);

    function hideDetail() {
        if (detail.innerText === "-") {
            detail.innerText = "+";
            info.style.display = "none";
            bar.style.backgroundColor = "rgba(217,217,217,0.3)";
            bar.style.border = "#D9D9D9 1px solid";
        } else {
            detail.innerText = "-";
            info.style.display = "block";
        }

    }

    /**
     * 상세 비교 창 띄우기
    // var showBtn = document.getElementById("showBtn");

    // showBtn.addEventListener("click", openWindow)
    */

}

/**
 * 상세 비교 창 띄우는 함수
 */
function openWindow() {
    window.open('detail_window.html', 'detail_window',
        "top=10, left=10, width=500, height=600, status=no, menubar=no, toolbar=no, resizable=no, location=no");
}

function initPopulation() {
    var populationArea = [];
    populationArea.push({ name: "강동구", population: Math.floor(Math.random() * 40000) + 10000, idx: 0 });
    populationArea.push({ name: "송파구", population: Math.floor(Math.random() * 40000) + 10000, idx: 0 });
    populationArea.push({ name: "강남구", population: Math.floor(Math.random() * 40000) + 10000, idx: 0 });
    populationArea.push({ name: "서초구", population: Math.floor(Math.random() * 40000) + 10000, idx: 0 });
    populationArea.push({ name: "관악구", population: Math.floor(Math.random() * 40000) + 10000, idx: 0 });
    populationArea.push({ name: "동작구", population: Math.floor(Math.random() * 40000) + 10000, idx: 0 });
    populationArea.push({ name: "영등포구", population: Math.floor(Math.random() * 40000) + 10000, idx: 0 });
    populationArea.push({ name: "금천구", population: Math.floor(Math.random() * 40000) + 10000, idx: 0 });
    populationArea.push({ name: "구로구", population: Math.floor(Math.random() * 40000) + 10000, idx: 0 });
    populationArea.push({ name: "강서구", population: Math.floor(Math.random() * 40000) + 10000, idx: 0 });
    populationArea.push({ name: "양천구", population: Math.floor(Math.random() * 40000) + 10000, idx: 0 });
    populationArea.push({ name: "마포구", population: Math.floor(Math.random() * 40000) + 10000, idx: 0 });
    populationArea.push({ name: "서대문구", population: Math.floor(Math.random() * 40000) + 10000, idx: 0 });
    populationArea.push({ name: "은평구", population: Math.floor(Math.random() * 40000) + 10000, idx: 0 });
    populationArea.push({ name: "노원구", population: Math.floor(Math.random() * 40000) + 10000, idx: 0 });
    populationArea.push({ name: "도봉구", population: Math.floor(Math.random() * 40000) + 10000, idx: 0 });
    populationArea.push({ name: "강북구", population: Math.floor(Math.random() * 40000) + 10000, idx: 0 });
    populationArea.push({ name: "성북구", population: Math.floor(Math.random() * 40000) + 10000, idx: 0 });
    populationArea.push({ name: "중랑구", population: Math.floor(Math.random() * 40000) + 10000, idx: 0 });
    populationArea.push({ name: "동대문구", population: Math.floor(Math.random() * 40000) + 10000, idx: 0 });
    populationArea.push({ name: "광진구", population: Math.floor(Math.random() * 40000) + 10000, idx: 0 });
    populationArea.push({ name: "성동구", population: Math.floor(Math.random() * 40000) + 10000, idx: 0 });
    populationArea.push({ name: "용산구", population: Math.floor(Math.random() * 40000) + 10000, idx: 0 });
    populationArea.push({ name: "중구", population: Math.floor(Math.random() * 40000) + 10000, idx: 0 });
    populationArea.push({ name: "종로구", population: Math.floor(Math.random() * 40000) + 10000, idx: 0 });

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