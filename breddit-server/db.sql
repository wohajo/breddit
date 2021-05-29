DROP TABLE IF EXISTS comment;
DROP TABLE IF EXISTS post_vote;
DROP TABLE IF EXISTS post;
DROP TABLE IF EXISTS subreddit_user;
DROP TABLE IF EXISTS subreddit_moderator;
DROP TABLE IF EXISTS user_role;
DROP TABLE IF EXISTS subreddit;
DROP TABLE IF EXISTS reddit_user;
DROP TABLE IF EXISTS role;

CREATE TABLE IF NOT EXISTS reddit_user ( 
  id SERIAL PRIMARY KEY,
  nickname varchar(256) NOT NULL,
  activation_guid UUID,
  activation_expire_date TIMESTAMP, 
  password varchar NOT NULL,
  email varchar(256) NOT NULL
);

CREATE TABLE IF NOT EXISTS  role (
    id SERIAL PRIMARY KEY,
    role_name varchar(256) NOT NULL
);

CREATE TABLE IF NOT EXISTS  user_role (
    id SERIAL PRIMARY KEY,
    user_id integer NOT NULL,
    role_id integer NOT NULL,
    CONSTRAINT fk_user_role_user  
        FOREIGN KEY(user_id)   
        REFERENCES reddit_user(id),  
    CONSTRAINT fk_user_role_role  
        FOREIGN KEY(role_id)   
        REFERENCES role(id)   
);

CREATE TABLE IF NOT EXISTS  subreddit (
    id SERIAL PRIMARY KEY,
    name varchar(256) NOT NULL,
    description varchar(256) NOT NULL
);

CREATE TABLE IF NOT EXISTS  subreddit_moderator (
    id SERIAL PRIMARY KEY,
    user_id integer NOT NULL,
    subreddit_id integer NOT NULL,
    CONSTRAINT fk_subreddit_moderator_user  
        FOREIGN KEY(user_id)   
        REFERENCES reddit_user(id),  
    CONSTRAINT fk_subreddit_moderator_subreddit  
        FOREIGN KEY(subreddit_id)   
        REFERENCES subreddit(id)   
);

CREATE TABLE IF NOT EXISTS subreddit_user (
    id SERIAL PRIMARY KEY,
    user_id integer NOT NULL,
    subreddit_id integer NOT NULL,
    CONSTRAINT fk_subreddit_user_user  
        FOREIGN KEY(user_id)   
        REFERENCES reddit_user(id),  
    CONSTRAINT fk_subreddit_user_subreddit  
        FOREIGN KEY(subreddit_id)   
        REFERENCES subreddit(id)   
);

CREATE TABLE IF NOT EXISTS post (
    id SERIAL PRIMARY KEY,
    title varchar(256) NOT NULL,
    content varchar,
    image_path varchar,
    video_url varchar,
    creation_date TIMESTAMP NOT NULL,
    subreddit_id integer NOT NULL,
    user_id integer NOT NULL,
    CONSTRAINT fk_post_user 
        FOREIGN KEY(user_id)   
        REFERENCES reddit_user(id),
    CONSTRAINT fk_post_subreddit
        FOREIGN KEY(subreddit_id)   
        REFERENCES subreddit(id)   
);

CREATE TABLE IF NOT EXISTS post_vote (
    id SERIAL PRIMARY KEY,
    vote smallint NOT NULL,
    user_id integer NOT NULL,
    post_id integer NOT NULL,
    CONSTRAINT fk_post_vote_user 
        FOREIGN KEY(user_id)   
        REFERENCES reddit_user(id), 
    CONSTRAINT fk_post_vote_post  
        FOREIGN KEY(post_id)   
        REFERENCES post(id)   
);

CREATE TABLE IF NOT EXISTS comment (
    id SERIAL PRIMARY KEY,
    content varchar(256) NOT NULL,
    parent_comment_id integer,
    user_id integer NOT NULL,
    post_id integer NOT NULL,
    CONSTRAINT fk_comment_user 
        FOREIGN KEY(user_id)   
        REFERENCES reddit_user(id), 
    CONSTRAINT fk_comment_parent_comment 
        FOREIGN KEY(parent_comment_id)   
        REFERENCES comment(id),
    CONSTRAINT fk_comment_post  
        FOREIGN KEY(post_id)   
        REFERENCES post(id)   
);

-- CREATE TABLE survey (
--     id SERIAL PRIMARY KEY,
--     question varchar(256) NOT NULL,
--     post_id integer NOT NULL,
--     CONSTRAINT fk_survey_post
--         FOREIGN KEY(post_id)   
--         REFERENCES post(id)   
-- );

-- CREATE TABLE survey_answer (
--     id SERIAL PRIMARY KEY,
--     answer varchar(256) NOT NULL,
--     survey_id integer NOT NULL,
--     CONSTRAINT fk_survey_answer_survey 
--         FOREIGN KEY(survey_id)   
--         REFERENCES survey(id)   
-- );

-- CREATE TABLE survey_user_answer (
--     id SERIAL PRIMARY KEY,
--     answer_id integer NOT NULL,
--     user_id integer NOT NULL,
--     CONSTRAINT fk_survey_user_answer_user
--         FOREIGN KEY(user_id)   
--         REFERENCES reddit_user(id),
--     CONSTRAINT fk_survey_user_answer_answer
--         FOREIGN KEY(answer_id)   
--         REFERENCES survey_answer(id)


