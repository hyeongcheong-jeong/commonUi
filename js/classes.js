'use strick'

//캡슐화  
//es6에서 추가 calsses 클레스는 feilds + methods의 틀(template) 이다. 
//object 는 메모리에 올라가는 데이터(instance of a class)
class Vending{//커피머신
  constructor(){
    this.water = 10;
    this.powderA = 50;
      
  }
  //method
  putSelectButton(type , target){//버튼 선택
    this.water -= 1;
    if(this.water === 0){
    }
    console.log(type , target)
  }
}
//상속 , 다양성

class CoffeeGet extends Vending{
  
}
