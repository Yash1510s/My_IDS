## IDS Adversarial Simulation (Frontend)

A modern, single-page React app built with Vite and Tailwind CSS that simulates an Intrusion Detection System (IDS) under normal and adversarial attack modes.

### Features
- React + Vite + Tailwind CSS (darkMode: 'class')
- Animated packets with Framer Motion
- Controls: start/stop, reset, adversarial toggle
- Stats: Packets Scanned, Benign Passed, Attacks Blocked, Attacks Slipped
- Theme toggle (light/dark) with smooth transitions
 - Traffic controls: Packet Rate, Attack Ratio, Decision Threshold
 - Hardened IDS toggle and Scenario Presets

### Getting Started
```bash
cd frontend
npm install
npm run dev
```
Open the printed local URL in your browser.

### Project Structure
- `src/App.jsx`: App wiring and state
- `src/components/Controls.jsx`: Simulation controls
- `src/components/SimulationArea.jsx`: Visual simulation and animations
- `src/components/Stats.jsx`: Counters panel
- `src/components/ThemeToggle.jsx`: Theme switch (dark by default)
 - `src/components/ConfusionMatrix.jsx`: Live TP/FP/TN/FN
 - `src/components/Presets.jsx`: One-click scenarios
 - `src/components/Packet.jsx`: Animated packet unit
- `tailwind.config.js`: Tailwind configuration with `darkMode: 'class'`

### What each part means (plain English)
- **Packets**: Little circles flowing left→right. Green ✓ are safe (benign). Red ⚠️ are attacks. In adversarial mode, some attacks get a glowing ring – they are “disguised”.
- **IDS box**: The checkpoint in the middle. It flashes green when traffic is allowed and red when it’s blocked.
- **Attacks Slipped Through**: This is bad. It means a malicious packet fooled the IDS and reached the destination. The goal is to keep this as low as possible.
- **Controls**:
  - **Packet Rate**: How busy the network is.
  - **Attack Ratio**: How hostile the traffic mix is.
  - **Threshold**: How strict the IDS is. Lower threshold = stricter (blocks more, but may block some good traffic). Higher threshold = looser (lets more pass, but risks missing attacks).
  - **Hardened IDS**: Extra caution mode; it separates benign vs attack scores a bit more to reduce misses.
  - **Presets**: One-click scenarios (Normal Traffic, Light Attack, DDoS Burst, Adversarial Evasion) that set attack mix, rate, and adversarial toggle for you.
- **Stats panel**: Running totals of activity.
- **Confusion Matrix**: Live scoreboard of detection quality:
  - **TP (True Positive)**: Attack blocked (good).
  - **FP (False Positive)**: Benign blocked (annoying).
  - **TN (True Negative)**: Benign allowed (good).
  - **FN (False Negative)**: Attack slipped through (bad) – try lowering the threshold or enabling Hardened IDS.

### Notes
- The UI simulates outcomes of your IDS and adversarial logic; it does not run the Python model in the browser.


