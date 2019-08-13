<template>
  <div style="display: none;">
    <audio id="billVoiceBroadcast" :src="audioSrc" controls></audio>
  </div>
</template>

<script>
var client;

let vueExample = "";
function setVue(th) {
  vueExample = th;
}

function disconnectSocket() {
  // client.unsubscribe(topic);
  client.disconnect();
}

// 语音播报相关配置 end

//注册消息接收处理事件
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {

  }
}
function onMessageArrived(message) {
  playBillVoice(message);
}

function generateUUID() {
  var d = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
    c
  ) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == "x" ? r : (r & 0x7) | 0x8).toString(16);
  });
  return uuid;
}
/* mqtt连接end */

function voiceCommit() {
  vueExample.$store.commit("addorReduceNewsNumber", false);
  vueExample.$store.commit("addorReduceToastNumber", false);
}

function playBillVoice(message) {
  let msg = JSON.parse(message.payloadString).msg;
  let msg2 = JSON.parse(msg);
  let num = vueExample.$store.getters.GET_TOASTNUMBER;
  if (num <= 3) {
    vueExample.$store.commit("addorReduceToastNumber", true);
    vueExample.$notify({
      iconClass: "iconfont red icon-propaganda",
      title: msg2.title,
      dangerouslyUseHTMLString: true,
      message: msg2.body,
      duration: 0,
      onClose: voiceCommit()
    });
  }
  vueExample.$store.commit("addorReduceNewsNumber", true);
  var player = document.getElementById("billVoiceBroadcast");
  if (player.paused) {
    player.play();
  }
}

export default {
  data() {
    return {
      audioSrc: require("../../assets/voice/newPaymentBill.mp3")
    };
  },

  mounted() {
    setVue(this);
    if (client && client.isConnected()) {
      disconnectSocket();
    }
    this.initMqttClient();
  },

  methods: {
    clearMQTT() {
      if (client && client.isConnected()) {
        disconnectSocket();
      }
    },
    restMQTT() {
      if (client && client.isConnected()) {
        disconnectSocket();
      }
      this.initMqttClient();
    },
    initMqttClient(outHost, outPort) {
      // var hostname = "www.soeasypay.cn",
      let schoolNo = "";
      const modalType = this.getSStorage("accountModalType");
      if (modalType != "isGroup") {
        schoolNo = this.getSStorage("saas_currentSchool").schoolNo;
      }
      if (!schoolNo) {
        return
      }
      let userId = this.getSStorage("userDetail").userInfo.userId;
      let xysUserId = this.getSStorage("xysUserId");
      let whichNumber = "";
      if (userId) {
        whichNumber = userId;
      } else {
        whichNumber = xysUserId;
      }
      var hostname = window.location.host.indexOf('test') != -1 ? "test1.soeasypay.cn" : "www.soeasypay.cn",
        // var hostname = "www.soeasypay.cn",
        port = 443,
        clientId = "xys-" + generateUUID(),
        //275202
        // topic = 'xys-saas/' + scope.curUserInfo.schoolNo + '/' + scope.x .userNo + '/user';
        topic =
          "xys-saas/" +
          schoolNo + // 正式61010200000127 测试61011600000380
          "/" +
          whichNumber + // 5a28ade8171741192bac8c81 正式100001581 测试100010147
          "/user";
      // topic = "xys-saas/" + "123456" + "/" + "275202" + "/user";
      client = new Paho.MQTT.Client(hostname, port, clientId);
      client.onConnectionLost = onConnectionLost;
      client.onMessageArrived = onMessageArrived;
      var options = {
        invocationContext: {
          host: hostname,
          port: port,
          path: client.path,
          clientId: clientId
        },
        timeout: 5,
        keepAliveInterval: 100,
        cleanSession: false,
        reconnect: true,
        useSSL: true,
        onSuccess: function() {
          // 连接服务器并注册连接成功处理事件
          client.subscribe(topic);
        },
        onFailure: function(e) {

        }
      };
      client.connect(options);
    }
  }
};
</script>

<style></style>