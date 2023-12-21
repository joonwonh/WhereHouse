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
}