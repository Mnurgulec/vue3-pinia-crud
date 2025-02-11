<template>
  <div class="container mt-4">
    <h1 class="text-center text-primary mb-4">Vue Fetch API & Pinia</h1>

    <div class="d-flex justify-content-center mb-3">
      <button class="btn btn-primary" @click="fetchPosts"> Rastgele Veri Getir</button>
    </div>

    <div class="card p-3 shadow-sm">
      <h5 class="text-center">Yeni Gönderi Ekle</h5>
      <div class="input-group mt-3">
        <input v-model="newTitle" class="form-control" placeholder="Başlık girin..." />
        <button class="btn btn-success" @click="addNewPost">Veriyi Ekle</button>
      </div>
    </div>

    <p v-if="loading" class="text-center mt-3 text-info">Yükleniyor...</p>
    <p v-if="error" class="text-center mt-3 text-danger">Hata: {{ error }}</p>

    <ul class="list-group mt-3">
      <li 
        v-for="post in posts" 
        :key="post.id" 
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <span>{{ post.title }}</span>
        <div>
          <button class="btn btn-warning btn-sm me-2" @click="editPost(post)">Düzenle</button>
          <button class="btn btn-danger btn-sm" @click="deletePost(post.id)">Sil</button>
        </div>
      </li>
    </ul>

    <!-- Güncelleme Modalı -->
    <div v-if="isEditModalOpen" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Gönderiyi Güncelle</h5>
            <button type="button" class="btn-close" @click="closeEditModal"></button>
          </div>
          <div class="modal-body">
            <input v-model="editedTitle" class="form-control" placeholder="Yeni başlık girin..." />
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeEditModal">İptal</button>
            <button class="btn btn-primary" @click="saveEditPost">Güncelle</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { usePostStore } from './store';

export default {
  setup() {
    const store = usePostStore();
    const newTitle = ref('');

    // Güncelleme için modal değişkenleri
    const isEditModalOpen = ref(false);
    const editedTitle = ref('');
    const selectedPostId = ref(null);

    const fetchPosts = () => {
      store.fetchPosts();
    };

    const addNewPost = () => {
      if (newTitle.value.trim()) {
        store.addPost({ title: newTitle.value, body: 'Test içerik', userId: 1 });
        newTitle.value = ''; // **Input temizle**
      }
    };

    const deletePost = (id) => {
      store.deletePost(id);
    };

    const editPost = (post) => {
      selectedPostId.value = post.id;
      editedTitle.value = post.title;
      isEditModalOpen.value = true;
    };

    const saveEditPost = () => {
      if (editedTitle.value.trim()) {
        store.updatePost({ id: selectedPostId.value, title: editedTitle.value, body: 'Updated içerik' });
        closeEditModal();
      }
    };

    const closeEditModal = () => {
      isEditModalOpen.value = false;
      editedTitle.value = '';
      selectedPostId.value = null;
    };

    return {
      fetchPosts,
      addNewPost,
      deletePost,
      editPost,
      saveEditPost,
      closeEditModal,
      newTitle,
      editedTitle,
      isEditModalOpen,
      posts: computed(() => store.posts),
      loading: computed(() => store.loading),
      error: computed(() => store.error)
    };
  }
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
}

.card {
  background: #f8f9fa;
  border-radius: 10px;
}

.list-group-item {
  transition: 0.3s;
}

.list-group-item:hover {
  background: #e9ecef;
}

.modal {
  display: block;
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 1050;
}
</style>
