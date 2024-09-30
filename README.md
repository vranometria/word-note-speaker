# Word Note Speaker

## What's this
英単語の発音だけ聞いて日本訳を当てる英単語帳アプリ

## 開発環境での実行方法
1. 「docker-compose up -d」でコンテナを作成する
1.  http://localhost:8001/ を開き、words, tagsというテーブルを作成する(どちらもカラムはidで、string型)
1. 「npm run dev」でアプリを起動する
1. http://localhost:3000 を開く


## 機能
### Question Register
英単語を登録する

### Edit Tags
英単語の属性であるタグを登録、削除する

### Training Start
検索条件にマッチする英単語をランダムに出題する
