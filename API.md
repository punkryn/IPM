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
