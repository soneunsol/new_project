/* =========================================================
   Daily Focus — 할 일 목록 로직
   Supabase(np_todos 테이블)와 연동한 간단한 CRUD 구현.
   ========================================================= */

// Supabase 클라이언트 생성 (config.js의 전역 변수 사용)
const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

const TABLE = "np_todos";

// DOM 요소 캐싱
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const listEl = document.getElementById("todo-list");
const statusEl = document.getElementById("todo-status");

// 상태 메시지 표시 유틸
function setStatus(message) {
  statusEl.textContent = message;
}

// 할 일 목록을 화면에 그리기
function renderTodos(todos) {
  listEl.innerHTML = "";

  if (!todos.length) {
    const empty = document.createElement("li");
    empty.className = "todo-empty";
    empty.textContent = "아직 할 일이 없어요. 첫 할 일을 추가해 보세요! ✨";
    listEl.appendChild(empty);
    return;
  }

  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "todo-item" + (todo.is_done ? " done" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "todo-check";
    checkbox.checked = todo.is_done;
    checkbox.addEventListener("change", () =>
      toggleTodo(todo.id, checkbox.checked)
    );

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.content;

    const delBtn = document.createElement("button");
    delBtn.className = "todo-delete";
    delBtn.type = "button";
    delBtn.setAttribute("aria-label", "삭제");
    delBtn.textContent = "✕";
    delBtn.addEventListener("click", () => deleteTodo(todo.id));

    li.append(checkbox, text, delBtn);
    listEl.appendChild(li);
  });
}

// 전체 할 일 불러오기 (최신순)
async function loadTodos() {
  setStatus("불러오는 중…");
  const { data, error } = await supabaseClient
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    setStatus("불러오기에 실패했어요: " + error.message);
    return;
  }
  setStatus(`총 ${data.length}개의 할 일`);
  renderTodos(data);
}

// 할 일 추가
async function addTodo(content) {
  const { error } = await supabaseClient
    .from(TABLE)
    .insert({ content });

  if (error) {
    setStatus("추가에 실패했어요: " + error.message);
    return;
  }
  await loadTodos();
}

// 완료 상태 토글
async function toggleTodo(id, isDone) {
  const { error } = await supabaseClient
    .from(TABLE)
    .update({ is_done: isDone })
    .eq("id", id);

  if (error) {
    setStatus("수정에 실패했어요: " + error.message);
    return;
  }
  await loadTodos();
}

// 할 일 삭제
async function deleteTodo(id) {
  const { error } = await supabaseClient
    .from(TABLE)
    .delete()
    .eq("id", id);

  if (error) {
    setStatus("삭제에 실패했어요: " + error.message);
    return;
  }
  await loadTodos();
}

// 폼 제출 핸들러
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const content = input.value.trim();
  if (!content) return;
  input.value = "";
  addTodo(content);
});

// 초기 로딩
loadTodos();
