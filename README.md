# Underworld-Line

버그없는 익명 채팅 프로그램을 목표로 합니다.<br>
Version : 1.6.1

## 사용법

0. utils.js에서 HOST와 PORT를 설정합니다.(변경 사항이 있는 경우)
1. 개발 환경 설정: `npm install`
~~2. 서버 구동: `node server`~~
3. 클라이언트 접속: `node client`
   - '/'로 시작하는 아이디는 만들 수 없습니다.
   - ' '이 포함되는 아이디는 만들 수 없습니다.
4. 서버/클라이언트 종료: `Control + C`
   - 서버 종료: `/shutdown`
5. 기타
   - '\n'('')는 전달되지 않습니다.
   - '/'로 시작하는 구문은 명령어 외에는 전달되지 않습니다. 현재 가능한 명령어는 다음과 같습니다.
     - `/users` : 현재 인원과 접속한 아이디를 출력합니다.
     - `/w ID TEXT` : ID에게 TEXT를 전송합니다. C2C, S2C가 가능합니다.
     - `/kick ID` : (서버)해당 유저를 추방합니다.
     - `/shutdown` : (서버)서버를 닫습니다.

## 목표와 사전 설계

1. 서버-클라이언트 구조
2. 로그인 후 채팅창 진입
   - 익명 채팅이기 때문에 회원가입은 구현하지 않는다.
   - 서버에 현재 접속중인 아이디가 아닌 경우 채팅창에 진입한다.
3. 모듈을 최대한 분리해 가독성을 올린다.
4. 내 채팅, 상대 채팅, 서버 알림을 색으로 구별한다.
5. 정보 전달은 객체를 통해 전달한다.
6. Console Colour
   - 본인 입력 : 기본
   - 서버 알림 : blue
   - 오류, 강퇴 알림 : red
   - 채팅 : green
   - 귓속말 : magenta
   - 서버 공지, 서버로부터의 귓속말, 현재 인원 : yellow
7. 재사용성이 있는 로직은 최대한 분리한다.

## 추가 기능

1. 서버 공지 기능
   - 서버에 콘솔 입력 기능 구현, 클라이언트에 출력 기능 구현
2. 명령어 기능
   - 서버/클라이언트 명령어
      - `/users` : 현재 인원, 아이디 출력
      - `/w ID TEXT` : ID에게 귓속말 전송
   - 서버 명령어
      - `/kick ID` : 해당 유저를 추방
      - `/shutdown` : 서버를 종료
   - 클라이언트 명령어
      - `/quit` : 프로그램 종료(Control + C)
3. 아이디 유효 검사 정규표현식 도입
   - 귓속말 로직을 정규표현식으로 교체하려했으나, 아직 명령어의 개수가 적어 정규표현식의 도입이 굳이 필요없는 것 같았음
4. 스페이스바 도배 방지

## 추후 업데이트 예정 목록

1. IP 출력
   - remoteAddress를 통해 IP를 출력할 수 있으나, 외부 IP는 아니다.
2. Server, Client 간 API 정리
3. 원인을 알 수 없는 오류를 발견했습니다.
   - undefined:1 GET / HTTP/1.1

## Status Code

    - 100 : 로그인 요청
    - 101 : 로그인 승인
    - 102 : 로그인 알림
    - 110 : 로그인-아이디 중복
    - 111 : 로그인-사용할 수 없는 문자 사용
    - 150 : 로그아웃
    - 200 : 채팅 전송 요청
    - 201 : 채팅 전송
    - 210 : 명령어 전송 요청
    - 211 : 명령어 전송 승인
    - 220 : 귓속말 전송 요청
    - 221 : 귓속말 전송 승인
    - 222 : 귓속말 전송 거부
    - 225 : 서버 귓속말 전송
    - 250 : 공지 전송
    - 300 : 유저 강퇴
    - 310 : 유저 강퇴 알림

## 검토 중인 사항

1. 서버 관리자 기능
   - IP 밴
2. 모든 기능이 검증될 경우 log 정보 저장 및 Database로 회원가입 도입
3. 해결: [윈도우에서 안됨](https://velog.io/@whoyoung90/TIL-25-WECODE-React-LUSH-Cloning-npm-install%EC%98%A4%EB%A5%98-%ED%95%B4%EA%B2%B0)
