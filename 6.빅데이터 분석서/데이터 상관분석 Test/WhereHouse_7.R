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
m <- min(total$conv_store / population_density$area);
max(total$conv_store / population_density$area);

min(total.result$conv_store);
max(total.result$conv_store);


total[which(min(total$conv_store / population_density$area)==total.result$conv_store)];

max(total$cafe);
min(total$cafe);

max(total$subway);
min(total$subway);

max(total$restaurant);
min(total$restaurant);

max(total$daiso);
min(total$daiso);

max(total$olive);
min(total$olive);

max(total$shop);
min(total$shop);

total$conv_store / population_density$area


setTotal <- function(){
  total.result <- total
  total.result$conv_store <- total$conv_store / population_density$area;
  for(i in 1:nrow(total)){
    #편의점
    total.result[i,"conv_store"] <- total.result[i,"conv_store"] * 3.519813 - 29;
    total.result[i,"conv_store"] <- total.result[i,"conv_store"] * 0.22;
    print(total.result[i,c("gu_name","conv_store")]);
    
    #카페
    total.result[i,"cafe"] <- total[i,"cafe"] * 0.070921 - 25.673402
    total.result[i,"cafe"] <- total.result[i,"cafe"] * 0.2;
    
    #지하철
    total.result[i,"subway"] <- total[i,"subway"] * 3.448275 - 13.7931
    total.result[i,"subway"] <- total.result[i,"subway"] * 0.18;
    
    #음식점
    total.result[i,"restaurant"] <- total[i,"restaurant"] * 0.009749 - 22.695672
    total.result[i,"restaurant"] <- total.result[i,"restaurant"] * 0.13;
    
    #다이소
    total.result[i,"daiso"] <- total[i,"daiso"] * 6.6666 - 6.6666
    total.result[i,"daiso"] <- total.result[i,"daiso"] * 0.1;
    
    #올리브영
    total.result[i,"olive"] <- total[i,"olive"] * 3.3333 - 3.3333
    total.result[i,"olive"] <- total.result[i,"olive"] * 0.09;
    
    #쇼핑몰
    total.result[i,"shop"] <- total[i,"shop"] * 2.325581 - 37.209296
    total.result[i,"shop"] <- total.result[i,"shop"] * 0.08;
    
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
                   + restaurant
                   + daiso
                   + olive
                   + shop
                   ,data = new.total.result);

summary(model.total);
#정확도
total.result
total.test <- total.result[,2:8];
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
