const fs = require('fs');
const dir = './oasis';

const userFile = {
  "origins": [
    {
      "origin": "https://esavezone.co.kr",
      "localStorage": [
        {},
        {},
        {
          "name": "sz_asct",
          "value": ""
        }
      ]
    }
  ]
}

fs.readdir(dir, (err, files) => {
    files.forEach((file) => {
        //.auth와 user.json 모두 없음
        if (!fs.existsSync(`${dir}/${file}/playwright/.auth`)) {
            fs.mkdirSync(`${dir}/${file}/playwright/.auth`, {recursive: true}); // .auth 폴더 만듬
            fs.writeFile(`${dir}/${file}/playwright/.auth/user.json`, JSON.stringify(userFile), function(err){}); // user.json 만듬
        }
        // .auth는 있는데 user.json이 없음
        else if (!fs.existsSync(`${dir}/${file}/playwright/.auth/user.json`)) {
            fs.writeFile(`${dir}/${file}/playwright/.auth/user.json`, JSON.stringify(userFile), function(err){}); // user.json 만듬
        }
        // 모두 있음
        else {}
    });
});

console.log('> run check-user-json.js');