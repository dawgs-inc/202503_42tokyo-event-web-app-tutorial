const express = require('express')
const cors = require('cors')
const db = require('./db')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

// イベント登録
app.post('/api/events', (req, res) => {
  const { title, memo, event_date } = req.body;
  db.query('INSERT INTO events (title, memo, event_date) VALUES (?, ?, ?)', [title, memo, event_date], (error) => {
    if (error) {
      console.log('Error inserting event:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return
    }
    res.status(200).json({ message: 'Event added successfully' });
  });
});

// 登録したすべてのイベント取得
app.get('/api/events', (req, res) => {
  db.query('SELECT * FROM events', (error, results) => {
    if (error) {
      console.log('Error fetching events:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return
    }
    res.status(200).json(results);
  });
});

// イベント内容の変更
app.put('/api/events/:id', (req, res) => {
  const eventId = req.params.id;
  const { title, memo, event_date } = req.body;
  db.query('UPDATE events SET title = ?, memo = ?, event_date = ? WHERE id = ?', [title, memo, event_date, eventId], (error) => {
    if (error) {
      console.log('Error updating event:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return
    }
    res.status(200).json({ message: 'Event updated successfully' });
  });
});

// イベント削除
app.delete('/api/events/:id', (req, res) => {
  const eventId = req.params.id;
  db.query('DELETE FROM events WHERE id = ?', [eventId], (error, result) => {
    if (error) {
      console.log('Error deleting event:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json({ message: 'Event deleted successfully' });
  });
});

// サーバー起動
app.listen(3000, () => {
  console.log(`Server running on http://localhost:3000`);
});
