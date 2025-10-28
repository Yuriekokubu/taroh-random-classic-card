const suits = ["P", "W", "C", "S"]; // P=Pentacles, W=Wands, C=Cups, S=Swords
const minorCards = ["0A", "02", "03", "04", "05", "06", "07", "08", "09", "10", "J1", "J2", "QU", "KI"];
const cardsGrid = document.getElementById("cards-grid");

const modal = document.getElementById("modal");
const selectedCardsDiv = document.getElementById("selected-cards");
const predictBtn = document.getElementById("predict-btn");
const newDrawBtn = document.getElementById("new-draw-btn");

let selectedCards = [];
let selectionComplete = false;
let cardDivs = [];

const allCards = [];

// 🧩 กำหนด path หลักของรูป (แก้ตรงนี้จุดเดียวก็พอ)
const imageBasePath = "images-webp";
const imageExt = "webp"; // ใช้ .webp แทน .png

// ความหมาย Major Arcana
const majorMeanings = [
  "The Fool: การเริ่มต้นใหม่, การผจญภัยไร้กังวล, เชื่อมั่นในสัญชาตญาณ",
  "The Magician: พลังในการสร้างสรรค์, การใช้ทักษะที่มี, ทำให้ฝันเป็นจริง, ริเริ่ม",
  "The High Priestess: ญาณหยั่งรู้, ความลึกลับ, เชื่อสัญชาตญาณ, ความรู้ภายใน",
  "The Empress: ความอุดมสมบูรณ์, การดูแล, ความรักที่งอกงาม, ความคิดสร้างสรรค์",
  "The Emperor: อำนาจ, การควบคุม, ความมั่นคง, ความเป็นผู้นำ, กฎระเบียบ",
  "The Hierophant: คำสอน, ขนบธรรมเนียม, การแสวงหาคำปรึกษาจากผู้รู้",
  "The Lovers: ความรัก, ความสัมพันธ์, การตัดสินใจครั้งใหญ่เกี่ยวกับทางเลือกในชีวิต",
  "The Chariot: ชัยชนะ, ความมุ่งมั่น, การควบคุมสถานการณ์, การเดินทางสำเร็จ",
  "Strength: ความแข็งแกร่งภายใน, ความกล้าหาญ, ความเมตตา, ควบคุมอารมณ์",
  "The Hermit: การปลีกวิเวก, การค้นหาตัวเอง, การใคร่ครวญ, แสวงหาสัจธรรม",
  "Wheel of Fortune: โชคชะตา, วงจรชีวิต, การเปลี่ยนแปลงครั้งใหญ่, โอกาสไม่คาดฝัน",
  "Justice: ความยุติธรรม, ความสมดุล, กฎหมาย, การตัดสินใจอย่างเที่ยงตรง",
  "The Hanged Man: การหยุดนิ่งเพื่อทบทวน, การมองโลกมุมกลับ, การปล่อยวาง",
  "Death: การสิ้นสุดของบางสิ่ง, การเปลี่ยนแปลงที่หลีกเลี่ยงไม่ได้, การเริ่มต้นใหม่หลังการจบสิ้น",
  "Temperance: ความสมดุล, การประนีประนอม, การผสมผสานที่ลงตัว, ความพอดี",
  "The Devil: การผูกมัด, การยึดติด, กิเลส, การถูกครอบงำด้วยสิ่งที่ไม่ดี",
  "The Tower: การล่มสลายอย่างฉับพลัน, การเปลี่ยนแปลงที่รุนแรง, การปลดปล่อยจากความทุกข์",
  "The Star: ความหวัง, การเยียวยาจิตใจ, โอกาสที่ดีงาม, การฟื้นฟูชีวิต",
  "The Moon: ความไม่แน่นอน, ความสับสน, ภาพลวงตา, ความกลัวที่ไม่มีเหตุผล",
  "The Sun: ความสุข, ความสำเร็จ, ชัยชนะ, พลังงานบวก, การมองโลกในแง่ดี",
  "Judgement: การตัดสินใจครั้งสุดท้าย, การตื่นรู้, การได้รับผลตอบแทนตามการกระทำ",
  "The World: ความสมบูรณ์, การบรรลุเป้าหมาย, ความสำเร็จสูงสุด, การสิ้นสุดของวัฏจักร"
];

// ความหมาย Minor Arcana
const minorMeanings = {
  "0A": "โอกาสครั้งสำคัญ, จุดเริ่มต้นใหม่, พลังงาน/อารมณ์/เงิน ที่เต็มเปี่ยม",
  "02": "การบริหารจัดการ, การชั่งน้ำหนัก/เลือกสองทาง, การเป็นพันธมิตร",
  "03": "ความสำเร็จหลังความพยายาม, การร่วมมือที่ให้ผลดี, การเติบโต, การเฉลิมฉลอง",
  "04": "ความมั่นคง, การหยุดนิ่ง, ความปลอดภัย, การยึดติดกับสิ่งที่ตัวเองมี",
  "05": "ความขัดแย้ง/ความสูญเสีย, ความท้าทาย, การเปลี่ยนแปลงที่ไม่เป็นที่พอใจ",
  "06": "ความสำเร็จ/ชัยชนะเล็กๆ, การให้และรับที่สมดุล, การเดินทางกลับบ้าน/ไปสู่สิ่งที่ดีกว่า",
  "07": "การต่อสู้เพื่อปกป้องตัวเอง/ความคิด, ความไม่มั่นใจ, การเพ้อฝัน/ทางเลือกที่ไม่ชัดเจน",
  "08": "การเคลื่อนไหว/ก้าวหน้าอย่างรวดเร็ว, การถูกจำกัด/กักขังด้วยความคิดของตนเอง",
  "09": "ความสำเร็จ/ความพึงพอใจส่วนตัว, ความสมบูรณ์ทางอารมณ์, ความกังวล/ความเครียด",
  "10": "ความสมบูรณ์, ภาระหนักอึ้ง/รับผิดชอบเกินตัว, ความสุขในครอบครัว",
  "J1": "ข่าวสารใหม่, การเริ่มต้นเรียนรู้, ความกระตือรือร้น, ผู้ส่งสาร",
  "J2": "การกระทำ/การเคลื่อนไหวที่รวดเร็ว, การเผชิญหน้า, การมาพร้อมข้อเสนอ",
  "QU": "ผู้หญิงที่มีสัญชาตญาณ/เหตุผล/ความมั่นคง, การดูแล, ความคิดสร้างสรรค์",
  "KI": "ผู้นำที่ประสบความสำเร็จ, มีอำนาจ/วุฒิภาวะ, ผู้ให้ความมั่นคงและคำแนะนำที่ดี"
};

const suitNames = {
  "P": "เหรียญ (Pentacles)",
  "W": "ไม้เท้า (Wands)",
  "C": "ถ้วย (Cups)",
  "S": "ดาบ (Swords)"
};

const cardNumbers = {
  "0A": "เอซ", "02": "สอง", "03": "สาม", "04": "สี่", "05": "ห้า",
  "06": "หก", "07": "เจ็ด", "08": "แปด", "09": "เก้า", "10": "สิบ",
  "J1": "เพจ", "J2": "อัศวิน", "QU": "ราชินี", "KI": "ราชา"
};

// 🃏 สร้างไพ่ทั้งหมด
for (let i = 0; i < 22; i++) {
  const num = i.toString().padStart(2, "0");
  const [title, meaning] = majorMeanings[i].split(': ');
  allCards.push({
    type: "major",
    title: title,
    src: `${imageBasePath}/major_arcana_${num}.${imageExt}`,
    meaning: meaning.trim()
  });
}

for (const suit of suits) {
  for (const card of minorCards) {
    const cardTitle = `${cardNumbers[card]} ${suitNames[suit]}`;
    const cardMeaning = minorMeanings[card];
    allCards.push({
      type: "minor",
      title: cardTitle,
      src: `${imageBasePath}/minor_arcana_${suit}_${card}.${imageExt}`,
      meaning: cardMeaning.trim()
    });
  }
}

// 🂠 หลังไพ่ (webp)
const backSrc = `${imageBasePath}/back.${imageExt}`;

// ฟังก์ชันสุ่ม
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

shuffle(allCards);

// สร้าง grid ไพ่
allCards.forEach(card => {
  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card");
  cardDivs.push(cardDiv);

  const img = document.createElement("img");
  img.src = backSrc;
  cardDiv.appendChild(img);

  cardDiv.addEventListener("click", () => {
    if (selectionComplete) return;
    if (cardDiv.classList.contains("selected")) return;

    cardDiv.classList.add("selected");
    selectedCards.push(card);

    if (selectedCards.length === 7) {
      selectionComplete = true;
      modal.style.display = "block";
    }
  });

  cardsGrid.appendChild(cardDiv);
});

// ปุ่มทำนาย
predictBtn.addEventListener("click", () => {
  selectedCardsDiv.innerHTML = "";
  selectedCards.forEach(card => {
    const div = document.createElement("div");
    div.style.marginBottom = "15px";

    const img = document.createElement("img");
    img.src = card.src;

    const titleElement = document.createElement("p");
    titleElement.innerHTML = `<strong>${card.title}</strong>`;
    titleElement.style.margin = "5px 0 2px 0";
    titleElement.style.fontSize = "1em";

    const meaningElement = document.createElement("p");
    meaningElement.textContent = card.meaning;
    meaningElement.style.margin = "0";
    meaningElement.style.fontSize = "0.9em";

    div.appendChild(img);
    div.appendChild(titleElement);
    div.appendChild(meaningElement);
    selectedCardsDiv.appendChild(div);
  });
  predictBtn.style.display = "none";
  newDrawBtn.style.display = "inline-block";
});

// ปุ่มทำนายใหม่
newDrawBtn.addEventListener("click", () => {
  selectedCards = [];
  selectionComplete = false;
  modal.style.display = "none";
  newDrawBtn.style.display = "none";
  predictBtn.style.display = "inline-block";
  cardDivs.forEach(div => div.classList.remove("selected"));
});
