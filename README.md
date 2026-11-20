# Choice of God · 신의 선택

**창세기와 출애굽기를 배경으로 한 선택 기반 서사 멀티 장르 게임 (HTML5 / PWA · 5개 국어 실시간 지원)**  
*Genesis & Exodus Choice-Driven Multi-Genre Narrative Adventure*

---

## 🌐 바로 플레이 & 다운로드 (Play & Download)

- **웹 / 안드로이드 / iOS / 데스크톱 즉시 플레이 (GitHub Pages)**:  
  `https://karan211-bruno.github.io/choice-of-god/`
- **GitHub 저장소**:  
  `https://github.com/karan211-bruno/choice-of-god`
- **ZIP 압축 패키지 다운로드 (GitHub Releases)**:  
  `https://github.com/karan211-bruno/choice-of-god/releases`

---

## ✨ 핵심 특징 (Key Features)

1. **자유로운 시점·스테이지 선택 (Free Stage & Viewpoint Selection)**
   - 연대기 지도에서 **아담과 하와(에덴)**, **노아(방주)**, **아브라함(약속의 여정)**, **모세(10재앙 · 홍해 · 시내산)** 중 원하는 시점을 언제든 자유롭게 선택해 플레이할 수 있습니다.
   - **최고 점수 루트**: 1장 에덴동산(1-4)에서 선악과 유혹을 끝까지 이겨내면 **+5,000점 천국 왕관 보너스**를 획득합니다. 선악과를 선택해도 게임은 끝나지 않고 인류 역사와 출애굽기 구원의 서사로 자연스럽게 이어집니다.

2. **6개 챕터 × 4단계 = 총 24개 멀티 장르 스테이지**
   - **1장. 에덴동산 (창세기 1–3)**: 2D 탑다운 수호 액션 & 빛의 말씀 파동 + 분기 선택
   - **2장. 노아의 방주 (창세기 6–9)**: 자원 수집 · 암수 짝짓기 · 폭풍 균형 수리 · 비둘기 비행
   - **3장. 아브라함 (창세기 12–22)**: 선택형 서사 전략 RPG · 밤하늘 별자리 연결 퍼즐
   - **4장. 모세와 10재앙 (출애굽기 3–12)**: 3표적 순서 퍼즐 · 턴제 전략 카드 · 유월절 문설주 방어
   - **5장. 홍해 도하 (출애굽기 13–15)**: 불기둥 추적 · 기적 타이밍 · 3레인 마른 땅 러너 · 찬양 리듬
   - **6장. 시내산 (출애굽기 16–40)**: 일일 만나 관리 · 호렙 반석 수로 퍼즐 · 십계명 & 금송아지 거부 · 성막 완성 피날레

3. **게임 내 5개 국어 실시간 전환 (In-Game Live Switching)**
   - 한국어(`ko`), English(`en`), 日本語(`ja`), Español(`es`), 中文(`zh`) — 상단 드롭다운 또는 설정 창에서 즉시 전환 가능.

4. **레벨 연동 동적 천사 가이드 & 성물 아이템 시스템**
   - 레벨 상승에 따라 **그룹 천사(체루빔)** → **여호와의 사자** → **구름기둥과 불기둥** → **가브리엘** → **미가엘**이 합류합니다.
   - 스테이지에서 얻은 8가지 성물 아이템을 플레이 중 클릭해 실제 게임 효과를 발동할 수 있습니다.

---

## 💻 로컬 실행 및 앱 설치 방법

### 1) 가장 쉬운 실행 (Mac / Windows / Linux)
- 압축을 푼 폴더에서 `index.html`을 더블 클릭해 브라우저로 열거나,
  - **macOS**: `scripts/Play_Mac.command` 실행
  - **Windows**: `scripts/Play_Windows.bat` 실행
  - **Linux**: `scripts/Play_Linux.sh` 실행

### 2) 안드로이드 / iOS / PC 앱처럼 설치 (PWA)
- 위 GitHub Pages 주소를 Chrome(Android/PC) 또는 Safari(iOS)로 연 뒤 **「홈 화면에 추가」 / 「앱 설치」**를 선택하면 오프라인에서도 실행되는 앱으로 설치됩니다.

### 3) 데스크톱 네이티브 설치 파일 빌드 (.dmg / .exe / .AppImage)
- `desktop/` 폴더에서 Electron 빌더가 설정되어 있습니다:
  ```bash
  cd desktop
  npm install
  npm run dist:mac   # macOS .dmg
  npm run dist:win   # Windows .exe
  npm run dist:linux # Linux .AppImage / .deb
  ```
- GitHub Actions(`.github/workflows/build-desktop.yml`)를 수동 실행(`workflow_dispatch`)하거나 `v*` 태그를 푸시하면 3개 OS용 설치 파일을 자동 생성할 수 있습니다.

---

## 📚 문서 안내
- [설치 및 실행 가이드](docs/installation_guide.md)
- [게임 기획서 (챕터·장르·분기)](docs/game_design.md)
- [성경 구절 색인](docs/bible_references.md)
