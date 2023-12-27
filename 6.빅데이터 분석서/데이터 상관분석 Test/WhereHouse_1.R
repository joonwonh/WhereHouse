library('tidyverse')
library(MASS)

#공연장 데이터 구 별
setwd("C:/Users/admin/Desktop/R_Data/공연장");
concertHall <- read.csv("공연장.csv", header = T);

#문화시설 데이터 구 별
setwd("C:/Users/admin/Desktop/R_Data/문화시설");
cultureCenter <- read.csv("문화시설.csv", header=T);

#생활만족도 데이터 구 별
setwd("C:/Users/admin/Desktop/R_Data/생활만족도");
housing_satisfaction <- read.csv("주거만족도.csv", header = T);
life_satisfaction <- read.csv("생활만족도2.csv", header = T);
life_satisfaction


#인구밀집도 데이터 구 별
setwd("C:/Users/admin/Desktop/R_Data/인구밀집도");
population_density <- read.csv("인구밀집도.csv", header = T);

#전시시설 데이터 구 별
setwd("C:/Users/admin/Desktop/R_Data/전시시설");
exhibition <- read.csv("전시시설.csv", header = T);
exhibition

#지하철 구 별
setwd("C:/Users/admin/Desktop/R_Data/지하철");
subway <- read.csv("지하철.csv", header = T);
subway

#전세
setwd("C:/Users/admin/Desktop/R_Data/전월세");
charter <- read.csv("전세평당가.csv", header = T);

#월세
setwd("C:/Users/admin/Desktop/R_Data/전월세");
monthly <- read.csv("월세평당가.csv", header = T);

#1인가구 남자
setwd("C:/Users/admin/Desktop/R_Data/1인가구");
man_population <- read.csv("1인가구_남자.csv", header=T);

#1인가구 여자
setwd("C:/Users/admin/Desktop/R_Data/1인가구");
woman_population <- read.csv("1인가구_여자.csv", header=T);

#병원
setwd("C:/Users/admin/Desktop/R_Data/병원");
hospital <- read.csv("병원.csv", header=T);
hospital
#공원
setwd("C:/Users/admin/Desktop/R_Data/공원");
park <- read.csv("공원.csv", header=T);

#올리브영
setwd("C:/Users/admin/Desktop/R_Data/올리브영");
olive <- read.csv("올리브영.csv", header=T);
olive

#다이소
setwd("C:/Users/admin/Desktop/R_Data/다이소");
daiso <- read.csv("다이소.csv", header=T);

#대규모점포
setwd("C:/Users/admin/Desktop/R_Data/대규모점포");
shop <- read.csv("대규모점포.csv", header=T);

#영화관 데이터
setwd("C:/Users/admin/Desktop/R_Data/영화관");
cinema <- read.csv("영화관.csv", header=T);
cinema

setwd("C:/Users/admin/Desktop/R_Data/문화만족도");
culture_satisfaction <- read.csv("문화만족도.csv", header=T);

total <- data.frame(gu_name=concertHall$gu_name
                    , concertHall=concertHall$concertHall_cnt
                    , museum=exhibition$museum
                    , art_gallery=exhibition$art_gallery
                    , housing_satisfaction=housing_satisfaction$주거환경 #주거 만족도
                    , life_satisfaction.total=life_satisfaction$total_score #생활 만족도
                    , life_satisfaction.housing=life_satisfaction$housing_score
                    , culture_satisfaction=culture_satisfaction$culture_satisfaction
                    , population=population_density$population_density # 인구밀집도
                    , subway=subway$subway_cnt #지하철 개수
                    , MZ_population=(man_population$MZ_man_population + woman_population$MZ_woman_population)
                    , charter=charter$area_per_charter
                    , deposit=monthly$area_per_deposit
                    , monthly=monthly$area_per_monthly
                    , hospital=rep(0,25)
                    , park=rep(0,25)
                    , conv_store=rep(0,25)
                    , cafe=rep(0,25)
                    , cinema=rep(0,25)
                    , restaurant=rep(0,25)
                    , daiso=daiso$daiso_cnt
                    , olive=olive$olive_cnt
                    , shop=shop$shop_cnt
                    , etc_conv=rep(0,25));

total
#영화관
for(i in 1:nrow(cinema)){
  for(j in 1:nrow(total)){
    if(str_detect(cinema[i,"도로명주소"],total[j,"gu_name"])){
      total[j,"cinema"] <- total[j,"cinema"] + 1;
    }
  }
}

#편의시설
for(i in 1:nrow(total)){
  setwd(paste("C:/Users/admin/Desktop/R_Data/편의시설/",total[i,"gu_name"],sep = ""));
  conv_store <- read.csv(paste(total[i,"gu_name"],"_편의시설.csv", sep = ""), header=T);
  print(i);
  for(j in 1:nrow(conv_store)){
    if(conv_store[j,"code"] == "G47122"){
      total[i,"conv_store"] <- total[i,"conv_store"] + 1;
    } else if(conv_store[j,"code"] == "I56221"){
      total[i,"cafe"] <- total[i,"cafe"] + 1;
    } else{
      total[i, "etc_conv"] <- total[i,"etc_conv"] + 1;
    }
  }
}

#음식점
setwd("C:/Users/admin/Desktop/R_Data/음식점");
restaurant <- read.csv("음식점.csv", header=T);
for(i in 1:nrow(restaurant)){
  if(i%%10000 == 0){
    print(i);
  }
  for(j in 1:nrow(total)){
    if(str_detect(restaurant[i,"지번주소"],total[j,"gu_name"])){
      total[j,"restaurant"] <- total[j,"restaurant"] + 1;
    }
  }
}

#병원
hospital
for(i in 1:nrow(hospital)){
  for(j in 1:nrow(total)){
    if(str_detect(hospital[i,"도로명주소"],total[j,"gu_name"])){
      total[j,"hospital"] <- total[j,"hospital"] + 1;
    }
  }
}

#공원
for(i in 1:nrow(park)){
  for(j in 1:nrow(total)){
    if(total[j,"gu_name"]==park[i,"지역"]){
      total[j,"park"] <- total[j,"park"] + 1;
    }
  }
}

head(total);


