'use strict';

const aiLanguage = require("oci-ailanguage");
const common = require("oci-common");

module.exports = {
  metadata: () => ({
    name: 'aidetect',
    properties: {
      text: { required: true, type: 'string' },
    },
    supportedActions: ['ok','error']
  }),
  invoke: async (context) => {
    var text01 = context.properties().text;  
  
    try {  
      
  /*     const configurationFilePath = "C:/Users/DANIMMAR/Documents/.oci/config";
     const configProfile = "DEFAULT";
     const  opcRequestId = "ZSDZFYMMEQIJ2HXWVI7retsergsrf";
     const provider = new common.ConfigFileAuthenticationDetailsProvider(
     configurationFilePath
);  */
    const provider = await common.ResourcePrincipalAuthenticationDetailsProvider.builder();
    
    const client = new aiLanguage.AIServiceLanguageClient({
    authenticationDetailsProvider: provider
  });
          
      const detectDominantLanguageDetails = {
      text: text01
    };
    
      const detectDominantLanguageRequest = {
      detectDominantLanguageDetails: detectDominantLanguageDetails,
      opcRequestId: "BJIFGR205465687dasd"
    }
    const detectDominantLanguageResponse = await client.detectDominantLanguage(
      detectDominantLanguageRequest
      );
      
       var outText = JSON.stringify(detectDominantLanguageResponse.detectDominantLanguageResult.languages[0].name);
       
          // If result is empty, return an empty array        
          context.reply("I see that you are writing in "+outText.replace(/['"]+/g, '')+". At this moment I am only capable of understanding English. Can we please start again :)");
          context.keepTurn(true);
          context.transition("ok");          
       
      
        } catch (error) {
          let responseError = error;
          if(!responseError.code){
            responseError = {code: error.statusCode? error.statusCode: 500, error: error.message};
          }
          const errorMessage = "The text field distinct word count should be minimum 10";
          context.reply(errorMessage);
          context.keepTurn(true);
          context.transition("error");          
          throw responseError;
    
        }
      
      
    },
    
  }





