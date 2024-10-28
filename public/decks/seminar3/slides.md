<!-- .slide: class="title" -->

# FastAPI Seminar

## Week 3: FastAPI Ad-Hoc

By: 이민규

---

# 출석 체크

## https://areyouhere.today/ <!-- .element: style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)" -->

---

# Table of Contents

<br/>

0. 과제 1 정답 코드 리뷰
1. 인증과 인가
2. 애플리케이션 설정
3. API 문서화

---

<!-- .slide: class="section-title" data-auto-animate -->

# 0. 과제 1 정답 코드 리뷰

---

<!-- .slide: data-auto-animate -->

# 0. 과제 1 정답 코드 리뷰

![Assignment 1 QR Code](assignment-1-QR.png) <!-- .element: style="width: 50%" -->

---

<!-- .slide: data-auto-animate -->

# 0. 과제 1 정답 코드 리뷰

## 헤더 인증과 종속성

```python [1:0|3-5,7-9]
@user_router.get("/me", status_code=HTTP_200_OK)
def me(
    x_wapang_username: Annotated[str, Header(...)],
    x_wapang_password: Annotated[str, Header(...)],
    user_service: Annotated[UserService, Depends()],
) -> MyProfileResponse:
    user = user_service.get_user_by_username(x_wapang_username)
    if not user or user.password != x_wapang_password:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED)
    return MyProfileResponse.from_user(user)
```

- 인증이 필요한 모든 API 에서 `X-Wapang-Username`, `X-Wapang-Password` 헤더를 검사해야 함
- 그럴 때마다 관련 헤더를 검사하는 것은 Redundant함
- 게다가, 인증하는 방법이 변경된다면? 모든 API 코드를 수정해야 함

---

<!-- .slide: data-auto-animate -->

# 0. 과제 1 정답 코드 리뷰

## 헤더 인증과 종속성

```python [1:1-9|11-13]
def login_with_header(
    x_wapang_username: Annotated[str, Header(...)],
    x_wapang_password: Annotated[str, Header(...)],
    user_service: Annotated[UserService, Depends()],
) -> User:
    user = user_service.get_user_by_username(x_wapang_username)
    if not user or user.password != x_wapang_password:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED)
    return user

@user_router.get("/me", status_code=HTTP_200_OK)
def me(user: User = Depends(login_with_header)) -> MyProfileResponse:
    return MyProfileResponse.from_user(user)
```

- 종속성을 활용해서 인증을 처리
- 중복 코드를 줄이고, 변경에 유연하게 대응할 수 있음

---

<!-- .slide: data-auto-animate -->

# 0. 과제 1 정답 코드 리뷰

## 재사용 가능한 Validation

```python [1:0|6-16]
class UserSignupRequest(BaseModel):
    username: str
    email: str
    password: str

    @field_validator("username")
    def validate_username(cls, username: str) -> str:
        ...

    @field_validator("email")
    def validate_email(cls, email: str) -> str:
        ...

    @field_validator("password")
    def validate_password(cls, password: str) -> str:
        ...
```

- pydantic에서 데코레이터를 사용해서 직관적으로 필드를 검증할 수 있음
- 그러나, 서로 다른 모델에서 같은 검증 로직을 사용할 때, 중복 코드가 발생함

---

<!-- .slide: data-auto-animate -->

# 0. 과제 1 정답 코드 리뷰

## 재사용 가능한 Validation

```python [1:0|15-18]
def validate_username(username: str) -> str:
    ...

def validate_email(email: str) -> str:
    ...

def validate_password(password: str) -> str:
    ...

class UserSignupRequest(BaseModel):
    username: str
    email: str
    password: str

    _validate_username = field_validator("username")(validate_username)
    _validate_email = field_validator("email")(validate_email)
    _validate_password = field_validator("password")(validate_password)
```

- 첫 번째 방법은, 데코레이터를 함수처럼 호출하는 것
- 검증 로직을 함수로 분리하고, 데코레이터를 직접 호출함으로써 재사용이 가능함

---

<!-- .slide: data-auto-animate -->

# 0. 과제 1 정답 코드 리뷰

## 재사용 가능한 Validation

```python [1:0|11-14]
def validate_username(username: str) -> str:
    ...

def validate_email(email: str) -> str:
    ...

def validate_password(password: str) -> str:
    ...

class UserSignupRequest(BaseModel):
    username: Annotated[str, AfterValidator(validate_username)]
    email: Annotated[str, AfterValidator(validate_email)]
    password: Annotated[str, AfterValidator(validate_password)]
```

- 보다 깔끔하고 권장되는 방법은, `Annotated Validator`를 사용하는 것
- `Annotated` 를 이용해서 필드에 타입 이외의 메타데이터를 추가할 수 있음
- 검증 시점에 따라 `BeforeValidator`, `AfterValidator`, `WrapValidator` 을 사용

---

<!-- .slide: data-auto-animate -->

# 0. 과제 1 정답 코드 리뷰

## 커스텀 에러 정의하기

```python
class EmailAlreadyExistsError(HTTPException):
    def __init__(self) -> None:
        super().__init__(HTTP_409_CONFLICT, "Email already exists")

class UsernameAlreadyExistsError(HTTPException):
    def __init__(self) -> None:
        super().__init__(HTTP_409_CONFLICT, "Username already exists")
```

- 상수를 코드 여기저기에 사용하는 것은 관리하기 어렵고, 실수를 유발할 수 있음
- 커스텀 에러를 정의함으로써, 중복되는 에러 코드와 메시지를 일관되게 관리

---

<!-- .slide: data-auto-animate -->

# 0. 과제 1 정답 코드 리뷰

## 커스텀 에러 정의하기

```python
class WapangBaseError(HTTPException):
    def __init__(self,
                 status_code: int,
                 message: str,
                 error_code: WapangErrorCode) -> None:
        # 에러를 구체화시키는 코드

class EmailAlreadyExistsError(WapangBaseError):
    def __init__(self) -> None:
        super().__init__(HTTP_409_CONFLICT, "Email already exists", ...)

class UsernameAlreadyExistsError(WapangBaseError):
    def __init__(self) -> None:
        super().__init__(HTTP_409_CONFLICT, "Username already exists", ...)
```

- 필요에 따라 상속을 통해 에러를 적절히 묶거나 공통적인 속성을 추가할 수 있음
- 예를 들어, 서비스에서 사용될 공통적인 에러 코드를 정의하거나 에러 메시지를 구체화하는 방법을 정의할 수 있음

---

<!-- .slide: data-auto-animate -->

# 0. 과제 1 정답 코드 리뷰

## 커스텀 에러 정의하기

```python
class WapangBaseError(Exception):
    status_code: int
    detail: str

    def __init__(self, status_code: int, detail: str):
        ...

@exception_handler(WapangBaseError)
def handle_wapang_base_error(request: Request, exc: WapangBaseError):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )
```

- `HTTPException` 을 상속받지 않더라도, 커스텀 에러 핸들러를 이용할 수도 있음
- 마찬가지로 상속을 통해 커스텀 에러들을 묶어놓으면, 핸들러를 등록하기가 용이함

---

<!-- .slide: data-auto-animate -->

# 0. 과제 1 정답 코드 리뷰

## UserStore

```python [1:]
class UserStore:
    def __init__(self) -> None:
        self.id_counter = 0
        self.store: dict[int, User] = {}
        self.username_index: dict[str, int] = {}
        self.email_index: dict[str, int] = {}

    ... # 필요한 메서드들 정의
```

- 유지보수가 용이한 코드베이스를 유지하기 위해, OOP에 익숙해지는 것이 좋음
- 인메모리 저장소가 필요하므로, 관련 로직들을 `UserStore` 클래스로 분리
- 여러 자료구조를 하나의 클래스로 묶을 수 있음
- 다른 저장소를 사용하게 되더라도, 인터페이스를 공유하도록 설계해서 쉽게 교체할 수 있음

---

<!-- .slide: data-auto-animate -->

# 0. 과제 1 정답 코드 리뷰

## UserStore

```python [1:]
@cache
class UserStore:
    ...

@cache
def get_user_store() -> UserStore:
    return UserStore()
```

- 왜 캐시를 사용했을까?
- `UserStore` 는 저장소이므로, 딱 한 번만 생성되어야 함
- FastAPI에서는 매 요청마다 종속성으로 등록한 `Callable` 을 호출함
- 즉, 클래스로 등록하면 매 요청마다 새로운 인스턴스가 생성됨
- 클래스에는 `@cache` 데코레이터를 사용할 수 없으므로, 별도의 함수를 정의하고 캐시 적용
  - `__new__` 메서드를 오버라이딩하거나 `metaclass` 를 이용하는 방법도 있으니 찾아보길!

---

<!-- .slide: data-auto-animate -->

# 0. 과제 1 정답 코드 리뷰

## 디자인 패턴이란?

- 디자인 패턴이란 문제를 해결하기 위한 "좋은 설계"를 위한 방법론
- 디자인 패턴의 특징
  - 특정한 프로그래밍 언어나 프레임워크에 종속적이지 않음
  - 개발자들 사이에 공통된 언어를 제공함
  - 개발자들이 소프트웨어를 이해하고, 소프트웨어를 설계하는 데 도움을 줌


---

<!-- .slide: data-auto-animate -->

# 0. 과제 1 정답 코드 리뷰

## Layered Architecture

![Layered Architecture](layered-architecture.png) <!-- .element: style="width: 40%" -->

- 코드가 복잡해짐에 따라, 관심사의 분리가 필요해짐
- 시스템을 분리하는 방법은 다양하지만, Layered Architecture가 사실 상 표준
  - 다른 방법론도 많이 있지만, 대개 Layered Architecture를 기반으로 함

---

<!-- .slide: data-auto-animate -->

# 0. 과제 1 정답 코드 리뷰

## Layered Architecture

```plaintext
.
├── app
│   ├── views
│   │   ├── user_views.py
│   │   ├── item_views.py
│   │   └── ...
│   ├── core
│   │   ├── config.py
│   │   ├── database.py
│   │   └── ...
│   ├── models
│   │   ├── user_models.py
│   │   ├── item_models.py
│   │   └── ...
│   ├── services
│   │   ├── user_services.py
│   │   ├── item_services.py
│   │   └── ...
...
```

---

<!-- .slide: data-auto-animate -->

# 0. 과제 1 정답 코드 리뷰

## Layered Architecture / Domain First

```plaintext
.
├── core
│   ├── config.py
│   ├── database.py
│   └── ...
├── app
│   ├── user
│   │   ├── views.py
│   │   ├── models.py
│   │   ├── service.py
│   │   └── ...
│   ├── item
│   │   ├── views.py
│   │   ├── models.py
│   │   ├── service.py
│   │   └── ...
...
```

---

<!-- .slide: data-auto-animate -->

# 0. 과제 1 정답 코드 리뷰

## Domain-Drived Design

![DDD](ddd.png) <!-- .element: style="width: 60%" -->

- 도메인 주도 개발이란, 복잡한 현실의 문제를 반영하는 도메인 모델을 설계하고, 이를 기반으로 소프트웨어를 개발하는 방법론
- 흥미가 생긴다면, Eric Evans의 "도메인 주도 설계"를 읽어보길 바람
- 이 내용은 마지막 세미나에서 한 번 더 다룰 예정


---

<!-- .slide: class="section-title" data-auto-animate -->

# 1. 유저 인증과 인가

---

<!-- .slide: data-auto-animate -->

# 1. 유저 인증과 인가

## 인증(Authentication)과 인가(Authorization)

![authentication-authorization](authentication-authorization.png) <!-- .element: style="width: 80%" -->

- 인증: 사용자가 누구인지 확인하는 과정
- 인가: 사용자가 특정 자원에 접근할 권한이 있는지 확인하는 과정

---

<!-- .slide: data-auto-animate -->

# 1. 유저 인증과 인가

## 쿠키와 세션

![Cookie & Session](cookie-session.png) <!-- .element: style="width: 50%" -->

- 쿠키: 클라이언트(브라우저 등)에 저장되는 작은 데이터 조각
  - HTTP Management Mechanism ([RFC 6265](https://datatracker.ietf.org/doc/html/rfc6265))
- 세션: 서버에 저장되는 클라이언트 정보
  - 세션 ID는 클라이언트에 저장되며, 쿠키를 사용할 수도 있음
  - 세션 정보는 인증 서버에 저장됨

---

<!-- .slide: data-auto-animate -->

# 1. 유저 인증과 인가

## Stateless 란?

- Stateless: 상태를 저장하지 않는 것
- 기본적으로 HTTP 프로토콜은 Stateless하다.
  - 즉, 이전 요청과 다음 요청이 서로 독립적
  - 하지만 유용한 애플리케이션은, 어딘가에 정보를 저장해야함 (서버 vs 클라이언트)
- 서버가 Stateless하고 싶다면, 클라이언트에서 상태를 저장하고 매 요청마다 보내줘야 함

---

<!-- .slide: data-auto-animate -->

# 1. 유저 인증과 인가

## Session-Based Authentication

![Session-Based Authentication](session-based-authentication.png) <!-- .element: style="width: 60%" -->

- 세션 기반 인증은 서버에 세션 정보를 저장하고, 클라이언트에 세션 ID를 전달함
  - 즉 양쪽 모두 Stateful
- 세션 ID를 이용해서 서버에 저장된 세션 정보를 조회하고, 사용자를 식별함

---

<!-- .slide: data-auto-animate -->

# 1. 유저 인증과 인가

## Token-Based Authentication

![Token-Based Authentication](token-based-authentication.png) <!-- .element: style="width: 60%" -->

- 토큰 기반 인증은 클라이언트에 세션 ID가 아니라, 토큰을 저장함
  - 토큰: 사용자 정보를 담은 문자열
  - 서버 입장에서 Stateless
- 서버는 특정 알고리즘을 이용해서 토큰을 검증하고, 사용자를 식별함

---

<!-- .slide: data-auto-animate -->

# 1. 유저 인증과 인가

## JWT (JSON Web Token)

![JWT](jwt.png) <!-- .element: style="width: 60%" -->

- JWT는 가장 보편적인 토큰 기반 인증 방식
- 헤더, 페이로드, 서명으로 구성됨
  - 헤더: base64 인코딩된 토큰의 타입과 알고리즘
  - 페이로드: base64 인코딩된 사용자 정보 (claim의 집합)
  - 서명: 헤더와 페이로드를 암호화한 값 (HS256, RS256 이 가장 보편적)

---

<!-- .slide: data-auto-animate -->

# 1. 유저 인증과 인가

## JWT (JSON Web Token)

### 응답
```http [1:]
HTTP/1.1 200 OK
Set-Cookie: access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c; HttpOnly; Secure
```
<!-- .element: class="break-all" -->

### 요청
```http [1:]
GET /me HTTP/1.1
Cookie: access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```
<!-- .element: class="break-all" -->

- JWT 자체는 Stateless하므로, 클라이언트에서 Stateful한 기술들을 활용해서 저장해야함
- 가장 간단하고 대표적인 방법이 쿠키
- `Set-Cookie` 헤더를 이용해서 클라이언트에 토큰을 저장하도록 요청

---

<!-- .slide: data-auto-animate -->

# 1. 유저 인증과 인가

## JWT (JSON Web Token)

### 응답
```http [1:]
HTTP/1.1 200 OK
Content-Type: application/json

{"access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"}
```
<!-- .element: class="break-all" -->

### 요청
```http [1:]
GET /me HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
``` 
<!-- .element: class="break-all" -->

- 헤더를 사용하는 방법도 있으며, 보통 `Authorization` 헤더를 사용함
- 이 경우 토큰은 쿠키가 아니라 클라이언트의 메모리나 로컬 스토리지에 저장
- 쿠키와 헤더를 사용하는 방법은 각각 장단점이 있으므로, 상황에 맞게 사용하면 됨

---

<!-- .slide: class="section-title" data-auto-animate -->

# 2. 애플리케이션 설정

---

<!-- .slide: data-auto-animate -->

# 2. 애플리케이션 설정

## 애플리케이션에 설정이 필요한 이유

- 항상 동일한 환경에서만 애플리케이션이 실행된다면, 설정이 필요 없을 수 있음
- 여러분의 애플리케이션에, 데이터베이스가 필요하다고 가정해봅시다
- 그런데 배포 시에는 RDS에 연결하고, 로컬에서는 로컬 MySQL 서버에 연결하고 싶다면?
- 이런 경우, 환경에 따라 설정을 다르게 해야 함

---

<!-- .slide: data-auto-animate -->

# 2. 애플리케이션 설정

## 환경 변수

- 애플리케이션의 설정으로 사용가능한 가장 간단한 방법은 환경 변수
- 환경 변수: OS 레벨에서 프로세스에 전달되는 키-값 쌍
- 환경 변수를 사용하면, 애플리케이션의 설정을 실행 시점에 제어할 수 있음

---

<!-- .slide: data-auto-animate -->

# 2. 애플리케이션 설정

## 환경 변수

```bash
export DATABASE_URL="mysql://user:password@localhost/db"

python -c 'import os; print(os.environ["DATABASE_URL"])'
```

<br>

- 환경 변수를 설정하는 방법은 OS에 따라 다름
- 리눅스, 맥에서는 `export` 명령어를 사용해서 현재 쉘 프로세스에 환경 변수를 설정
- 특정 프로세스에만 임시로 설정하고 싶다면, `KEY=VALUE python app.py` 와 같이 기존 명령어 앞에 환경 변수를 설정할 수 있음

---

<!-- .slide: data-auto-animate -->

# 2. 애플리케이션 설정

## dotenv

```conf
DATABASE_URL=mysql://user:password@localhost/db
SECRET_KEY=supersecretkey    # public repository에는 이렇게 사용하지 말 것
DEBUG=true
..
```

- 환경변수가 많아지면, 항상 위와 같이 설정하는 것이 번거로울 수 있음
- `dotenv` 라이브러리 등으로 파일을 통해 환경 변수를 관리할 수 있음
- 예컨데 `.env.local`, `.env.dev`, `.env.prod` 등으로 각 환경에 필요한 상수들을 정의해놓고, `dotenv` 라이브러리를 이용해서 로드할 수 있음
- 과제 2에서 스켈레톤 코드 참조!

---

<!-- .slide: class="section-title" data-auto-animate -->

# 3. API 문서화

---

<!-- .slide: data-auto-animate -->

# 3. API 문서화

## API 문서화의 필요성

![manual](manual.png)

- 전자 제품을 구매하면 사용 설명서가 함께 제공됨
- API도 마찬가지로, 사용자에게 API의 사용법을 제공해야 함

---

<!-- .slide: data-auto-animate -->

# 3. API 문서화

## Open API Specification

![openapi-example](openapi-example.png) <!-- .element: style="width: 35%" -->

- 프레임워크에 종속받지 않는 API 문서 작성법이 필요
- Open API Specification은 JSON 또는 YAML로 작성되는 API 문서 작성 표준
- Swagger UI, ReDoc 등의 도구와 결합해서 API 문서를 Web UI로 제공할 수 있음

---

<!-- .slide: data-auto-animate -->

# 3. API 문서화

## Automatic Docs

![fastapi-swagger-example](fastapi-swagger-example.png) <!-- .element: style="width: 60%; box-shadow: black 0.2rem 0.2rem 0.5rem" -->

- API 문서를 별도로 작성하는 것은 번거롭고, 유지보수가 어려움
- FastAPI는 Open API Specification을 자동으로 생성해주며, Swagger와 Redoc도 내장
- 필요하다면 엔드포인트 정의 시 API 문서화에 도움이 되는 여러 메타데이터를 전달할 수 있음
- `/docs`, `/redoc` 엔드포인트를 통해 API 문서를 확인할 수 있음

---

<!-- .slide: data-auto-animate class="section-title" -->

# 끗