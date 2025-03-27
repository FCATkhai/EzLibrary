<!-- root/frontend/src/views/admin/QLNhanVien.vue -->
<script lang="ts" setup>
import { ref, onMounted, useTemplateRef } from "vue";
import { useNhanVienAdmin } from "@/composables/admin/useNhanVienAdmin";
import { useToast } from "vue-toastification";
import type { INhanVien } from "~/shared/interface";
import { USER_ROLES } from "~/shared/userRoles";

const {
    nhanViens,
    page,
    totalPages,
    loading,
    searchTerm,
    fetchNhanViens,
    fetchNhanVienById,
    addNhanVien,
    editNhanVien,
    removeNhanVien,
    resetPassword,
} = useNhanVienAdmin();

const toast = useToast();

type ModalStatus = "adding" | "editing";
const modalStatus = ref<ModalStatus>("adding");
const closeModalBtn = useTemplateRef("closeModalBtn");
const closeResetModalBtn = useTemplateRef("closeResetModalBtn");
const closeDeleteModalBtn = useTemplateRef("closeDeleteModalBtn");

const nhanVienRef = ref<INhanVien | null>(null);
const newPassword = ref("");

const hoTenNV = ref("");
const chucVu = ref("");
const diaChi = ref("");
const soDienThoai = ref("");
const password = ref("");

const editingId = ref<string | null>(null);
const errorMessage = ref<string | null>(null);

const showInfoModal = (nhanVien: INhanVien) => {
    nhanVienRef.value = nhanVien;
    const modal = document.getElementById("info_modal") as HTMLDialogElement;
    if (modal) modal.showModal();
};

const showModal = (status: ModalStatus, id: string = "") => {
    modalStatus.value = status;
    if (status === "editing" && id) {
        const nhanVien = nhanViens.value.find((nv) => nv.maNV === id);
        if (nhanVien) {
            hoTenNV.value = nhanVien.hoTenNV;
            chucVu.value = nhanVien.chucVu || "";
            diaChi.value = nhanVien.diaChi || "";
            soDienThoai.value = nhanVien.soDienThoai;
            editingId.value = id;
        }
    }
    const modal = document.getElementById("form_modal") as HTMLDialogElement;
    if (modal) modal.showModal();
};

const showResetModal = (maNV: string) => {
    editingId.value = maNV;
    const modal = document.getElementById("reset_modal") as HTMLDialogElement;
    if (modal) modal.showModal();
};

const showDeleteModal = (maNV: string) => {
    editingId.value = maNV;
    const modal = document.getElementById("delete_modal") as HTMLDialogElement;
    if (modal) modal.showModal();
};

const handleSubmit = async () => {
    const data: {
        hoTenNV: string;
        chucVu: string;
        diaChi: string;
        soDienThoai: string;
        password?: string;
    } = {
        hoTenNV: hoTenNV.value,
        chucVu: chucVu.value,
        diaChi: diaChi.value,
        soDienThoai: soDienThoai.value,
    };

    if (password.value && modalStatus.value === "adding") data.password = password.value;

    try {
        if (modalStatus.value === "adding") {
            //@ts-ignore
            await addNhanVien(data);
            toast.success("Thêm nhân viên thành công");
        } else if (modalStatus.value === "editing" && editingId.value) {
            await editNhanVien(editingId.value, data);
            toast.success("Cập nhật nhân viên thành công");
        }
        resetForm();
        closeModalBtn.value?.click();
    } catch (error: any) {
        errorMessage.value = error.response?.data?.message || "Lỗi khi xử lý nhân viên";
    }
};

const handleResetPassword = async () => {
    try {
        if (editingId.value) {
            await resetPassword(editingId.value, newPassword.value);
        }
        toast.success("Reset mật khẩu thành công");
        resetPasswordForm();
        closeResetModalBtn.value?.click();
    } catch (error: any) {
        toast.error(error.response?.data?.message || "Lỗi khi reset mật khẩu");
    }
};

const handleDelete = async () => {
    if (!editingId.value) return;
    try {
        await removeNhanVien(editingId.value);
        toast.success("Xóa nhân viên thành công");
        editingId.value = null;
        closeDeleteModalBtn.value?.click();
    } catch (error: any) {
        toast.error(error.response?.data?.message || "Lỗi khi xóa nhân viên");
    }
};

const resetForm = () => {
    hoTenNV.value = "";
    chucVu.value = "";
    diaChi.value = "";
    soDienThoai.value = "";
    password.value = "";
    editingId.value = null;
    errorMessage.value = null;
};

const resetPasswordForm = () => {
    newPassword.value = "";
    editingId.value = null;
    errorMessage.value = null;
};

const nextPage = () => {
    if (page.value < totalPages.value) {
        page.value++;
        fetchNhanViens();
    }
};

const prevPage = () => {
    if (page.value > 1) {
        page.value--;
        fetchNhanViens();
    }
};

onMounted(() => {
    fetchNhanViens(true);
});
</script>

<template>
    <div class="p-4">
        <h1 class="text-xl font-bold mb-4">Quản lý Nhân Viên</h1>
        <button @click="showModal('adding')" class="my-4 btn btn-success block" :disabled="loading">Thêm Nhân
            Viên</button>
            <div class="flex gap-4 mb-4">
                <button @click="fetchNhanViens(true)" class=" btn btn-outline" :disabled="loading"><i class="fa-solid fa-rotate"></i>Làm mới</button>
                <input v-model="searchTerm" placeholder="Tìm kiếm theo tên hoặc sđt..." class="input input-bordered mb-4" />
            </div>
        <template v-if="loading">
            <p>Đang tải</p>
        </template>
        <table v-else class="table w-full mt-4 border">
            <thead>
                <tr class="bg-gray-200">
                    <th>Mã Nhân Viên</th>
                    <th>Tên Nhân Viên</th>
                    <th>Số Điện Thoại</th>
                    <th>Chức Vụ</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="nv in nhanViens" :key="nv.maNV">
                    <td>{{ nv.maNV }}</td>
                    <td>{{ nv.hoTenNV }}</td>
                    <td>{{ nv.soDienThoai }}</td>
                    <td>{{ nv.chucVu }}</td>
                    <td>
                        <button @click="showInfoModal(nv)" class="btn btn-info mr-2">Xem chi tiết</button>
                        <button @click="showModal('editing', nv.maNV)" class="btn btn-warning btn-sm mr-2">Sửa</button>
                        <button @click="showResetModal(nv.maNV)" class="btn btn-neutral btn-sm mr-2"
                            :disabled="loading">Reset
                            mật khẩu</button>
                        <button @click="showDeleteModal(nv.maNV)" class="btn btn-error btn-sm"
                            :disabled="loading">Xóa</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <div class="mt-4 flex justify-between">
            <button @click="prevPage" :disabled="page === 1 || loading" class="btn btn-outline">Trước</button>
            <span>Trang {{ page }} / {{ totalPages }}</span>
            <button @click="nextPage" :disabled="page === totalPages || loading" class="btn btn-outline">Sau</button>
        </div>
    </div>

    <!-- Form Modal -->
    <dialog id="form_modal" class="modal">
        <div class="modal-box w-11/12 max-w-5xl">
            <fieldset class="mx-auto fieldset w-lg bg-base-200 border border-base-300 p-4 rounded-box">
                <legend class="fieldset-legend text-xl font-bold">
                    {{ modalStatus === "adding" ? "Thêm Nhân Viên" : "Chỉnh sửa Nhân Viên" }}
                </legend>
                <form @submit.prevent="handleSubmit">
                    <label class="fieldset-label text-lg">Họ Tên<span class="text-error">*</span></label>
                    <input class="input w-full" v-model="hoTenNV" type="text" required />
                    <label class="fieldset-label text-lg">Số Điện Thoại<span class="text-error">*</span></label>
                    <input v-model="soDienThoai" type="tel" class="input validator tabular-nums w-full p-2 "
                        pattern="[0-9]*" minlength="10" maxlength="10" title="Số điện thoại phải là 10 con số"
                        placeholder="Nhập số điện thoại" />
                    <p class="validator-hint">Số điện thoại phải là 10 con số</p>
                    <label v-if="modalStatus === 'adding'" class="fieldset-label text-lg">Mật Khẩu<span
                            class="text-error">*</span></label>
                            <input v-if="modalStatus == 'adding'" class="input validator w-full" v-model="password"
                        type="password" required pattern="^[A-Za-z0-9]{5,}$"
                        title="Mật khẩu phải có ít nhất 5 ký tự và không chứa ký tự đặc biệt"
                        placeholder="Nhập mật khẩu" />
                    <p class="validator-hint">Mật khẩu phải có ít nhất 5 ký tự và không chứa ký tự đặc biệt</p>
                    <label class="fieldset-label text-lg">Chức Vụ<span class="text-error">*</span></label>
                    <select class="select w-full" v-model="chucVu" required>
                        <option disabled selected>Chọn chức vụ</option>
                        <option>{{ USER_ROLES.NHANVIEN }}</option>
                        <option>{{ USER_ROLES.QUANLY }}</option>
                    </select>
                    <label class="fieldset-label text-lg">Địa Chỉ<span class="text-error">*</span></label>
                    <textarea class="textarea w-full" v-model="diaChi" required></textarea>

                    <p class="text-error text-xl">{{ errorMessage }}</p>
                    <div class="modal-action">
                        <div v-if="loading">
                            <span class="loading loading-spinner loading-xl"></span>
                            <p>Loading</p>
                        </div>
                        <button class="btn btn-primary" type="submit" :disabled="loading">Submit</button>
                        <form method="dialog">
                            <button ref="closeModalBtn" @click="resetForm" class="btn" :disabled="loading">Hủy</button>
                        </form>
                    </div>
                </form>
            </fieldset>
        </div>
    </dialog>

    <!-- Reset Password Modal -->
    <dialog id="reset_modal" class="modal">
        <div class="modal-box w-11/12 max-w-2xl">
            <fieldset class="mx-auto fieldset w-lg bg-base-200 border border-base-300 p-4 rounded-box">
                <legend class="fieldset-legend text-xl font-bold">Reset Mật Khẩu</legend>
                <form @submit.prevent="handleResetPassword">
                    <label class="fieldset-label text-lg">Mật Khẩu Mới<span class="text-error">*</span></label>
                    <input class="input validator w-full" v-model="newPassword" type="password" required
                        pattern="^[A-Za-z0-9]{5,}$"
                        title="Mật khẩu phải có ít nhất 5 ký tự và không chứa ký tự đặc biệt"
                        placeholder="Nhập mật khẩu mới" />
                    <p class="validator-hint">Mật khẩu phải có ít nhất 5 ký tự và không chứa ký tự đặc biệt</p>

                    <p class="text-error text-xl">{{ errorMessage }}</p>
                    <div class="modal-action">
                        <div v-if="loading">
                            <span class="loading loading-spinner loading-xl"></span>
                            <p>Loading</p>
                        </div>
                        <button class="btn btn-primary" type="submit" :disabled="loading">Reset</button>
                        <form method="dialog">
                            <button ref="closeResetModalBtn" @click="resetPasswordForm" class="btn"
                                :disabled="loading">Hủy</button>
                        </form>
                    </div>
                </form>
            </fieldset>
        </div>
    </dialog>

    <!-- Delete Confirmation Modal -->
    <dialog id="delete_modal" class="modal">
        <div class="modal-box w-11/12 max-w-2xl">
            <fieldset class="mx-auto fieldset w-lg bg-base-200 border border-base-300 p-4 rounded-box">
                <legend class="fieldset-legend text-xl font-bold">Xác Nhận Xóa</legend>
                <p class="text-lg mb-4">Bạn có chắc chắn muốn xóa nhân viên này không?</p>
                <div class="modal-action">
                    <div v-if="loading">
                        <span class="loading loading-spinner loading-xl"></span>
                        <p>Loading</p>
                    </div>
                    <button class="btn btn-error" @click="handleDelete" :disabled="loading">Xóa</button>
                    <form method="dialog">
                        <button ref="closeDeleteModalBtn" @click="editingId = null" class="btn"
                            :disabled="loading">Hủy</button>
                    </form>
                </div>
            </fieldset>
        </div>
    </dialog>

    <!-- Detail Modal -->
    <dialog id="info_modal" class="modal">
        <div class="modal-box w-11/12 max-w-5xl">
            <div v-if="nhanVienRef" class="flex gap-2">
                <table class="table w-full mt-4 border">
                    <tbody>
                        <tr>
                            <th>Mã Nhân Viên</th>
                            <td>{{ nhanVienRef.maNV }}</td>
                        </tr>
                        <tr>
                            <th>Họ Tên</th>
                            <td>{{ nhanVienRef.hoTenNV }}</td>
                        </tr>
                        <tr>
                            <th>Chức Vụ</th>
                            <td>{{ nhanVienRef.chucVu }}</td>
                        </tr>
                        <tr>
                            <th>Số Điện Thoại</th>
                            <td>{{ nhanVienRef.soDienThoai }}</td>
                        </tr>
                        <tr>
                            <th>Địa Chỉ</th>
                            <td>
                                <textarea class="textarea w-full" rows="3" readonly>{{ nhanVienRef.diaChi || "Không có"
                                }}</textarea>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="modal-action">
                <form method="dialog">
                    <button class="btn">Đóng</button>
                </form>
            </div>
        </div>
    </dialog>
</template>
