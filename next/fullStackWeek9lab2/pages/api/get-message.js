async function handler(req, res) {
  const response = await fetch('http://localhost:8000/');
  const data = await response.text();
  res.json(data)
}

export default handler;
