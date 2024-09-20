<!-- .slide: class="title" -->

# FastAPI Seminar

## Week 1: 입문자를 위한 FastAPI

By: 이민규

---

# 출석 체크

## https://areyouhere.today/ <!-- .element: style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)" -->

---

# Table of Contents

1. HTTP Request 를 받아보자!
2. HTTP Response 를 보내보자!
3. 의존성 주입
4. 에러 핸들링
5. 미들웨어
6. 백그라운드 태스크
7. API 문서 강화하기
8. 데이터베이스 활용하기

---

<!-- .slide: class="section-title" data-auto-animate -->

# 1. HTTP Request 를 받아보자!

---

<!-- .slide: data-auto-animate -->

# 1. HTTP Request 를 받아보자!

## 천 리 길도 한 걸음부터

```python [0|3|5|6-7]
from fastapi import FastAPI, status

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}
```

- `FastAPI()`로 ASGI application 만들기
- `@app.get()`으로 GET 엔드포인트 추가하기
- 엔드포인트 구현하기

---

<!-- .slide: data-auto-animate -->

# 1. HTTP Request 를 받아보자!

## HTTP Request 는 어떻게 생겼나

```http [0|1|2-7|9]
POST /api/v1/items/ HTTP/1.1
Host: sns.wafflestudio.com
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) ...
Accept: application/json
Accept-Encoding: gzip, deflate
Content-Length: 29
Content-Type: application/json; charset=utf-8

{"message": "Hello World 😁"}
```

- HTTP Request Message 는 US-ASCII 로 인코딩되어 있다.
- Request Line, Headers, Body 로 구성되어 있다.

---

<!-- .slide: data-auto-animate -->

# 1. HTTP Request 를 받아보자!

## HTTP Method

> <span class="fragment custom highlight">GET</span> /brands/10/items HTTP/1.1

- METHOD = Request Line 의 첫 번째 Token
- METHOD 는 클라이언트의 요청 목적 <!-- .element: class="fragment" -->
  - 리소스 검색, 추가, 변경, etc.
  - TMI) HTTP/1.1 의 Semantic 은 RFC 7231 에서 확인할 수 있다.

---

<!-- .slide: data-auto-animate -->

# 1. HTTP Request 를 받아보자!

## HTTP Method

> <span class="highlight">GET</span> /brands/10/items HTTP/1.1

- HTTP Method 에는 어떤 토큰도 들어갈 수 있다.
- 하지만, 대부분의 경우에 다음 메서드 중 하나를 사용하게 된다. <!-- .element: class="fragment" -->
  - GET: 리소스 요청
  - POST: 리소스 생성
  - PUT: 리소스 생성또는 덮어씌움
  - PATCH: 리소스 부분 수정
  - DELETE: 리소스 삭제
  - OPTIONS <!-- .element: style="opacity: 40%" -->

---

<!-- .slide: data-auto-animate -->

# 1. HTTP Request 를 받아보자!

## HTTP Method

```python
@app.get("/brands/10/items/{item_id}", status_code=status.HTTP_200_OK)
@app.put("/brands/10/items/{item_id}", status_code=status.HTTP_200_OK)
@app.delete("/brands/10/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
@app.post("/brands/10/items/", status_code=status.HTTP_201_CREATED)
@app.patch("/brands/10/items/{item_id}", status_code=status.HTTP_200_OK)
```

- 자주 사용하는 메서드들은 별도의 데코레이터 팩토리로 구현되어 있다.

<div class="fragment">
<pre class="code-wrapper"><code class="hljs language-python">@app.api_route("/brands/10/items/{items_id}", methods=["GET", "PUT", "HOIZZA"])</code></pre>
<ul>
<li>사용자 정의 HTTP Method 를 사용하거나, 여러 Method 를 허용하려고 할 때에는 범용 데코레이터 팩토리인 `app.api_route`를 사용한다.</li>
</ul>
</div>

---

<!-- .slide: data-auto-animate -->

# 1. HTTP Request 를 받아보자!

## Path

> GET <span class="fragment custom highlight">/brands/10/items</span> HTTP/1.1

- Path = 계층 구조 리소스 식별자
- Slash 로 구분되는 segment 들로 이루어져있음
- 각 segment 마다 ";"로 구분되는 "key=value" 형태의 파라미터가 존재할 수 있는데, 잘 쓰이지 않음
- 리소스를 표현하는 데이터 중 계층 구조로 표현하기 쉬운 경우, path로 전달하는 것이 바람직함

---

<!-- .slide: data-auto-animate -->

# 1. HTTP Request 를 받아보자!

## Path

```python
@app.get("/brands/{brand_id}/items", status_code=status.HTTP_200_OK)
def list_brand_items(brand_id: int):
  ...
```

- 정적인 문자열뿐만 아니라 동적인 문자열을 받는 것도 가능
- 이때, 타입 힌트를 통해 원시 타입으로의 단순한 형변환은 자동으로 지원

<br/>

```python
@app.get("/brands/{brand_id}/items", status_code=status.HTTP_200_OK)
def list_brand_items(brand_id: int = Path(...)):
  ...
```

- `Path` 라는 함수를 기본값으로 전달해서 추가적인 정보를 전달할 수 있음
- 이를 통해 간단한 validation이나, API 문서를 보강하는 등의 작업을 할 수 있음

---

<!-- .slide: data-auto-animate -->

# 1. HTTP Request 를 받아보자!

## Query String

> GET /items?<span class="fragment highlight">min_price=1000&max_price=5000</span>

- Query String = 리소스 필터링, 정렬, 페이징 등 계층 구조가 아닌 리소스 식별자
- Path 끝에서 "?" 뒤에서부터, "#" 앞 또는 URL의 끝 부분까지
- "key=value" 형태의 값을 "&"로 구분하여 전달하는 것이 <span class="fragment custom red">사실상 표준</span>
- 몇몇 특수문자는 사용을 지양하거나 인코딩을 필요로함 <!-- .element: class="fragment" -->
  - "#" : Query String의 끝을 나타내는 문자
  - "&", "=" : key, value 구분자
  - "/" : Path 와 헷갈릴 수 있으므로
  - key 에서는 사용을 지양
  - value 로 전달이 불가피하다면 인코딩을 적용<br/>(Percent Encoding, Base62, URL-Safe Base64, etc.)

---

<!-- .slide: data-auto-animate -->

# 1. HTTP Request 를 받아보자!

## Query String

```python
@app.get("/items", status_code=status.HTTP_200_OK)
def list_items(min_price: int = Query(0), max_price: int = Query(99999)):
  ...
```

- 엔드포인트의 파라미터 중 Path 가 아니면 자동으로 Query String 으로 추론됨
- `Path` 와 마찬가지로 `Query` 함수를 이용해서 추가적인 기능을 제공할 수 있음
- 파라미터를 옵셔널하게 만들려면, 기본값을 전달하거나 타입을 `Optional` 로 지정
- 파라미터를 필수로 만들려면, 기본값을 전달하지 않거나, `Query(...)` 으로 지정

---

<!-- .slide: data-auto-animate -->

# 1. HTTP Request 를 받아보자!

## Header

```http [1:]
POST /api/v1/items/ HTTP/1.1
Host: sns.wafflestudio.com
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) ...
Accept: application/json
Accept-Encoding: gzip, deflate
Content-Length: 29
Content-Type: application/json; charset=utf-8

{"message": "Hello World 😁"}
```

---

<!-- .slide: data-auto-animate -->

# 1. HTTP Request 를 받아보자!

## Header

```http [1:2-7]
POST /api/v1/items/ HTTP/1.1
Host: sns.wafflestudio.com
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) ...
Accept: application/json
Accept-Encoding: gzip, deflate
Content-Length: 29
Content-Type: application/json; charset=utf-8

{"message": "Hello World 😁"}
```

- Header = 요청의 메타데이터
- Request Line 다음부터, Body 전까지
- "key: value" 형태의 줄들로 이루어져 있음
- Header 와 Body 사이에는 빈 줄(CRLF)이 존재해야 함

---

<!-- .slide: data-auto-animate -->

# 1. HTTP Request 를 받아보자!

## Header

```python
@app.post("/items", status_code=status.HTTP_201_CREATED)
def create_item(item: Item, user_agent: str = Header(None)):
  ...
```

- Path, Query 와 달리 반드시 `Header` 함수를 이용해서 명시적으로 지정해야 함
- Query 와 마찬가지로, 기본값이나 옵셔널 여부를 지정할 수 있음

---

<!-- .slide: data-auto-animate -->

# 1. HTTP Request 를 받아보자!

## 특수한 Request Header 들

- 일부 헤더들은 브라우저에 의해 자동으로 전달되며, 특별한 의미를 가지고 있음
  - `Host`: 요청을 받는 서버의 호스트 정보
  - `Referer`: 이전 페이지의 URL 정보
  - `User-Agent`: 클라이언트의 소프트웨어 정보
  - `Content-Type`: Body 의 타입을 지정
  - `Content-Length`: Body 의 길이를 지정
  - `Accept`: 클라이언트가 받아들일 수 있는 타입
  - `Accept-Encoding`: 클라이언트가 받아들일 수 있는 압축 방식
  - `Authorization`: 클라이언트의 인증 정보
  - `Cookie`: 클라이언트의 세션 정보
  - ...

---

<!-- .slide: data-auto-animate -->

# 1. HTTP Request 를 받아보자!

## Body

```http [9]
POST /api/v1/items/ HTTP/1.1
Host: sns.wafflestudio.com
...
Content-Type: application/json; charset=utf-8
Content-Length: 29

{"message": "Hello World 😁"}
```

- Body = Header 의 마지막 빈 줄 다음부터 끝까지
- Body 가 존재하는 경우에는 컨텐츠의 메타데이터를 Header 에서 전달해야 함
  - Content-Length, Content-Type, Transfer-Encoding 등

---

<!-- .slide: data-auto-animate -->

# 1. HTTP Request 를 받아보자!

## Body (feat. Pydantic)

```python [1:]
class Item(BaseModel):
  name: str
  price: float
  brand_id: int

@app.post("/items", status_code=status.HTTP_201_CREATED)
def create_item(item: Item):
  ...
```

<!-- .element: data-id="code" -->

- Body 는 `Pydantic` 을 통해 파싱됨
- `Pydantic` 은 타입 힌트에 기반한 JSON 직렬화/역직렬화 라이브러리
- Nested Model, Optional Field, Default Value, Validation 등을 지원

```http
POST /items HTTP/1.1
Content-Type: application/json

{"name": "iPhone", "price": 1000, "brand_id": 1}
```

---

<!-- .slide: data-auto-animate -->

# 1. HTTP Request 를 받아보자!

## Body (feat. Pydantic)

```python [1:0|2|6-11]
class Item(BaseModel):
  name: str = Field(alias="item_name", max_length=100)
  price: float
  brand_id: int

  model_config = ConfigDict(
    str_to_lower = True,
    str_max_length = 100,
    extra = "ignore",
    faux_immutable = True,
  )
```

<!-- .element: data-id="code" -->

- `Field` 를 이용해서 필드별 옵션을 지정할 수 있음
- model_config 를 통해 모델의 옵션을 지정할 수 있음
  - v1 에서는 `Config` 클래스를 이용해서 모델 전체의 옵션을 지정할 수 있었음
  - fastapi 버전에 따라 Pydantic 버전도 달라지므로, 사용하는 버전에 유의할 것
