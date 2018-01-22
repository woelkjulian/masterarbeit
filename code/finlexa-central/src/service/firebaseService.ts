import * as admin from "firebase-admin";

export class FirebaseService {

  private static instance: FirebaseService;

  constructor() {}
  
  static get Instance() {
    if (this.instance === null || this.instance === undefined) {
      this.instance = new FirebaseService();

      /*
      FOLOOWING VALUES WERE REMOVED TO PROTECT PROTECTED FIREBASE DATA
      */
      admin.initializeApp({
        credential: admin.credential.cert({
            projectId: "firebase_projectId",
            clientEmail: "firebase_clientemail_string",
            privateKey: "firebase_private_key",
        }),
        databaseURL: "firebaseURL"
      });    
    }
    return this.instance;
  }

  sendMessage(token: string, title: string, body: string, type: string, requestId: string) {    
  // See the "Defining the message payload" section below for details
  // on how to define a message payload.
  var payload = {
    notification: {
      title: title,
      body: body     
    },
    data: {
      type: type,
      requestId: requestId
    }
  };
  // Send a message to the device corresponding to the provided
  // registration token.
  admin.messaging().sendToDevice(token, payload).then(function(response) {
    // See the MessagingDevicesResponse reference documentation for
    // the contents of response.
    console.log("Successfully sent message:", response);
    })
    .catch(function(error) {
    console.log("Error sending message:", error);
    }); 
  }
}


