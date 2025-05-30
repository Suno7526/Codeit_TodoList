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


  return (
    <div className={styles.container}>
      <Header />

      <div className="flex flex-row gap-4 mb-10 items-center justify-between md:justify-center">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="할 일을 입력해주세요"
          className="flex-1 bg-[#f1f5f9] border-2 border-[#0f172a] rounded-full px-6 py-2 text-gray-800 focus:outline-none"
        />
        <button
          onClick={addTodo}
          className={`w-12 h-12 md:w-auto md:px-6 py-2 rounded-full border-2 border-[#0f172a] font-semibold shadow-[4px_4px_0_rgba(15,23,42,1)] transition
            ${input.trim() ? 'bg-violet-600 text-white hover:bg-violet-500' : 'bg-slate-200 text-black cursor-not-allowed'}`}
          disabled={!input.trim()}
        >
          <span className="block md:hidden">＋</span>
          <span className="hidden md:block">＋ 추가하기</span>
        </button>
      </div>



      <div className="grid gap-10 w-full mx-auto grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
        <section>
          <h2 className="bg-lime-300 text-[#0f172a] py-1 px-4 rounded-full font-bold inline-block mb-6">TO DO</h2>
          <ul className="flex flex-col gap-4">
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
          <h2 className="bg-green-900 text-white py-1 px-4 rounded-full font-bold inline-block mb-6">DONE</h2>
           <ul className="flex flex-col gap-4">
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
