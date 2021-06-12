const addPostQuery = () => {
  return ` INSERT INTO POST (title, content, image_path, video_url, creation_date, subreddit_id, user_id)
  VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`;
};

const getPostQuery = () => {
  return `SELECT p.id as post_id, p.title, p.content, p.image_path, p.video_url,
  p.creation_date, p.user_id, ru.nickname as user_nickname, p.subreddit_id, s.name
  as subreddit_name, (SELECT SUM (vote) FROM post_vote WHERE post_id = p.id) as votes,
  (SELECT COUNT(c.id) FROM COMMENT c WHERE c.post_id = p.id) as comment_count
  FROM post p JOIN reddit_user ru on p.user_id = ru.id JOIN
  subreddit s on p.subreddit_id = s.id WHERE p.id = $1`;
};

const getPostsQuery = () => {
  return `SELECT p.id as post_id, p.title, p.content, p.image_path, p.video_url,
  p.creation_date, p.user_id, ru.nickname as user_nickname, p.subreddit_id, s.name
  as subreddit_name, (
CASE WHEN (SELECT SUM (vote) FROM post_vote WHERE post_id = p.id) IS NULL THEN 0
     ELSE (SELECT SUM (vote) FROM post_vote WHERE post_id = p.id)
END
) as votes,
(SELECT COUNT(c.id) FROM COMMENT c WHERE c.post_id = p.id) as comment_count
FROM post p JOIN reddit_user ru on p.user_id = ru.id JOIN
  subreddit s on p.subreddit_id = s.id ORDER BY "creation_date" DESC LIMIT $1 OFFSET $2`;
};

const getHotPostsQuery = () => {
  return `SELECT p.id as post_id, p.title, p.content, p.image_path, p.video_url,
  p.creation_date, p.user_id, ru.nickname as user_nickname, p.subreddit_id, s.name
  as subreddit_name, (
CASE WHEN (SELECT SUM (vote) FROM post_vote WHERE post_id = p.id) IS NULL THEN 0
     ELSE (SELECT SUM (vote) FROM post_vote WHERE post_id = p.id)
END
) as votes,
(SELECT COUNT(c.id) FROM COMMENT c WHERE c.post_id = p.id) as comment_count
FROM post p JOIN reddit_user ru on p.user_id = ru.id JOIN
  subreddit s on p.subreddit_id = s.id ORDER BY comment_count DESC LIMIT $1 OFFSET $2`;
};

const getBestPostsQuery = () => {
  return `SELECT p.id as post_id, p.title, p.content, p.image_path, p.video_url,
  p.creation_date, p.user_id, ru.nickname as user_nickname, p.subreddit_id, s.name
  as subreddit_name, (
CASE WHEN (SELECT SUM (vote) FROM post_vote WHERE post_id = p.id) IS NULL THEN 0
     ELSE (SELECT SUM (vote) FROM post_vote WHERE post_id = p.id)
END
) as votes,
(SELECT COUNT(c.id) FROM COMMENT c WHERE c.post_id = p.id) as comment_count
FROM post p JOIN reddit_user ru on p.user_id = ru.id JOIN
  subreddit s on p.subreddit_id = s.id ORDER BY votes DESC LIMIT $1 OFFSET $2`;
};

const getPostsFromSubredditQuery = () => {
  return `SELECT p.id as post_id, p.title, p.content, p.image_path, p.video_url,
  p.creation_date, p.user_id, ru.nickname as user_nickname, p.subreddit_id, s.name
  as subreddit_name, (
    CASE WHEN (SELECT SUM (vote) FROM post_vote WHERE post_id = p.id) IS NULL THEN 0
         ELSE (SELECT SUM (vote) FROM post_vote WHERE post_id = p.id)
    END
    ) as votes,
    (SELECT COUNT(c.id) FROM COMMENT c WHERE c.post_id = p.id) as comment_count
    FROM post p JOIN reddit_user ru on p.user_id = ru.id JOIN
  subreddit s on p.subreddit_id = s.id WHERE p.subreddit_id = $1 ORDER BY "creation_date" DESC LIMIT $2 OFFSET $3`;
};

const getHotFromSubredditQuery = () => {
  return `SELECT p.id as post_id, p.title, p.content, p.image_path, p.video_url,
  p.creation_date, p.user_id, ru.nickname as user_nickname, p.subreddit_id, s.name
  as subreddit_name, (
    CASE WHEN (SELECT SUM (vote) FROM post_vote WHERE post_id = p.id) IS NULL THEN 0
         ELSE (SELECT SUM (vote) FROM post_vote WHERE post_id = p.id)
    END
    ) as votes,
    (SELECT COUNT(c.id) FROM COMMENT c WHERE c.post_id = p.id) as comment_count
    FROM post p JOIN reddit_user ru on p.user_id = ru.id JOIN
  subreddit s on p.subreddit_id = s.id WHERE p.subreddit_id = $1 ORDER BY comment_count DESC LIMIT $2 OFFSET $3`;
};

const getBestPostsFromSubredditQuery = () => {
  return `SELECT p.id as post_id, p.title, p.content, p.image_path, p.video_url,
  p.creation_date, p.user_id, ru.nickname as user_nickname, p.subreddit_id, s.name
  as subreddit_name, (
    CASE WHEN (SELECT SUM (vote) FROM post_vote WHERE post_id = p.id) IS NULL THEN 0
         ELSE (SELECT SUM (vote) FROM post_vote WHERE post_id = p.id)
    END
    ) as votes,
    (SELECT COUNT(c.id) FROM COMMENT c WHERE c.post_id = p.id) as comment_count 
    FROM post p JOIN reddit_user ru on p.user_id = ru.id JOIN
  subreddit s on p.subreddit_id = s.id WHERE p.subreddit_id = $1 ORDER BY votes DESC LIMIT $2 OFFSET $3`;
};

const getCommentsForPostsQuery = () => {
  return `SELECT c.id, c.content, c.parent_comment_id, c.post_id, 
  ru.id as user_id, ru.nickname FROM COMMENT c 
  JOIN REDDIT_USER ru ON ru.id = c.user_id WHERE post_id = $1`;
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

const getAllSubredditsQuery = () => {
  return `SELECT s.id, s.name, 
  (SELECT COUNT(sb.id) 
  FROM SUBREDDIT sb JOIN SUBREDDIT_USER sub ON sb.id = sub.subreddit_id
  WHERE sb.id = s.id GROUP BY sb.id) as members_count
  FROM SUBREDDIT s JOIN SUBREDDIT_USER su ON s.id = su.subreddit_id 
  GROUP BY s.id`;
};

const getSubredditByNameQuery = () => {
  return `SELECT s.id, s.name, s.description,
  (SELECT COUNT(sb.id) 
  FROM SUBREDDIT sb JOIN SUBREDDIT_USER sub ON sb.id = sub.subreddit_id
  WHERE sb.id = s.id GROUP BY sb.id) as members_count
  FROM SUBREDDIT s JOIN SUBREDDIT_USER su ON s.id = su.subreddit_id WHERE s.name = $1
  GROUP BY s.id`;
};

const getUsersSubredditsQuery = () => {
  return `SELECT s.id, s.name, 
  (SELECT COUNT(sb.id) 
  FROM SUBREDDIT sb JOIN SUBREDDIT_USER sub ON sb.id = sub.subreddit_id
  WHERE sb.id = s.id GROUP BY sb.id) as members_count
  FROM SUBREDDIT s JOIN SUBREDDIT_USER su ON s.id = su.subreddit_id 
  WHERE su.user_id = $1`;
};

exports.getPostQuery = getPostQuery;
exports.getAllSubredditsQuery = getAllSubredditsQuery;
exports.getUsersSubredditsQuery = getUsersSubredditsQuery;
exports.addPostQuery = addPostQuery;
exports.getPostsQuery = getPostsQuery;
exports.getCommentsForPostsQuery = getCommentsForPostsQuery;
exports.postCommentQuery = postCommentQuery;
exports.getPostsFromSubredditQuery = getPostsFromSubredditQuery;
exports.getSubredditByNameQuery = getSubredditByNameQuery;
exports.getBestPostsQuery = getBestPostsQuery;
exports.getBestPostsFromSubredditQuery = getBestPostsFromSubredditQuery;
exports.getHotFromSubredditQuery = getHotFromSubredditQuery;
exports.getHotPostsQuery = getHotPostsQuery;
