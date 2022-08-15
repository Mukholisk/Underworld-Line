# Underworld-Line

버그없는 익명 채팅 프로그램을 목표로 합니다.

## 사용법

1. npm install
2. 서버: node server
3. 클라이언트: node client
4. 서버/채팅 종료: ``Control + C``

## 목표와 사전 설계

1. 서버-클라이언트 구조
2. 로그인 후 채팅창 진입
    - 익명 채팅이기 때문에 회원가입은 구현하지 않는다.
    - 서버에 현재 접속중인 아이디가 아닌 경우 채팅창에 진입한다.
3. 모듈을 최대한 분리해 가독성을 올린다.
4. 내 채팅, 상대 채팅, 서버 알림을 색으로 구별한다.
5. 정보 전달은 객체를 통해 전달한다.

## 추후 업데이트 예정 목록

1. 서버 공지 기능
    - 서버에 콘솔 입력 기능 구현, 클라이언트에 출력 기능 구현

## Status Code

    - 100 : 로그인 요청 
    - 101 : 로그인 승인
    - 110 : 로그인-아이디 중복
    - 150 : 로그아웃
    - 200 : 채팅 전송 요청
    - 201 : 채팅 전송 승인
    - 250 : 공지 전송

## 검토 중인 사항

1. 서버 관리자 기능
    - IP 밴은 아직 제한사항이 있으므로 닉네임 밴 도입(실효성이 있는가?)
2. 클라이언트 명령어 기능
    - ``/현재유저``와 같은 기능
    - 귓속말 기능
