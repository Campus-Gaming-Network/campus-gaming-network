import Router from 'express-promise-router';

const router = Router();

router.get('/:id', async (req, res) => {
  res.json({ id: req.params.id });
});

router.post('/', async (req, res) => {
  res.send('events post!');
});

router.put('/:id', async (req, res) => {
  res.json({ id: req.params.id });
});

router.delete('/:id', async (req, res) => {
  res.json({ id: req.params.id });
});

router.get('/:id/users', async (req, res) => {
  res.json({ id: req.params.id });
});

export default router;
