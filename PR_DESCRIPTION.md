## 📝 요약 (Summary)

> `main` 페이지의 구조를 FSD 기준에 맞게 다시 정리하고, 메인 랜딩 섹션들의 책임과 소유권을 명확히 분리했습니다.
> 페이지 조립 책임은 `pages/main`으로 올리고, `features/main` 내부는 `ui / components / hooks / constants / types / utils` 레이어 규칙에 맞게 재배치했습니다.

## ✅ 주요 변경 사항 (Key Changes)

- `MainPage`가 다시 페이지 조립 책임을 가지도록 구조를 정리했습니다.
- `AssignmentHelp`, `ExecutionOnly`, `PromptNoHesitation`, `WhatToDo` 섹션을 현재 구조 기준에 맞게 재배치했습니다.
- `components/features` 아래에는 UI만 남기고, 로직/타입/데이터/상수/유틸은 각 레이어로 분리했습니다.
- `AssignmentHelp`와 `ExecutionOnly`의 내부 owner 관계를 다시 정리해 폴더 구조만 봐도 책임이 보이도록 맞췄습니다.
- `test` 브랜치의 `MainHeroCaptureSection`을 현재 구조에 맞춰 가져왔고, `WhatToDoSection` 스타일도 반영했습니다.
- 메인 섹션 전환 타이밍 관련 수정도 함께 반영했습니다.

## 💻 상세 구현 내용 (Implementation Details)

### 1. 메인 페이지 조립 책임 정리

- `MainPage`가 각 섹션을 직접 조립하도록 구조를 다시 잡았습니다.
- 이전처럼 특정 내부 컴포넌트가 사실상 페이지 전체를 대신 렌더링하는 구조를 제거했습니다.
- 그 결과 페이지 레벨 책임과 섹션 내부 책임이 분리되었습니다.

### 2. `features/main` 레이어 규칙 정리

이번 작업에서 가장 크게 정리한 기준은 아래와 같습니다.

- `src/features/main/ui`
  - 메인 feature의 공개 섹션 엔트리
- `src/features/main/components/features`
  - 섹션/기능 전용 UI 컴포넌트
- `src/features/main/components/common`
  - 여러 UI에서 공통으로 쓰는 UI 컴포넌트
- `src/features/main/hooks`
  - 섹션/기능 전용 훅
- `src/features/main/constants`
  - 섹션/기능 전용 상수/데이터
- `src/features/main/types`
  - 섹션/기능 전용 타입
- `src/features/main/utils`
  - 섹션/기능 전용 계산 로직

이 기준으로 `components/features` 아래에 섞여 있던 비-UI 파일들을 걷어냈고, owner 기준 하위 폴더와 레이어 기준 상위 폴더가 동시에 성립하도록 구조를 맞췄습니다.

### 3. `AssignmentHelp` 구조 재정리

`AssignmentHelp`는 이번 PR에서 가장 많이 손본 영역입니다.

- 공개 섹션 이름을 `AssignmentHelpSection`으로 정리했습니다.
- `promptScene`, `timeLossScene`, `scrollFlow`로 관심사를 분리했습니다.
- `promptScene`
  - `AssignmentHelpPromptScene`
  - `AssignmentHelpTitle`
  - `AssignmentHelpComposer`
  - `AssignmentHelpConversation`
  - `AssignmentHelpMessage`
  의 owner 관계가 드러나도록 재배치했습니다.
- `timeLossScene`
  - `TimeLossScene`
  - `TimeLossPhraseCloud`
  - phrase motion hook
  - phrase data
  구조를 owner 기준으로 닫았습니다.
- `scrollFlow`
  - 섹션 progress 계산
  - 상태 파생
  - 스크롤 길이 상수
  를 다시 정리했습니다.
- `components/features/assignmentHelp` 아래에는 UI만 남기고, story data / types / hooks / scroll 계산 로직은 각 레이어로 이동했습니다.

또한 스크롤 기반 상태 계산 구조를 정리하면서:

- 페이지가 내부 상태를 직접 아는 구조를 제거했고
- 섹션 내부 상태는 섹션 전용 훅으로 내렸고
- 장면 전환 규칙과 메시지 표시 규칙도 구조에 맞게 다시 배치했습니다.

### 4. `ExecutionOnly` 구조 재정리

`ExecutionOnly`도 UI owner 관계와 flow 책임을 다시 정리했습니다.

- `ExecutionOnlySection`이 과하게 많은 orchestration을 직접 수행하던 구조를 줄였습니다.
- 섹션 내부 상태 계산은 `useExecutionOnlySectionState`로 내렸습니다.
- `AnalysisStage`와 `RoadmapStage`의 하위 UI 관계를 다시 정리했습니다.
  - `AnalysisPanel`
  - `AnalysisPanelReveal`
  - `ReferenceDataPanel`
  - `AssignmentTypeCard`
  - `SolutionRoadmapList`
  - `RoadmapStepCard`
- 기존 `common` 폴더 중 실제 공용이 아닌 곳은 owner 하위로 재배치했습니다.
- `ExecutionOnly` 전용 상수, 데이터, 타입, 훅, 타임라인 계산 로직도 owner별 레이어로 이동했습니다.

### 5. `PromptNoHesitation` / `WhatToDo` / 신규 섹션 반영

- `PromptNoHesitationSection`
  - 현재 구조 기준으로 import 경로를 정리했습니다.
- `WhatToDoSection`
  - `test` 브랜치 스타일에 맞게 풀스크린 클로징 섹션 형태로 조정했습니다.
- `MainHeroCaptureSection`
  - `test` 브랜치에 있던 신규 섹션을 현재 구조에 맞게 추가했습니다.
  - 관련 아이콘 asset도 함께 반영했습니다.

### 6. `index.ts` barrel 정리

- owner 단위로 `index.ts`를 추가해 import 경로를 단순화했습니다.
- 섹션/기능별 진입 경로가 읽기 쉽게 정리됐고, 상위 파일들이 세부 폴더 깊이를 직접 알지 않도록 맞췄습니다.

### 7. 레거시 구조 제거

- 이전 구조에서 남아 있던:
  - `PromptScrollSequence`
  - `preSolutionSection`
  - `solutionSection`
  - `whatToDoSection`
  - `promptNoHesitationSection`
  등의 레거시 경로를 단계적으로 제거했습니다.
- old structure와 new structure가 동시에 공존하던 상태를 정리해서, 현재 구조 기준이 명확해졌습니다.

## 🚀 트러블 슈팅 (Trouble Shooting)

### 1. owner 분리와 레이어 분리를 다르게 보고 있었던 문제

초기에는 `AssignmentHelp`, `ExecutionOnly` 같은 owner 아래로 파일을 몰아넣는 방향으로 먼저 정리했습니다.
하지만 이후 기준을 다시 맞추면서, `components/features`는 UI만 두고 `hooks / constants / types / utils`는 별도 레이어로 분리해야 한다는 규칙을 다시 세웠습니다.

이 과정에서:

- owner 기준 분리
- 레이어 기준 분리

를 동시에 만족하도록 구조를 다시 한 번 손봤습니다.

### 2. `components/features` 아래 비-UI 파일이 남아 있던 문제

처음 정리 단계에서는 owner 기준으로 맞추느라:

- data
- types
- scrollFlow
- hooks

같은 파일이 `components/features/*` 아래에 들어가 있었습니다.

이후 `components/features`는 UI 전용이라는 기준을 명확히 하고, 비-UI 파일들을 owner별 `hooks / constants / types / utils` 레이어로 다시 이동했습니다.

### 3. leaf UI 내부의 중복 `ui` 폴더 문제

owner 이름이 이미 폴더에 드러나는 leaf 컴포넌트에서 `ui/Component.tsx` 구조가 반복되고 있었습니다.
이 경우 폴더 의미가 중복되고 경로만 길어지기 때문에, leaf owner 내부 `ui`를 제거하고 더 단순한 경로로 정리했습니다.

### 4. `AssignmentHelp` 전환 타이밍 분석

`AssignmentHelp`는 스크롤 기반 스토리 섹션이라, 단순 레이아웃 정리만으로 끝나지 않았습니다.
특히 `chat -> timeLoss -> next section` 전환 체감이 어떻게 결정되는지 분석하면서:

- `sectionScrollConfig`
- `deriveAssignmentHelpState`
- `chat stage progress`
- `timeLoss progress`

의 역할을 다시 나눠서 점검했습니다.

### 5. `main` 최신 변경 병합

작업 중간에 다른 PR이 `main`에 먼저 머지되어, 현재 브랜치에 최신 `main`을 반영해야 했습니다.
로컬 `main`을 `origin/main`과 먼저 맞춘 뒤, 현재 작업 브랜치에 merge하는 방식으로 반영했고 충돌 없이 정리했습니다.

## ⚠️ 알려진 이슈 및 참고 사항 (Known Issues & Notes)

- 이번 PR은 메인 feature의 구조 정리와 섹션 책임 분리에 집중했습니다.
- `AssignmentHelp` 스크롤 전환 타이밍은 일부 추가 조정 여지가 있습니다.
- `ExecutionOnly` 레이아웃은 구조적으로는 정리됐지만, 특정 뷰포트에서 카드가 눌려 보이는 문제는 별도 UI 조정이 더 필요할 수 있습니다.
- `MainHeroCaptureSection`은 이후 실제 서비스 흐름에 맞춘 카피/폼 검토가 필요할 수 있습니다.

## 📸 스크린샷 (Screenshots)

> 메인 랜딩 페이지 구조 정리 전/후 비교 스크린샷, `MainHeroCaptureSection` 추가 화면, `WhatToDoSection` 변경 화면 첨부 예정

## #️⃣ 관련 이슈 (Related Issues)

- 없음
