import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

// GET /posts — lista postova.
// Podržava sortiranje i paginaciju kroz query parametre:
//   ?_sort=createdAt&_order=desc   (sortiranje)
//   ?_page=1&_limit=6              (paginacija)
//   ?category=Programiranje        (filter po kategoriji)
//   ?q=react                       (pretraga po naslovu/sadržaju)
// Uvek vraća JSON niz (kao json-server), a ukupan broj zapisa šalje
// kroz X-Total-Count zaglavlje, kako postojeći frontend nastavlja da radi.
export const getPosts = async (req, res) => {
  try {
    const { _sort = "createdAt", _order = "desc", _page, _limit, category, q } = req.query;

    const filter = {};
    if (category && category !== "Sve") filter.category = category;
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
      ];
    }

    const sort = { [_sort]: _order === "asc" ? 1 : -1 };

    const total = await Post.countDocuments(filter);
    res.set("X-Total-Count", String(total));
    res.set("Access-Control-Expose-Headers", "X-Total-Count");

    let query = Post.find(filter).sort(sort);

    // Paginacija se primenjuje samo ako je zadat _page parametar.
    if (_page) {
      const page = Math.max(parseInt(_page, 10) || 1, 1);
      const limit = Math.max(parseInt(_limit, 10) || 6, 1);
      query = query.skip((page - 1) * limit).limit(limit);
    }

    const posts = await query.exec();
    return res.json(posts.map((p) => p.toJSON()));
  } catch (error) {
    return res.status(500).json({ message: "Greška pri učitavanju postova", error: error.message });
  }
};

// GET /posts/:id — jedan post.
export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post nije pronađen" });
    return res.json(post.toJSON());
  } catch {
    return res.status(404).json({ message: "Post nije pronađen" });
  }
};

// POST /posts — kreiranje posta (samo prijavljeni korisnik).
// Autor i datum se postavljaju na serveru iz tokena, ne veruje se klijentu.
export const createPost = async (req, res) => {
  try {
    const { title, content, category, imageUrl } = req.body;

    const post = await Post.create({
      title,
      content,
      category,
      authorId: req.user.id,
      authorName: req.user.username,
      imageUrl: imageUrl || `https://picsum.photos/seed/${Date.now()}/800/400`,
      likes: [],
    });

    return res.status(201).json(post.toJSON());
  } catch (error) {
    return res.status(500).json({ message: "Greška pri kreiranju posta", error: error.message });
  }
};

// PUT /posts/:id — ažuriranje posta.
// Dozvoljeno autoru posta ili administratoru.
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post nije pronađen" });

    const isOwner = post.authorId === req.user.id;
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Nemate dozvolu za izmenu ovog posta." });
    }

    const { title, content, category } = req.body;
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (category !== undefined) post.category = category;
    await post.save();

    return res.json(post.toJSON());
  } catch (error) {
    return res.status(500).json({ message: "Greška pri ažuriranju posta", error: error.message });
  }
};

// DELETE /posts/:id — brisanje posta (samo administrator).
// Brišu se i svi komentari vezani za taj post.
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: "Post nije pronađen" });
    await Comment.deleteMany({ postId: req.params.id });
    return res.json({ message: "Post obrisan", id: req.params.id });
  } catch (error) {
    return res.status(500).json({ message: "Greška pri brisanju posta", error: error.message });
  }
};

// POST /posts/:id/like — posebna funkcionalnost: lajkovanje/odlajkovanje posta.
// Ako je korisnik već lajkovao, lajk se uklanja (toggle).
export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post nije pronađen" });

    const userId = req.user.id;
    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id !== userId);
    } else {
      post.likes.push(userId);
    }
    await post.save();

    return res.json(post.toJSON());
  } catch (error) {
    return res.status(500).json({ message: "Greška pri lajkovanju", error: error.message });
  }
};
