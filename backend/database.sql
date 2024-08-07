CREATE DATABASE jwttutorial;

CREATE TABLE users{
user_id uuid SERIAL PRIMARY KEY DEFAULT 
uuid_generate_v4(),
user_name VARCHAR(255)  NOT NULL,
    user_email VARCHAR(255) NOT NULL,
        user_password VARCHAR(255) NOT NULL

}

/*fake insert*/
INSERT INTO users (user_name, user_email, user_password)
VALUES ('abdalla', 'abdalla.@example.com', 'hashed_password');



-- Create a tasks table
CREATE TABLE tasks (
    user_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);