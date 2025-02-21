# 2-naheun-lee-community-fe
### 📌 프로젝트 개요


게시판에 글을 등록하고 다른 사용자의 글을 볼 수 있는 커뮤니티 만들기

### 📁 프로젝트 디렉토리 구조


```html
2-NAHEUN-LEE-COMMUNITY-FE/
│── assets/
│   │── component/
│   │   └── DropdownMenu.js
│   └── image/
│       └── 커피.jpg
│
│── auth/
│   │── login.css
│   │── login.html
│   │── login.js
│   │── signup.css
│   │── signup.html
│   └── signup.js
│
│── community/
│   │── editpost.css
│   │── editpost.html
│   │── editpost.js
│   │── makepost.css
│   │── makepost.html
│   │── makepost.js
│   │── posts.css
│   │── posts.html
│   │── posts.js
│   │── viewpost.css
│   │── viewpost.html
│   └── viewpost.js
│
│── profile/  
│   │── editpassword.css
│   │── editpassword.html
│   │── editpassword.js
│   │── editprofile.css
│   │── editprofile.html
│   └── editprofile.js
│
└── README.md
```

- DropdownMenu: 드롭다운 메뉴 컴포넌트
- auth: 로그인/회원가입 처리
- community: 게시판 기능 수행
- profile: 회원 정보 수정

### ✏️ 프로젝트 주요 기능


- **로그인 (login.html)**
    - 이메일, 비밀번호 유효성 검사
    - 회원가입 페이지로 이동
    - 로그인
- **회원가입 (signup.html)**
    - 이메일, 비밀번호, 닉네임, 프로필 사진 유효성 검사
    - 로그인 페이지로 이동
    - 회원가입
- **게시판 (posts.html)**
    - 게시글 리스트 인피니티 스크롤
    - 게시글 작성 페이지로 이동
    - 각 게시글 조회 페이지로 이동
- **게시글 조회 (viewpost.html)**
    - 게시글 수정 페이지로 이동
    - 게시글 삭제
    - 좋아요 누르기
    - 좋아요수, 조회수, 댓글 확인 가능
    - 댓글 등록/수정/삭제
- **게시글 수정 (editpost.html)**
    - 제목, 내용, 이미지 수정 가능
    - 게시글 조회 페이지로 이동
- **게시글 작성 (makepost.html)**
    - 새로운 게시글 등록
- **드롭다운**
    - 로그인/회원가입 페이지를 제외한 나머지 페이지의 오른쪽 상단에 프로필을 누르면 드롭다운 메뉴가 보여진다.
    - 각 메뉴마다 회원정보 수정, 비밀번호 수정 페이지로 이동할 수 있고 로그아웃 할 수 있다.
- **회원정보 수정(editprofile.html)**
    - 이메일, 닉네임, 프로필 사진 수정
    - 완료되면 게시판 페이지로 이동
    - 회원 탈퇴
- **비밀번호 수정(editpassword.html)**
    - 비밀번호 수정
    - 완료되면 게시판 페이지로 이동