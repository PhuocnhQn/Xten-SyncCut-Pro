
const QRCode = require('qrcode');
const fs = require('fs');
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
		selectFoder();
		checkStorage();
		main();

		// alert("Start");
		// alert(extPath);
	} catch (error) {
		alert(error)
	}

}());
function main() {
	document.getElementById('btnRun').addEventListener('click', function () {
		// csInterface.evalScript('main("' + storedEncodedPath + '","' + stringData + '")', function(result) {
		var storedPathFolder = localStorage.getItem('pathFolder');
		var storedPathCSV = localStorage.getItem('pathCSV');
		const csvData = readCSVFile(storedPathCSV);
		if (!csvData || csvData.length === 0) {
			alert("Lỗi: Không thể đọc dữ liệu từ file CSV hoặc file rỗng");
			return;
		}
		// Bắt đầu xử lý từ hàng thứ 2 (index 1)
		processRow(1, csvData, storedPathFolder).catch(error => {
			alert("Lỗi khi xử lý dữ liệu: " + error);
		});
	});
}

// Không cần hàm handleFileSelect nữa vì chúng ta xử lý file trực tiếp trong runScript
function processRow(index, csvData, output) {
	if (index < csvData.length) {
		return createQR(csvData[index][1])
			.then(pathFile => {
				pathFile = encodeURIComponent(pathFile);
				let encodedOutput = encodeURIComponent(output);
				return new Promise((resolve, reject) => {
					csInterface.evalScript('test("' + pathFile + '", "' + csvData[index][0] + '", "' + encodedOutput + '", "' + index + '")', result => {
						if (result === 'error') {
							reject('Lỗi khi thực thi evalScript');
						} else {
							resolve();
						}
					});
				});
			})
			.then(() => processRow(index + 1, csvData, output))
			.catch(error => {
				alert('Lỗi: ' + error);
			});
	} else {
		alert('Đã hoàn thành xử lý tất cả các dòng dữ liệu.');
	}
}
function readCSVFile(filePath) {
	try {
		const content = fs.readFileSync(filePath, 'utf8');
		const lines = content.split('\n');
		const data = [];

		for (let i = 0; i < lines.length; i++) {
			if (lines[i].trim() !== '') {
				const columns = lines[i].split(',');
				data.push(columns);
			}
		}

		return data;
	} catch (error) {
		alert('Error reading CSV file: ' + error.message);
		return null;
	}
}



function createQR(text) {
	const folderPath = `${__dirname}/CodeQR/`;
	const fileName = `qrcode_${Date.now()}.png`;
	const filePath = `${folderPath}/${fileName}`;

	// Tạo thư mục nếu chưa tồn tại
	if (!fs.existsSync(folderPath)) {
		fs.mkdirSync(folderPath, { recursive: true });
	}

	// Tạo mã QR và lưu dưới dạng file ảnh trong thư mục CodeQR
	return new Promise((resolve, reject) => {
		QRCode.toFile(filePath, text, (err) => {
			if (err) {
				reject('Lỗi: Không thể tạo file PNG mã QR');
			} else {
				resolve(filePath);
				// alert('Mã QR đã được tạo và lưu thành công trong thư mục CodeQR!');
			}
		});
	});
}
//////////////////////////////
function checkStorage() {
	var storedPathFolder = localStorage.getItem('pathFolder');
	var storedPathCSV = localStorage.getItem('pathCSV');
	if (storedPathFolder && storedPathCSV) {
		document.getElementById('selectFolder').innerText = storedPathFolder;
		document.getElementById('selectCSV').innerText = storedPathCSV;
	}
}
function selectFoder() {
	document.getElementById('selectFolder').addEventListener('click', async () => {
		try {
			var result = await window.cep.fs.showOpenDialog(false, true, "Select folder...");
			// Check if the user selected a folder
			if (result.err === 0 && result.data.length > 0) {
				localStorage.setItem('pathFolder', replace20(result.data[0]));
				document.getElementById('selectFolder').innerText = replace20(result.data[0]);
			} else {
				console.error('Error or user canceled:', result.err);
			}
		} catch (error) {
			console.error('Error:', error);
		}
	});

	document.getElementById('selectCSV').addEventListener('click', async () => {
		try {
			var result = await window.cep.fs.showOpenDialog(false, false, "Select CSV file...", "", ["csv"]);
			// Check if the user selected a CSV file
			if (result.err === 0 && result.data.length > 0) {
				localStorage.setItem('pathCSV', replace20(result.data[0]));
				document.getElementById('selectCSV').innerText = replace20(result.data[0]);
			} else {
				console.error('Error or user canceled:', result.err);
			}
		} catch (error) {
			console.error('Error:', error);
		}
	});
}
function replace20(inputString) {
	// Sử dụng phương thức .replace() với biểu thức chính quy để thay thế tất cả %20 thành khoảng trắng
	var replacedString = inputString.replace(/%20/g, ' ');
	return replacedString;
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