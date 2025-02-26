const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = 3000

app.use(cors());
app.use(express.json())

// イベント追加API
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

// 指定したIDのイベントのみ取得
app.get('/api/events/:id', (req, res) => {
  const eventId = Number(req.params.id);
  db.query('SELECT * FROM events WHERE id = ?', [eventId], (error, results) => {
    if (error) {
      console.log('Error fetching events:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    res.status(200).json(results[0]);
  });
});

app.delete('/api/events/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM events WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to delete event' });
    res.json({ message: 'Event deleted' });
  });
});


// サーバー起動
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
