<script lang="ts" setup>
import { ref, onMounted, useTemplateRef, computed } from "vue";
import { usePhieuMuon } from "@/composables/admin/usePhieuMuonAdmin";
import { useDocGia } from "@/composables/useDocGia";
import { useSachAdmin } from "@/composables/admin/useSachAdmin";
import { useToast } from "vue-toastification";
import type { IDocGia, ITheoDoiMuonSach } from "~/shared/interface";
import dateFormat from "@/utils/dateFormat";

const {
    phieuMuons,
    page,
    totalPages,
    hasMore,
    loading,
    searchTerm,
    trangThai,
    fetchPhieuMuons,
    approvePhieuMuon,
    returnSach,
    addPhieuMuonNV,
    removePhieuMuon,
} = usePhieuMuon();

const {
    loading: loadingDG,
    docGia,
    fetchDocGia,
} = useDocGia();

const {
    books,
    page: pageSach,
    totalPages: totalPagesSach,
    hasMore: hasMoreSach,
    loading: loadingSach,
    searchTerm: searchTermSach,
    fetchBooks,
} = useSachAdmin();

const toast = useToast();
const closeModalBtn = useTemplateRef("closeModalBtn");
const closeDeleteModalBtn = useTemplateRef("closeDeleteModalBtn");
const closeReturnModalBtn = useTemplateRef("closeReturnModalBtn");

const formStep = ref(1); // Lưu bước thực hiện trong form
const errorMessage = ref<string | null>(null); // Lưu thông báo lỗi

const soDienThoaiDG = ref("");
const maSach = ref("");

const phieuMuonRef = ref<ITheoDoiMuonSach | null>(null);
const deletingId = ref<string | null>(null);
const returningId = ref<string | null>(null);

const tenDocGia = computed(() => (docGia?: Partial<IDocGia>) => {
    if (!docGia) return "Không xác định";
    return `${docGia.hoLot} ${docGia.ten}`;
});

const showModal = () => {
    formStep.value = 1; // reset formStep
    fetchBooks(true);
    const modal = document.getElementById("form_modal") as HTMLDialogElement;
    if (modal) modal.showModal();
};

const showInfoModal = (phieuMuon: ITheoDoiMuonSach) => {
    phieuMuonRef.value = phieuMuon;
    const modal = document.getElementById("info_modal") as HTMLDialogElement;
    if (modal) modal.showModal();
};

const showDeleteModal = (maPM: string) => {
    deletingId.value = maPM;
    const modal = document.getElementById("delete_modal") as HTMLDialogElement;
    if (modal) modal.showModal();
};

const showReturnModal = (maPM: string) => {
    returningId.value = maPM;
    const modal = document.getElementById("return_modal") as HTMLDialogElement;
    if (modal) modal.showModal();
};

const handleSubmit = async () => {
    try {
        await addPhieuMuonNV(maSach.value, docGia.value?.soDienThoai as string);
        toast.success("Tạo phiếu mượn thành công");
        resetForm();
        closeModalBtn.value?.click();
    } catch (error: any) {
        errorMessage.value = error.response?.data?.message || "Lỗi khi tạo phiếu mượn";
    }

};

const handleApprove = async (maPM: string, status: "borrowing" | "rejected") => {
    try {
        await approvePhieuMuon(maPM, status);
        toast.success(status === "borrowing" ? "Duyệt phiếu mượn thành công" : "Từ chối phiếu mượn thành công");
        if (phieuMuonRef.value?.maPM === maPM) {
            phieuMuonRef.value.trangThai = status;
        }
    } catch (error: any) {
        toast.error(error.response?.data?.message || "Lỗi khi xử lý phiếu mượn");
    }
};

const handleReturn = async () => {
    if (!returningId.value) return;
    try {
        await returnSach(returningId.value);
        toast.success("Trả sách thành công");
        if (phieuMuonRef.value?.maPM === returningId.value) {
            phieuMuonRef.value.trangThai = "returned";
        }
        returningId.value = null;
        closeReturnModalBtn.value?.click();
    } catch (error: any) {
        toast.error(error.response?.data?.message || "Lỗi khi trả sách");
    }
};

const handleDelete = async () => {
    if (!deletingId.value) return;
    try {
        await removePhieuMuon(deletingId.value);
        toast.success("Xóa phiếu mượn thành công");
        deletingId.value = null;

    } catch (error: any) {
        toast.error(error.response?.data?.message || "Lỗi khi xóa phiếu mượn");
    } finally {
        closeDeleteModalBtn.value?.click();
    }
};

const resetForm = () => {
    soDienThoaiDG.value = "";
    docGia.value = null;
    maSach.value = "";

    formStep.value = 1;
    errorMessage.value = null;
};

const nextPage = () => {
    if (page.value < totalPages.value) {
        page.value++;
        fetchPhieuMuons();
    }
};

const prevPage = () => {
    if (page.value > 1) {
        page.value--;
        fetchPhieuMuons();
    }
};

const timDocGia = async () => {
    if (!soDienThoaiDG.value) {
        errorMessage.value = "Vui lòng nhập số điện thoại";
        return;
    }
    try {
        await fetchDocGia({ sdt: soDienThoaiDG.value });
        if (!docGia) {
            errorMessage.value = "Không tìm thấy độc giả";
        } else {
            errorMessage.value = "";
        }
    } catch (error: any) {
        errorMessage.value = error.response?.data?.message || "Lỗi khi tìm độc giả";
    }
};

const nextPageSach = () => {
    if (pageSach.value < totalPagesSach.value) {
        pageSach.value++;
        fetchBooks();
    }
};

const prevPageSach = () => {
    if (pageSach.value > 1) {
        pageSach.value--;
        fetchBooks();
    }
};

onMounted(() => {
    fetchPhieuMuons(true);
});
</script>

<template>
    <div class="p-4">
        <h1 class="text-xl font-bold mb-4">Quản lý Phiếu Mượn</h1>
        <button @click="showModal" class="my-4 btn btn-success block" :disabled="loading">Tạo phiếu mượn</button>
        <div class="flex gap-4 mb-4">
            <button @click="fetchPhieuMuons(true)" class=" btn btn-outline" :disabled="loading"><i
                    class="fa-solid fa-rotate"></i>Làm mới</button>
            <input v-model="searchTerm" placeholder="Tìm kiếm theo tên độc giả, tên nhân viên, tên sách..."
                class="input input-bordered w-1/2" />
            <select v-model="trangThai" class="select select-bordered">
                <option value="">Tất cả trạng thái</option>
                <option value="pending">Chờ duyệt</option>
                <option value="borrowing">Đang mượn</option>
                <option value="rejected">Bị từ chối</option>
                <option value="returned">Đã trả</option>
            </select>
        </div>

        <table v-if="!loading" class="table w-full mt-4 border">
            <thead>
                <tr class="bg-gray-200">
                    <th>Mã PM</th>
                    <th>Tên Sách</th>
                    <th>Tên Độc Giả</th>
                    <th>Trạng Thái</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="pm in phieuMuons" :key="pm.maPM">
                    <td>{{ pm.maPM }}</td>
                    <td class="w-2/5">
                        <div class="flex items-center gap-3">
                            <div class="avatar">
                                <div class="w-20 h-30">
                                    <img :src="pm.sach?.coverUrl" alt="Book cover" />
                                </div>
                            </div>
                            <div>{{ pm.sach?.tenSach }}</div>
                        </div>
                    </td>
                    <td>{{ tenDocGia(pm.docGia) }}</td>
                    <td>
                        <span :class="{
                            'badge badge-info': pm.trangThai === 'pending',
                            'badge badge-success': pm.trangThai === 'borrowing',
                            'badge badge-error': pm.trangThai === 'rejected',
                            'badge badge-warning': pm.trangThai === 'returned'
                        }">
                            {{ pm.trangThai === 'pending' ? 'Chờ duyệt' :
                                pm.trangThai === 'borrowing' ? 'Đang mượn' :
                                    pm.trangThai === 'rejected' ? 'Bị từ chối' :
                                        'Đã trả' }}
                        </span>
                    </td>
                    <td>
                        <button @click="showInfoModal(pm)" class="btn btn-info btn-sm mr-2">Xem chi tiết</button>
                        <button v-if="pm.trangThai === 'pending'" @click="handleApprove(pm.maPM, 'borrowing')"
                            class="btn btn-success btn-sm mr-2" :disabled="loading">Duyệt</button>
                        <button v-else-if="pm.trangThai === 'borrowing'" @click="showReturnModal(pm.maPM)"
                            class="btn btn-success btn-sm mr-2" :disabled="loading">Trả sách</button>
                        <button @click="handleApprove(pm.maPM, 'rejected')" class="btn btn-warning btn-sm mr-2"
                            :disabled="pm.trangThai !== 'pending' || loading">Từ chối</button>
                        <button @click="showDeleteModal(pm.maPM)" class="btn btn-error btn-sm">Xóa</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div v-else class="text-center py-4">
            <span class="loading loading-spinner loading-lg"></span>
            <p>Đang tải...</p>
        </div>

        <div class="mt-4 flex justify-between">
            <button @click="prevPage" :disabled="page === 1 || loading" class="btn btn-outline">Trước</button>
            <span>Trang {{ page }} / {{ totalPages }}</span>
            <button @click="nextPage" :disabled="page === totalPages || loading" class="btn btn-outline">Sau</button>
        </div>
    </div>

    <!-- Form Modal to add phieu muon -->
    <dialog id="form_modal" class="modal">
        <div class="modal-box w-11/12 max-w-5xl">
            <fieldset class="mx-auto fieldset w-full bg-base-200 border border-base-300 p-4 rounded-box">
                <legend class="fieldset-legend text-xl font-bold">Tạo phiếu mượn</legend>
                <form @submit.prevent="handleSubmit">
                    <div v-if="formStep == 1" class="flex flex-col justify-center">
                        <div class="w-1/2 mx-auto">
                            <h1 class="text-base font-bold mb-3">Nhập số điện thoại của độc giả</h1>
                            <input v-model="soDienThoaiDG" type="tel" class="input validator tabular-nums w-2/3 p-2 "
                                pattern="[0-9]*" minlength="10" maxlength="10" title="Số điện thoại phải là 10 con số"
                                placeholder="Nhập số điện thoại" />
                            <p class="validator-hint">Số điện thoại phải là 10 con số</p>

                            <button @click="timDocGia" class="btn btn-primary mt-4" :disabled="loadingDG"
                                type="button">Tìm kiếm</button>

                            <p class="mt-4 text-base">Độc giả tìm được: {{ docGia ? `${docGia?.hoLot} ${docGia?.ten}` : ""
                                }}
                            </p>
                        </div>
                    </div>
                    <div v-if="formStep == 2">
                        <h1 class="text-base font-bold">Chọn sách cần mượn</h1>
                        <div class="flex flex-col justify-center">
                            <input v-model="searchTermSach" placeholder="Tìm kiếm Sách"
                                class="input input-bordered mt-4 block mx-auto" />
                            <div class="flex">
                                <button @click="prevPageSach" :disabled="pageSach === 1" class="my-auto btn"
                                    type="button">«</button>
                                <table class="table w-5/6 mt-4 mx-auto border">
                                    <thead>
                                        <tr class="bg-gray-200">
                                            <th>Tên Sách</th>
                                            <th>Số quyển</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="sach in books" :key="sach.maSach"
                                            :class="{ 'bg-gray-300': maSach === sach.maSach }">
                                            <td class="w-4/5">
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
                                            <td v-if="sach.soQuyen > 0">{{ sach.soQuyen }}</td>
                                            <td v-else class="text-base text-error">Đã hết</td>
                                            <td>
                                                <button @click="maSach = sach.maSach" class="btn btn-primary btn-sm"
                                                    :disabled="sach.soQuyen === 0" type="button">Chọn</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <button @click="nextPageSach" :disabled="pageSach === totalPagesSach"
                                    class="my-auto btn" type="button">»</button>

                            </div>

                            <p class="mx-auto text-lg">{{ pageSach }} / {{ totalPagesSach }}</p>
                        </div>


                    </div>

                    <p class="text-error text-xl">{{ errorMessage }}</p>
                    <div class="flex justify-center mt-10">
                        <button :disabled="formStep <= 1" @click="formStep--" class="btn btm-sm btn-soft"><i
                                class="fa-solid fa-arrow-left"></i></button>
                        <ul class="steps">
                            <li :class="{ 'step': true, 'step-primary': formStep >= 1 }"></li>
                            <li :class="{ 'step': true, 'step-primary': formStep >= 2 }"></li>
                        </ul>
                        <button :disabled="formStep > 1 || !docGia" @click="formStep++" class="btn btm-sm btn-soft"><i
                                class="fa-solid fa-arrow-right"></i></button>
                    </div>


                    <div class="modal-action">
                        <div v-if="loading">
                            <span class="loading loading-spinner loading-xl"></span>
                            <p>Loading</p>
                        </div>
                        <button v-if="formStep == 2" class="btn btn-primary" type="submit" :disabled="loading">
                            Submit
                        </button>
                        <form method="dialog">
                            <button ref="closeModalBtn" @click="resetForm" class="btn" :disabled="loading">Hủy</button>
                        </form>
                    </div>
                </form>
            </fieldset>
        </div>
    </dialog>

    <!-- Info Modal -->
    <dialog id="info_modal" class="modal">
        <div class="modal-box w-11/12 max-w-5xl">
            <div v-if="phieuMuonRef" class="flex gap-2">
                <img class="w-50 h-75" :src="phieuMuonRef.sach?.coverUrl" alt="Book cover">
                <table class="table w-2/3 mt-4 border">
                    <tbody>
                        <tr>
                            <th>Mã phiếu mượn</th>
                            <td>{{ phieuMuonRef.maPM }}</td>
                        </tr>
                        <tr>
                            <th>Tên sách</th>
                            <td>{{ phieuMuonRef.sach?.tenSach }}</td>
                        </tr>
                        <tr>
                            <th>Tên độc giả</th>
                            <td>{{ tenDocGia(phieuMuonRef.docGia) }}</td>
                        </tr>
                        <tr>
                            <th>Số điện thoại</th>
                            <td>{{ phieuMuonRef.docGia?.soDienThoai }}</td>
                        </tr>
                        <tr>
                            <th>Trạng thái</th>
                            <td>
                                <span :class="{
                                    'badge badge-info': phieuMuonRef.trangThai === 'pending',
                                    'badge badge-success': phieuMuonRef.trangThai === 'borrowing',
                                    'badge badge-error': phieuMuonRef.trangThai === 'rejected',
                                    'badge badge-warning': phieuMuonRef.trangThai === 'returned'
                                }">
                                    {{ phieuMuonRef.trangThai === 'pending' ? 'Chờ duyệt' :
                                        phieuMuonRef.trangThai === 'borrowing' ? 'Đang mượn' :
                                            phieuMuonRef.trangThai === 'rejected' ? 'Bị từ chối' :
                                                'Đã trả' }}
                                </span>
                            </td>
                        </tr>
                        <tr v-if="phieuMuonRef.nhanVien?.hoTenNV">
                            <th>Nhân viên duyệt</th>
                            <td>{{ phieuMuonRef.nhanVien?.hoTenNV }}</td>
                        </tr>
                        <tr v-if="phieuMuonRef.ngayMuon">
                            <th>Ngày mượn</th>
                            <td>{{ dateFormat(phieuMuonRef.ngayMuon) }}</td>
                        </tr>
                        <tr v-if="phieuMuonRef.ngayHenTra">
                            <th>Ngày hẹn trả</th>
                            <td>{{ dateFormat(phieuMuonRef.ngayHenTra) }}</td>
                        </tr>
                        <tr v-if="phieuMuonRef.ngayTra">
                            <th>Ngày trả</th>
                            <td>{{ dateFormat(phieuMuonRef.ngayTra) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="modal-action flex justify-between">
                <div v-if="phieuMuonRef" class="space-x-2">
                    <button v-if="phieuMuonRef.trangThai === 'pending'"
                        @click="handleApprove(phieuMuonRef.maPM, 'borrowing')" class="btn btn-success"
                        :disabled="loading">Duyệt</button>
                    <button v-else-if="phieuMuonRef.trangThai === 'borrowing'"
                        @click="showReturnModal(phieuMuonRef.maPM)" class="btn btn-success" :disabled="loading">Trả
                        sách</button>
                    <button v-if="phieuMuonRef.trangThai === 'pending'"
                        @click="handleApprove(phieuMuonRef.maPM, 'rejected')" class="btn btn-warning"
                        :disabled="loading">Từ chối</button>
                </div>
                <form method="dialog">
                    <button ref="closeInfoModalBtn" class="btn">Đóng</button>
                </form>
            </div>
        </div>
    </dialog>

    <!-- Delete Confirmation Modal -->
    <dialog id="delete_modal" class="modal">
        <div class="modal-box w-11/12 max-w-2xl">
            <fieldset class="mx-auto fieldset w-lg bg-base-200 border border-base-300 p-4 rounded-box">
                <legend class="fieldset-legend text-xl font-bold">Xác Nhận Xóa</legend>
                <p class="text-lg mb-4">Bạn có chắc chắn muốn xóa phiếu mượn này không?</p>
                <div class="modal-action">
                    <div v-if="loading">
                        <span class="loading loading-spinner loading-xl"></span>
                        <p>Loading</p>
                    </div>
                    <button class="btn btn-error" @click="handleDelete" :disabled="loading">Xóa</button>
                    <form method="dialog">
                        <button ref="closeDeleteModalBtn" class="btn" @click="deletingId = null"
                            :disabled="loading">Hủy</button>
                    </form>
                </div>
            </fieldset>
        </div>
    </dialog>

    <!-- Return Confirmation Modal -->
    <dialog id="return_modal" class="modal">
        <div class="modal-box w-11/12 max-w-2xl">
            <fieldset class="mx-auto fieldset w-lg bg-base-200 border border-base-300 p-4 rounded-box">
                <legend class="fieldset-legend text-xl font-bold">Xác Nhận Trả Sách</legend>
                <p class="text-lg mb-4">Bạn có chắc chắn muốn ghi nhận trả sách cho phiếu mượn này không?</p>
                <div class="modal-action">
                    <div v-if="loading">
                        <span class="loading loading-spinner loading-xl"></span>
                        <p>Loading</p>
                    </div>
                    <button class="btn btn-success" @click="handleReturn" :disabled="loading">Trả sách</button>
                    <form method="dialog">
                        <button ref="closeReturnModalBtn" class="btn" @click="returningId = null"
                            :disabled="loading">Hủy</button>
                    </form>
                </div>
            </fieldset>
        </div>
    </dialog>
</template>
