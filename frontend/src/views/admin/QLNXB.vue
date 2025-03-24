<script lang="ts" setup>
import { ref, onMounted, useTemplateRef } from "vue";
import { useRouter } from "vue-router";
import { useNXBAdmin } from "@/composables/admin/useNXBAdmin";
import { useToast } from "vue-toastification";
import type { AxiosError } from "axios";

const {
    nhaXuatBan,
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

const router = useRouter();
const toast = useToast();

//--------------- modal ----------------
type ModalStatus = "adding" | "editing";
const modalStatus = ref<"adding" | "editing" | "">("");
const closeModalBtn = useTemplateRef('closeModalBtn');
const tenNXB = ref("");
const diaChi = ref("");

const resetModalField = () => {
    tenNXB.value = "";
    diaChi.value = "";
}

const showModal = async (status: ModalStatus, id: string = "") => {
    modalStatus.value = status;
    if (status == "editing" && id) {
        await fetchNXBbyId(id);
        if (nhaXuatBan.value) {
            tenNXB.value = nhaXuatBan.value.tenNXB || "";
            diaChi.value = nhaXuatBan.value.diaChi || "";
        }
    }
    const modal = document.getElementById('form_modal') as HTMLDialogElement;
    if (modal) {
        modal.showModal(); // Open the modal
    }
}

const closeModal = () => {
    resetModalField();
    closeModalBtn.value?.click();
}


const handleSubmit = async () => {
    if (modalStatus.value == "adding") {
        await handleAdd();
    } else {
        await handleEdit();
    }
    closeModalBtn.value?.click();


}

const handleAdd = async () => {
    try {
        await addNXB({ tenNXB: tenNXB.value, diaChi: diaChi.value });
        toast.success("Thêm NXB thành công");

    } catch (err) {
        // @ts-ignore
        toast.error((err as AxiosError).response?.data?.message || "Lỗi khi thêm NXB");
    } finally {
        resetModalField();
    }
}

const handleEdit = async () => {
    try {
        const updatedNXB = {
            tenNXB: tenNXB.value,
            diaChi: diaChi.value
        }
        await editNXB(nhaXuatBan.value?.maNXB as string, updatedNXB);
        toast.success("Chỉnh sửa NXB thành công");
    } catch (err) {
        // @ts-ignore
        toast.error((err as AxiosError).response?.data?.message || "Lỗi khi chỉnh sửa NXB");
    } finally {
        resetModalField();
    }
}


const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa nhà xuất bản này? Khi xoá NXB sẽ xoá luôn các sách thuộc NXB đó")) {
        await removeNXB(id);
        toast.success("Xoá NXB thành công");
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
        <button class="my-4 btn btn-success block" @click="showModal('adding')">Thêm NXB</button>
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
                        <button @click="handleDelete(nxb.maNXB)" class="btn btn-error btn-sm">Xóa</button>
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


    <!-- Form data -->
    <dialog id="form_modal" class="modal">
        <div class="modal-box w-11/12 max-w-5xl">
            <fieldset class="mx-auto fieldset w-lg bg-base-200 border border-base-300 p-4 rounded-box ">
                <legend class="fieldset-legend text-xl font-bold">
                    {{ modalStatus === "adding" ? "Thêm Nhà xuất bản" : "Chỉnh sửa Nhà xuất bản" }}
                </legend>
                <form @submit.prevent="handleSubmit">
                    <label class="fieldset-label text-lg">Tên NXB</label>
                    <input class="input w-full" v-model="tenNXB" type="text" required>
                    <label class="fieldset-label text-lg">Địa chỉ</label>
                    <input class="input w-full" type="text" v-model="diaChi" required></input>

                    <div class="modal-action">
                        <button class="btn btn-primary">Submit</button>
                        <form method="dialog">
                            <button ref="closeModalBtn" class="btn" @click="closeModal">Huỷ</button>
                        </form>
                    </div>
                </form>
            </fieldset>
        </div>
    </dialog>
</template>
