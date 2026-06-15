# Daily Focus 🦊

순수 **HTML / CSS / JS** 로 만든 간단한 랜딩페이지 + 할 일 목록(Todo) 앱입니다.
데이터는 **Supabase** 데이터베이스에 저장되며, **GitHub Actions** 로 **GitHub Pages** 에 자동 배포됩니다.

## 📁 폴더 구조

```
new_project/
├── index.html              # 랜딩페이지 (마크업)
├── css/
│   └── style.css           # 스타일
├── js/
│   ├── config.js           # Supabase 연결 설정 (URL / anon key)
│   └── app.js              # 할 일 CRUD 로직
├── .github/workflows/
│   └── deploy.yml          # Pages 자동 배포 워크플로우
└── README.md
```

## 🗄️ 데이터베이스 (Supabase)

`np_todos` 테이블

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | `bigint` (PK, 자동증가) | 식별자 |
| `content` | `text` | 할 일 내용 |
| `is_done` | `boolean` | 완료 여부 (기본 `false`) |
| `created_at` | `timestamptz` | 생성 시각 (기본 `now()`) |

RLS(Row Level Security) 활성화 + 익명(anon) 공개 정책으로 누구나 읽기/쓰기가 가능합니다.

## 🚀 로컬에서 실행

순수 정적 사이트라 별도 빌드가 필요 없습니다. 로컬 서버로 열어보세요:

```powershell
# Python 이 있다면
python -m http.server 5500
# 브라우저에서 http://localhost:5500 접속
```

## 🌐 배포

`main` 브랜치에 push 하면 GitHub Actions 가 자동으로 GitHub Pages 에 배포합니다.
