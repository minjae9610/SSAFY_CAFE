const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const multer = require("multer");
const pool = require("./db");
const path = require("path");
const { swaggerUi, specs } = require("./swagger/swagger");

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/public", express.static("public"));
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileNameExeptExt = path.basename(file.originalname, ext);
    const saveFileName = fileNameExeptExt + "_" + Date.now() + ext;
    cb(null, saveFileName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

/**
 * @swagger
 * /api/menus:
 *  get:
 *   summary: "메뉴 데이터 전체 조회"
 *   description: "GET을 이용한 메뉴 데이터 전체 조회"
 *   tags: [Menu]
 *   responses:
 *    200:
 *     description: "메뉴 데이터 전체 조회"
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         type: object
 *         properties:
 *          id:
 *           type: integer
 *           description: 메뉴 id
 *           example: 1
 *          name:
 *           type: string
 *           description: 메뉴 이름
 *           example: "카페라떼"
 *          description:
 *           type: string
 *           description: 메뉴 설명
 *           example: "라떼는.. 말이야"
 *          image_src:
 *           type: string
 *           description: 메뉴 이미지 경로
 *           example: "public/image1.jpg"
 */
app.get("/api/menus", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM menus");
    return res.json(result[0]);
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: "전체 메뉴 목록 조회에 실패하였습니다.",
    });
  }
});

/**
 * @swagger
 * /api/menus/{id}:
 *  get:
 *   summary: "메뉴 데이터 조회"
 *   description: "GET을 이용한 메뉴 데이터 조회"
 *   tags: [Menu]
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      description: 조회할 메뉴의 id
 *      schema:
 *       type: integer
 *   responses:
 *    200:
 *     description: "메뉴 데이터 조회"
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         id:
 *          type: integer
 *          description: 메뉴 id
 *          example: 1
 *         name:
 *          type: string
 *          description: 메뉴 이름
 *          example: "카페라떼"
 *         description:
 *          type: string
 *          description: 메뉴 설명
 *          example: "라떼는.. 말이야"
 *         image_src:
 *          type: string
 *          description: 메뉴 이미지 경로
 *          example: "public/image1.jpg"
 */
app.get("/api/menus/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM menus WHERE id = ?", [
      req.params.id,
    ]);
    return res.json(result[0][0]);
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: "메뉴 목록 조회에 실패하였습니다.",
    });
  }
});

/**
 * @swagger
 * /api/menus:
 *  post:
 *   summary: "메뉴 데이터 등록"
 *   description: "POST를 이용한 메뉴 데이터 등록"
 *   tags: [Menu]
 *   requestBody:
 *    description: "메뉴 데이터 등록을 위한 요청 데이터"
 *    required: true
 *    content:
 *     multipart/form-data:
 *      schema:
 *       type: object
 *       properties:
 *        name:
 *         type: string
 *         description: 메뉴 이름
 *        description:
 *         type: string
 *        file:
 *         type: string
 *         format: binary
 *   responses:
 *    200:
 *     description: "메뉴 데이터 등록"
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *          description: 메뉴 데이터 등록 성공 여부
 *          example: true
 *         message:
 *          type: string
 *          description: 메뉴 데이터 등록 성공/실패 메시지
 *          example: "메뉴 등록에 성공하셨습니다."
 */
app.post("/api/menus", upload.single("file"), async (req, res) => {
  try {
    const data = await pool.query(
      `INSERT INTO menus (name, description, image_src) VALUES (?, ?, ?)`,
      [req.body.name, req.body.description, req.file.filename]
    );
    return res.json({
      success: true,
      message: "메뉴 등록에 성공하셨습니다.",
    });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: "메뉴 등록에 실패하였습니다.",
    });
  }
});

/**
 * @swagger
 * /api/menus/{id}:
 *  patch:
 *   summary: "메뉴 데이터 수정"
 *   description: "PATCH를 이용한 메뉴 데이터 수정"
 *   tags: [Menu]
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      description: "수정할 메뉴의 id"
 *      schema:
 *       type: integer
 *   requestBody:
 *    description: "메뉴 데이터 수정을 위한 요청 데이터"
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        name:
 *         type: string
 *         description: 메뉴 이름
 *        description:
 *         type: string
 *         description: 메뉴 설명
 *   responses:
 *    200:
 *     description: "메뉴 데이터 수정"
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *          description: 메뉴 데이터 수정 성공 여부
 *          example: true
 *         message:
 *          type: string
 *          description: 메뉴 데이터 수정 성공/실패 메시지
 *          example: "메뉴 정보 수정에 성공하셨습니다."
 */
app.patch("/api/menus/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE menus SET name = ?, description = ? WHERE id = ?`,
      [req.body.name, req.body.description, req.params.id]
    );
    return res.json({
      success: true,
      message: "메뉴 정보 수정에 성공하셨습니다.",
    });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: "메뉴 정보 수정에 실패하였습니다.",
    });
  }
});

/**
 * @swagger
 * /api/menus/{id}/image:
 *  post:
 *   summary: "메뉴 이미지 수정"
 *   description: "POST를 이용한 메뉴 이미지 수정"
 *   tags: [Menu]
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      description: "수정할 메뉴의 id"
 *      schema:
 *       type: integer
 *   requestBody:
 *    description: "메뉴 이미지 수정을 위한 요청 데이터"
 *    required: true
 *    content:
 *     multipart/form-data:
 *      schema:
 *       type: object
 *       properties:
 *        file:
 *         type: string
 *         format: binary
 *   responses:
 *    200:
 *     description: "메뉴 이미지 수정"
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *          description: 메뉴 이미지 수정 성공 여부
 *          example: true
 *         message:
 *          type: string
 *          description: 메뉴 이미지 수정 성공/실패 메시지
 *          example: "메뉴 이미지 수정에 성공하셨습니다."
 */
app.post("/api/menus/:id/image", upload.single("file"), async (req, res) => {
  try {
    const data = await pool.query(
      `UPDATE menus SET image_src = ? WHERE id = ?`,
      [req.file.filename, req.params.id]
    );
    return res.json({
      success: true,
      message: "메뉴 이미지 수정에 성공하셨습니다.",
    });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: "메뉴 이미지 수정에 실패하였습니다.",
    });
  }
});

/**
 * @swagger
 * /api/menus/{id}:
 *  delete:
 *   summary: "메뉴 데이터 삭제"
 *   description: "DELETE를 이용한 메뉴 데이터 삭제"
 *   tags: [Menu]
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      description: "삭제할 메뉴의 id"
 *      schema:
 *       type: integer
 *   responses:
 *    200:
 *     description: "메뉴 데이터 삭제"
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *          description: 메뉴 데이터 삭제 성공 여부
 *          example: true
 *         message:
 *          type: string
 *          description: 메뉴 데이터 삭제 성공/실패 메시지
 *          example: "메뉴 삭제에 성공하셨습니다."
 */
app.delete("/api/menus/:id", async (req, res) => {
  try {
    const data = await pool.query(`DELETE FROM menus WHERE id = ?`, [
      req.params.id,
    ]);
    return res.json({
      success: true,
      message: "메뉴 삭제에 성공하셨습니다.",
    });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: "메뉴 삭제에 실패하였습니다.",
    });
  }
});

/**
 * @swagger
 * /api/orders:
 *  get:
 *   summary: "전체 주문 목록 조회"
 *   description: "GET을 이용한 전체 주문 목록 조회"
 *   tags: [Order]
 *   responses:
 *    200:
 *     description: "전체 주문 목록 조회"
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         type: object
 *         properties:
 *          id:
 *           type: integer
 *           description: 주문 id
 *           example: 1
 *          quantity:
 *           type: integer
 *           description: 주문 수량
 *           example: 1
 *          request_detail:
 *           type: string
 *           description: 주문 요청사항
 *           example: "얼음 많이많이 주세요."
 *          name:
 *           type: string
 *           description: 메뉴 이름
 *           example: "카페라떼"
 *          description:
 *           type: string
 *           description: 메뉴 설명
 *           example: "라떼는.. 말이야"
 */
app.get("/api/orders", async (req, res) => {
  try {
    const data = await pool.query(`
    SELECT a.id, quantity, request_detail, name, description
    FROM orders as a
    INNER JOIN menus as b
    ON a.menus_id = b.id
    ORDER BY a.id DESC
    `);
    return res.json(data[0]);
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: "전체 주문 목록 조회에 실패하였습니다.",
    });
  }
});

/**
 * @swagger
 * /api/orders/{id}:
 *  get:
 *   summary: "주문 내역 조회"
 *   description: "GET을 이용한 주문 내역 조회"
 *   tags: [Order]
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      description: "조회할 주문의 id"
 *      schema:
 *       type: integer
 *   responses:
 *    200:
 *     description: "주문 내역 조회"
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         id:
 *          type: integer
 *          description: 주문 id
 *          example: 1
 *         quantity:
 *          type: integer
 *          description: 주문 수량
 *          example: 1
 *         request_detail:
 *          type: string
 *          description: 주문 요청사항
 *          example: "얼음 많이많이 주세요."
 *         name:
 *          type: string
 *          description: 메뉴 이름
 *          example: "카페라떼"
 *         description:
 *          type: string
 *          description: 메뉴 설명
 *          example: "라떼는.. 말이야"
 */
app.get("/api/orders/:id", async (req, res) => {
  try {
    const data = await pool.query(
      `
    SELECT a.id, quantity, request_detail, name, description
    FROM orders as a
    INNER JOIN menus as b
    ON a.menus_id = b.id
    WHERE a.id = ?
    `,
      [req.params.id]
    );
    return res.json(data[0][0]);
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: "주문 내역 조회에 실패하였습니다.",
    });
  }
});

/**
 * @swagger
 * /api/orders:
 *  post:
 *   summary: "주문하기"
 *   description: "POST를 이용한 주문하기"
 *   tags: [Order]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        quantity:
 *         type: integer
 *         description: 주문 수량
 *         example: 1
 *        request_detail:
 *         type: string
 *         description: 주문 요청사항
 *         example: "얼음 많이많이 주세요."
 *        menus_id:
 *         type: integer
 *         description: 메뉴 id
 *         example: 1
 *   responses:
 *    200:
 *     description: "주문하기"
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *          description: 주문 성공 여부
 *          example: true
 *         message:
 *          type: string
 *          description: 주문 성공 여부 메세지
 *          example: "주문에 성공하였습니다."
 */
app.post("/api/orders", async (req, res) => {
  try {
    const data = await pool.query(
      `INSERT INTO orders (quantity, request_detail, menus_id) VALUES (?, ?, ?)`,
      [req.body.quantity, req.body.request_detail, req.body.menus_id]
    );
    return res.json({
      success: true,
      message: "주문에 성공하였습니다.",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "주문에 실패하였습니다.",
    });
  }
});

/**
 * @swagger
 * /api/orders/{id}:
 *  patch:
 *   summary: "주문 수정"
 *   description: "PATCH를 이용한 주문 수정"
 *   tags: [Order]
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      description: "수정할 주문의 id"
 *      schema:
 *       type: integer
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        quantity:
 *         type: integer
 *         description: 주문 수량
 *         example: 1
 *        request_detail:
 *         type: string
 *         description: 주문 요청사항
 *         example: "얼음 많이많이 주세요."
 *   responses:
 *    200:
 *     description: "주문 수정"
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *          description: 주문 수정 성공 여부
 *          example: true
 *         message:
 *          type: string
 *          description: 주문 수정 성공 여부 메세지
 *          example: "주문 수정에 성공하셨습니다."
 */
app.patch("/api/orders/:id", async (req, res) => {
  try {
    const data = await pool.query(
      `UPDATE orders SET quantity = ?, request_detail = ? WHERE id = ?`,
      [req.body.quantity, req.body.request_detail, req.params.id]
    );
    return res.json({
      success: true,
      message: "주문 수정에 성공하셨습니다.",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "주문 수정에 실패하였습니다.",
    });
  }
});

/**
 * @swagger
 * /api/orders/{id}:
 *  delete:
 *   summary: "주문 삭제"
 *   description: "DELETE를 이용한 주문 삭제"
 *   tags: [Order]
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      description: "삭제할 주문의 id"
 *      schema:
 *       type: integer
 *   responses:
 *    200:
 *     description: "주문 삭제"
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *          description: 주문 삭제 성공 여부
 *          example: true
 *         message:
 *          type: string
 *          description: 주문 삭제 성공 여부 메세지
 *          example: "주문 삭제에 성공하셨습니다."
 */
app.delete("/api/orders/:id", async (req, res) => {
  try {
    const data = await pool.query(`DELETE FROM orders WHERE id = ?`, [
      req.params.id,
    ]);
    return res.json({
      success: true,
      message: "주문 삭제에 성공하셨습니다.",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "주문 삭제에 실패하였습니다.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
