import { Todo } from '../types/todo';

type Props = {
  todo: Todo;
  onClick: () => void;
  onDelete: () => void;
  isDone?: boolean;
};

export default function TodoItem({ todo, onClick, onDelete, isDone = false }: Props) {
  return (
    <li
      className={`flex items-center justify-between ${
        isDone ? 'bg-[#e9d8fd]' : 'bg-white hover:bg-gray-100'
      } border-2 border-[#0f172a] rounded-full px-6 py-4 cursor-pointer transition duration-300`}
    >
      <div
        className={`flex items-center gap-3 text-lg font-semibold ${
          isDone ? 'text-purple-800' : 'text-gray-900'
        }`}
        onClick={onClick}
      >
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center border-4 ${
            isDone ? 'bg-purple-600 text-white' : 'border-[#0f172a]'
          } transition duration-300`}
        >
          {isDone ? '✓' : ''}
        </div>
        {todo.text}
      </div>
      {isDone && (
        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-700 text-sm font-medium ml-4"
        >
          삭제
        </button>
      )}
    </li>
  );
}
