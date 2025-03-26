<script lang="ts" setup>
import { ref, onMounted, useTemplateRef, computed, watch } from "vue";
import { usePhieuMuon } from "@/composables/usePhieuMuonDG";
import { useAuthStore } from "@/stores/auth.store";
import { useToast } from "vue-toastification";
import type { IDocGia, ITheoDoiMuonSach } from "~/shared/interface";
import dateFormat from "@/utils/dateFormat";

const authStore = useAuthStore();
const userId = computed(() => authStore.user?.maNguoiDung);

const {
    phieuMuons,
    page,
    totalPages,
    searchTerm,
    hasMore,
    loading,
    trangThai,
    fetchPhieuMuons,
    removePhieuMuon,
} = usePhieuMuon();

const toast = useToast();
const errorMessage = ref<string | null>(null); // Lưu thông báo lỗi
const closeDeleteModalBtn = useTemplateRef("closeDeleteModalBtn");

const phieuMuonRef = ref<ITheoDoiMuonSach | null>(null);
const deletingId = ref<string | null>(null);

const tenDocGia = computed(() => (docGia?: Partial<IDocGia>) => {
    if (!docGia) return "Không xác định";
    return `${docGia.hoLot} ${docGia.ten}`;
});

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

const handleDelete = async () => {
    if (!deletingId.value) return;
    try {
        await removePhieuMuon(deletingId.value);
        toast.success("Xóa phiếu mượn thành công");
        deletingId.value = null;
        closeDeleteModalBtn.value?.click();
    } catch (error: any) {
        toast.error(error.response?.data?.message || "Lỗi khi xóa phiếu mượn");
    }
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


onMounted(() => {
    fetchPhieuMuons(true);
});
</script>

<template>
    <div class="p-4">
        <h1 class="text-xl font-bold mb-4">Xem Phiếu Mượn</h1>
        <div class="flex gap-4 mb-4">
            <button @click="fetchPhieuMuons(true)" class=" btn btn-outline" :disabled="loading"><i
                    class="fa-solid fa-rotate"></i>Làm mới</button>
            <input v-model="searchTerm" placeholder="Tìm kiếm theo tên sách..." class="input input-bordered w-1/2" />
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
                        <button v-if="pm.trangThai === 'pending'" @click="showDeleteModal(pm.maPM)" class="btn btn-error btn-sm">Xóa</button>
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
            <div class="modal-action">
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

</template>
