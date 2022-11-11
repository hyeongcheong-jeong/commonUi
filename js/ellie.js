'use strick'

//2. variable(변수)
// let(added in ES6) mutable

{
  let name = 'jhc';
  name = 'king';
}
// constants immutable (보안성 , 분산 접근성 )
const dayInWeek = 7;


//합산 quiz

function calculate(command , a , b){
  switch(command){
    case 'add' : return a + b;
    case 'substract' : return a-b;
    case 'divide' : return a/b;
    case 'multiply' : return a*b;
    case 'remainder' : return a%b;
    default : throw Error(`command 값은 add , substract , divide , multiply , remainder 만 사용 가능합니다.`)
  }
}

//object , class 비교 및 정의
//class 연관있는 필드 메서드 묶음 , fields , methods 
//template

class Person {
  //
  publicField = 2;
  #privateField = 1;

  
  //constructor
  constructor(name , weight){
    //feilds
    this.name = name;
    this.weight = weight;
  }
  //getter , setter
  get weight(){
    return this._weight;
  }
  set weight(value){
    this._weight = value < 0 ? 0 : value;
  }
  //methods
  speak(){
    //console.log(`Hello ${this.name}`);
  }

  //static
  static tell(){
    //console.log('스테틱 메소드')
  }
  static name1 = '정형철'
}

const ellie = new Person('ellie' , -70);
//console.log(ellie.name1 , ellie.name , ellie.weight)
ellie.speak();


//클래스 상속 및 다양성

class Shape{
   constructor(width , height , color){
    this.height = height;
    this.width = width;
    this.color = color;
  }

  draw(){
    //console.log(`넓이는 ${this.width} 높이는 ${this.height} 컬러는 ${this.color}`)
  }

  getArea(){
    return this.width * this.height;
  }
}
class Rectangle extends Shape{
  draw(){//상속받은 method 를 제사용시에는 덮어쓰기가 된다
    super.draw(); // 부모 method 를 실행하고 싶을때는 super를 이용해서 호출하면 된다
  }
}
const rectangle = new Rectangle(20 , 50 , 'red');
const shape = new Shape(20 , 50 , 'red');
rectangle.draw();

//console.log(rectangle instanceof Rectangle)


//object 정의
const obj1 = {} // 'object literal'
const obj2 = new Object(); // object constructor 
//object key , value 
const jhc = {name : 'jung' , age : 9}
function printValue(obj , key){
  //console.log(obj.key);
  //console.log(obj[key]);
}
printValue(jhc , 'name');
function makePerson(name , age){
  return {
    name : name,//key 와 value 값이 같으면 생략가능
    age : age,
  }
}
//순수하게 object를 생성하는 함수는 첫글자 대문자 표시, constructor Function
//object 안에 key 확인 , key(string) in object
function Person1(name , age){
  this.name = name
  this.age = age
}
const person1 = makePerson('jhc' , 12);
const person2 = new Person1('jhc' , 123);

//console.log(person1 , person2);

//for .... in => object에 key , for ... of => 배열
for(key in ellie){
}

//combine to array => concat  