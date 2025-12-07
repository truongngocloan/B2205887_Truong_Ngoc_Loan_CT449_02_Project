<template>
    <div class="search-select position-relative" v-click-outside="close">
        
        <div class="form-control d-flex flex-wrap gap-1 align-items-center bg-white" @click="toggle" style="min-height: 38px; cursor: text;">
            
            <template v-if="multiple && Array.isArray(modelValue)">
                <span v-for="(id, index) in modelValue" :key="id" class="badge bg-primary d-flex align-items-center">
                    {{ getLabel(id) }}
                    <i class="fas fa-times ms-2 cursor-pointer" @click.stop="removeItem(index)"></i>
                </span>
            </template>

            <input 
                type="text" 
                class="border-0 flex-grow-1" 
                :placeholder="multiple && modelValue.length > 0 ? '' : placeholder"
                v-model="searchText"
                @input="onInput"
                style="outline: none; min-width: 100px;"
            />
            
            <i class="fas fa-chevron-down small text-muted ms-auto"></i>
        </div>

        <ul v-if="isOpen" class="list-group position-absolute w-100 shadow-sm dropdown-list mt-1">
            <li 
                v-for="item in filteredOptions" 
                :key="item[valueField]" 
                class="list-group-item list-group-item-action cursor-pointer"
                :class="{ 'active': isSelected(item[valueField]) }"
                @click="selectItem(item)"
            >
                {{ item[labelField] }}
                <i v-if="isSelected(item[valueField])" class="fas fa-check float-end"></i>
            </li>
            <li v-if="filteredOptions.length === 0" class="list-group-item text-muted text-center">
                Không tìm thấy
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        options: { type: Array, required: true },
        modelValue: { type: [String, Array], default: "" }, // Chấp nhận cả Chuỗi hoặc Mảng
        labelField: { type: String, required: true },
        valueField: { type: String, default: "_id" },
        placeholder: { type: String, default: "Chọn..." },
        multiple: { type: Boolean, default: false } // Biến bật tắt chế độ chọn nhiều
    },
    emits: ["update:modelValue"],
    data() {
        return {
            isOpen: false,
            searchText: "",
        };
    },
    computed: {
        filteredOptions() {
            if (!this.searchText) return this.options;
            return this.options.filter(opt => 
                String(opt[this.labelField]).toLowerCase().includes(this.searchText.toLowerCase())
            );
        }
    },
    methods: {
        toggle() { this.isOpen = !this.isOpen; },
        close() { this.isOpen = false; },
        onInput() { this.isOpen = true; },
        
        getLabel(id) {
            const found = this.options.find(opt => opt[this.valueField] === id);
            return found ? found[this.labelField] : id;
        },
        
        isSelected(id) {
            if (this.multiple && Array.isArray(this.modelValue)) {
                return this.modelValue.includes(id);
            }
            return this.modelValue === id;
        },

        selectItem(item) {
            const id = item[this.valueField];

            if (this.multiple) {
                // Logic cho chọn nhiều
                const newValue = [...(this.modelValue || [])];
                const index = newValue.indexOf(id);
                
                if (index === -1) {
                    newValue.push(id); // Chưa có thì thêm vào
                } else {
                    newValue.splice(index, 1); // Có rồi thì bỏ chọn
                }
                this.$emit("update:modelValue", newValue);
                this.searchText = ""; // Reset ô tìm kiếm để chọn tiếp
                // Không đóng menu (isOpen) để user chọn tiếp
            } else {
                // Logic cho chọn 1 (Giữ nguyên cũ)
                this.$emit("update:modelValue", id);
                this.searchText = item[this.labelField];
                this.isOpen = false;
            }
        },

        removeItem(index) {
            const newValue = [...this.modelValue];
            newValue.splice(index, 1);
            this.$emit("update:modelValue", newValue);
        }
    },
    // Directive click-outside giữ nguyên như cũ
    directives: {
        clickOutside: {
            mounted(el, binding) {
                el.clickOutsideEvent = function(event) {
                    if (!(el === event.target || el.contains(event.target))) binding.value(event);
                };
                document.body.addEventListener('click', el.clickOutsideEvent);
            },
            unmounted(el) { document.body.removeEventListener('click', el.clickOutsideEvent); }
        }
    }
};
</script>

<style scoped>
.dropdown-list { max-height: 200px; overflow-y: auto; z-index: 1000; }
.cursor-pointer { cursor: pointer; }
.badge { font-size: 0.9em; padding: 0.5em 0.7em; }
</style>