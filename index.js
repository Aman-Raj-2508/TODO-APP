console.log("WElcome to my todo app");

let todos = [];//for storing todos

let todoDataList = document.getElementById("todo-data-list");
let saveButton = document.getElementById("save-todo");
let todoInputBar = document.getElementById("todo-input-bar");
let getPendingTodosButton = document.getElementById("get-todos");


//Pending todos function
getPendingTodosButton.addEventListener("click", () => {
    todos = todos.filter((todo) => todo.status != "Finished");

    todoDataList.innerHTML = '';
    todos.forEach((element, idx) => {
        addTodo(element, idx + 1);
    })
})

// Input function
todoInputBar.addEventListener("keyup", function toggleSaveButton() {
    let todotext = todoInputBar.value;
    if (todotext.length == 0) {
        if (saveButton.classList.contains("disabled")) return;
        saveButton.classList.add("disabled");
    }
    else if (saveButton.classList.contains("disabled")) {
        saveButton.classList.remove("disabled");
    }
})

// SaveButton function
saveButton.addEventListener("click", function getTextAndAddTodo() {
    let todotext = todoInputBar.value;//gets the input that one write in input bar
    if (todotext.length == 0) return;
    let todo = { text: todotext, status: 'In progress', finishedButtontext: "Finished" } //object thay stores tototext and status
    todos.push(todo);
    addTodo(todo, todos.length);
    todoInputBar.value = '';
})

// Delete Todo function
function removeTodo(event) {
    // console.log("clicked", event.target.parentElement.parentElement.parentElement);//event.target refers to the button eleemnt directly and with the help of.parentElement we got access to parents
    // event.target.parentElement.parentElement.parentElement.remove();//with the help of remove we remove the last parent element that is row so whole todo is removed
    let deleteButtonPressed = event.target;
    let indexTobeRemoved = Number(deleteButtonPressed.getAttribute("todo-idx"));
    todos.splice(indexTobeRemoved, 1);

    //rerender function
    todoDataList.innerHTML = '';
    todos.forEach((element, idx) => {
        addTodo(element, idx + 1);
    })
}

// Finish Todo function
function finishTodo(event) {
    let finishButtonPressed = event.target;
    let indexTobeFinished = Number(finishButtonPressed.getAttribute("todo-idx"));

    if (todos[indexTobeFinished].status == "Finished") {
        todos[indexTobeFinished].status = "In progress"
        todos[indexTobeFinished].finishedButtontext = "Finished"
    } else {
        todos[indexTobeFinished].status = "Finished";
        todos[indexTobeFinished].finishedButtontext = "Undo"
    }

    //sorting the todos based on status 
    todos.sort((a, b) => {
        if (a.status == 'Finished') {
            return 1;//b is placed before a 
        }
        return -1;//b is placed after a
    })

    //redering the total html after storing the todos in array
    todoDataList.innerHTML = '';
    todos.forEach((element, idx) => {
        addTodo(element, idx + 1);
    })
}

//Edit Todo
function editTodo(event) {
    let editButtonPressed = event.target;
    let indexToEdit = Number(editButtonPressed.getAttribute("todo-idx"));
    let detailDiv = document.querySelector(`div[todo-idx="${indexToEdit}"]`);
    let input = document.querySelector(`input[todo-idx="${indexToEdit}"]`);
    detailDiv.style.display = "none";
    input.type = "text";
    input.value = detailDiv.textContent;
}

//Save Editted Todo
function saveEditedTodo(event) {
    let input = event.target;
    let indexToEdit = Number(input.getAttribute("todo-idx"));
    let detailDiv = document.querySelector(`div[todo-idx="${indexToEdit}"]`);
    if (event.keyCode == 13) {
        detailDiv.textContent = input.value;
        detailDiv.style.display = "block"
        input.value = '';
        input.type = 'hidden';
    }
}

function addTodo(todo, todoCount) {
    let rowDiv = document.createElement("div");
    let todoItem = document.createElement("div");
    let todoNumber = document.createElement("div");
    let todoDetail = document.createElement("div");
    let todoStatus = document.createElement("div");
    let todoActions = document.createElement("div");
    let deleteButton = document.createElement("button");
    let finishedButton = document.createElement("button");
    let editButton = document.createElement("button");
    let hiddenInput = document.createElement("input");
    let hr = document.createElement("hr");

    //adding classes  
    rowDiv.classList.add("row")
    todoItem.classList.add("todo-item", "d-flex", "flex-row", "justify-content-between", "align-items-center");
    todoNumber.classList.add("todo-no");
    todoDetail.classList.add("todo-detail", "text-muted");
    todoStatus.classList.add("todo-status", "text-muted");
    todoActions.classList.add("todo-actions", "d-flex", "justify-content-start", "gap-2");
    deleteButton.classList.add("btn", "btn-danger", "delete-todo");
    finishedButton.classList.add("btn", "btn-success", "finished-todo");
    editButton.classList.add("btn", "btn-warning", "edit-todo");
    hiddenInput.classList.add("form-control", "todo-detail");

    //invoking some events and functions
    deleteButton.onclick = removeTodo;//since the delete button was inside the function that's why
    deleteButton.setAttribute("todo-idx", todoCount - 1);

    finishedButton.onclick = finishTodo;//calls the finish todo function
    finishedButton.setAttribute("todo-idx", todoCount - 1);

    editButton.onclick = editTodo;//calls the dit function
    editButton.setAttribute("todo-idx", todoCount - 1);

    todoDetail.setAttribute("todo-idx", todoCount - 1);

    hiddenInput.setAttribute("todo-idx", todoCount - 1);
    hiddenInput.type = "hidden";
    hiddenInput.addEventListener("keypress", saveEditedTodo);

    //Adding the text based information
    todoNumber.textContent = `${todoCount}.`;
    todoDetail.textContent = todo.text;//sets the todoobject into text sent from the input element
    todoStatus.textContent = todo.status;
    deleteButton.textContent = "Delete";
    finishedButton.textContent = todo.finishedButtontext;
    editButton.textContent = "Edit";

    //Appending the children
    todoActions.appendChild(deleteButton);
    todoActions.appendChild(finishedButton);
    todoActions.appendChild(editButton);
    todoItem.appendChild(todoNumber);
    todoItem.appendChild(todoDetail);
    todoItem.appendChild(hiddenInput);
    todoItem.appendChild(todoStatus);
    todoItem.appendChild(todoActions);
    rowDiv.appendChild(todoItem);
    todoDataList.appendChild(rowDiv);
}
