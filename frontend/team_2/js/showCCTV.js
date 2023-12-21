// 정범진
import { saftyScore } from "./graph.js";
import { getDist } from "./policeOffice.js";
import { getDensity } from "./density.js";

/* 경도로 변경 완료.*/

var geocoder = new kakao.maps.services.Geocoder();      // 주소-좌표 변환 객체 생성(CCTV 위치 선택 목적)

var markers = [];

var markerCCTV = new kakao.maps.Marker({

});

kakao.maps.event.addListener(map, 'click', function(mouseEvent){

    drowMarker(mouseEvent.latLng);
    
});

function drowMarker(latlng){

    var cctvList = [];                            // CCTV 좌표 저장 배열.(실제 폴리라인 500M 따른 좌표 계산 전 임시 저장 변수)
    var completeCCTVlist = [];

    var linePath, polyline;  var polylength;      // polyline 좌표, 생성, 길이 저장.
    
    var searchLatitude = 0;             /* 클릭 이벤트 발생 위도와 일치하는 값을 찾을 시 Json 파일 내 CCTV 좌표의 위치 값(0 ~ LoadDataCCTV) 반환, 만약 완전 일치하는 값이 없다면 반복문 종료 이후
                                           근사치 구하는 반복문의 결과 값을 이 변수에 저장.*/
    var topValue, bottomValue;          // 클릭 이벤트 발생 위도의 +- 500m 범위 저장.

    var loopTop, loopBottom;            // 반복문 조건은 전체 Json 범위가 3줄 이하일 때 까지 반복, 이때 최고 값 위치 행과 최저 값 위치 행 각각 저장.

    var cctvCount = 0;
    /* #### 입력 받은 클릭 이벤트 위도 값으로 CCTV 들의 좌표 값을 구하여 배열에 저장하기 ####################### */

    // 마우스 포인터의 위도를 기준으로 위아래 방향 0.0045 범위(반경 500) 내 모든 cctv 검색해서 배열에 저장
    topValue = latlng.getLng() + 0.0045;            // 위도 축 반경 + 500 m 계산
    bottomValue = latlng.getLng() - 0.0045;         // 위도 축 반경 - 500 m 계산

    // CCTV 좌표 검색, 현재 Json 파일은 위도 기준으로 전치리 정렬 완료, 또한 경도 검색을 별도로 하는 것 보다 위도를 검색하면서 검색 대상 위도에 해당하는 경도를 포함하는 좌표로써 배열에 저장.

    loopTop = LoadDataCCTV.length;      // Json 전체 배열 길이
    loopBottom = 0;                     // Json 1번째 행

    var middleIndex;                    // 반복문 내에서 Json 탐색 범위 중 최상단 행 번호와 최 하단 행 번호의 중간 값을 찾고 거기서 소수점 버리기.

    
    while((loopTop-loopBottom) >= 3 ){                              /* 범위를 조정해 가며 탐색하며 3줄 이하일 경우 자동으로 반복문 종료, 이후 3줄 중 가장 가운데 있는 값을 클릭 이벤트 위도 와 근사치라
                                                                       판단 후 분기 지점 실행 */
        middleIndex = Math.floor((loopTop+loopBottom)/2)

        if(LoadDataCCTV[middleIndex].WGS84Longitude === latlng.getLng()) {      /* Json 탐색 중 현재의 탑색 범위 내 중간 위치의 위도가 클릭 이벤트 위도와 동일 시 해당 좌표의 인덱스 값 반환 후 반복문 종료 */
                                                                                                  
            searchLatitude = middleIndex;
            break;
        }

        else {                                           // 범위 내에서 탐색 중인 Json 파일의 중앙 값이 클릭 이벤트의 위도 값과 일치하지 않는 경우 위도 값에 따라 loopTop과 loopBottom 을 조정.

            if(latlng.getLng() > LoadDataCCTV[middleIndex].WGS84Longitude) {      // 마우스 클릭 이벤트 위도 값이 중앙값 보다 크다면 실행, loopTop 값은 동일하며, loopBottom 값만 중앙 값으로 조정.

                loopBottom = middleIndex;
            } else {                                                                        // 마우스 클릭 이벤트 위도 값이 중앙값보다 작다면 실행, loopBttom 값은 동일하며 loopTop 값만 중앙 값으로 조정.

                loopTop = middleIndex;
            }
        }
    }

    /* 현재 결과는 "(loopTop-loopBottom) <= 3"(근사치 찾기 직전) 이거나 클릭 이벤트 위도와 동일한 CCTV 좌표 Json 행 위치를 찾은 상태 이다.
        즉 마우스 클릭 이벤트와 동일하거나 근사치의 CCTV 좌표 여부 따른 분기 실행
        */

    if(searchLatitude) { return; }       // 일치 값을 찾았을 시 별다른 계산 없이 이미 설정한 범위 내 해당하는 CCTV 좌표 탐색
    else {                               // 근사치 탐색, 즉 3줄 이하 중 정확한 줄 수 파악 후 해당 줄 값의 중간 값을 확인.(3줄 일 수도 있고 2줄일 수도 있기 때문에.)

        if((loopTop-loopBottom) === 1){  // 검색 미완료된 Json 내 총 줄 수가 2줄 이면 아무 줄이나 선택해서 검색 시작 위치로 선정해도 상관 없음, 임의로 loopTop 선택
            
            searchLatitude = loopTop;
        } else {                         // 검색 미완료된 Json 내 총 줄 수가 3줄 이라면 중간 위치 선정.

            searchLatitude = loopTop - loopBottom;
        }
    }

    /* #### 기준 값인 "searchLatitude" 기준으로 상/하 범위 내 모든 클릭 이벤트 위도 값에 해당하는 모든 CCTV 좌표들을 배열 "cctvList" 내 저장 ######## */
    
    // 1. "상 범위" 내 탐색 : 지정된 Json 행(searchLtitue)를 한줄 씩 큰 범위 방향으로 행을 확인하면서 위도 값과 일치하는 모든 좌표(위도/경도 포함)를 계산하여 kakao map api 좌표 객체를 만들어서 저장.
    var Topindex = searchLatitude;      // "상/하 범위" 모두 탐색을 해야 되기 때문에 데이터 안 섞이게 저장.
    for( ; LoadDataCCTV[Topindex].WGS84Longitude <=  topValue && Topindex < LoadDataCCTV.length; Topindex ++){

        //cctvList.push(new kakao.maps.LatLng(LoadDataCCTV[Topindex].WGS84Latitude, LoadDataCCTV[Topindex].WGS84Longitude)); // CCTV 개수를 넣기 위한 수정
        cctvList.push(LoadDataCCTV[Topindex])
    }

    // 2. "하 범위" 내 탐색
    var Bottomindex = searchLatitude;   // "상/하 범위" 모두 탐색을 해야 되기 때문에 데이터 안 섞이게 저장.
    for( ; LoadDataCCTV[Bottomindex].WGS84Longitude >= bottomValue && Bottomindex >= 0 ; Bottomindex --){

        //cctvList.push(new kakao.maps.LatLng(LoadDataCCTV[Bottomindex].WGS84Latitude, LoadDataCCTV[Bottomindex].WGS84Longitude)); // CCTV 개수를 넣기 위한 수정
        cctvList.push(LoadDataCCTV[Bottomindex])
    }

    /* #### 저장된 좌표 배열 내 500 M 내 CCTV 좌표들만 추려내기 - 폴리라인 그리기 #################################################################### */
    /*
        1. 이전 단계에서 위도 기준으로 500M 내 좌표 값들을 추려 냈음.
        2. 하지만 경도는 고려 안했으므로 실제로 구현 범위는 사각형 형태의 위도 500M 의 좌표들일 것임
        3. 그러므로 위/경도 모두 고려하여 실질적인 좌표 500M 에 해당하는 목록들을 추가로 추릴 필요 존재.
        4. 각 좌표 배열(cctvList) 내에서 모든 좌표 배열에 대한 좌표 값을 구한 후 각각 폴리라인을 생성 및 길이 확인 후 500M 내 좌표만 배열 
    */

    var clickLatlng = new kakao.maps.LatLng(latlng.getLat(), latlng.getLng());  // 클릭 이벤트 좌표 계산, 반복문 리소스 절감.
    
    for(var i = 0; i < cctvList.length ; i++){

        linePath = [

            clickLatlng,     // 마우스 이벤트 위도, 경도 좌표 객체
            new kakao.maps.LatLng(cctvList[i].WGS84Latitude, cctvList[i].WGS84Longitude)
        ];

        polyline =new kakao.maps.Polyline({

            path : linePath,
            // strokeWeight: 5, // 선의 두께 입니다
            // strokeColor: '#FFAE00', // 선의 색깔입니다
            // strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
            // strokeStyle: 'solid' // 선의 스타일입니다
        });

        if(polyline.getLength() <= 500) {            // 마우스 클릭 좌표와 CCTV 좌표 간 거리 비교, 500M 미만일 시 마커 표시 배열 내 저장.
            
            completeCCTVlist.push(cctvList[i])
        } 
    }

    /* #### 마커 그리기 #################################################################################### */

    /* 클릭 이벤트 발생 시 이전 마커 객체가 존재한다면 삭제. */

    if(markers.length >= 1) {

        for(var i = 0; i< markers.length; i++){

            markers[i].setMap(null);
        }
    }

    var imageSrc = "./imgs/cctv_icon.png";   // 마커 이미지 위치
    var imageSize = new kakao.maps.Size(28, 28);                                                // 마커 사이즈
    var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);                          // 마커 이미지 만들기, 마커 이미지와 사이즈를 사용

    for(var i = 0; i<completeCCTVlist.length; i++){

        // 마커를 생성합니다
        markerCCTV = new kakao.maps.Marker({
            
            
            // position: completeCCTVlist[i], // 마커를 표시할 위치
            position : new kakao.maps.LatLng(completeCCTVlist[i].WGS84Latitude, completeCCTVlist[i].WGS84Longitude),
            image : markerImage, // 마커 이미지
            title : '설치된 CCTV 수 : ' + completeCCTVlist[i].CameraCount, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시
            clickable : false, // 마커 클릭 가능 여부
            opacity : 0.8
        });
        
        markerCCTV.setMap(map);
        markers.push(markerCCTV);
    }

    for(var i=0; i < completeCCTVlist.length; i++){

        cctvCount += Number(completeCCTVlist[i].CameraCount);
    }
    document.querySelector("#cctvPcs").innerHTML = cctvCount + ' 개'
    getDensity(clickLatlng, function(callback) {
        saftyScore(getDist(), cctvCount, callback);
        cctvCount = 0;
    });
}