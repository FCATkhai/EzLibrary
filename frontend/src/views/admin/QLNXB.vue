<script lang="ts" setup>
import { ref, onMounted, useTemplateRef } from "vue";
import { useNXBAdmin } from "@/composables/admin/useNXBAdmin";
import { useToast } from "vue-toastification";

const {
    nhaXuatBans,
    totalPages,
    page,
    hasMore,
    loading,
    searchTerm,
    fetchNXBs,
    fetchNXBbyId,
    addNXB,
    editNXB,
    removeNXB
} = useNXBAdmin();

const toast = useToast();

//--------------- modal ----------------
type ModalStatus = "adding" | "editing";
const modalStatus = ref<ModalStatus>("adding");
const closeModalBtn = useTemplateRef('closeModalBtn');
const closeDeleteModalBtn = useTemplateRef("closeDeleteModalBtn");

const tenNXB = ref("");
const diaChi = ref("");

const editingId = ref<string | null>(null);
const errorMessage = ref<string | null>(null);



const showModal = async (status: ModalStatus, id: string = "") => {
    modalStatus.value = status;
    if (status == "editing" && id) {
        const nhaXuatBan = nhaXuatBans.value.find((nxb) => nxb.maNXB === id);
        if (nhaXuatBan) {
            tenNXB.value = nhaXuatBan.tenNXB;
            diaChi.value = nhaXuatBan.diaChi || "";
            editingId.value = id;
        }
    }
    const modal = document.getElementById('form_modal') as HTMLDialogElement;
    if (modal) {
        modal.showModal();
    }
}

const showDeleteModal = (maNXB: string) => {
    editingId.value = maNXB;
    const modal = document.getElementById("delete_modal") as HTMLDialogElement;
    if (modal) modal.showModal();
};




const handleSubmit = async () => {
    const data: {
        tenNXB: string,
        diaChi?: string
    } = {
        tenNXB: tenNXB.value,
    };
    if (diaChi.value) data.diaChi = diaChi.value;
    try {
        if (modalStatus.value == "adding") {
        await addNXB(data);
        toast.success("Thêm NXB thành công");
    } else if (modalStatus.value == "editing" && editingId.value) {
        await editNXB(editingId.value, data);
        toast.success("Chỉnh sửa NXB thành công");
    }

    resetForm();
    closeModalBtn.value?.click();
    } catch (error: any) {
        errorMessage.value = error.response?.data?.message || "Lỗi khi xử lý NXB";
    }
}

const resetForm = () => {
    tenNXB.value = "";
    diaChi.value = "";

    editingId.value = null;
    errorMessage.value = null;
}


const handleDelete = async () => {
    if (!editingId.value) return;
    try {
        await removeNXB(editingId.value);
        toast.success("Xóa NXB thành công");
        editingId.value = null;
        closeDeleteModalBtn.value?.click();
    } catch (error: any) {
        toast.error(error.response?.data?.message || "Lỗi khi xóa NXB");
    }
};

const nextPage = () => {
    if (page.value < totalPages.value) {
        page.value++;
        fetchNXBs();
    }
};

const prevPage = () => {
    if (page.value > 1) {
        page.value--;
        fetchNXBs();
    }
};

onMounted(() => {
    fetchNXBs(true);

});



</script>

<template>
    <div class="p-4">
        <h1 class="text-xl font-bold mb-4">Quản lý Nhà Xuất Bản</h1>
        <button class="my-4 btn btn-success block" @click="showModal('adding')" :disabled="loading">Thêm NXB</button>
        <input v-model="searchTerm" placeholder="Tìm kiếm NXB..." class="input input-bordered mb-4" />
        <template v-if="loading">
            <p>Đang tải</p>
        </template>
        <table v-else class="table w-full mt-4 border">
            <thead>
                <tr class="bg-gray-200">
                    <th>Mã NXB</th>
                    <th>Tên NXB</th>
                    <th>Địa chỉ</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="nxb in nhaXuatBans" :key="nxb.maNXB">
                    <td>{{ nxb.maNXB }}</td>
                    <td>{{ nxb.tenNXB }}</td>
                    <td class="overflow-hidden text-ellipsis">{{ nxb.diaChi }}</td>
                    <td>
                        <button @click="showModal('editing', nxb.maNXB)"
                            class="btn btn-warning btn-sm mr-2">Sửa</button>
                        <button @click="showDeleteModal(nxb.maNXB)" class="btn btn-error btn-sm">Xóa</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <div class="mt-4 flex justify-between">
            <button @click="prevPage" :disabled="page === 1" class="btn btn-outline">Trước</button>
            <span>Trang {{ page }} / {{ totalPages }}</span>
            <button @click="nextPage" :disabled="page === totalPages" class="btn btn-outline">Sau</button>
        </div>
    </div>


    <!-- Form Modal -->
    <dialog id="form_modal" class="modal">
        <div class="modal-box w-11/12 max-w-5xl">
            <fieldset class="mx-auto fieldset w-lg bg-base-200 border border-base-300 p-4 rounded-box ">
                <legend class="fieldset-legend text-xl font-bold">
                    {{ modalStatus === "adding" ? "Thêm Nhà xuất bản" : "Chỉnh sửa Nhà xuất bản" }}
                </legend>
                <form @submit.prevent="handleSubmit">
                    <label class="fieldset-label text-lg">Tên NXB<span class="text-error">*</span></label>
                    <input class="input w-full" v-model="tenNXB" type="text" required>
                    <label class="fieldset-label text-lg">Địa chỉ</label>
                    <input class="input w-full" type="text" v-model="diaChi"></input>

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

    <!-- Delete Confirmation Modal -->
    <dialog id="delete_modal" class="modal">
        <div class="modal-box w-11/12 max-w-2xl">
            <fieldset class="mx-auto fieldset w-lg bg-base-200 border border-base-300 p-4 rounded-box">
                <legend class="fieldset-legend text-xl font-bold">Xác Nhận Xóa</legend>
                <p class="text-lg mb-4">Bạn có chắc chắn muốn xóa NXB này không?</p>
                <p class="text-lg text-error">khi xoá NXB, các sách thuộc NXB cũng sẽ bị xoá</p>
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
</template>
