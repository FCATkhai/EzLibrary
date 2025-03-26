<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth.store";
import { useNhanVienAdmin } from "@/composables/admin/useNhanVienAdmin";
import { useToast } from "vue-toastification";

const toast = useToast();

const authStore = useAuthStore();
const { fetchNhanVienById, editNhanVien, changePassword } = useNhanVienAdmin();


const userId = computed(() => authStore.user?.maNguoiDung);
const nhanVien = ref(null);
const activeTab = ref("profile");
const isEditing = ref(false);

const editedInfo = ref({
    hoTenNV: "",
    chucVu: "",
    diaChi: "",
    soDienThoai: "",
});

const passwordData = ref({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
});

// Lấy thông tin nhân viên
onMounted(async () => {
    if (userId.value) {
        nhanVien.value = await fetchNhanVienById(userId.value);
        if (nhanVien.value) {
            editedInfo.value = { ...nhanVien.value };
        }
    }
});

// Bật/Tắt chế độ chỉnh sửa
const toggleEdit = () => {
    if (isEditing.value) {
        editedInfo.value = { ...nhanVien.value }; // Khôi phục dữ liệu nếu hủy chỉnh sửa
    }
    isEditing.value = !isEditing.value;
};

// Cập nhật thông tin nhân viên
const updateProfile = async () => {
    try {
        await editNhanVien(userId.value, editedInfo.value);
        nhanVien.value = { ...editedInfo.value };
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
        toast.error(error.response?.data?.message ||"Đổi mật khẩu thất bại!");
    }
};
</script>

<template>
    <div class="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">Hồ sơ nhân viên</h2>

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
            <label class="block mb-2 text-sm font-medium text-gray-700">Họ tên</label>
            <input v-model="editedInfo.hoTenNV" class="w-full p-2 border rounded-lg mb-3" :disabled="!isEditing" />

            <label class="block mb-2 text-sm font-medium text-gray-700">Chức vụ</label>
            <input v-model="editedInfo.chucVu" class="w-full p-2 border rounded-lg mb-3 bg-gray-100" disabled />

            <label class="block mb-2 text-sm font-medium text-gray-700">Địa chỉ</label>
            <input v-model="editedInfo.diaChi" class="w-full p-2 border rounded-lg mb-3" :disabled="!isEditing" />

            <label class="block mb-2 text-sm font-medium text-gray-700">Số điện thoại</label>
            <input v-model="editedInfo.soDienThoai" class="w-full p-2 border rounded-lg mb-3" :disabled="!isEditing" />

            <!-- Nút Chỉnh sửa / Cập nhật -->
            <div class="flex gap-2">
                <button v-if="!isEditing" @click="toggleEdit"
                    class="btn btn-soft btn-warning">
                    <i class="fa-solid fa-pen-to-square"></i> Chỉnh sửa
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
