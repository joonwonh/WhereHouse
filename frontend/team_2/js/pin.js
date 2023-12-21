// ##이재서
var recently = [];

//마커 구현 코드
var marker = new kakao.maps.Marker({ 
    // 지도 중심좌표에 마커를 생성
    position: map.getCenter(),
    zIndex: 2
});

// 지도에 표시할 원을 생성합니다
var circle = new kakao.maps.Circle({
    position: map.getCenter() ,  // 원의 중심좌표
    radius: 500, // 미터 단위의 원의 반지름
    strokeWeight: 3, // 선의 두께
    strokeColor: '#0B5ED7', // 선의 색깔
    strokeOpacity: 0.7, // 선의 불투명도
    strokeStyle: 'dashed', // 선의 스타일
    fillColor: '#0B5ED7', // 채우기 색깔
    fillOpacity: 0.1  // 채우기 불투명도
});

// 지도에 클릭 이벤트를 등록
// 지도를 클릭하면 마지막 파라미터로 넘어온 함수를 호출
kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
    //마커와 원 표시
    circle.setMap(map);
    marker.setMap(map);
    
    // 클릭한 위도, 경도 정보
    var latlng = mouseEvent.latLng
    
    // 마커와 원 위치, 그리고 화면 이동
    circle.setPosition(latlng);
    marker.setPosition(latlng);
    map.panTo(latlng);

    searchAddrFromCoords(latlng, displayInfo);
    searchDetailAddrFromCoords(latlng, displayDetailInfo);

    // 최근 눌러본 장소 기록
    recently += latlng;
});

// 주소 - 좌표 변환 객체
var geocoder = new kakao.maps.services.Geocoder();

// =====================================================================================================

// 좌표의 행정동 주소 정보 요청 함수
function searchAddrFromCoords(coords, callback) {
    geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);         
}

// 좌표의 법정동 상세 주소 정보 요청 함수
function searchDetailAddrFromCoords(coords, callback) {
    geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
}

// 지도의 간략한 주소를 표출하는 함수
function displayInfo(result, status) {
    if (status === kakao.maps.services.Status.OK) {
        var infoDiv = document.querySelector("#addr");

        for(var i = 0; i < result.length; i++) {
            // 행정동의 region_type 값은 'H' 이므로
            if (result[i].region_type === 'H') {
                infoDiv.innerHTML = result[i].address_name;
                break;
            }
        } 
    }
}

// 지도의 상세 주소를 표출하는 함수
function displayDetailInfo(result, status) {
    if (status === kakao.maps.services.Status.OK) {
        var infoDiv = document.querySelector(".detailAddr");

        infoDiv.innerHTML = !! result[0].road_address ? "도로명 : " + result[0].road_address.address_name +
                                                        "<br>지번 : " + result[0].address.address_name
                                                        :
                                                        "도로명 : -<br>지번  : -";
    }
}
