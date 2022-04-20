# Restaurant List 餐廳清單

使用 Node.js Express 制作一個餐廳美食網站。

![restaurant-image](https://github.com/Steavn-Chen/test-restaurant-list/blob/main/public/images/%E7%99%BB%E5%85%A5.PNG)

## 功能介紹 

- 透過餐廳名稱或類別搜尋
- 顥示餐廳詳細資料包括類別、地址、電話、評、分圖片等資訊。
- 針對 CRUD 的功能，可以新增一筆資料，也可以刪除、修改。
- 網站設為會員制，使用者必需先註冊才可以使用。
- 使用者可以透過第三方 FB 註冊。
- 增加按紐換餐廳資料為卡片或者為清單模式。
- 使用者透過排序按紐，將資料用類別，評分，名稱來排序所有的資料。

## 啓動方式

- 將專案 clone 到本地端

https://github.com/Steavn-Chen/test-restaurant-list.git

- 進入到專案資料夾

- 安裝 npm

  npm install

- 啓動專案

npm run dev

- 若終端機出顥示出以下字串，表示成功。

The web is running http://localhost:3000

出現 mongodb is connected! ，代表 mongodb 資料庫連接成功

- 在終端機輸入 npm run seed
  看到  done ! 種子資料建立成功

## 開發環境

- Node.js v14.15.1
- Express 4.17.3
- Express-Handlebars 5.3.4

## 使用的套件

- mongoose 5.12.15
- mongoose-find-or-create
- passport
- passport-facebook
- passport-local
- passport-github-oauth20
- passport-google-oauth20
- dotenv
- connect-flash
- bcryptjs
- express-session
- express-handlebars
- method-override
- bootstrap-icons
