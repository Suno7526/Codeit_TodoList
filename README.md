# 📝 To Do It;

> A responsive ToDo List web application built with **Next.js**, **TypeScript**, and **Tailwind CSS**.  
> Easily manage your tasks, attach images, and leave memos for each todo.  
> All data is stored locally using `localStorage`.

## 🔧 기술 스택

- **Framework**: [Next.js](https://nextjs.org)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Modules
- **Icons**: Lucide-react
- **Image Handling**: `FileReader` & base64
- **Storage**: localStorage (No backend)

---

## 🚀 실행 방법

```bash
npm install
npm run dev
```

## 🧩 주요 기능 상세

### 1. 📥 할 일 추가
- 상단 입력창에 텍스트 입력 후 `＋ 추가하기` 버튼 클릭
- 입력값이 비어 있거나 공백만 있을 경우 무시됨
- 할 일은 `TO DO` 영역에 추가됨

### 2. ✅ 상태 전환 (TO DO ↔ DONE)
- 각 할 일 왼쪽의 원형 체크 버튼을 클릭
- `lucide-react`의 체크 아이콘이 나타나며, 색상도 변경됨
- 상태에 따라 각각 TO DO 또는 DONE 섹션으로 이동됨

### 3. 🔍 할 일 상세 페이지
- 할 일 텍스트를 클릭 시 `/items?itemId=...` 로 이동
- 해당 할 일의 텍스트, 메모, 이미지 정보를 수정 가능

### 4. 🖼 이미지 업로드 및 수정
- 상세 페이지에서 기본 갤러리 아이콘 클릭
- 최대 5MB, 영문+숫자 파일명만 업로드 가능
- 등록 후에도 `＋` 버튼을 통해 이미지 변경 가능
- 이미지 등록 시 원형 썸네일로 출력

### 5. 📝 메모 작성
- 상세 페이지 우측 메모 영역에 자유롭게 입력
- 텍스트는 중앙 정렬되며 스타일 강조

### 6. 💾 저장 기능
- 수정 완료 후 `✓ 수정 완료` 버튼 클릭 시 `localStorage`에 반영
- 텍스트, 메모, 이미지 포함

### 7. ❌ 삭제 기능
- 상세 페이지 하단 `✕ 삭제하기` 버튼 클릭 시 해당 항목 제거
- 삭제 후 메인 페이지(`/`)로 자동 이동

### 8. 🔄 로컬 스토리지 기반 데이터 유지
- 브라우저 새로고침이나 페이지 이동 후에도 데이터 유지
- `todos`와 `doneTodos`는 각각 분리하여 저장

### 📁 디렉토리 구조

```
/components
  └── Header.tsx          # 공통 헤더 컴포넌트

/pages
  ├── index.tsx           # 메인 페이지 (할 일 리스트)
  └── items.tsx           # 상세 페이지

/styles
  └── index.module.css    # 공통 스타일 모듈

/types
  └── todo.ts             # Todo 인터페이스 정의

/public
  └── galary.png          # 이미지 업로드용 기본 아이콘
```

### ✨ 개선 예정 기능

```
- [ ] TO DO / DONE 필터링 버튼 UI 및 기능
- [ ] 백엔드 서버 연동 (DB 저장 및 로그인)
- [ ] 드래그 앤 드롭 정렬
- [ ] 반응형 UI 향상 및 모바일 최적화
- [ ] 다크 모드 지원
```
