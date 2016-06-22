// # Place all the behaviors and hooks related to the matching controller here.
// # All this logic will automatically be available in application.js.
// # You can use CoffeeScript in this file: http://coffeescript.org/

function toggleDone() {
  $(this).parent().toggleClass("completed");
  updateCounters();
}

function updateCounters() {
  $("#total-count").html($(".todo").length);
  $("#completed-count").html($(".completed").length);
  $("#todo-count").html($(".todo").length - $(".completed").length);
}

function nextTodoId() {
  return $(".todo").length + 1;
}

function createTodo(title) {
  var checkboxId = "todo-" + nextTodoId();

  var listItem = $("<li></li>");
  listItem.addClass("todo");

  var checkbox = $('<input>');
  checkbox.attr('type', 'checkbox');
  checkbox.attr('id', checkboxId);
  checkbox.val(1);
  checkbox.bind('change', toggleDone);

  var space = document.createTextNode(" ");

  var label = $('<label></label>');
  label.attr('for', checkboxId);
  label.html(title);

  listItem.append(checkbox);
  listItem.append(space);
  listItem.append(label);

  $("#todolist").append( listItem );

  updateCounters();

  var newTodo = { title: title, completed: false };

  $.ajax({
    type: "POST",
    url: "/todos.json",
    data: JSON.stringify({
        todo: newTodo
    }),
    contentType: "application/json",
    dataType: "json"

    .fail(function(error) {
    console.log(error);

    error_messsage = error.responseJSON.title[0];
     showError(error_messsage);
  });
}

function showError(message) {
  $("#todo_title").addClass("error");

  var errorElement = $("<small></small>")
    .attr('id', 'error_message')
    .addClass('error')
    .html(message);

  $(errorElement).appendTo('form .field');
}

function submitTodo(event) {
  event.preventDefault();
  createTodo($("#todo_title").val());
  $("#todo_title").val(null);
  updateCounters();
}

function cleanUpDoneTodos(event) {
  event.preventDefault();
  $.when($(".completed").remove())
    .then(updateCounters);
}

$(document).ready(function() {
  $("input[type=checkbox]").bind('change', toggleDone);
  $("form").bind('submit', submitTodo);
  $("#clean-up").bind('click', cleanUpDoneTodos);
  updateCounters();
});
