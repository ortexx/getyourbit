# [GetYourBit.com](https://getyourbit.com) client 

This library allows you to make requests easily.

## Examples

```js
const GetYouBit = require('getyourbit');
const api = new GetYouBit.Api('https://ip.getyourbit.com');

api.auth('login', 'password').then(() => {
  return api.request('/lookup/8.8.8.8/');
})
.then((body) => {
  return api.request('/me/', {locale: 'en-US'}).then((body) => {
    console.log(body.data);
  });
})
.then((res) => {
  return api.scroll('/find/', {
    size: 500,
    query: {
      country: 'nepal'
    }
  }, (body, chunkData, fullData) => {
    console.log(chunkData.length);
  });
})
.then((fullData) => {
  console.log(fullData.length);
  return api.logout();
})
.catch((err) => {
  console.error(err);
});
```

## Api
### .auth(login, password, options={})
Login to the API. You can get __login__ and __password__ [on the site](https://getyourbit.com) after a subscription.  
__options__ is [request](https://github.com/request/request) module options.  
Free services don't require authorization.
### .logout()
Logout from the API. It gives an error without authorization before.
### .request(url, data={}, options={})
### .request(url, options={ data: {} })
Request to the API without scrolling to get data.  
It returns all response body as object.
### .scroll(url, data={}, options={}, callback=null)
### .scroll(url, data={}, callback=null)
### .scroll(url, callback=null)
Request to the API with scrolling to get data. You can pass callback to control every chunk. You will get three arguments:

* __body__ - chunk response body
* __chunkData__ - chunk data
* __fullData__ - full data by the current chunk  

It returns the full data at the end


 
