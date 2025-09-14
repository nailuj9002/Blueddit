// Datos de ejemplo para las publicaciones
let posts = JSON.parse(localStorage.getItem('blueddit_posts')) || [
    {
        id: 1,
        title: "Mi experiencia con el phishing en redes sociales",
        content: "Hace unas semanas recibí un mensaje que parecía legítimo de mi banco, pero resultó ser un intento de phishing. Es alarmante lo convincentes que pueden ser estos ataques.",
        author: "AnaTorres",
        date: "2023-10-15",
        votes: 24,
        comments: [
            { id: 1, author: "SeguridadFirst", content: "Lamentablemente es muy común. Siempre verifica la URL antes de ingresar datos.", date: "2023-10-15" },
            { id: 2, author: "CyberGuard", content: "¿Podrías compartir más detalles sobre cómo identificaste que era phishing?", date: "2023-10-16" }
        ],
        community: "Offline_Security"
    },
    {
        id: 2,
        title: "La importancia de verificación en dos pasos",
        content: "Después de que hackearan mi cuenta de email, implementé verificación en dos pasos en todas mis cuentas. ¡Es increíble que esta no sea una opción por defecto en todos los servicios!",
        author: "CarlosM",
        date: "2023-10-14",
        votes: 37,
        comments: [],
        community: "Offline_Security"
    }
];

// Estado de la aplicación
let currentPage = 'home';
let currentUser = localStorage.getItem('blueddit_current_user') || null;

// Elementos DOM
const postsContainer = document.getElementById('posts-container');
const createPostForm = document.getElementById('create-post-form');
const postForm = document.getElementById('post-form');
const loginModal = document.getElementById('login-modal');
const loginForm = document.getElementById('login-form');
const loginLink = document.getElementById('login-link');
const createPostLink = document.getElementById('create-post-link');
const sidebarCreatePost = document.getElementById('sidebar-create-post');
const closeModalBtn = document.querySelector('.close-modal');
const registerLink = document.getElementById('register-link');
const navLinks = document.querySelectorAll('nav a');

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    renderPosts();
    setupEventListeners();
    updateUI();
});

// Configurar event listeners
function setupEventListeners() {
    // Navegación
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            if (page) {
                navigateTo(page);
            }
        });
    });

    // Formulario de publicación
    postForm.addEventListener('submit', handlePostSubmit);
    
    // Login
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.style.display = 'flex';
    });
    
    closeModalBtn.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });
    
    loginForm.addEventListener('submit', handleLogin);
    
    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Funcionalidad de registro no implementada. Usa cualquier credencial para "iniciar sesión".');
    });
    
    // Crear publicación
    createPostLink.addEventListener('click', (e) => {
        e.preventDefault();
        toggleCreatePostForm();
    });
    
    sidebarCreatePost.addEventListener('click', (e) => {
        e.preventDefault();
        toggleCreatePostForm();
    });
    
    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });
}

// Navegar entre páginas
function navigateTo(page) {
    currentPage = page;
    
    // Actualizar clase active en navegación
    navLinks.forEach(link => {
        if (link.getAttribute('data-page') === page) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Renderizar contenido según la página
    if (page === 'offline-security') {
        renderPosts('Offline_Security');
    } else {
        renderPosts();
    }
    
    // Ocultar formulario de creación al cambiar de página
    createPostForm.style.display = 'none';
}

// Alternar visibilidad del formulario de creación
function toggleCreatePostForm() {
    if (createPostForm.style.display === 'none') {
        createPostForm.style.display = 'block';
    } else {
        createPostForm.style.display = 'none';
    }
}

// Manejar envío del formulario de publicación
function handlePostSubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;
    const author = document.getElementById('post-author').value;
    
    const newPost = {
        id: Date.now(),
        title,
        content,
        author,
        date: new Date().toISOString().split('T')[0],
        votes: 0,
        comments: [],
        community: 'Offline_Security'
    };
    
    posts.unshift(newPost);
    savePosts();
    renderPosts();
    
    // Resetear formulario
    postForm.reset();
    createPostForm.style.display = 'none';
    
    alert('¡Publicación creada con éxito!');
}

// Manejar login
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    
    if (username) {
        currentUser = username;
        localStorage.setItem('blueddit_current_user', username);
        loginModal.style.display = 'none';
        updateUI();
        alert(`¡Bienvenido/a, ${username}!`);
    }
}

// Actualizar UI según estado
function updateUI() {
    if (currentUser) {
        loginLink.textContent = currentUser;
    } else {
        loginLink.textContent = 'Iniciar sesión';
    }
}

// Renderizar publicaciones
function renderPosts(community = null) {
    postsContainer.innerHTML = '';
    
    let filteredPosts = posts;
    if (community) {
        filteredPosts = posts.filter(post => post.community === community);
    }
    
    if (filteredPosts.length === 0) {
        postsContainer.innerHTML = '<p>No hay publicaciones todavía. ¡Sé el primero en publicar!</p>';
        return;
    }
    
    filteredPosts.forEach(post => {
        const postElement = createPostElement(post);
        postsContainer.appendChild(postElement);
    });
}

// Crear elemento de publicación
function createPostElement(post) {
    const postEl = document.createElement('div');
    postEl.className = 'post';
    postEl.dataset.id = post.id;
    
    const voteSection = document.createElement('div');
    voteSection.className = 'vote-section';
    
    const upvoteBtn = document.createElement('button');
    upvoteBtn.className = 'vote-btn upvote';
    upvoteBtn.innerHTML = '&#9650;';
    upvoteBtn.addEventListener('click', () => votePost(post.id, 1));
    
    const voteCount = document.createElement('div');
    voteCount.className = 'vote-count';
    voteCount.textContent = post.votes;
    
    const downvoteBtn = document.createElement('button');
    downvoteBtn.className = 'vote-btn downvote';
    downvoteBtn.innerHTML = '&#9660;';
    downvoteBtn.addEventListener('click', () => votePost(post.id, -1));
    
    voteSection.appendChild(upvoteBtn);
    voteSection.appendChild(voteCount);
    voteSection.appendChild(downvoteBtn);
    
    const postContent = document.createElement('div');
    postContent.className = 'post-content';
    
    const postTitle = document.createElement('h3');
    postTitle.className = 'post-title';
    postTitle.textContent = post.title;
    
    const postMeta = document.createElement('div');
    postMeta.className = 'post-meta';
    postMeta.innerHTML = `Publicado por <span class="post-author">${post.author}</span> en <span>${post.community}</span> · <span>${post.date}</span>`;
    
    const postText = document.createElement('div');
    postText.className = 'post-text';
    postText.textContent = post.content;
    
    const postActions = document.createElement('div');
    postActions.className = 'post-actions';
    
    const commentBtn = document.createElement('a');
    commentBtn.href = '#';
    commentBtn.className = 'post-action';
    commentBtn.innerHTML = '💬 Comentar';
    commentBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleComments(post.id);
    });
    
    postActions.appendChild(commentBtn);
    
    // Botón de eliminar (solo visible para el autor)
    if (isAuthor(post.author)) {
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '🗑️ Eliminar';
        deleteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            deletePost(post.id);
        });
        postActions.appendChild(deleteBtn);
    }
    
    postContent.appendChild(postTitle);
    postContent.appendChild(postMeta);
    postContent.appendChild(postText);
    postContent.appendChild(postActions);
    
    // Sección de comentarios (inicialmente oculta)
    const commentsSection = document.createElement('div');
    commentsSection.className = 'comments-section';
    commentsSection.id = `comments-${post.id}`;
    
    if (post.comments && post.comments.length > 0) {
        post.comments.forEach(comment => {
            const commentEl = createCommentElement(post.id, comment);
            commentsSection.appendChild(commentEl);
        });
    }
    
    // Formulario para nuevo comentario
    const commentForm = document.createElement('form');
    commentForm.className = 'comment-form';
    
    const commentInput = document.createElement('input');
    commentInput.type = 'text';
    commentInput.placeholder = currentUser ? 'Escribe un comentario...' : 'Inicia sesión para comentar';
    commentInput.disabled = !currentUser;
    
    const commentSubmit = document.createElement('button');
    commentSubmit.type = 'comment-post-btn';
    commentSubmit.type = 'submit';
    commentSubmit.textContent = 'Comentar';
    commentSubmit.disabled = !currentUser;
    
    commentForm.appendChild(commentInput);
    commentForm.appendChild(commentSubmit);
    
    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (commentInput.value.trim() && currentUser) {
            addComment(post.id, commentInput.value.trim());
            commentInput.value = '';
        }
    });
    
    commentsSection.appendChild(commentForm);
    postContent.appendChild(commentsSection);
    
    postEl.appendChild(voteSection);
    postEl.appendChild(postContent);
    
    return postEl;
}

// Crear elemento de comentario
function createCommentElement(postId, comment) {
    const commentEl = document.createElement('div');
    commentEl.className = 'comment';
    
    const commentMeta = document.createElement('div');
    commentMeta.className = 'comment-meta';
    commentMeta.innerHTML = `<strong>${comment.author}</strong> · ${comment.date}`;
    
    const commentContent = document.createElement('div');
    commentContent.textContent = comment.content;
    
    // Botón para eliminar comentario (solo visible para el autor)
    if (isAuthor(comment.author)) {
        const deleteCommentBtn = document.createElement('button');
        deleteCommentBtn.className = 'comment-delete-btn';
        deleteCommentBtn.innerHTML = '🗑️';
        deleteCommentBtn.title = 'Eliminar comentario';
        deleteCommentBtn.addEventListener('click', (e) => {
            e.preventDefault();
            deleteComment(postId, comment.id);
        });
        commentEl.appendChild(deleteCommentBtn);
    }
    
    commentEl.appendChild(commentMeta);
    commentEl.appendChild(commentContent);
    
    return commentEl;
}

// Votar en publicación
function votePost(postId, value) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.votes += value;
        savePosts();
        document.querySelector(`.post[data-id="${postId}"] .vote-count`).textContent = post.votes;
    }
}

// Alternar visibilidad de comentarios
function toggleComments(postId) {
    const commentsSection = document.getElementById(`comments-${postId}`);
    if (commentsSection.style.display === 'block') {
        commentsSection.style.display = 'none';
    } else {
        commentsSection.style.display = 'block';
    }
}

// Añadir comentario
function addComment(postId, content) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        const newComment = {
            id: Date.now(),
            author: currentUser,
            content,
            date: new Date().toISOString().split('T')[0]
        };
        
        if (!post.comments) {
            post.comments = [];
        }
        
        post.comments.push(newComment);
        savePosts();
        
        // Volver a renderizar los comentarios
        const commentsSection = document.getElementById(`comments-${postId}`);
        commentsSection.innerHTML = '';
        
        post.comments.forEach(comment => {
            const commentEl = createCommentElement(postId, comment);
            commentsSection.appendChild(commentEl);
        });
        
        // Añadir de nuevo el formulario
        const commentForm = document.createElement('form');
        commentForm.className = 'comment-form';
        
        const commentInput = document.createElement('input');
        commentInput.type = 'text';
        commentInput.placeholder = 'Escribe un comentario...';
        
        const commentSubmit = document.createElement('button');
        commentSubmit.type = 'submit';
        commentSubmit.textContent = 'Comentar';
        
        commentForm.appendChild(commentInput);
        commentForm.appendChild(commentSubmit);
        
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (commentInput.value.trim()) {
                addComment(postId, commentInput.value.trim());
                commentInput.value = '';
            }
        });
        
        commentsSection.appendChild(commentForm);
    }
}

// Eliminar publicación
function deletePost(postId) {
    if (confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
        posts = posts.filter(post => post.id !== postId);
        savePosts();
        renderPosts(currentPage === 'offline-security' ? 'Offline_Security' : null);
    }
}

// Eliminar comentario
function deleteComment(postId, commentId) {
    if (confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
        const post = posts.find(p => p.id === postId);
        if (post && post.comments) {
            post.comments = post.comments.filter(comment => comment.id !== commentId);
            savePosts();
            
            // Volver a renderizar los comentarios
            const commentsSection = document.getElementById(`comments-${postId}`);
            if (commentsSection) {
                commentsSection.innerHTML = '';
                
                post.comments.forEach(comment => {
                    const commentEl = createCommentElement(postId, comment);
                    commentsSection.appendChild(commentEl);
                });
                
                // Añadir de nuevo el formulario
                const commentForm = document.createElement('form');
                commentForm.className = 'comment-form';
                
                const commentInput = document.createElement('input');
                commentInput.type = 'text';
                commentInput.placeholder = 'Escribe un comentario...';
                
                const commentSubmit = document.createElement('button');
                commentSubmit.type = 'submit';
                commentSubmit.textContent = 'Comentar';
                
                commentForm.appendChild(commentInput);
                commentForm.appendChild(commentSubmit);
                
                commentForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    if (commentInput.value.trim()) {
                        addComment(postId, commentInput.value.trim());
                        commentInput.value = '';
                    }
                });
                
                commentsSection.appendChild(commentForm);
            }
        }
    }
}

// Verificar si el usuario actual es el autor
function isAuthor(postAuthor) {
    return currentUser === postAuthor;
}

// Guardar publicaciones en localStorage
function savePosts() {
    localStorage.setItem('blueddit_posts', JSON.stringify(posts));
}
