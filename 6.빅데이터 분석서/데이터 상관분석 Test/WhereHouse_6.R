library('tidyverse')
library(MASS)

#인구밀집도 데이터 구 별
setwd("C:/Users/admin/Desktop/R_Data/인구밀집도");
population_density <- read.csv("인구밀집도.csv", header = T);

#지하철
setwd("C:/Users/admin/Desktop/R_Data/지하철");
subway <- read.csv("지하철.csv", header = T);

#음식점
setwd("C:/Users/admin/Desktop/R_Data/지하철");
subway <- read.csv("지하철.csv", header = T);

#올리브영
setwd("C:/Users/admin/Desktop/R_Data/올리브영");
olive <- read.csv("올리브영.csv", header=T);

#다이소
setwd("C:/Users/admin/Desktop/R_Data/다이소");
daiso <- read.csv("다이소.csv", header=T);

#대규모점포
setwd("C:/Users/admin/Desktop/R_Data/대규모점포");
shop <- read.csv("대규모점포.csv", header=T);

total <- data.frame(gu_name=subway$gu_name
                    , conv_store=rep(0,25)
                    , cafe=rep(0,25)
                    , subway=subway$subway_cnt
                    , restaurant=rep(0,25)
                    , daiso=daiso$daiso_cnt
                    , olive=olive$olive_cnt
                    , shop=shop$shop_cnt);

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


setTotal <- function(){
  total.result <- total
  total.result$conv_store <- total$conv_store / population_density$area;
  total$cafe
  for(i in 1:nrow(total)){
    #편의점
    total.result[i,"conv_store"] <- total.result[i,"conv_store"] * 6.25 - 50;
    if(total.result[i,"conv_store"] > 100){
      total.result[i,"conv_store"] <- 100;
    }
    total.result[i,"conv_store"] <- total.result[i,"conv_store"] * 0.16;
    
    #카페
    total.result[i,"cafe"] <- total[i,"cafe"] * 0.1111 - 22.22
    print(total.result[i,"cafe"]);
    if(total.result[i,"cafe"] > 100){
      total.result[i,"cafe"] <- 100;
    }
    total.result[i,"cafe"] <- total.result[i,"cafe"] * 0.14;
    
    #지하철
    total.result[i,"subway"] <- total[i,"subway"] * 5 - 5
    if(total.result[i,"subway"] > 100){
      total.result[i,"subway"] <- 100;
    }
    total.result[i,"subway"] <- total.result[i,"subway"] * 0.13;
    
    #음식점
    total.result[i,"restaurant"] <- total[i,"restaurant"] * 0.008333 - 33.332
    if(total.result[i,"restaurant"] > 100){
      total.result[i,"restaurant"] <- 100;
    }
    total.result[i,"restaurant"] <- total.result[i,"restaurant"] * 0.12;
    
    #다이소
    total.result[i,"daiso"] <- total[i,"daiso"] * 6.6666 - 6.6666
    if(total.result[i,"daiso"] > 100){
      total.result[i,"daiso"] <- 100;
    }
    total.result[i,"daiso"] <- total.result[i,"daiso"] * 0.11;
    
    #올리브영
    total.result[i,"olive"] <- total[i,"olive"] * 3.3333 - 3.3333
    if(total.result[i,"olive"] > 100){
      total.result[i,"olive"] <- 100;
    }
    total.result[i,"olive"] <- total.result[i,"olive"] * 0.1;
    
    #쇼핑몰
    total.result[i,"shop"] <- total[i,"shop"] * 2.2222 - 11.111
    if(total.result[i,"shop"] > 100){
      total.result[i,"shop"] <- 100;
    }
    total.result[i,"shop"] <- total.result[i,"shop"] * 0.09;
    
    #총합점수
    total.result[i,"score"] <- (total.result[i,"conv_store"]
                                + total.result[i,"cafe"]
                                + total.result[i,"subway"]
                                + total.result[i,"restaurant"]
                                + total.result[i,"daiso"]
                                + total.result[i,"olive"]
                                + total.result[i,"shop"]);
  }
  total.order <- order(total.result$score);
  total.order
  
  for(i in 1:nrow(total.result)){
    idx <- total.order[i];
    if(i == 1){
      total.result[idx,"index"] <- 0;
    } else if(i == 2){
      total.result[idx,"index"] <- 1;
    } else if(i <= 4){
      total.result[idx,"index"] <- 2;
    } else if(i <= 7){
      total.result[idx,"index"] <- 3;
    } else if(i <= 12){
      total.result[idx,"index"] <- 4;
    } else if(i <= 18){
      total.result[idx,"index"] <- 5;
    } else if(i <= 21){
      total.result[idx,"index"] <- 6;
    } else if(i <= 23){
      total.result[idx,"index"] <- 7;
    } else if(i == 24) {
      total.result[idx,"index"] <- 8;
    } else {
      total.result[idx,"index"] <- 9;
    }
  }
  total.result$index <- factor(total.result$index);
  total.result
  return (total.result);
}

total.result <- setTotal();
total.result

#library(ggplot2)

ggplot(total.result, aes(x=gu_name, y=cafe)) +
  geom_bar(stat="identity",
           width=0.7,
           fill="steelblue");

ggplot(total.result, aes(x=gu_name, y=score)) +
  geom_bar(stat="identity",
           width=0.7,
           fill="steelblue");


total.result$index

str(total.result)

new.total.result <- total.result;
new.total.result$index <- as.integer(total.result$index);
total.result$index
model.total <- glm(index~conv_store 
                   + cafe 
                   + subway
                   + olive
                   + restaurant
                   + shop
                   ,data = new.total.result);

summary(model.total);
#정확도
total.result
total.test <- total.result[,c(2,3,4,5,7,8)];
pred <- predict(model.total, total.test);
pred <- round(pred, 0);
pred
total.result$index
answer <- as.integer(total.result$index);
pred == answer;
acc <- mean(pred == answer);
acc



step.model <- stepAIC(model.total);
summary(step.model);
total.result
cor(total.result[,2:8]);
pairs(total.result[,c(2:8,10)]);
summary(model.total)
total.step <- stepAIC(model.total);
summary(total.step);
anova(model.total)
total.result[,2:8]
total.test <- total.result[,c(2,3,4,5,7,8)];

#정확도
pred <- predict(total.step, total.test);
pred <- round(pred, 0);
pred
total.result$index
answer <- as.integer(total.result$index);
pred == answer;
acc <- mean(pred == answer);
acc
