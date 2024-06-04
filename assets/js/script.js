// Retrieve tasks and nextId from localStorage
// If tasks or nextId do not exist in localStorage, set them to default empty array and 1
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Todo: create a function to generate a unique task id
function generateTaskId() {
    let id = nextId;
    //increment ID and save it to localStorage
    nextId++;
    localStorage.setItem("nextId", nextId);
    return id;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    let card = $("<div>").addClass("card task-card").attr("id", task.id);
    let cardBody = $("<div>").addClass("card-body");
    let cardTitle = $("<h3>").addClass("card-title").text(task.title);
    let cardText = $("<p>").addClass("card-text").text(task.description);
    let cardDueDate = $("<p>").addClass("card-text").text(task.dueDate);
    let deleteButton = $("<button>").addClass("btn btn-danger").text("Delete");
    //add click event listener to delete button
    deleteButton.click(handleDeleteTask);
    cardBody.append(cardTitle, cardText, cardDueDate, deleteButton);
    card.append(cardBody);

    //add color coding based on due date
    let dueDate = new Date(task.dueDate);
    let today = new Date();
    let oneWeek = new Date();
    oneWeek.setDate(today.getDate() + 7);
    //if the due date is in the past, make the card red
    if (dueDate < today) {
        card.addClass("bg-danger");
    //if the due date is within a week, make the card yellow
    } else if (dueDate < oneWeek) {
        card.addClass("bg-warning");
    }

    return card;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    for(task of taskList) {
        let card = createTaskCard(task);
        //append the card to the appropriate lane
        $("#" + task.status).append(card);
        //make the card draggable
        card.draggable({
            revert: "invalid",
            helper: "clone"
        });
    };
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();
    //get the values from the form
    let title = $("#taskName").val();
    let description = $("#taskDescription").val();
    let dueDate = $("#taskDueDate").val();
    //create a new task object
    let task = {
        id: generateTaskId(),
        title: title,
        description: description,
        dueDate: dueDate,
        status: "to-do"
    };
    //add the task to the taskList
    taskList.push(task);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    //call createTaskCard and append the card to the to-do(default) lane
    let card = createTaskCard(task);
    $("#to-do").append(card);
    //make the card draggable
    card.draggable({
        revert: "invalid",
        helper: "clone"
    });
    //exit the modal
    $("#formModal").modal("hide");

}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    //get the whole card
    let card = $(event.target).parent().parent();
    //get the id of the task
    let id = card.attr("id");
    card.remove();
    //remove the task from the taskList
    taskList = taskList.filter(task => task.id != id);
    localStorage.setItem("tasks", JSON.stringify(taskList));
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    
    //get the id of the task being dropped
    let id = $(ui.draggable).attr("id");
    //find the task in the taskList
    let task = taskList.find(task => task.id == id);
    //if the task is already in the lane, do nothing
    //otherwise, move the task to the new lane    
    if (task.status == $(this).attr("id")) {
        return;
    } else {
        //detach the card from the current lane and append it to the new lane
        $(ui.draggable).detach().appendTo(this);
        //update the status of the task
        task.status = $(this).attr("id");
        localStorage.setItem("tasks", JSON.stringify(taskList));
    }
}
// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    //load tasks from localStorage on page load
    renderTaskList();
    //add click event listener to add task button
    $("#addTask").click(handleAddTask);
    //make lanes droppable
    $(".lane").droppable({
        //when a card is dropped in a lane, call handleDrop
        drop: handleDrop
    });
    //add calendar date picker
    $("#dueDate").datepicker();
});
