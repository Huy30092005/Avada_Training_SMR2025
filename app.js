const USERS_URL = 'https://jsonplaceholder.typicode.com/users';
const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';
const COMMENTS_URL = 'https://jsonplaceholder.typicode.com/comments';

async function fetchData() {
    // API requests
    const [users, posts, comments] = await Promise.all([
        fetch(USERS_URL).then(res => res.json()),
        fetch(POSTS_URL).then(res => res.json()),   
        fetch(COMMENTS_URL).then(res => res.json())
    ]);

/*  1. Use this Fake JSON API: https://jsonplaceholder.typicode.com/
    2. Get data from all users from API above. You will get a list of 10 users.
    3. Get all the `posts` and `comments` from the API. Map the data with the users array.
*/
    const usersData = users.map(user => {
    const userPosts = posts.filter(post => post.userId === user.id);
    const userComments = comments.filter(comment => userPosts.some(post => post.id === comment.postId));
    
    return {
        ...user,
        posts: userPosts.map(({ id, title, body }) => ({ id, title, body})),
        comments: userComments.map(({ id, postId, email, body }) => ({ id, postId, email, body }))
    };
});

    // 4. Filter only users with more than 3 comments.
    const filteredUsers = usersData.filter(user => user.comments.length > 3);

    // 5. Reformat the data with the count of comments and posts
    const reformattedUsers = usersData.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        postsCount: user.posts.length,
        commentsCount: user.comments.length

    }));

    // 6. Who is the user with the most comments/posts?
    const mostCommentedUser = reformattedUsers.reduce((max, user) =>
        user.commentsCount > max.commentsCount ? user : max, reformattedUsers[0]
    );

    const mostPostedUser = reformattedUsers.reduce((max, user) =>
        user.postsCount > max.postsCount ? user : max, reformattedUsers[0]
    );

    // 7. Sort the list of users by the postsCount value descending
    const sortedByPosts = reformattedUsers.sort((a, b) => b.postsCount - a.postsCount);

    // 8. Get the post with ID of 1 via API request, at the same time get comments for post ID of 1 via another API request. Merge the post data
    const [post1, post1Comments] = await Promise.all([
        // API request for post ID 1
        fetch(`${POSTS_URL}/1`).then(res => res.json()),
        fetch(`${POSTS_URL}/1/comments`).then(res => res.json())
    ]);
        const mergedPost1 = { ...post1, comments: post1Comments};

    // Output results
    console.log('Users with posts and comments:', usersData);
    console.log('Filtered users with more than 3 comments:', filteredUsers);
    console.log('Most commented user:', mostCommentedUser);
    console.log('Most posted user:', mostPostedUser);
    console.log('Sorted users by posts count:', sortedByPosts);
    console.log('Merged post ID 1 with comments:', mergedPost1);
    }
    // Function call
    fetchData();



