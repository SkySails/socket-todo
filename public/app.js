var socket = io();

const todosToString = (todos) => {
  return !todos
    ? ""
    : todos.reduce(
        (str, todo) =>
          str +
          `
      <li class="card">
        <article data-id="${todo.id}">
          <section class="title">
            ${todo.title}
          </section>
          <section class="trash-btn">
            <button onclick="this.closest('li').remove()">
              <svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><title>Trash</title><path d='M112 112l20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320' fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='32'/><path stroke='currentColor' stroke-linecap='round' stroke-miterlimit='10' stroke-width='32' d='M80 112h352'/><path d='M192 112V72h0a23.93 23.93 0 0124-24h80a23.93 23.93 0 0124 24h0v40M256 176v224M184 176l8 224M328 176l-8 224' fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='32'/></svg>
            </button>
          </section>
        </article>
      </li>
  `,
        ""
      );
};

socket.on("init", function ({ todo, progress, done }) {
  let listName = $(".card--editable").parent().attr("id");
  let editableCard = $(".card--editable").detach();

  $("#todo").html(todosToString(todo));
  $("#progress").html(todosToString(progress));
  $("#done").html(todosToString(done));

  $(`#${listName}`).prepend(editableCard);
  $(".card--editable").find("textarea").focus();
});

const sortable = new Draggable.Sortable(document.querySelectorAll(".list"), {
  draggable: ".card",
  distance: 4,
  mirror: {
    constrainDimensions: true,
  },
  plugins: [Plugins.SortAnimation],
});

const generateTodosObject = () =>
  Array.from($("article")).reduce(
    (todos, todo) => {
      let updatedTodo = {
        title: todo.querySelector(".title").innerText,
        id: todo.dataset.id,
      };
      todos[todo.closest("ul").id]
        ? todos[todo.closest("ul").id].push(updatedTodo)
        : (todos[todo.closest("ul").id] = [updatedTodo]);
      return todos;
    },
    { todo: [], progress: [], done: [] }
  );

function sendUpdateToServer(override) {
  socket.emit("update", override || generateTodosObject());
}

sortable.on("drag:stopped", (e) => sendUpdateToServer());

function submitTodo(e) {
  e.preventDefault();
  startConfetti();
  let title = e.currentTarget.elements[0].value;
  let initialStatus = e.currentTarget.closest(".list").id;
  e.currentTarget.closest("li").remove();
  socket.emit("create", { initialStatus, title });
  setTimeout(() => {
    stopConfetti();
  }, 5000);
}

function addEditableCard(btnElement) {
  let list = btnElement.closest("div").querySelector(".list");
  let container = document.createElement("li");
  container.className = "card--editable";
  container.innerHTML = `
      <form onsubmit="submitTodo(event)" >
        <textarea oninput="event.target.nextElementSibling.firstElementChild.disabled = !event.target.value" placeholder="Add a title, be creative!"></textarea>
        <section class="card-buttons">
          <button disabled class="primary">Add</button><button class="secondary">Cancel</button>
        </section>
      </form>
  `;
  $(list).prepend(container).find("textarea").focus();
}

function reset() {
  socket.emit("update", { todo: [], progress: [], done: [] });
}
