const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const inputDir = path.join(__dirname, "images");
const outputDir = path.join(__dirname, "images-webp");

// สร้างโฟลเดอร์ output ถ้ายังไม่มี
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// อ่านไฟล์ทั้งหมดใน images/
const files = fs.readdirSync(inputDir).filter((file) => file.endsWith(".png"));

// แปลงทุกไฟล์เป็น webp
files.forEach(async (file) => {
  const inputPath = path.join(inputDir, file);
  const outputPath = path.join(outputDir, file.replace(".png", ".webp"));

  try {
    await sharp(inputPath)
      .webp({ quality: 80 }) // ปรับคุณภาพระหว่าง 50–90 ตามต้องการ
      .toFile(outputPath);

    console.log(`✅ แปลงแล้ว: ${file} → ${path.basename(outputPath)}`);
  } catch (err) {
    console.error(`❌ แปลงไม่ได้: ${file}`, err);
  }
});
