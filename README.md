# 🌊 Flow Field

Interactive generative art — thousands of particles flowing through dynamic noise fields with real-time controls.

![Flow Field Screenshot](https://via.placeholder.com/1200x630/0a0a0a/818cf8?text=🌊+Flow+Field)

## ✨ Features

- **🎨 Multiple Field Types** — Perlin noise, curl noise, vortex, spiral, and wave fields
- **🖱️ Interactive** — Mouse position influences the flow field in real-time
- **🎭 Color Modes** — Monochrome, rainbow, gradient, and thermal palettes
- **⚡ 60fps** — Smooth rendering with up to 50,000 particles
- **🎛️ Real-time Controls** — Glassmorphism panel with sliders for every parameter
- **🎲 Randomize** — One-click happy accidents
- **📸 Export** — Save current frame as high-res PNG
- **🖥️ Fullscreen** — Immersive fullscreen mode
- **👻 Auto-hide UI** — Controls fade after 3s of inactivity

## 🚀 Quick Start

```bash
git clone https://github.com/Sanjays2402/flow-field.git
cd flow-field
npm install
npm run dev
```

## 🎛️ Controls

| Control | Range | Description |
|---------|-------|-------------|
| Particles | 1k–50k | Number of flowing particles |
| Speed | 0.1–5.0 | Particle velocity |
| Field Scale | 0.5–10 | Noise zoom level |
| Noise Octaves | 1–8 | Detail/complexity |
| Fade Rate | 0.01–0.30 | Trail length (lower = longer trails) |
| Mouse Influence | 0–3 | How strongly mouse attracts particles |

**Keyboard:** Press `H` to toggle controls

## 🏗️ Tech Stack

- **React 19** — UI components
- **Vite** — Build tooling
- **Tailwind CSS v4** — Styling
- **Framer Motion** — Smooth animations
- **Canvas 2D** — Particle rendering
- **Simplex Noise** — Flow field generation

## 🎨 Design

Dark cinematic aesthetic with glassmorphism controls:
- Deep black background (`#0a0a0a`)
- Purple/indigo accent glow (`#6366f1`, `#818cf8`)
- Inter + JetBrains Mono typography
- Backdrop blur panels with grain texture
- Custom styled range inputs

## 📄 License

MIT

## Terms & Disclaimer

By using this project you agree to the following.

- **No warranty.** This software is provided "as is", without warranty of any kind, express or implied, including merchantability, fitness for a particular purpose, and non-infringement.
- **No liability.** To the maximum extent permitted by law, the author and contributors are not liable for any claim, loss, or damage (direct, indirect, incidental, or consequential, including lost data or profits) arising from its use.
- **Your responsibility.** You use it at your own risk and are responsible for complying with the laws that apply to you.
- **Third parties.** Names, logos, APIs, and services of others belong to their owners and are used for identification only; no affiliation or endorsement is implied.
- **Your statutory rights.** Nothing here limits rights that cannot be waived by agreement, including under consumer-protection laws in the USA, Canada (including Quebec), and India (Consumer Protection Act, 2019).
- **License.** Use, copying, and distribution are governed by the [LICENSE](LICENSE) file; if anything here conflicts with it, the license controls.

## Content, Assets & Fair Use

- **Original work.** Unless noted otherwise (including below), the code, text, design, and images in this repository were created by the author.
- **Libraries, fonts, and icons.** Third-party libraries, fonts (for example Google Fonts), and icon sets belong to their creators and are used under their own licenses; see the dependency manifests and each source for terms.
- **Logos, brands, and screenshots.** Third-party names, logos, and screenshots appear only to identify or describe their products (nominative use). They remain the property of their owners and do not imply affiliation or endorsement.
- **Ideas and inspiration.** Where this project is inspired by another product, game, or idea, it is an independent implementation. It borrows only general ideas, mechanics, or styles, which are not anyone's exclusive property, and is meant to contain no third-party code or artwork used without permission.
- **Fair use and fair dealing.** Any third-party material is used in limited ways for purposes such as education, research, review, commentary, or identification, relying on fair use in the USA (17 U.S.C. § 107), fair dealing in Canada (Copyright Act, ss. 29–29.2), and fair dealing in India (Copyright Act, 1957, s. 52), where they apply.
- **Concerns and takedown requests.** If you own rights in something here and believe it is used improperly, [open an issue](https://github.com/Sanjays2402/flow-field/issues) or contact the author through their GitHub profile with a link to the material and your claim. It will be reviewed promptly and credited, changed, or removed as appropriate. You may also use GitHub's DMCA process.
- **Contributions.** By contributing, you confirm you have the right to submit your contribution and agree it is licensed under this repository's license.
- **Website.** The project site has its own [Terms](https://sanjays2402.github.io/flow-field/terms.html) and [Fair Use](https://sanjays2402.github.io/flow-field/fair-use.html) pages.
