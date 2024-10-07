'use strict';

const aiLanguage = require("oci-ailanguage");
const common = require("oci-common");
const send = require("../lib/sendemailOCI");

module.exports = {
  metadata: () => ({
    name: 'aikeyphrases',
    properties: {
      text: { required: true, type: 'string' },
    },
    supportedActions: ['ok', 'nok','error']
  }),
  invoke: async (context) => {

    var text01 = context.properties().text;
    var words = ['account','password','login','Login','locked','expired','pwd','pass','Account','laptop','internet','wifi','mouse','monitor'];
    var route01 = [];

    
    try {
    
      const provider = await common.ResourcePrincipalAuthenticationDetailsProvider.builder();
/*       const configurationFilePath = "C:/Users/DANIMMAR/Documents/.oci/config";
      const configProfile = "DEFAULT";
      const  opcRequestId = "ZSDZFYMMEQIJ2HXWVI7retsergsrf";
      const provider = new common.ConfigFileAuthenticationDetailsProvider(
      configurationFilePath
 );  */
  
        const client = new aiLanguage.AIServiceLanguageClient({
            authenticationDetailsProvider: provider
          });
    
  
  
      // Send request to the Client.
      const detectLanguageKeyPhrasesDetails = {
        text: text01
      };
  
      const detectLanguageKeyPhrasesRequest = {
        detectLanguageKeyPhrasesDetails: detectLanguageKeyPhrasesDetails,
        opcRequestId: "3ZSFEMJAN75ZIQSEXTGS<unique_ID>"
      };
  
      // Send request to the Client.
      const detectLanguageKeyPhrasesResponse = await client.detectLanguageKeyPhrases(
        detectLanguageKeyPhrasesRequest
      );
  
      if(detectLanguageKeyPhrasesResponse && detectLanguageKeyPhrasesResponse.detectLanguageKeyPhrasesResult && detectLanguageKeyPhrasesResponse.detectLanguageKeyPhrasesResult.keyPhrases && detectLanguageKeyPhrasesResponse.detectLanguageKeyPhrasesResult.keyPhrases.length > 0){
    
      
        //console.log(detectLanguageTextClassificationResponse.detectLanguageTextClassificationResult)
        for (let step = 0; step < detectLanguageKeyPhrasesResponse.detectLanguageKeyPhrasesResult.keyPhrases.length; step++) {
            var outText = JSON.stringify(detectLanguageKeyPhrasesResponse.detectLanguageKeyPhrasesResult.keyPhrases[step].text);
            outText = outText.replace(/['"]+/g, '')
            for (var i = 0; i < words.length; i++) {
              if (words[i] == outText) {
                  route01[i]= outText
                  //console.log(i)                
              } 
            
            }
            console.log("KeyWord "+step+" :"+outText)
            context.reply("KeyWord "+step+" :"+outText)
        }    
      }
      
      if(route01.length < 1){
        console.log("this goes to HR")
        send.enviaremail("noreply@notification.eu-frankfurt-1.oci.oraclecloud.com","danielmteixeira@gmail.com","Default mail Routing ","This is a message to the HR Helpdesk :"+text01); 
        context.reply("HR Helpdesk is the default recipient for tickets: "+route01+" \n");
      } else {
        console.log("this goes to IT")
        send.enviaremail("noreply@notification.eu-frankfurt-1.oci.oraclecloud.com","danielmteixeira@gmail.com","Email Routing Based on Key Words: "+route01,"This is a message to the IT Helpdesk :"+text01); 
        context.reply("From the content of the message we will route this to IT Helpdesk: "+route01+" \n");

      }
      
          
          context.keepTurn(true);
          context.transition("ok");

  
    } catch (error) {
          let responseError = error;
          if(!responseError.code){
            responseError = {code: error.statusCode? error.statusCode: 500, error: error.message};
          }
          
          context.reply(responseError);
          context.keepTurn(true);
          context.transition("error");
          console.log("before done");

         
    
        }
      
      
    } 
  }





