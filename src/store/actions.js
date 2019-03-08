import WebStorage from "web-storage-cache";
import FileSaver from "file-saver";
let myStorage = new WebStorage();

export default {
  // 登陆账号信息更新
  updateLoginUser({ commit }, payload) {
    new Promise((resolve, reject) => {
      let loginUser = myStorage.get('loginUser');
      if (payload.flag == 'login') {
        // 首次登陆
        myStorage.add('loginUser', payload.loginUser);
      } else if (payload.flag == 'password') {
        // 修改密码
        loginUser.password = payload.userPassword;
        myStorage.replace('loginUser', loginUser);
        myStorage.replace('user' + loginUser.id, loginUser);
        payload.loginUser = myStorage.get('loginUser');
      }
      resolve(payload);
    }).then(value => {
      commit('updateLoginUser', value);
    })
  },
  // 初始化账号信息
  initialUserNum({
    commit
  }, payload) {
    new Promise((resolve, reject) => {
      if (payload.userData) {
        // 本地存储没有数据从文件中读取数据
        myStorage.add("userNum", payload.userNum);
        payload.userData.forEach(el => {
          myStorage.set("user" + el.id, el);
        });
      } else {
        // 本地文件中有数据
        myStorage.replace("userNum", payload.userNum);
        // 将本地的数据存至vuex
        payload.userData = [];
        for (let i = 0; i < payload.userNum; i++) {
          payload.userData.push(myStorage.get('user' + i));
        }
      }
      resolve(payload);
    }).then(value => {
      commit("initialUserNum", value);
    });
  },
  // 增加账号
  changeUserNum({
    commit
  }, payload) {
    new Promise((resolve, reject) => {
      // 存入localStorage
      let userNum = payload.userNum + 1;
      let userNumStorage= myStorage.get(String(userNum));
      if (userNumStorage) {
        myStorage.replace("userNum", userNum);
      } else {
        myStorage.set("userNum", userNum)
      }
      myStorage.set("user" + payload.userNum, payload.userData);
      // 存入本地json文件
      let userAllData = [];
      for (let i = 0; i < userNum; i++) {
        userAllData.push(myStorage.get("user" + i));
      }
      let jsonData = JSON.stringify(userAllData);
      var file = new File([jsonData], {
        type: "text/plain;charset=utf-8"
      });
      setTimeout(() => {
        FileSaver.saveAs(file);
      }, 2000);

      resolve(payload);
    }).then(value => {
      commit("changeUserNum", value);
    });
  },
  // 初始化员工数量
  initialStaffNum({
    commit
  }, payload) {
    new Promise((resolve, reject) => {
      myStorage.add("staffNum", payload.staffNum);
      resolve(payload.staffNum);
    }).then(value => {
      commit("initialStaffNum", value);
    });
  },
  // 更改员工数量
  changeStaffNum({
    commit
  }, payload) {
    new Promise((resolve, reject) => {
      myStorage.replace("staffNum", payload.staffNum);
      resolve(payload.staffNum);
    }).then(value => {
      commit("changeStaffNum", value);
    });
  },
  // 初始化员工信息
  initialStaffData({
    commit
  }, payload) {
    new Promise((resolve, reject) => {
      resolve(payload.staffDatas);
    }).then(value => {
      commit("initialStaffData", value);
    });
  },
  // 更改员工信息
  changeStaffData({
    commit
  }, payload) {
    new Promise((resolve, reject) => {
      // 判断是添加员工信息还是更改
      if (payload.flag == 'add') {
        myStorage.set("staff" + payload.staffData.id, payload.staffData);
      } else if (payload.flag == 'change') {
        myStorage.replace("staff" + payload.staffData.id, payload.staffData);
      } else if (payload.flag == 'remove') {
        if (payload.deleteIndex) {
          // localstorage中删除staff数据
          console.log(payload.deleteIndex);
          payload.deleteIndex.forEach(value => {
            myStorage.delete("staff" + value);
          });
        }
      }
      resolve(payload);
    }).then(value => {
      commit("changeStaffData", value);
    });
  },
  // 更改当前显示的页面
  changeCurrentPage({
    commit
  }, payload) {
    commit("changeCurrentPage", payload.pageIndex);
  },

  // 更新当前员工考勤数据
  doAttendance({
    commit
  }, payload) {
    new Promise(resolve => {
      myStorage.set('currentStaffAttd', payload.staffAttendance);
      resolve(payload.staffAttendance);
    }).then(value => {
      commit('doAttendance', value);
    })
  }
};