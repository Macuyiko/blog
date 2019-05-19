Title: A Tour of Open MongoDB Instances
Author: Seppe "Macuyiko" vanden Broucke
Date: 2019-04-07 12:36

Earlier last month, a security researcher called Victor Gevers sent out a [tweet](https://twitter.com/0xDUDE/status/1101917885100945409) stating that he had stumbled upon a number of open MongoDB databases hosting what was apparantly logged chats from a number of Chinese applications such as Weixin (WeChat) and QQ:

> Around 364 million online profiles and their chats & file transfers get processed daily. Then these accounts get linked to a real ID/person. The data is then distributed over police stations per city/province to separate operators databases with the same surveillance network name

> And the most remarkable part is that this network syncs all this data to open MongoDBs in 18 locations.

![Screen grab of some of the logged conversations, source: https://twitter.com/0xDUDE/status/1101917885100945409](/images/2019/mongo.jpg)

This story was then picked up all across the Internet:

- [https://www.cbronline.com/news/china-mongodb-databases](https://www.cbronline.com/news/china-mongodb-databases)
- [https://www.bleepingcomputer.com/news/security/open-mongodb-databases-expose-chinese-surveillance-data/](https://www.bleepingcomputer.com/news/security/open-mongodb-databases-expose-chinese-surveillance-data/)

It's not the first time that badly secured MongoDB instances cause huge data leaks either. Previous examples include:

- Chinese resumes being stolen, see [here](https://www.zdnet.com/article/chinese-companies-have-leaked-over-590-million-resumes-via-open-databases/) and [here](https://thenextweb.com/security/2019/01/11/200-million-chinese-resumes-leak-in-huge-database-breach/)
- 800 million e-mail records being exposed, see [here](https://www.bleepingcomputer.com/news/security/insecure-database-leads-to-over-800-million-records-data-breach/)
- MongoDB data bases [being held ransom](https://www.zdnet.com/article/mongodb-databases-still-being-held-for-ransom-two-years-after-attacks-started/)
- Another [11 million users exposed](https://www.zdnet.com/article/mongodb-server-leaks-11-million-user-records-from-e-marketing-service/)
- And [2 billion records over here](https://www.forbes.com/sites/daveywinder/2019/03/10/2-billion-unencrypted-records-leaked-in-marketing-data-breach-what-happened-and-what-to-do-next/#7c450bda6b0d)
- Another [set of e-mails](https://nakedsecurity.sophos.com/2018/09/19/here-we-mongo-again-millions-of-records-exposed-by-insecure-database/)

By now, people are starting to wonder if MongoDB was [ever the right choice to begin with](https://nakedsecurity.sophos.com/2018/09/19/here-we-mongo-again-millions-of-records-exposed-by-insecure-database/). [Hacker News is full of stories of people switching as well](https://hn.algolia.com/?query=mongodb&sort=byPopularity&prefix&page=0&dateRange=all&type=story). This is also something we argue in the [Principles of Database Managemnt Book](http://www.pdbmbook.com/) I've co-authored: a lot of early adopters have been burned by NoSQL technologies, with MongoDB in particular causing issues with:

- No strong support for complex queries (well, there's MapReduce) -- although this has gotten better in recent versions
- No strong consistency guarantees (well, of course not) -- although this is more an issue with users not really understanding the trade-offs in distributed systems
- No security by default -- again, this is in principle the fault of the end-user

Nevertheless, it seems exactly the last point together with the fact that it is so easy to spin up a MongoDB server and start dumping JSON data that has caused the Internet to overflow with badly protected instances.

Given the above stories, I was wondering whether the situation is still as bad today as it was a few years earlier. Surely by now people would have gotten smarter?

<center>*<br>*&nbsp;&nbsp;&nbsp;*</center>

As such, I went off to [Shodan](https://www.shodan.io/) to set up a search for MongoDB instances running on their default port and without authentication enabled. A few years ago, I used tools such as [masscan](https://github.com/robertdavidgraham/masscan) to scan the whole IPv4 range myself, but network operators and server providers have gotten stricter and prefer you don't scan 4 billion addresses. As such, I just dumped in the couple of bucks necessary to get the data out of Shodan and set to work.

24980 IP addresses were obtained together with some metadata, based on which you can already get an overview of the distribution per country:

![Most open servers are located in the US and China](/images/2019/mongo_cn.png)

For which I set up a Python script to connect to each of them, see if MongoDB was still up (and still unsecured), and download a couple of documents from each database and collection. I wasn't interesting in dumping the complete set of data out, so I limited extraction to about 5 records for each server, database, collection tuple. I ran this over a bunch of servers and had the results after a couple of days of waiting.

Out of this initial set, 14861 servers were responding and still up.

I used [`python-geoip-python3`](https://pypi.org/project/python-geoip-python3/) to map each of those to their GeoIP location:

```python
def ip2info(ip):
    match = geolite2.lookup(ip)
    if match is None: return {}
    d = match.to_dict()
    for key, val in d.items():
        if isinstance(val, frozenset):
            d[key] = ', '.join(val)
    d['lat'] = d['location'][0]
    d['lng'] = d['location'][1]
    return d

for lbl in ['country', 'continent', 'subdivision', 'timezone', 'lat', 'lng']:
    df[lbl] = df['ip'].apply(lambda x : ip2info(x).get(lbl))
```

I then exported this to a CSV file and loaded this into [kepler.gl](https://kepler.gl/). I've been wanting to take a quick look at this tool before and was surprised at how quick it made sense of the data:

![Final set of open MongoDB servers](/images/2019/mongo_kepler.png)

<center>*<br>*&nbsp;&nbsp;&nbsp;*</center>

Next up, I wanted to take a closer look at the data these servers were storing. The resulting SQLite file turned out to be 27GB in size, though a few things already struck me based on the names of databases and collections alone.

**Observation 1: a lot of instances have to with Bitcoin and other crypto currencies**

Many of these instances have been set up in order to host exchanges and other wallet services. Many of these seem to be test and developer instances, though I'm not sure whether I would trust most crypto platforms based on what we see here. Some extracts of data include (some data has been obscured or shortened):

A "deeptrader" database which seems to track markets:

<div class="wrap-normal"><pre>
{'_id': '█████', '00': {'bitcoin_percentage_of_market_cap': 53.62, 'total_volume_24h': 10684921135.0, 'total_market_cap': 209752812724.0, 'last_updated': 1540254090}, '01': {'total_volume_24h': 10767704448.0, 'last_updated': 1540257506, 'total_market_cap': 210013505099.0, 'bitcoin_percentage_of_market_cap': 53.6}, '02': {'last_updated': 1540261307, 'total_volume_24h': 10719337446.0, 'bitcoin_percentage_of_market_cap': 53.63, 'total_market_cap': 210006529467.0}, '03': {'bitcoin_percentage_of_market_cap': 53.63, 'total_market_cap': 209589968546.0, 'total_volume_24h': 10584794331.0, 'last_updated': 1540264951}, '04': {'last_updated': 1540268602, 'total_market_cap': 209256798148.0, 'total_volume_24h': 10508464102.0, 'bitcoin_percentage_of_market_cap': 53.61}, '05': {'bitcoin_percentage_of_market_cap': 53.61, █████}}
</pre></div>

A "backoffice" database handling invoices, some of which are paid with Bitcoin:

<div class="wrap-normal"><pre>
{'_id': ObjectId('5b8fd4da7e50d70010be2981'), 'amount': 300, 'transactionType': 'user-payout', 'paymentMode': None, 'status': 'cancel', 'invoiceID': None, 'miningCredits': 0, 'quantity': 1, 'discount': 0, 'initialAmount': 0, 'transactionNote': None, 'bitcoinAddress': None, 'currentPriceOfBTC': 0, '__type': 'CashTransactions', 'userID': ObjectId('5b8b7dac9e47d61e04ee37a9'), 'isCredit': False, 'date': datetime.datetime(2018, 9, 5, 13, 6, 34, 562000), '__v': 0}
</pre></div>

An "arbitrage" database tracking "opportunities":

<div class="wrap-normal"><pre>
{'_id': ObjectId('5bd47bc5bbd4c89f9ef456f9'), 'ask': 23699.99949, 'askexchange': 'mercadobitcoin', 'askfee': 0.007, 'asktotal': 23865.899486429997, 'askamount': 228.91979860187763, 'bid': 24084.11492186, 'bidexchange': 'bitrecife', 'bidfee': 0.003, 'bidtotal': 24011.86257709442, 'bidamount': 230.31986489048353, 'volume': 0.00959192, 'date': '27-10-2018'}
</pre></div>

**Observation 2: a lot of database have been swept clean and ransomed**

It's clear that various enterprising actors have already set up a bunch of scripts to scour the Internet for open MongoDB instances, back-up (hopefully) the data, delete it, and leave a ransom note:

"dbbak_service" seems to be the most enterprising one:

<div class="wrap-normal"><pre>
{'_id': ObjectId('5bce2d46b098707f4a74a89c'), 'BitCoin': '3CUGBF9QUStiLc2kCiArcE7kkmX93UFHBb', 'eMail': 'dbbak_service@protonmail.com', 'Exchange': 'https://localbitcoins.com/', 'Solution': 'Your Database is downloaded and backed up on our secured servers. To recover your lost data: Send 0.6 BTC to our BitCoin Address and Contact us by eMail with your server IP Address and a Proof of Payment. Any eMail without your server IP Address and a Proof of Payment together will be ignored.You are welcome!'}
</pre></div>

Most of these entries leave a single database with a name like "Warn" or "PLEASE_README". The following table shows an overview of such ransom-hacks:

```
5614 Warn
372	 README
340	 Warning
73	 PLEASE_READ
57	 PLEASE_READ_ME
46	 readme
17	 PLEASE_READ_ME_XYZ
11	 Aa1_Where_is_my_data
8	 PLEASE_README
3	 READ_ME_PLEASE
2	 PLEASEREAD
2	 WARNING
1	 a1_Where_is_my_data
1	 please
1	 warn
```

Some of these are rather polite:

```
{'_id': ObjectId('5c896be9bf4a8c26d431ab21'), 
 'you_should_not': 'use insecure settings'}
```

To see how much ransomers typically ask in order to recover data, I performed a regex to filter out BTC amounts:

![How much is your data worth?](/images/2019/mongo_bc.png)

0.6 BTC (about $3000) seems to be the standard amount. I also wanted to take a look at whether the addresses had already received money in the past. Using a regex found online (`[13][a-km-zA-HJ-NP-Z1-9]{25,34}`), I extracted 53 distinct addresses. Using blockchain.com, I simply scraped the number of total received coins for each address using `requests` and `Beautiful Soup`:

```python
for address in addresses:
    r = BeautifulSoup(requests.get('https://www.blockchain.com/btc/address/{}'.format(address)).text)
    el = r.find(attrs={'id': 'total_received'})
    if not el: continue
    received = el.get_text(strip=True)
    if received == '0 BTC': continue
    print(address, received)
```

Resulting in the following overview:

```
12EuPnzMDsqaYBFRwTYnx7TxMuztzdRXWh    0.02748446 BTC
1Kss6v4eSUgP4WrYtfYGZGDoRsf74M7CMr    0.68813072 BTC
1KoCEc5vz9M4ixDWQywXK8KkgRjshjm4AL    0.00007656 BTC
1Ptza47PgMtFMA6fZpLNzacb1EPkWDAv6n    0.6 BTC
3FAVraz3ovC1pz4frGRH6XXCuqPSWeh3UH    1.8 BTC
1ConGo1xRHCh3K6L1ywL4U1KHuC7XYQGqU    0.60313418 BTC
1LhvD5PJjU5ZLaRAPvXhtzCnfEU3JMaZqb    0.01 BTC
3CJVgqCcuMQUZmhXDM6Uva2YPYe6zTF8AK    0.0027859 BTC
3CUGBF9QUStiLc2kCiArcE7kkmX93UFHBb    0.06748042 BTC
1A5uzNqkBfTsw7fh2UnBTBbJBfeZW88qXp    0.2 BTC
1AwkbxDziATSXAbqkLhrqCSsqvGr3PHgjU    0.0501 BTC
1EPA6qXtthvmp5kU82q8zTNkFfvUknsShS    0.2011 BTC
1FwSLsSJPVrWEwX3aQiHr1JqdcQA12M3ro    0.1 BTC
1Nn2PSWGLPQ5Pyc1U18WRkPWcEYUZZBGL1    0.1 BTC
1tTg8o5zgrF8fqagYvXbU8DCbLdV8t2CD     0.03047012 BTC
3639hBBC8M7bwqWkj297Jc61pk9cUSKH5N    0.4 BTC
1NGKHKFdjdjH2GrMgq2qme3LwDSz9TRBi5    0.201 BTC
1PemEbnMSoiaXsEW5nRUpSMRB6RZw9MG8D    0.00354016 BTC
1J5ADzFv1gx3fsUPUY1AWktuJ6DF9P6hiF    11.30575012 BTC
14kGuPS3VqBPoULjXQyiRznGhq1KdH5Aqj    0.20220781 BTC
1McUEufSGeux9LPM2WbYoG91qLmf7mXRzw    0.2 BTC
1YxaDkx8zh9WrAUL5hf1gXyP7pFy1nicg     0.0895 BTC
3LQREaWvSyVq7E5UrTysadLqWtjHPhcAJX    0.6 BTC
1Jqw2tHBkUAGY32YzettJiDAwe8A9mUzok    0.2 BTC
3GKioTFrCFYcTmZR4DXPGatTXXp6Ugcq79    1.59995057 BTC
```

Note the [heavy hitter](https://www.blockchain.com/btc/address/1J5ADzFv1gx3fsUPUY1AWktuJ6DF9P6hiF) with 11 received Bitcoins, though it is likely that these did not result from ransom payments, as this address doesn't show up a lot in the MongoDB instances, unless this account has been at it for a while. The current balance of this account is zero. Most of the coins have been sent to other addresses (most of them looking like they're single use washers).

**Observation 3: there's a lot of personal information, as well as development around apps which plan to collect a lot of personal information**

Including addresses in databases with "wechat" in their name:

<div class="wrap-normal"><pre>
{'_id': ObjectId('5c7891b33451380fc8b6b4eb'), 'name': '█████', 'phone': '█████', 'area': '四川省成都市武侯区', 'address': '█████', 'isdefault': True, 'province': '四川省', 'city': '成都市', 'country': '武侯区', 'userId': ObjectId('5c7886e5881d260c56bac44f'), 'updateTime': 1551405491782.0, 'createTime': 1551405491782.0}
</pre></div>

There're also a lot of apps in here dealing with "entry and exit" tracking. China especially is keen on tracking users, students, employees and devices and their movements:

<div class="wrap-normal"><pre>
{'_id': ObjectId('5c405499a2b83b0b64516af1'), '_class': 'com.tianyi.collection.bean.EntryExitRecord', 'imgName': '20190117_cut_1547719833326.jpg', 'bucketName': 'face20190117', 'passTime': datetime.datetime(2019, 1, 11, 7, 47, 51), 'personId': 17, 'deviceNo': '012383-B6E2B8-1989EE', 'deviceName': '月中元', 'grade': '2017', 'organId': 3, 'name': '赵子元', 'typeId': 3, 'typeName': '其他', 'documentNumber': '511127197007110025', 'studentNumber': '█████', 'manufacturerId': 1, 'manufacturerName': '所有地区的根目录', 'nationId': 385, 'accessNumber': '888888', 'imgPath': 'house/20190112/118bd67e-38db-417c-91c0-6d5768fae86c.png', 'tel': '13567898798', 'sex': 1, 'address': '', 'personType': 1}
</pre></div>

Car parks:

<div class="wrap-normal"><pre>
{'_id': ObjectId('5c12392a1b94dd46369af039'), 'isActive': True, 'parkingName': 'NehruPlace', 'authorisedParking': 'SDMC', 'vehicleId': ObjectId('5c1207317f954f445d8f5ce3'), 'vehicleType': 'Car', 'ticketNumber': 10009001, 'keyHanded': 'No', 'parkDateTime': '2018-12-13T16:18:13.000Z', 'exitDateTime': '2018-12-13T16:19:13.000Z', 'duration': '00:01:00', 'amount': 50, 'attendantId': ObjectId('5b8ccda8d076ef1054308d23'), 'parkingNo': '2', 'parkingId': ObjectId('5b8ccc76d076ef1054308d22'), 'modifiedAt': datetime.datetime(2018, 12, 13, 10, 49, 14, 166000), 'createdAt': datetime.datetime(2018, 12, 13, 10, 49, 14, 166000), '__v': 0}
</pre></div>

Face scanners:

<div class="wrap-normal"><pre>
{'_id': ObjectId('5c404fafa2b83b0b64516aea'), '_class': 'com.tianyi.collection.bean.EntryExitRecord', 'imgName': '20190117_cut_1547718573711.jpg', 'bucketName': 'face20190117', 'passTime': datetime.datetime(2019, 1, 17, 9, 48, 59), 'deviceNo': '012383-B6E2B8-1989EE', 'deviceName': '测试设备'}
</pre></div>

Other databases deal with public health information:

<div class="wrap-normal"><pre>
{'_id': ObjectId('5a9911f6cf9bb7143800002b'), 'add_user': '5a9911f6cf9bb7143800002b', 'area': ['10000000|北京市|1|0', '11000000|天津市|1|0', '12000000|河北省|1|0', '13000000|山西省|1|0', '14000000|内蒙古自治区|1|0', '15000000|辽宁省|1|0', '16000000|吉林省|1|0', '17000000|黑龙江省|1|0', '18000000|上海市|1|0', '19000000|江苏省|1|0', '20000000|浙江省|1|0', '21000000|安徽省|1|0', '22000000|福建省|1|0', '23000000|江西省|1|0', '24000000|山东省|1|0', '25000000|河南省|1|0', '26000000|湖北省|1|0', '27000000|湖南省|1|0', '28000000|广东省|1|0', '29000000|广西壮族自治区|1|0', '30000000|海南省|1|0', '31000000|重庆市|1|0', '32000000|四川省|1|0', '33000000|贵州省|1|0', '34000000|云南省|1|0', '35000000|西藏自治区|1|0', '36000000|陕西省|1|0', '37000000|甘肃省|1|0', '38000000|青海省|1|0', '39000000|宁夏回族自治区|1|0', '40000000|新疆维吾尔自治区|1|0', '41000000|港澳地区|1|0'], 'create_time': '1519981046', 'email': '█████', 'mobile': '█████', 'name': '█████', 'password': '█████', 'role_id': '5a9d093ccf9bb71438000035', 'sex': '1', 'true_name': '█████', 'update_time': '1520322412'}
</pre></div>

Another app aims to upload household information, ethnic information, marriage status, occupation, drug usage and education level. It's fun to see that the developers are having some fun with their test entries, however. The below shows "Head of the Communist Party of China" as the occupation.

<div class="wrap-normal"><pre>
{'_id': ObjectId('5be298d5e4b00b487aae8f2c'), '_class': 'com.kingdom.digitalcity.esb.webservice.soap.gpsapplication.mongo.entity.OperationLogMongo', 'tableName': 'base_t_population_floating', 'logId': '5e5d857d66ebb98b0166ec21eb350031', 'userType': 1, 'userId': '8a9e86c063953a69016395e325240011', 'operateTime': datetime.datetime(2018, 11, 7, 7, 48, 36, 5000), 'className': 'com.kingdom.kdum.server.entities.base.population.Floating', 'operationType': 5, 'josnData': '{"certificationNum":"xgvhh125356","certificationType":"02","create_man":null,"create_time":"","db_status":1,"expireDate":"2018-11-30 00:00:00","id":"5e5d857d66ebb98b0166ec21eb350031","inflowReason":"04","isFocus":1,"modify_man":null,"modify_time":"","population":{"activities":[],"annexe_id":"","birthday":"1982-01-01 00:00:00","birthplace":"150603","birthplaceStr":"内蒙古自治区/鄂尔多斯市/康巴什区","cancel":0,"cancelMan":null,"cancelReason":"","cancelRemark":"","cancelTime":"","certificationCode":"","certificationCodeStr":"","certificationImages":[{"annex_context":[],"filename":"2.jpg","filetype":"jpg","id":"5e5d857c66ece8260166ed2478380015","imagePath":"","realFilePath":"http://202.100.179.66/xjcjbucket/20181107/5e5d857c66ece8260166ed2466e00013.jpg","uploadtime":"2018-11-07 15:48:02"}],"certificationNum":"","contactInfo":"18912345678","corrector":0,"create_man":null,"create_time":"","crowds":[],"db_status":0,"domicile":"150102","domicileDetail":"88886","domicileStr":"█████","drug":0,"education":"60","educationStr":"","ethnic":"10","ethnicStr":"","formerName":"█████","hiv":0,"id":"5e5d857d66ebb98b0166ec21eb350030","idCard":"230101198201010098","images":null,"label":"1, 2","labelStr":"","marriage":"90","marriageStr":"","metal":0,"modify_man":null,"modify_time":"","name":"1107流动","nationality":"","nationalityStr":"","observer":null,"occupation":"徐v干活哈哈","occupationType":"10100","occupationTypeStr":"中国共产党机关负责人","personImage":"","personalImages":[{"annex_context":[],"filename":"2.jpg","filetype":"jpg","id":"5e5d857c66ece8260166ed241b5e0012","imagePath":"","realFilePath":"http://202.100.179.66/xjcjbucket/20181107/5e5d857c66ece8260166ed241b120011.jpg","uploadtime":"2018-11-07 15:47:38"}],"politicalStatus":"05","politicalStatusStr":"","presentAddress":"█████","presentPlace":"652301","presentPlaceStr":"█████","rear":0,"released":0,"religion":"60","religionStr":"","remark":"","school":0,"servicePlace":"打广告好纠结","sex":"1","sexStr":"","teenagers":0,"type":2,"verify":2,"verifyMan":null,"verifyStr":"审核通过","verifySuggestion":"可以","verifyTime":"","wrb":0,"wrbStr":""},"registerDate":"2018-11-01 00:00:00","remark":"█████","residenceType":"05"}', 'dateStatus': 0, 'operateDataName': '█████'}
</pre></div>

**Observation 4: another extremely popular use case consists of news publishing and scraping**

Lots of data bases contain articles that either have been scraped from the web or are utilized in an according app:

<div class="wrap-normal"><pre>
{'_id': ObjectId('5bcea1348d27bca0b8a6edc4'), 'a_id': 6, 'a_c_id': 1, 'a_title': '《分获创业》第七届新疆青年创业创新大赛总决赛圆满', 'a_desc': '经过历时4个月的县市海选、地州初赛、创业计划书评审、导师选徒带徒、创客训练营、自治区复赛、半决赛、总决赛等环节，最终新疆赛区选拔赛总决赛的12个创业创新中，“现代农业供应链管理”项目一等奖，获得创业奖金100000元', 'a_key': '青年,项目,分获创业', 'a_author': 'admin', 'a_source': '政府网', 'a_source_url': '', 'a_imgSmall': None, 'a_content': '█████', 'a_view_num': 6, 'a_state': 1, 'a_time': '2018-10-23 12:19:00', 'a_diy': 0}
</pre></div>

Russian:

<div class="wrap-normal"><pre>
{'_id': ObjectId('5926b9fc43213012ca02af85'), 'date': datetime.datetime(2017, 5, 25, 0, 0), 'title': {'uk': 'Вільний від автомобілів', 'en': 'Without cars'}, 'preview_text': {'uk': 'У Районі Manhattan затишний вільний від авто двір! Для транспорту передбачено окремий багаторівневий паркінг.', 'en': 'Manhattan is safe and comfortable place without cars. A separate multi-level parking is located here.'}, 'body': {'uk': '<p>Бажаєте купити квартиру в сучасному районі &quot;Manhattan&quot;, тоді телефонуйте (097) 0714-000, ми чекаємо на Ваш дзвінок!</p>\r\n', 'en': '<p>Want to buy an apartment in the modern district of Manhattan, then call (097) 0714-000, we are waiting for your call!</p>\r\n'}, 'preview_image': '4.jpg', 'updated_at': datetime.datetime(2017, 7, 5, 18, 44, 42, 133000), 'created_at': datetime.datetime(2017, 5, 25, 11, 3, 24, 72000), 'news_photos': [{'_id': ObjectId('5926b9fc43213012ca02af84'), 'photo': '4.jpg'}]}
</pre></div>

And English:

<div class="wrap-normal"><pre>
{'_id': ObjectId('5bdfd67b36960a2a26de8d6f'), 'id': '2111bba36dea0ea565ce9f9c320b2fe2dc5909f1', 'title': 'Walmart’s test store for new technology, Sam’s Club Now, opens next week in Dallas – TechCrunch', 'url': 'https://techcrunch.com/2018/10/28/walmarts-test-store-for-new-technology-sams-club-now-opens-next-week-in-dallas/', 'date': '2018-10-29T02:00:00.000+02:00', 'text': 'Sarah Perez @sarahintampa / 4 days Walmart’s warehouse club, Sam’s Club is preparing to open the doors at a new Dallas area store that will serve as a testbed for the latest in retail technology. Specifically, the retailer will test out new concepts like mobile checkout, an █████.', 'location': 'US', 'sector': ['CPR'], 'tech': ['ai'], 'mega': ['hlt_rim', 'ind_red'], 'focus': ['CPR::Retail', 'CPR::Apparel and Footwear', 'PNU::Retail', 'HLT::Growth Strategy and Integration'], 'sectorkeywords': ['Retail::Human Augmentation', 'Retail::Human Augmentation', 'Retail::Non-Traditional Entrants', █████], 'megakeywords': ['Food by design ::Preventive Health', 'Industry redefined ::Human Augmentation', 'Health reimagined ::Wicked health problems', 'Health reimagined ::Digital platforms', 'Future of work ::Human Augmentation', 'Super consumer ::Human Augmentation', 'Super consumer ::Non-Traditional Entrants'], 'people': ['sarah perez', 'sam'], 'company': ['walmart', 'club now', 'sam’s club now'], 'sentiment': 0.0872590465090465, 'titlesentiment': 0.06818181818181818, 'contentsentiment': 0.10633627483627484, 'vector': [█████]}
</pre></div>

**Some other fragments**

I'm going to close this post with a number of hand-picked data records.

This one keeps track of coach bus drivers:

<div class="wrap-normal"><pre>
{'_id': '486:0:1546189918000', 'vehicle_id': 486, 'comm_no': '013180015945', 'driver_certificate': '610600396490', 'driver_id': 0, 'driver_img': '█████', 'driver_name': '█████', 'identity': '█████', 'is_sync': 0, 'on_duty': True, 'qualification': '█████', 'source_card_type': 0, 'terminal_id': 486, 'terminal_type': 800, 'time': datetime.datetime(2018, 12, 30, 17, 11, 58), 'vehicle_no': '█████'}
</pre></div>

There're a lot of records dealing with sensor data:

<div class="wrap-normal"><pre>
{'_id': ObjectId('5bce40619146ba4e3b584804'), 'sensorId': '1f9342', 'sensorType': 0, 'mcuId': 2, 'ts': 1540241372296, 'gatewayId': 'xMain', 'rssi': -51, 'emergency': 0, 'humidity': 36.70000076293945, 'temp': 27.200000762939453, 'externalValue': 0, 'gyro': {'ax': 0.0, 'ay': 2.0, 'az': 98.0, 'gx': 2.0, 'gy': -20.0, 'gz': -20.0}, 'ax': 0.0, 'ay': 2.0, 'az': 98.0, 'gx': 2.0, 'gy': -20.0, 'gz': -20.0, 'avgIntervalTime': 725591.5, 'intervalTime': 619177, 'maxIntervalTime': 226807200, '_class': 'net.xenix.iot.sensor.stream.model.SensorLogData'}
</pre></div>

<div class="wrap-normal"><pre>
{'_id': ObjectId('5c512f178076a41c2430aef5'), 'sensorID': 26855, 'lokasi': 'PUSKESMAS AIR BELITI', 'sla_itb': 99.83, 'sla_prtg': 83.0, 'provinsi': 'Sumatera Selatan', 'kabkot': 'Musi Rawas', 'bulan': 9}
</pre></div>

There's data about job postings:

<div class="wrap-normal"><pre>
{'_id': ObjectId('5c7504f8d829dc4dafde5a2a'), 'companyName': '█████', 'jobTitle': 'Software Tester Trainee', 'jobBrief': 'Thi is profile for trainee software tester. Candidate should have experience in between 0 - 6 months. Educational qualification for this job is BE (IT/CSE) , MCA, MCS, BCA, BCS', 'jobType': 1, 'jobLocation': 'Pune', 'salary': 7100, 'salaryCycle': 2, 'salaryNegotiable': True, 'minEducation': 'Bachelors Degree ', 'experience': '1', 'skills': 'Software Testing, Manual Testing, Bug Life Cycle, JIRA, Test Cases , Test Scenarios', 'jobShift': 1, 'jobDescription': '1) Candidate should know about SDLC / STLC briefly. \n2) Candidate should know about Software Testing and its Bug Life Cycle \n3) Candidate can write Test Case and Test Scenarios \n4) Candidate at-least Certified from any Institute .', 'contract': 1, 'createdBy': ObjectId('5c750214d829dc4dafde5a27'), 'updatedAt': datetime.datetime(2019, 2, 26, 13, 52, 51, 50000), 'createdAt': datetime.datetime(2019, 2, 26, 9, 20, 56, 985000), '__v': 0}
</pre></div>

There are interaction statements with chat bots:

<div class="wrap-normal"><pre>
{'_id': ObjectId('5c74f496231da05d908e0039'), 'CompanyId': 'gogyb450', 'Question': 'how to add attorney', 'CompanyName': 'gogyb', 'Intent': 'add_attorney', 'Response': 'Data Entry -> Click on Attorney Master from Data Entry Menu-> Fill all the necessary   details and Click on Add', 'Source': 'Web'}
</pre></div>

As well as chat messages:

<div class="wrap-normal"><pre>
{'_id': ObjectId('5c718f6ef64d1f14898b58a6'), 'lastMessage': False, 'date': '2019-02-23', 'hour': '13:22', 'status': True, 'img': '', 'url': '', 'message': 'necesito información del vehiculo', 'from': 10, 'to': 9, 'idAd': None, '__v': 0}
</pre></div>

As well as apps for people looking for love:

<div class="wrap-normal"><pre>
{'_id': ObjectId('58f0cdfbbb80d06e7b90ef7e'), 'updatedAt': datetime.datetime(2017, 6, 9, 11, 37, 35, 234000), 'createdAt': datetime.datetime(2017, 4, 14, 13, 26, 19, 545000), 'email': '█████@hotmail.com', 'password': '█████', 'created': None, 'device_token': 'dZABYOuYL6o:APA91bFwtmqXm1RX7j2_FmK9ghPqEWzRsyMEhaNAqL-I6AXLbU5r6tTNbrtL72hRYpDS32BJX_sO80OgIei06UyRdN_UIuqCY2jmPNR-IawjuK2LpAm-NOCgqi_14vBZj8Fo2WZZqM6E', 'user_agent': {'ua': 'Mozilla/5.0 (Linux; Android 5.0.1; Lenovo TB3-710F Build/LRX21M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/45.0.2454.95 Safari/537.36', 'browser': {'name': 'Chrome WebView', 'version': '45.0.2454.95', 'major': '45'}, 'engine': {'version': '537.36', 'name': 'WebKit'}, 'os': {'name': 'Android', 'version': '5.0.1'}, 'device': {'model': 'TB3-710F', 'vendor': 'Lenovo', 'type': 'mobile'}, 'cpu': {'architecture': None}}, 'longitude': 151.0921365, 'latitude': -34.0135686, 'city': 'Sydney', 'country': 'Australia', 'role': 'user', 'activation_code': None, 'account_active': 'yes', 'google_pic': None, 'facebook_pic': None, 'profile_pic': '█████', 'google_id': None, 'facebook_id': None, 'mobile': None, 'email_verify': 'yes', 'last_login': datetime.datetime(2017, 6, 9, 11, 37, 35, 230000), 'dob': datetime.datetime(1988, 1, 15, 0, 0), 'quick_blox_pass': '█████', '_quickblox': 27493899, 'name': '█████', 'about': 'Looking for love !', 'gender': 'female', 'nationality': 'Australian', '__v': 0}
</pre></div>

A whole address book with contacts (hundreds of them):

<div class="wrap-normal"><pre>
{'_id': ObjectId('5be156106a496e6b73b530af'), 'contacts': [{'country': '91', 'phone': '█████'}, {'country': '91', 'phone': '█████'}, █████], 'devices': [{'_id': ObjectId('5be156106a496e6b73b530b0'), 'session': '', 'platform': 'android', 'name': 'ONEPLUS A3003', 'udid': 'a5189e9d8e5851a6', 'online': 0, 'push_token': 'dFSrE8iisCE:APA91bEZhW9TjjWENSlYVZc51AQ3DAFMLdc1ojzA2B4vdnKSv2Vr1OwYX6WWvEgjwDG7xPE5pBpi2EtoT0KwvO--EGFMcacxhXk5VB-ztLhYukautjMzSWzthllXiIX3TICwMwcVxlRn', 'create_time': datetime.datetime(2018, 11, 6, 8, 51, 28, 806000)}], 'name': '█████', 'quote': '', 'country': '91', 'phone': '█████', 'email': '█████', 'password': '', 'avatar': 'http://173.249.31.73/NextGenStream/files/919900003957-142126.jpg', '__v': 9}
</pre></div>

**Image data**

Another interesting analysis to perform is to inspect records to see if they contain base64 encoded data starting with `data:image` and dump them out.

A lot of images contain QR and bar codes:

![](/images/2019/mongo_qr.png)

Others contain medical product images:

![](/images/2019/mongo_prod.png)

Receipts and signatures:

![](/images/2019/mongo_sign.png)

And a lot of them contain faces and more intimate photos (not shown here).

<center>*<br>*&nbsp;&nbsp;&nbsp;*</center>

Wrapping up, answering our original question, it is surprising to see how much data is still up for grabs in unsecured MongoDB instances. This does not even include non-standard ports, and even other types of databases which could also be open and exposed.

Also scary is how easy it is these days to theoretically set up a monitoring service which crawls the Internet (or uses Shodan, why not) in search of open data bases and just transfers all data to its own storage, where it can then be further mined for telephone numbers, addresses, names, e-mails, and personal data.

