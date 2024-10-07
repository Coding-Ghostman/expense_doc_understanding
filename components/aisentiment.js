'use strict';

const aiLanguage = require("oci-ailanguage");
const common = require("oci-common");
const send = require("../lib/sendemailOCI");


module.exports = {
  metadata: () => ({
    name: 'aisentiment',
    properties: {
      text: { required: true, type: 'string' },
    },
    supportedActions: ['positive', 'negative','error','nosentiment']
  }),
  invoke: async (context) => {

    var text01 = context.properties().text;
    let neg = 0;
    let pos = 0;
   
 

      try {

        console.log("Before provider...");
      
        const provider = await common.ResourcePrincipalAuthenticationDetailsProvider.builder();
        console.log("Ansh Provider Details");
        //console.log(provider);
       // const provider = await new common.InstancePrincipalsAuthenticationDetailsProviderBuilder().build();
        /* const configurationFilePath = "C:/Users/DANIMMAR/Documents/.oci/config";
        const configProfile = "DEFAULT";
        const  opcRequestId = "ZSDZFYMMEQIJ2HXWVI7retsergsrf";
        const provider = new common.ConfigFileAuthenticationDetailsProvider(
        configurationFilePath
   );  */
        const client = new aiLanguage.AIServiceLanguageClient({
          authenticationDetailsProvider: provider
        });

    
        console.log("Ansh Client details");
       // console.log(client);
    
          // Set Client Region
          //client.region = provider.getRegion();
    
          // Set the text to detect sentiment for.
          //console.log(text01);
          const detectLanguageSentimentsDetails = {
            text: text01
          };
    
          // Build detectSentimentRequest object
         
          const detectLanguageSentimentsRequest= {
            detectLanguageSentimentsDetails: detectLanguageSentimentsDetails,
            opcRequestId: "BJIFGR205465687dasd"
          };
    
          // Send request to the Client and get response
          console.log("Ansh before request...");
          const detectLanguageSentimentsResponse = await client.detectLanguageSentiments(
            detectLanguageSentimentsRequest
          );

          console.log("Ansh After request...");

          // If there is a response, then extract all "aspects" and return results
          if(detectLanguageSentimentsResponse && detectLanguageSentimentsResponse.detectLanguageSentimentsResult && detectLanguageSentimentsResponse.detectLanguageSentimentsResult.aspects && detectLanguageSentimentsResponse.detectLanguageSentimentsResult.aspects.length > 0){
            console.log(detectLanguageSentimentsResponse.detectLanguageSentimentsResult.aspects.length)
console.log("Ansh Values are --------------->");
            console.log(detectLanguageSentimentsResponse.detectLanguageSentimentsResult);          

  console.log("Ansh aspects are ");
            console.log(detectLanguageSentimentsResponse.detectLanguageSentimentsResult.aspects);
            for (let step = 0; step < detectLanguageSentimentsResponse.detectLanguageSentimentsResult.aspects.length; step++) {
              var outText = JSON.stringify(detectLanguageSentimentsResponse.detectLanguageSentimentsResult.aspects[step].text);
              var outSentiment = JSON.stringify(detectLanguageSentimentsResponse.detectLanguageSentimentsResult.aspects[step].sentiment);
              context.reply("The sentiment for text: "+outText+" is "+outSentiment)
              console.log("response")
              
              if(outSentiment == '"Negative"'){
                neg++;
                
              }
              else if (outSentiment == '"Positive"'){
                pos++;
              } 
      
            }

          }

            //DECIDE ON THE TRANSITION
            if (neg > pos){   
              console.log("neg")         
              context.keepTurn(true);   
             
              context.transition("negative");    
              
            }
  
            else if (pos > neg){    
              console.log("pos")         
              context.keepTurn(true);
              
              context.transition("positive");
              
            }          
         
            
      
            // If result is empty, return an empty array
          else if(pos == 0 && neg == 0){
            context.reply("No Sentiment detected for the input text.");
            
            context.keepTurn(true);
            context.transition("nosentiment");   
            
          }
            
        
          } catch (error) {
console.log("Ansh Error "+error);          
let responseError = error;
          if(!responseError.code){
            responseError = {code: error.statusCode? error.statusCode: 500, error: error.message};
          }
          const errorMessage = "Error detecting sentiment.";
          context.reply(errorMessage);
          context.keepTurn(true);
          context.transition("error");
          //context.log("before done");

       
          
          throw responseError;
    
        }
      
      
    },
    
  }





