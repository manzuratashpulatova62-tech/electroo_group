document.addEventListener("DOMContentLoaded", () => {
    renderAdminUI();
});

function getVotesData() {
    const saved = localStorage.getItem("asar_votes_data");
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error("Data parse error:", e);
        }
    }
    return {
        votes: { 1: 0, 2: 0, 3: 0 },
        voters: {}
    };
}

function saveVotesData(data) {
    localStorage.setItem("asar_votes_data", JSON.stringify(data));
}

// Admin panelini qayta chizish
function renderAdminUI() {
    const data = getVotesData();

    // Stat kartalardagi ovozlar sonini yangilash
    for (let id = 1; id <= 3; id++) {
        const countEl = document.getElementById(`admin-count-${id}`);
        if (countEl) {
            countEl.innerText = `${data.votes[id] || 0} ovoz`;
        }
    }

    const listContainer = document.getElementById("votersList");
    listContainer.innerHTML = "";

    const phoneNumbers = Object.keys(data.voters);

    // Agar hamma raqamlar o'chirilgan bo'lsa
    if (phoneNumbers.length === 0) {
        listContainer.innerHTML = `<div class="empty-msg">Hozircha hech kim ovoz bermagan.</div>`;
        return;
    }

    phoneNumbers.forEach(phone => {
        const voterData = data.voters[phone];
        let name = "";
        let designId = null;

        if (typeof voterData === "object" && voterData !== null) {
            name = voterData.name || "Noma'lum";
            designId = voterData.designId || null;
        } else {
            name = voterData;
        }

        const item = document.createElement("div");
        item.className = "voter-item";

        item.innerHTML = `
            <div class="voter-info">
                <span class="voter-phone">${phone}</span>
                <span class="voter-details">Foydalanuvchi: <b>${name}</b> ${designId ? `| Rasm ID: <b>${designId}</b>` : ''}</span>
            </div>
            <div class="action-area" id="action-${phone.replace(/[^a-zA-Z0-9]/g, '')}">
                <button class="btn-cancel" onclick="showConfirm('${phone}')">Ovozni bekor qilish</button>
            </div>
        `;

        listContainer.appendChild(item);
    });
}

function showConfirm(phone) {
    const safePhoneId = phone.replace(/[^a-zA-Z0-9]/g, '');
    const actionArea = document.getElementById(`action-${safePhoneId}`);

    if (actionArea) {
        actionArea.innerHTML = `
            <div class="confirm-box">
                <span class="confirm-text">Bekor qilinsinmi?</span>
                <button class="btn-yes" onclick="deleteVote('${phone}')">Ha</button>
                <button class="btn-no" onclick="renderAdminUI()">Yo'q</button>
            </div>
        `;
    }
}

// Ovozni va raqamni birma-bir o'chirish funksiyasi
function deleteVote(phone) {
    const data = getVotesData();
    const voterData = data.voters[phone];

    if (voterData) {
        let designId = null;

        if (typeof voterData === "object" && voterData.designId) {
            designId = voterData.designId;
        }

        // Qaysi rasmga ovoz bergan bo'lsa, o'sha rasm ovozini 1 ga kamaytiramiz
        if (designId && data.votes[designId] > 0) {
            data.votes[designId] -= 1;
        }

        // Raqamni bazadan o'chirish
        delete data.voters[phone];

        // Agarda barcha foydalanuvchilar o'chirilgan bo'lsa, ovozlar xavfsizlik uchun to'liq 0 qilinadi
        if (Object.keys(data.voters).length === 0) {
            data.votes = { 1: 0, 2: 0, 3: 0 };
        }

        saveVotesData(data);
        renderAdminUI();
    }
}