function exportAudioFromSequence() {
    // Mã này xuất audio trực tiếp từ trình tự (sequence) sang định dạng âm thanh và lưu vào thư mục được chỉ định.
    // pathEpr là đường dẫn đến file xuất audio (Export Path)
    var pathEpr = "C:\\Users\\Phuoc\\OneDrive\\ドキュメント\\WAV 48 kHz 16-bit.epr"
    var desktopFolder = Folder.desktop;
    // Lấy sequence hiện tại
    var outputFile = desktopFolder.fsName + "\\" + sequenceName.toString() + ".wav";
    var sequence = app.project.activeSequence;
    // Kiểm tra xem sequence có được định nghĩa không
    if (sequence) {
        try {
            var sequenceName = sequence.name;
            sequence.exportAsMediaDirect(outputFile, pathEpr, 0);
            return outputFile;
        } catch (e) {
            alert("Lỗi khi xuất audio: " + e);
        }
    } else {
        alert("Không có sequence nào được chọn.");
    }
}
exportAudioFromSequence();