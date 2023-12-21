// ##이재서
import { getDensity } from "./density.js";

var total = document.querySelector("#total"),
    safty = document.querySelector("#safty"),
    conv = document.querySelector("#conv"),
    infoDiv = document.querySelector('#infoDiv'),
    checkBtn = document.querySelector('#check_btn'),
    selected = document.querySelector('#preference');


checkBtn.addEventListener('click',totalScore);
selected.addEventListener('change',totalScore);


document.querySelectorAll('.graphBar').forEach(function(e) {
    e.addEventListener('mouseover', function(e) {
        infoDiv.style.display = 'flex';
        infoDiv.style.left = e.pageX+8 + 'px';
        infoDiv.style.top = e.pageY+12 + 'px';
})})
document.querySelectorAll('.graphBar').forEach(function(e) {
    e.addEventListener('mouseout',function() {
        infoDiv.style.display = 'none';
})})
document.querySelectorAll('.graphBar').forEach(function(e) {
    e.addEventListener('mousemove',function(e) {
        infoDiv.style.left = e.pageX+8 + 'px';
        infoDiv.style.top = e.pageY+12 + 'px';
})})
//각 그래프마다 다른 설명 입력
total.addEventListener('mouseover', function() {
    document.querySelector('#infoDivDetail').innerHTML = iconChange(total);
    document.querySelector('#infoDivScore').innerHTML = Math.round(parseFloat(total.style.width)) + "점"
})
safty.addEventListener('mouseover', function() {
    document.querySelector('#infoDivDetail').innerHTML = iconChange(safty);
    document.querySelector('#infoDivScore').innerHTML = Math.round(parseFloat(safty.style.width)) + "점"
})
conv.addEventListener('mouseover', function() {
    document.querySelector('#infoDivDetail').innerHTML = iconChange(conv);
    document.querySelector('#infoDivScore').innerHTML = Math.round(parseFloat(conv.style.width)) + "점"
})

function colorChange(e, value) {
    e.style.width = value + "%";

    if (Math.round(parseFloat(e.style.width)) < 30) {
        e.style.backgroundColor = '#1c498d';
    } else if (Math.round(parseFloat(e.style.width)) >= 70) {
        e.style.backgroundColor = '#6da7ff';
    } else {
        e.style.backgroundColor = '#4082e6';
    }
}

function iconChange(e) {
    if (Math.round(parseFloat(e.style.width)) < 30) {
        return '<i class="fa-solid fa-face-angry fa-2xl"></i>';
    } else if (Math.round(parseFloat(e.style.width)) >= 70) {
        return '<i class="fa-solid fa-face-laugh-beam fa-2xl"></i>';
    } else {
        return '<i class="fa-solid fa-face-smile fa-2xl"></i>';
    }
}

function totalScore() {
    var sfScore = parseFloat(safty.style.width),
        cvScore = parseFloat(conv.style.width),
        value;
    if (selected.value === 'none') {
        value = (sfScore + cvScore)/2;
    } else if (selected.value === 'safty') {
        value = (sfScore*1.3 + cvScore*0.7)/2;
    } else {
        value = (cvScore*1.3 + sfScore*0.7)/2;
    }
    
    if (checkBtn.checked) {
        getDensity(circle.getPosition(), async function(callback) {
            value = await value * (Math.min((callback.density/50),1)*0.1 + 1)
            total.style.width = value + "%";
            colorChange(total, value);
        });
    } else {
        total.style.width = value + "%";
        colorChange(total, value);
    }

    // console.log(value);
    // console.log(selected.value)
}

async function saftyScore(dist, cctvPcs, poCount, population, density) {
    // R에서 만든 내가 원하는 그림의 "거리에 따른 점수 산출 수식"
    var distance;
    if (dist < 1000) {distance = (1 / Math.log(dist + 150))/0.2;}
    else if (dist < 1743 && dist >= 1000) {distance = (1 / Math.log(dist - 850))/0.5;}
    else {distance = (1 / Math.log(dist - 1700));}
    // cctv가 200대 이상 일 경우 만점
    var cctvScore = Math.min(cctvPcs/200, 1);
    // R 데이터 분석을 통한 검거율 상관분석 회귀식
    var arrest_rate = 0.8104 - 3374*Math.pow(10,-7)*population + 0.006977*poCount - 6682*Math.pow(10,-6)*density;

    // 각각의 가중치
    // 거리 d, cctv수 c, 검거율 r
    var weight = { d : 60,
                    c : 30,
                    r : 10 };

    // 파출소의 거리와 반경 안 cctv대수, 검거율에 가중치를 부여해 안전성 점수 산출
    var value = distance*weight.d + cctvScore*weight.c + arrest_rate*weight.r;
    colorChange(safty, value);
    
    totalScore();
    console.log("{ " + "\"거리\"\t:\t" + distance + ",\n  \"CCVT수\"\t:\t" + cctvScore + ",\n  \"검거율\"\t:\t" + arrest_rate + " }");
}

function convScore(amenity, density) {
    var value = amenity - Math.min((density/0.5),100)*0.1;
    colorChange(conv, value);
}

export {saftyScore, convScore}