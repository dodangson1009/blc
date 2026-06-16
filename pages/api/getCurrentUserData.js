export default function getCurrentUser(req, res) {
  res.status(200).json({ name: 'Guest', avatar: null })
}
