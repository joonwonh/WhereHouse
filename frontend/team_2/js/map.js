// ##이재서
var x = 37.56863122485489, y = 126.91487864398042; // 다른 페이지에서 받는 좌표값

var latLng = JSON.parse(localStorage.getItem("latLng"));
if (latLng != null) {
    x = latLng.lng;
    y = latLng.lat;
}

//지도 호출
var container = document.getElementById('map'),
    map = new kakao.maps.Map(container, {
        center: new kakao.maps.LatLng(x, y),
        level: 3,
        minLevel: 2,
        maxLevel: 5,
        disableDoubleClickZoom: true // 더블 클릭 확대 잠금
    });

//줌 컨트롤
var zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);