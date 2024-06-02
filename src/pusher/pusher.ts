// var Pusher = require("pusher");
import Pusher from "pusher"

var pusher = new Pusher({
  appId:  process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
});

export default pusher;