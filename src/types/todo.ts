// types/todo.ts
export interface Todo {
  itemId: number;
  text: string;
  completed: boolean;
  memo?: string;       // ✅ 이 줄 추가
  image?: string | null; // ✅ 있으면 함께 확인
}
