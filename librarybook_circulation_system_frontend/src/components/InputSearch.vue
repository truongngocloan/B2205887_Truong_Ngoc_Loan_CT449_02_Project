<template>
    <div class="search-wrapper">
        <div class="search-box shadow-sm" :class="{ 'expanded': isExpanded }">
            
            <button class="btn-search" @click="submit">
                <i class="fas fa-search"></i>
            </button>

            <input 
                ref="searchInput" 
                type="text" 
                class="input-search" 
                placeholder="Tìm kiếm sách, tác giả, lĩnh vực..." 
                :value="modelValue" 
                @input="updateModelValue" 
                @keyup.enter="submit"
            />
        </div>
    </div>
</template>

<script>
export default {
    props: { modelValue: { type: String, default: "" } },
    emits: ["submit", "update:modelValue"],
    data() {
        return {
            isExpanded: false,
        };
    },
    methods: {
        updateModelValue(e) { this.$emit("update:modelValue", e.target.value); },
        submit() { this.$emit("submit"); },
    },
    mounted() {
        // Kích hoạt animation sau 0.5s
        setTimeout(() => {
            this.isExpanded = true;
            
            // --- CẢI TIẾN: Tự động focus vào ô nhập sau khi animation bắt đầu ---
            // Dùng $nextTick để đảm bảo DOM đã render
            this.$nextTick(() => {
                if(this.$refs.searchInput) {
                    this.$refs.searchInput.focus();
                }
            });
        }, 500);
    }
};
</script>

<style scoped>
/* Giữ nguyên CSS của bạn, nó đã rất đẹp rồi */
.search-wrapper {
    display: flex;
    justify-content: center;
    height: 70px;
}

.search-box {
    display: flex;
    align-items: center;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 50px;
    padding: 5px;
    overflow: hidden;
    width: 60px;
    height: 60px;
    transition: width 0.8s cubic-bezier(0.22, 1, 0.36, 1); /* Chỉnh nhanh hơn xíu (0.8s) cho mượt */
}

.search-box.expanded {
    width: 100%;
    max-width: 650px;
    border-color: #2e59d9;
    box-shadow: 0 8px 20px rgba(46, 89, 217, 0.15) !important;
}

.btn-search {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: none;
    background: transparent;
    color: #2e59d9;
    font-size: 20px;
    cursor: pointer;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background 0.3s;
}

.btn-search:hover {
    background: #f0f4ff;
}

.input-search {
    flex-grow: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 1.1rem;
    color: #333;
    margin-left: 10px;
    margin-right: 20px;
    opacity: 0;
    transform: translateX(20px);
    transition: all 0.5s ease-out;
}

.search-box.expanded .input-search {
    opacity: 1;
    transform: translateX(0);
    transition-delay: 0.3s; /* Giảm delay chút để hiện chữ nhanh hơn */
}
</style>