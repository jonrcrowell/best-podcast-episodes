import { v4 as uuidv4 } from "uuid";

import redis from "../../lib/redis";

export default async function upvote(req, res) {
  const { type, title, link, description, rating, genre } = req.body;

  if (!title) {
    res.status(400).json({
      error: "I can't tell what you're wanting to add. Please try again.",
    });
  } else if (title.length < 150) {
    const id = uuidv4();
    const newEntry = {
      id,
      type,
      title,
      link,
      description,
      rating,
      genre,
      created_at: Date.now(),
      score: 1,
      ip: "NA",
    };

    await redis.hset(type, id, JSON.stringify(newEntry));
    res.status(200).json({
      body: "success",
    });
  } else {
    res.status(400).json({
      error: "Max 150 characters please.",
    });
  }
}
