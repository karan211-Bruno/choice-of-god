# 설치 및 실행 가이드 (v2.0 Action RPG)

## 1. 로컬 ZIP 압축 해제 후 바로 실행 (Mac · Windows · Linux)
1. `ChoiceOfGod_v2.0.zip` 압축을 풉니다.
2. 폴더 내 `index.html`을 더블 클릭하거나, OS별 런처를 실행하세요:
   - **macOS**: `scripts/Play_Mac.command`
   - **Windows**: `scripts/Play_Windows.bat`
   - **Linux**: `./scripts/Play_Linux.sh`

## 2. 온라인 플레이 & PWA 앱 설치 (Android / iOS / PC)
- 주소: `https://karan211-bruno.github.io/choice-of-god/`
- Chrome 또는 Safari 메뉴에서 **「앱 설치」 / 「홈 화면에 추가」**를 누르면 오프라인에서도 작동하는 독립 앱으로 설치됩니다.

## 3. 데스크톱 네이티브 설치 파일 빌드 (.dmg / .exe / .AppImage)
```bash
cd desktop
npm install
npm run dist:mac    # macOS .dmg
npm run dist:win    # Windows .exe
npm run dist:linux  # Linux .AppImage / .deb
```
