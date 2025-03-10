// 현재 로그인된 사용자 정보 가져오기
export function getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
}

// 사용자 목록 가져오기
export async function getUsers() {
    try {
        const response = await fetch('/data/users.json');
        if (!response.ok) {
            throw new Error('네트워크 오류: 데이터를 가져올 수 없습니다.');
        }
        return await response.json();
    } catch (error) {
        console.error('사용자 목록을 가져오는 중 오류 발생:', error);
        return [];
    }
}

// 특정 사용자 정보 가져오기
export async function getUserById(userID) {
    try {
        const users = await getUsers(); 
        const user = users.find(user => user.id === userID);  
        if (user) {
            return user;
        } else {
            throw new Error('사용자를 찾을 수 없습니다.');
        }
    } catch (error) {
        console.error('사용자 정보를 가져오는 중 오류 발생:', error);
        return null; 
    }
}

// 게시글 목록 가져오기
export async function getPosts() {
    try {
        const response = await fetch('/data/posts.json');
        if (!response.ok) {
            throw new Error('네트워크 오류: 게시글 데이터를 가져올 수 없습니다.');
        }
        return await response.json();
    } catch (error) {
        console.error('게시글 목록을 가져오는 중 오류 발생:', error);
        return [];
    }
}

// 특정 게시글 정보 가져오기 
export async function getPostById() {
    try {
        const posts = await getPosts(); 
        const postId = localStorage.getItem("postid");
        const post = posts.find(post => post.id === postId);  
        if (post) {
            return post;
        } else {
            throw new Error('게시글을 찾을 수 없습니다.');
        }
    } catch (error) {
        console.error('게시글 정보를 가져오는 중 오류 발생:', error);
        return null; 
    }
}

//특정 댓글 정보 가져오기
export async function getCommentById(commentID) {
    try {
        const post = await getPostById(); 
        const comment = post.comments.find(comment => comment.id === commentID);  
        if (comment) {
            return comment;
        } else {
            throw new Error('댓글을 찾을 수 없습니다.');
        }
    } catch (error) {
        console.error('댓글 정보를 가져오는 중 오류 발생:', error);
        return null; 
    }
}