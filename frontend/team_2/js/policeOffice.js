// 이재서
// 객체 담을 그릇 생성
var policeOffice = [];

var geocoder = new kakao.maps.services.Geocoder();

let dist;

fetch('./json/policeOffice.geojson')
      .then(res => res.json())
      .then(data => {
        var dataSet = data.features;
        // 지역이 서울인 곳과 데이터가 모두 있는 것만 전처리
        for (var i = 0; i < dataSet.length; i++) {
            if (dataSet[i].properties.h1 === "서울" && dataSet[i].properties.success === true)
              policeOffice.push(dataSet[i].properties);
          }
        
        for (var i = 0; i < policeOffice.length; i ++) {
            // 마커 이미지의 이미지 주소
            var imageSrc = "./imgs/police_office_icon.png";
            // 마커 이미지의 이미지 크기
            var imageSize = new kakao.maps.Size(52, 52);
            // 마커 이미지를 생성
            var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize); 
            // 마커를 생성
            var marker = new kakao.maps.Marker({
                map: map, // 마커를 표시할 지도
                position: new kakao.maps.LatLng(policeOffice[i].lat, policeOffice[i].lng), // 마커를 표시할 위치
                title : policeOffice[i].bm[0]+ ' (' +policeOffice[i].address + ')', // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시
                image : markerImage, // 마커 이미지
                opacity : 0.9, // 마커 투명도
                zIndex: 1
            });
        }

        // 클릭 이벤트 발생시 패스 생성
        kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
            dist = distance(mouseEvent.latLng);
            document.querySelector("#distance").innerHTML = Math.round(dist) + ' M';
        });

        function distance(latLng) {
            var min;
            for (var i = 0; i < policeOffice.length; i++) {
                if (!min) {
                    var min=new kakao.maps.Polyline({
                        path : [
                        new kakao.maps.LatLng(policeOffice[i].lat,policeOffice[i].lng),
                        new kakao.maps.LatLng(latLng.Ma,latLng.La)
                        ],
                    strokeWeight: 0,
                    strokeColor: '#fff',
                    strokeOpacity: 0,
                    strokeStyle: 'solid'
                    });
                } else {
                    var polyline=new kakao.maps.Polyline({
                        path : [
                            new kakao.maps.LatLng(policeOffice[i].lat,policeOffice[i].lng),
                            new kakao.maps.LatLng(latLng.Ma,latLng.La)
                        ],
                    strokeWeight: 0,
                    strokeColor: '#fff',
                    strokeOpacity: 0,
                    strokeStyle: 'solid'
                    });
        
                    if (min.getLength() > polyline.getLength()) {
                        min = polyline;
                        polyline.setMap(null);   
                    }
                }   
            }

            return min.getLength();
        }
    })
    .catch( err => {alert('error');})

function getDist() {
    return dist;
}

function getPOCount(latlng, callback) {
    searchAddrFromCoords(latlng, getAddr);

    // 좌표의 행정동 주소 정보 요청 함수
    function searchAddrFromCoords(coords, callback) {
        geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);         
    }
    
    function getAddr(result) {
        var poCount = 0;
        for (var i = 0; i < policeOffice.length; i++) {
            if (policeOffice[i].address.includes(result[1].region_2depth_name)) {
                poCount += 1;
            }
        }
        callback(poCount);
        console.log(result[1].region_2depth_name);
    }
}

export { getDist , getPOCount }