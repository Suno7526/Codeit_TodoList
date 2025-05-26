// pages/index.tsx
import { useState, useEffect } from 'react';
import { Todo } from '../types/todo';
import TodoItem from '../components/TodoItem';
import styles from '../styles/index.module.css';

export default function Home() {
  const [input, setInput] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [doneTodos, setDoneTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'all' | 'todo' | 'done'>('all');

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    const storedDone = localStorage.getItem('doneTodos');
    if (storedTodos) setTodos(JSON.parse(storedTodos));
    if (storedDone) setDoneTodos(JSON.parse(storedDone));
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('doneTodos', JSON.stringify(doneTodos));
  }, [todos, doneTodos]);

  const addTodo = () => {
    if (!input.trim()) return;
    const newTodo: Todo = {
      id: Date.now(),
      text: input,
      completed: false,
    };
    setTodos([...todos, newTodo]);
    setInput('');
  };

  const markAsDone = (id: number) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    setTodos(todos.filter(t => t.id !== id));
    setDoneTodos([{ ...todo, completed: true }, ...doneTodos]);
  };

  const deleteTodo = (id: number, fromDone: boolean) => {
    if (fromDone) {
      setDoneTodos(doneTodos.filter(t => t.id !== id));
    } else {
      setTodos(todos.filter(t => t.id !== id));
    }
  };

  const filteredTodos =
    filter === 'todo' ? todos : filter === 'done' ? doneTodos : todos;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.eyes}>👀</span>
          do it<span className={styles.semicolon}>;</span>
        </div>
      </header>

      <div className={styles.inputGroup}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="할 일을 입력해주세요"
          className={styles.input}
        />
        <button
          onClick={addTodo}
          className={styles.addButton}
        >
          ＋ 추가하기
        </button>
      </div>

      <div className={styles.filterGroup}>
        <button
          onClick={() => setFilter('all')}
          className={filter === 'all' ? styles.activeAll : styles.inactive}
        >
          전체
        </button>
        <button
          onClick={() => setFilter('todo')}
          className={filter === 'todo' ? styles.activeTodo : styles.inactive}
        >
          할 일
        </button>
        <button
          onClick={() => setFilter('done')}
          className={filter === 'done' ? styles.activeDone : styles.inactive}
        >
          완료됨
        </button>
      </div>

      <div className={styles.todoSections}>
        <section>
          <h2 className={styles.todoHeader}>TO DO</h2>
          <ul className={styles.todoList}>
            {todos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onClick={() => markAsDone(todo.id)}
              />
            ))}
          </ul>
        </section>

        <section>
          <h2 className={styles.doneHeader}>DONE</h2>
          <ul className={styles.todoList}>
            {doneTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onClick={() => {}}
                onDelete={() => deleteTodo(todo.id, true)}
                isDone
              />
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}