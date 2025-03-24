<script lang="ts" setup>
import { ref, onMounted, useTemplateRef, watch } from "vue";
import { useRouter } from "vue-router";
import { useSachAdmin } from "@/composables/admin/useSachAdmin";
import { useNXBAdmin } from "@/composables/admin/useNXBAdmin";
import { useToast } from "vue-toastification";
import type { ISach } from "~/shared/interface";

const {
    books,
    page,
    totalPages,
    hasMore,
    loading,
    searchTerm,
    fetchBooks,
    fetchBookById,
    addSach,
    editSach,
    removeSach,
} = useSachAdmin();

const {
    nhaXuatBans,
    page: pageNXB,
    totalPages: totalPagesNXB,
    searchTerm: searchTermNXB,
    fetchNXBs,

} = useNXBAdmin();

const router = useRouter();
const toast = useToast();

type ModalStatus = "adding" | "editing";
const modalStatus = ref<ModalStatus>("adding");
const closeModalBtn = useTemplateRef("closeModalBtn");

const formStep = ref(1); // Lưu bước thực hiện trong form

const sachRef = ref<ISach | null>(null);

const tenSach = ref("");
const moTa = ref("");
const soTrang = ref<number | null>(null);
const soQuyen = ref<number | null>(null);
const namXuatBan = ref<number | null>(null);
const maNXB = ref("");
const tenNXB = ref("");
const tacGia = ref("");
const file = ref<File | null>(null); // Để upload ảnh
const editingId = ref<string | null>(null);

const showInfoModal = (sach: ISach) => {
    sachRef.value = sach;
    const modal = document.getElementById("info_modal") as HTMLDialogElement;
    if (modal) modal.showModal();
}


const showModal = (status: ModalStatus, id: string = "") => {
    fetchNXBs(true);
    formStep.value = 1; // reset formStep
    modalStatus.value = status;
    if (status == "editing" && id) {
        const sach = books.value.find((s) => s.maSach === id);
        if (sach) {
            tenSach.value = sach.tenSach;
            tacGia.value = sach.tacGia;
            moTa.value = sach.moTa;
            namXuatBan.value = sach.namXuatBan;
            soTrang.value = sach.soTrang;
            soQuyen.value = sach.soQuyen;
            //@ts-ignore
            maNXB.value = sach.maNXB.maNXB;
            editingId.value = id;
            formStep.value = 2; // Sang bước chỉnh sửa ngay
        }
    }
    const modal = document.getElementById("form_modal") as HTMLDialogElement;
    if (modal) modal.showModal();
};

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    file.value = target.files ? target.files[0] : null;
};

const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("tenSach", tenSach.value);
    formData.append("maNXB", maNXB.value);
    formData.append("tacGia", tacGia.value);
    formData.append("moTa", moTa.value);
    if (soTrang.value) formData.append("soTrang", soTrang.value.toString());
    if (soQuyen.value) formData.append("soQuyen", soQuyen.value.toString());
    if (namXuatBan.value) formData.append("namXuatBan", namXuatBan.value.toString());
    if (file.value) formData.append("file", file.value);

    try {
        if (modalStatus.value === "adding") {
            await addSach(formData);
            toast.success("Thêm sách thành công");
        } else if (modalStatus.value === "editing" && editingId.value) {
            await editSach(editingId.value, formData);
            toast.success("Cập nhật sách thành công");
        }
        // resetForm();
        closeModalBtn.value?.click();
    } catch (error: any) {
        toast.error(error.response?.data?.message || "Lỗi khi xử lý sách");
    }

};

const resetForm = () => {
    tenSach.value = "";
    maNXB.value = "";
    tenNXB.value = "";
    tacGia.value = "";
    moTa.value = "";
    soTrang.value = null;
    soQuyen.value = null;
    namXuatBan.value = null;
    file.value = null;
    editingId.value = null;
    formStep.value = 1;
};

const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa sách này không?")) {
        await removeSach(id);
        toast.success("Xóa sách thành công");
    }
};

const nextPage = () => {
    if (page.value < totalPages.value) {
        page.value++;
        fetchBooks();
    }
};

const prevPage = () => {
    if (page.value > 1) {
        page.value--;
        fetchBooks();
    }
};

const nextPageNXB = () => {
    if (pageNXB.value < totalPagesNXB.value) {
        pageNXB.value++;
        fetchNXBs();
    }
};

const prevPageNXB = () => {
    if (pageNXB.value > 1) {
        pageNXB.value--;
        fetchNXBs();
    }
};

onMounted(() => {
    fetchBooks(true);
});
</script>

<template>
    <div class="p-4">
        <h1 class="text-xl font-bold mb-4">Quản lý Sách</h1>
        <button @click="showModal('adding')" class="my-4 btn btn-success block">Thêm Sách</button>
        <input v-model="searchTerm" placeholder="Tìm kiếm theo tên hoặc tác giả..." class="input input-bordered mb-4" />
        <template v-if="loading">
            <p>Đang tải</p>
        </template>
        <table v-else class="table w-full mt-4 border">
            <thead>
                <tr class="bg-gray-200">
                    <th>Mã Sách</th>
                    <th>Tên Sách</th>
                    <th>Tác giả</th>
                    <th>Số quyển</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="sach in books" :key="sach.maSach">
                    <td>{{ sach.maSach }}</td>
                    <!-- <td>{{ sach.tenSach }}</td> -->
                    <td class="w-2/5">
                        <div class="flex items-center gap-3">
                            <div class="avatar">
                                <div class=" w-20 h-30">
                                    <img :src="sach.coverUrl" alt="Book cover" />
                                </div>
                            </div>
                            <div>
                                {{ sach.tenSach }}
                            </div>
                        </div>
                    </td>
                    <td>{{ sach.tacGia }}</td>
                    <td>{{ sach.soQuyen }}</td>
                    <td>
                        <button @click="showInfoModal(sach)" class="btn btn-info mr-2">Xem chi tiết</button>
                        <button @click="showModal('editing', sach.maSach)"
                            class="btn btn-warning btn-sm mr-2">Sửa</button>
                        <button @click="handleDelete(sach.maSach)" class="btn btn-error btn-sm">Xóa</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <div class="mt-4 flex justify-between">
            <button @click="prevPage" :disabled="page === 1" class="btn btn-outline">Trước</button>
            <span>Trang {{ page }} / {{ totalPages }}</span>
            <button @click="nextPage" :disabled="page === totalPages || loading" class="btn btn-outline">Sau</button>
        </div>
    </div>



    <!-- Form Modal -->
    <dialog id="form_modal" class="modal">
        <div class="modal-box w-11/12 max-w-5xl">
            <fieldset class="mx-auto fieldset w-lg bg-base-200 border border-base-300 p-4 rounded-box">
                <legend class="fieldset-legend text-xl font-bold">
                    {{ modalStatus === "adding" ? "Thêm Sách" : "Chỉnh sửa Sách" }}
                </legend>
                <form @submit.prevent="handleSubmit">
                    <div v-if="formStep == 1">
                        <h1 class="text-base font-bold">Chọn NXB</h1>
                        <div class="flex flex-col justify-center">
                            <input v-model="searchTermNXB" placeholder="Tìm kiếm NXB"
                                class="input input-bordered mt-4 block mx-auto" />
                            <p>{{ searchTermNXB }}</p>
                            <div class="flex">
                                <button @click="prevPageNXB" :disabled="page === 1" class="my-auto btn">«</button>
                                <table class="table w-5/6 mt-4 mx-auto border">
                                    <thead>
                                        <tr class="bg-gray-200">
                                            <th>Tên NXB</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="nxb in nhaXuatBans" :key="nxb.maNXB">
                                            <td>{{ nxb.tenNXB }}</td>
                                            <td>
                                                <button @click="maNXB = nxb.maNXB; tenNXB = nxb.tenNXB"
                                                    class="btn btn-primary btn-sm" type="button">Chọm</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <button @click="nextPageNXB" :disabled="page === totalPages"
                                    class="my-auto btn">»</button>

                            </div>

                            <p class="mx-auto text-lg">{{ pageNXB }} / {{ totalPagesNXB }}</p>
                            <p class="text-base">NXB được chọn: <span class="text-primary">{{ tenNXB }}</span></p>
                        </div>
                    </div>
                    <div v-if="formStep == 2">
                        <h1 class="text-base font-bold">Nhập thông tin sách</h1>

                        <label class="fieldset-label text-lg">Tên Sách</label>
                        <input class="input w-full" v-model="tenSach" type="text" required />
                        <label class="fieldset-label text-lg">Mã NXB</label>
                        <input class="input w-full" v-model="maNXB" type="text" required readonly disabled />
                        <label class="fieldset-label text-lg">Tác giả</label>
                        <input class="input w-full" v-model="tacGia" type="text" required />
                        <label class="fieldset-label text-lg">Mô tả</label>
                        <textarea class="textarea w-full" rows="10" v-model="moTa"></textarea>
                        <label class="fieldset-label text-lg">Số trang</label>
                        <input class="input w-full" v-model="soTrang" type="number" min="1" />
                        <label class="fieldset-label text-lg">Số quyển</label>
                        <input class="input w-full" v-model="soQuyen" type="number" min="1" />
                        <label class="fieldset-label text-lg">Năm xuất bản</label>
                        <input class="input w-full" v-model="namXuatBan" type="number" min="1900" max="9999" />
                        <label class="fieldset-label text-lg">Ảnh (nếu có)</label>
                        <input class="input w-full" type="file" @change="handleFileChange" accept="image/*" />
                    </div>
                    <div class="flex justify-center mt-10">
                        <button :disabled="formStep <= 1" @click="formStep--" class="btn btm-sm btn-soft"><i
                                class="fa-solid fa-arrow-left"></i></button>
                        <ul class="steps">
                            <li :class="{ 'step': true, 'step-primary': formStep >= 1 }"></li>
                            <li :class="{ 'step': true, 'step-primary': formStep >= 2 }"></li>
                        </ul>
                        <button :disabled="formStep > 1 || !maNXB" @click="formStep++" class="btn btm-sm btn-soft"><i
                                class="fa-solid fa-arrow-right"></i></button>
                    </div>



                    <div class="modal-action">
                        <button v-if="formStep == 2" class="btn btn-primary" type="submit">Submit</button>
                        <form method="dialog">
                            <button ref="closeModalBtn" @click="resetForm" class="btn">Hủy</button>
                        </form>
                    </div>
                </form>
            </fieldset>
        </div>
    </dialog>


    <!-- Model xem thông tin sách -->
    <dialog id="info_modal" class="modal">
        <div class="modal-box w-11/12 max-w-5xl">
            <div v-if="sachRef" class="flex gap-2">
                <img class="w-50 h-75" :src="sachRef.coverUrl" alt="cover Book">
                <table class="table w-2/3 mt-4 border">
                    <tbody>
                        <tr>
                            <th>Mã sách</th>
                            <td>{{ sachRef.maSach }}</td>
                        </tr>
                        <tr>
                            <th>Tên sách</th>
                            <td>{{ sachRef.tenSach }}</td>
                        </tr>
                        <tr>
                            <th>Tác giả</th>
                            <td>{{ sachRef.tacGia }}</td>
                        </tr>
                        <tr>
                            <th>NXB</th>
                            <td>{{
                            //@ts-ignore
                            sachRef.maNXB.tenNXB
                            }}</td>
                        </tr>
                        <tr class="h-30">
                            <th>Mô tả</th>
                            <td>
                                <textarea class="w-full" rows="7" readonly>
                                    {{ sachRef.moTa }}
                                </textarea>
                            </td>
                        </tr>
                        <tr>
                            <th>Năm xuất bản</th>
                            <td>{{ sachRef.namXuatBan }}</td>
                        </tr>
                        <tr>
                            <th>Số trang</th>
                            <td>{{ sachRef.soTrang }}</td>
                        </tr>
                        <tr>
                            <th>Số quyển</th>
                            <td>{{ sachRef.soQuyen }}</td>
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
