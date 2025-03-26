<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth.store";
import { useDocGia } from "@/composables/useDocGia";
import { useToast } from "vue-toastification";

const authStore = useAuthStore();
const toast = useToast();
const { fetchDocGia, editDocGia, changePassword } = useDocGia();

const userId = computed(() => authStore.user?.maNguoiDung);
const docGia = ref(null);
const activeTab = ref("profile");
const isEditing = ref(false);

const editedInfo = ref({
    hoLot: "",
    ten: "",
    soDienThoai: "",
    ngaySinh: "",
    phai: "",
    diaChi: "",
});

const passwordData = ref({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
});

// Lấy thông tin độc giả
onMounted(async () => {
    if (userId.value) {
        docGia.value = await fetchDocGia({ maDG: userId.value });
        console.log(docGia.value);
        if (docGia.value) {
            editedInfo.value = { ...docGia.value };
        }
    }
});

// Bật/Tắt chế độ chỉnh sửa
const toggleEdit = () => {
    if (isEditing.value) {
        editedInfo.value = { ...docGia.value }; // Khôi phục dữ liệu nếu hủy chỉnh sửa
    }
    isEditing.value = !isEditing.value;
};

// Cập nhật thông tin độc giả
const updateProfile = async () => {
    try {
        await editDocGia(userId.value, editedInfo.value);
        docGia.value = { ...editedInfo.value };
        isEditing.value = false;
        toast.success("Cập nhật thông tin thành công!");
    } catch (error) {
        toast.error("Cập nhật thất bại!");
    }
};

// Đổi mật khẩu
const updatePassword = async () => {
    if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
        return toast.error("Mật khẩu xác nhận không khớp!");
    }
    try {
        await changePassword(userId.value, passwordData.value.oldPassword, passwordData.value.newPassword);
        toast.success("Đổi mật khẩu thành công!");
        passwordData.value = { oldPassword: "", newPassword: "", confirmPassword: "" };
    } catch (error) {
        toast.error("Đổi mật khẩu thất bại!");
    }
};
</script>

<template>
    <div class="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">Hồ sơ độc giả</h2>

        <!-- Tabs -->
        <div class="flex border-b">
            <button @click="activeTab = 'profile'"
                :class="['py-2 px-4', activeTab === 'profile' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600']">
                Thông tin cá nhân
            </button>
            <button @click="activeTab = 'password'"
                :class="['py-2 px-4', activeTab === 'password' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600']">
                Đổi mật khẩu
            </button>
        </div>

        <!-- Tab Thông tin cá nhân -->
        <div v-if="activeTab === 'profile'" class="mt-4">
            <label class="block mb-2 text-sm font-medium text-gray-700">Họ lót</label>
            <input v-model="editedInfo.hoLot" class="w-full p-2 border rounded-lg mb-3" :disabled="!isEditing" />

            <label class="block mb-2 text-sm font-medium text-gray-700">Tên</label>
            <input v-model="editedInfo.ten" class="w-full p-2 border rounded-lg mb-3" :disabled="!isEditing" />

            <label class="block mb-2 text-sm font-medium text-gray-700">Số điện thoại</label>
            <input v-model="editedInfo.soDienThoai" class="w-full p-2 border rounded-lg mb-3" :disabled="!isEditing" />

            <label class="block mb-2 text-sm font-medium text-gray-700">Ngày sinh</label>
            <input type="date" v-model="editedInfo.ngaySinh" class="w-full p-2 border rounded-lg mb-3"
                :disabled="!isEditing" />

            <label class="block mb-2 text-sm font-medium text-gray-700">Phái</label>
            <select v-model="editedInfo.phai" class="w-full p-2 border rounded-lg mb-3" :disabled="!isEditing">
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
            </select>

            <label class="block mb-2 text-sm font-medium text-gray-700">Địa chỉ</label>
            <input v-model="editedInfo.diaChi" class="w-full p-2 border rounded-lg mb-3" :disabled="!isEditing" />

            <!-- Nút Chỉnh sửa / Cập nhật -->
            <div class="flex gap-2">
                <button v-if="!isEditing" @click="toggleEdit"
                    class="btn btn-soft btn-warning">
                    <i class="fa-solid fa-pen-to-square"></i>Chỉnh sửa
                </button>
                <button v-if="isEditing" @click="updateProfile"
                    class="btn btn-info">
                    Cập nhật
                </button>
                <button v-if="isEditing" @click="toggleEdit"
                    class="btn">
                    Hủy
                </button>
            </div>
        </div>

        <!-- Tab Đổi mật khẩu -->
        <div v-if="activeTab === 'password'" class="mt-4">
            <label class="block mb-2 text-sm font-medium text-gray-700">Mật khẩu cũ</label>
            <input type="password" v-model="passwordData.oldPassword" class="w-full p-2 border rounded-lg mb-3" />

            <label class="block mb-2 text-sm font-medium text-gray-700">Mật khẩu mới</label>
            <input type="password" v-model="passwordData.newPassword" class="w-full p-2 border rounded-lg mb-3" />

            <label class="block mb-2 text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
            <input type="password" v-model="passwordData.confirmPassword" class="w-full p-2 border rounded-lg mb-3" />

            <button @click="updatePassword" class="btn btn-soft btn-warning">
                <i class="fa-solid fa-pen-to-square"></i> Đổi mật khẩu
            </button>
        </div>
    </div>
</template>
