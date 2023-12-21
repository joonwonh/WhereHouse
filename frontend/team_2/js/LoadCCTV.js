// 정범진
var LoadDataCCTV = [];       // CCTV 데이터 저장

// .Json 파일 로드 및 저장.
fetch('./json/SeoulCCTV.json')
.then(res => res.json())                // .json() 메서드는 JSON 응답을 JavaScript 객체 리터럴로 구문분석합니다.
.then(data => {

    for(var i=0; i<data.length; i++){

       LoadDataCCTV[i] = data[i]; 
    }
});