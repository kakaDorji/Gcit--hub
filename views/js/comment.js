document.addEventListener("DOMContentLoaded", () => {
    const postButton = document.getElementById("post-btn");
    const commentTextArea = document.getElementById("user-comment-text");
    const commentsList = document.getElementById("user-comments-list");

    const commentHandler = new CommentHandler();

    postButton.addEventListener("click", async () => {
        const commentText = commentTextArea.value.trim();

        console.log("Window User: ", window.user);
        
        // Retrieve userName dynamically, if available
        const userName = window.user ? window.user.name : "Anonymous";
        const appId = commentHandler.appId;

        if (!commentText) {
            alert("Please enter a comment before posting.");
            return;
        }

        try {
            const response = await axios.post("/api/v1/apps/postComment", {
                text: commentText,
                userName,  // Pass userName instead of userId
                appId,
            });

            if (response.status === 200) {
                commentTextArea.value = "";  // Clear textarea
                commentHandler.loadComments();  // Reload comments
            }
        } catch (error) {
            console.error("Error posting comment:", error);
            alert("Failed to post comment. Please try again.");
        }
    });
});

export class CommentHandler {
    constructor() {
        this.commentsList = document.getElementById("user-comments-list");
        this.appId = this.getAppIdFromUrl();

        this.initialize();
    }

    getAppIdFromUrl() {
        return window.location.href.split('/').pop();
    }

    async initialize() {
        await this.loadComments();
    }

    async loadComments() {
        try {
            const response = await axios.get(`/api/v1/apps/getComments/${this.appId}`);
            if (response.status === 200 && response.data.success) {
                this.displayComments(response.data.data);
            }
        } catch (error) {
            console.error("Error loading comments:", error);
            this.showError("Failed to load comments. Please refresh the page.");
        }
    }

    displayComments(comments) {
        this.commentsList.innerHTML = ''; // Clear existing comments

        if (!comments || comments.length === 0) {
            this.commentsList.innerHTML = '<p class="text-muted">No comments yet. Be the first to comment!</p>';
            return;
        }

        comments.forEach(comment => {
            const commentElement = this.createCommentElement(comment);
            this.commentsList.appendChild(commentElement);
        });
    }

    createCommentElement(comment) {
        const div = document.createElement("div");
        div.classList.add("userComment", "pt-4");

        const userImage = '/images/default.jpg';
        const userName = comment.userName || 'Anonymous';

        div.innerHTML = `
            <div class="user d-flex">
                <img src="${userImage}" width="50" height="50" alt="user" />
                <h6 class="ps-3 pt-2 fw-bold">${userName}</h6>
            </div>
            <p class="ps-3 pt-2">${this.escapeHtml(comment.text)}</p>
            <small class="text-muted ps-3">${this.formatDate(comment.createdAt)}</small>
        `;

        return div;
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    showError(message) {
        alert(message);
    }
}

// Initialize the comment handler when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    window.commentHandler = new CommentHandler();
});
