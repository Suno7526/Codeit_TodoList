import { Todo } from '../types/todo';
import styles from '../styles/index.module.css';
import { Check } from 'lucide-react';
import { useRouter } from 'next/router';

// Define prop types
type Props = {
  todo: Todo;
  onClick: () => void;
  isDone?: boolean;
};

export default function TodoItem({ todo, onClick, isDone = false }: Props) {
  const router = useRouter();

  const handleTextClick = () => {
      router.push(`/items?itemId=${todo.itemId}`);
  };

  return (
      <li
          className={`flex items-center w-full max-w-xl mx-auto mb-3 max-w-full h-12 ${
              isDone ? 'bg-[#e9d8fd] line-through' : 'bg-white hover:bg-gray-100'
          } border-2 border-[#0f172a] transition duration-300`}
          style={{ borderRadius: '3rem' }}
      >
        <div className={`flex items-center justify-start ml-4`}>
          <div
              className={`${styles.circleCheck} ${isDone ? styles.checked : ''}`}
              onClick={onClick}
          >
            <Check
                size={16}
                strokeWidth={3}
                style={{ opacity: isDone ? 1 : 0 }}
            />
          </div>

          <span
              className={`${isDone ? '' : ''}  flex items-center cursor-pointer ml-2`}
              onClick={handleTextClick}
          >
          {todo.text}
        </span>
        </div>
      </li>
  );
}
