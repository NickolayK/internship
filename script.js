
       document.addEventListener("DOMContentLoaded", init);

       function CreateToDoItem( text  , date  , done = false){
           this.text = text;

           this.date = date

           Object.defineProperty(this, "done", {
               value: done,
               writable: true, 
               configurable: true ,
               enumerable : false
           });
       }

       var todoList = [ 
           new CreateToDoItem("someDescription" , "2019-05-02" , true ) , 
           new CreateToDoItem("anotherDescription" , "2019-03-02" , true ) , 
           new CreateToDoItem("lorem ipsum" , "2019-11-11"  ) , 

        ]

        var filteredDoList = null;


        

        function validate(form){

            var elements = form.elements;
            
            resetError(elements.date.parentNode);
            resetError(elements.text.parentNode);

            if(!elements.date.value){
                addError( elements.date.parentNode ,  'введите дату');
            }

            if(!elements.text.value){
                addError( elements.text.parentNode ,  'введите текст');
            }
            
            if(elements.text.value && elements.date.value){
                var todo =  new CreateToDoItem(elements.text.value , elements.date.value );

                todoList.push(todo);
                clearSearch()
                renderer(todoList);
            }
        };

        function resetError(container){
                container.className = '';
                if(container.lastChild.className == 'danger'){
                    container.removeChild(container.lastChild);
                }
                
        };

         function addError(container , text){
             var message  = document.createElement('span');
             message.innerHTML = text;
             message.className = 'danger';
             container.appendChild(message);
             container.className = 'error';
        }

        function init(){
            renderer(todoList);
        }

        function renderer(todoList){

            var container = document.getElementById('listContainer');

            container.innerHTML = `<tr>
                                        <th>Description</th>
                                        <th>Date</th>
                                        <th>Action buttons</th>
                                    </tr>`;

            todoList.forEach( function(elem , index ){

                var elemContainer = document.createElement('tr');
                var btnGroup = document.createElement('td');


                var deleteButton = document.createElement('button');
                var doneButton = document.createElement('button');

                if (elem.done === true){
                    elemContainer.classList = 'done';
                    doneButton.innerHTML = "-";
                }else{
                    doneButton.innerHTML = "+";
                }
                


                elemContainer.setAttribute("id", index);

                for ( let key in elem ){

                    var msgElem = document.createElement('td');
                    msgElem.innerHTML = elem[key];
                    elemContainer.appendChild(msgElem);

                }

                deleteButton.innerHTML = "X";
                deleteButton.addEventListener('click' , deleteToDo );

                doneButton.addEventListener('click' , markAsDone );

                btnGroup.appendChild(doneButton);
                btnGroup.appendChild(deleteButton);


                elemContainer.appendChild(btnGroup);
                container.appendChild(elemContainer);
            
            });

        }

        function sortByText(){
            var doList = filteredDoList ? filteredDoList : todoList;
             doList.sort( function (a , b ) {
                 var aText = a.text.toLowerCase();
                 var bText = b.text.toLowerCase();
                     if ( aText < bText) {
                         return -1 ;
                     }else if ( aText > bText){
                         return 1 
                     }else{
                         return 0;
                     }
             })
             renderer(doList);
        }
        function sortByDate(){
            var doList = filteredDoList ? filteredDoList : todoList;
            doList.sort( function (a , b ) {
                 var aDate = a.date.toLowerCase();
                 var bDate = b.date.toLowerCase();
                     if ( aDate < bDate) {
                         return -1 ;
                     }else if ( aDate > bDate){
                         return 1 
                     }else{
                         return 0;
                     }
             })
             renderer(doList);
        }

        function markAsDone(event){
            var doList = filteredDoList ? filteredDoList : todoList;
            var index =  +event.target.parentElement.parentElement.getAttribute('id');
            doList[index].done = !doList[index].done;
            if(doList[index].done){
                event.target.innerHTML = '-';
            }else{
                event.target.innerHTML = 'v';
            }
            renderer(doList);
        }

        function deleteToDo(event){
            var doList = filteredDoList ? filteredDoList : todoList;
            var index =  +event.target.parentElement.parentElement.getAttribute('id')
            doList.splice(index , 1);

            renderer(doList);
        }
        function clearSearch(){
            var input = document.getElementById('myInput');
            input.value = '';
            filteredDoList = null;
        }

        function find(event){
            var value = event.target.value.trim();

            filteredDoList = todoList.filter( (elem)=>{
                if( elem.text.indexOf(value) != -1  || elem.date.indexOf(value) != -1){
                    return true;
                }
            })

            renderer(filteredDoList);
        }