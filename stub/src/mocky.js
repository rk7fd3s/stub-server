var mocky = require('mocky');
var fs = require('fs');
var url = require('url');

mocky.createServer([
  {
    // xxxxAPI
    url: /\/sampleapi\?.*/,
    method: 'get',
    res: function (req, res, callback) {
      // URLをパース
      const url_parse = url.parse(req.url, true);

      // URLクエリから値を取得
      const key = url_parse.query.key;

      if (key) {
        // データファイルパス
        let dataFilePath = './data/sample/' + key + '.json';
        if (!fs.existsSync(dataFilePath)) {
          // ファイルがなければdefault.json
          dataFilePath = './data/sample/' + 'default.json';
        }
        console.log('dataFilePath: ', dataFilePath);

        fs.readFile(dataFilePath, "utf-8", (err, data) => {
          callback(null, {
            headers: { 'Content-type': 'application/json' },
            status: 200,
            body: data
          });
        });
      } else {
        // keyが指定されなかったら、空JSONを返却
        callback(null, {
          headers: { 'Content-type': 'application/json' },
          status: 200,
          body: "{}"
        });
      }
    }
  },
  {
    // xxxAPI
    url: "/sampleapi",
    method: 'post',
    res: function (req, res, callback) {
      // BODYをパース
      var params = JSON.parse(req.body);
      
      // BODYから値を取得
      const key = params.key;

      if (key) {
        // データファイルパス
        let dataFilePath = './data/sample/' + key + '.json';
        if (!fs.existsSync(dataFilePath)) {
          // ファイルがなければdefault.json
          dataFilePath = './data/sample/' + 'default.json';
        }
        console.log('dataFilePath: ', dataFilePath);

        fs.readFile(dataFilePath, "utf-8", (err, data) => {
          callback(null, {
            headers: { 'Content-type': 'application/json' },
            status: 200,
            body: data
          });
        });
      } else {
        // keyが指定されなかったら、空JSONを返却
        callback(null, {
          headers: { 'Content-type': 'application/json' },
          status: 200,
          body: "{}"
        });
      }
    }
  }

]).listen(3000);
