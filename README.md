# stub-server

## GETTING START
### You can wake up stub server on doker.
```
$ cd docker/stub-server
$ docker-compose up -d
```
then... api service start @ port:3030

### Please try to connect. 
```
$ curl -i -X GET 'http://localhost:3030/sampleapi?key=12345'
```
or 
```
$ curl -i -X POST -H "Content-Type:application/json" -d '{"key": 12345}' 'http://localhost:3000/sampleapi'
```
response
```
{
  "page": 1,
  "total": 5,
  "lastPage": 3,
  "result": [
    {
      "text": "data1"
    },
    {
      "text": "data12"
    }
  ]
}
```

## docker
### run
```
$ docker-compose up -d
```
### When you no longer need it.
```
$ docker-compose down -v
```

## Program of stub server
`stub/src/mocky.js`

## programing for stub server
```
$ cd stub
$ npm start
```
then... api service start @ port:3000

Please modify as you like. `stub/src/mocky.js`
