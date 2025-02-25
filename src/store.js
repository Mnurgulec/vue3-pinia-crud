import { defineStore } from 'pinia';

export const usePostStore = defineStore('postStore', {
  state: () => ({
    posts: [],
    loading: false,
    error: null
  }),
    actions: {

      async fetchPosts() {
        this.loading = true;
        this.error = null;
        try {
          const response = await fetch('https://jsonplaceholder.typicode.com/posts');
          if (!response.ok) {
            throw new Error('Veri çekme hatası');
          }
          const data = await response.json();
          this.posts = [...data.slice(0, 10)];
        } catch (err) {
          this.error = err.message;
        } finally {
          this.loading = false;
        }
      },
    async addPost(newPost) {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newPost)
        });

        if (!response.ok) {
          throw new Error('Gönderme hatası');
        }

        const data = await response.json();
        data.id = this.posts.length + 1;
        this.posts = [...this.posts, data];
      } catch (err) {
        this.error = err.message;
      }
    },
    async updatePost(updatedPost) {
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${updatedPost.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedPost)
        });

        if (!response.ok) {
          throw new Error('Güncelleme hatası');
        }

        this.posts = this.posts.map(post =>
          post.id === updatedPost.id ? { ...post, title: updatedPost.title } : post
        );
      } catch (err) {
        this.error = err.message;
      }
    },
    
    async deletePost(id) {
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Silme hatası');
        }

        this.posts = this.posts.filter(post => post.id !== id);
      } catch (err) {
        this.error = err.message;
      }
    }
  }
});
