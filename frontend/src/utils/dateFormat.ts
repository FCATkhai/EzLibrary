const dateFormat = (date: Date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
}

export default dateFormat;
