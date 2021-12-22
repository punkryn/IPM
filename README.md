# IPM
통합암호관리란 잊어버리기 쉬운 계정과 암호를 한 곳에서 통합적으로 관리하여 잊어버려도 쉽게 바로 찾을 수 있도록 하는 서비스입니다.



## How to use
1. http://146.56.133.92:3071/ 으로 접속
2. 회원이 아니라면 회원가입을 진행
3. 회원가입한 이메일 계정으로 로그인

4. 하단의 + 버튼으로 데이터 추가
    - 현재 선택된 탭에 데이터가 추가됨
    - HOST: 사이트 이름 또는 서비스 이름 등 계정이 생성된 곳의 정보를 입력
    - ID: 계정명을 입력
    - HINT: 암호를 보지 않아도 바로 알 수 있게끔 암호의 특징을 작성
    - PASSWORD: 계정의 암호를 작성
    - Enter로 작성된 정보 제출

5. 데이터 컨트롤
    - 추가된 정보는 우측의 휴지통 모양을 클릭하면 삭제됨
    - HINT를 봐도 암호를 알 수 없다면 '암호 보기' 버튼을 클릭하여 확인
    - '암호 보기' 버튼에 입력할 암호는 로그인시 입력한 암호와 동일
    - 탭을 삭제하면 탭에 속한 데이터 모두 삭제
  
6. 탭 컨트롤
    - 탭 메뉴의 +버튼을 누르면 탭이 추가됨
    - 탭을 클릭하면 해당 탭이 활성화어 탭에 속한 데이터가 표시됨
    - 활성화된 탭을 한 번 더 클릭하여 탭 이름 변경
    - 탭 이름 우측의 휴지통 클릭하여 삭제
  
7. 사이드 네비게이션
    - 탭과 탭에 속한 데이터의 호스트명 표시
    - 호스트명을 클릭하면 해당 데이터가 속한 탭 활성화
  
8. 로그아웃
    - 우측 상단의 이미지를 클릭하여 모달창 활성화
    - 모달창의 로그아웃 버튼 클릭


## Example
1. 로그인 화면

![로그인](https://user-images.githubusercontent.com/22855979/147020315-b0494469-f0e0-4f30-af4b-86f71121bfb1.png)

2. 회원 가입 화면

![signup](https://user-images.githubusercontent.com/22855979/147020488-18b0006f-5b2e-4914-a7c9-dce213f18dbd.png)

3. 첫 화면

![init](https://user-images.githubusercontent.com/22855979/147020682-0c087c4b-f990-4a2e-8f2a-95605a6baee7.png)

4. 데이터 컨트롤

![data](https://user-images.githubusercontent.com/22855979/147021617-06c8ec4e-70b9-44f5-b706-ed307287c754.gif)

5. 탭 컨트롤

![tab](https://user-images.githubusercontent.com/22855979/147021907-d4dfdc0a-58d3-47e9-b95b-58a1d51b36d7.gif)


## Detail
### Front
1. package.json
      - npm init으로 생성
      - npm i react react-dom
      - npm i typescript @types/react @types/react-dom
2. .eslintrc
      - eslint 설정 파일
      - npm i -D eslint
3. .prettierrc
      - prettier 설정 파일
      - npm i -D prettier eslint-plugin-prettier eslint-config-prettier
4. tsconfig.json
      - lib은 ES2020, DOM(브라우저), module은 esnext처럼 최신 설정이지만 target은 es5로 IE 브라우저에서도 돌아갈 수 있게 변환
      - strict: true를 켜놓아야 타입 체킹을 해줘서 의미가 있음.
5. webpack.config.ts
      - 웹팩 설정
      - ts, css, json, 최신 문법 js 파일들을 하나로 합쳐줌.
      - npm i -D webpack @types/webpack @types/node
      - entry에서 파일을 선택하면 module에 정해진 rules대로 js로 변환하여 하나의 파일로 합쳐줌(output). plugins는 합치는 중 부가적인 효과를 줌
      - ts는 babel-loader로, css는 style-loader와 css-loader를 통해 js로 변환
      - babel에서는 @babel/preset-env(최신문법 변환) @babel/preset-react(리액트 jsx 변환), @babel/preset-typescript(타입스크립트 변환)
      - npm i -D css-loader style-loader @babel/core babel-loader @babel/preset-env @babel/preset-react @babel/preset-typescript
      - publicPath가 /dist/고 [name].js에서 [name]이 entry에 적힌대로 app으로 바뀌어 /dist/app.js가 결과물이 됨.
6. index.html 작성
      - #app 태그에 리액트가 렌더링됨.
      - ./dist/app.js로 웹팩이 만들어낸 js파일 불러옴
7. tsconfig-for-webpack-config.json
      - webpack할 때 webpack.config.ts를 인식 못하는 문제
      - npm i cross-env
      - package.json의 scripts의 build를 cross-env TS_NODE_PROJECT=\"tsconfig-for-webpack-config.json\" webpack
      - npm run build
8. 웹팩 데브 서버 설치
      - 개발용 서버인 devServer 옵션 추가
      - webpack serve할 때 webpack.config.ts를 인식 못하는 문제
      - npm i -D ts-node webpack-dev-server @types/webpack-dev-server webpack-cli
      - package.json의 scripts의 dev를 cross-env TS_NODE_PROJECT=\"tsconfig-for-webpack-config.json\" webpack serve --env development
9. hot reloading 설정
      - npm i -D @pmmmwh/react-refresh-webpack-plugin react-refresh
      - webpack의 babel-loader 안에 설정(env) 및 plugin으로 추가
10. fork-ts-checker-webpack-plugin
        - webpack은 ts체크 후 eslint체크 후 빌드 시작
        - ts랑 eslint는 동시에 체크하면 더 효율적
        - 이 플러그인이 동시에 진행하게 해줌.
11. 폴더 구조 세팅
      - 페이지들은 pages
      - 페이지간 공통되는 틀은 layouts
      - 개별 컴포넌트는 components
      - 커스텀훅은 hooks, 기타 함수는 utils 
      - 각 컴포넌트는 컴포넌트 폴더 아래 index.tsx(JSX)와 styles.tsx(스타일링)
12. ts와 webpack에서 alias 지정
      - npm i -D tsconfig-paths
      - tsconfig에서 baseUrl와 paths 설정
      - webpack에서는 resolve안에 alias 설정
      - ../layouts/App같은 것을 @layouts/App으로 접근 가능
13. emotion 세팅
      - styled components와 비슷하지만 설정이 간단함.
      - npm i @emotion/react @emotion/styled
      - npm i -D @emotion/babel-plugin (웹팩에 babel 설정 추가)
14. @layouts/App 작성
      - 리액트 라우터 적용하기
      - npm i react-router react-router-dom
      - npm i -D @types/react-router @types/react-router-dom
      - client.tsx에서 App을 BrowserRouter로 감싸기
      - @layouts/App에 Route, Navigate, Redirect, Routes 넣기
15. @loadable/component
        - 라우터를 코드스플리팅 해줌
        - npm i @loadable/component @types/loadable__component
16. @pages/SignUp 작성
        - 암호가 일치하는지 닉네임은 입력하였는지 등 유효성 검사

17. 회원가입 axios로 진행
      - npm i axios
      - CORS 문제를 피하기 위해서 devServer에 proxy 세팅
  
18. @pages/LogIn 작성 및 SWR
      - npm i swr
      - 로그인한 사람은 회원가입/로그인 페이지에 접근하면 redirect
      - SWR에 fetcher(axios를 사용)를 달아줌.
      - 로그인했음을 증명하기 위해 withCredentials: true

19. @layouts/Workspace 작성
      - 눈에 띄는 구역 단위로 스타일드컴포넌트로 만들어둠.
      - 구역 내부의 태그들은 스타일드컴포넌트로 만들면 변수명 지어야 하니 css선택자로 선택

20. 그라바타
      - npm i gravatar @types/gravatar
      - Github같은 아이콘을 만들 수 있음

21. @pages/List 작성
        - workspace 하위 페이지로 탭 메뉴, 탭 데이터, 푸시버튼 컴포넌트를 자식으로 렌더링
        - 로그인시 가장 왼쪽 탭이 활성화되어 보이도록 탭 id의 최솟값을 계산

22. @components/Tabnav 작성
        - 접속한 유저의 탭 메뉴를 가져옴
        - 탭 메뉴와 삭제 모달창으로 구성
        - swr 활용하여 활성화된 탭 공유
        
23. @components/Tabcontent 작성
        - 활성화된 탭의 데이터를 보여줌
        - '암호 보기' 버튼 클릭시 모달창 팝업
        - 모달창 내에서 암호 입력시 암호 데이터 보여줌

24. @components/PushButton 작성
      - 입력한 데이터 정보 제출
      - axios로 이용

25. @components/HostList 작성
        - swr로 현재 활성화된 탭 정보 활용
        - 클릭시 탭 활성화 변경
        - 접기/펼치기 버튼

26. 유저 테스트 해보기
27. 빌드 설정
28. 빌드 결과물인 JS와 html을 github private repository에 push

### Back
1. MySQL 설치 및 스키마, 테이블 생성
2. ERD
![ERD](https://user-images.githubusercontent.com/22855979/147027958-24b8e519-bc32-4a8e-877c-eeb706067a8e.png)

3. package.json
        - npm init으로 생성
        - express 설치

4. tsconfig.json
        - strict: true
        - 빌드 결과 dist폴더로 출력
        
5. app.ts 작성
        - PORT 동작 확인
        - mysql과 연결
        - cors 설정
        - 정적파일 제공
        - body parser 설정
        - cookie parser 설정
        - dotenv 설치
        - npm i dotenv
        - 세션 설정
        - 라우터 분리

6. routes/api.ts 작성
        - 이곳에서 api 라우터 작성

7. passport 라이브러리를 이용한 로그인 전략 수립
        - passport 폴더 밑에 index.ts, local.ts 생성
        - local.ts에 로컬 전략
        - 이메일 존재 여부, 암호 일치 여부를 파악

8. API 작성
        - API.md 참조

9. 빌드 및 배포
        - github private repository에 dist폴더 아래의 파일들을 push


### Server


