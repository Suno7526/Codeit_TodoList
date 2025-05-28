import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Todo } from '../types/todo';
import styles from "@/styles/index.module.css";

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
        if (storedDone) {
            const doneList: Todo[] = JSON.parse(storedDone);
            const target = doneList.find((t) => t.itemId === Number(itemId));
            if (target) {
                setTodo(target);
                setText(target.text);
                setMemo((target as any).memo || '');
                setImage((target as any).image || null);
            }
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
        if (!storedDone) return;

        const doneList: Todo[] = JSON.parse(storedDone);
        const updatedList = doneList.map((t) =>
            t.itemId === todo.itemId ? { ...t, text, memo, image } : t
        );
        localStorage.setItem('doneTodos', JSON.stringify(updatedList));
        router.push('/');
    };

    const handleDelete = () => {
        if (!todo) return;
        const storedDone = localStorage.getItem('doneTodos');
        if (!storedDone) return;

        const doneList: Todo[] = JSON.parse(storedDone);
        const updatedList = doneList.filter((t) => t.itemId !== todo.itemId);
        localStorage.setItem('doneTodos', JSON.stringify(updatedList));
        router.push('/');
    };

    if (loading) return <div className="p-4 text-center">로딩 중...</div>;
    if (!todo) return <div className="p-4 text-center">해당 완료된 할 일을 찾을 수 없습니다.</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.logo}>
                    <span className={styles.eyes}>👀</span>
                    do it<span className={styles.semicolon}>;</span>
                </div>
            </header>

            <div className={`${styles.inputGroup} justify-between items-center w-full max-w-3xl mx-auto`}>
                <div className={`w-full max-w-xl mx-auto mb-3 ${styles.todoUl} border-2 border-[#0f172a] transition duration-300`}
                     style={{ borderRadius: '3rem' }}>
                    <div className="w-6 h-6 border-4 border-[#0f172a] rounded-full"></div>
                    <input
                        className="w-full bg-transparent text-lg font-semibold focus:outline-none"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 mt-8 max-w-4xl mx-auto w-full">
                <div className="flex items-center justify-center w-full md:w-1/2 h-64 bg-[#f8fafc] border-2 border-dashed border-[#d1d5db] rounded-2xl relative">
                    {image ? (
                        <img src={image} alt="첨부 이미지" className="max-h-full object-contain rounded-xl" />
                    ) : (
                        <label className="cursor-pointer flex flex-col items-center">
                            <div className="text-gray-400 text-4xl">🖼</div>
                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                            <div className="absolute bottom-2 right-2 w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full text-xl">＋</div>
                        </label>
                    )}
                </div>

                <div className="flex-1 bg-[#fffbea] rounded-2xl p-6 border border-yellow-200 shadow-inner">
                    <h3 className="text-[#d97706] font-bold mb-2">Memo</h3>
                    <p className="whitespace-pre-wrap text-center text-gray-800">{memo}</p>
                </div>
            </div>

            <div className="flex justify-center gap-4 mt-8">
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
    );
}
