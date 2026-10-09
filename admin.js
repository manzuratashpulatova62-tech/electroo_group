document.addEventListener('DOMContentLoaded', function() {
    // 1. Elementlarni HTML ichidan aniq ushlab olamiz
    const idInput = document.querySelector('.menu2 input[type="text"]');
    const kodInput = document.querySelector('.menu2 input[type="number"]');
    const kirishBtn = document.querySelector('.kirish-text');
    const menuBox = document.querySelector('.menu2');

    // 2. Xatolik xabarini chiqaradigan element yaratib olamiz
    const xatoMatn = document.createElement('p');
    xatoMatn.style.color = '#ef4444';
    xatoMatn.style.fontSize = '14px';
    xatoMatn.style.marginTop = '12px';
    xatoMatn.style.textAlign = 'center';
    xatoMatn.style.fontWeight = '600';
    xatoMatn.style.display = 'none'; // Boshida yashirin turadi
    menuBox.appendChild(xatoMatn);

    // 3. Tugma bosilganda ishlaydigan funksiya
    kirishBtn.addEventListener('click', function(e) {
        e.preventDefault(); // Sahifa qayta yuklanib ketishini oldini oladi

        const idQiymat = idInput.value.trim();
        const kodQiymat = kodInput.value.trim();

        // Harflardan iboratligini tekshirish (faqat a-z, A-Z harflar)
        const faqatHarf = /^[a-zA-Z]+$/.test(idQiymat);

        // Maydonlar bo'sh bo'lsa
        if (idQiymat === '' || kodQiymat === '') {
            xatoMatn.textContent = "Iltimos, barcha maydonlarni to'ldiring!";
            xatoMatn.style.display = 'block';
            return;
        }

        // Tekshirish shartlari:
        // - ID faqat harf bo'lishi kerak
        // - To'g'ri logik ma'lumotlar: ID = "admin", Kod = "12345"
        if (faqatHarf && idQiymat === "Aziz" && kodQiymat === "1") {
            xatoMatn.style.display = 'none';
            // To'g'ri bo'lsa yangi sahifaga yo'naltiradi
            window.location.href = './adminpnel.html';
        } else {
            // Noto'g'ri bo'lsa qizil yozuv chiqadi
            xatoMatn.textContent = "ID yoki kod noto'g'ri!";
            xatoMatn.style.display = 'block';
        }
    });

    // 4. Orqaga qaytish tugmasini yaratish va qo'shish
    const orqagaBtn = document.createElement('button');
    orqagaBtn.textContent = "← Orqaga qaytish";
    orqagaBtn.style.marginTop = '12px';
    orqagaBtn.style.width = '100%';
    orqagaBtn.style.padding = '10px';
    orqagaBtn.style.background = 'transparent';
    orqagaBtn.style.border = '1px solid rgba(255, 255, 255, 0.2)';
    orqagaBtn.style.borderRadius = '10px';
    orqagaBtn.style.color = '#94a3b8';
    orqagaBtn.style.fontSize = '14px';
    orqagaBtn.style.fontWeight = '600';
    orqagaBtn.style.cursor = 'pointer';
    orqagaBtn.style.transition = '0.3s';

    // Sichqoncha ustiga kelgandagi effekt
    orqagaBtn.addEventListener('mouseenter', function() {
        orqagaBtn.style.borderColor = '#f59e0b';
        orqagaBtn.style.color = '#ffffff';
    });
    orqagaBtn.addEventListener('mouseleave', function() {
        orqagaBtn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        orqagaBtn.style.color = '#94a3b8';
    });

    // Orqaga bosilganda bosh sahifaga o'tish
    orqagaBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = './index.html'; // Bosh sahifa manzili
    });

    menuBox.appendChild(orqagaBtn);
});