<script>
export default {
    props: {
        books: { type: Array, default: [] } 
    },
    methods: {
        goToDetail(id) {
            this.$router.push({ name: 'book.detail', params: { id } });
        }
    }
};
</script>

<template>
    <div class="row row-cols-2 row-cols-md-4 row-cols-lg-6 g-4">
        <div class="col" v-for="book in books" :key="book._id">
            <div class="book-item cursor-pointer" @click="goToDetail(book._id)">
                <div class="book-cover-wrapper mb-3">
                    <img :src="book.hinhAnh" class="book-cover" alt="Book Cover">
                </div>
                
                <div class="book-info">
                    <h6 class="book-title text-truncate-2">{{ book.tenSach }}</h6>
                    
                    <p class="book-author">
                        {{ book.tacGiaInfo?.map(tg => tg.tenTacGia).join(', ') || 'Đang cập nhật' }}
                    </p>
                    
                    <p class="book-year">{{ book.namXuatBan || '2024' }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.cursor-pointer { cursor: pointer; }

/* Wrapper ảnh để tạo bóng đổ đẹp */
.book-cover-wrapper {
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.book-item:hover .book-cover-wrapper {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.2);
}

.book-cover {
    width: 100%;
    aspect-ratio: 2/3; /* Tỷ lệ chuẩn sách dọc */
    object-fit: cover;
}

/* Typography giống Perlego */
.book-title {
    font-weight: 700;
    font-size: 0.95rem;
    color: #222;
    margin-bottom: 4px;
    line-height: 1.3;
}

.book-author, .book-year {
    font-size: 0.85rem;
    color: #666;
    margin-bottom: 2px;
}

/* Cắt chữ nếu tên quá dài (2 dòng) */
.text-truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>