"use strict";

let emulator = null;

// PAGE NAVIGATION
const navLinks = document.querySelectorAll(".sidebar a[data-page]");
const pages = document.querySelectorAll(".page");

navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();

        navLinks.forEach(l => l.classList.remove("active-link"));
        link.classList.add("active-link");

        const target = link.dataset.page;
        pages.forEach(page => {
            page.classList.toggle("active", page.id === target);
        });
    });
});

// OS LAUNCH
const vmStage = document.getElementById("vm-stage");
const vmTitle = document.getElementById("vm-title");
const screenContainer = document.getElementById("screen_container");

document.querySelectorAll(".launch-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const card = btn.closest(".os-card");
        const iso = card.dataset.iso;
        const name = card.dataset.name;

        bootVM(iso, name);
    });
});

document.getElementById("vm-close").addEventListener("click", () => {
    if (emulator) {
        emulator.stop();
        emulator = null;
    }
    vmStage.classList.add("hidden");
});

document.getElementById("vm-start").addEventListener("click", () => {
    if (emulator) emulator.run();
});

document.getElementById("vm-pause").addEventListener("click", () => {
    if (emulator) emulator.stop();
});

document.getElementById("vm-restart").addEventListener("click", () => {
    if (emulator) emulator.restart();
});

function bootVM(isoPath, name) {
    // tear down any existing instance before booting a new one
    if (emulator) {
        emulator.stop();
        emulator = null;
    }

    vmTitle.textContent = name;
    vmStage.classList.remove("hidden");
    screenContainer.classList.remove("captured");

    emulator = new V86({
        wasm_path: "build/v86.wasm",
        memory_size: 128 * 1024 * 1024,
        vga_memory_size: 8 * 1024 * 1024,
        screen_container: screenContainer,
        bios: { url: "bios/seabios.bin" },
        vga_bios: { url: "bios/vgabios.bin" },
        cdrom: { url: isoPath },
        autostart: true,
    });
}

// MOUSE CAPTURE (pointer lock)
// PS/2 mice only send relative deltas, so the guest cursor can't track the
// real cursor position directly — capturing the pointer on click gives the
// cleanest experience: click in, move naturally, Esc (or click outside) to
// let go of your real cursor again.
screenContainer.addEventListener("click", () => {
    if (!emulator) return;
    screenContainer.requestPointerLock();
});

document.addEventListener("pointerlockchange", () => {
    const isLocked = document.pointerLockElement === screenContainer;
    screenContainer.classList.toggle("captured", isLocked);
});