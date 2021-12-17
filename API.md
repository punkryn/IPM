# REST API

HTTP 요청 리스트(ajax)

### POST /users

- 회원가입
- body: { email: string(이메일), nickname: string(닉네임), password: string(비밀번호) }
- return: 'ok'

### POST /users/login

- 로그인
- body: {email: string(이메일), password: string(비밀번호)}
- return: IUser

### GET /users

- 내 로그인 정보를 가져옴, 로그인되어있지 않으면 false
- return: IUser | false

### POST /users/logout

- 로그아웃
- return: 'logout ok'

### POST /tab/:tab

- :tab인 탭에 정보 추가
- body: { id: string(아이디), host: string(호스트), pwd: string(패스워드), hint: string(힌트) }
- return: 'ok'

### GET /tab/:nickname

- :nickname으로 로그인 한 유저의 탭 중 id가 가장 낮은 탭의 id를 가져옴
- return [{minId: number}]

### GET /tab/info/:nickname

- :nickname으로 로그인 한 유저의 탭에 있는 모든 데이터 가져옴
- return IInfo[]

### POST /tab

- 탭 추가
- body: { id: number(유저id) }
- return: 'ok'

### DELETE /tab/:id

- :id인 탭 삭제
- return: 'ok'

### PATCH /tab/:id

- :id인 탭 이름 변경
- body: { name: string(탭 이름) }
- return: 'ok'

### POST /users/:nickname/password

- :nickname으로 로그인한 유저의 특정 행 비밀번호 열람 요청
- body: { password: string(로그인 암호), currentPwd: number(비밀번호 테이블 id) }
- return: userPassword: string
