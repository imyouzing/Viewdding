# VIEWDDING Album Site

https://www.viewdding.com 에 배포한 결혼 준비 앨범 UI입니다. 기존 저장소의 사이트와 독립적으로 실행합니다.

## 실행

이 폴더에서:

```sh
python3 -m http.server 4173 --directory dist
```

http://localhost:4173 접속

## 테스트

```sh
node --test tests/*.test.cjs
```

예산 및 준비 기록은 브라우저 임시 저장 방식이며 계정 간 동기화되지 않습니다.
