//https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications
//https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens#set-up-our-node-application-(package-json)

const questionService = require('../../../modules/question/questionService');
const securityService = require('../../../modules/security/security')();
const ObjectID = require("mongodb").ObjectID;
const renderer = require("../../renderer/renderer")();
const email = require("../../email/email")();
var fs = require('fs');

module.exports = function() {
  const surveyReportTemplatePath = "./modules/reports/survey/surveyTemplate.html";

  var models = {
    createReport: async function(filter, tokenObj) {
      // data.userId
      // data.categoryId
      // questionService
// debugger;
      // console.log(filter);
      // console.log(tokenObj);

      // const question = await mongoQuery.collection('question').insert(data);

      const data = {};
      data.userInfo = await securityService.findOne({filter:{_id: ObjectID(tokenObj.id)}});

      // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
      data.userInfo.name = data.userInfo.firstName || data.userInfo.email;

      console.log(data.userInfo);
      data.reportData = await questionService.checkAnswersForCategory(filter,tokenObj);

      // console.log("reportData");
      // console.log(reportData);


      var htmlResult = renderer.render(surveyReportTemplatePath,data);
      // fs.writeFile('message.html', htmlResult, function (err) {
      //   if (err) throw err;
      //   console.log('It\'s saved! in same location.');
      // });

        email.sendEmail(
          {
            to: data.userInfo.email,
            bcc: "office@bestdeveloper.ro",
            subject:"Survey",
            body:htmlResult
          }
        );

      return htmlResult;

    }
  };
  return models;
}
