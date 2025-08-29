const express = require("express");
const mysql = require("mysql2");
const app = express();

app.use(express.json());

// DB연결
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "yujin021129",
  database: "myappdb"
});

db.connect((err) => {
  if (err) {
    console.error("DB 연결 실패:", err);
    return;
  }
  console.log("DB 연결 성공!");
});



// 1. Create(POST)
app.post("/users", (req, res) => {
  console.log("요청 :", req.body);
  const { name, email, password } = req.body;
  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  db.query(sql, [name, email, password], (err, result) => {
    if (err) {
      console.error("회원가입 오류:", err);
      return res.status(500).json({ error: "회원가입 실패" });
    }
    res.status(201).json({
      id: result.insertId, name, email});
  });
});


// 2. Read(GET)
app.get("/users", (req, res) => {
  const sql = "SELECT id, name, email, created_at, updated_at FROM users";
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ message: "DB 오류" });
    res.json(rows);
  });
});

app.get("/users/:id", (req, res) => {
  const sql = "SELECT id, name, email, created_at, updated_at FROM users WHERE id = ?";
  db.query(sql, [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ message: "DB 오류" });
    if (rows.length === 0) return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    res.json(rows[0]);
  });
});


// 3. Update(PUT)
app.put("/users/:id", (req, res) => {
  const { name, email, password } = req.body;
  const sql = "UPDATE users SET name=?, email=?, password=? WHERE id=?";
  db.query(sql, [name, email, password, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: "DB 오류" });
    if (result.affectedRows === 0) return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    res.json({ message: "회원 정보 수정 완료" });
  });
});


// 4. Delete
app.delete("/users/:id", (req, res) => {
  const sql = "DELETE FROM users WHERE id=?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: "DB 오류" });
    if (result.affectedRows === 0) return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    res.json({ message: "회원 삭제 완료" });
  });
});


app.listen(3000, () => {
  console.log("서버 실행 중: http://localhost:3000");
});