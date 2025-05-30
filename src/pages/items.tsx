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
  const [originalTodo, setOriginalTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [memo, setMemo] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [completed, setCompleted] = useState(false);

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
      setOriginalTodo(target);
      setText(target.text);
      setMemo(target.memo || '');
      setImage(target.image || null);
      setCompleted(target.completed);
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

  const isModified = () => {
    if (!originalTodo) return false;
    return (
      text !== originalTodo.text ||
      memo !== (originalTodo.memo || '') ||
      image !== (originalTodo.image || null) ||
      completed !== originalTodo.completed
    );
  };

  const handleSave = () => {
    if (!todo || !isModified()) return;

    const storedDone = localStorage.getItem('doneTodos');
    const storedTodos = localStorage.getItem('todos');
    const doneList: Todo[] = storedDone ? JSON.parse(storedDone) : [];
    const todoList: Todo[] = storedTodos ? JSON.parse(storedTodos) : [];

    const combined = [...doneList, ...todoList];
    const updatedList = combined.map((t) =>
      t.itemId === todo.itemId ? { ...t, text, memo, image, completed } : t
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

  if (loading) return <div className="p-4 text-center">로딩 중...</div>;
  if (!todo) return <div className="p-4 text-center">해당 할 일을 찾을 수 없습니다.</div>;

  return (
    <div className={styles.container}>
      <Header />

      <div className="w-full max-w-5xl mx-auto">
        <div
          className={`flex items-center w-full mx-auto mb-3 border-2 h-10
            ${completed ? 'bg-violet-300 underline' : ''}
           border-[#0f172a] transition duration-300`}
          style={{ borderRadius: '3rem' }}
        >
          <div className="flex items-center justify-center w-full gap-4">
            <div
              className={`${styles.circleCheck} ${completed ? styles.checked : ''} cursor-pointer`}
              onClick={() => setCompleted(!completed)}
            >
              <Check
                size={16}
                strokeWidth={3}
                style={{ opacity: completed ? 1 : 0 }}
              />
            </div>
            <input
              className="bg-transparent text-lg text-left focus:outline-none max-w-md"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mt-8 w-full">
          <div className="w-full lg:w-[40%] h-[25rem] flex items-center justify-center bg-[#f8fafc] border-2 border-dashed border-[#d1d5db] rounded-2xl relative">
              {image ? (
                <>
                  <img src={image} alt="첨부 이미지" className="w-full h-full object-cover" />
                  <label className="absolute bottom-2 right-2 w-10 h-10 flex items-center justify-center bg-white border border-gray-400 rounded-full text-xl cursor-pointer shadow">
                    <Image src="/editButton.png" alt="edit" width={70} height={70} />
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                  <Image src="/galary.png" alt="gallery" width={70} height={70} />
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  <div className="absolute bottom-2 right-2 w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full text-xl">＋</div>
                </label>
              )}
            </div>

          <div className="w-full lg:w-[60%] bg-[#fffbea] rounded-2xl p-6 border border-yellow-200 shadow-inner flex flex-col items-center justify-center">
              <h3 className="text-[#d97706] font-bold mb-2">Memo</h3>
              <div className="w-full h-80 flex items-center justify-center">
                <textarea
                  className="w-full h-full p-3 bg-transparent border-none resize-none text-center text-gray-800 focus:outline-none"
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
            className={`border-2 border-[#0f172a] shadow-bottom-right-strong font-semibold rounded-full px-6 py-2 ${
              isModified()
                ? 'bg-lime-300 text-[#0f172a] hover:bg-lime-400'
                : 'bg-slate-200 text-black cursor-not-allowed'
            }`}
            disabled={!isModified()}
          >
            ✓ 수정 완료
          </button>

          <button
            onClick={handleDelete}
            className="bg-red-500 border-2 border-[#0f172a] text-white shadow-bottom-right-strong font-semibold rounded-full px-6 py-2 hover:bg-red-600"
          >
            ✕ 삭제하기
          </button>
        </div>
      </div>
    </div>
  );
}
