const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
exports.scheduledFunctionEndDay = functions.pubsub
  .schedule("59 23 * * *")
  .timeZone("Europe/Paris")
  .onRun((context) => {
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth();
    var year = today.getFullYear();

    admin
      .firestore()
      .collection("users")
      .get()
      .forEach((doc) => {
        admin
          .firestore()
          .collection("users")
          .doc(doc.id)
          .collection("calender")
          .doc(`${year}`)
          .collection(`${month}`)
          .doc(`${day}`)
          .get()
          .then((doc) => {
            if (doc.data().goal <= doc.data().waterIntake) {
              admin
                .firestore()
                .collection("users")
                .doc(doc.id)
                .update({
                  streak: FieldValue.Increment(1),
                });
            } else {
              admin.firestore().collection("users").doc(doc.id).update({
                streak: 0,
              });
            }
          });

        admin.firestore().collection("users").doc(doc.id).collection("calender").doc(`${year}`).collection(`${month}`).doc(`${day}`).update({ available: false });
      });
  });

exports.myFunction = functions.firestore.document("users/{userId}/calender/{yearId}/{monthId}/{dayId}").onUpdate((change, context) => {
  var today = new Date();
  var day = today.getDate();
  var month = today.getMonth();
  var year = today.getFullYear();
  console.log(change.after.data().goal, change.after.data().waterIntake);
  console.log(context.params.userId);

  if (change.after.data().goal <= change.after.data().waterIntake) {
    admin
      .firestore()
      .collection("users")
      .doc(context.params.userId)
      .collection("calender")
      .doc(context.params.yearId)
      .collection(context.params.monthId)
      .doc(context.params.dayId)
      .update({ achieved: true })
      .catch((err) => {
        console.log(err);
      });
    return 0;
  }
  return 1;
});

exports.waterIntake = functions.https.onCall(async (data, context) => {
  var today = new Date();
  var day = today.getDate();
  var month = today.getMonth();
  var year = today.getFullYear();
  let dataR = [];
  console.log(data.type, data.username, year, month, day - 1);

  // for (let i = 0; i < 7; i++) {
  //   admin
  //     .firestore()
  //     .collection("users")
  //     .doc("test")
  //     .collection("calender")
  //     .doc(`${year}`)
  //     .collection(`${month}`)
  //     .doc(`${day - i}`)
  //     .get()
  //     .then((doc) => {
  //       dataR[dataR.length] = doc.data();
  //       if (dataR.length === 7) {
  //         return { data: data };
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }
  // let result = admin
  //   .firestore()
  //   .collection("users")
  //   .doc("test")
  //   .collection("calender")
  //   .doc(`${year}`)
  //   .collection(`${month}`)
  //   .doc(`${day}`)
  //   .get()
  //   .then((doc) => {
  //     console.log(doc.data());
  //     return { data: doc.data() };
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // return result;

  function resolveAfterEnd() {
    return new Promise((resolve) => {
      for (let i = 0; i < 7; i++) {
        admin
          .firestore()
          .collection("users")
          .doc("test")
          .collection("calender")
          .doc(`${year}`)
          .collection(`${month}`)
          .doc(`${day - i}`)
          .get()
          .then((doc) => {
            dataR[dataR.length] = doc.data();
            console.log(dataR);
            if (dataR.length === 7) {
              resolve("succes");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  }
  async function f1() {
    const x = await resolveAfterEnd();
  }
  let result1 = f1().then(() => {
    console.log(dataR);
    return dataR;
  });

  return result1;
});

// exports.paypalCreateOrder = functions.https.onCall(async (data, context) => {
//   let bookDays = data.bookDays;
//   let total = 50 + 2 * (bookDays.length - 1) * (data.guestInfo.adults + data.guestInfo.kids);
//   function resolveAfterEnd() {
//     return new Promise((resolve) => {
//       bookDays.forEach((doc, i) => {
//         admin
//           .firestore()
//           .collection("calender")
//           .doc(`${doc.data.year}`)
//           .collection(doc.data.month)
//           .doc(`${doc.data.day}`)
//           .get()
//           .then((doc2) => {
//             total += doc2.data().price;

//             if (i === bookDays.length - 1) {
//               resolve(`${total} succes`);
//             }
//           })
//           .catch((err) => {
//             console.log(err);
//           });
//       });
//       // for (let i = 0; i < bookDays.length - 1; i++) {
//       //   total += bookDays[i].data.price;
//       //   if (i === bookDays.length - 2) {
//       //     resolve(`${total} succes`);
//       //   }
//       // }
//     });
//   }

//   async function f1() {
//     const x = await resolveAfterEnd();
//   }

//   let result1 = f1().then(() => {
//     let result2 = f2().then((res) => {
//       console.log(res);
//       return res;
//     });
//     return result2;
//   });
//   return result1;

//   async function f2() {
//     request.requestBody({
//       intent: "CAPTURE",
//       purchase_units: [
//         {
//           amount: {
//             currency_code: "EUR",
//             value: `${total}.00`,
//           },
//         },
//       ],
//     });
//     const response = await client.execute(request);
//     return response.result;
//   }
// });
