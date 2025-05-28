import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Todo } from '../types/todo';
import styles from "@/styles/index.module.css";
import { Check } from 'lucide-react';
import Header from '../components/Header';
import Image from 'next/image';

export default function ItemDetail() {
    const router = useRouter();
    const { itemId } = router.query;

    const [todo, setTodo] = useState<Todo | null>(null);
    const [loading, setLoading] = useState(true);
    const [memo, setMemo] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [text, setText] = useState('');

    useEffect(() => {
        if (!router.isReady || !itemId) return;

        const storedDone = localStorage.getItem('doneTodos');
        const storedTodos = localStorage.getItem('todos');
        const doneList: Todo[] = storedDone ? JSON.parse(storedDone) : [];
        const todoList: Todo[] = storedTodos ? JSON.parse(storedTodos) : [];
        const combined = [...doneList, ...todoList];
        const target = combined.find((t) => t.itemId === Number(itemId));
        if (target) {
            setTodo(target);
            setText(target.text);
            setMemo((target as any).memo || '');
            setImage((target as any).image || null);
        }
        setLoading(false);
    }, [router.isReady, itemId]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.name.match(/^[a-zA-Z0-9_.-]+$/)) {
            alert('이미지 파일 이름은 영어와 숫자만 포함되어야 합니다.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('이미지 크기는 5MB 이하만 가능합니다.');
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSave = () => {
        if (!todo) return;
        const storedDone = localStorage.getItem('doneTodos');
        const storedTodos = localStorage.getItem('todos');

        const doneList: Todo[] = storedDone ? JSON.parse(storedDone) : [];
        const todoList: Todo[] = storedTodos ? JSON.parse(storedTodos) : [];

        const combined = [...doneList, ...todoList];
        const updatedList = combined.map((t) =>
            t.itemId === todo.itemId ? { ...t, text, memo, image } : t
        );

        const newDoneList = updatedList.filter((t) => t.completed);
        const newTodoList = updatedList.filter((t) => !t.completed);

        localStorage.setItem('doneTodos', JSON.stringify(newDoneList));
        localStorage.setItem('todos', JSON.stringify(newTodoList));
        router.push('/');
    };

    const handleDelete = () => {
        if (!todo) return;
        const storedDone = localStorage.getItem('doneTodos');
        const storedTodos = localStorage.getItem('todos');

        const doneList: Todo[] = storedDone ? JSON.parse(storedDone) : [];
        const todoList: Todo[] = storedTodos ? JSON.parse(storedTodos) : [];

        const combined = [...doneList, ...todoList];
        const updatedList = combined.filter((t) => t.itemId !== todo.itemId);

        const newDoneList = updatedList.filter((t) => t.completed);
        const newTodoList = updatedList.filter((t) => !t.completed);

        localStorage.setItem('doneTodos', JSON.stringify(newDoneList));
        localStorage.setItem('todos', JSON.stringify(newTodoList));
        router.push('/');
    };

    const handleToggleComplete = () => {
        if (!todo) return;

        const storedDone = localStorage.getItem('doneTodos');
        const storedTodos = localStorage.getItem('todos');

        const doneList: Todo[] = storedDone ? JSON.parse(storedDone) : [];
        const todoList: Todo[] = storedTodos ? JSON.parse(storedTodos) : [];

        const updatedTodo = { ...todo, completed: !todo.completed };
        const filteredDone = doneList.filter(t => t.itemId !== todo.itemId);
        const filteredTodo = todoList.filter(t => t.itemId !== todo.itemId);

        const newDoneList = updatedTodo.completed ? [updatedTodo, ...filteredDone] : filteredDone;
        const newTodoList = !updatedTodo.completed ? [updatedTodo, ...filteredTodo] : filteredTodo;

        localStorage.setItem('doneTodos', JSON.stringify(newDoneList));
        localStorage.setItem('todos', JSON.stringify(newTodoList));

        setTodo(updatedTodo);
    };

    if (loading) return <div className="p-4 text-center">로딩 중...</div>;
    if (!todo) return <div className="p-4 text-center">해당 할 일을 찾을 수 없습니다.</div>;

    return (
        <div className={styles.container}>
            <Header />

            <div className="w-full max-w-5xl mx-auto">
                <div
                    className={`w-full mx-auto mb-3 ${styles.todoUl} border-2 border-[#0f172a] transition duration-300`}
                    style={{ borderRadius: '3rem' }}
                >
                    <div
                      className={`${styles.circleCheck} ${todo.completed ? styles.checked : ''} cursor-pointer`}
                      onClick={handleToggleComplete}
                    >
                      <Check
                        size={16}
                        strokeWidth={3}
                        style={{ opacity: todo.completed ? 1 : 0 }}
                      />
                    </div>
                    <input
                        className="w-full bg-transparent text-lg font-semibold focus:outline-none"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>

                <div className="flex flex-col md:flex-row gap-6 mt-8 w-full">
                    <div className="w-full md:w-[40%] h-[25rem] relative flex items-center justify-center bg-[#f8fafc] border-2 border-dashed border-[#d1d5db] rounded-2xl overflow-hidden">
                      {image ? (
                        <>
                          <img
                            src={image}
                            alt="첨부 이미지"
                            className="w-full h-full object-cover"
                          />
                          <label className="absolute bottom-2 right-2 w-10 h-10 flex items-center justify-center bg-white border border-gray-400 rounded-full text-xl cursor-pointer shadow">
                            ＋
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                          </label>
                        </>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center">
                          <div className="text-gray-400 text-4xl"><Image src="/galary.png" alt="use" width={70} height={70} /></div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                          <div className="absolute bottom-2 right-2 w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full text-xl">＋</div>
                        </label>
                      )}
                    </div>


                    <div className="w-full md:w-[70%] bg-[#fffbea] rounded-2xl p-6 border border-yellow-200 shadow-inner flex flex-col items-center justify-center">
                      <h3 className="text-[#d97706] font-bold mb-2">Memo</h3>
                      <div className="w-full h-80 flex items-center justify-center">
                        <textarea
                          className="w-full h-full p-3 bg-transparent border-none resize-none text-center text-gray-800 focus:outline-none flex items-center justify-center"
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
                          placeholder="메모를 입력하세요"
                          value={memo}
                          onChange={(e) => setMemo(e.target.value)}
                        />
                      </div>
                    </div>

                </div>

                <div className="flex justify-end gap-4 mt-8">
                    <button
                        onClick={handleSave}
                        className="bg-white border-2 border-[#0f172a] text-[#0f172a] font-semibold rounded-full px-6 py-2 hover:bg-gray-100"
                    >
                        ✓ 수정 완료
                    </button>
                    <button
                        onClick={handleDelete}
                        className="bg-red-500 text-white font-semibold rounded-full px-6 py-2 hover:bg-red-600"
                    >
                        ✕ 삭제하기
                    </button>
                </div>
            </div>
        </div>
    );
}
