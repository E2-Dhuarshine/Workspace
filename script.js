const todoForm = document.querySelector('.todo-form');
const todoInput = document.querySelector('.todo-input');
const todoItemsList = document.querySelector('.todo-items');
var modal = document.getElementById("myModal");
// array which stores every todos
let todos = [];

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
// add an eventListener on form, and listen for submit event
todoForm.addEventListener('submit', function(event) {
  // prevent the page from reloading when submitting the form
    event.preventDefault();
    addTodo(todoInput.value);// call addTodo function with input box current value
});

// function to add todo
function addTodo(item) {
     // if item is not empty
    if(item !== '') 
    {
        const todo = {
            // make a todo object, which has id, name, and completed properties
            id: Date.now(),
            name: item,
            completed: false
        };
        // then add it to todos array
        todos.push(todo);
        addToLocalStorage(todos);// then store it in localStorage
        todoInput.value = '';// finally clear the input box value
    }
    else{
        item =='';
       notify.innerHTML = "Alert! Your task is Empty,Please Enter Your Task";
        setTimeout(function () {
          notify.innerHTML = "";
        }, 2000);}
  
      
}
// function to render given todos to screen
function renderTodos(todos) {
    modal.style.display = "none";
     // clear everything inside <ul> with class=todo-items
    todoItemsList.innerHTML = '';
    console.log(todos)
    if (todos.length == 0) {
        todoItemsList.innerHTML = '<div class="card">No Task Found 😕</div>';
    }
    // run through each item inside todos
    todos.forEach(function(item) {
        if (item === null || item === undefined) return
         // check if the item is completed
        const checked = item.completed ? 'checked' : null;
        const li = document.createElement('li');
        // <li class="item"> </li>
        li.setAttribute('class', 'item');
         // <li class="item" data-key="20200708"> </li>
        li.setAttribute('data-key', item.id);
        li.setAttribute('id', item.id);
        // if item is completed, then add a class to <li> called 'checked', which will add line-through style
        if (item.completed === true) {
            li.classList.add('checked');
        }
        li.innerHTML = `
      <input type="checkbox" class="checkbox" ${checked}>
      
      ${item.name}
      <button onClick=\"deleteHandler(${item.id})\" class="delete-button">DELETE</button>
      <button class="edit" onclick=\"editbtnhandler(this)\" id="${item.id}">EDIT</button>
    `;
    // finally add the <li> to the <ul>
        todoItemsList.append(li);
    });

}


const closeModal = () => {
    console.log("close modal ");
    modal.style.display = "none";
}

const saveEdit = (id) => {
    console.log(id + " saved " + document.getElementById("modalInput").value)
    todoItem = todos.filter(function(item) {
        return item.id == id;
    });
    todoItem[0].name = document.getElementById("modalInput").value
    localStorage.setItem('todos', JSON.stringify(todos));
    getFromLocalStorage()
    modal.style.display = "none";
}
const editbtnhandler = (btnData) => {
    const id = btnData.id
    modal.style.display = "block";
    todoItem = todos.filter(function(item) {
        return item.id == btnData.id;
    });
    const alreadyName = todoItem[0].name
    modal.innerHTML = `
        <a>Edit your Task ✎</a>
        <input value="${alreadyName}" id="modalInput"/>
        <button class="btn" type="submit" onclick=\"saveEdit(${id})\" value="Ok">Update</button>
        <button class="btn" type="button" onclick=\"closeModal()\" name="cancel" value="Cancel">Cancel</button>
      `;

}

const deleteHandler = (id) => {
    modal.style.display = "block";
    todoItem = todos.filter(function(item) {
        return item.id == id;
    });
    const alreadyName = todoItem[0].name
    modal.innerHTML = `
   <p> Do you want to delete?🗑️ </p>
    <button class="btn1" type="submit" onclick=\"deleteTodo(${id})\" value="Ok">Yes</button>
    <button class="btn1" type="button" onclick=\"closeModal()\" name="cancel" value="Cancel">No</button>
  `;

}
// function to add todos to local storage
function addToLocalStorage(todos) {
    // conver the array to string then store it.
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos(todos);
}
// function helps to get everything from local storage
function getFromLocalStorage() {
    const reference = localStorage.getItem('todos');
    // if reference exists
    if (reference) {
         // converts back to array and store it in todos array
        todos = JSON.parse(reference);
        renderTodos(todos);
    }
}

// toggle the value to completed and not completed
function toggle(id) {
    todos.forEach(function(item) {
        // use ==, because here types are different. One is number and other is string
        if (item.id == id) {
            item.completed = !item.completed;
        }
    });

    addToLocalStorage(todos);
}
// deletes a todo from todos array, then updates localstorage and renders updated list to screen
function deleteTodo(id) {
    // filters out the <li> with the id and updates the todos array
    todos = todos.filter(function(item) {
        return item.id != id;
    });
    closeModal()
    
  // update the localStorage
    addToLocalStorage(todos);
}
// initially get everything from localStorage
getFromLocalStorage();

// after that addEventListener <ul> with class=todoItems. Because we need to listen for click event in all delete-button and checkbox
todoItemsList.addEventListener('click', function(event) {
    // check if the event is on checkbox
    if (event.target.type === 'checkbox') {
        // toggle the state
        toggle(event.target.parentElement.getAttribute('data-key'));
    }
});
