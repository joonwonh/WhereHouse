// ##이재서
import { saftyScore } from "./graph.js";
import { getDist , getPOCount } from "./policeOffice.js";
import { getDensity } from "./density.js";
// 객체 담을 그릇 생성
var seoulCCTV;
// 생성된 마커들을 담을 그릇 생성
var markers = [];

var geocoder = new kakao.maps.services.Geocoder();

fetch('./json/seoulCCTV.json')
      .then(res => res.json())
      .then(data => {
        seoulCCTV = data;

        // 클릭 이벤트 발생시 마커 생성
        
        kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
            var num = (addMarker(mouseEvent.latLng));
            document.querySelector("#cctvPcs").innerHTML = num + ' 개';
            getDensity(mouseEvent.latLng, function(callback) {
                getPOCount(mouseEvent.latLng, async function(callback2) {
                    var poCount = await callback2;
                    saftyScore(getDist(), num, poCount, callback.population, callback.density);
                });
            });
        });

        function addMarker(latLng) {
            var cameraCount = 0;

            // 배열안에 마커들을 지우고 배열 초기화
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            } markers = [];

            for (var i = 0; i < seoulCCTV.length; i++) {
                if (parseFloat(seoulCCTV[i].WGS84Longitude)>(parseFloat(latLng.La) + 0.009) || parseFloat(seoulCCTV[i].WGS84Longitude)<(parseFloat(latLng.La) - 0.009)) {
                    continue;
                }

                var polyline=new kakao.maps.Polyline({
                    path : [
                        new kakao.maps.LatLng(latLng.Ma,latLng.La),
                        new kakao.maps.LatLng(seoulCCTV[i].WGS84Latitude, seoulCCTV[i].WGS84Longitude)
                    ]
                });

                if (polyline.getLength() < circle.getRadius()) {
                    // 마커 이미지의 이미지 주소
                    var imageSrc = "./imgs/cctv_icon.png";
                    // 마커 이미지의 이미지 크기
                    var imageSize = new kakao.maps.Size(28, 28);
                    // 마커 이미지를 생성
                    var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

                    var marker = new kakao.maps.Marker({
                        map: map, // 마커를 표시할 지도
                        position: new kakao.maps.LatLng(seoulCCTV[i].WGS84Latitude, seoulCCTV[i].WGS84Longitude), // 마커를 표시할 위치
                        title : '설치된 CCTV 수 : ' + seoulCCTV[i].CameraCount, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시
                        image : markerImage, // 마커 이미지 
                        opacity : 1 - Math.round(polyline.getLength())*0.0008, // 마커 투명도
                        clickable : false // 마커 클릭 가능 여부
                    });
                    cameraCount += parseInt(seoulCCTV[i].CameraCount);
                    markers.push(marker);
                }
                polyline.setMap(null);
            }

            return cameraCount;
        };

        function getGuCCTVCount(latlng, callback) {
            searchAddrFromCoords(latlng, getAddrDensity);
        
            // 좌표의 행정동 주소 정보 요청 함수
            function searchAddrFromCoords(coords, callback) {
                geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);         
            }
                    
            function getAddrDensity(result) {
                for (var i = 0; i < guCCTVCount.length; i++) {
                    if (guCCTVCount[i].addr.includes(result[1].region_2depth_name)) {
                        callback(guCCTVCount[i]);
                    }
                }
            }
        }

    })
    .catch( err => {alert('error');})