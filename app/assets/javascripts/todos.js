// # Place all the behaviors and hooks related to the matching controller here.
// # All this logic will automatically be available in application.js.
// # You can use CoffeeScript in this file: http://coffeescript.org/

function toggleDone() {
  var checkbox = this;
  var listItem = $(checkbox).parent();

  var todoId = listItem.data('id');
  var isCompleted = !listItem.hasClass("completed");

  $.ajax({
    type: "PUT",
    url: "/todos/" + todoId + ".json",
    data: JSON.stringify({
      todo: { completed: isCompleted }
    }),
    contentType: "application/json",
    dataType: "json"})

    .done(function(data) {
      console.log(data);

      if (data.completed) {
        listItem.addClass("completed");
      } else {
        listItem.removeClass("completed");
      }

      updateCounters();
    });
}

function updateCounters() {
  $("#total-count").html($(".todo").length);
  $("#completed-count").html($(".completed").length);
  $("#todo-count").html($(".todo").length - $(".completed").length);
}

function createTodo(title) {
  var newTodo = { title: title, completed: false };

  $.ajax({
    type: "POST",
    url: "/todos.json",
    data: JSON.stringify({
        todo: newTodo
    }),
    contentType: "application/json",
    dataType: "json"})

    .done(function(data) {
      console.log(data);

      var checkboxId = "todo-" + data.id;

      var listItem = $("<li></li>");
      listItem.addClass("todo");
      listItem.attr('data-id', data.id);

      var checkbox = $('<input>');
      checkbox.attr('type', 'checkbox');
      checkbox.attr('id', checkboxId);
      checkbox.val(1);
      checkbox.bind('change', toggleDone);

      var space = document.createTextNode(" ");

      var label = $('<label></label>');
      label.attr('for', checkboxId);
      label.html(data.title);

      listItem.append(checkbox);
      listItem.append(space);
      listItem.append(label);

      $("#todolist").append( listItem );

      updateCounters();
    })

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
  resetErrors();
  createTodo($("#todo_title").val());
  $("#todo_title").val(null);
  updateCounters();
}

function cleanUpDoneTodos(event) {
  event.preventDefault();
  $.when($(".completed").remove())
    .then(updateCounters);
}

function resetErrors() {
  $("#error_message").remove();
  $("#todo_title").removeClass("error");
}

$(document).ready(function() {
  $("input[type=checkbox]").bind('change', toggleDone);
  $("form").bind('submit', submitTodo);
  $("#clean-up").bind('click', cleanUpDoneTodos);
  updateCounters();
});
