
const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const AdmZip = require('adm-zip');
const WebSocket = require('ws');
const progress = require('progress-stream'); // Import progress-stream
const SSH2Client = require('ssh2').Client; // Import ssh2 directly


const csInterface = new CSInterface();

(function () {
	'use strict';
	var extPath;
	extPath = location.href;
	if (getOS() == "MAC") {
		extPath = extPath.substring(7, extPath.length - 11);
	}
	if (getOS() == "WIN") {
		extPath = extPath.substring(8, extPath.length - 11);
	}
	try {
		main();
	} catch (error) {
		alert(error)
	}

}());
function main() {
	try {
		const ssh = new NodeSSH();
		// Tạo WebSocket server để giao tiếp với client
		const wss = new WebSocket.Server({ port: 8080 });

		wss.on('connection', (ws) => {
			console.log('Client kết nối thành công.');

			// Hàm tải và giải nén file
			async function downloadAndExtractFile(remoteFilePath, localFilePath, extractPath, ws, progressId) {
				try {
					ws.send(JSON.stringify({ progress: 0, id: progressId }));

					// Kết nối với server SSH
					const sshClient = new SSH2Client();
					sshClient.on('ready', () => {
						console.log('SSH Client đã sẵn sàng.');

						const ensureDirectoryExists = (path) => {
							if (!fs.existsSync(path)) {
								fs.mkdirSync(path, { recursive: true });
							}
						};

						ensureDirectoryExists('C:/Users/Phuoc/Downloads/FileZip');
						ensureDirectoryExists(extractPath);

						// Lấy kích thước file từ server để tính toán tiến trình
						sshClient.exec(`stat -c %s ${remoteFilePath}`, (err, stream) => {
							if (err) {
								ws.send(JSON.stringify({ error: err.message, id: progressId }));
								return;
							}

							let fileSize = 0;
							stream.on('data', (data) => {
								fileSize = parseInt(data.toString().trim(), 10);
							});

							stream.on('end', () => {
								// Tạo đối tượng progress stream để theo dõi tiến trình tải
								const progressStream = progress({
									length: fileSize,
									time: 100, // cập nhật mỗi 100ms
								});

								progressStream.on('progress', (progressData) => {
									const percent = Math.round((progressData.transferred / fileSize) * 100);
									const speedKBps = (progressData.speed / 1024).toFixed(2); // Tốc độ tải KB/s
									const downloadedSizeKB = (progressData.transferred / 1024).toFixed(2); // Dữ liệu tải được KB
									const downloadedSizeMB = (progressData.transferred / (1024 * 1024)).toFixed(2); // Dữ liệu tải được MB
									const totalSizeMB = (fileSize / (1024 * 1024)).toFixed(2); // Tổng dung lượng MB

									ws.send(JSON.stringify({
										progress: percent,
										speed: `${speedKBps} KB/s`,
										downloaded: `${downloadedSizeMB} MB / ${totalSizeMB} MB`, // Hiển thị tổng số đã tải
										id: progressId
									}));
								});


								// Sử dụng sftp để tải file
								sshClient.sftp((err, sftp) => {
									if (err) {
										ws.send(JSON.stringify({ error: err.message, id: progressId }));
										return;
									}

									const readStream = sftp.createReadStream(remoteFilePath);
									const writeStream = fs.createWriteStream(localFilePath);

									// Tải file với stream và theo dõi tiến trình
									readStream.pipe(progressStream).pipe(writeStream);

									writeStream.on('finish', () => {
										ws.send(JSON.stringify({ progress: 50, id: progressId }));
										ws.send(JSON.stringify({ text: 'Tệp đã tải xuống, bắt đầu giải nén...', id: progressId }));

										// Giải nén file
										try {
											const zip = new AdmZip(localFilePath);
											zip.extractAllTo(extractPath, true);
											ws.send(JSON.stringify({ progress: 80, id: progressId }));
											ws.send(JSON.stringify({ text: 'Tệp đã được giải nén.', id: progressId }));
										} catch (error) {
											ws.send(JSON.stringify({ error: `Lỗi giải nén: ${error.message}`, id: progressId }));
										}

										fs.unlinkSync(localFilePath);

										ws.send(JSON.stringify({ progress: 100, id: progressId }));
										ws.send(JSON.stringify({ text: 'Tệp ZIP đã được xóa.', id: progressId }));

										sshClient.end();
									});
								});
							});
						});
					});

					// Kết nối SSH với thông tin xác thực
					sshClient.connect({
						host: '117.2.132.75',
						username: 'phuocpr',
						privateKey: fs.readFileSync('C:/Users/Phuoc/Videos/10月21日/id_rsa'),
						passphrase: 'phuocpr',
					}).catch((error) => {
						ws.send(JSON.stringify({ error: `Lỗi kết nối SSH: ${error.message}`, id: progressId }));
					});
				} catch (error) {
					ws.send(JSON.stringify({ error: error.message, id: progressId }));
				}
			}

			// Lắng nghe sự kiện click cho 2 nút tải
			document.getElementById('download-button-1').addEventListener('click', () => {
				try {
					downloadAndExtractFile(
						'/var/www/phuocnguyen.com/filezip/test.zip',
						'C:/Users/Phuoc/Downloads/FileZip/myfile1.zip',
						'C:/Users/Phuoc/Downloads/FileZip/Extracted1',
						ws,
						1
					);
				} catch (error) {
					alert(error.message);
				}
			});

			document.getElementById('download-button-2').addEventListener('click', () => {
				try {
					downloadAndExtractFile(
						'/var/www/phuocnguyen.com/filezip/test1.zip',
						'C:/Users/Phuoc/Downloads/FileZip/myfile2.zip',
						'C:/Users/Phuoc/Downloads/FileZip/Extracted1',
						ws,
						2
					);
				} catch (error) {
					alert(error.message);
				}

			});
		});

	} catch (error) {
		alert(error.message);
	}
}
function getOS() {
	var userAgent = window.navigator.userAgent,
		platform = window.navigator.platform,
		macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
		windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
		os = null;

	if (macosPlatforms.indexOf(platform) != -1) {
		os = "MAC";
	} else if (windowsPlatforms.indexOf(platform) != -1) {
		os = "WIN";
	}
	return os;
}