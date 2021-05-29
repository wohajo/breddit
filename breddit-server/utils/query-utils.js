const getPostQuery = () => {
  return `SELECT p.id as post_id, p.title, p.content, p.image_path, p.video_url,
    p.creation_date, p.user_id, ru.nickname as user_nickname, p.subreddit_id, s.name
    as subreddit_name, (SELECT SUM (vote) FROM post_vote WHERE post_id = p.id) as votes FROM post p JOIN reddit_user ru on p.user_id = ru.id JOIN
    subreddit s on p.subreddit_id = s.id`;
};

exports.getPostQuery = getPostQuery;
