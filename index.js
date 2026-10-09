document.addEventListener("DOMContentLoaded", () => {
    // 1. MOBIL MENYU BOSHQRUVI
    const mobileToggle = document.getElementById("mobileToggle");
    const navLinks = document.getElementById("navLinks");

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            navLinks.classList.toggle("show");
            
            const icon = mobileToggle.querySelector("i");
            if (icon) {
                if (navLinks.classList.contains("show")) {
                    icon.className = "fa-solid fa-xmark";
                } else {
                    icon.className = "fa-solid fa-bars";
                }
            }
        });

        document.addEventListener("click", (e) => {
            if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
                navLinks.classList.remove("show");
                const icon = mobileToggle.querySelector("i");
                if (icon) {
                    icon.className = "fa-solid fa-bars";
                }
            }
        });
    }

    // Modal oynani yopish
    const voteModal = document.getElementById("voteModal");
    if (voteModal) {
        voteModal.addEventListener("click", (e) => {
            if (e.target === voteModal) {
                closeVoteModal();
            }
        });
    }

    // Form submit
    const voteForm = document.getElementById("voteForm");
    if (voteForm) {
        voteForm.addEventListener("submit", submitVote);
    }

    // Serverdan (Firebase) real-vaqtda ma'lumotlarni tinglash va UI'ni yangilash
    if (window.db) {
        window.db.ref("asar_votes_data").on("value", (snapshot) => {
            const data = snapshot.val();
            if (data) {
                localStorage.setItem("asar_votes_data", JSON.stringify(data));
            }
            updateUI();
        });
    } else {
        // Zaxira: localStorage o'zgarishini tinglash
        window.addEventListener("storage", (e) => {
            if (e.key === "asar_votes_data") {
                updateUI();
            }
        });
    }

    // Dastlabki UI yuklanishi
    updateUI();
});

// LocalStorage va Serverdan ma'lumotlarni olish
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

// Bazaga (Server va LocalStorage ga) saqlash
function saveVotesData(data) {
    localStorage.setItem("asar_votes_data", JSON.stringify(data));
    
    // Firebase serveriga yuborish (shunda barcha qurilmalarda real-vaqtda yangilanadi)
    if (window.db) {
        window.db.ref("asar_votes_data").set(data);
    }
}

// UI va Foizlarni yangilash (Nolga tushirish mantiqi bilan)
function updateUI() {
    const data = getVotesData();

    // Jami ovozlar sonini hisoblash
    const totalVotes = Object.values(data.votes).reduce((sum, count) => sum + count, 0);

    for (let id = 1; id <= 3; id++) {
        const count = data.votes[id] || 0;
        
        // Agar jami ovozlar 0 bo'lsa, foiz ham 0 bo'ladi
        const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;

        const bar = document.getElementById(`bar-${id}`);
        const percentText = document.getElementById(`percent-${id}`);

        if (bar && percentText) {
            bar.style.width = `${percentage}%`;
            percentText.innerText = `${percentage}% (${count} ovoz)`;
        }
    }
}

// MODAL OYNANI OCHISH
function openVoteModal(designId) {
    const selectedInput = document.getElementById("selectedDesignId");
    const modal = document.getElementById("voteModal");

    if (selectedInput && modal) {
        selectedInput.value = designId;
        modal.style.display = "flex";
    }
}

// MODAL OYNANI YOPISH
function closeVoteModal() {
    const modal = document.getElementById("voteModal");
    const form = document.getElementById("voteForm");

    if (modal) {
        modal.style.display = "none";
    }
    if (form) {
        form.reset();
    }
}

// OVOZ YUBORISH (SUBMIT VOTE)
function submitVote(event) {
    event.preventDefault();

    const designId = document.getElementById("selectedDesignId").value;
    const nameInput = document.getElementById("userName");
    const phoneInput = document.getElementById("userPhone");

    if (!nameInput || !phoneInput) return;

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim().replace(/\s+/g, '');

    if (!name || !phone) {
        alert("Iltimos, barcha maydonlarni to'ldiring!");
        return;
    }

    const data = getVotesData();

    // Raqam allaqachon mavjudligini tekshirish
    if (data.voters[phone]) {
        const existingVoter = data.voters[phone];
        const existingName = typeof existingVoter === "object" ? existingVoter.name : existingVoter;
        alert(`Ushbu telefon raqamidan allaqachon ovoz berilgan! (Foydalanuvchi: ${existingName})`);
        return;
    }

    // Ovoz va rasm ID-sini birgalikda saqlash
    data.votes[designId] = (data.votes[designId] || 0) + 1;
    data.voters[phone] = {
        name: name,
        designId: Number(designId)
    };

    saveVotesData(data);
    updateUI();

    alert(`Rahmat, ${name}! Ovozingiz muvaffaqiyatli qabul qilindi.`);
    closeVoteModal();
}