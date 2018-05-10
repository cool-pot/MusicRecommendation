var getParameterByName = function(name, url) {

    if (!url) url = window.location.href;

   name = name.replace(/[\[\]]/g, "\\$&");

    console.log(name);

    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),

        results = regex.exec(url);

        console.log(results);

    if (!results) return null;

    if (!results[2]) return '';

    console.log(results[2]);

    return decodeURIComponent(results[2].replace(/\+/g, " "));

};

var exchangeAuthCodeForCredentials = function({

    auth_code, client_id, identity_pool_id, aws_region, user_pool_id, cognito_domain_url, redirect_uri

}) {

    return new Promise((resolve, reject) => {

        var settings = {

            url: `${cognito_domain_url}/oauth2/token`,

            method: 'POST',

            headers: {

                'Content-Type': 'application/x-www-form-urlencoded'

            },

            data: {

                grant_type: 'authorization_code',

                client_id: client_id,

                redirect_uri: redirect_uri,

                code: auth_code

            }

        };

 

        $.ajax(settings).done(function (response) {

            console.log('oauth2 token call responded');

 

            if (response.id_token) {

                // Add the User's Id Token to the Cognito credentials login map.


                AWS.config.region = 'us-east-2'; // Region
				AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    				IdentityPoolId: 'us-east-2:6d975911-f270-4f0f-8e2f-96c7cf1009dc',
				});



                AWS.config.credentials = new AWS.CognitoIdentityCredentials({

                    IdentityPoolId : identity_pool_id,

                    Logins : {

                        [`cognito-idp.${aws_region}.amazonaws.com/${user_pool_id}`]: response.id_token

                    }

                });

 

                AWS.config.credentials.refresh((error) => {

                    if (error) {

                        reject(error);

                    } else {

                        console.log('successfully logged in');


                        resolve(AWS.config.credentials);

                    }

                });

            } else {

                reject(response);

            }

        });

    });

};

var auth_code = getParameterByName("code")

var IAMRequestJson = {
	"auth_code": auth_code, 
	"client_id": "423f5hbn3bgaig3chn78uo5lbf", 
	"identity_pool_id": "us-east-2:6d975911-f270-4f0f-8e2f-96c7cf1009dc", 
	"aws_region": "us-east-2", 
	"user_pool_id": "us-east-2_7r2MyGBAc", 
	"cognito_domain_url": "https://xs857chatbot.auth.us-east-2.amazoncognito.com", 
	"redirect_uri": "https://s3.amazonaws.com/musiclogin/sample.html"
}

exchangeAuthCodeForCredentials(IAMRequestJson).then((credential)=>{
	    apigClient = apigClientFactory.newClient({
		accessKey: credential.data.Credentials.AccessKeyId,
		secretKey: credential.data.Credentials.SecretKey,
		sessionToken: credential.data.Credentials.SessionToken,
		region: "us-east-2"
	});
})




