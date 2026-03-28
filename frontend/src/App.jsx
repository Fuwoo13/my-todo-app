import { useState, useEffect } from 'react';
import './App.css';

// Vercel 배포 시 환경 변수에서 URL을 가져오고, 로컬에서는 5000번 포트 사용
// 변경 후
const API_URL = import.meta.env.DEV ? 'http://127.0.0.1:5000/api' : '/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');

  // 1. Todo 목록 불러오기
  const fetchTodos = async () => {
    try {
      const response = await fetch(`${API_URL}/todos`);
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('불러오기 실패:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // 2. Todo 추가하기
  const addTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });
      const newTodo = await response.json();
      setTodos([newTodo, ...todos]);
      setTitle('');
    } catch (error) {
      console.error('추가 실패:', error);
    }
  };

  // 3. Todo 완료 상태 변경
  const toggleComplete = async (id, currentStatus) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !currentStatus })
      });
      const updatedTodo = await response.json();
      setTodos(todos.map(todo => todo._id === id ? updatedTodo : todo));
    } catch (error) {
      console.error('업데이트 실패:', error);
    }
  };

  // 4. Todo 삭제하기
  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE'
      });
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('삭제 실패:', error);
    }
  };

  return (
    <div className="app-container">
      <h1>✅ 내 할 일 목록</h1>
      <form className="input-section" onSubmit={addTodo}>
        <input 
          type="text" 
          placeholder="오늘 할 일을 입력하세요..." 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">추가</button>
      </form>

      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>
            <div className="todo-content" onClick={() => toggleComplete(todo._id, todo.completed)}>
              <input 
                type="checkbox" 
                checked={todo.completed} 
                readOnly
              />
              <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
                {todo.title}
              </span>
            </div>
            <button className="delete-btn" onClick={() => deleteTodo(todo._id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;