library('tidyverse')
library(MASS)

#1인가구 MZ
setwd("C:/Users/admin/Desktop/R_Data/1인가구");
MZ_man <- read.csv("1인가구_남자.csv", header = T);
MZ_woman <- read.csv("1인가구_여자.csv", header = T);
MZ <- data.frame(ratio=rep(0,25));
notMZ <- data.frame(ratio=rep(0,25));

MZ
for(i in 1:nrow(MZ)){
  MZ[i,"ratio"] <- (MZ_man[i,"ratio"] + MZ_woman[i,"ratio"]) / 2;
  notMZ[i,"ratio"] <- 1-(MZ[i,"ratio"]);
}

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
                    , shop=shop$shop_cnt
                    , charter=rep(0,25)
                    , deposit=rep(0,25)
                    , monthly=rep(0,25)
                    , MZ=MZ$ratio);

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
setwd(paste("C:/Users/admin/Desktop/R_Data/전월세/","성북구",sep = ""));
monthly <- read.csv(paste("성북구","_월세.csv", sep = ""), header=T);
charter <- read.csv(paste("성북구","_전세.csv", sep = ""), header=T);

mean(charter[,5]);


#구 별 전월세 5~10평
for(i in 1:nrow(total)){
  setwd(paste("C:/Users/admin/Desktop/R_Data/전월세/",total[i,"gu_name"],sep = ""));
  monthly <- read.csv(paste(total[i,"gu_name"],"_월세.csv", sep = ""), header=T);
  charter <- read.csv(paste(total[i,"gu_name"],"_전세.csv", sep = ""), header=T);
  print(total[i,"gu_name"]);
  
  #전세 특이값 제거
  boxplot(charter[,5]);
  out.charter <- boxplot.stats(charter[,5])$out;
  total[i,"charter"] <- mean(charter[!charter[,5] %in% out.charter,5]); #전세금
  
  boxplot(monthly[,5])
  boxplot(monthly[,6])
  out.deposit <- boxplot.stats(monthly[,5])$out;
  out.monthly <- boxplot.stats(monthly[,6])$out;
  
  total[i,"deposit"] <- mean(monthly[!monthly[,5] %in% out.deposit, 5]); #보증금
  total[i,"monthly"] <- mean(monthly[!monthly[,6] %in% out.monthly, 6]); #월세
  
  print(total[i,c("charter","deposit","monthly")]);
  print(paste(total[i,"gu_name"],"끝"));
}


setTotal <- function(){
  total.result <- total
  total.result$conv_store <- total$conv_store / population_density$area;
  for(i in 1:nrow(total)){
    #편의점
    total.result[i,"conv_store"] <- total.result[i,"conv_store"] * 4 - 32;
    if(total.result[i,"conv_store"] > 100){
      total.result[i,"conv_store"] <- 100;
    }
    total.result[i,"conv_store"] <- total.result[i,"conv_store"] * 0.21;
    
    #음식점
    total.result[i,"restaurant"] <- total[i,"restaurant"] * 0.0125 - 12.5
    if(total.result[i,"restaurant"] > 100){
      total.result[i,"restaurant"] <- 100;
    }
    total.result[i,"restaurant"] <- total.result[i,"restaurant"] * 0.21;
    
    
    #카페
    total.result[i,"cafe"] <- total[i,"cafe"] * 0.1111 - 22.22
    if(total.result[i,"cafe"] > 100){
      total.result[i,"cafe"] <- 100;
    }
    total.result[i,"cafe"] <- total.result[i,"cafe"] * 0.18;
    
    #다이소
    total.result[i,"daiso"] <- total[i,"daiso"] * 6.6666 - 6.6666
    if(total.result[i,"daiso"] > 100){
      total.result[i,"daiso"] <- 100;
    }
    total.result[i,"daiso"] <- total.result[i,"daiso"] * 0.13;
    
    #지하철
    total.result[i,"subway"] <- total[i,"subway"] * 5 - 5
    if(total.result[i,"subway"] > 100){
      total.result[i,"subway"] <- 100;
    }
    total.result[i,"subway"] <- total.result[i,"subway"] * 0.1;
    
    
    #올리브영
    total.result[i,"olive"] <- total[i,"olive"] * 3.3333 - 3.3333
    if(total.result[i,"olive"] > 100){
      total.result[i,"olive"] <- 100;
    }
    total.result[i,"olive"] <- total.result[i,"olive"] * 0.09;
    
    #쇼핑몰
    total.result[i,"shop"] <- total[i,"shop"] * 2.2222 - 11.111
    if(total.result[i,"shop"] > 100){
      total.result[i,"shop"] <- 100;
    }
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
  return (total.result);
}

total.result <- setTotal();
total.result
cor(total.result$MZ, total.result$conv_store);
cor(total.result$MZ, total.result$cafe);
cor(total.result$MZ, total.result$subway);
cor(total.result$MZ, total.result$restaurant);
cor(total.result$MZ, total.result$daiso);
cor(total.result$MZ, total.result$olive);
cor(total.result$MZ, total.result$shop);
cor(total.result$MZ, total.result$charter);
cor(total.result$MZ, total.result$deposit);
cor(total.result$MZ, total.result$monthly);
cor(total.result$MZ, total.result$score);
cor(total.result$notMZ, total.result$score);


total$notMZ <- notMZ;
total

total.result
plot(total$cafe, total$conv_store);
pairs(total.result[,2:5]);
help(pairs)
total.result$index <- as.integer(total.result$index);

cor(total.result[,c("cafe","restaurant")]);

#library(ggplot2)

ggplot(total.result, aes(x=gu_name, y=cafe)) +
  geom_bar(stat="identity",
           width=0.7,
           fill="steelblue");

ggplot(total.result, aes(x=gu_name, y=score)) +
  geom_bar(stat="identity",
           width=0.7,
           fill="steelblue");



total.result$index <- as.integer(total.result$index);
total.result$index

str(total.result)


mzModel <- lm(MZ~conv_store
              + cafe
              + subway
              + daiso
              + olive
              + shop
              + monthly
              , data = total.result);

summary(mzModel)
step.mzModel <- stepAIC(mzModel);
summary(step.mzModel);

total.result
pairs(total.result[,2:14]);


#로지스틱
new.total.result <- total.result;
new.total.result$index <- as.integer(total.result$index);

model.total <- glm(index~conv_store 
                   + cafe 
                   + subway
                   + restaurant
                   + daiso
                   + olive
                   + shop
                   + score
                   ,data = new.total.result);

summary(model.total);
#정확도
total.test <- total.result;
pred <- predict(model.total, total.test);
pred <- round(pred, 0);
pred
total.result$index
answer <- as.integer(total.result$index);
pred == answer;
acc <- mean(pred == answer);
acc

stepGlm <- stepAIC(model.total);
summary(stepGlm);

#정확도
total.result
total.test <- total.result;
pred <- predict(stepGlm, total.test);
pred <- round(pred, 0);
pred
total.result$index
answer <- as.integer(total.result$index);
pred == answer;
acc <- mean(pred == answer);
acc

cor(total[,2:12]);
total

ggplot(total.result, aes(x=monthly, y=MZ)) +
  geom_bar(stat="identity",
           width=0.3,
           fill="steelblue");

ggplot(total.result, aes(x=gu_name, y=monthly)) +
  geom_bar(stat="identity",
           width=0.7,
           fill="steelblue");

