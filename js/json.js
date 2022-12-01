'use strick'
 

//object to json
//stringfy(obj)
let json = JSON.stringify(true);
json = JSON.stringify(['a' , 'b'])
console.log(json) 

const jjss = {
  a : 'a',
  b : 'b',
  c : 'c',
  d : () =>{console.log('123')}
}

json = JSON.stringify(jjss , (key , value) =>{
  console.log(value)
  return key
})
console.log(json)



//json to object
//parse(jaon)