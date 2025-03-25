<script lang="ts" setup>
import { ref, onMounted, useTemplateRef, computed } from "vue";
import { useDocGia } from "@/composables/useDocGia";
import { useToast } from "vue-toastification";
import type { IDocGia } from "~/shared/interface";

const {
    docGias,
    page,
    totalPages,
    loading,
    searchTerm,
    fetchDocGias,
    fetchDocGiaById,
    addDocGia,
    editDocGia,
    removeDocGia,
    resetPassword,
} = useDocGia();

const toast = useToast();

type ModalStatus = "adding" | "editing";
const modalStatus = ref<ModalStatus>("adding");
const closeModalBtn = useTemplateRef("closeModalBtn");
const closeResetModalBtn = useTemplateRef("closeResetModalBtn");
const closeDeleteModalBtn = useTemplateRef("closeDeleteModalBtn");

const docGiaRef = ref<IDocGia | null>(null);
const newPassword = ref("");

const hoLot = ref("");
const ten = ref("");
const soDienThoai = ref("");
const password = ref("");
const ngaySinh = ref<string>("");
const phai = ref<string>("");
const diaChi = ref("");

const editingId = ref<string | null>(null);
const errorMessage = ref<string | null>(null);

const tenDocGia = computed(() => (docGia: IDocGia) => `${docGia.hoLot} ${docGia.ten}`);

const showInfoModal = (docGia: IDocGia) => {
    docGiaRef.value = docGia;
    const modal = document.getElementById("info_modal") as HTMLDialogElement;
    if (modal) modal.showModal();
};

const showModal = (status: ModalStatus, id: string = "") => {
    modalStatus.value = status;
    if (status === "editing" && id) {
        const docGia = docGias.value.find((dg) => dg.maDG === id);
        if (docGia) {
            hoLot.value = docGia.hoLot;
            ten.value = docGia.ten;
            soDienThoai.value = docGia.soDienThoai;
            //@ts-ignore
            ngaySinh.value = docGia.ngaySinh ? docGia.ngaySinh.split("T")[0] : "";
            phai.value = docGia.phai || "";
            diaChi.value = docGia.diaChi || "";
            editingId.value = id;
        }
    }
    const modal = document.getElementById("form_modal") as HTMLDialogElement;
    if (modal) modal.showModal();
};

const showResetModal = (maDG: string) => {
    editingId.value = maDG;
    const modal = document.getElementById("reset_modal") as HTMLDialogElement;
    if (modal) modal.showModal();
};

const showDeleteModal = (maDG: string) => {
    editingId.value = maDG;
    const modal = document.getElementById("delete_modal") as HTMLDialogElement;
    if (modal) modal.showModal();
};

const handleSubmit = async () => {
    const data: {
        hoLot: string;
        ten: string;
        soDienThoai: string;
        password?: string;
        ngaySinh?: string;
        phai?: string;
        diaChi?: string;
    } = {
        hoLot: hoLot.value,
        ten: ten.value,
        soDienThoai: soDienThoai.value,
    };

    if (password.value && modalStatus.value === "adding") data.password = password.value;
    if (ngaySinh.value) data.ngaySinh = ngaySinh.value;
    if (phai.value) data.phai = phai.value;
    if (diaChi.value) data.diaChi = diaChi.value;

    try {
        if (modalStatus.value === "adding") {
            await addDocGia(data);
            toast.success("Thêm độc giả thành công");
        } else if (modalStatus.value === "editing" && editingId.value) {
            //@ts-ignore
            await editDocGia(editingId.value, data);
            toast.success("Cập nhật độc giả thành công");
        }
        resetForm();
        closeModalBtn.value?.click();
    } catch (error: any) {
        errorMessage.value = error.response?.data?.message || "Lỗi khi xử lý độc giả";
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

// Updated handleDelete to use modal
const handleDelete = async () => {
    if (!editingId.value) return;
    try {
        await removeDocGia(editingId.value);
        toast.success("Xóa độc giả thành công");
        editingId.value = null;
        closeDeleteModalBtn.value?.click();
    } catch (error: any) {
        toast.error(error.response?.data?.message || "Lỗi khi xóa độc giả");
    }
};

const resetForm = () => {
    hoLot.value = "";
    ten.value = "";
    soDienThoai.value = "";
    password.value = "";
    ngaySinh.value = "";
    phai.value = "";
    diaChi.value = "";

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
        fetchDocGias();
    }
};

const prevPage = () => {
    if (page.value > 1) {
        page.value--;
        fetchDocGias();
    }
};

onMounted(() => {
    fetchDocGias(true);
});
</script>

<template>
    <div class="p-4">
        <h1 class="text-xl font-bold mb-4">Quản lý Độc Giả</h1>
        <button @click="showModal('adding')" class="my-4 btn btn-success block" :disabled="loading">Thêm Độc Giả</button>
        <input v-model="searchTerm" placeholder="Tìm kiếm theo tên độc giả hoặc sđt..." class="input input-bordered mb-4" />
        <template v-if="loading">
            <p>Đang tải</p>
        </template>
        <table v-else class="table w-full mt-4 border">
            <thead>
                <tr class="bg-gray-200">
                    <th>Mã Độc Giả</th>
                    <th>Tên Độc Giả</th>
                    <th>Số Điện Thoại</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="docGia in docGias" :key="docGia.maDG">
                    <td>{{ docGia.maDG }}</td>
                    <td>{{ tenDocGia(docGia) }}</td>
                    <td>{{ docGia.soDienThoai }}</td>
                    <td>
                        <button @click="showInfoModal(docGia)" class="btn btn-info mr-2">Xem chi tiết</button>
                        <button @click="showModal('editing', docGia.maDG)" class="btn btn-warning btn-sm mr-2">Sửa</button>
                        <button @click="showResetModal(docGia.maDG)" class="btn btn-neutral btn-sm mr-2" :disabled="loading">Reset mật khẩu</button>
                        <button @click="showDeleteModal(docGia.maDG)" class="btn btn-error btn-sm" :disabled="loading">Xóa</button>
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
                    {{ modalStatus === "adding" ? "Thêm Độc Giả" : "Chỉnh sửa Độc Giả" }}
                </legend>
                <form @submit.prevent="handleSubmit">
                    <label class="fieldset-label text-lg">Họ Lót<span class="text-error">*</span></label>
                    <input class="input w-full" v-model="hoLot" type="text" required />
                    <label class="fieldset-label text-lg">Tên<span class="text-error">*</span></label>
                    <input class="input w-full" v-model="ten" type="text" required />
                    <label class="fieldset-label text-lg">Số Điện Thoại<span class="text-error">*</span></label>
                    <input class="input w-full" v-model="soDienThoai" type="text" required />
                    <label v-if="modalStatus == 'adding'" class="fieldset-label text-lg">Mật Khẩu<span class="text-error">*</span></label>
                    <input v-if="modalStatus == 'adding'" class="input w-full" v-model="password" :type="modalStatus === 'adding' ? 'password' : 'text'" :required="modalStatus === 'adding'" />
                    <label class="fieldset-label text-lg">Ngày Sinh</label>
                    <input class="input w-full" v-model="ngaySinh" type="date" />
                    <label class="fieldset-label text-lg">Phái</label>
                    <select class="select w-full" v-model="phai">
                        <option value="">Không chọn</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                    </select>
                    <label class="fieldset-label text-lg">Địa Chỉ</label>
                    <textarea class="textarea w-full" v-model="diaChi"></textarea>

                    <p class="text-error text-xl">{{ errorMessage }}</p>
                    <div class="modal-action">
                        <div v-if="loading">
                            <span class="loading loading-spinner loading-xl"></span>
                            <p>Loading</p>
                        </div>
                        <button class="btn btn-primary" type="submit" :disabled="loading">Submit</button>
                        <form method="dialog">
                            <button ref="closeModalBtn" @click="resetForm" class="btn" :disabled="loading">Huỷ</button>
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
                <legend class="fieldset-legend text-xl departe-bold">Reset Mật Khẩu</legend>
                <form @submit.prevent="handleResetPassword">
                    <label class="fieldset-label text-lg">Mật Khẩu Mới<span class="text-error">*</span></label>
                    <input class="input w-full" v-model="newPassword" type="password" required placeholder="Nhập mật khẩu mới" />

                    <p class="text-error text-xl">{{ errorMessage }}</p>
                    <div class="modal-action">
                        <div v-if="loading">
                            <span class="loading loading-spinner loading-xl"></span>
                            <p>Loading</p>
                        </div>
                        <button class="btn btn-primary" type="submit" :disabled="loading">Reset</button>
                        <form method="dialog">
                            <button ref="closeResetModalBtn" @click="resetPasswordForm" class="btn" :disabled="loading">Hủy</button>
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
                <p class="text-lg mb-4">Bạn có chắc chắn muốn xóa độc giả này không?</p>
                <div class="modal-action">
                    <div v-if="loading">
                        <span class="loading loading-spinner loading-xl"></span>
                        <p>Loading</p>
                    </div>
                    <button class="btn btn-error" @click="handleDelete" :disabled="loading">Xóa</button>
                    <form method="dialog">
                        <button ref="closeDeleteModalBtn" class="btn" @click="editingId = null" :disabled="loading">Hủy</button>
                    </form>
                </div>
            </fieldset>
        </div>
    </dialog>

    <!-- Detail Modal -->
    <dialog id="info_modal" class="modal">
        <div class="modal-box w-11/12 max-w-5xl">
            <div v-if="docGiaRef" class="flex gap-2">
                <table class="table w-full mt-4 border">
                    <tbody>
                        <tr>
                            <th>Mã Độc Giả</th>
                            <td>{{ docGiaRef.maDG }}</td>
                        </tr>
                        <tr>
                            <th>Họ Lót</th>
                            <td>{{ docGiaRef.hoLot }}</td>
                        </tr>
                        <tr>
                            <th>Tên</th>
                            <td>{{ docGiaRef.ten }}</td>
                        </tr>
                        <tr>
                            <th>Số Điện Thoại</th>
                            <td>{{ docGiaRef.soDienThoai }}</td>
                        </tr>
                        <tr>
                            <th>Ngày Sinh</th>
                            <td>{{ docGiaRef.ngaySinh ? new Date(docGiaRef.ngaySinh).toLocaleDateString() : "Không có" }}</td>
                        </tr>
                        <tr>
                            <th>Phái</th>
                            <td>{{ docGiaRef.phai || "Không có" }}</td>
                        </tr>
                        <tr>
                            <th>Địa Chỉ</th>
                            <td>
                                <textarea class="w-full" rows="5" readonly>{{ docGiaRef.diaChi || "Không có" }}</textarea>
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
