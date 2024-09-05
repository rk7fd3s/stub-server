var mocky = require('mocky');
var fs = require('fs');
var url = require('url');

var options = { 
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

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
  },{
    // xxxAPI
    url: "/dummy400",
    method: 'post',
    res: function (req, res, callback) {
      const key = 400;

      // データファイルパス
      let dataFilePath = './data/sample/' + key + '.json';
      if (!fs.existsSync(dataFilePath)) {
        // ファイルがなければdefault.json
        dataFilePath = './data/sample/' + 'default.json';
      }
      console.log('dataFilePath: ', dataFilePath);

      fs.readFile(dataFilePath, "utf-8", (err, data) => {
        var www = data.replace(/\n|\r/g,'');
        console.log('www: ', www);
        callback(null, {
          headers: { 'Content-type': 'application/json' },
          status: 400,
          body: www
        });
      });
    }
  },{
    // xxxAPI
    url: "/v1/emails",
    method: 'post',
    res: function (req, res, callback) {
      // データファイルパス
      let dataFilePath = './data/sample/202.json';
      console.log('dataFilePath: ', dataFilePath);

      fs.readFile(dataFilePath, "utf-8", (err, data) => {
        var www = data.replace(/\n|\r/g,'');
        console.log('www: ', www);
        callback(null, {
          headers: { 'Content-type': 'application/json' },
          status: 202,
          body: www
        });
      });
    }
  },{
    // xxxAPI
    url: "/dummyInvalid",
    method: 'post',
    res: function (req, res, callback) {
      const key = 'invalid';

      // データファイルパス
      let dataFilePath = './data/sample/' + key + '.json';
      if (!fs.existsSync(dataFilePath)) {
        // ファイルがなければdefault.json
        dataFilePath = './data/sample/' + 'default.json';
      }
      console.log('dataFilePath: ', dataFilePath);

      fs.readFile(dataFilePath, "utf-8", (err, data) => {
        var www = data.replace(/\n|\r/g,'');
        console.log('www: ', www);
        callback(null, {
          headers: { 'Content-type': 'application/json' },
          status: 400,
          body: www
        });
      });
    }
  }

], {srvType: 'https'}).listen(3001);
