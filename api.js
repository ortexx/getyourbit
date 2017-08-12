const request = require('request');

class Api {
  constructor(url) {
    this.url = url.replace(/[\/]+$/, '');
    this.token = null;
  }

  _request(options) {
    return new Promise((resolve, reject) => {
      request(options, (err, response, body) => {
        try {
          this.hasError(err, response, body);
        }
        catch(err) {
          return reject(err);
        }

        resolve(body);
      });
    });  
  }

  auth(user, password, options = {}) {
    options.url = this.url + '/auth/';
    options.method = 'POST';
    options.json = true;
    options.auth = {
        user: user,
        pass: password
    };
    
    return this._request(options).then((body) => {
      this.token = body.token;
    });     
  }

  request(url, data = {}, options = {}) {
    options.json = data || {};
    options.url = this.url + '/' + url.replace(/^[\/]+/, '');
    options.json.token = this.token;
    options.method = 'POST';

    return this._request(options);
  }

  scroll(url, data, options, fn) {
    if(typeof options == 'function') {
      fn = options;
      options = {};
    }

    if(typeof data == 'function') {
      fn = data;
      data = {};
      options = {};
    }

    if(!options) {
      options = {};
    }

    let res = [];

    const next = (scroll) => {
      if(scroll) {
        options.json.scroll = scroll;
      }

      return this.request(url, data, options).then((body) => {
        res = res.concat(body.data); 
        fn && fn(body, body.data, res);       

        if(body.scroll) { 
          return next(body.scroll); 
        }    
          
        return res;
      });
    };

    return next(null);
  }

  logout(options = {}) {    
    if(!this.token) {
      throw new Error('You have to login before to logout');
    }

    options.url = this.url + '/logout/';
    options.method = 'POST';
    options.json = { token: this.token };
    this.token = null;

    return this._request(options);
  }

  hasError(err, res, body) {
    if(err) {
      throw err;
    }
    else if(res.statusCode != 200) {
      let message = body.message || 'Response status code is not 200';    

      body.meta && (message += ' ' + JSON.stringify(body.meta));
      throw new Error(message);
    }
  }
}

module.exports = Api;