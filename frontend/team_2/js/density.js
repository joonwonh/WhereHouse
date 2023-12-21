var geocoder = new kakao.maps.services.Geocoder();

function getDensity(latlng, callback) {
    fetch('./json/density.json')
        .then(res => res.json())
        .then(data => {
            searchAddrFromCoords(latlng, getAddrDensity);

            // 좌표의 행정동 주소 정보 요청 함수
            function searchAddrFromCoords(coords, callback) {
            geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);         
            }
            
            function getAddrDensity(result) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].address === result[1].region_3depth_name) {
                        callback({population : data[i].population,
                                    density : data[i].density});
                    }
                }
            }
        })
    }

export {getDensity}