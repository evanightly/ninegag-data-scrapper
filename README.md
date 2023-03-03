# NineGag Data Scrapper
Used to get your 9gag saved and voted data, then display it into your own website (some sort of bookmarking)

## Scrapping Flow
1. Login with your 9gag credentials
2. Scanning your userdata in localstorage
3. Sync data with scrapped one (if any)
4. Scrap each post and **download each media file and save it into public folder** then pushed into database
5. Open client side (http://localhost:3000)
6. Happy bookmarking!

## Usage
### Basic Installation
1. Run npm install on server and client side
   - run this command in main folder using terminal
   - ```cd server && npm install```
   - ```cd ../client && npm install```
2. Duplicate config.example.json in server folder and rename it to config.json
3. Open config.json and then put your 9gag credentials for login operation (dont worry, i won't steal your account, check the source code if you want)
4. Create new database in mongodb atlas and copy its URI address, then paste it into config.json file
5. Run ```npm start``` on main folder

### Scrapping Data
1. After running server and its client, go to http://localhost:1122/post/sync
2. Wait for the scraping progress, you can check its progress through server terminal!
3. After complete you can refresh your client(website or so to say)
4. Congratulations, your system is ready to use!

### Note
This programs may have bugs so.. I'll try my best to fix them

### Future Updates
- Server
  - Delete deleted post
  - Skip deleted post when scrapping
- Client
  - Cross get data server - client when scraping (sending scrap progress to client side)
    - Bug: modal auto close when sync button clicked, possible bug occurred when scrapProgress data is not updated
