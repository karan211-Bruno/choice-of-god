# 설치 및 실행 가이드 (Installation Guide)

## 1. 로컬 ZIP / 오프라인 실행 (Mac · Windows · Linux)
별도의 게임 엔진이나 서버 설치 없이 바로 실행됩니다.
1. `ChoiceOfGod_v1.0.zip` 압축을 풉니다.
2. 아래 방법 중 편한 것을 실행하세요:
   - **모든 OS 공통**: 폴더 안의 `index.html` 파일을 더블 클릭합니다.
   - **macOS**: `scripts/Play_Mac.command` 더블 클릭
   - **Windows**: `scripts/Play_Windows.bat` 더블 클릭
   - **Linux**: `./scripts/Play_Linux.sh` 실행

> 참고: 게임 진행 기록과 언어 설정은 브라우저의 `localStorage`에 자동 저장됩니다.

---

## 2. 스마트폰(Android / iOS) 및 PC 웹앱(PWA) 설치
1. Chrome, Edge 또는 Safari에서 배포 주소(`https://karan211-bruno.github.io/choice-of-god/`)에 접속합니다.
2. 브라우저 메뉴에서 **「앱 설치」** 또는 **「홈 화면에 추가」**를 누릅니다.
3. 오프라인 캐시(Service Worker)가 적용되어 인터넷 없이도 플레이할 수 있습니다.

---

## 3. 데스크톱 네이티브 설치 파일 (.dmg / .exe / .AppImage)
`desktop/` 폴더에는 Electron 기반 패키징 구성이 포함되어 있습니다.

```bash
cd desktop
npm install
npm run dist:mac    # macOS용 .dmg
npm run dist:win    # Windows용 .exe
npm run dist:linux  # Linux용 .AppImage / .deb
```

또는 GitHub 저장소의 **Actions → Build Desktop Installers** 워크플로우를 실행하여 클라우드에서 3개 OS 설치 파일을 생성할 수 있습니다.
