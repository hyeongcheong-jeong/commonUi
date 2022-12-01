'use strick'
//배열 정리
//const array = new Array();
const array = ['a' , 'd' , 'e' , 'b' , 'c']
const array1 = [1 , 5 , 2 , 7 , 6]
const obj = {a : '1' , b: '2'}

//1. push 배열의 마지막 index에 element를 추가한다. callback으로 생성된 배열의 length 를 리턴한다, 
//const push = array.push('d' , 'e');
//console.log(push , array)

//2. pop 배열의 마지막 element를 삭제한다 callback으로 삭제한 element를 return 한다
// const pop = array.pop();
// console.log(pop)

// 3. unshift 배열의 첫번째 index에 element를 추가한다. callback으로 배열의 length 를 리턴한다
//const unshift = array.unshift('d' , 'e');
//console.log(unshift , array)

//4. shift 배열의 첫번째 index에 element 를 삭제한다. callback으로 삭제한 element를 return 한다.
//const shift = array.shift();
//console.log(shift , array)
//!!!!중요포인트 unshift , shift는 push , pop에 비해 속도가 아주 느리다. 자료구조적으로 뒤에서 추가 및 삭제시에는 데이터 이동이 일어나지 않지만 앞에서 추가 삭제시에는 데이터 이동이 일어나기 때문이다.

//5. reverse Reverses the elements in an array in place 배열의 element를 역순으로 재배치 후 return 한다
//const reverse = array.reverse();
//console.log(reverse , array)

//6. join 배열 element 구분자 사이에 string을 추가한다
//const join = array.join(',');
//console.log(`join = ${join}`)

//7.concat 복수개의 배열을 병합하여 새로운 배열로 return 한다
//const newArray = array.concat(array1);
//console.log(array.concat(array1) , array);

//8. slice 배열의 일부분을 복사해서 return 한다. start는 배열의 index이고 end에서는 end index를 제외한다
//const slice = array.slice(0 , -1);
//console.log(slice);

//9. sort 배열내에서 소팅한다. compareFn이 없는 경우 ASCII문자 오름차순으로 정렬된다. 첫번째 인수가 두번째 인수보다 작으면 음수 같으면 0 크면 양수를 반환한다
/*
const sort = array.sort(function(a,b){
  if(a > b) return -1;
  if(a === b) return 0;
  if(a < b) return 1;
  //return b - a
});
console.log(sort);
*/

//10. splice 배열의 특정 지점 부터 특정 개수를 삭제 할수 있다. 그리고 특정 지점에 새로운 element 를 추가할수도 있다. callback 으로 삭제한 element를 리턴한다. 
//const splice = array.splice(2 , 1 , ...array1);
//console.log(splice , array);

//11. every 배열의 모든 element가 지정된 테스트를 만족하는지 여부를 결정후 boolean 값을 return 한다. 모든 배열 원소가 조건을 만족할때 true를 return 한다. 인자는 value: T, index: number, array: T[]
//지정된 테스트는 별도의 function으로 분리해서 사용 가능하다.
//const everyFn = (ele) => {return ele < 10}
//const every = array1.every((element) => {return element < 10});
//console.log(every);
     
//12. some (every 와 반대) 지정된 콜백 함수가 배열의 모든 요소에 대해 true를 반환하는지 여부를 확인후 true값이 반환될때 정지된다.
//const someFn = (ele) => {return ele < 10}
//const some = array1.some((element) => {return element < 10});
//console.log(some);

//13. reduce 배열에 보든 요소에 지정된 콜백 함수를 호출한다. 콜백함수의 반환 값은 축적된 결과이며 다음 콜백 함수 호출 시 인수로 사용된다.
//previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U
const reduceFn = (ele) => {return ele < 10}
const reduce = array1.reduce((previousValue , currentValue , index , array) => {
  console.log(previousValue , currentValue , index)
  return previousValue + currentValue;
} , 0);
console.log(reduce);



// Q1. make a string out of an array
{
  const fruits = ['apple', 'banana', 'orange'];
  console.log('Q1 =' + fruits.toString() , fruits.join(''));

  const result = fruits.join();
  console.log(result )
}

// Q2. make an array out of a string
{
  const fruits = '🍎, 🥝, 🍌, 🍒';
  const result = fruits.split(',');
  console.log('Q2 =' + fruits.split(','));
  
}

// Q3. make this array look like this: [5, 4, 3, 2, 1]
{
  const array = [1, 2, 3, 4, 5];
  const result = array.reverse();
  console.log(array.reverse())
}

// Q4. make new array without the first two elements
{
  const array = [1, 2, 3, 4, 5];
  const result = array.slice(2 , 5)
  const filter = array.filter((value) => {
    return value > 2
  });
  console.log(filter , array.slice(2) , array)
}

class Student {
  constructor(name, age, enrolled, score) {
    this.name = name;
    this.age = age;
    this.enrolled = enrolled;
    this.score = score;
  }
}
const students = [
  new Student('A', 29, true, 45),
  new Student('B', 28, false, 80),
  new Student('C', 30, true, 90),
  new Student('D', 40, false, 66),
  new Student('E', 18, true, 88),
];

// Q5. find a student with the score 90
{
  const a = students.find(ele => ele.score === 90);
  const b = students.filter(ele => ele.score === 90);
  console.log(a , b)
}

// Q6. make an array of enrolled students
{
  const a = students.filter(ele => ele.enrolled === true);
  console.log(a)
}

// Q7. make an array containing only the students' scores
// result should be: [45, 80, 90, 66, 88]
{
  let a = [];
  students.forEach((value , index) => {
    return a[index] = value.score;
  });
  const b = students.map(ele => ele.score)
  console.log(a , b)
}

// Q8. check if there is a student with the score lower than 50
{
  const a = students.filter(ele => ele.score < 50);
  const result = students.some(student => student.score < 50)
  console.log(a , result)
}

// Q9. compute students' average score
{
  const a = students.reduce((previousValue , curentValue , index) => {
    sum = previousValue + curentValue.score;
    if(index === students.length - 1){
      sum = sum / students.length;
    }
    return sum
  } , 0);
  console.log(a)
}

// Q10. make a string containing all the scores
// result should be: '45, 80, 90, 66, 88'
{
  const a = students.map(element => element.score).toString();
  console.log(a)
}

// Bonus! do Q10 sorted in ascending order
// result should be: '45, 66, 80, 88, 90'
{
  const a = students.map(element => element.score).sort((a , b) => {return  a > b ? 1 : -1}).toString();
  console.log(a)
}
