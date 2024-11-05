var mocky = require("mocky");
var fs = require("fs");
var url = require("url");
const { setTimeout } = require("timers/promises");

let count = 0;

mocky
  .createServer([
    {
      // パラメータtに与えたミリ秒待つだけ
      url: /\/wait\/*/,
      method: "get",
      res: async function (req, res, callback) {
        // URLをパース
        const url_parse = url.parse(req.url, true);

        // URLクエリから値を取得
        const t = url_parse.query.t;

        if (t === "660") {
          callback(null, {
            headers: { "Content-type": "application/json" },
            status: 404,
            body: '{"error": ' + t + "}",
          });
          return;
        }

        await setTimeout(t);

        callback(null, {
          headers: { "Content-type": "application/json" },
          status: 200,
          body: '{"wait": ' + t + "}",
        });
      },
    },
    {
      // Retry-Afterヘッダーをつけて429ステータスで返す
      url: /\/issue\/429/,
      method: "get",
      res: function (req, res, callback) {
        var headers = {
          "Retry-After": "12",
          "X-RateLimit-Reset": "2024-10-30T12:12Z",
          "Content-type": "application/json",
        };
        callback(null, {
          headers: headers,
          status: 429,
          body: '{"error": 429}',
        });
      },
    },
    {
      // Retry-Afterヘッダーがない429ステータスで返す
      url: /\/issue\/noRate429/,
      method: "get",
      res: function (req, res, callback) {
        var headers = {
          "X-RateLimit-Reset": "2024-10-30T12:12Z",
          "Content-type": "application/json",
        };
        callback(null, {
          headers: headers,
          status: 429,
          body: '{"error": 429}',
        });
      },
    },
    {
      // X-RateLimit-Resetヘッダーがない429ステータスで返す
      url: /\/issue\/noReset429/,
      method: "get",
      res: function (req, res, callback) {
        var headers = {
          "Retry-After": "20",
          "Content-type": "application/json",
        };
        callback(null, {
          headers: headers,
          status: 429,
          body: '{"error": 429}',
        });
      },
    },
    {
      // ヘッダーがない429ステータスで返す
      url: /\/issue\/noHead429/,
      method: "get",
      res: function (req, res, callback) {
        var headers = {
          "Content-type": "application/json",
        };
        callback(null, {
          headers: headers,
          status: 429,
          body: '{"error": 429}',
        });
      },
    },
    {
      // 空のオブジェクトを200ステータスで返す
      url: /\/issue\/200/,
      method: "get",
      res: function (req, res, callback) {
        var headers = {
          "Content-type": "application/json",
        };
        callback(null, {
          headers: headers,
          status: 200,
          body: "{}",
        });
      },
    },
    {
      // 課題検索のレスポンス
      // startAtが0(もしくは無し)かそれ以外で結果が異なる
      url: /\/jira\/rest\/api\/3\/search/,
      method: "get",
      res: function (req, res, callback) {
        // URLをパース
        const url_parse = url.parse(req.url, true);

        // URLクエリから値を取得
        const startAt = url_parse.query.startAt;

        let jsonName = "search_1.json";
        if (startAt != 0) {
          jsonName = "search_2.json";
        }
        const dataFilePath = "./data/sample/jira/" + jsonName;

        fs.readFile(dataFilePath, "utf-8", (err, data) => {
          callback(null, {
            headers: { "Content-type": "application/json" },
            status: 200,
            body: data,
          });
        });
      },
    },
    {
      // 課題更新
      url: /\/jira\/rest\/api\/3\/issue\/.+/,
      method: "put",
      res: function (req, res, callback) {
        // URLをパース
        const url_parse = url.parse(req.url, true);

        callback(null, {
          headers: { "Content-type": "text/html" },
          status: 204,
          body: "",
        });
      },
    },
    {
      // 課題のトランジション
      // 3回に一回Retry-After(429)を返す
      url: /\/jira\/rest\/api\/3\/issue\/.+\/transitions/,
      method: "post",
      res: function (req, res, callback) {
        count++;
        if (count % 3 === 0) {
          var headers = {
            "Retry-After": "10",
            "Content-type": "text/html",
          };
          callback(null, {
            headers: headers,
            status: 429,
            body: "",
          });
        } else {
          callback(null, {
            headers: { "Content-type": "text/html" },
            status: 204,
            body: "",
          });
        }
      },
    },
    {
      // xxxxAPI
      url: /\/sampleapi\?.*/,
      method: "get",
      res: function (req, res, callback) {
        // URLをパース
        const url_parse = url.parse(req.url, true);

        // URLクエリから値を取得
        const key = url_parse.query.key;

        if (key) {
          // データファイルパス
          let dataFilePath = "./data/sample/" + key + ".json";
          if (!fs.existsSync(dataFilePath)) {
            // ファイルがなければdefault.json
            dataFilePath = "./data/sample/" + "default.json";
          }
          console.log("dataFilePath: ", dataFilePath);

          fs.readFile(dataFilePath, "utf-8", (err, data) => {
            callback(null, {
              headers: { "Content-type": "application/json" },
              status: 200,
              body: data,
            });
          });
        } else {
          // keyが指定されなかったら、空JSONを返却
          callback(null, {
            headers: { "Content-type": "application/json" },
            status: 200,
            body: "{}",
          });
        }
      },
    },
    {
      // xxxAPI
      url: "/sampleapi",
      method: "post",
      res: function (req, res, callback) {
        // BODYをパース
        var params = JSON.parse(req.body);

        // BODYから値を取得
        const key = params.key;

        if (key) {
          // データファイルパス
          let dataFilePath = "./data/sample/" + key + ".json";
          if (!fs.existsSync(dataFilePath)) {
            // ファイルがなければdefault.json
            dataFilePath = "./data/sample/" + "default.json";
          }
          console.log("dataFilePath: ", dataFilePath);

          fs.readFile(dataFilePath, "utf-8", (err, data) => {
            callback(null, {
              headers: { "Content-type": "application/json" },
              status: 200,
              body: data,
            });
          });
        } else {
          // keyが指定されなかったら、空JSONを返却
          callback(null, {
            headers: { "Content-type": "application/json" },
            status: 200,
            body: "{}",
          });
        }
      },
    },
  ])
  .listen(3000);
