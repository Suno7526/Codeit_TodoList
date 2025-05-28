import { useState, useEffect } from 'react';
import { Todo } from '../types/todo';
import TodoItem from '../components/TodoItem';
import styles from '../styles/index.module.css';
import Image from 'next/image';
import Header from '../components/Header';

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
      itemId: Date.now(),
      text: input,
      completed: false,
    };
    setTodos([...todos, newTodo]);
    setInput('');
  };

  const toggleTodoStatus = (itemId: number) => {
    const todoInTodo = todos.find(t => t.itemId === itemId);
    const todoInDone = doneTodos.find(t => t.itemId === itemId);

    if (todoInTodo) {
      setTodos(todos.filter(t => t.itemId !== itemId));
      setDoneTodos([{ ...todoInTodo, completed: true }, ...doneTodos]);
    } else if (todoInDone) {
      setDoneTodos(doneTodos.filter(t => t.itemId !== itemId));
      setTodos([{ ...todoInDone, completed: false }, ...todos]);
    }
  };

  const filteredTodos =
    filter === 'todo' ? todos : filter === 'done' ? doneTodos : todos;

  return (
    <div className={styles.container}>
      <Header />

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

      <div className={styles.todoSections}>
        <section>
          <h2 className={styles.todoHeader}>TO DO</h2>
          <ul className={styles.ul}>
            {todos.length === 0 ? (
              <div className="flex flex-col items-center gap-2">
                <Image src="/use.png" alt="use" width={500} height={500} />
                <p className="text-gray-600 text-center">
                  할 일이 없어요.<br />TODO를 새롭게 추가해주세요!
                </p>
              </div>
            ) : (
              todos.map(todo => (
                <TodoItem
                  key={todo.itemId}
                  todo={todo}
                  onClick={() => toggleTodoStatus(todo.itemId)}
                />
              ))
            )}
          </ul>
        </section>

        <section>
          <h2 className={styles.doneHeader}>DONE</h2>
          <ul className={styles.ul}>
            {doneTodos.length === 0 ? (
              <div className="flex flex-col items-center gap-2">
                <Image src="/notUse.png" alt="not use" width={500} height={500} />
                <p className="text-gray-600 text-center">
                  아직 다 한 일이 없어요.<br />해야 할 일을 체크해보세요!
                </p>
              </div>
            ) : (
              doneTodos.map(todo => (
                <TodoItem
                  key={todo.itemId}
                  todo={todo}
                  onClick={() => toggleTodoStatus(todo.itemId)}
                  isDone
                />
              ))
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
