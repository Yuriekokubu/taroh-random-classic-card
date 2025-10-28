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

// 🧩 Path รูป
const imageBasePath = "images-webp";
const imageExt = "webp";

// 🔮 ความหมาย Major Arcana (แนวหมอดูวิเคราะห์)
const majorMeanings = [
  "The Fool: ไพ่ใบนี้บ่งบอกถึงการเริ่มต้นใหม่ที่เปี่ยมด้วยพลังแห่งความกล้า แม้หนทางยังไม่ชัดเจน แต่จงเชื่อในสัญชาตญาณของตนเอง การก้าวออกจากสิ่งเดิมอาจนำไปสู่การผจญภัยที่คาดไม่ถึง",
  "The Magician: ไพ่แห่งพลังและความสามารถ ทุกสิ่งที่คุณต้องการอยู่ในมือแล้ว จงใช้ทักษะและศรัทธาในตนเองเพื่อสร้างสิ่งที่ปรารถนา อย่าปล่อยให้โอกาสผ่านไปโดยไม่ลงมือทำ",
  "The High Priestess: ไพ่แห่งความลึกลับและญาณหยั่งรู้ จงฟังเสียงภายในของคุณ เพราะคำตอบที่คุณแสวงหาอยู่ในใจมานานแล้ว สิ่งที่ซ่อนอยู่จะค่อยๆ เปิดเผยในเวลาที่เหมาะสม",
  "The Empress: ไพ่แห่งความอุดมสมบูรณ์ ความรัก และการดูแล คุณกำลังอยู่ในช่วงที่ทุกสิ่งเติบโตอย่างงดงาม เป็นช่วงเวลาที่ควรใช้หัวใจนำทางและให้ความอบอุ่นแก่ผู้อื่น",
  "The Emperor: ไพ่แห่งอำนาจและความมั่นคง คุณกำลังอยู่ในตำแหน่งที่ต้องตัดสินใจอย่างเข้มแข็ง ใช้เหตุผลและความเด็ดขาดนำทาง แล้วผลลัพธ์จะนำมาซึ่งความสำเร็จยั่งยืน",
  "The Hierophant: ไพ่แห่งคำสอนและปัญญา คุณอาจได้รับคำแนะนำจากผู้มีประสบการณ์ หรือกลายเป็นผู้ให้แสงสว่างแก่ผู้อื่น จงเคารพในประเพณี แต่เปิดใจต่อการเรียนรู้ใหม่",
  "The Lovers: ไพ่แห่งความรักและทางเลือกใหญ่ในชีวิต บางสิ่งกำลังเรียกร้องให้คุณตัดสินใจด้วยหัวใจแท้จริงของคุณ ความซื่อสัตย์ต่อความรู้สึกจะนำทางไปสู่ความสุข",
  "The Chariot: ไพ่แห่งชัยชนะและการควบคุม จงจับบังเหียนชีวิตของคุณให้แน่น แล้วมุ่งไปข้างหน้าอย่างมั่นคง ความมุ่งมั่นจะนำพาคุณผ่านอุปสรรคไปได้แน่นอน",
  "Strength: ไพ่แห่งพลังภายใน ความอ่อนโยนที่แข็งแกร่งกว่าแรงภายนอก จงเชื่อว่าคุณสามารถควบคุมทุกอย่างได้ด้วยความรักและความสงบ",
  "The Hermit: ไพ่แห่งการใคร่ครวญและค้นหาความหมายชีวิต บางครั้งคุณต้องอยู่กับตัวเองเพื่อมองเห็นแสงนำทางใหม่ในใจ อย่ากลัวความเงียบ เพราะความจริงจะเผยในนั้น",
  "Wheel of Fortune: วงล้อแห่งโชคชะตากำลังหมุน เปลี่ยนชีวิตของคุณทั้งดีและร้าย แต่ทุกสิ่งมีเหตุผลของมัน จงเปิดรับโอกาสใหม่และเรียนรู้จากการเปลี่ยนแปลงนี้",
  "Justice: ไพ่แห่งความยุติธรรมและความสมดุล สิ่งที่คุณทำจะกลับมาหาคุณในแบบเดียวกัน จงใช้เหตุผลและความจริงใจในการตัดสินใจ แล้วทุกอย่างจะลงตัว",
  "The Hanged Man: ไพ่แห่งการหยุดเพื่อเรียนรู้มุมมองใหม่ บางครั้งการปล่อยวางคือหนทางสู่การตื่นรู้ ยอมรับสิ่งที่เป็น แล้วคุณจะเห็นแสงสว่างอีกด้านของชีวิต",
  "Death: ไพ่แห่งการเปลี่ยนผ่านอย่างลึกซึ้ง สิ่งเก่ากำลังจะจบ เพื่อเปิดทางให้สิ่งใหม่เข้ามา อย่ากลัวการสิ้นสุด เพราะมันคือจุดเริ่มต้นของชีวิตบทต่อไป",
  "Temperance: ไพ่แห่งความพอดีและการประสานอย่างลงตัว ทุกอย่างจะราบรื่นเมื่อคุณรู้จักสมดุลระหว่างหัวใจกับเหตุผล จงอดทน และสิ่งที่รอจะมาถึงในเวลาที่เหมาะสม",
  "The Devil: ไพ่เตือนถึงการยึดติดกับสิ่งที่ไม่ดีหรือคนที่ไม่เหมาะสม จงมองเห็นพันธนาการที่คุณสร้างขึ้นเอง แล้วก้าวออกมาเพื่ออิสรภาพของจิตใจ",
  "The Tower: ไพ่แห่งการเปลี่ยนแปลงฉับพลันและการล่มสลายที่จำเป็น สิ่งที่แตกหักอาจเป็นจุดเริ่มต้นของสิ่งใหม่ อย่ากลัวเมื่อพื้นดินสั่นสะเทือน เพราะแสงใหม่จะเกิดขึ้นหลังพายุ",
  "The Star: ไพ่แห่งความหวังและการเยียวยา คุณกำลังอยู่ในช่วงที่พลังบวกเริ่มกลับคืนมา จงเชื่อว่าคุณคู่ควรกับสิ่งดีๆ และแสงแห่งความหวังจะนำพาคุณไปข้างหน้า",
  "The Moon: ไพ่แห่งความไม่แน่นอนและภาพลวงตา จงฟังสัญชาตญาณและอย่าด่วนตัดสิน เพราะสิ่งที่เห็นอาจไม่ใช่ความจริงทั้งหมด ความจริงจะปรากฏเมื่อเวลามาถึง",
  "The Sun: ไพ่แห่งความสุข ความสำเร็จ และพลังงานที่สดใส ทุกอย่างกำลังคลี่คลายไปในทางที่ดี แสงแห่งดวงอาทิตย์จะส่องให้คุณเห็นหนทางที่ชัดเจน",
  "Judgement: ไพ่แห่งการตื่นรู้และการชำระสิ่งเก่า ถึงเวลาที่คุณต้องตัดสินใจปล่อยอดีต และยอมรับการเริ่มต้นใหม่อย่างบริสุทธิ์ใจ",
  "The World: ไพ่แห่งความสมบูรณ์และความสำเร็จสูงสุด คุณได้ผ่านบทเรียนทั้งหมดแล้ว ถึงเวลาฉลองกับความสำเร็จ และเตรียมตัวสำหรับการเริ่มต้นวัฏจักรใหม่ในชีวิต"
];

// 🔮 ความหมาย Minor Arcana (แนวหมอดู)
const minorMeanings = {
  "0A": "เป็นจุดเริ่มต้นของโอกาสใหม่ บ่งบอกถึงพลังที่พร้อมจะลงมือทำ ความคิดหรือความสัมพันธ์ใหม่กำลังเริ่มก่อตัวขึ้นอย่างมีพลัง",
  "02": "คุณกำลังอยู่ในช่วงของการชั่งใจ เลือกทางใดทางหนึ่ง ไพ่ใบนี้บอกให้คุณฟังเสียงหัวใจ และพิจารณาอย่างรอบคอบก่อนตัดสินใจ",
  "03": "สิ่งที่คุณลงทุนลงแรงกำลังเริ่มออกผล ความสำเร็จอยู่ไม่ไกล คุณอาจได้รับความร่วมมือจากผู้อื่นในทางที่ดี",
  "04": "ช่วงเวลาแห่งความมั่นคงทางการเงินหรือจิตใจ แต่ระวังการยึดติดกับสิ่งที่มีมากเกินไป อาจทำให้คุณหยุดการเติบโต",
  "05": "คุณอาจเผชิญความขัดแย้งหรือการสูญเสีย ไพ่เตือนให้มองปัญหาอย่างเป็นกลาง อย่าปล่อยให้ความเศร้าครอบงำ เพราะสิ่งดี ๆ ยังรออยู่",
  "06": "ไพ่แห่งการให้และการรับที่สมดุล หรือการเดินทางกลับไปยังสถานที่หรือความทรงจำดี ๆ ในอดีต เป็นช่วงของการฟื้นฟูและให้อภัย",
  "07": "คุณอาจรู้สึกลังเลหรือมีทางเลือกมากมาย จงระวังภาพลวงตาและสิ่งที่ดูดีเกินจริง ใช้เหตุผลประกอบกับหัวใจในการตัดสินใจ",
  "08": "การเคลื่อนไหวอย่างรวดเร็ว ไพ่ใบนี้นำข่าวดีหรือความเปลี่ยนแปลงที่ก้าวหน้าเข้ามาในชีวิตคุณ เตรียมตัวรับสิ่งใหม่ได้เลย",
  "09": "คุณอยู่ในช่วงที่เก็บเกี่ยวผลสำเร็จ แต่บางครั้งอาจรู้สึกกังวลเกินไป ไพ่เตือนให้พอใจในสิ่งที่คุณมี และปล่อยวางความกลัว",
  "10": "ภาระอาจหนักแต่ผลลัพธ์จะคุ้มค่า เป็นช่วงที่คุณต้องรับผิดชอบหลายสิ่ง แต่ถ้าผ่านไปได้ ความสำเร็จจะอยู่ในมือคุณ",
  "J1": "พลังของการเริ่มต้นและความกระตือรือร้น คุณอาจได้รับข่าวดี หรือเริ่มสิ่งใหม่ที่เติมไฟให้ชีวิต",
  "J2": "การสื่อสารและการลงมืออย่างรวดเร็ว จงมั่นใจในสิ่งที่ทำ ไพ่ใบนี้บอกให้คุณไม่ลังเล เพราะโอกาสจะไม่รอ",
  "QU": "พลังของสตรีผู้มั่นคงและเปี่ยมด้วยสัญชาตญาณ คุณอาจได้รับการสนับสนุนจากคนที่อบอุ่น หรือคุณเองคือผู้ที่คอยดูแลผู้อื่น",
  "KI": "ไพ่แห่งผู้นำและความสำเร็จ คุณมีความสามารถในการตัดสินใจและนำทางผู้อื่น จงใช้พลังนี้เพื่อสร้างสิ่งที่มั่นคงยั่งยืน"
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
