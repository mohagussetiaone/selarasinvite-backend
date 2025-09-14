# Invitation API Specification

## Base URL

http://localhost:3000/api

## Endpoint Create Invitation

### Request

- Method
  POST
- URL
  {{BASE_URL}}/invitations

- Header
  Content-Type: application/json
- Request Body

```json
{
  "test": "string",
  "test2": "string"
}
```

### Response

- Success (201)

```json
{
  "status": true,
  "message": "Berhasil",
  "data": {
    "test": "test"
  }
}
```

- Error (400)

```json
{
  "status": false,
  "message": "Gagal",
  "data": null
}
```
