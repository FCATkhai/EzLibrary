<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div class="bg-white shadow-lg rounded-lg p-6 max-w-2xl w-full text-center">
            <h2 class="text-2xl font-semibold text-gray-800">Liên Hệ</h2>
            <p class="text-gray-600 mt-2">Hãy liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi nào.</p>

            <div class="mt-4">
                <p class="text-gray-700"><strong>Số điện thoại:</strong> 0939 388 541</p>
                <p class="text-gray-700"><strong>Email:</strong> <a href="mailto:fcatkhai@gmail.com"
                        class="text-blue-500">fcatkhai@gmail.com</a></p>
                <p class="text-gray-700"><strong>Địa chỉ:</strong> Khu II, Đ. 3 Tháng 2, Xuân Khánh, Ninh Kiều, Cần Thơ,
                    Vietnam</p>
            </div>
            <div class="w-full mt-3">
                <iframe width="100%" height="300" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"
                    src="https://maps.google.com/maps?width=100%25&amp;height=300&amp;hl=en&amp;q=Can%20Tho%20University+(My%20Business%20Name)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed">
                </iframe>
            </div>
        </div>
    </div>
</template>

<script setup>
const sendEmail = () => {
    window.location.href = "mailto:fcatkhai@gmail.com";
};
</script>
