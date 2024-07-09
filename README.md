# README #
#2023-12-14
QA팀에서 테스트 시 사용할 스크립트들 모음집
세이브존 이벤트로 시작됨

## Quick Start
### 1. Git clone
### 2-1. Create `.env.dev` File & settings
> qa-test-script/oasis/<EVENT_DIR>/.env.dev
```
SAVEZONE_ID=<YOUR_ID>
SAVEZONE_PW=<YOUR_PW>
SAVEZONE_USERNAME=<YOUR_NAME>
ACCESS_TOKEN=<YOUR_PROFILE_TOKEN>

LOGIN_URL=https://dev.esavezone.co.kr/login
SHARE_URL=https://m.esavezone.co.kr/event-progress/66288edadfe30dcd9640da89

EVENT_URL=https://dev-savezone-event.esavezone.co.kr/event/today-horoscope/

EVENT_ADMIN_LOGIN_URL=https://dev-event-new-admin.esavezone.co.kr/login

EVENT_ADMIN_ID=admin@svzn.com
EVENT_ADMIN_PW=<ADMIN_PW>

SLACK_HOOK_URL=<YOUR_SLACK_HOOK_URL>
```
### 2-2. Create `.env.prod` File & settings
> qa-test-script/oasis/<EVENT_DIR>/.env.prod
```
SAVEZONE_ID=<YOUR_ID>
SAVEZONE_PW=<YOUR_PW>
SAVEZONE_USERNAME=<YOUR_NAME>
ACCESS_TOKEN=<YOUR_PROFILE_TOKEN>

LOGIN_URL=https://esavezone.co.kr/login

EVENT_URL=https://savezone-event.esavezone.co.kr/event/today-horoscope/
SHARE_URL=https://m.esavezone.co.kr/event-progress/66288edadfe30dcd9640da89

EVENT_ADMIN_LOGIN_URL=https://event-new-admin.esavezone.co.kr/login

EVENT_ADMIN_ID=admin@svzn.com
EVENT_ADMIN_PW=<ADMIN_PW>

SLACK_HOOK_URL=<YOUR_SLACK_HOOK_URL>
```
### 3. Run script
```
 1. node module install
npm install

 2. .auth Folder & user.json Check
node check-user-json.js

 3. Go to the folder you want to test (ex. 운세확인)
cd oasis/today-horoscope

 4. run test (default .env.dev)
npx playwright test

# .env.prod to run test
npx cross-env ENV=prod playwright test

# if you want receive a slack notification (for Windows_powershell)
npx playwright test "&&" node result.js
```

## Install VS Code extension
https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright

## CLI command
```
# install default browsers
npx playwright install

# running tests
npx playwright test

# run tests in UI mode
npx playwright test --ui

# recording a trace
npx playwright test --trace on

# debug tests with inspector
npx playwright test --debug

# open the HTML report
npx playwright show-report

# ask for help
npx playwright test --help
```