'use strict';

const aiLanguage = require('oci-ailanguage');
const common = require('oci-common');
const send = require('../lib/sendemailOCI');
const aivision = require('oci-aivision');
//const axios = require('axios');

module.exports = {
	metadata: () => ({
		name: 'aidocument',
		properties: {
			text: { required: true, type: 'string' },
			output: { required: false, type: 'string' },
		},
		supportedActions: ['positive', 'negative', 'error', 'nosentiment'],
	}),
	invoke: async (context) => {
		var text01 = context.properties().text;
		var output = context.properties().output;
		let neg = 0;
		let pos = 0;
		//let image = await axios.get(text01, {responseType: 'arraybuffer'});
		//    let returnedB64 = Buffer.from(image.data).toString('base64');
		console.log('Ansh Text is --->');
		console.log(text01);

		try {
			console.log('Before provider...');

			const provider =
				await common.ResourcePrincipalAuthenticationDetailsProvider.builder();

			// const provider = await new common.InstancePrincipalsAuthenticationDetailsProviderBuilder().build();
			/* const configurationFilePath = "C:/Users/DANIMMAR/Documents/.oci/config";
        const configProfile = "DEFAULT";
        const  opcRequestId = "ZSDZFYMMEQIJ2HXWVI7retsergsrf";
        const provider = new common.ConfigFileAuthenticationDetailsProvider(
        configurationFilePath
   );  */

			const client = new aivision.AIServiceVisionClient({
				authenticationDetailsProvider: provider,
			});

			// Set Client Region
			//client.region = provider.getRegion();

			// Build analyzeDocumentRequest object

			const analyzeDocumentDetails = {
				features: [
					{
						featureType: 'KEY_VALUE_DETECTION',
					},
				],
				document: {
					source: 'INLINE',
					data: text01,
				},
				documentType: aivision.models.DocumentType.Receipt,
				compartmentId:
					'ocid1.tenancy.oc1..aaaaaaaahqvb2kliqi35z57qalhpr4dyqbjprclszdcoar2wgc7q6nl36aba',
			};

			const analyzeDocumentRequest = {
				analyzeDocumentDetails: analyzeDocumentDetails,
				// opcRequestId: 'BJIFGR205465687dasd',
			};

			// Send request to the Client and get response
			console.log('before request...');

			const analyzeDocumentResponse = await client.analyzeDocument(
				analyzeDocumentRequest
			);

			console.log('After request...');

			console.log('Ansh the result is------>');
			console.log(analyzeDocumentResponse);
			console.log('Ansh checking length');
			console.log(analyzeDocumentResponse.analyzeDocumentResult.pages);
			console.log('Ansh checking values');
			//console.log(analyzeDocumentResponse.analyzeDocumentResult.pages[0].documentFields.length);
			if (
				analyzeDocumentResponse &&
				analyzeDocumentResponse.analyzeDocumentResult.pages[0].documentFields &&
				analyzeDocumentResponse.analyzeDocumentResult.pages[0].documentFields
					.length > 0
			) {
				console.log('Ansh length is->');
				console.log(
					analyzeDocumentResponse.analyzeDocumentResult.pages[0].documentFields
						.length
				);
				var array = [];
				for (
					let step = 0;
					step <
					analyzeDocumentResponse.analyzeDocumentResult.pages[0].documentFields
						.length;
					step++
				) {
					var obj = {};
					console.log('Ansh Value Check-------------------->');
					console.log(
						JSON.stringify(
							analyzeDocumentResponse.analyzeDocumentResult.pages[0]
								.documentFields[step].fieldLabel.name
						) +
							':' +
							JSON.stringify(
								analyzeDocumentResponse.analyzeDocumentResult.pages[0]
									.documentFields[step].fieldValue.value
							)
					);

					//obj.fieldLabel = JSON.stringify(analyzeDocumentResponse.analyzeDocumentResult.pages[0].documentFields[step].fieldLabel.name);
					//obj.fieldValue = JSON.stringify(analyzeDocumentResponse.analyzeDocumentResult.pages[0].documentFields[step].fieldValue.value);

					//obj.assign(JSON.stringify(analyzeDocumentResponse.analyzeDocumentResult.pages[0].documentFields[step].fieldLabel.name),JSON.stringify(analyzeDocumentResponse.analyzeDocumentResult.pages[0].documentFields[step].fieldValue.value));
					obj[
						analyzeDocumentResponse.analyzeDocumentResult.pages[0].documentFields[
							step
						].fieldLabel.name
					] =
						analyzeDocumentResponse.analyzeDocumentResult.pages[0].documentFields[
							step
						].fieldValue.value;
					array.push(obj);
				}
				console.log('The value of the array is ----->');
				console.log(array);
				//var finalValue  = array.map(function(array) {
				//  return array['fieldLabel'] + ":" + array['fieldValue'] ;
				//});

				//const obj = Object.assign({},...array);
				var newarr = array.reduce(
					function (data, val) {
						Object.assign(data[0], val);
						return data;
					},
					[{}]
				);

				context.variable(output, newarr);
				context.keepTurn(true);
				context.transition('positive');
			} else {
				context.keepTurn(true);
				context.transition('negative');
			}
		} catch (error) {
			let responseError = error;
			if (!responseError.code) {
				responseError = {
					code: error.statusCode ? error.statusCode : 500,
					error: error.message,
				};
			}
			const errorMessage = 'Error detecting document.';
			context.reply(errorMessage);
			context.keepTurn(true);
			context.transition('error');
			//context.log("before done");

			throw responseError;
		}
	},
};
