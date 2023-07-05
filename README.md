# A broadcast client

## Require

[IMessage-Server](https://github.com/gouyuwang/imessage-server)

## Build

```shell
npm run build
```
 
## Use
 
```html
<script src="dist/imessager.js" type="text/javascript" crossorigin="anonymous"></script>
<script> 
    (new IMessenger('http://localhost:3000'))// Connect to imessage master host
        .on('connect', () => {
            console.log( 'connect' )
        })
        .on('disconnect', () => {
            console.log('disconnect')
        })
        .subscribe('default')
            .on('message', data => {
                    console.log(JSON.stringify(data))
            })
</script>

```

or

```javascript
const Client  = require('./lib/client');
(new Client('http://localhost:3000'))// Connect to imessage master host
    .on('connect', () => {
      console.log( 'connect' )
    })
    .on('disconnect', () => {
      console.log('disconnect')
    })
    .subscribe('default')
        .on('message', data => {
          console.log(JSON.stringify(data))
        });
```
