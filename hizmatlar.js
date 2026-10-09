document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.querySelector(".navbar");
    const navLinks = document.querySelector(".nav-links");

    // 1. HTMLga tegmasdan avtomatik mobil menyu ikonkasini yaratish
    const mobileToggle = document.createElement("div");
    mobileToggle.classList.add("mobile-toggle");
    mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    navbar.appendChild(mobileToggle);

    // 2. Ikonkani bosganda menyuni ochish / yopish logic-i
    mobileToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        
        // Ikonkani o'zgartirish (X hamda Bars)
        const icon = mobileToggle.querySelector("i");
        if (navLinks.classList.contains("active")) {
            icon.classList.remove("fa-bars");
            icon.classList.add("fa-xmark");
        } else {
            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");
        }
    });

    // 3. Linklardan biri bosilganda mobil menyuni yopish
    const links = navLinks.querySelectorAll("a");
    links.forEach(link => {
        link.addEventListener("click", () => {
            if (navLinks.classList.contains("active")) {
                navLinks.classList.remove("active");
                const icon = mobileToggle.querySelector("i");
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }
        });
    });
});