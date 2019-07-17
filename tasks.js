// "Добавить такое поведение массиву:

// const a = [1,2,3,4,5];
// a.duplicate();             //1,2,3,4,5,1,2,3,4,5"

const a = [1,2,3,4,5]; 
Array.prototype.duplicate = function(){
   return this.concat(this);
}

// "Функция, которая возвращает новый массив из общих элементов двух массивов

// const a = [1,2,3,4,5];
// const b = [1,3,6,3,1,4,7];

// fn(a,b)  //[1,3,4]"

const a = [1,2,3,4,5];
const b = [1,3,6,3,1,4,7];
function commonElements( arr1 , arr2){
    result = [] ;

    arr1.forEach( elem =>{
        if(arr2.indexOf(elem) != -1){
        
            result.push(elem)
        
           }
                
    });
    return result;
}

// "Функция сложения двух чисел:

// sum(1)(2) //3"

function sum(value){
	
	return function(secondValue){
			return value + secondValue;
    }

}

// Полифилл Object.create
if (!Object.create) {
    Object.create = function(o) {
      function F() {}
      F.prototype = o;
      return new F();
    };
  }
//   Полифилл bind


     function bind (context , func ){

       var sevedArgs =  [].slice.call(arguments, 2) ;

        return function(){
            var funcArgs = [].slice.call(arguments);
            
            func.apply(context , sevedArgs.concat(funcArgs));
        }
            
    }

//     "const arr = [1, 2, 3, 4, 5];
// arr.forEach(cb(10)); // 11 12 13 14"

function increaseInArray (num , arr){

    arr.forEach( (elem , index , array )=>{
            array[index] = elem + num;
    })
    return arr;
}

    // "function add(a, b) {
    //     return a + b;
    // }
    
    // function mul(a, b) {
    //     return a * b;
    // }
    
    // console.log(myFunc(add)(1)(2));  //3
    // console.log(myFunc(mul)(3)(2));  //6
    
    // Написать функцию myFunc, которая будет работать так"

    
    function myFunc( func) {
	
        var args = [] ;
    
        function addArg(x){
            args.push(x);
            if(args.length == 2 ) {
                return	func.apply(null,args);
            }
            return addArg
            
        }      
        return addArg
    }

//     "add(1,2)  //3
// add(2)(4) //6

// Функция, которая будет работать так"

function add(value){
	
	var args = [].slice.call(arguments);

	function addArgs(x){

		args.push(x);
		return addArgs
    }

	addArgs.toString = function(){

        return args.reduce( (current , next) => current + next );
        
    }

	if(args.length > 1){
        return args.reduce( (current , next) => current + next );
    }
	
	return addArgs
}

// "Функция, которая будет переворачивать число

//   reverseInt(15) === 51
//   reverseInt(981) === 189
//   reverseInt(500) === 5
//   reverseInt(-15) === -51
//   reverseInt(-90) === -9"

function reverseInt(value){
    var numToString = value + '';
    var splitedArray = numToString.split('');

    splitedArray.reverse();

    var isNegative = splitedArray.indexOf('-');

    if( isNegative != -1 ){
        splitedArray.splice(isNegative , 1);
        splitedArray.unshift('-')
    }
    
    var reversedInt = +splitedArray.join('');
    return reversedInt;
}

// "Вывести самую частую букву

// // maxChar(""abcccccccd"") === ""c""
// // maxChar(""apple 1231111"") === ""1"""

function maxChar(str){

    var cache = {};

	var strToArr = str.split('');

	strToArr.forEach( (char)=>{
		
		if(!cache[char]){

			cache[char] = 1;

        }else{
			cache[char] = ++cache[char]
        }
    })

    var  max = 0 ;
    var keyLetter ;

    for( let key in cache){
        if(max < cache[key]){
            max = cache[key];
            keyLetter = key
    
        }
    }
    return keyLetter;
    
}