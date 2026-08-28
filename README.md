# Aresinhoo's VM's

A browser-based virtual machine runner built with plain HTML, CSS, and JavaScript — no backend, no build tools. Powered by [v86](https://github.com/copy/v86), a WebAssembly x86 emulator that runs entirely client-side.

Pick an OS from the selection screen and it boots right in your browser tab.

## Included OS options

- **TinyCore GUI** — lightweight desktop, fast boot
- **KolibriOS** — tiny (~1.3MB) custom OS with a full GUI, boots almost instantly
- **SliTazOS** — small and lightweight community made OS

More can be added — see [Adding a new OS](#adding-a-new-os) below.

## Features

- Click-to-capture mouse control (pointer lock) with visual feedback
- Simple sidebar navigation (OS Selection / Credits / Help)
- Fully static — clone it, serve it locally, and it just works

## Project structure

```
Aresinhoos-VMs/
├── index.html
├── styles.css
├── script.js
├── build/        # libv86.js + v86.wasm
├── bios/         # seabios.bin + vgabios.bin
├── images/       # OS .iso files
└── img/          # favicon, etc.
```

## Running it locally

Clone the repo (make sure you have [Git LFS](https://git-lfs.com) installed first, since the ISOs and wasm binary are tracked with it):

```bash
git lfs install
git clone https://github.com/aresinhoo/Aresinhoos-VMs.git
cd Aresinhoos-VMs
```

Then serve it with any local static server — opening `index.html` directly won't work, since v86 loads files via XHR, which browsers block on `file://` paths.

```bash
py -m http.server
```

Open **http://localhost:8000** in your browser, go to **OS Selection**, and hit **Launch** on any card.

## Adding a new OS

1. Drop a **32-bit (i386/x86)** `.iso` into the `images/` folder — v86 only emulates a 32-bit CPU, so 64-bit images won't boot.
2. Add a new card inside `.os-grid` in `index.html`:

```html
<div class="os-card" data-iso="images/YOUR-FILE-NAME.iso" data-name="Display Name">
    <h3>Display Name</h3>
    <p>Short description of this OS.</p>
    <button class="launch-btn">Launch</button>
</div>
```

No JavaScript changes needed — `script.js` reads the ISO path and name straight from the card's data attributes.

## Controls

- **Click the VM screen** to capture your mouse (pointer lock) for smoother control inside the guest OS.
- **Press Esc** to release the mouse back to your desktop.
- Use the **Start / Pause / Restart** buttons to control the running VM.
- Click **✕** to shut the VM down and pick another OS.

## Credits

- [v86](https://github.com/copy/v86) — the x86 emulator powering every VM here, by [copy](https://github.com/copy)
- [TinyCore Linux](http://www.tinycorelinux.net/) / [KolibriOS](https://kolibrios.org/) / [SliTaz](https://www.slitaz.org/) — the OS images
- Built by **Aresinhoo**

## License

Project code is licensed under the [MIT License](LICENSE). See [COPYING.LESSER](COPYING.LESSER) for v86's separate LGPL license, which applies to the v86 emulator itself.
