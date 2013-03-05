
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.authenticate = function(req, res){
  req.oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
    if (error) {
      console.log(error);
      res.send("yeah no. didn't work.")
    }
    else {
      req.session.oauth = {};
      req.session.oauth.token = oauth_token;
      console.log('oauth.token: ' + req.session.oauth.token);
      req.session.oauth.token_secret = oauth_token_secret;
      console.log('oauth.token_secret: ' + req.session.oauth.token_secret);
      res.redirect('https://twitter.com/oauth/authenticate?oauth_token='+oauth_token)
    }
  });
};

exports.callback = function(req, res, next){
  if (req.session.oauth) {
    req.session.oauth.verifier = req.query.oauth_verifier;
    var oauth = req.session.oauth;

    req.oa.getOAuthAccessToken(oauth.token,oauth.token_secret,oauth.verifier, 
      function(error, oauth_access_token, oauth_access_token_secret, results){
        if (error){
          console.log(error);
          res.send("yeah something broke.");
        } else {
          req.session.oauth.access_token = oauth_access_token;
          req.session.oauth,access_token_secret = oauth_access_token_secret;
          console.log(results);
          res.send("worked. nice one.");
        }
      }
    );
  } 
  else
    next(new Error("you're not supposed to be here."))
};
