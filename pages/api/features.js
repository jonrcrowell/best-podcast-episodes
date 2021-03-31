import redis from "../../lib/redis";

export default async function upvote(req, res) {
  const episodes = (await redis.hvals("episode"))
    .map((entry) => JSON.parse(entry))
    .sort((a, b) => b.score - a.score);

  res.status(200).json({ episodes });
}
