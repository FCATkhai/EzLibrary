import axios from "axios";

export async function muonSachDG(maSach: string) {
    return await axios.post("/api/muon-sach/doc-gia", { maSach });
}
