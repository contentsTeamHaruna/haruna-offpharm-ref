# 오프약국 매대 레퍼런스 픽

명동 오프약국 2026-10-16 촬영 55장을 펼쳐 놓고 팀원이 이름별로 고르는 페이지.

- 화면: GitHub Pages (`public/`)
- 저장: Cloudflare Worker `haruna-offpharm-ref` 의 `/api/picks`, D1 `haruna-select-260903` 의 `pharmpicks` 테이블
- 고치는 법: `public/index.html` 의 `G` 배열에서 유형 문구와 사진 묶음을 고친 뒤 push. Worker 를 고쳤으면 `npx wrangler deploy`
