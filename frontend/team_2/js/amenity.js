// ##이재서
import { convScore } from "./graph.js";
import { getDensity } from "./density.js";

var ps = new kakao.maps.services.Places(map);

var cs2 = [],
    mt1 = [],
    sw8 = [],
    ct1 = [],
    ce7 = [],
    bk9 = [],
    fd6 = [],
    hp8 = [],
    pm9 = [],
    po3 = [],
    ol7 = [],
    pk6 = [],
    sc4 = [],
    ac5 = [],
    at4 = [],
    ad5 = [],

    decrease = [],
    emarkers = [],
    
    each1 = document.querySelector("#each1"),
    each2 = document.querySelector("#each2"),
    each3 = document.querySelector("#each3"),
    each4 = document.querySelector("#each4"),
    each5 = document.querySelector("#each5");

var now,
    score;

kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
        var searchOption = {
            x : mouseEvent.latLng.La,
            y : mouseEvent.latLng.Ma,
            radius : 500
        }

        now = 0;
        score = 0;
        for (var i = 0; i < emarkers.length; i++) {
            emarkers[i].setMap(null);
        } emarkers = [];

        // 단순 노가다,,, 하
        decrease = [];
        // 편의점
        ps.categorySearch('CS2', placesSearchCS2, searchOption);
        // 마트
        ps.categorySearch('MT1', placesSearchMT1, searchOption);
        // 지하철역
        ps.categorySearch('SW8', placesSearchSW8, searchOption);
        // 문화시설
        ps.categorySearch('CT1', placesSearchCT1, searchOption);
        // 커피숍
        ps.categorySearch('CE7', placesSearchCE7, searchOption);
        // 은행
        ps.categorySearch('BK9', placesSearchBK9, searchOption);
        // 병원
        ps.categorySearch('HP8', placesSearchHP8, searchOption);
        // 약국
        ps.categorySearch('PM9', placesSearchPM9, searchOption);
        // 공공기관
        ps.categorySearch('PO3', placesSearchPO3, searchOption);
        // 주유소
        ps.categorySearch('OL7', placesSearchOL7, searchOption);
        // 주차장
        ps.categorySearch('PK6', placesSearchPK6, searchOption);
        // 학교
        ps.categorySearch('SC4', placesSearchSC4, searchOption);
        // 학원
        ps.categorySearch('AC5', placesSearchAC5, searchOption);
        // 관광명소
        ps.categorySearch('AT4', placesSearchAT4, searchOption);
        // 숙박
        ps.categorySearch('AD5', placesSearchAD5, searchOption);
        // 음식점
        ps.categorySearch('FD6', placesSearchFD6, searchOption);

        getDensity(mouseEvent.latLng, function(callback) {
            convScore(score, callback.density);
        });
})

document.querySelector("#each1").onclick = function() {
    if (now === 1) {
        removeMarkers();
        return now = 0;
    }
    now = 1;
    clickMenu(now - 1);
};
document.querySelector("#each2").onclick = function() {
    if (now === 2) {
        removeMarkers();
        return now = 0;
    }
    now = 2;
    clickMenu(now - 1);
};
document.querySelector("#each3").onclick = function() {
    if (now === 3) {
        removeMarkers();
        return now = 0;
    }
    now = 3;
    clickMenu(now - 1);
};
document.querySelector("#each4").onclick = function() {
    if (now === 4) {
        removeMarkers();
        return now = 0;
    }
    now = 4;
    clickMenu(now - 1);
};
document.querySelector("#each5").onclick = function() {
    if (now === 5) {
        removeMarkers();
        return now = 0;
    }
    now = 5;
    clickMenu(now - 1);
};

// 단순 노가다, 배열에 넣는 작업
// 편의점
function placesSearchCS2 (data, status) {
    if (status === kakao.maps.services.Status.OK) {
        cs2 = [];
        for (var i=0; i<data.length; i++) {
            cs2.push(data[i]);
        }
        decrease.push(cs2);
        score += (parseInt(cs2.length)/15)*10;
    }
}
// 마트
function placesSearchMT1 (data, status) {
    if (status === kakao.maps.services.Status.OK) {
        mt1 = [];
        for (var i=0; i<data.length; i++) {
            mt1.push(data[i]);
        }
        decrease.push(mt1);
        if (mt1.length>2)
            score += 10;
    }
}
// 지하철역
function placesSearchSW8 (data, status) {
    if (status === kakao.maps.services.Status.OK) {
        sw8 = [];
        for (var i=0; i<data.length; i++) {
            sw8.push(data[i]);
        }
        decrease.push(sw8);
        if (sw8.length>0)
            score += 10;
    }
}
// 문화시설
function placesSearchCT1 (data, status) {
    if (status === kakao.maps.services.Status.OK) {
        ct1 = [];
        for (var i=0; i<data.length; i++) {
            ct1.push(data[i]);
        }
        decrease.push(ct1);
        if (ct1.length>3)
            score += 4;
    }
}
// 커피숍
function placesSearchCE7 (data, status) {
    if (status === kakao.maps.services.Status.OK) {
        ce7 = [];
        for (var i=0; i<data.length; i++) {
            ce7.push(data[i]);
        }
        decrease.push(ce7);
        score += (parseInt(ce7.length)/15)*10; // 편의점과 동일
    }
}
// 은행
function placesSearchBK9 (data, status) {
    if (status === kakao.maps.services.Status.OK) {
        bk9 = [];
        for (var i=0; i<data.length; i++) {
            bk9.push(data[i]);
        }
        decrease.push(bk9);
        if (bk9.length>2) score += 10;
    }
}
// 병원
function placesSearchHP8 (data, status) {
    if (status === kakao.maps.services.Status.OK) {
        hp8 = [];
        for (var i=0; i<data.length; i++) {
            hp8.push(data[i]);
        }
        decrease.push(hp8);
        if (hp8.length>1) score += 4;
    }
}
// 약국
function placesSearchPM9 (data, status) {
    if (status === kakao.maps.services.Status.OK) {
        pm9 = [];
        for (var i=0; i<data.length; i++) {
            pm9.push(data[i]);
        }
        decrease.push(pm9);
        if (pm9.length>4) score += 4;
    }
}
// 공공기관
function placesSearchPO3 (data, status) {
    if (status === kakao.maps.services.Status.OK) {
        po3 = [];
        for (var i=0; i<data.length; i++) {
            po3.push(data[i]);
        }
        decrease.push(po3);
        if (po3.length>1) score += 6;
    }
}
// 주유소
function placesSearchOL7 (data, status) {
    if (status === kakao.maps.services.Status.OK) {
        ol7 = [];
        for (var i=0; i<data.length; i++) {
            ol7.push(data[i]);
        }
        decrease.push(ol7);
        if (ol7.length>2) score += 4;
    }
}
// 주차장
function placesSearchPK6 (data, status) {
    if (status === kakao.maps.services.Status.OK) {
        pk6 = [];
        for (var i=0; i<data.length; i++) {
            pk6.push(data[i]);
        }
        decrease.push(pk6);
        if (pk6.length>3) score += 4;
    }
}
// 학교
function placesSearchSC4 (data, status) {
    if (status === kakao.maps.services.Status.OK) {
        sc4 = [];
        for (var i=0; i<data.length; i++) {
            sc4.push(data[i]);
        }
        decrease.push(sc4);
        if (sc4.length>1) score += 4;
    }
}
// 학원
function placesSearchAC5 (data, status) {
    if (status === kakao.maps.services.Status.OK) {
        ac5 = [];
        for (var i=0; i<data.length; i++) {
            ac5.push(data[i]);
        }
        decrease.push(ac5);
        if (ac5.length>3) score += 4;
    }
}
// 관광명소
function placesSearchAT4 (data, status) {
    if (status === kakao.maps.services.Status.OK) {
        at4 = [];
        for (var i=0; i<data.length; i++) {
            at4.push(data[i]);
        }
        decrease.push(at4);
        if (at4.length>1) score += 4;
    }
}
// 숙박
function placesSearchAD5 (data, status) {
    if (status === kakao.maps.services.Status.OK) {
        ad5 = [];
        for (var i=0; i<data.length; i++) {
            ad5.push(data[i]);
        }
        decrease.push(ad5);
        if (ad5.length>1) score += 2;
    }
}
// 음식점
function placesSearchFD6 (data, status) {
    if (status === kakao.maps.services.Status.OK) {
        fd6 = [];
        for (var i=0; i<data.length; i++) {
            fd6.push(data[i]);
        }
        decrease.push(fd6);
        score += (parseInt(fd6.length)/15)*10;
        // getDensity(mouseEvent.latLng, function(callback) {
        //     convScore(score, callback);
        // });
        decrease.sort(function(a, b)  {
            return b.length - a.length;
          });
        forwardSort(decrease, "편의점");
        forwardSort(decrease, "지하철역");
        each1.innerHTML = decrease[0][0].category_group_name;
        each2.innerHTML = decrease[1][0].category_group_name;
        each3.innerHTML = decrease[2][0].category_group_name;
        each4.innerHTML = decrease[3][0].category_group_name;
        each5.innerHTML = decrease[4][0].category_group_name;

        // console.log(decrease);
    }
}

// 지도에 마커를 표시하는 함수입니다
function displayMarker(place) {
    // 마커 이미지의 이미지 주소
    var imageSrc = "./imgs/amenity_icon.png";
    // 마커 이미지의 이미지 크기
    var imageSize = new kakao.maps.Size(18, 26);
    // 마커 이미지를 생성
    var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
    // 마커를 생성하고 지도에 표시합니다
    var marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(place.y, place.x),
        title : place.place_name,
        image : markerImage
    });
    emarkers.push(marker);
}

function forwardSort(arr, name) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i][0].category_group_name === name) {
            var temp = arr[i];
            for (var j = 0; j < i; j++) {
                arr[i-j] = arr[i-j-1];
            }
            arr[0] = temp;
            return;
        }
    }
}

function removeMarkers() {
    for (var i = 0; i < emarkers.length; i++) {
        emarkers[i].setMap(null);
    } emarkers = [];
}

function clickMenu(each) {
    removeMarkers();

    for (var i = 0; i < decrease[each].length; i++) {
        displayMarker(decrease[each][i]);
    }
}

