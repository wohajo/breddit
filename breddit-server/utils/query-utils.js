const getPostQuery = () => {
  return `SELECT p.id as post_id, p.title, p.content, p.image_path, p.video_url,
    p.creation_date, p.user_id, ru.nickname as user_nickname, p.subreddit_id, s.name
    as subreddit_name, (SELECT SUM (vote) FROM post_vote WHERE post_id = p.id) as votes FROM post p JOIN reddit_user ru on p.user_id = ru.id JOIN
    subreddit s on p.subreddit_id = s.id`;
};

const getCommentsForPostsQuery = (postId) => {
  return `SELECT c.id, c.content, c.parent_comment_id, c.post_id, 
  ru.id as user_id, ru.nickname FROM COMMENT c 
  JOIN REDDIT_USER ru ON ru.id = c.user_id WHERE post_id = ${postId}`;
};

const postCommentQuery = () => {
  return `WITH inserted as (
    INSERT INTO COMMENT (content, parent_comment_id, user_id, post_id)
    VALUES ($1, $2, $3, $4) RETURNING *
  )
  SELECT inserted.id, inserted.content, inserted.parent_comment_id, inserted.post_id, 
  ru.id as user_id, ru.nickname FROM inserted 
  JOIN REDDIT_USER ru 
  ON ru.id = inserted.user_id `;
};

exports.getPostQuery = getPostQuery;
exports.getCommentsForPostsQuery = getCommentsForPostsQuery;
exports.postCommentQuery = postCommentQuery;
