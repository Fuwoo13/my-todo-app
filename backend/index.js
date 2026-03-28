const express = require('express');
console.log("테스트: 파일이 정상적으로 실행되었습니다!");
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB 연결
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB 연결 성공'))
  .catch((err) => console.log('MongoDB 연결 실패:', err));

// Mongoose 스키마 및 모델 정의
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }
});
const Todo = mongoose.model('Todo', todoSchema);

// --- API 라우터 ---

// 1. Todo 목록 보기 (Read)
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ _id: -1 }); // 최신순 정렬
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: '서버 에러' });
  }
});

// 2. Todo 추가 (Create)
app.post('/api/todos', async (req, res) => {
  try {
    const newTodo = new Todo({ title: req.body.title });
    const savedTodo = await newTodo.save();
    res.json(savedTodo);
  } catch (err) {
    res.status(500).json({ error: '서버 에러' });
  }
});

// 3. Todo 완료 체크 (Update)
app.put('/api/todos/:id', async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id, 
      { completed: req.body.completed }, 
      { new: true }
    );
    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: '서버 에러' });
  }
});

// 4. Todo 삭제 (Delete)
app.delete('/api/todos/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: '삭제 완료' });
  } catch (err) {
    res.status(500).json({ error: '서버 에러' });
  }
});

// 로컬 테스트용 서버 실행
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`));
}

// Vercel 배포를 위한 모듈 내보내기
module.exports = app;