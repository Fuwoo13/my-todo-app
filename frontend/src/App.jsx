import { useState, useEffect } from 'react';
import './App.css';

// 배포/로컬 환경에 맞춰 API 주소 자동 설정
const API_URL = 'http://localhost:5000/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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

  // 2. Todo 추가하기 (시작일, 종료일 포함)
  const addTodo = async (e) => {
    if(e) e.preventDefault();
    if (!title.trim()) return;

    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, startDate, endDate }) 
      });
      const newTodo = await response.json();
      setTodos([newTodo, ...todos]);
      
      // 입력창 비우기
      setTitle('');    
      setStartDate(''); 
      setEndDate('');   
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
      await fetch(`${API_URL}/todos/${id}`, { method: 'DELETE' });
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('삭제 실패:', error);
    }
  };
  
  return (
    <div className="App">
      <h1>✨Todo List</h1>
      
      <div className="input-container">
        <input 
          className="title-input"
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="할 일을 입력하세요" 
        />
        
        <input 
          type="date" 
          value={startDate} 
          onChange={(e) => setStartDate(e.target.value)} 
        />
        <span className="date-separator">~</span>
        <input 
          type="date" 
          value={endDate} 
          onChange={(e) => setEndDate(e.target.value)} 
        />
        
        <button className="add-btn" onClick={addTodo}>추가</button>
      </div>
<ul>
        {todos.map((todo) => (
          <li key={todo._id} className={todo.completed ? 'completed-row' : ''}>
            
            <input 
              type="checkbox" 
              className="todo-checkbox"
              checked={todo.completed} 
              onChange={() => toggleComplete(todo._id, todo.completed)} 
            />

            <span 
              onClick={() => toggleComplete(todo._id, todo.completed)} 
              className={todo.completed ? 'completed-text' : ''}
            >
              {todo.title}
              
              {todo.startDate && todo.endDate && (
                <span className="deadline-badge"> 📅 {todo.startDate} ~ {todo.endDate}</span>
              )}
            </span>
            
            <button className="delete-btn" onClick={() => deleteTodo(todo._id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;