<!-- .slide: class="title" -->

# FastAPI Seminar

## Week 2: 데이터베이스

By: 이민규

---

# 출석 체크

## https://areyouhere.today/ <!-- .element: style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)" -->

---

# Table of Contents

<br/>

1. 데이터베이스란?
2. SQL
3. SQLAlchemy
4. FastAPI와 SQLAlchemy 연동

---

<!-- .slide: class="section-title" data-auto-animate -->

# 1. 데이터베이스란?

---

<!-- .slide: data-auto-animate -->

# 1. 데이터베이스란?

## 데이터베이스

![Library](library.png) <!-- .element: style="width: 50%" -->

- 데이터를 저장하고 관리하는 시스템
- 데이터베이스 관리 시스템(DBMS)을 통해 데이터를 관리
- 이번 세미나에서는 RDBMS 만 다룬다.

---

<!-- .slide: data-auto-animate -->

# 1. 데이터베이스란?

## RDBMS

![RDBMS](rdbms.png) <!-- .element: style="width: 50%" -->

- Relational Database Management System
- 데이터를 테이블에 저장
- 데이터 간의 관계는 테이블 간의 관계로 표현
- SQL을 사용하여 데이터를 조작

---

<!-- .slide: data-auto-animate -->

# 2. SQL

## SQL

![SQL](sql.png) <!-- .element: style="width: 60%" -->

- Structured Query Language
- RDBMS와 상호작용하기 위한 언어
- 데이터베이스 생성, 테이블 생성, 데이터 삽입, 수정, 삭제 등을 수행

---

<!-- .slide: data-auto-animate -->

# 2. SQL

## Relational Algebra

<br/>

$$ 
\begin{align*}
&\pi_{name, age}(\sigma_{age > 20}(Person)) \newline
&\pi_{\text{studentId, name, age}}\left(\sigma_{\text{age}\geq36}\left(\text{Student}\right)\right)
\end{align*}
$$

<br/>

- 관계형 데이터베이스의 기본적인 연산을 수행하는 수학적 표기법
- SQL은 Relational Algebra의 구현체
- 이번 세미나에서 자세히 다루진 않지만, 근간에는 이런 게 있다는 정도만 알아두자

---

<!-- .slide: data-auto-animate -->

# 2. SQL

## ANSI SQL

![ANSI](ansi.png)

- ANSI: SQL, ASCII 등 다양한 표준을 제정하는 미국 국가 표준 기관
- 대부분의 RDBMS가 ANSI SQL을 따르지만, 각 RDBMS마다 고유의 문법이 존재
- 이번 세미나에서는 MySQL 사용을 가정하고 진행
  - MySQL 고유 문법에는 `*` 표시

---

<!-- .slide: data-auto-animate -->

# 2. SQL

## DML, DDL, DCL

- DML(Data Manipulation Language)
    - 데이터를 조작하는 언어
    - SELECT, INSERT, UPDATE, DELETE 등
- DDL(Data Definition Language)
    - 데이터베이스 스키마를 정의하는 언어
    - CREATE, ALTER, DROP 등
- DCL(Data Control Language)
    - 데이터베이스에 대한 권한을 제어하는 언어
    - GRANT, REVOKE 등

---

<!-- .slide: data-auto-animate -->

# 2. SQL

## DDL - DATABASE 생성 및 선택

```sql [1|2]
CREATE DATABASE Wapang;
USE Wapang;
```

- `CREATE DATABASE`: 데이터베이스 생성
- `USE`: 사용할 데이터베이스 선택

---

<!-- .slide: data-auto-animate -->

# 2. SQL

## DDL - CREATE TABLE

```sql [0|1|2|3]
CREATE TABLE Person (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50),
  age INT
);
```

- `CREATE TABLE`: 테이블 생성
- `PRIMARY KEY`: 기본키 지정
- *`AUTO_INCREMENT`: 자동 증가
- `VARCHAR(50)`: 가변 길이 문자열 타입, 최대 길이 50
- `INT`: 정수 타입
- 이외에도 `CHAR`, `TEXT`, `DATE`, `DATETIME` 등 다양한 타입이 있음

---

<!-- .slide: data-auto-animate -->

# 2. SQL

## DDL - ALTER TABLE

```sql [0|1|2]
ALTER TABLE Person
ADD COLUMN address_id BIGINT;
```

- `ALTER TABLE`: 테이블 구조 변경
- `ADD COLUMN`: 컬럼 추가
  - 컬럼 삭제, 타입 변경, 제약 조건 추가 등 다양한 변경이 가능

---

<!-- .slide: data-auto-animate -->

# 2. SQL

## DML - SELECT

```sql [0|1|2|3]
SELECT * 
FROM Person
WHERE age > 20;
```
<!-- .element: data-id="code" -->

- `SELECT`: 데이터를 조회하는 명령어
- `*`: 모든 컬럼을 조회
- `FROM`: 조회할 테이블을 지정
- `Person`: 테이블 이름
- `WHERE`: 조건을 지정
- `age`: 컬럼 이름
- `age > 20`: 나이가 20살 이상인 데이터만 조회

---

<!-- .slide: data-auto-animate -->

# 2. SQL

## DML - JOIN

```sql [0|2|3]
SELECT *
FROM Person, Address
WHERE Person.address_id = Address.id;
```

- `FROM Person, Address`: 두 테이블을 조인
  - `Person` 테이블의 모든 데이터와 `Address` 테이블의 모든 데이터를 조인
- `WHERE`: 조인 조건을 지정
  - `Person.address_id = Address.id`: 두 테이블의 `address_id`와 `id`가 같은 데이터만 조회
  - `WHERE` 절이 없으면 CROSS JOIN 이라고 부르며, 모든 조합을 생성

---

<!-- .slide: data-auto-animate -->

# 2. SQL

## DML - JOIN

```sql [0|3|4]
SELECT *
FROM Person
LEFT OUTER JOIN Address
  ON Person.address_id = Address.id;
```

- `LEFT OUTER JOIN`: 두 테이블을 조인
  - `LEFT OUTER`: 왼쪽 테이블의 모든 데이터를 포함
  - `INNER`, `LEFT OUTER`, `RIGHT OUTER`, `FULL OUTER` 등이 있음
- `ON`: 조인 조건을 지정


---

<!-- .slide: data-auto-animate -->

# 2. SQL

## DML - JOIN



---

<!-- .slide: data-auto-animate -->

# 2. SQL

## DML - ORDER BY

```sql [0|3|4]
SELECT *
FROM Person
ORDER BY age DESC;
```

- `ORDER BY`: 결과를 특정 컬럼을 기준으로 정렬
- `DESC`: 내림차순 정렬

---

<!-- .slide: data-auto-animate -->

# 2. SQL

## DML - GROUP BY & HAVING

```sql [0|3|1,4]
SELECT age, COUNT(*)
FROM Person
GROUP BY age
HAVING COUNT(*) > 1;
```

- `GROUP BY`: 결과를 특정 컬럼을 기준으로 그룹화
- `COUNT(*)`: 그룹별로 데이터의 개수를 세는 집계 함수
  - `COUNT`, `SUM`, `AVG`, `MAX`, `MIN` 등이 있음
- `GROUP BY` 에 포함되지 않은 컬럼은 반드시 집계 함수로 처리해야 함
- `HAVING`: 그룹화된 결과에 조건을 지정
- `COUNT(*) > 1`: 그룹별로 데이터의 개수가 1개 이상인 그룹만 조회

---

<!-- .slide: data-auto-animate -->

# 2. SQL

## DML - LIMIT & OFFSET

```sql [0|3|4]
SELECT *
FROM Person
LIMIT 10
OFFSET 10;
```

- *`LIMIT`: 조회할 데이터의 개수를 제한
- *`OFFSET`: 조회할 데이터의 시작 위치를 지정

---

<!-- .slide: data-auto-animate -->

# 2. SQL

## 기초 예제 (1)

```sql
CREATE TABLE Person (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50),
  age INT
);
```

* Person 테이블에서 나이가 20살 이상인 데이터만 조회하시오.

```sql
SELECT *
FROM Person
WHERE age >= 20;
```
<!-- .element: class="fragment" -->

---

<!-- .slide: data-auto-animate -->

# 2. SQL

## 기초 예제 (2)

```sql
CREATE TABLE Person (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50),
  age INT
);
```

* 나이가 20살 이상, 30살 미만인 데이터만 뽑아서 각 나이 별 인원을 집계하고, 2명 이상인 그룹들을 뽑아 나이 순으로 정렬하시오.

```sql
SELECT age, COUNT(*)
FROM Person
WHERE age >= 20 AND age < 30
GROUP BY age
HAVING COUNT(*) > 1
ORDER BY age;
```
<!-- .element: class="fragment" -->

---

<!-- .slide: data-auto-animate -->

# 2. SQL

## 심화 예제 (1)

```sql
CREATE TABLE Person (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50),
  age INT
);
```

* Person 테이블에서 나이가 제일 적은 사람을 제외하고, 모든 사람을 조회하시오.

```sql
SELECT DISTINCT p1.*
FROM Person p1, Person p2
WHERE p1.age > p2.age;
```
<!-- .element: class="fragment" -->



---

<!-- .slide: data-auto-animate -->

# 2. SQL

## 심화 예제 (2)

```sql
CREATE TABLE Person (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50),
  age INT
);
```

* Person 테이블에서 나이가 제일 적은 사람만 조회하시오.

```sql
SELECT p1.*
FROM Person p1
LEFT OUTER JOIN Person p2
  ON p1.age > p2.age
WHERE p2.age IS NULL;
```
<!-- .element: class="fragment" -->

---

<!-- .slide: data-auto-animate -->

# 2. SQL

## DML - Sub Query

```sql [0|1|2|3]
SELECT *
FROM Person
WHERE age = (SELECT MIN(age) FROM Person);
```

- 서브 쿼리는 FROM, WHERE, SELECT 절에서 사용할 수 있음
- FROM 절과 WHERE IN 절을 제외하고는 서브 쿼리의 결과가 단일 값이어야 함

---

<!-- .slide: data-auto-animate -->

# 2. SQL

## DML - Query Execution Order

1. `FROM`
2. `WHERE`
3. `GROUP BY`
4. `HAVING`
5. `SELECT`
6. `ORDER BY`
7. `LIMIT`

---

<!-- .slide: data-auto-animate -->

# 2. SQL

## DML - INSERT

```sql [0|1|2]
INSERT INTO Person (name, age)
VALUES ('Alice', 25), ('Bob', 30);
```

- `INSERT INTO`: 데이터를 삽입하는 명령어
- `name` 컬럼에 'Alice', 'Bob', `age` 컬럼에 25, 30을 삽입
- 여러 개의 데이터를 한 번에 삽입할 수 있음
- `VALUES` 대신 `SELECT`로 다른 테이블의 데이터를 삽입할 수 있음

---

<!-- .slide: data-auto-animate -->

# 2. SQL

## DML - UPDATE

```sql [0|1|2|3]
UPDATE Person
SET age = 26
WHERE name = 'Alice';
```

- `UPDATE`: 데이터를 수정하는 명령어
- `SET`: 수정할 컬럼과 값을 지정
- `WHERE`: 수정할 데이터를 선택하는 조건을 지정

---

<!-- .slide: data-auto-animate -->

# 2. SQL

## DML - DELETE

```sql [0|1|2]
DELETE FROM Person
WHERE name = 'Alice';
```

- `DELETE FROM`: 데이터를 삭제하는 명령어
- `WHERE`: 삭제할 데이터를 선택하는 조건을 지정

---

<!-- .slide: data-auto-animate -->

# 2. SQL

## DDL - DROP TABLE

```sql [1:]
DROP TABLE Person;
```

- `DROP TABLE`: 테이블 삭제

---

<!-- .slide: data-auto-animate -->

# 2. SQL

## DCL - GRANT

```sql [0|1|2]
GRANT SELECT ON Wapang.Person TO 'user'@'localhost';
GRANT ALL PRIVILEGES ON Wapang.* TO 'user'@'%';
```

- `GRANT`: 권한 부여
- `SELECT`: 조회 권한
- `ALL PRIVILEGES`: 모든 권한
- `Wapang.Person`: `Wapang` 스키마의 `Person` 테이블에 대한 권한
  - `*`: 모든 테이블에 대한 권한
- `'user'@'localhost'`: 사용자와 호스트 지정
  - `%`: 모든 호스트

---

<!-- .slide: data-auto-animate -->

# 2. SQL

## DCL - REVOKE

```sql [0|1|2]
REVOKE SELECT ON Wapang.Person FROM 'user'@'localhost';
REVOKE ALL PRIVILEGES ON Wapang.* FROM 'user'@'%';
```

- `REVOKE`: 권한 회수
- 이하 `GRANT`와 동일

---

<!-- .slide: data-auto-animate -->

# 2. SQL

## MySQL 고유 문법

- `LIMIT`과 `OFFSET` 대신 `LIMIT 10, 10`으로 사용


---

<!-- .slide: class="section-title" data-auto-animate -->

# 3. SQLAlchemy

---

<!-- .slide: data-auto-animate -->

# 3. SQLAlchemy

## ORM 이란?

- Object-Relational Mapping

![ORM](orm.png) <!-- .element: style="width: 50%" -->

- 객체와 관계형 데이터베이스 간의 매핑을 자동화하는 기술
- 객체 지향 프로그래밍에서 사용하는 객체와 RDBMS의 테이블을 매핑
- SQL을 직접 작성하지 않고, 객체를 통해 데이터베이스를 조작

---

<!-- .slide: data-auto-animate -->

# 3. SQLAlchemy

## ORM - Active Record

```sql
SELECT * FROM Person
WHERE name = 'Alice';

INSERT INTO Person (name, age)
VALUES ('Bob', 30);
```

```python
alice = Person.objects.get(name='Alice')

Person.objects.create(name='Bob', age=30)
```

- 가장 간단한 ORM 패턴
- 객체는 테이블 행 그 자체를 의미
- 데이터베이스 조작하는 코드도 객체에 포함
- Django의 ORM이 대표적인 예
- 안티 패턴으로 여겨질 수 있음

---

<!-- .slide: data-auto-animate -->

# 3. SQLAlchemy

## ORM - Data Mapper

```sql
SELECT * FROM Person
WHERE name = 'Alice';

INSERT INTO Person (name, age)
VALUES ('Bob', 30);
```

```python
statement = select(Person).where(Person.name == 'Alice')
alice = session.execute(statement).scalar()

bob = Person(name='Bob', age=30)
session.add(bob)
session.commit()
```

- 객체와 데이터베이스 레코드를 매핑하는 별도의 객체를 사용
- 다소 복잡하지만, 객체와 데이터베이스 레코드를 분리할 수 있음
- SQLAlchemy의 ORM이 대표적인 예

---

<!-- .slide: data-auto-animate -->

# 3. SQLAlchemy

## SQLAlchemy 기초

![SQLAlchemy](sqlalchemy.png)

> 지금까지 배운 SQL 문법을 SQLAlchemy API 로 작성해보자!

---

<!-- .slide: data-auto-animate -->

# 3. SQLAlchemy

## SQLAlchemy 설치

```bash
pip install sqlalchemy
```

---

<!-- .slide: data-auto-animate -->

# 3. SQLAlchemy

## SQLAlchemy 연결

```python
from sqlalchemy import create_engine

memory_engine = create_engine("sqlite+pysqlite:///:memory:")
mysql_engine = create_engine(f"mysql+pymysql://waffle:qwer1234!@localhost/wapang")
```

- `Engine`: 데이터베이스 연결을 담당하는 low level 객체
  - Connection 을 생성하고, Connection Pool 을 관리
- 데이터베이스 연결 정보는 `dialect+driver://username:password@host:port/database` 형식으로 지정

---

<!-- .slide: data-auto-animate -->

# 3. SQLAlchemy

## Raw SQL

```python
from sqlalchemy import text

with engine.connect() as conn:
    conn.execute(text("DROP TABLE IF EXISTS users"))
    conn.execute(text("CREATE TABLE users (id INTEGER PRIMARY KEY, name VARCHAR(50), age INTEGER)"))
    conn.execute(text("INSERT INTO users (id, name, age) VALUES (:id, :name, :age)"), [{"id": 1, "name": "test", "age": 20}, {"id": 2, "name": "test2", "age": 30}])
    result = conn.execute(text("SELECT * FROM users")).fetchall()
    print(result)
    conn.commit()

with engine.connect() as conn:
    result = conn.execute(text("SELECT * FROM users")).fetchall()
    print(result)
```

- `Connection`: 실제 데이터베이스와의 연결을 담당하는 객체
- SQL 을 데이터베이스에 전송하여 실행하고 결과를 받아올 수 있음
- `text` 함수를 사용하여 SQL 문자열을 생성

---

<!-- .slide: data-auto-animate -->

# 3. SQLAlchemy

## ORM 1부 (1) - 테이블 정의와 생성

```python
metadata = MetaData()

user_table = Table(
    "users",
    metadata,
    Column("id", Integer, primary_key=True, index=True),
    Column("name", String, nullable=True),
    Column("age", Integer, nullable=True),
)

user_table.create(engine)
```

- `MetaData`: 데이터베이스 스키마를 관리하는 객체
  - 일반적으로 모든 테이블은 동일한 `MetaData` 객체를 공유
- `Table`: 테이블을 정의하는 객체
- `Column`: 컬럼을 정의하는 객체

---

<!-- .slide: data-auto-animate -->

# 3. SQLAlchemy

## ORM 1부 (2) - 데이터 삽입

```python
insert_stmt = insert(user_table).values(name="test", age=20)
with engine.connect() as conn:
    conn.execute(insert_stmt)
```

- `insert`: 데이터를 삽입하는 SQL 문을 생성
- `values`: 삽입할 데이터를 지정
- `execute`: SQL 문을 실행

---

<!-- .slide: data-auto-animate -->

# 3. SQLAlchemy

## ORM 1부 (3) - 데이터 조회

```python
select_stmt = select(user_table).where(user_table.c.age > 10)
with engine.connect() as conn:
    result = conn.execute(select_stmt).fetchall()
    print(result)
```

- `select`: 데이터를 조회하는 SQL 문을 생성
- `where`: 조회 조건을 지정
- `fetchall`: 조회 결과를 모두 가져옴

---

<!-- .slide: data-auto-animate -->

# 3. SQLAlchemy

## ORM 1부 (4) - 데이터 수정

```python
update_stmt = update(user_table).where(user_table.c.name == "test").values(age=30)
with engine.connect() as conn:
    conn.execute(update_stmt)
```

- `update`: 데이터를 수정하는 SQL 문을 생성
- `where`: 수정할 데이터를 선택하는 조건을 지정
- `values`: 수정할 데이터를 지정

---

<!-- .slide: data-auto-animate -->

# 3. SQLAlchemy

## ORM 1부 (5) - 데이터 삭제

```python
delete_stmt = delete(user_table).where(user_table.c.name == "test")
with engine.connect() as conn:
    conn.execute(delete_stmt)
```

- `delete`: 데이터를 삭제하는 SQL 문을 생성
- `where`: 삭제할 데이터를 선택하는 조건을 지정

---

<!-- .slide: data-auto-animate -->

# 3. SQLAlchemy

## ORM 2부 (1) - Declarative Base

```python
from sqlalchemy import Integer, String
from sqlalchemy.orm import DeclarativeBase, Session, mapped_column

class Base(DeclarativeBase): ...

class User(Base):
    __tablename__ = "users"

    id = mapped_column(Integer, primary_key=True)
    name = mapped_column(String)
    age = mapped_column(Integer)

Base.metadata.create_all(engine)
```

- `Base`: 모든 ORM 클래스의 부모 클래스
- `mapped_column`: 컬럼을 정의하는 함수
- `__tablename__`: 테이블 이름을 지정
  - 이외에도 `__table__`, `__mapper_args__` 등 다양한 속성이 있음

---

<!-- .slide: data-auto-animate -->

# 3. SQLAlchemy

## ORM 2부 (2) - 데이터 삽입

```python
with Session(engine) as session:
    user = User(name="test", age=20)
    session.add(user)
    session.commit()
```

- `Session`: `Connection` 의 래퍼 클래스로, ORM 과 관련된 작업을 추가적으로 수행
  - `with` 문을 사용하여 세션을 생성하고 종료
- 여기선 `add` 를 사용했지만, 전처럼 `insert` 를 사용해도 무방함

---

<!-- .slide: data-auto-animate -->

# 3. SQLAlchemy

## ORM 2부 (3) - 데이터 조회

```python
with Session(engine) as session:
    stmt = select(User).where(User.age > 10)
    result = session.execute(stmt).scalars()
    print(result)
```

- `select`: 데이터를 조회하는 SQL 문을 생성
- `scalars`: 조회 결과를 스칼라로 가져옴
  - 이전과 달리 튜플이 아니라 User 클래스의 인스턴스를 반환

---

<!-- .slide: data-auto-animate -->

# 3. SQLAlchemy

## ORM 2부 (4) - 데이터 수정

```python
with Session(engine) as session:
    stmt = select(User).where(User.name == "test")
    user = session.execute(stmt).scalar()
    user.age = 30
    session.commit()
```

- User 객체는 세션에 의해 관리되고 있으므로, 객체의 속성을 변경하고 `commit` 을 호출하여 수정 가능
- 이전처럼 `update` 를 사용해도 무방함

---

<!-- .slide: data-auto-animate -->

# 3. SQLAlchemy

## ORM 2부 (5) - 데이터 삭제

```python
with Session(engine) as session:
    stmt = delete(User).where(User.name == "test")
    session.execute(stmt)
```

- `delete`: 데이터를 삭제하는 SQL 문을 생성

---

<!-- .slide: data-auto-animate -->

# 3. SQLAlchemy

## ORM 2부 (6) - ForeignKey

```python
from sqlalchemy.orm import relationship

class Address(Base):
    __tablename__ = "addresses"

    id = mapped_column(Integer, primary_key=True)
    user_id = mapped_column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="addresses")
```

- `relationship`: 두 테이블 간의 관계를 정의
- `back_populates`: 양방향 관계를 정의
  - `User` 클래스에 `addresses` 속성이 추가됨

---

<!-- .slide: data-auto-animate -->

# 3. SQLAlchemy

## ORM 2부 (7) - JOIN

```python
with Session(engine) as session:
    stmt = select(User).join(Address)
    result = session.execute(stmt).scalars()
    print(result)
```

- `join`: 두 테이블을 조인하는 SQL 문을 생성
- `scalars`: 조회 결과를 스칼라로 가져옴

---

<!-- .slide: data-auto-animate -->

# 3. SQLAlchemy

## ORM 2부 (8) - Relationship Loading Techniques

- 조인된 테이블의 데이터를 언제 로딩하느냐에 따라 다양한 전략이 존재함
- `lazy loading`: 로딩하지 않고, 데이터에 접근할 때 로딩 (기본값)
  - 1+N 문제 발생 가능
- `joined loading`: JOIN 절로 함께 로딩
  - 데이터에 접근할 때 추가 쿼리가 발생하지 않음
- `select in loading`: 부모 객체의 PK를 IN 절로 모아서 로딩
- `raise loading`: 로딩 시 예외 발생
- `noload`: 로딩하지 않음

---

<!-- .slide: data-auto-animate -->

# 3. SQLAlchemy

## ORM 2부 (9) - Relationship Loading Techniques

```python
class Address(Base):
    ...
    user = relationship("User", back_populates="addresses", lazy="joined")
```

```python
with Session(engine) as session:
    stmt = select(User).options(joinedload(User.addresses))
    result = session.execute(stmt).scalars()
    print(result)
```

---

<!-- .slide: data-auto-animate -->

# 3. SQLAlchemy

# 실습

---

<!-- .slide: class="section-title" data-auto-animate -->

# 4. FastAPI와 SQLAlchemy 연동

---

<!-- .slide: data-auto-animate -->

# 4. FastAPI와 SQLAlchemy 연동

> 과제 2 스켈레톤 코드 참고
